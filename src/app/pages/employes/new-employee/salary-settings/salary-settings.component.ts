import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from '../../../../services/helper.service';
import { DashApiService } from '../../../../services/dash-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-salary-settings',
  templateUrl: './salary-settings.component.html',
  styleUrl: './salary-settings.component.scss'
})
export class SalarySettingsComponent  implements OnInit, OnDestroy{
  sub_allowance_deduction_list: Subscription | undefined
  sub_create_salary: Subscription | undefined
  sub_show_employee: Subscription | undefined

  salarySettingForm!:FormGroup
    slug:string = ''
    name:string = ''
    profile:any
    allowance:any[] =[]
    allowance_amount:number=0
    deduction_amount:number=0
    employer_fp:number=0
    wages_validation:any[] =[]

   constructor(
     private helper: HelperService,
     private dashapi: DashApiService,
     private router: Router,
     private activateroute: ActivatedRoute,
     private fb: FormBuilder,


   ){}
   ngOnInit(){

      console.log("settings")
      this.salarySettingForm = this.salaryForm()

     let token = this.helper.get_local('token')
      this.activateroute.paramMap.subscribe((res:any) =>{
        this.slug = res.params.slug
        this.name = res.params.name
      })

      this.sub_show_employee = this.dashapi.show_employee(token, this.slug).subscribe((res:any) =>{
        console.log("profile", res)
        this.profile = res.data
      })

      this.sub_allowance_deduction_list = this.dashapi.allowance_deduction_list(token).subscribe((res)=>{
        this.allowance = res
      })

      this.salarySettingForm.get('item')?.valueChanges.subscribe((res:any)=>{

        this.allowance_amount = 0
        this.deduction_amount = 0
        this.employer_fp = 0

          res.forEach((el:any) => {
            if(el.allowance_id.split(',')[1] === 'allowance'){
              this.allowance_amount += el.amount
            }
            if(el.allowance_id.split(',')[1] === 'deduction' ){
             if( el.allowance_id.split(',')[2].toLowerCase() === 'pf' ){
               this.deduction_amount += el.amount*2
               this.employer_fp += el.amount

             }else{
               this.deduction_amount += el.amount
             }
            }

          });
      })


   }
   salaryForm(){
      return this.fb.group({
          item: this.fb.array([this.allowanceForm()])
      })
   }
   get allowancef(){
      return this.salarySettingForm.get("item") as FormArray;
    }

   allowanceForm(){
    return this.fb.group({
      allowance_id: this.fb.control('', [Validators.required]),
      amount: this.fb.control('', [Validators.required])
     })
  }


   addNewWages(){
    this.allowancef.push(this.allowanceForm());
   }
   removeWages(i:Required<number>){
    this.allowancef.removeAt(i);
  }
  submit(){

    let item_container:number[]= []
    let items = this.salarySettingForm.get('item')?.value
    items.forEach((e:any) => {
      item_container.push(e.allowance_id);
    });
    let resArr = item_container.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    if(item_container.length === resArr.length){
      console.log("checking_items", items)
      let item_data = {item_data: items}
      let salary_data = {allwance: this.allowance_amount, deduction: this.deduction_amount, net_salary: (this.allowance_amount - (this.deduction_amount - this.employer_fp)), gross_salary: (this.allowance_amount + this.deduction_amount) }
      let data = {slug: this.slug, salary_data: salary_data, item_data: item_data }
      let token = this.helper.get_local('token')
      this.sub_create_salary = this.dashapi.create_salary(token, data, item_data).subscribe((res:any)=>{
        console.log(res)
        console.log(res)
            Swal.fire({
              position: "top-end",
              icon: "success",
              text: `${res.status}`,
              showConfirmButton: false,
              timer: 1500
            });
           this.router.navigate(['/employees/emp-profile', this.slug])

      }, (err:any) =>{
        Swal.fire({
          position: "top-end",
          icon: "warning",
          text: `${err.error.error}`,
          showConfirmButton: false,
          timer: 1500
        });
          // console.log(err)
      })
    }else{

      this.wages_validation = ["Duplicate allowance/deduction account. Please provide unique account."]
        this.wages_validation =[]
    }
  }
  ngOnDestroy(): void {
    this.sub_allowance_deduction_list?.unsubscribe()
    this.sub_create_salary?.unsubscribe()
    this.sub_show_employee?.unsubscribe()
   }
}
