import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import * as countries from 'i18n-iso-countries';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { BookingService } from '../../../../../_core/http/api/booking.service';
import { CountryService } from '../../../../../_core/http/api/country.service';
import { SeoService } from '../../../../../_core/services/seo.service';
@Component({
  selector: 'app-demo-booking',
  templateUrl: './demo-booking.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOption,
    MatSelectModule,
  ],
})
export class DemoBookingComponent {
  countries = [
    { name: 'India', code: 'IN', dialCode: '+91' },
    { name: 'United States', code: 'US', dialCode: '+1' },
    { name: 'United Kingdom', code: 'UK', dialCode: '+44' },
  ];
  public confirm: boolean = false;
  constructor(
    private readonly seoService: SeoService,
    private readonly bookingService: BookingService,
    private readonly countryService: CountryService
  ) {}
  isLoading: boolean = false;

  public normalForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    status: new FormControl('pending'),
    bookingDate: new FormControl(new Date()),
  });
  public country: any;

  ngOnInit(): void {
    this.country = this.countryService.country.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    this.seoService.updateMetaTags({
      title: 'Morse Monk - Demo Booking',
      description:
        'Morse Monk is a platform that helps you learn Morse Code in a fun and interactive way. Whether you are a beginner or an advanced learner, Morse Monk has got you covered.',
      keywords:
        'Morse, Online, Interactive, Classes, Lesson, MMD signal exam, Ham radio exam, Morse visual signal, Reception, Tool for sending morse message',
    });
  }
  onRegister() {
    this.isLoading = true;
    this.normalForm.get('bookingDate')?.setValue(new Date());
    this.normalForm.get('status')?.setValue('pending');
    this.bookingService.postDemoBooking(this.normalForm.value).subscribe({
      next: (response) => {
        this.confirm = true;
        this.isLoading = false;
        this.normalForm.reset();
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }
}
