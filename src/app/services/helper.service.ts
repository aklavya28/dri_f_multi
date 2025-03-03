import { map } from 'rxjs';
import { Injectable, Signal, signal } from '@angular/core';

import { Router } from '@angular/router';
import { MenuService } from './menu.service';


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  showsidebar = signal<boolean>(true)
  siglanmenu = signal<boolean>(false)

  numRegex = /^-?\d*[.,]?\d{0,2}$/;

  constructor(
   private mService: MenuService

  ) { }
  get_local(local_s_type:string){
    let c_user:any = localStorage.getItem(local_s_type);
          let json_user = JSON.parse(c_user)
          return json_user
  }
  company_id(){
    let c_user:any = localStorage.getItem('current_user');
    let json_user = JSON.parse(c_user)
      return json_user.body.status.data.company_id
  }
  current_user_id(){
    let c_user:any = localStorage.getItem('current_user');
    let json_user = JSON.parse(c_user)
      return json_user.body.status.data.id
  }
  current_user(){
    let c_user:any = localStorage.getItem('current_user');
    let json_user = JSON.parse(c_user)
      return json_user.body.status.data
  }

  navigateAndActive(menus:any,top_nav:string, navigate_url:string, router:any, layout:any){
    console.log(this.mService.getMenus())
      // const mapmenu = menus.map((data:any) =>{


      const mapmenu = this.mService.getMenus().map((data:any) =>{
         return {
          ...data,
          active: top_nav === data.name ? true : false,
          submenu: data.submenu.map((sub:any) =>{
            return{
              ...sub,
              isActive: navigate_url === sub.url ? true : false,
              pName: data.name
            }
          })
         }
      })
      localStorage.setItem('menu_json', JSON.stringify(mapmenu))
      // layout.menus.set(mapmenu)
      this.mService.setMenus(mapmenu)
      console.log("sunil ", mapmenu)
      router.navigate([navigate_url])

  }
  getToday(): string {
    return new Date().toISOString().split('T')[0]
 }
}
