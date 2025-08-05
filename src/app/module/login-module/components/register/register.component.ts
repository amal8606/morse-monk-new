import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from '../../../../_core/http/api/country.service';
import { UserService } from '../../../../_core/http/api/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule],
})
export class RegisterComponent {
  constructor(
    private readonly userService: UserService,
    private formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly countryService: CountryService,
    private toastr: ToastrService
  ) {}

  registrationForm!: FormGroup;
  countryList: any[] = [];
  filteredCountries: any[] = [];
  selectedCountry: any;
  selectedCountryCode = '';
  selectedCode = '';
  dropdownOpen = false;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  formData: any;
  wrongPassword: any;

  @ViewChild('searchInput') searchInputRef!: ElementRef;

  ngOnInit() {
    this.countryService.getCountries().subscribe((data: any[]) => {
      this.countryList = (data || []).sort((a, b) =>
        (a.name?.common || '').localeCompare(b.name?.common || '')
      );
      this.filteredCountries = [...this.countryList];
    });

    this.createRegistrationForm();
  }

  createRegistrationForm(): void {
    this.registrationForm = this.formBuilder.group(
      {
        fullName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        phoneNumber: new FormControl('', [
          Validators.required,
          Validators.maxLength(10),
        ]),
        country: new FormControl('', Validators.required),
        passwordHash: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/
          ),
        ]),
        confirmPassword: new FormControl('', Validators.required),
        createdAt: new FormControl(new Date()),
        dateOfBirth: new FormControl('', Validators.required),
        userRole: new FormControl(''),
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
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

  togglePasswordVisibility(field: string): void {
    if (field === 'passwordHash') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  selectCountry(country: any): void {
    this.selectedCountry = country;
    this.selectedCode = `${country.idd?.root || ''}${
      country.idd?.suffixes?.[0] || ''
    }`;
    this.selectedCountryCode = country.cca2;
    this.dropdownOpen = false;
    this.registrationForm.get('country')?.setValue(country.name?.common || '');
  }

  filterCountries(searchText: string) {
    const term = searchText.toLowerCase();
    this.filteredCountries = this.countryList.filter((country: any) =>
      country.name?.common?.toLowerCase().includes(term)
    );
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      setTimeout(() => this.searchInputRef?.nativeElement?.focus(), 100);
    }
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const phoneNumber = `${this.selectedCode}${
      this.registrationForm.get('phoneNumber')?.value
    }`;
    this.registrationForm.get('phoneNumber')?.setValue(phoneNumber);

    this.formData = {
      ...this.registrationForm.value,
      createdAt: new Date(),
      userRole: 'student',
    };

    this.isLoading = true;
    this.userService.postUser(this.formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success('Registered successfully!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status === 409) {
          this.toastr.error('Email or phone number already in use.');
        }
        this.isLoading = false;
      },
    });
  }
  @HostListener('window:keydown', ['$event'])
  handleRegisterKeyDown(event: KeyboardEvent) {
    if (
      event.key === 'Enter' &&
      this.registrationForm.valid &&
      !this.isLoading
    ) {
      this.onSubmit();
    }
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get passwordHash() {
    return this.registrationForm.get('passwordHash');
  }

  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }
}
