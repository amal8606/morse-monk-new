import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  private userInfoSubject = new BehaviorSubject<any>({});
  public userInfo$ = this.userInfoSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const storedUser = sessionStorage.getItem('userInfo');
      if (storedUser) {
        this.userInfoSubject.next(JSON.parse(storedUser));
      }
    }
  }

  setUserInfo(user: any): void {
    if (this.isBrowser) {
      sessionStorage.setItem('userInfo', JSON.stringify(user));
      sessionStorage.setItem('JWT', JSON.stringify(user.token));
    }
    this.userInfoSubject.next(user);
  }

  getUserInfo(): any {
    return this.userInfoSubject.value;
  }

  clearUserInfo(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('JWT');
    }
    this.userInfoSubject.next({});
  }
}
