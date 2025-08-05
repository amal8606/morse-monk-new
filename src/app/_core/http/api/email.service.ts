import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private readonly http: HttpClient) {}

  public postEmail(email: any) {
    return this.http.post<any>(`${environment.api}/Email/send`, email);
  }
  public postEnquiryEmail(email: any) {
    return this.http.post<any>(`${environment.api}/Email`, email);
  }
  public getEnquiryEmail() {
    return this.http.get<any>(`${environment.api}/Email/enquiry`);
  }
  public deleteEnquiryEmail(id: any) {
    return this.http.delete<any>(`${environment.api}/Email?id=${id}`);
  }
}
