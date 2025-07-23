import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private readonly http: HttpClient) {}
  public api: any;

  public getBooking(status?: any): Observable<any> {
    if (!status) {
      this.api = `${environment.api}/Booking/pending-bookings`;
    } else {
      this.api = `${environment.api}/Booking/pending-bookings?status=${status}`;
    }
    return this.http.get<any>(this.api);
  }

  public postBooking(booking: any) {
    return this.http.post<any>(`${environment.api}/Booking/booking`, booking);
  }
    public postDemoBooking(booking: any) {
    return this.http.post<any>(`${environment.api}/Booking/demo`, booking);
  }

  public updateBookingStatus(booking: any) {
    return this.http.post<any>(
      `${environment.api}/Booking/update-status`,
      booking
    );
  }
}
