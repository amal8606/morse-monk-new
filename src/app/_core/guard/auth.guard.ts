import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
export const authGuard: CanActivateFn = (route, state) => {
const router =inject(Router);

  const user = JSON.parse(sessionStorage.getItem('userInfo')||'{}');
  if (user?.role=="admin") {
    return true;
  } else {
    window.alert('You do not have permission to access this page.');
    router.navigate(['/']);
    return false;
  }
};
