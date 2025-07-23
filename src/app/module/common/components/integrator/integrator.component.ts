import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../_core/http/api/user.service';
import { UserLoginService } from '../../../../_core/services/userLogin.service';
interface ToneSegment {
  start: number;
  duration: number;
}
@Component({
  selector: 'app=integrator',
  templateUrl: './integrator.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class IntegratorComponent {
  constructor(
    private route: Router,
    private readonly userService: UserService,
    private readonly userLoginService: UserLoginService,
     private cdr: ChangeDetectorRef
  ) {}
  public amount?: number;
  selectedPlan: number = 6;
  audioUrl = '';
  ngOnInit() {
    this.userLoginService.userInfo$.subscribe((user) => {
      this.userInfo = user;
    });
    this.amount = this.userInfo.country === 'India' ? 699 : 11;
    console.log(this.userInfo);
  }
  public navigateTo() {
    if (this.userInfo.userId == null) {
      const returnUrl = this.route.url; // gets current route
      this.route.navigate(['/login'], { queryParams: { returnUrl } });
    } else {
      this.route.navigate(['/payment'], {
        queryParams: {
          amount: this.amount?.toString(),
          plan: this.selectedPlan.toString(),
        },
      });
    }
  }

  public choosePlan(amount: number, plan: any) {
    this.amount = amount;
    this.selectedPlan = plan;
  }

  public userInfo: any;
  isRecording = false;
  audioCtx: AudioContext | null = null;
  recordingStart = 0;
  toneSegments: ToneSegment[] = [];
  toneActive = false;
  toneStartTime = 0;
  oscillator: OscillatorNode | null = null;

  startTone() {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
      this.recordingStart = this.audioCtx.currentTime;
      this.toneSegments = [];
      this.isRecording = true;
    }

    if (!this.toneActive) {
      this.toneStartTime = this.audioCtx.currentTime - this.recordingStart;
      this.toneActive = true;

      this.oscillator = this.audioCtx.createOscillator();
      this.oscillator.type = 'sine';
      this.oscillator.frequency.setValueAtTime(500, this.audioCtx.currentTime);
      this.oscillator.connect(this.audioCtx.destination);
      this.oscillator.start();
    }
  }
  stopTone() {
    if (this.audioCtx && this.toneActive) {
      const toneEndTime = this.audioCtx.currentTime - this.recordingStart;
      const duration = toneEndTime - this.toneStartTime;
      if (duration > 0.01) {
        this.toneSegments.push({ start: this.toneStartTime, duration });
      }
      this.toneActive = false;

      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
    }
  }

  async stopRecording() {
    this.stopTone();
    if (!this.audioCtx || this.toneSegments.length === 0) {
      if (this.audioCtx) {
        this.audioCtx.close();
        this.audioCtx = null;
      }
      this.isRecording = false;
      return;
    }

    // Use current audio context's sample rate
    const sampleRate = this.audioCtx.sampleRate;
    const totalDuration =
      Math.max(...this.toneSegments.map((s) => s.start + s.duration)) + 0.5;
    const length = Math.ceil(totalDuration * sampleRate);

    // Create buffer directly
    const buffer = this.audioCtx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // Initialize with silence
    data.fill(0);

    // Generate tones directly in buffer
    this.toneSegments.forEach((segment) => {
      const startSample = Math.floor(segment.start * sampleRate);
      const durationSamples = Math.floor(segment.duration * sampleRate);

      for (let i = 0; i < durationSamples; i++) {
        const idx = startSample + i;
        if (idx >= data.length) break;

        // Calculate time relative to SEGMENT start
        const t = i / sampleRate;
        data[idx] = 0.5 * Math.sin(2 * Math.PI * 500 * t);
      }
    });

    // Convert to WAV
    try {
      const blob = await this.bufferToWaveBlob(buffer);
      this.audioUrl = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      // Cleanup
      this.audioCtx.close();
      this.audioCtx = null;
      this.isRecording = false;
    }
  }

  async bufferToWaveBlob(buffer: AudioBuffer): Promise<Blob> {
    const length = buffer.length * 2 + 44;
    const view = new DataView(new ArrayBuffer(length));
    const channels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bitsPerSample = 16;
    const blockAlign = (channels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    let offset = 0;
    const writeString = (s: string) => {
      for (let i = 0; i < s.length; i++)
        view.setUint8(offset++, s.charCodeAt(i));
    };

    writeString('RIFF');
    view.setUint32(offset, length - 8, true);
    offset += 4;
    writeString('WAVE');
    writeString('fmt ');
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint16(offset, channels, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, byteRate, true);
    offset += 4;
    view.setUint16(offset, blockAlign, true);
    offset += 2;
    view.setUint16(offset, bitsPerSample, true);
    offset += 2;
    writeString('data');
    view.setUint32(offset, length - 44, true);
    offset += 4;

    const input = buffer.getChannelData(0);
    for (let i = 0; i < input.length; i++, offset += 2) {
      const sample = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, sample * 0x7fff, true);
    }

    return new Blob([view.buffer], { type: 'audio/wav' });
  }
   @ViewChild('audioRef') audioRef!: ElementRef<HTMLAudioElement>;
  private flashTimeouts: any[] = [];
  flashActive:boolean=false;
  
  onAudioPlay() {
    if (!this.audioRef || !this.toneSegments.length) return;
  
    const audio = this.audioRef.nativeElement;
    const audioStart = performance.now();
    this.clearFlashTimeouts();
  
    this.toneSegments.forEach(segment => {
      const segmentStart = segment.start * 1000;
      const segmentEnd = segmentStart + segment.duration * 1000;
  
      const flashOn = setTimeout(() => {
        this.flashActive = true;
        this.cdr.detectChanges();
      }, segmentStart);
  
      const flashOff = setTimeout(() => {
        this.flashActive = false;
        this.cdr.detectChanges();
      }, segmentEnd);
  
      this.flashTimeouts.push(flashOn, flashOff);
    });
  }
  
  onAudioPause() {
    this.flashActive = false;
    this.clearFlashTimeouts();
    this.cdr.detectChanges();
  }
  
  clearFlashTimeouts() {
    this.flashTimeouts.forEach(timeout => clearTimeout(timeout));
    this.flashTimeouts = [];
  }
}
