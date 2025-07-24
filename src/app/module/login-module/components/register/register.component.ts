import { Component } from '@angular/core';
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
interface RegisterUserDto {
  firstName: string;
  email: string;
  phoneNumber: string;
  country: string;
  passwordHash: string;
  createdAt: string;
  dateOfBirth: string;
}

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
  country: any;
  isLoading: boolean = false;
  ngOnInit() {
    this.country = this.countryService.country.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    this.crearteRegistration();
  }

  crearteRegistration(): void {
    this.registrationForm = this.formBuilder.group(
      {
        fullName: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        phoneNumber: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        passwordHash: new FormControl('', Validators.required),
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
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  public formData: any;
  wrongPassword: any;
  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.wrongPassword = this.passwordMatchValidator;

      return;
    }
    this.wrongPassword = false;

    this.formData = {
      ...this.registrationForm.value,
      createdAt: new Date(),
      userRole: 'student',
    };
    this.isLoading = true;
    this.userService.postUser(this.formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success('Register Successfully..');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.error('already used email or phone number');
          this.isLoading = false;
        }
      },
    });
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
}
