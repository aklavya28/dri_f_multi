import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import Swal from 'sweetalert2';
import { LayoutComponent } from '../../layout/layout.component';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-advence-salary',
  templateUrl: './advence-salary.component.html',
  styleUrl: './advence-salary.component.scss'
})
export class AdvenceSalaryComponent implements OnInit, OnDestroy {
  sub_get_active_employees!: Subscription
  sub_get_liquid!: Subscription
  sub_create_advance_salary!: Subscription
  salaryForm!:FormGroup
  l_account:any[] =[]
  employees:any[] =[]
  emp_slug:string =''
  constructor(
    private fb:FormBuilder,
    private helper: HelperService,
    private dashapi: DashApiService,
    private layout: LayoutComponent,
    private router: Router
  ){}
  ngOnInit(): void {
    let token = this.helper.get_local('token')
    this.sub_get_active_employees = this.dashapi.get_active_employees(token).subscribe((res:any) => {
      console.log("employess", res.data)
      this.employees = res.data
    })
    this.sub_get_liquid = this.dashapi.get_liquid(token).subscribe((res:any) => {
      this.l_account = res.data
    })
    this.salaryForm = this.loadForm()
  }
  loadForm(){
    return this.fb.group({
      employee_id_main: this.fb.control('', [Validators.required]),
      employee_id: [''],
      amount: this.fb.control('', [Validators.required, Validators.min(1000), Validators.max(1000000)]),
      tenure: this.fb.control('', [Validators.required, Validators.max(12), Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      payment_ledger_id: this.fb.control('', [Validators.required])

    })
  }
  employee_slug(e: MatSelectChange){
    this.emp_slug = ''
    this.emp_slug = e.value.slug
    this.salaryForm.get('employee_id')?.setValue(e.value.id)
  }

  submit(){
    if(this.salaryForm?.valid){
      let token = this.helper.get_local('token')
      let data = this.salaryForm?.value
      // console.log("data",data)

       // confirm
       Swal.fire({
        title: "Are you sure? ",
        text: 'This action cannot be reverted',
         showCancelButton: true,
        confirmButtonText: 'Confirm',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.sub_create_advance_salary = this.dashapi.create_advance_salary(token, {data}).subscribe((res:any) =>{
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Salary Disbursed Successfully",
              showConfirmButton: false,
              timer: 1500
            });
            this.helper.navigateAndActive(this.layout.menus(),'Employees', 'employees/emp-profile/'+this.emp_slug, this.router, this.layout)
          }, err =>{
            Swal.fire({
              position: "center",
              icon: "error",
              text: err.error.error,
            });
          })
        }

      })

  }}
  ngOnDestroy(): void {
    this.sub_get_active_employees.unsubscribe()
    this.sub_get_liquid.unsubscribe()
    // this.sub_create_advance_salary.unsubscribe()
  }
}
