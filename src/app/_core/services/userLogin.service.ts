import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  private userInfoSubject = new BehaviorSubject<any>({});
  public userInfo$ = this.userInfoSubject.asObservable();

  constructor() {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('userInfo');
      if (storedUser) {
        this.userInfoSubject.next(JSON.parse(storedUser));
      }
    }
  }

  setUserInfo(user: any): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userInfo', JSON.stringify(user));
        sessionStorage.setItem('JWT', JSON.stringify(user.token));
    }
    this.userInfoSubject.next(user);
  }

  getUserInfo(): any {
    return this.userInfoSubject.value;
  }

  clearUserInfo(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('JWT');

    }
    this.userInfoSubject.next({});
  }
}
