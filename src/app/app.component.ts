import { Component, HostListener, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HelperService } from './services/helper.service';
import { LayoutComponent } from './pages/layout/layout.component';
import { filter } from 'rxjs';
import { MenuService } from './services/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent{
    // menus= signal(<any>[])
    currentRoute: string = '';
  title = 'dri_app_module_based';
  constructor(private router: Router, private layout: LayoutComponent,
    private helper: HelperService,
    private mService: MenuService
  ) {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      this.currentRoute = event.url;
      this.performGlobalAction(event.url); // Custom action
    });


  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {  // ✅ Explicitly define type
    if (event.ctrlKey && event.altKey && event.key === '0') {
      // this.router.navigate(['/accounting/new-order']);
      this.helper.navigateAndActive(this.layout.menus(),'Orders', 'accounting/new-order', this.router, this.layout)
    }
    if (event.ctrlKey && event.altKey && event.key === '1') {
      this.helper.navigateAndActive(this.layout.menus(),'Orders', 'accounting/sale-order', this.router, this.layout)

    }
    if (event.ctrlKey && event.altKey && event.key === '2') {
      this.helper.navigateAndActive(this.layout.menus(),'Khatabook', 'khatabook/khatabook-accounts/1', this.router, this.layout)

    }

  }
  performGlobalAction(route: string) {
    console.log(`Navigated to: ${route}`);
      let new_path = route.replace(/^\s*\//, "")
      let new_path_array = new_path.split("/")
      let menudata:any = this.mService.getMenus().forEach(menuItem => {
        let parentActive = false; // Track if any submenu is active
        menuItem.submenu.forEach((submenuItem:any) => {
          if (submenuItem.url === new_path) {
            submenuItem.isActive = true;  // ✅ Activate target submenu
            parentActive = true;          // ✅ Mark parent as active
          } else {
            submenuItem.isActive = false; // ❌ Deactivate others
          }
        });
        menuItem.active = parentActive; // ✅ Activate parent only if a submenu is active
      });
  }



}
