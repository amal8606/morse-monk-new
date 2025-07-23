import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnnouncementService } from '../../../../_core/http/api/announcement.service';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './announcements.component.html',
})
export class AnnouncementsComponent {
  constructor(private readonly announcementService: AnnouncementService) {}

  public announcements: any;
  ngOnInit() {
    this.announcementService.getAnnouncement().subscribe({
      next: (respo) => {
        this.announcements = respo;
      },
      error: () => {},
      complete: () => {},
    });
  }
}
