import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NavigationStart, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { subscribe } from 'diagnostics_channel';
import { SubscriptionService } from '../../../../../_core/http/api/subscription.service';
interface ToneSegment {
  start: number;
  duration: number;
}

@Component({
  selector: 'app-integrator-messanger',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './integrator-messanger.component.html',
})
export class IntegratorMessangerComponent implements OnInit {
  public integratorSevice = inject(SubscriptionService);
  public router = inject(Router);
  public userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '');
  flashActive: boolean = false;
  audioCtx: AudioContext | null = null;
  oscillator: OscillatorNode | null = null;
  recordingStartedAt: number = 0;
  currentStartTime: number = 0;
  toneSegments: ToneSegment[] = [];
  toneActive = false;
  recordingStart = 0;
  toneStartTime = 0;
  selectedUser: any = null;
  showModal: boolean = false;
  audioUrl = '';
  isRecording = false;
  mediaRecorder: any;
  audioChunks: Blob[] = [];
  private navSub!: Subscription;
  private platformId = inject(PLATFORM_ID);
  constructor(private route: Router, private cdr: ChangeDetectorRef) {
    this.navSub = this.route.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.isRecording || this.audioUrl != '') {
          const message =
            '⚠️ You are recording or have unsaved audio. Leaving will delete your Morse code. Do you want to proceed?';
          if (confirm(message)) {
            this.closeModal();
          } else {
            this.route.navigate([location.pathname]);
          }
        }
      }
    });
  }
  //prevent page reload
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    if (this.isRecording || this.audioUrl != '') {
      event.preventDefault();
      event.returnValue =
        'You are recording. Leaving now will delete the unsaved Morse code.';
    }
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Control' && !this.toneActive && this.audioUrl === '') {
      this.startTone();
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Control' && this.toneActive) {
      this.stopTone();
    }
  }
  ngOnInit() {
    this.integratorSevice
      .isSubscriptionActive(this.userInfo?.userId)
      .subscribe({
        next: () => {},
        error: () => {
          this.route.navigate(['/']);
        },
      });
  }
  users = [
    {
      name: 'Alice Monk',
      country: 'India',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      name: 'Ethan Sage',
      country: 'USA',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      name: 'Liu Chen',
      country: 'China',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      name: 'Amina Noor',
      country: 'UAE',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    {
      name: 'Carlos Rivera',
      country: 'Mexico',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
  ];
  countries = ['India', 'USA', 'China', 'UAE', 'Mexico'];
  selectedCountry = '';

  // filename form
  public fileNameForm: FormGroup = new FormGroup({
    fileName: new FormControl('morse_message'),
  });
  filteredUsers() {
    return this.selectedCountry
      ? this.users.filter((u) => u.country === this.selectedCountry)
      : this.users;
  }

  openRecorderModal(user: any) {
    this.selectedUser = user;
  }
  public confirmCloseModal() {
    const message =
      '⚠️ You are recording or have unsaved audio. Closing will delete your Morse code. Do you want to proceed?';
    const shouldWarn =
      this.isRecording ||
      (this.audioUrl !== null &&
        this.audioUrl !== undefined &&
        this.audioUrl !== '');

    if (shouldWarn) {
      if (confirm(message)) this.closeModal();
    } else {
      this.closeModal();
    }
  }
  closeModal() {
    // Stop any ongoing tone
    if (this.toneActive) {
      this.stopTone();
    }

    // Stop and close audio context if recording
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }

    // Reset all recording state
    this.selectedUser = null;
    this.audioUrl = '';
    this.audioChunks = [];
    this.toneSegments = [];
    this.isRecording = false;
    this.mediaRecorder = null;
    this.oscillator = null;
  }

  toggleRecording() {
    if (this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    } else {
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            sampleRate: 44100,
          },
        })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus',
          });
          this.mediaRecorder.start();
          this.audioChunks = [];
          this.isRecording = true;

          this.mediaRecorder.ondataavailable = (e: any) =>
            this.audioChunks.push(e.data);
          this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
            this.audioUrl = URL.createObjectURL(blob);
            this.cdr.detectChanges();
          };
        });
    }
  }

  sendToUser() {
    const whatsappUrl = `https://wa.me/918606927326`;
    window.open(whatsappUrl, '_blank');
  }

  //  downloadAudio() {
  //     if (this.audioUrl) {
  //       const a = document.createElement('a');
  //       a.href = this.audioUrl;
  //       a.download = 'voice-message.webm';
  //       a.click();
  //     }
  //   }

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

  showDownload: boolean = false;
  async downloadAudio() {
    this.showDownload = true;
    if (!this.audioUrl) {
      console.warn('No audio URL available to download.');
      window.alert(
        'No audio available to download. Please record a message first.'
      );
      return;
    }

    let tempAudioContext: AudioContext | null = null; // Declare a temporary AudioContext
    try {
      // 1. Fetch the existing WAV audio blob from the URL
      const response = await fetch(this.audioUrl);
      const wavBlob = await response.blob();

      // 2. Decode the WAV blob into an AudioBuffer
      // Create a new AudioContext for decoding
      tempAudioContext = new AudioContext();
      const arrayBuffer = await wavBlob.arrayBuffer();
      const audioBuffer = await tempAudioContext.decodeAudioData(arrayBuffer);

      // 3. Set up a graph in a real AudioContext to capture the stream
      const source = tempAudioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Create a MediaStreamDestinationNode from the real AudioContext
      const destination = tempAudioContext.createMediaStreamDestination();
      source.connect(destination);

      // 4. Use MediaRecorder to encode the MediaStream to WebM (Opus)
      const mediaRecorder = new MediaRecorder(destination.stream, {
        mimeType: 'audio/webm;codecs=opus', // Specify WebM with Opus codec for compression
      });

      const compressedChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          compressedChunks.push(event.data);
        }
      };

      // Create a Promise to handle the asynchronous MediaRecorder process
      const downloadPromise = new Promise<void>((resolve, reject) => {
        mediaRecorder.onstop = () => {
          const compressedBlob = new Blob(compressedChunks, {
            type: 'audio/webm',
          });
          const downloadUrl = URL.createObjectURL(compressedBlob);

          // Create a temporary anchor element to trigger the download
          const a = document.createElement('a');
          a.href = downloadUrl;
          const fileName =
            this.fileNameForm.get('fileName')?.value || 'morse_message';
          a.download = `${fileName}.webm`; // Set filename with .webm extension
          document.body.appendChild(a); // Append to body to ensure it's clickable
          a.click();
          document.body.removeChild(a); // Clean up the element
          URL.revokeObjectURL(downloadUrl); // Release the object URL
          resolve();
        };
        mediaRecorder.onerror = (event) => {
          console.error('MediaRecorder error during compression:', event);
          reject(event);
        };
      });

      // Start the MediaRecorder and the audio source
      mediaRecorder.start();
      source.start();

      // Stop MediaRecorder when the audio source finishes playing
      source.onended = () => {
        mediaRecorder.stop();
        // The tempAudioContext will be closed in the finally block
      };

      // Ensure the audio context is resumed if it's suspended (common in browsers)
      if (tempAudioContext.state === 'suspended') {
        await tempAudioContext.resume();
      }

      // Wait for the download to complete
      await downloadPromise;
    } catch (error) {
      console.error('Error during audio compression and download:', error);
      window.alert('Failed to compress and download audio. Please try again.');
    } finally {
      // Ensure the temporary AudioContext is closed to release resources
      if (tempAudioContext) {
        tempAudioContext.close();
      }
      this.showDownload = false;
    }
  }
  public newMessage() {
    const message = confirm(
      'Download your previous message? Leaving will delete your Morse code. Do you want to proceed? '
    );
    if (message) {
      this.closeModal();
    }
  }
  //flash button
  @ViewChild('audioRef') audioRef!: ElementRef<HTMLAudioElement>;
  private flashTimeouts: any[] = [];

  onAudioPlay() {
    if (!this.audioRef || !this.toneSegments.length) return;

    const audio = this.audioRef.nativeElement;
    const audioStart = performance.now();
    this.clearFlashTimeouts();

    this.toneSegments.forEach((segment) => {
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
    this.flashTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.flashTimeouts = [];
  }
  sendMail() {
    if (!this.audioUrl) {
      alert(
        'No audio available to send. Please record and download the audio first.'
      );
      return;
    }
    const userSuffix = this.fileNameForm.get('fileName')?.value?.trim() || '';
    const fileName = `morse_message_${userSuffix}.wav`;

    const subject = encodeURIComponent('Morse Code Audio Message');
    const body = encodeURIComponent(
      `Hi,\n\nI've attached the Morse code audio message.\nPlease find it in the attachment.\n\n`
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  }

  sendViaWhatsApp() {
    if (!this.audioUrl) {
      alert(
        'No audio available to send. Please record and download the audio first.'
      );
      return;
    }
    const userSuffix = this.fileNameForm.get('fileName')?.value?.trim() || '';
    const fileName = `morse_message_${userSuffix}.wav`;

    const message = encodeURIComponent(
      `Hi! I've recorded a Morse code message. Please see the attached audio file`
    );

    // Open WhatsApp Web without a phone number – user will choose contact manually
    const whatsappUrl = `https://web.whatsapp.com/send?text=${message}`;
    window.open(whatsappUrl, '_blank');

    alert(
      `WhatsApp Web is opening. Please attach the audio file (${fileName}.wav) manually in the chat before sending.`
    );
  }
  ngOnDestroy() {
    if (this.navSub) this.navSub.unsubscribe();
  }
}
