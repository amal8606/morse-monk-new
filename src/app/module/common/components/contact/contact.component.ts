import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { json } from 'node:stream/consumers';
import { EmailService } from '../../../../_core/http/api/email.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  constructor(private readonly emailService: EmailService,
    private readonly toaster:ToastrService
  ) {}
public isValid:boolean=true;
  public emailForm: FormGroup = new FormGroup({
    flName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    subject: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
  });

  sendEmail() {
    this.isValid=false;
    this.emailService.postEnquiryEmail(this.emailForm.value).subscribe({
      next: () => {
        this.toaster.success("Message sent successfully");
        this.emailForm.reset();
      },
      error: () => {
        this.toaster.error("Error sending message, please try again later");
      },
      complete: () => {
        this.isValid=true;
      },
    });
  }
}
