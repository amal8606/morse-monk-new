import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../../../../../_core/http/api/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent {
  public showAddAnnouncement = false;

  @Output() onClick = new EventEmitter();
  @Input() user: any;

  public normalForm: FormGroup = new FormGroup({
    id: new FormControl(null),

    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    userRole: new FormControl('', Validators.required),
    createdAt: new FormControl(''),

    passwordHash: new FormControl(''),
  });
  constructor(private readonly userService: UserService) {}
  public loggedUserId: any;
  public isLoading: boolean = false;
  ngOnInit() {
    if (this.user) {
      this.normalForm.patchValue({
        id: this.user.id || null,

        fullName: this.user.fullName || '',
        email: this.user.email || '',
        phoneNumber: this.user.phoneNumber || '',
        country: this.user.country || '',
        createdAt: this.user.createdAt || '',
        dateOfBirth: this.user.dateOfBirth || '',
        userRole: this.user.userRole || '',
        passwordHash: this.user.passwordHash || '',
      });
    }
  }

  public editUser() {
    this.isLoading = true;
    this.userService.editUser(this.normalForm.value).subscribe({
      next: () => {
        this.closeModel();
        this.isLoading = false;
      },
      error: () => {},
      complete: () => {
        this.closeModel();
        this.isLoading = false;
      },
    });
  }

  public closeModel() {
    this.onClick.emit();
  }
}
