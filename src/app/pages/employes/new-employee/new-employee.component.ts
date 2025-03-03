import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { LayoutComponent } from '../../layout/layout.component';
import { Router } from '@angular/router';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';


@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrl: './new-employee.component.scss'
})
export class NewEmployeeComponent implements OnInit,OnDestroy {
  sub_nominee_relation:Subscription |undefined
  sub_create_employee:Subscription |undefined


  nominee_relation:any[] = []
  employeeForm!:FormGroup
  matcher:any
  today = new Date();
  server_erros:any[] = []

  constructor(
    private helper: HelperService,
    private dashapi: DashApiService,
    private fb: FormBuilder,
    private layout: LayoutComponent,
    private router: Router
  ){}
  ngOnInit() {
    let token = this.helper.get_local('token')
    this.sub_nominee_relation = this.dashapi.nominee_relation(token).subscribe((res)=>{

      this.nominee_relation = res.data
    })
    this.employeeForm = this.registerEmployee()

  }
  registerEmployee(){
    return this.fb.group({
        fullname: this.fb.control('', [Validators.required]),
        fathername: this.fb.control('', [Validators.required]),
        mobile: this.fb.control('', [Validators.required,Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
        email: this.fb.control('', [Validators.required, Validators.email]),
        dob: ['', [Validators.required, this.dateNotGreaterThanTodayValidator.bind(this)]],
        joining_date: ['',[Validators.required,this.dateNotGreaterThanTodayValidator.bind(this)] ],

        full_address: this.fb.control('', [Validators.required, Validators.maxLength(240), Validators.minLength(20)]),
        aadhaar: this.fb.control('', [Validators.required, Validators.maxLength(12), Validators.minLength(12), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
        pan: this.fb.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(10),CustomValidation      .pan()
        ]),
        designation: this.fb.control('', [Validators.required, Validators.maxLength(30)]),
        job_type: this.fb.control('', [Validators.required]),
        nominee_name: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
        relation_with_nominee: this.fb.control('', [Validators.required]),
        nominee_address: this.fb.control('', [Validators.required, Validators.maxLength(240), Validators.minLength(20)]),
        nominee_mobile: this.fb.control('', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),

    })
  }
  submit(){
    if (this.employeeForm.invalid) {
      // Show validation errors
      this.employeeForm.markAllAsTouched();  // Highlights invalid fields
      return;
    }
    else{


    const data:any = {
      full_name: this.employeeForm.get('fullname')?.value,
      fathername: this.employeeForm.get('fathername')?.value,
      mobile: this.employeeForm.get('mobile')?.value,
      email: this.employeeForm.get('email')?.value,
      dob: this.employeeForm.get('dob')?.value,
      joining_date: this.employeeForm.get('joining_date')?.value,
      full_address: this.employeeForm.get('full_address')?.value,
      aadhaar: this.employeeForm.get('aadhaar')?.value,
      pan:  this.employeeForm.get('pan')?.value,
      designation: this.employeeForm.get('designation')?.value,
      job_type: this.employeeForm.get('job_type')?.value,
      nominee_name: this.employeeForm.get('nominee_name')?.value,
      relation_with_nominee: this.employeeForm.get('relation_with_nominee')?.value,
      nominee_address: this.employeeForm.get('nominee_address')?.value,
      nominee_mobile: this.employeeForm.get('nominee_mobile')?.value,
    }
    // if (this.employeeForm.status == "VALID"){
      console.log(data)
      let token = this.helper.get_local('token')
      this.dashapi.create_employee(token, data).subscribe((res)=>{
        // console.log("res", res)
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500
        });
        this.helper.navigateAndActive(this.layout.menus(),'Employees', 'employees/all-employees', this.router, this.layout)
      }, (err:any) =>{
        this.server_erros = []
        this.server_erros.push(err.error.error)
        console.log(err.error.error)
      })
    // }
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
   this.sub_nominee_relation?.unsubscribe()
   this.sub_create_employee?.unsubscribe()
 }
 forceUppercaseConditionally(formControlName:any, event:any) {
      this.employeeForm.get(formControlName)?.setValue(event.target.value.toUpperCase());
  }
}
