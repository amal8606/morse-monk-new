import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../_core/http/api/user.service';
import { SeoService } from '../../../../_core/services/seo.service';
import { UserLoginService } from '../../../../_core/services/userLogin.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],

  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
   public returnUrl: any;
   otpForm: FormGroup;
  message: string = '';
  isSubmitting = false;
  resendDisabled = true;
  countdown = 30;
  timer: any;
  public fogetPassword:boolean=false;
  constructor(
    private readonly seoService: SeoService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly userLoginService: UserLoginService,
    private route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private fb: FormBuilder, private http: HttpClient
  ) {
     this.otpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    });
  }

  public normalForm: FormGroup = new FormGroup({
    emailOrNumber: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    deviceType: new FormControl(''), // will be set on init
  });
 
  ngOnInit(): void {
    // Set SEO
    this.returnUrl =
      this.route?.snapshot?.queryParamMap.get('returnUrl') ??'';
      this.seoService.updateMetaTags({
        title: 'Morse Monk - Login',
        description:
          'Morse Monk is a platform that helps you learn Morse Code in a fun and interactive way.',
        keywords:
          'Morse, Online, Interactive, Classes, MMD signal exam, Ham radio exam, Morse visual signal, Reception',
      });

    const deviceType = this.getDeviceType();
    this.normalForm.get('deviceType')?.setValue(deviceType);
  }

  private getDeviceType(): string {
    const nav = navigator as any;

    if (nav.userAgentData) {
      const platform = nav.userAgentData.platform;
      const mobile = nav.userAgentData.mobile;
      return `${platform} - ${mobile ? 'Mobile' : 'Desktop'}`;
    } else {
      return navigator.userAgent;
    }
  }

  public login() {
    this.userService.login(this.normalForm.value).subscribe({
      next: (respo) => {
        this.toastr.success('Login successfully', 'Welcome Back!');

        this.userLoginService.setUserInfo(respo);
        if(respo?.role === 'admin') {
          console.log("admin",respo.role)
          this.router.navigate(['/admin']);
        }
        else if(this.returnUrl!=''){
          this.router.navigate([this.returnUrl]);
        }
        else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.toastr.error("Invalid username or password")
        console.error('Login failed:', err);
      },
    });
  }
  onLoginSuccess() {
    this.router.navigateByUrl(this.returnUrl);
  }
   sendOtp() {
    const email = this.otpForm.get('email')?.value;
    this.startResendTimer();
    this.http.post('/api/send-otp', { email }).subscribe({
      next: () => this.message = 'OTP sent to your email.',
      error: () => this.message = 'Failed to send OTP.'
    });
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;

    this.isSubmitting = true;
    const { email, otp } = this.otpForm.value;

    this.http.post('/api/verify-otp', { email, otp }).subscribe({
      next: () => {
        this.message = 'OTP verified successfully.';
        this.isSubmitting = false;
      },
      error: () => {
        this.message = 'Invalid or expired OTP.';
        this.isSubmitting = false;
      }
    });
  }
   startResendTimer() {
    this.resendDisabled = true;
    this.countdown = 30;

    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.resendDisabled = false;
        clearInterval(this.timer);
      }
    }, 1000);
  }
}
