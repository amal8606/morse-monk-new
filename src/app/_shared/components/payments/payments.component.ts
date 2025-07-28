import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PaymentStatusComponent } from '../confirm-payment/confirm.compoent';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SubscriptionService } from '../../../_core/http/api/subscription.service';
import { UserService } from '../../../_core/http/api/user.service';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha-2';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ReCaptchaService } from '../../../_core/http/api/reCaptcha.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payments.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaymentStatusComponent,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgxCaptchaModule,
  ],
})
export class PaymentComponent {
  uploadedFileName: string = '';
  isPaymentDone: boolean = false;
  public paymentAmount: number = 0;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly routes: Router,
    private readonly subscriptionService: SubscriptionService,
    private readonly userService: UserService,
    private readonly reCaptchaService: ReCaptchaService
  ) {}
  public normalForm: FormGroup = new FormGroup({
    userId: new FormControl(''),
    status: new FormControl(''),
    duration: new FormControl(''),
    amount: new FormControl(''),
    paidDate: new FormControl('', Validators.required),
    paymentMethod: new FormControl('gpay', Validators.required),
  });

  duration: any;
  public loggedUserId: any;
  loggedUser: any;
  ngOnInit(): void {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    this.loggedUserId = userInfo.userId;
    this.route.queryParams.subscribe((params) => {
      const amount = +params['amount']; // Convert to number immediately
      this.paymentAmount = amount;

      if (amount === 399 || amount === 7) {
        this.duration = 3;
      } else if (amount === 699 || amount === 11) {
        this.duration = 6;
      } else {
        this.duration = 12;
      }
    });
    this.userService.getUser(this.loggedUserId).subscribe({
      next: (respo) => {
        this.loggedUser = respo;
      },
    });
  }

  captchaToken: string = '';

  siteKey: string = '6LcVd44rAAAAACGim4Lov0toCQXWllvM2y7K7VI9';
  onCaptchaResolved(event: any) {
    if (typeof grecaptcha !== 'undefined') {
      grecaptcha.ready(() => {
        grecaptcha
          .execute(this.siteKey, {
            action: 'submit',
          })
          .then((token: string) => {
            console.log('token', token);
            this.captchaToken = token;
          });
      });
    } else {
      console.error('reCaptcha script not loaded');
    }
  }

  verifyToken() {
    if (!this.captchaToken) {
      alert('CAPTCHA not comleted');
    }
    this.reCaptchaService.postReCaptcha(this.captchaToken).subscribe({
      next: (response: any) => {
        console.log('Verification success:', response);
      },
      error: (error: any) => {
        alert('Form submitted failed');
      },
    });
  }

  submitPayment(): void {
    this.normalForm.get('userId')?.setValue(this.loggedUserId);
    this.normalForm.get('duration')?.setValue(this.duration);
    this.normalForm.get('status')?.setValue('pending');
    this.normalForm.get('amount')?.setValue(this.paymentAmount);

    this.subscriptionService.postSubscription(this.normalForm.value).subscribe({
      next: () => {
        this.isPaymentDone = true;
        this.routes.navigate(['/']);
      },
      error: () => {},
      complete: () => {},
    });
  }
}
