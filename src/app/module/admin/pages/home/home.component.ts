import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectorRef, Component } from '@angular/core';
import { BookingService } from '../../../../_core/http/api/booking.service';
import { EditHomeComponent } from './component/edit-home/edit-home.component';
import { ToastrComponentlessModule, ToastrService } from 'ngx-toastr';
import { FallbackPipe } from '../../../../_shared/pipes/fallback.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    EditHomeComponent,
    FallbackPipe,
  ],
  templateUrl: './home.component.html',
})
export class AdminHomeComponent {
  public enrolPendingPaymentsCount: number = 0;
  public mmdPendingPaymentsCount: number = 0;
  public allPendingPaymentsCount: number = 0;
  public demoCount: number = 0;
  selectedType = 'allPaymentsPending';
  selectedTypeStatus = 'pending';
  public users: any[] = [];
  public user: any = '';
  public selectedUser: any = '';

  public showConfirm: boolean = false;
  public isloadingStatus: boolean = false;

  constructor(
    private readonly booikngService: BookingService,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.bookingFunction(this.selectedTypeStatus);
  }
  public onStatusChange() {
    this.bookingFunction(this.selectedTypeStatus);
  }
  public bookingFunction(status: any) {
    this.booikngService.getBooking(status).subscribe({
      next: (response) => {
        this.allPaymentsPendingUser = response;
        this.enrolUsers = response.filter(
          (user: any) =>
            user.examDate === null &&
            user.paidDate != null &&
            user.mmdCenterName === null
        );
        this.mmdUsers = response.filter(
          (user: any) =>
            user.examDate != null &&
            user.paidDate != null &&
            user.mmdCenterName != null
        );
        this.demoUsers = response.filter(
          (user: any) =>
            user.examDate === null &&
            user.paidDate === null &&
            user.mmdCenterName === null
        );
        this.allPendingPaymentsCount = response.length;
        this.enrolPendingPaymentsCount = this.enrolUsers.length;
        this.mmdPendingPaymentsCount = this.mmdUsers.length;
        this.demoCount = this.demoUsers.length;
      },
      error: (error) => {},
    });
  }

  public allPaymentsPendingUser = [];
  public enrolUsers = [];
  public mmdUsers = [];
  public demoUsers = [];

  public columnDefinitions: any = {
    allPaymentsPending: [
      'name',
      'email',
      'phone',
      'country',
      'examDate',
      'mmdCenterName',
      'bookingDate',
      'amount',
      'paidDate',
      'paymentMethod',
      'status',
    ],
    enrol: [
      'name',
      'email',
      'phone',
      'country',
      'bookingDate',
      'amount',
      'paidDate',
      'status',
    ],
    mmd: [
      'name',
      'email',
      'phone',
      'country',
      'examDate',
      'mmdCenterName',
      'bookingDate',
      'amount',
      'paidDate',
      'paymentMethod',
      'status',
    ],

    demo: ['name', 'email', 'phone', 'country', 'bookingDate', 'status'],
  };

  public columnHeaders: any = {
    name: 'Name',
    email: 'Email',
    phone: 'Phone Number (Whatsapp)',
    country: 'Country',
    examDate: 'Exam Date',
    mmdCenterName: 'MMD Center Name',
    bookingDate: 'Booking Date',
    amount: 'Amount',
    paidDate: 'Fee Paid Date',
    status: 'Status',
  };

  getDisplayedColumns(): string[] {
    return this.columnDefinitions[this.selectedType];
  }

  getColumnHeader(column: string): string {
    return this.columnHeaders[column] || column;
  }

  getCurrentData(): any[] {
    switch (this.selectedType) {
      case 'enrol':
        return this.enrolUsers;
      case 'mmd':
        return this.mmdUsers;
      case 'demo':
        return this.demoUsers;
      case 'allPaymentsPending':
        return this.allPaymentsPendingUser;
      default:
        return [];
    }
  }

  public updateBookingStatus(user: any) {
    user.status = 'confirmed';
    this.booikngService.updateBookingStatus(user).subscribe({
      next: () => {
        this.bookingFunction(this.selectedTypeStatus);
        this.toaster.success('success..');
      },
      error: () => {
        this.toaster.error('error,please try again');
      },
    });
  }

  // public openDetailsModal(user: any) {
  //   this.selectedUser = user;
  //   this.showModel = true;
  // }

  // public closeDetailsModal() {
  //   this.showModel = false;
  // }
  public action: any;
  public openConfirmModal(user: any, action: any) {
    this.user = user;
    switch (action) {
      case 'pending':
        this.showConfirm = true;
        return (this.action = 'Confirmed');
      case 'confirmed':
        return (this.action = 'Pending');

      default:
        return 0;
    }
  }

  public closeConfirmModal() {
    this.showConfirm = false;
    this.bookingFunction(this.selectedTypeStatus);
  }
}
