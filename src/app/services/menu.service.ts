import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menus = signal<any[]>([]);

  setMenus(data: any[]) {
    this.menus.set(data);
  }
  getMenus(){
    return this.menus()
  }
}
