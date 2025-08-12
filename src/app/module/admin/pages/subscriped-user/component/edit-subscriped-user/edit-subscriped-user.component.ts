import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SubscriptionService } from '../../../../../../_core/http/api/subscription.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-subscriped-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],

  templateUrl: './edit-subscriped-user.component.html',
})
export class EditSubscripedUserComponent {
  public showEditSubscripedUser = false;

  @Output() onClick = new EventEmitter();
  @Input() user: any;
  @Input() action: any;

  public message = 'Are you sure you want to';
  public cancelText: any;
  public normalForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    userId: new FormControl(null),
    userName: new FormControl(''),
    userEmail: new FormControl(''),
    phone: new FormControl(''),
    country: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    status: new FormControl(''),
    active: new FormControl(null),
    createdAt: new FormControl(''),
    duration: new FormControl(null),
    amount: new FormControl(null),
    paidDate: new FormControl(''),
    paymentMethod: new FormControl(''),
  });
  constructor(private readonly subscriptionService: SubscriptionService,
    private readonly toaster:ToastrService
  ) {}
  public loggedUserId: any;
  public isLoading: boolean = false;
  ngOnInit() {
    this.message = `Are you sure you want to ${this.action} it ?`;
    if (this.user) {
      this.normalForm.patchValue({
        id: this.user.id || null,
        userId: this.user.userId || null,
        userName: this.user.userName || '',
        userEmail: this.user.userEmail || '',
        phone: this.user.phone || '',
        country: this.user.country || '',
        startDate: this.user.startDate || null,
        endDate: this.user.endDate || null,
        status: this.user.status || '',
        active: this.user.active ?? null,
        createdAt: this.user.createdAt || '',
        duration: this.user.duration ?? null,
        amount: this.user.amount ?? null,
        paidDate: this.user.paidDate || '',
        paymentMethod: this.user.paymentMethod || '',
      });
    }
  }

  public editUser() {
    console.log(this.action);
    if (this.action == 'Deactive') {
      this.normalForm.get('active')?.setValue(0);
    } else if (this.action == 'Active') {
      this.normalForm.get('active')?.setValue(1);
    } else if (this.action == 'Pending') {
      this.normalForm.get('status')?.setValue('pending');
    } else {
      this.normalForm.get('status')?.setValue('confirmed');
    }

    this.isLoading = true;

    console.log(this.normalForm.value);
    this.subscriptionService
      .updateSubscription(this.normalForm.value)
      .subscribe({
        next: () => {
          this.closeModel();
          this.isLoading = false;
          this.toaster.success("Payment varified successfully");
          
        },
        error: () => {
          this.isLoading = false;
          this.toaster.error("Error,please try again later");
        },
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
