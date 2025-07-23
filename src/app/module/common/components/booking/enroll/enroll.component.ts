import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { NgxCaptchaModule } from 'ngx-captcha';
import { BookingService } from '../../../../../_core/http/api/booking.service';
import { CountryService } from '../../../../../_core/http/api/country.service';
import { MmdCenterService } from '../../../../../_core/http/api/mmdCenter.service';
import { SeoService } from '../../../../../_core/services/seo.service';
import { UserLoginService } from '../../../../../_core/services/userLogin.service';
import { PaymentStatusComponent } from '../../../../../_shared/components/confirm-payment/confirm.compoent';

@Component({
  selector: 'app-enroll-for-class',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './enroll.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatStepperModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    PaymentStatusComponent,
    MatRadioModule,
    NgxCaptchaModule,
  ],
})
export class EnrollClassComponent {
  constructor(
    private readonly seoService: SeoService,
    private readonly route: Router,
    private readonly bookingService: BookingService,
    private readonly countryService: CountryService,
    private readonly mmdCenterService: MmdCenterService,
    private readonly userLoginService: UserLoginService
  ) {}
  selectedDialCode: string = '+91';
  selectedSignalDialCode: string = '+91';
  selectedDates: Date[] = [];
  selectedClassType: string = 'normal';
  dateSelectionControl = new FormControl('');
  paymentMethod: any;

  countries = [
    { name: 'India', code: 'IN', dialCode: '+91' },
    { name: 'United States', code: 'US', dialCode: '+1' },
    { name: 'United Kingdom', code: 'UK', dialCode: '+44' },
  ];

  mmdCentres: any;

  public normalForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    amount: new FormControl(''),
    paidDate: new FormControl(''),
    paymentMethod: new FormControl(''),
    status: new FormControl(''),
    bookingDate: new FormControl(''),
    userId: new FormControl(null),
  });

  public normalFormFeePaid: FormGroup = new FormGroup({
    paidDate: new FormControl('', Validators.required),
    paymentMethod: new FormControl('', Validators.required),
  });

  public mmdSignalForm: FormGroup = new FormGroup({
    userId: new FormControl(''),
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    examDate: new FormControl('', Validators.required),
    mmdCenterId: new FormControl(2),
    mmdCenterName: new FormControl('', Validators.required),
    status: new FormControl(''),
    bookingDate: new FormControl(''),
    amount: new FormControl(''),
    paidDate: new FormControl(''),
    paymentMethod: new FormControl(''),
  });

  public country: any;
  public userInfo: any;
  ngOnInit(): void {
    this.country = this.countryService.country.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    this.mmdCenterService.getMmdCenter().subscribe({
      next: (respo) => {
        this.mmdCentres = respo;
      },
      error: () => {},
    });
    this.userLoginService.userInfo$.subscribe((user) => {
      this.userInfo = user;
    });
    this.normalForm.patchValue({
      name: this.userInfo.userName,
      email: this.userInfo.userEmail,
      phone: this.userInfo.phone,
      country: this.userInfo.country,
      userId: this.userInfo.userId,
    });
    this.mmdSignalForm.patchValue({
      name: this.userInfo.userName,
      email: this.userInfo.userEmail,
      phone: this.userInfo.phone,
      country: this.userInfo.country,
      userId: this.userInfo.userId,
    });
    this.mmdSignalForm.get('userId')?.setValue(this.userInfo.userId);

    this.seoService.updateMetaTags({
      title: 'Morse Monk - Enroll for class',
      description:
        'Morse Monk is a platform that helps you learn Morse Code in a fun and interactive way. Whether you are a beginner or an advanced learner, Morse Monk has got you covered.',
      keywords:
        'Morse, Online, Interactive, Classes, Lesson, MMD signal exam, Ham radio exam, Morse visual signal, Reception, Tool for sending morse message',
    });
  }

  get currentForm(): FormGroup {
    return this.selectedClassType === 'normal'
      ? this.normalForm
      : this.mmdSignalForm;
  }

  public addSelectedDate(event: any) {
    const date: Date = event.value;
    if (
      date &&
      this.selectedDates.length < 5 &&
      !this.selectedDates.some((d) => d.toDateString() === date.toDateString())
    ) {
      this.selectedDates.push(date);
      this.dateSelectionControl.setValue('');
    }
  }

  public removeSelectedDate(index: number) {
    this.selectedDates.splice(index, 1);
  }

  public isCurrentStepValid(): boolean {
    if (this.selectedClassType === 'normal') {
      return this.normalForm.valid;
    } else {
      return this.mmdSignalForm.valid;
    }
  }

  uploadedFileName: string = '';
  isFileUploaded: boolean = false;
  isPaymentDone: boolean = false;
  isLoading: boolean = false;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadedFileName = file.name;
    }
  }
  onPaymentMethodChange(event: any): void {
    this.paymentMethod = event.value;
    if (this.paymentMethod == 'paid') {
      this.isFileUploaded = true;
    } else {
      this.isFileUploaded = false;
    }
  }

  captchaResponse: string = '';

  onCaptchaResolved(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
  }

  public onSubmit(event: Event) {
    const amount = this.normalForm.value.country === 'India' ? 2500 : 40;
    if (this.selectedClassType === 'normal') {
      this.normalForm.patchValue({
        ...this.normalForm.value,
        amount: this.normalForm.value.country === 'India' ? 2500 : 40,
        paidDate: this.normalFormFeePaid.value.paidDate,
        paymentMethod: this.normalFormFeePaid.value.paymentMethod,
      });
      this.normalForm.get('bookingDate')?.setValue(new Date());
      this.normalForm.get('status')?.setValue('pending');
      this.postBooking(event, this.normalForm.value);
    } else {
      this.mmdSignalForm.patchValue({
        ...this.mmdSignalForm.value,
        amount: 1500,
        paidDate: this.normalFormFeePaid.value.paidDate,
        paymentMethod: this.normalFormFeePaid.value.paymentMethod,
      });
      this.mmdSignalForm.get('bookingDate')?.setValue(new Date());

      this.mmdSignalForm.get('status')?.setValue('pending');
      this.postBooking(event, this.mmdSignalForm.value);
    }
  }

  public postBooking(event: any, form: any) {
    this.bookingService.postBooking(form).subscribe({
      next: (response) => {
        event.preventDefault();
        this.isPaymentDone = true;
        this.isLoading = false;
        this.normalForm.reset();
        this.mmdSignalForm.reset();
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  public navigateToLogin() {
    const returnUrl = this.route.url; // gets current route
    this.route.navigate(['/login'], { queryParams: { returnUrl } });
  }
}
