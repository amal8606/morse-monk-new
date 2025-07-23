import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SubscriptionService } from '../../../../../../_core/http/api/subscription.service';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../../../../_core/http/api/booking.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],

  templateUrl: './edit-home.component.html',
})
export class EditHomeComponent {
  public showEditSubscripedUser = false;

  @Output() onClick = new EventEmitter();
  @Input() user: any;
  @Input() action: any;

  public message = 'Are you sure you want to';
  public cancelText: any;

  constructor(private readonly bookingService: BookingService,
    private toaster:ToastrService
  ) {}
  public loggedUserId: any;
  public isLoading: boolean = false;
  ngOnInit() {
    this.message = `Are you sure you want to Confirm Payment ?`;
  }

  public editUser() {
    if (this.action == 'Pending') {
      // this.normalForm.get('status')?.setValue('pending');
      this.user.status = 'ending';
    } else {
      // this.normalForm.get('status')?.setValue('confirmed');
      this.user.status = 'confirmed';
    }

    this.bookingService.updateBookingStatus(this.user).subscribe({
      next: () => {
        this.closeModel();
        this.isLoading = false;
        this.toaster.success("Payment varified successfully");
      },
      error: () => {
        this.toaster.error("error, try again later")
        this.isLoading = false;

      },

      complete: () => {
        this.closeModel();
        this.isLoading = false;
      },
    });

    this.isLoading = true;

    //   .updateSubscription(this.normalForm.value)
    //   .subscribe({
    //     next: () => {
    //       this.closeModel();
    //       this.isLoading = false;
    //     },
    //     error: () => {},
    //     complete: () => {
    //       this.closeModel();
    //       this.isLoading = false;
    //     },
    //   });
  }

  public closeModel() {
    this.onClick.emit();
  }
}
