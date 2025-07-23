import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  public getUsers(): Observable<any> {
    return this.http.get<any>(`${environment.api}/User/users`);
  }
  public getUser(userId: any): Observable<any> {
    return this.http.get<any>(`${environment.api}/User/user/${userId}`);
  }

  public postUser(user: any) {
    return this.http.post<any>(`${environment.api}/User/register`, user);
  }
  public editUser(user: any) {
    return this.http.post<any>(`${environment.api}/User/update`, user);
  }
  public deleteUser(userId: any) {
    return this.http.delete<any>(`${environment.api}/User/delete/${userId}`);
  }
  public login(user: any) {
    return this.http.post<any>(`${environment.api}/User/login`, user);
  }
  public logout(userId: any):Observable<any> {
    return this.http.post<any>(
      `${environment.api}/User/logout?userId=${userId}`,
      {}
    );
  }
  //otp verification apis
   public CreateOtp(email: string):Observable<any> {
    return this.http.post<any>(
      `${environment.api}/User/GetOtp?email=${email}`,
      {}
    );
  }
     public VerifyOtp(email: string,otp:string):Observable<any> {
    return this.http.post<any>(
      `${environment.api}/User/VerifyOtp?otp=${otp}&email=${email}`,
      {}
    );
  }
}
