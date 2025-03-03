import { HelperService } from './../../../services/helper.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    private api: AuthService,
    private router: Router,
    private Helper: HelperService
  ){}
  toggle_bars(){
    let valcall:boolean = !this.Helper.showsidebar()
    this.Helper.showsidebar.set(valcall)
    // if(this.Helper.showsidebar() == true){
    //   this.Helper.showsidebar.set(false)
    // }else{
    //    this.Helper.showsidebar.set(true)

    // }
  }
  logout(){

    // localStorage.clear()
    // this.router.navigateByUrl('login')
    this.api.logout_api(this.Helper.get_local('token')).subscribe((res) =>{ })
    localStorage.clear()
    this.router.navigateByUrl('login')

  }
}
