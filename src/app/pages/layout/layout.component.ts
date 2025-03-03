
import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, WritableSignal, computed, effect, signal } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { Config, Menu } from './sidebar/types';
import { Router } from '@angular/router';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  animation,
  // ...
} from '@angular/animations';

import { AuthService } from '../../services/auth.service';
import { MenuService } from '../../services/menu.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  // animations: [

  //   trigger('Sidebar', [
  //     state('open', style({
  //       opacity: 1,
  //       backgroundColor: 'red'
  //     })),
  //     state('closed', style({
  //       opacity: 0,
  //       backgroundColor: 'green'
  //     })),

  //     transition('* => open', [
  //       animate('0.5s')
  //     ]),

  //   ]),

  // ]
})
export class LayoutComponent  implements OnInit{

  isOpen = true;
  showsidebar:boolean= this.helper.showsidebar()

  options: Config = { multi: false };
  current_user:any;
  @Input() opened: boolean = true



  staticdata = [
    {
    name: 'Dashboard',
    iconClass: 'fa fa-code',
    iconUrl: 'dashboard.png',
    active: false,
    submenu: [
      { name: 'Stock Register', url: 'dashboard/stock-register/1', isActive: false},
      { name: 'Stock Summery', url: 'dashboard/stock-summery/1', isActive: false},
      { name: 'Fixed Assets', url: 'dashboard/fixed-assets/1', isActive: false},
      // { name: 'Trial Balance', url: 'dashboard/trial-balance', isActive: false},
      { name: 'Trial Balance', url: 'dashboard/trial-balance-new', isActive: false},
      { name: 'Daybook', url: 'dashboard/daybook', isActive: false},
      { name: 'Income Statement', url: 'dashboard/income-statement', isActive: false},
    ]
  },
  {
    name: 'Company',
    iconClass: 'fa fa-code',
    iconUrl:'company.png',
    active: false,
    submenu: [
      { name: 'Users', url: 'company/users', isActive: false},
      // { name: 'Register New User', url: 'company/create-new-user', isActive: false},
      // { name: 'User Roles', url: 'company/user-role', isActive: false},
      { name: 'Company Banks', url: 'company/banks', isActive: false},
      { name: 'Promoters', url: 'company/promoters', isActive: false},

      // { name: 'New Bank', url: 'company/new-bank', isActive: false},

    ]
  },
  {
    name: 'Manage Items',
    iconClass: 'fa fa-mobile',
    iconUrl: 'settings.png',
    active: false,
    submenu: [
      { name: 'All Categories', url: 'store/show-categories', isActive: false },
      { name: 'Products', url: 'store/all-products', isActive: false },
      { name: 'Services', url: 'store/sale-services', isActive: false },

    ]
  },
  {
    name: 'Parties',
    iconClass: 'fa fa-mobile',
    iconUrl:'khatabook.png',
    active: false,
    submenu: [
      { name: 'Accounts', url: 'khatabook/khatabook-accounts/1', isActive: false },
      { name: 'New Party', url: 'khatabook/new-khata', isActive: false },
      // { name: 'New Lander', url: 'khatabook/new-lender', isActive: false },

    ]
  },
  // {
  //   name: 'Promoters',
  //   iconClass: 'fa fa-code',
  //   active: false,
  //   submenu: [
  //     { name: 'Promoters', url: 'promoters/all', isActive: false},
  //     { name: 'Allocate Shares', url: 'promoters/allocate-share', isActive: false },

  //   ]
  // },

  {
    name: 'Employees',
    iconClass: 'fa fa-mobile',
    iconUrl:'employees.png',
    active: false,
    submenu: [
      { name: 'Employees', url: 'employees/all-employees', isActive: false },
      { name: 'Advance Salary', url: 'employees/Advance-salary', isActive: false },
      { name: 'Salary Disbursement', url: 'employees/salary-disbursement', isActive: false },
      { name: 'Disbursement History', url: 'employees/disbursement-history', isActive: false },
      { name: 'Add New Employee', url: 'employees/new-employee', isActive: false },


    ]
  },
  {
    name: 'Entries',
    iconClass: 'fa fa-globe',
    iconUrl:'entries.png',
    active: false,
    submenu: [
      { name: 'Accounting Entries', url: 'entries/accounting-entries/1' , isActive: false},
      { name: 'Journal Entry', url: 'entries/view/1' , isActive: false},
      { name: 'Expense Entry', url: 'entries/expense/1' , isActive: false},
      // { name: 'Journal Entry', url: 'entries/asset' , isActive: false},
      ]
  },


  {
    name: 'Accounting',
    iconClass: 'fa fa-globe',
    iconUrl:'accounting.png',
    active: false,
    submenu: [
      { name: 'Ledgers', url: 'accounting/ledgers' , isActive: false},
      { name: 'New Ledger', url: 'accounting/new-ledger' , isActive: false},
    ]
  },
  {
    name: 'Orders',
    iconClass: 'fa fa-globe',
    iconUrl:'order.png',
    active: false,
    submenu: [
      { name: 'Orders', url: 'accounting/orders/1' , isActive: false},
      { name: 'Purchase Order', url: 'accounting/new-order', isActive: false },
      { name: 'Sale Order', url: 'accounting/sale-order', isActive: false },
    ]
  }

];
  // menus= signal(<any>[])
  // menus:any = () =>{
  //   this.mService.menus()
  // }
  menus = computed(() => this.mService.menus());

  effect = effect(() =>{
    this.isOpen = this.helper.showsidebar()
    this.showsidebar = this.helper.showsidebar()

  })
  isNavbarFixed = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isNavbarFixed = window.scrollY > 0;
    }



  constructor(private helper: HelperService,private router: Router,
    private mService: MenuService,
    private api: AuthService){

    // this.menus.set(this.staticdata)
    this.mService.setMenus(this.staticdata)

  }

  ngOnInit(){
    let stored_menu =  this.helper.get_local('menu_json')
    if (stored_menu){
        // this.menus.set(stored_menu)
        this.mService.setMenus(stored_menu)

      }
      let helper_current_usr = this.helper.current_user()
      this.current_user = {
        name: `${helper_current_usr?.f_name} ${helper_current_usr?.l_name} `,
        email: helper_current_usr?.email,
      }

  }


  // activesubmenu(currentUrl: string) {
  //   console.log("current _9", currentUrl)

  //   this.menus.forEach(menu => {
  //     menu.submenu.forEach(submenu => {
  //       if (currentUrl.includes(submenu.url)) {
  //         submenu.isActive = true;
  //         menu.active = true;

  //       }else{
  //         submenu.isActive = false;
  //         menu.active = false
  //       }
  //     });
  //   });
  // }
  logout(){
    console.log("dsfsdf")
    this.api.logout_api(this.helper.get_local('token')).subscribe((res) =>{ })
    localStorage.clear()
    this.router.navigateByUrl('login')

  }


}
