import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class MmdCenterService {
  constructor(private readonly http: HttpClient) {}

  public getMmdCenter(): Observable<any> {
    return this.http.get<any>(`${environment.api}/MmdCenter/centers`);
  }
  public postMmmdCenter(center: any) {
    return this.http.post<any>(`${environment.api}/MmdCenter/create`, center);
  }
  public updateMmmdCenter(center: any) {
    return this.http.post<any>(`${environment.api}/MmdCenter/update`, center);
  }
  public deleteMmdCenter(centerId: any): Observable<any> {
    return this.http.delete<any>(
      `${environment.api}/MmdCenter/delete/${centerId}`
    );
  }
}
