
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HelperService } from '../services/helper.service';
export const loginGuard: CanActivateFn = (route, state) => {
   let helper = inject(HelperService)
    let router = inject(Router)
  // Get token from local storage
  let token = helper.get_local('token');
  // If the token exists, redirect to dashboard
  if (token) {
    router.navigate(['/dashboard/stock-summery/1']);
    return false;
  }

  return true; // Allow access to login page if no token is found
};
