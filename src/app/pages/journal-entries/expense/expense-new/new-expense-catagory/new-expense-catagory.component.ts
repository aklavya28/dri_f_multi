import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from '../../../../../services/helper.service';
import { DashApiService } from '../../../../../services/dash-api.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../../../../interfaces/autocomplete-validation';

@Component({
  selector: 'app-new-expense-catagory',
  templateUrl: './new-expense-catagory.component.html',
  styleUrl: './new-expense-catagory.component.scss'
})
export class NewExpenseCatagoryComponent implements OnInit, OnDestroy {
  sub_get_exp_categories!:Subscription
  sub_change_active_exp_categories !:Subscription
  categories:any[] = []
  catForm!:FormGroup
  balance_check_err:string[] = []

  constructor(
    private helper: HelperService,
    private dashapi: DashApiService,
    private fb: FormBuilder

  ){}
  ngOnInit(): void {
     this.load_data()
     this.catForm = this.load_form()
  }

  load_data(){
    this.categories = []
    this.dashapi.get_exp_categories(this.helper.get_local('token')).subscribe((res:any) =>{
      this.categories = res.data
     })
  }
  load_form(){
   return  this.fb.group({
      name: this.fb.control('', [Validators.required, CustomValidation.alphanumeric(), Validators.maxLength(30)])
   })
  }

  change_active_exp_cat(id:any, e:any){

      console.log(e.checked)
      e.checked = !e.checked
      let token = this.helper.get_local('token')
      this.sub_change_active_exp_categories = this.dashapi.change_active_exp_categories(token,Number(id) ).subscribe((res)=>{

        Swal.fire({
          position: "center",
          icon: "success",
          width:'300px',
          imageWidth:"70px",
          text: "Status changed Successfully",
          showConfirmButton: false,
          timer: 1500
        });
      })

  }
  submit(){
    let data = this.catForm.value
    this.dashapi.save_expense_category(this.helper.get_local('token'), data).subscribe((res:any) =>{
      Swal.fire({
        position: "center",
        icon: "success",
        width:'300px',
        imageWidth:"70px",
        text: "Saved Successfully",
        showConfirmButton: false,
        timer: 1500
      });
      this.load_data()
    }, err =>{
      this.balance_check_err = []
      this.balance_check_err.push(`${err.error.error} `)
        this.balance_check_err = []
    })
  }



  ngOnDestroy(): void {
    this.sub_get_exp_categories?.unsubscribe()
    this.sub_change_active_exp_categories?.unsubscribe()
  }
}
