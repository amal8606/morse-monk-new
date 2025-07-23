import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  constructor(private readonly http: HttpClient) {}

  public getSubscription(status: any, active: any): Observable<any> {
    return this.http.get<any>(
      `${environment.api}/Subscription/?status=${status}&active=${active}`
    );
  }
  public postSubscription(subscription: any) {
    return this.http.post<any>(`${environment.api}/Subscription`, subscription);
  }
  public updateSubscription(subscription: any) {
    return this.http.post<any>(
      `${environment.api}/Subscription/update`,
      subscription
    );
  }
    public isSubscriptionActive(userId: Number) {
    return this.http.post<any>(`${environment.api}/Subscription/auth?userId=${userId}`, {});
  }
}
