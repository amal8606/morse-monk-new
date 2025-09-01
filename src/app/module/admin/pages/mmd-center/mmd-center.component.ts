import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  makeStateKey,
  PLATFORM_ID,
  TransferState,
} from '@angular/core';
import { MmdCenterService } from '../../../../_core/http/api/mmdCenter.service';
import { AddMmdCenterComponent } from './component/add-mmd-center/add-mmd-center.component';
import { EditMmdCenterComponent } from './component/edit-mmd-center/edit-mmd-center.component';

import { isPlatformServer } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FallbackPipe } from '../../../../_shared/pipes/fallback.pipe';

const MMD_CENTERS_KEY = makeStateKey<any>('mmd-centers');

@Component({
  selector: 'app-mmd-center',
  standalone: true,
  imports: [
    CommonModule,
    AddMmdCenterComponent,
    EditMmdCenterComponent,
    FallbackPipe,
  ],
  templateUrl: './mmd-center.component.html',
})
export class MmdCenterComponent {
  public mmdCenters: any;
  public isAddCenterModalOpen = false;
  public isEditCenterModalOpen = false;
  public center: any;
  loadingMmdCenter = new Set<number>();

  constructor(
    private readonly mmdCenterService: MmdCenterService,
    private readonly transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toaster: ToastrService
  ) {}
  public isLoading: boolean = false;
  ngOnInit() {
    this.getMmdCenter();
  }

  getMmdCenter() {
    this.isLoading = true;
    if (this.transferState.hasKey(MMD_CENTERS_KEY)) {
      // ✅ Use cached data from server-side rendering
      this.mmdCenters = this.transferState.get(MMD_CENTERS_KEY, null);
      this.transferState.remove(MMD_CENTERS_KEY); // clear after use
    } else {
      // 🌐 Fallback to HTTP call
      this.mmdCenterService.getMmdCenter().subscribe({
        next: (respo) => {
          this.mmdCenters = respo;
          this.isLoading = false;
          // Only set state if running on the server
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(MMD_CENTERS_KEY, respo);
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  deleteAnnouncement(centerId: any) {
    this.loadingMmdCenter.add(centerId);
    this.mmdCenterService.deleteMmdCenter(centerId).subscribe({
      next: () => {
        this.toaster.success('success');
        this.mmdCenters = this.mmdCenters.filter(
          (a: any) => a.centerId !== centerId
        );
        this.loadingMmdCenter.delete(centerId);
        this.getMmdCenter(); // refetch
      },
      error: () => {
        this.toaster.error('error, please try agian later');
        this.loadingMmdCenter.delete(centerId);
      },
    });
  }

  isDeleting(centerId: number): boolean {
    return this.loadingMmdCenter.has(centerId);
  }

  openAddCenterModal() {
    this.isAddCenterModalOpen = true;
  }

  closeAddCenterModal() {
    this.isAddCenterModalOpen = false;
    this.getMmdCenter();
  }

  openEditCenterModal(center: any) {
    this.center = center;
    this.isEditCenterModalOpen = true;
  }

  closeEditCenterModal() {
    this.isEditCenterModalOpen = false;
    this.getMmdCenter();
  }
}
