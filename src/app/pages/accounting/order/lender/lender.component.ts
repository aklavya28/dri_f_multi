import { Component } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CustomValidation } from '../../../../interfaces/autocomplete-validation';
import { HelperService } from '../../../../services/helper.service';
import { DashApiService } from '../../../../services/dash-api.service';
import { LayoutComponent } from '../../../layout/layout.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lender',
  templateUrl: './lender.component.html',
  styleUrl: './lender.component.scss'
})
export class LenderComponent {
  sub_new_lander!:Subscription
  newLenderForm!:FormGroup
  updating = false;
  api_validation:any[] = []
  constructor(
    private fb: FormBuilder,
    private helper: HelperService,
    private dashapi: DashApiService,
    private layout: LayoutComponent,
    private router: Router
  ){}


  ngOnInit() {
    this.newLenderForm = this.newKhataFuntion()
    // on change validations
      this.newLenderForm.get('email')?.valueChanges.subscribe((res:any) =>{
        let val = this.newLenderForm.get('email')?.value
          val ? this.email_add_validation() : this.remove_validation('email')
      })


       this.newLenderForm.get('tan')?.valueChanges.subscribe((res:any) =>{
          res ? this.tan_add_validation() : this.remove_validation('tan')
          // console.log(res.length !== 0)
      })

      this.newLenderForm.get('company_name')?.valueChanges.subscribe((res:any) =>{
        res ? this.company_add_validation() : this.remove_validation('company_name')
        // console.log(res.length !== 0)
      })
      this.newLenderForm.get('gst')?.valueChanges.subscribe((res:any) =>{

          res ? this.gst_add_validation() : this.remove_validation('gst')
          // console.log(res.length !== 0)
      })
      this.newLenderForm.get('pan')?.valueChanges.subscribe((res:any) =>{
          res ? this.pan_add_validation() : this.remove_validation('pan')
      })
        this.newLenderForm.get('aadhar')?.valueChanges.subscribe((res:any) =>{
          res ? this.aadhar_add_validation() : this.remove_validation('aadhar')
      })
    // on change validations

  }
  newKhataFuntion(){
    return this.fb.group({
      account_type: this.fb.control('', [Validators.required]),
      name:   this.fb.control('', [Validators.required,CustomValidation.alphabets()]),
      mobile: this.fb.control('',[Validators.required, Validators.minLength(10), CustomValidation.only_digit()]),
      aadhar: this.fb.control(null),
      email:  this.fb.control(null),
      // bussiness
      company_name: this.fb.control(null),
      gst:          this.fb.control(null),
      pan:         this.fb.control(null),
      tan:          this.fb.control(null),
      // address
      address:      this.fb.control('', [Validators.required, Validators.maxLength(70)]),
    })
  }
  email_add_validation(){
    this.newLenderForm.get('email')?.setValidators([Validators.email])
  }
  tan_add_validation(){
    this.newLenderForm.get('tan')?.setValidators([Validators.minLength(10), Validators.minLength(10), CustomValidation.alphanumeric_without_space()] )
  }
  company_add_validation(){
    this.newLenderForm.get('company_name')?.setValidators([Validators.minLength(5), Validators.maxLength(30),CustomValidation.alphanumeric()] )
  }
  gst_add_validation(){
    this.newLenderForm.get('gst')?.setValidators([Validators.minLength(15), Validators.minLength(15), CustomValidation.alphanumeric_without_space()] )
  }
  pan_add_validation(){
    this.newLenderForm.get('pan')?.setValidators([Validators.minLength(10),CustomValidation.pan()] )
  }
 aadhar_add_validation(){
    this.newLenderForm.get('aadhar')?.setValidators( [Validators.minLength(12), CustomValidation.only_digit()] )
  }


  // remove
  remove_validation(col_name:string){



    this.newLenderForm.get(col_name)?.clearValidators()
    if (this.updating) return;
    this.updating = true;
    this.newLenderForm.get(col_name)?.updateValueAndValidity();
    this.updating = false;
  }

  submit(){
   let data = this.newLenderForm?.value
    // console.log(data?.account_type)
    data?.account_type.includes("debtor") ?  data.is_debtor = true :  data.is_debtor = false
    data?.account_type.includes("creditor") ?  data.is_creditor = true :  data.is_creditor = false

  //  data.is_lander = true
    // console.log(data)
    let token = this.helper.get_local('token')


    this.sub_new_lander = this.dashapi.new_khata(token, {data:data}).subscribe((res:any) =>{
      console.log(res)
      // Swal.fire({
      //   title: "Success",
      //   text: res.status,
      //   icon: "success"
      // });
      // this.helper.navigateAndActive(this.layout.menus(),'Khatabook', 'khatabook/khatabook-accounts', this.router, this.layout)
    }, (err:any) =>{

      err.error.err_message.forEach((el:any) =>{
        this.api_validation.push(el)
      })
        this.api_validation = []
    })
  }

  ngOnDestroy(): void {
    this.sub_new_lander?.unsubscribe()
  }
}
