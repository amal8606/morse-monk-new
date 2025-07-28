import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AnnouncementService } from '../../../../../../_core/http/api/announcement.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserLoginService } from '../../../../../../_core/services/userLogin.service';

@Component({
  selector: 'app-add-announcement',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-announcement.component.html',
})
export class AddAnnouncementComponent {
  public showAddAnnouncement = false;

  @Output() onClick = new EventEmitter();

  public normalForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    createdAt: new FormControl(''),
    createdBy: new FormControl(1),
    isActive: new FormControl(1),
  });
  constructor(
    private readonly announcementService: AnnouncementService,
    private toaster: ToastrService,
    private readonly userLoginService: UserLoginService
  ) {}
  public loggedUserId: any;
  public isLoading: boolean = false;
  ngOnInit() {
    this.userLoginService.userInfo$.subscribe((user) => {
      this.loggedUserId = user.userId;
    });
    this.normalForm.get('createdBy')?.setValue(this.loggedUserId);
    this.normalForm.get('createdAt')?.setValue(new Date());

    this.normalForm.get('isActive')?.setValue(1);
  }

  public createAnnouncement() {
    this.isLoading = true;
    this.announcementService.postAnnouncement(this.normalForm.value).subscribe({
      next: () => {
        this.closeModel();
        this.isLoading = false;
        this.toaster.success('created successfully');
      },
      error: () => {
        this.isLoading = false;
        this.toaster.error('error, try again');
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