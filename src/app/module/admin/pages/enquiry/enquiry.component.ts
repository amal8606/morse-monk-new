import {
  Component,
  Inject,
  makeStateKey,
  PLATFORM_ID,
  TransferState,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { EmailService } from '../../../../_core/http/api/email.service';
import { CommonModule } from '@angular/common';
import { ConfirmationModelComponent } from './component/confirmation-model/confirmation-model.component';

const ENQUIRIES_KEY = makeStateKey<any>('enquiries');

@Component({
  selector: 'app-enquiry',
  standalone: true,
  imports: [CommonModule, ConfirmationModelComponent],
  templateUrl: './enquiry.component.html',
})
export class EnquiryComponent {
  constructor(
    private readonly emailService: EmailService,
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  public enquiries: any;
  showModel: boolean = false;
  showComfirmModel: boolean = false;
  email: any;
  user: any;
  public isLoading: boolean = false;
  ngOnInit() {
    const saved = this.state.get(ENQUIRIES_KEY, null);
    if (saved) {
      this.enquiries = saved;
      this.state.remove(ENQUIRIES_KEY); // clear after client uses it
    } else {
      this.getMails();
    }
  }

  getMails() {
    this.isLoading = true;
    this.emailService.getEnquiryEmail().subscribe({
      next: (respo) => {
        this.isLoading = false;

        this.enquiries = respo;
        if (isPlatformServer(this.platformId)) {
          this.state.set(ENQUIRIES_KEY, respo);
        }
      },
      error: () => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  public openDeletEnquiry(email: any) {
    this.showComfirmModel = true;
    this.email = email;
  }

  public closeDeletEnquiry() {
    this.showComfirmModel = false;
    this.getMails();
  }

  public openModel(user: any) {
    this.user = user;
    this.showModel = true;
  }

  public closeDetailsModal() {
    this.showModel = false;
  }
}
