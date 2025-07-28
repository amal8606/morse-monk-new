import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
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
  public countryList: any;
selectedCountry: any;
selectedCountryCode: string = '';
selectedCode: string = '';
filteredCountries:any;

dropdownOpen = false;
  ngOnInit(): void {
    // this.country = this.countryService.country.sort((a, b) =>
    //   a.name.localeCompare(b.name)
    // );
this.countryService.getCountries().subscribe((data: any[]) => {
  this.countryList = (data || []).sort((a, b) => {
    const nameA = a.name?.common || '';
    const nameB = b.name?.common || '';
    return nameA.localeCompare(nameB);
  });
  this.filteredCountries = [...this.countryList];
});
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
    let {phone} =this.normalForm.value;
    this.normalForm.get('phone')?.setValue(`${this.selectedCode}${phone}`);
    this.normalForm.get('bookingDate')?.setValue(new Date());
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
  //countries
  @ViewChild('searchInput') searchInputRef!: ElementRef;
  selectCountry(country: any): void {
  this.selectedCountry = country;
  this.selectedCode = `${country.idd.root} ${country.idd.suffixes[0]}`
  this.selectedCountryCode = country.cca2;
  this.dropdownOpen = false;
    this.normalForm.get('country')?.setValue(country.name.common);

}  filterCountries(searchText: string) {
    const term = searchText.toLowerCase();
    this.filteredCountries = this.countryList.filter((country:any) =>
      country.name.common.toLowerCase().includes(term)
    );
  }
    toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      setTimeout(() => this.searchInputRef?.nativeElement?.focus(), 100);
    }
  }
}
