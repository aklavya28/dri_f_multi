import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HelperService } from '../../../../services/helper.service';
import { DashApiService } from '../../../../services/dash-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-salary-settings',
  templateUrl: './edit-salary-settings.component.html',
  styleUrl: './edit-salary-settings.component.scss'
})
export class EditSalarySettingsComponent {
  sub_allowance_deduction_list: Subscription | undefined
  sub_get_advance_salary_payouts: Subscription | undefined
  sub_create_salary: Subscription | undefined
  sub_show_employee: Subscription | undefined
  oldSalaryData:any[] =[]
  // advance salary
    installment_amt:number = 0.0
    pending_amt_sum:number = 0.0
    payouts:any[] = []

  // advance salary




  salarySettingForm!:FormGroup
    slug:string = ''
    name:string = ''
    profile:any
    allowance:any[] =[]
    allowance_amount:number=0
    deduction_amount:number=0
    employer_fp:number=0
    advence_other:number=0
    wages_validation:any[] =[]

   constructor(
     private helper: HelperService,
     private dashapi: DashApiService,
     private router: Router,
     private activateroute: ActivatedRoute,
     private fb: FormBuilder,


   ){}
   ngOnInit(){
    let token = this.helper.get_local('token')

    this.salarySettingForm = this.salaryForm()

      this.activateroute.paramMap.subscribe((res:any) =>{
        this.slug = res.params.slug
        this.name = res.params.name
      })
      this.setSallaries()

          // get advance salary

          this.sub_get_advance_salary_payouts = this.dashapi.get_advance_salary_payouts(token, this.slug).subscribe((res:any) =>{
            this.installment_amt = res.current_installment_amt?.amount ? res.current_installment_amt?.amount : 0
            this.pending_amt_sum = res.sum
            this.payouts = res.payout
            // console.log("advance" ,res)
            console.log("advance" ,this.installment_amt,this.pending_amt_sum, this.payouts )

          })
          // get advance salary




      this.sub_show_employee = this.dashapi.show_employee(token, this.slug).subscribe((res:any) =>{
        // console.log("profile", res)
        this.profile = res.data

      })

      this.sub_allowance_deduction_list = this.dashapi.allowance_deduction_list(token).subscribe((res:any)=>{
        this.allowance = res
      })

      this.salarySettingForm.get('item')?.valueChanges.subscribe((res:any)=>{

        this.allowance_amount = 0
        this.deduction_amount = 0
        this.employer_fp = 0

          res.forEach((el:any) => {
            if(el.allowance_id.split(',')[1] === 'allowance'){
              this.allowance_amount += el.amount
            } else if(el.allowance_id.split(',')[1] === 'deduction'){
              if( el.allowance_id.split(',')[2].toLowerCase() === 'pf' ){
                this.deduction_amount += el.amount
                this.employer_fp += el.amount
              }else{
                this.deduction_amount += el.amount
              }
            }
          });
          // console.log("sdfsdfsdf", this.allowance_amount, this.deduction_amount, this.employer_fp)

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

    let re_cal_allownce = 0
    let re_cal_deduction = 0
    let re_cal_emp_pf = 0

    items.forEach((e:any) => {
      item_container.push(e.allowance_id);
      // console.log("e.allowance_id", e.allowance_id.split(",")[1])
      if(e.allowance_id.split(",")[1] == "allowance"){
        re_cal_allownce += e.amount
      } else  if(e.allowance_id.split(",")[1] == "deduction"){
        if (e.allowance_id.split(",")[2].toLowerCase() == "pf"){
          re_cal_emp_pf += e.amount
        }
        re_cal_deduction += e.amount
      }

    });

    // console.log("re", re_cal_deduction,re_cal_allownce, re_cal_emp_pf )
    let resArr = item_container.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    // console.log("resArr", resArr)
    if(item_container.length === resArr.length){

      let item_data = {item_data: items}

      let salary_data = {
          allwance: re_cal_allownce,
          deduction: re_cal_deduction,
          net_salary: re_cal_allownce - re_cal_deduction,
          gross_salary: re_cal_emp_pf + re_cal_allownce
       }


      let data = {slug: this.slug, salary_data: salary_data, item_data: item_data }
      let token = this.helper.get_local('token')

      this.sub_create_salary = this.dashapi.create_salary(token, data, item_data).subscribe((res:any)=>{
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
  setSallaries() {
    let token = this.helper.get_local('token')
    this.dashapi.show_employee(token, this.slug).subscribe((res:any) =>{
      this.oldSalaryData = res.data.salary_settings.item_data
      // console.log("oldSalaryData", this.oldSalaryData)
      this.removeWages(0)
      // console.log("old", this.oldSalaryData)
      this.oldSalaryData.forEach(x => {
        if(x.allowance_id !== "10,allowance,Employer PF Share"){
          this.allowancef.push(
            this.fb.group({
              allowance_id: x.allowance_id,
              amount: x.amount,
            })
          );
        }
      });
    })


  }













  ngOnDestroy(): void {
    this.sub_allowance_deduction_list?.unsubscribe()
    this.sub_create_salary?.unsubscribe()
    this.sub_show_employee?.unsubscribe()
   }





}
