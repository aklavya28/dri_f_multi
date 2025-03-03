import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-bank',
  templateUrl: './edit-bank.component.html',
  styleUrl: './edit-bank.component.scss'
})
export class EditBankComponent implements OnInit, OnDestroy {
  sub_get_list_of_banks:Subscription | undefined
  update_company_bank_account:Subscription | undefined
  bankForm!: FormGroup
  matcher:any
  listed_banks_api:any[] =[]
  select_bank:any={}
  constructor(
    private fb: FormBuilder,
    private dashapi: DashApiService,
    private  helper: HelperService,
    private a_route: ActivatedRoute,
    private router: Router
  ){}
  ngOnInit() {


    this.bankForm = this.newBank()
    this.matcher = new ErrorStateMatcher();
    // let token = this.helper.get_local('token');
    // this.sub_get_list_of_banks  = this.dashapi.get_list_of_banks(token).subscribe((res:any)=>{
    //     this.listed_banks_api = res.data
    //    this.getparams()

    // })
    this.getparams()
  }
  getparams(){
    this.a_route.paramMap.subscribe((res:any) =>{
      // console.log()
      const data_json = JSON.parse(res.params.slug)
      this.select_bank = data_json
      // this.bankForm.get('bank_name')?.setValue(this.select_bank.bank_name)
      this.bankForm.get('ac_holder_name')?.setValue(this.select_bank.ac_holder_name)
      this.bankForm.get('ac_number')?.setValue(this.select_bank.ac_number)
      this.bankForm.get('ifsc')?.setValue(this.select_bank.ac_number)
      this.bankForm.get('slug')?.setValue(this.select_bank.slug)
    })
  }
  newBank(){

    return this.fb.group({
      // bank_name: this.fb.control('', [Validators.required]),
      ac_holder_name: this.fb.control('', [Validators.required, Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]),
      ac_number: this.fb.control('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      ifsc: this.fb.control('', [Validators.required, Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]),
      slug: this.fb.control(null),
    })
  }
  submit(){
    let token = this.helper.get_local('token')
    let data ={
        // bank_name: this.bankForm.get('bank_name')?.value,
        ac_holder_name: this.bankForm.get('ac_holder_name')?.value,
        ac_number:   this.bankForm.get('ac_number')?.value,
        ifsc: this.bankForm.get('ifsc')?.value,
        slug: this.bankForm.get('slug')?.value
    }

    const bank = data
    console.log("data", bank)
    this.update_company_bank_account  = this.dashapi.update_company_bank_account(token, {bank}).subscribe((res:any) =>{
        console.log(res)
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: `${res.message}`,
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['company/banks'])
    }, (err:any) =>{
      Swal.fire({
        position: "top-end",
        icon: "warning",
        text: `${err.error.err_message}`,
        showConfirmButton: false,
        timer: 1500
      });
    })
  }
  ngOnDestroy(): void {
    this.sub_get_list_of_banks?.unsubscribe()
    this.update_company_bank_account?.unsubscribe()
  }

}
