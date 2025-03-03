import { CanActivateFn, Router } from '@angular/router';
import { HelperService } from '../services/helper.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  let helper = inject(HelperService)
  let router = inject(Router)

  let token = helper.get_local('token');
    if (!token) {
      router.navigate(['/login']);
      return false;
    }
    if(route.url[0].path== "login"){
      router.navigate(['dashboard/stock-summery/1'])
            alert("Already Loged in")
          return false
    }
  return true;


  // // let url = route.url.toString
  //   if (token != undefined &&  route.url[0].path== "login" ){
  //       router.navigate(['dashboard/stock-summery/1'])
  //       alert("Already Loged in")
  //     return false
  //   }
  // return true;
};
