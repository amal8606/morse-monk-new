import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AnnouncementService } from '../../../../../../_core/http/api/announcement.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-announcement',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './edit-announcement.component.html',
})
export class EditAnnouncementComponent {
  public showEditAnnouncement = false;

  @Output() onClick = new EventEmitter();
  @Input() announcement: any;

  public message = 'Are you sure you want to';

  constructor(private readonly announcementService: AnnouncementService,
        private toaster:ToastrService
    
  ) {}
  public isLoading: boolean = false;
  ngOnInit() {
    this.message = `Are you sure you want to Delete it ?`;
  }

  public deleteAnnouncement() {
    this.announcementService.deleteAnnouncement(this.announcement).subscribe({
      next: () => {
        this.closeModel();
        this.isLoading = false;
        this.toaster.success("deleted successfully")
      },
      error: () => {
        this.toaster.error("error, try again")
        this.isLoading=false;
      },
      complete: () => {
        this.closeModel();
        this.isLoading = false;
      },
    });

    this.isLoading = true;
  }

  public closeModel() {
    this.onClick.emit();
  }
}
