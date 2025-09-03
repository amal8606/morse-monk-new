import { Component } from '@angular/core';
import { BookingService } from '../../../../_core/http/api/booking.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SubscriptionService } from '../../../../_core/http/api/subscription.service';
import { FormsModule } from '@angular/forms';
import { EditSubscripedUserComponent } from './component/edit-subscriped-user/edit-subscriped-user.component';
import { FallbackPipe } from '../../../../_shared/pipes/fallback.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subscriped-user',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    EditSubscripedUserComponent,
    FallbackPipe,
  ],
  templateUrl: './subscriped-user.component.html',
})
export class SubscripedUserComponent {
  public users: any;
  // public user: any = '';
  // public selectedUser: any = '';

  // public showModel: boolean = false;
  selectedType = 'pending';
  loadingUser = new Set<number>(); // To track which announcements are being deleted

  constructor(private readonly subscriptionService: SubscriptionService,
    private toaster: ToastrService
  ) {}

  public status: any = 'pending';
  public isActive: any = 0;
  public isLoading: boolean = false;
  ngOnInit() {
    this.getSubscription();
  }
  public onPaymentTypeChange() {
    this.getSubscription();
  }
  onToggleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.checked == true) {
      this.isActive = 1;
    } else {
      this.isActive = 0;
    }
    this.getSubscription();
  }
  public getSubscription() {
    this.isLoading = true;
    this.status = this.selectedType;

    this.subscriptionService
      .getSubscription(this.status, this.isActive)
      .subscribe({
        next: (respo) => {
          this.isLoading = false;
          this.users = respo;
        },
        error: () => {
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  loadingActive = new Set<number>();
  loadingStatus = new Set<number>();

  // isActiveSubscription(user: any) {
  //   this.loadingActive.add(user.id);
  //   const data = {
  //     ...user,
  //     active: user.active == 1 ? 0 : 1,
  //   };

  //   this.subscriptionService.updateSubscription(data).subscribe({
  //     next: () => {
  //       this.users = this.users.filter((a: any) => a.centerId !== user.id);
  //       this.loadingActive.delete(user.id);
  //       this.getSubscription();
  //     },
  //     error: () => {},
  //   });
  // }
  // statusSubscription(user: any) {
  //   this.loadingStatus.add(user.id);

  //   const data = {
  //     ...user,
  //     status: user.status == 'pending' ? 'confirmed' : 'pending',
  //   };

  //   this.subscriptionService.updateSubscription(data).subscribe({
  //     next: () => {
  //       this.users = this.users.filter((a: any) => a.centerId !== user.id);
  //       this.loadingStatus.delete(user.id);
  //       this.getSubscription();
  //     },
  //     error: () => {},
  //   });
  // }

  isActiceLoading(id: number): boolean {
    return this.loadingActive.has(id);
  }
  isStatusLoading(id: any): boolean {
    return this.loadingStatus.has(id);
  }

  public showEditSubscripedUser: boolean = false;
  public user: any;
  public action: any;
  public openEditSubscripedUser(user: any, action: any) {
    this.user = user;
    this.showEditSubscripedUser = true;
    switch (action) {
      case 1:
        return (this.action = 'Deactive');
      case 0:
        return (this.action = 'Active');

      case 'pending':
        return (this.action = 'Confirmed');
      case 'confirmed':
        return (this.action = 'Pending');

      default:
        return 0;
    }
  }

  public closeEditSubscripedUser() {
    this.showEditSubscripedUser = false;
    this.getSubscription();
  }
  getCurrencyCode(country: string): string {
    if (country == 'India') {
      return 'INR';
    } else {
      return 'USD';
    }
  }
    deleteUser(id: any) {
      if (!confirm('Are you sure to delete this user?')) {
      return;
    }
    this.loadingUser.add(id);
    this. subscriptionService.deleteSubscription(id).subscribe({
      next: () => {
        this.loadingUser.delete(id);
        this.getSubscription();
        this.toaster.success('Success');
      },
      error: () => {
        this.loadingUser.clear();
        this.toaster.error('error, please try agian later');
      },
    });
  }

  isDeleting(centerId: number): boolean {
    return this.loadingUser.has(centerId);
  }
}
