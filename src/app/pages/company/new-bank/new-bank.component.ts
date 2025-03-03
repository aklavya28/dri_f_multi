import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { ErrorStateMatcher } from '@angular/material/core';
import Swal from 'sweetalert2';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../layout/layout.component';

@Component({
  selector: 'app-new-bank',
  templateUrl: './new-bank.component.html',
  styleUrl: './new-bank.component.scss'
})
export class NewBankComponent implements OnInit, OnDestroy{
  sub_get_list_of_banks:Subscription | undefined
  sub_company_bank_account:Subscription | undefined
  bankForm!: FormGroup
  matcher:any
  listed_banks_api:any[] =[]
  constructor(
    private fb: FormBuilder,
    private dashapi: DashApiService,
    private  helper: HelperService,
    private router: Router,
    private layout: LayoutComponent
  ){}
  ngOnInit() {
    this.bankForm = this.newBank()
    this.matcher = new ErrorStateMatcher();
    let token = this.helper.get_local('token');
    this.sub_get_list_of_banks = this.dashapi.get_list_of_banks(token).subscribe((res:any)=>{
        this.listed_banks_api = res.data
    })
  }

  newBank(){
    return this.fb.group({
      bank_name: this.fb.control('', [Validators.required]),
      ac_holder_name: this.fb.control('', [Validators.required, CustomValidation.alphanumeric()]),
      ac_number: this.fb.control('', [Validators.required, CustomValidation.only_digit(), Validators.maxLength(30)]),
      ifsc: this.fb.control('', [Validators.required, CustomValidation.alphanumeric_without_space(), Validators.maxLength(11)]),
    })
  }
  submit(){
    let token = this.helper.get_local('token')
    let data ={
        bank_name: this.bankForm.get('bank_name')?.value,
        ac_holder_name: this.bankForm.get('ac_holder_name')?.value,
        ac_number:   this.bankForm.get('ac_number')?.value,
        ifsc: this.bankForm.get('ifsc')?.value
    }
    const bank = data
    console.log("data", bank)
    this.sub_company_bank_account = this.dashapi.company_bank_account(token, {bank}).subscribe((res:any) =>{
      Swal.fire({
        title: "Success",
        text: res.message,
        icon: "success"
      });
        this.helper.navigateAndActive(this.layout.menus(),'Company', 'company/banks', this.router, this.layout)
    }, err =>{
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.error.err_message,
        // footer: '<a href="#">Why do I have this issue?</a>'
      });
    })
  }
  ngOnDestroy(): void {
    this.sub_get_list_of_banks?.unsubscribe()
    this.sub_company_bank_account?.unsubscribe()
  }
}
