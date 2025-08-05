import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
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
    private readonly reCaptchaService: ReCaptchaService,
     @Inject(PLATFORM_ID) private platformId: Object
  ) {
    
  }
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
  isBrowser: boolean = false;
  ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
    this.isBrowser = true;
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
  }

  captchaToken: string = '';

  siteKey: string = '6LeaK5srAAAAAI4faW-JVN725LmwbYVPN7loFwUr';
  onCaptchaResolved(event: any) {
    console.log('Captcha resolved:', event);
    if(event){
      
      // this.captchaToken = !this.captchaToken;
      this.verifyToken(event);
    }
  }
    verifyToken(token:any) {
this.captchaToken=token;
  }
   public onSubmit() {
  this.reCaptchaService.postReCaptcha(this.captchaToken).subscribe({
      next: (response: any) => {
this.submitPayment();
      },
      error: (error: any) => {
         alert('Captcha required..');
      
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
        //this.routes.navigate(['/']);
      },
      error: () => {},
      complete: () => {},
    });
  }
}
