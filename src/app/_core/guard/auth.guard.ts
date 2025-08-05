import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const user = JSON.parse(sessionStorage.getItem('userInfo') || '{}');

    if (user?.role === 'admin') {
      return true;
    } else {
      window.alert('You do not have permission to access this page.');
      router.navigate(['/']);
      return false;
    }
  }

  // On the server, just deny access
  return false;
};
