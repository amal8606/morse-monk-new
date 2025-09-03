import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmailService } from '../../../../../../_core/http/api/email.service';
import { CommonModule } from '@angular/common';
import { ToastRef, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirmation-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-model.component.html',
})
export class ConfirmationModelComponent {
  @Output() onClick = new EventEmitter();
  @Input() email: any;

  constructor(private readonly emailService: EmailService,
    private readonly toaster:ToastrService
  ) {}
  public isLoading: boolean = false;
  public deletEnquiry() {
   console.log(this.email);
    this.emailService.deleteEnquiryEmail(this.email.id).subscribe({
      next: () => {
        this.closeModel();
        this.isLoading = false;
        this.toaster.success("deleted successfully")

      },
      error: () => {
        this.isLoading=false;
        this.toaster.error("error, try again")
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
