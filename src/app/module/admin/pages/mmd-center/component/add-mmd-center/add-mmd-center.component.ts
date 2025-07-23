import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AnnouncementService } from '../../../../../../_core/http/api/announcement.service';
import { CommonModule } from '@angular/common';
import { MmdCenterService } from '../../../../../../_core/http/api/mmdCenter.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-mmd-center',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-mmd-center.component.html',
})
export class AddMmdCenterComponent {
  public showAddAnnouncement = false;

  @Output() onClick = new EventEmitter();

  public normalForm: FormGroup = new FormGroup({
    centerName: new FormControl('', Validators.required),
    createdAt: new FormControl(''),
  });
  constructor(private readonly mmdCenterService: MmdCenterService,
    private readonly toastr:ToastrService
  ) {}
  public loggedUserId: any;
  public isLoading: boolean = false;
  ngOnInit() {
    this.loggedUserId = 1;
    this.normalForm.get('createdAt')?.setValue(new Date());
  }

  public createMmdCenter() {
    this.isLoading = true;
    this.mmdCenterService.postMmmdCenter(this.normalForm.value).subscribe({
      next: () => {
        this.closeModel();
        this.isLoading = false;
        this.toastr.success("Success");
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error("error,please try again later");
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
