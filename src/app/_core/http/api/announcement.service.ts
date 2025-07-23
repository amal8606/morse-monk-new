import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  constructor(private readonly http: HttpClient) {}

  public getAnnouncement(): Observable<any> {
    return this.http.get<any>(`${environment.api}/Anouncement`);
  }
  public postAnnouncement(announcement: any) {
    return this.http.post<any>(`${environment.api}/Anouncement`, announcement);
  }

  public deleteAnnouncement(announcement: any) {
    return this.http.delete<any>(
      `${environment.api}/Anouncement?id=${announcement.id}`
    );
  }
}
