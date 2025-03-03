import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { DashApiService } from '../../../../services/dash-api.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { CustomValidation } from '../../../../interfaces/autocomplete-validation';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense-new',
  templateUrl: './expense-new.component.html',
  styleUrl: './expense-new.component.scss'
})
export class ExpenseNewComponent  implements OnInit, OnDestroy{
  sub_load_khata!:Subscription
  sub_save_expense_entry!:Subscription
  expenseForm!:FormGroup
  liquid:any[]=[]
  exp_cat:any[]=[]
  matcher:any
  balance_check_err:string[] = []
  payment_ledger_bal = 0


  loading: boolean = true; // For showing loading spinner
  constructor(
    private helper: HelperService,
    private dashapi: DashApiService,
    private fb: FormBuilder,
    private router: Router
    ){

    }


    ngOnInit() {
      this.expenseForm = this.form_loader()
      this.matcher = new ErrorStateMatcher();
      this.load_exp_cat()
      this.load_liquid()
    }
    form_loader(){
      return this.fb.group({
        expense_category_id: this.fb.control('', [Validators.required]),
        amount: this.fb.control('', [Validators.required, CustomValidation.only_digit(), Validators.max(1000000)]),
        transaction_date: ['', [Validators.required, CustomValidation.dateNotGreaterThanToday.bind(this)]],
        payment_ledger: this.fb.control('', [Validators.required]),
        remarks: this.fb.control('', [Validators.required, Validators.maxLength(70)]),
        payment_ledger_id: this.fb.control(null)
      })
    }
    load_exp_cat(){
      this.dashapi.get_expense_category(this.helper.get_local('token')).subscribe((res:any) =>{
        this.exp_cat = res.data
        this.loading = false;
      } ,   (err) => {
        console.error('Error loading data from API', err);
        this.loading = false;
      })
    }
    load_liquid(){
      this.sub_load_khata =  this.dashapi.get_liquid(this.helper.get_local('token')).subscribe((res:any)=>{
        this.liquid = res.data
        this.loading = false;
      } ,   (err) => {
        console.error('Error loading data from API', err);
        this.loading = false;
      })
    }

  getToday(): string {
      return new Date().toISOString().split('T')[0]
   }

   payment_mode(e:any){
    this.payment_ledger_bal = e.balance
    console.log(e)
    let payment_id= this.expenseForm.get('payment_ledger')?.value
    this.expenseForm.get('payment_ledger_id')?.setValue(payment_id.id)

   }
   submit(){
     let data =  this.expenseForm.value
      if (this.payment_ledger_bal < Number(this.expenseForm.get('amount')?.value)){
        this.balance_check_err = []
        this.balance_check_err.push(`Cannot pay amount of morethen available balance. Rs. ${this.payment_ledger_bal}`)
      }else{

        Swal.fire({
          text: "Are your sure you want to create new transation?",
          showDenyButton: true,
          confirmButtonText: "Save",
          }).then((result) => {

          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.sub_save_expense_entry  = this.dashapi.save_expense_entry(this.helper.get_local('token'), {data}).subscribe((res:any) =>{


              Swal.fire("Saved", "", "success");
              this.router.navigate(['entries/expense/', 1])
            }, err =>{
              Swal.fire("data not Saved", err.error.error, "error");
            })
            //
          }
        });

      }



  }


  ngOnDestroy(): void {
    this.sub_load_khata?.unsubscribe()
    this.sub_save_expense_entry?.unsubscribe()
  }

}
