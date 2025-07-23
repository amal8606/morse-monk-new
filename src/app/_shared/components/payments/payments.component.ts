import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PaymentStatusComponent } from '../confirm-payment/confirm.compoent';
import { ActivatedRoute } from '@angular/router';
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
  ],
})
export class PaymentComponent {
  uploadedFileName: string = '';
  isPaymentDone: boolean = false;
  public paymentAmount: number = 0;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly subscriptionService: SubscriptionService,
    private readonly userService: UserService
  ) {}
  public normalForm: FormGroup = new FormGroup({
    userId: new FormControl(''),
    status: new FormControl(''),
    duration: new FormControl(''),
    amount: new FormControl(''),
    paidDate: new FormControl('', Validators.required),
    paymentMethod: new FormControl('', Validators.required),
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

  submitPayment(): void {
    this.normalForm.get('userId')?.setValue(this.loggedUserId);
    this.normalForm.get('duration')?.setValue(this.duration);
    this.normalForm.get('status')?.setValue('pending');
    this.normalForm.get('amount')?.setValue(this.paymentAmount);

    this.subscriptionService.postSubscription(this.normalForm.value).subscribe({
      next: () => {
        this.isPaymentDone = true;
      },
      error: () => {},
      complete: () => {},
    });
  }
}
