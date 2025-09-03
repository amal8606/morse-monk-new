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
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatCheckboxModule
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
public isLoadingStatus: boolean = false;
  public showConfirm: boolean = false;
  public isloadingStatus: boolean = false;
  showSelect = false;
  selection = new SelectionModel<any>(true, []);

  constructor(
    private readonly booikngService: BookingService,
    private toaster: ToastrService
  ) {}

  public isLoading: boolean = false;
  ngOnInit() {
    this.bookingFunction(this.selectedTypeStatus);
  }
  public onStatusChange() {
    this.bookingFunction(this.selectedTypeStatus);
  }
  public bookingFunction(status: any) {
    this.isLoading = true;
    this.booikngService.getBooking(status).subscribe({
      next: (response) => {
        this.isLoading = false;

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
      error: (error) => {
        this.isLoading = false;
      },
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
    let columns = this.columnDefinitions[this.selectedType] || [];
    if (this.showSelect) {
      return ['select', ...columns];
    }
    return columns;
  }

  getDynamicColumns(): string[] {
    return this.getDisplayedColumns().filter((c) => c !== 'select');
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

  getCurrencyCode(country: string): string {
    if (country == 'India') {
      return 'INR';
    } else {
      return 'USD';
    }
  }

  toggleSelect() {
    this.showSelect = !this.showSelect;
    if (!this.showSelect) {
      this.selection.clear();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.getCurrentData().length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.getCurrentData().forEach((row) => this.selection.select(row));
  }
  select(row: any) {
    return this.selection.isSelected(row);
  }
  deleteSelected() {
    const ids = this.selection.selected.map((item) => item.bookingId);
    if (ids.length === 0) {
      this.toaster.info('No bookings selected for deletion.');
      return;
    }
    this.isLoadingStatus = true;
    this.booikngService.deleteBookings(ids).subscribe({
      
      next: (response) => {
        this.toaster.success('Selected bookings deleted successfully.');
        this.selection.clear();
        this.bookingFunction(this.selectedTypeStatus);
      },error: (error) => {
        this.isLoadingStatus = false;
        this.toaster.error('Error deleting bookings, please try again.');
      },
      complete: () => {
        this.isLoadingStatus = false;
      }
    })
  }
}
