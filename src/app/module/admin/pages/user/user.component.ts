import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../../_core/http/api/user.service';
import { EditUserComponent } from './component/edit-user/edit-user.component';
import { ToastrService } from 'ngx-toastr';
import { FallbackPipe } from '../../../../_shared/pipes/fallback.pipe';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, EditUserComponent, FallbackPipe],
  templateUrl: './user.component.html',
})
export class UserComponent {
  constructor(
    private readonly userService: UserService,
    private toaster: ToastrService
  ) {}

  public users: any[] = [];
  public isEditModalOpen: boolean = false;
  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getUsers().subscribe({
      next: (respo) => {
        this.users = respo;
      },
      error: () => {},
      complete: () => {},
    });
  }

  loadingUser = new Set<number>(); // To track which announcements are being deleted

  deleteUser(id: any) {
    this.loadingUser.add(id);
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter((a: any) => a.id !== id);
        this.loadingUser.delete(id);
        this.getUser();
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

  public user: any;
  public openAddCenterModal(user: any) {
    this.user = user;
    this.isEditModalOpen = true;
  }
  public closeAddCenterModal() {
    this.isEditModalOpen = false;
    this.getUser();
  }
}
