import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddAnnouncementComponent } from './component/add-announcement/add-announcement.component';
import { AnnouncementService } from '../../../../_core/http/api/announcement.service';
import { EditAnnouncementComponent } from './component/edit-announcement/edit-announcement.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, AddAnnouncementComponent, EditAnnouncementComponent],
  templateUrl: './announcements.component.html',
})
export class AnnouncementsComponent {
  constructor(
    private readonly announcementService: AnnouncementService,
    private toaster: ToastrService
  ) {}
  public showAddAnnouncement: boolean = false;
  public showEditAnnouncement: boolean = false;
  public isLoading: boolean = false;

  public announcements: any;
  ngOnInit() {
    this.getAnnouncement();
  }

  public getAnnouncement() {
    this.isLoading = true;

    this.announcementService.getAnnouncement().subscribe({
      next: (respo) => {
        this.isLoading = false;

        this.announcements = respo;
      },
      error: () => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  // loadingAnnouncements = new Set<number>(); // To track which announcements are being deleted

  // deleteAnnouncement(announcement: any) {
  //   this.loadingAnnouncements.add(announcement.id);
  //   this.announcementService.deleteAnnouncement(announcement.id).subscribe({
  //     next: () => {
  //       this.announcements = this.announcements.filter(
  //         (a: any) => a.id !== announcement.id
  //       );
  //       this.loadingAnnouncements.delete(announcement.id);
  //     },
  //     error: () => {
  //       // this.loadingAnnouncements.delete(announcement.id);
  //     },
  //   });
  // }

  // isDeleting(id: number): boolean {
  //   return this.loadingAnnouncements.has(id);
  // }
  public openAddAnnouncement() {
    this.showAddAnnouncement = true;
  }

  public closeAddAnnouncement() {
    this.showAddAnnouncement = false;
    this.getAnnouncement();
  }

  public announcement: any;
  public openDeleteAnnouncement(announcement: any) {
    this.announcement = announcement;
    this.showEditAnnouncement = true;
  }

  public closeDeleteAnnouncement() {
    this.showEditAnnouncement = false;
    this.getAnnouncement();
  }
}
