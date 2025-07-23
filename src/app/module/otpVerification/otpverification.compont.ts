import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../_core/services/seo.service';
import { UserService } from '../../_core/http/api/user.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLoginService } from '../../_core/services/userLogin.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-otpVerification',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],

  templateUrl: './otpVerification.component.html',
})
export class OtpVerificationComponent implements OnInit {
   public returnUrl: any;
   otpForm: FormGroup;
  message: string = '';
  isSubmitting = false;
  resendDisabled = true;
  countdown = 30;
  updateModal:boolean=false;
  timer: any;
  public user:any;
  isLoading: boolean = false;
   showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  public formData: any;
  wrongPassword: any;
  registrationForm!: FormGroup;
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
      this.route.snapshot.queryParamMap.get('returnUrl') ||
      this.seoService.updateMetaTags({
        title: 'Morse Monk - Login',
        description:
          'Morse Monk is a platform that helps you learn Morse Code in a fun and interactive way.',
        keywords:
          'Morse, Online, Interactive, Classes, MMD signal exam, Ham radio exam, Morse visual signal, Reception',
      });

    const deviceType = this.getDeviceType();
    this.normalForm.get('deviceType')?.setValue(deviceType);
     this.registrationForm = this.fb.group(
      {
       
        passwordHash: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
     
        
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
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



   sendOtp() {
    const email = this.otpForm.get('email')?.value;
    this.startResendTimer();
    this.userService.CreateOtp(email).subscribe({
      next: () => this.message = 'OTP sent to your email.',
      error: () => this.message = 'Failed to send OTP.'
    });
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;

    this.isSubmitting = true;
    const { email, otp } = this.otpForm.value;

    this.userService.VerifyOtp(email, otp).subscribe({
      next: (res) => {
this.user=res;
        this.message = 'OTP verified successfully.';
        this.isSubmitting = false;
        setTimeout(() => {
            this.updateModal=true;
        }, 2000);
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
   togglePasswordVisibility(field: string): void {
    if (field === 'passwordHash') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }

    const formControl = this.registrationForm.get(field);
    if (formControl) {
      formControl.setValue(formControl.value);
    }
  }
    passwordMatchValidator(
      control: AbstractControl
    ): { [key: string]: boolean } | null {
      const passwordHash = control.get('passwordHash');
      const confirmPassword = control.get('confirmPassword');
  
      if (
        passwordHash &&
        confirmPassword &&
        passwordHash.value !== confirmPassword.value
      ) {
        return { passwordMismatch: true };
      }
  
      return null;
    }
   onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.wrongPassword = this.passwordMatchValidator;

      return;
    }
    this.wrongPassword = false;

   this.user.passwordHash=this.registrationForm?.get("passwordHash")?.value;
    this.isLoading = true;
    this.userService.editUser(this.user).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success('password updated Successfully..');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('error updating password');
          this.isLoading = false;
        }
      },
    });
  }

}
