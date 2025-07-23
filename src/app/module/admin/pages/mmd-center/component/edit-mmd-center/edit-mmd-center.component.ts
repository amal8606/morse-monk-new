import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MmdCenterService } from '../../../../../../_core/http/api/mmdCenter.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-mmd-center',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],

  templateUrl: './edit-mmd-center.component.html',
})
export class EditMmdCenterComponent {
  public showAddAnnouncement = false;

  @Output() onClick = new EventEmitter();
  @Input() center: any;

  public normalForm: FormGroup = new FormGroup({
    centerId: new FormControl(''),
    centerName: new FormControl('', Validators.required),
    createdAt: new FormControl(''),
    bookings: new FormControl([]),
  });
  constructor(private readonly mmdCenterService: MmdCenterService,
    private readonly toastr:ToastrService
  ) {}
  public loggeduserId: any;
  public isLoading: boolean = false;
  ngOnInit() {
    this.loggeduserId = 1;
    if (this.center) {
      this.normalForm.patchValue({
        centerId: this.center.centerId || '',
        centerName: this.center.centerName || '',
        createdAt: this.center.createdAt || '',
        bookings: this.center.bookings || [],
      });
    }
  }

  public editMmdCenter() {
    this.isLoading = true;
    this.mmdCenterService.updateMmmdCenter(this.normalForm.value).subscribe({
      next: () => {
        this.closeModel();
        this.isLoading = false;
        this.toastr.success("success")
      },
      error: () => {
        this.isLoading=false;
        this.toastr.error("error, please try again");
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
