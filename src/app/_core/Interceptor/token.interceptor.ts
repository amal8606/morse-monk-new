import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { UserService } from '../http/api/user.service';
import { Router } from '@angular/router';
import { UserLoginService } from '../services/userLogin.service';

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
const userloginService = inject(UserLoginService);

  let jwtString: string | null = null;
  let usrInfoString: string | null = null;
  let user: any;

  if (isBrowser) {
    jwtString = sessionStorage.getItem('JWT');
    usrInfoString = sessionStorage.getItem('userInfo');

    if (usrInfoString) {
      try {
        user = JSON.parse(usrInfoString);
      } catch (e) {
        console.error('Interceptor: Error parsing userInfo:', e);
      }
    }
  }

  const userService = inject(UserService);
  const router = inject(Router);

  let authToken: string | null = null;
  if (jwtString) {
    try {
      const parsed = JSON.parse(jwtString);
      authToken = typeof parsed === 'string' ? parsed : jwtString;
    } catch (e) {
      authToken = jwtString;
    }
  }

  const shouldAddHeader = authToken && !request.url.includes('/login');

  if (shouldAddHeader) {
    request = request.clone({
      setHeaders: {
        Authorization: `${authToken}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return userService.logout(user?.userId).pipe(
          tap(() => {
            if (isBrowser) {
              router.navigate(['/login']);
              userloginService.clearUserInfo();
            }
          }),
          catchError((logoutError) => {
            console.error('Logout failed:', logoutError);
            if (isBrowser) {
              router.navigate(['/login']);
              userloginService.clearUserInfo();
              
            }
            return throwError(() => logoutError);
          }),
          switchMap(() => EMPTY)
        );
      }
      return throwError(() => error);
    })
  );
};
