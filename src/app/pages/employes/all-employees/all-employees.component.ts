import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutComponent } from '../../layout/layout.component';
import { Router } from '@angular/router';
import { HelperService } from '../../../services/helper.service';
import { Subscription } from 'rxjs';
import { DashApiService } from '../../../services/dash-api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrl: './all-employees.component.scss'
})
export class AllEmployeesComponent implements OnInit, OnDestroy {
  sub_show_employees:Subscription | undefined
  employees:any[] = []
  is_spinner:boolean = false
  constructor(
    private layout: LayoutComponent,
    private router: Router,
    private helper: HelperService,
    private dashapi: DashApiService,
    private spinner: NgxSpinnerService
  ){}
  ngOnInit(){
    let token = this.helper.get_local('token')
    this.is_spinner = true
    this.spinner.show()
    this.sub_show_employees = this.dashapi.show_employees(token).subscribe((res:any) =>{
        this.is_spinner = false
        this.spinner.hide()
        this.employees = res.data
    }, err =>{
      this.is_spinner = false
      this.spinner.hide()
    })
  }

  routeToNew(){
    console.log("dfdsfdf")
    this.helper.navigateAndActive(this.layout.menus(),'Employees', 'employees/new-employee', this.router, this.layout)
  }
  ngOnDestroy(): void {
    this.sub_show_employees?.unsubscribe()
  }
}
