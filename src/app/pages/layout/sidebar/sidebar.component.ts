
import { Component, OnInit, Input } from '@angular/core';
// import { Component, OnInit} from '@angular/core';
import { Config, Menu } from './types';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',

})
export class SidebarComponent implements OnInit{
  @Input() options: any;
  @Input() menus: Menu[] | any;
  config: Config | any;


  constructor() {
		// customize default values of accordions used by this component tree

	}
  ngOnInit() {
    this.config = this.mergeConfig(this.options);
  }
  mergeConfig(options: Config) {
    // 기본 옵션
    const config = {
      // selector: '#accordion',
      multi: true
    };

    return { ...config, ...options };
  }

  toggle(index: number) {
    // 멀티 오픈을 허용하지 않으면 타깃 이외의 모든 submenu를 클로즈한다.

    if (!this.config.multi) {

      this.menus.filter(
        (menu:any, i:any) => i !== index && menu.active
      ).forEach((menu:any) => menu.active = !menu.active);
    }

    // Menu의 active를 반전
    this.menus[index].active = !this.menus[index].active;
  }



  addactive(e:any){

    for(let topmenu of this.menus){
      for(let submenu of topmenu.submenu){
        submenu.isActive = false
      }
    }

    e.isActive = true
    localStorage.setItem('menu_json', JSON.stringify(this.menus))
  }

}
