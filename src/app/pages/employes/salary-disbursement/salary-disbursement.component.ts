import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LayoutComponent } from '../../layout/layout.component';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-salary-disbursement',
  templateUrl: './salary-disbursement.component.html',
  styleUrl: './salary-disbursement.component.scss'
})
export class SalaryDisbursementComponent implements OnInit, OnDestroy {
  sub_employees_salary_disbursement:Subscription | undefined
  sub_get_liquid:Subscription | undefined
  sub_create_employee_salaries:Subscription | undefined
  today = new Date();
  employees:any[] =[]
  matcher:any
  l_account:any[] = []
  apierror:any[] = []
  installment_ids:any[] = []
  disburseForm!:FormGroup
  // grid
  isChecked = false;
  selectedRowsData:any[] = [];
  emp_desburse_total:any
  // grid
  // totals of salaries
    totalAllowances:number = 0
    totalPf:number = 0
    totalDeductions:number = 0
    totalAdvance:number = 0
    totalNetSalaries:number = 0
    totalGrossSalaries:number = 0
  // totals of salaries

  is_spinner:boolean = false
  is_liquied:boolean = false


  constructor(
    private helper: HelperService,
    private dashapi: DashApiService,
    private fb: FormBuilder,
    private layout: LayoutComponent,
    private router: Router,
    private spinner: NgxSpinnerService
  ){}

  ngOnInit(): void {
    let token = this.helper.get_local('token')
    // form
    this.sub_get_liquid = this.dashapi.get_liquid(token).subscribe((res:any) => {
      this.is_liquied= true
      this.l_account = res.data
      this.disburseForm = this.salaryForm()
    })
    this.loadEmp(token)
  }
  loadEmp(token:string){
    this.is_spinner = true
    this.spinner.show()
    this.sub_employees_salary_disbursement = this.dashapi.employees_salary_disbursement(token).subscribe((res:any) =>{
          this.employees = res.data
          this.spinner.hide()
          this.is_spinner = false
    }, err =>{
        this.spinner.hide()
        this.is_spinner = false
    })

  }

  salaryForm(){
    return this.fb.group({
      paid_from: this.fb.control('', [Validators.required]),
      salary_date: [Validators.required, this.dateNotGreaterThanTodayValidator.bind(this)],

    })
  }



  onCheckboxChange(item:any){
    if(item.checked == true){
      // console.log("test",item)
      this.selectedRowsData.push(item)
    }else{
      this.selectedRowsData = this.selectedRowsData.filter(row => row.slug != item.slug)
    }

    this.totalAllowances = 0
    this.totalDeductions = 0
    this.totalAdvance = 0
    this.totalNetSalaries = 0
    this.totalGrossSalaries = 0
    this.totalPf = 0
    this.installment_ids = []
    this.selectedRowsData.forEach((e) =>{

      e.break_up.item_data.forEach((pf:any) =>{
        if(pf.allowance_id.split(',')[2].toLowerCase() === 'pf'){
          this.totalPf +=e.amount
        }
        // console.log("e", pf.allowance_id.split(',')[2].toLowerCase() === 'pf')
        // console.log("e", this.totalPf)
      })
      console.log("e", e)

      this.totalAllowances +=e.allwance
      this.totalDeductions +=e.deduction
      this.totalAdvance += e.installment
      this.totalNetSalaries +=e.net_salary
      this.totalGrossSalaries +=e.gross_salary
      // console.log("value", e.installment_id)
      if(e.installment_id){
       this.installment_ids?.push(e.installment_id)
      }

    })
    console.log("items sdfsdfsdfdfd" ,JSON.stringify(this.installment_ids),this.installment_ids)
  }

  submit(){
    if (this.disburseForm.invalid) {
      // Show validation errors
      this.disburseForm.markAllAsTouched();  // Highlights invalid fields
      return;
    }else{
      let cr_ledger_id = this.disburseForm.get('paid_from')?.value
      let salary_date = this.disburseForm.get('salary_date')?.value

      this.apierror = []
      if(this.selectedRowsData.length <1){
        this.apierror.push("Please Select Employee")
          this.apierror = []
      }else{
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
            let token = this.helper.get_local('token')
            let data = {
              order_data: {
                allowances: this.totalAllowances ,
                deductions: this.totalDeductions,
                installment: this.totalAdvance,
                net_salaries: this.totalNetSalaries,
                gross_salaries: this.totalGrossSalaries,
                cr_ledger_id: cr_ledger_id,
                salary_date: salary_date,
                installment_ids: this.installment_ids
              },
            entry_data: this.selectedRowsData
            }
            console.log(data)

            this.sub_create_employee_salaries = this.dashapi.create_employee_salaries(token, data).subscribe((res) =>{
              console.log(res)
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Salary Disbursed Successfully",
                showConfirmButton: false,
                timer: 1500
              });
              this.helper.navigateAndActive(this.layout.menus(),'Employees', 'employees/disbursement-history', this.router, this.layout)
            }, err =>{
              this.apierror.push(err.error.error)
              console.log(err)
                this.apierror = []
            })

          }
        })
        // confirm

    }

  }



  }

  dateNotGreaterThanTodayValidator(control: FormControl) {
    const selectedDate = new Date(control.value);
    return selectedDate <= this.today ? null : { dateGreaterThanToday: true };
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
 }

  ngOnDestroy(): void {
    this.sub_employees_salary_disbursement?.unsubscribe()
    this.sub_get_liquid?.unsubscribe()
  }
}
