
import {   Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import {ErrorStateMatcher} from '@angular/material/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../layout/layout.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-allote-share',
  templateUrl: './allote-share.component.html',
  styleUrl: './allote-share.component.scss',



})
export class AlloteShareComponent implements OnInit, OnDestroy {
  subscription_add_share_to_promoter:Subscription |undefined
  // select
  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:IDropdownSettings = {};
  _e_allotment_date:boolean = false
  userlist:any
  matcher:any
  api_share_val:number =0
  isLoading:boolean = false;
  // form groups
  cheque_group_show:boolean= false
  bank_group_show:boolean= false

  // form groups
  // select


  promoterShareForm!: FormGroup
  constructor(
    private fb: FormBuilder,
    private dashapi: DashApiService,
    private helper: HelperService,
    private router: Router,
    private layout: LayoutComponent
    ){
    }
    ngOnInit(): void {
        this.promoterShareForm = this.fb.group({
          choose_promoter: this.fb.control('', [Validators.required]),
          allotment_date: this.fb.control('', [Validators.required]),
          no_of_shars: this.fb.control('',[Validators.required, Validators.min(1)
          ]),
          share_val: this.fb.control({value:'', disabled: true }),

          payment_mode: this.fb.control('', [Validators.required]),
          cheque_group: this.fb.group({
            name_of_bank: this.fb.control(null),
            cheque_no: this.fb.control(null),
          }),
          bank_group: this.fb.group({
            name_of_bank: this.fb.control(null),
            utr_no: this.fb.control(null),
          })

        })
        this.matcher = new ErrorStateMatcher();



        // on payment mode change
          this.promoterShareForm.get('payment_mode')?.valueChanges.subscribe((res)=>{
            this.promoterShareForm.get('bank_group')?.reset()
            this.promoterShareForm.get('cheque_group')?.reset()
            if(res == 'cheque'){
              console.log(res)
              this.bank_group_show = false
              this.cheque_group_show = true
              this.removeValidationBank()
              this.addValidation()
            }else if(res =='bank'){
              console.log(res)
              this.removeValidation()
              this.cheque_group_show = false
              this.bank_group_show = true
              this.addValidationBank()
            }
            else{
              console.log(res)
              this.cheque_group_show = false
              this.bank_group_show = false
              this.removeValidation()
              this.removeValidationBank()
            }
          })
        // on payment mode chage





        // select
        let token = this.helper.get_local('token');
           this.dashapi.all_promoters(token).subscribe(async (res:any)=>{
            localStorage.setItem('share',  res.share)
            this.api_share_val = Number(localStorage.getItem('share'))
            this.promoterShareForm.get('share_val')?.setValue(this.api_share_val)

            let data = res.data.map((user:any) =>{
              return {item_id: user.id, item_text: user.f_name+' '+ user.l_name +" "+user.email  }
            })
            this.dropdownList = data
            this.dropdownSettings = {
              singleSelection: true,
              idField: 'item_id',
              textField: 'item_text',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              itemsShowLimit: 3,
              allowSearchFilter: true,
              closeDropDownOnSelection: true
            };
            console.log('inner', this.dropdownList)
          }, (err) =>{
            console.log(err)
          })

    }

    // select

      onItemSelect(item: any) {
        console.log(item);
      }
      onSelectAll(items: any) {
        console.log(items);
      }
    // select
    get f(): { [key: string]: AbstractControl } {
      return this.promoterShareForm.controls;
    }
    processData() {
      // Access this.data here or perform any operations
      console.log(this.userlist);
    }
    addPromoterShareForm(){
      this.promoterShareForm.get('choose_promoter')?.invalid ? this._e_allotment_date = true : this._e_allotment_date = false;

      this.isLoading = true
      let token  = this.helper.get_local('token')
      let current_user  = this.helper.get_local('current_user')
      let compay_id = current_user.body.status.data.company_id
      let nominal_value = Number(this.api_share_val)
      let total_shares =  Number( this.promoterShareForm.get('no_of_shars')?.value)

      let allotment_date = this.promoterShareForm.get('allotment_date')?.value
      let user_id = this.promoterShareForm.get('choose_promoter')?.value[0].item_id
      // payment details
      let payment_mode = this.promoterShareForm.get('payment_mode')?.value
      let name_of_bank_cheque = this.promoterShareForm.get('cheque_group.name_of_bank')?.value
      let cheque_no = this.promoterShareForm.get('cheque_group.cheque_no')?.value
      let name_of_bank_bank = this.promoterShareForm.get('bank_group.name_of_bank')?.value
      let utr_no = this.promoterShareForm.get('bank_group.utr_no')?.value
      const payment_dtl = {
        payment_mode: payment_mode,
        name_of_bank: payment_mode == 'bank' ? name_of_bank_bank : name_of_bank_cheque,
        cheque_no: cheque_no,
        utr_no: utr_no
      };

      // console.log(payment_dtl)
      // payment details




     this.subscription_add_share_to_promoter =this.dashapi.add_share_to_promoter(
        token,
        nominal_value,
        total_shares,
        allotment_date,
        user_id,
        compay_id,
        payment_dtl
      ).subscribe((res) =>{
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: res.message,
          showConfirmButton: false,
          timer: 1500
        });
        this.helper.navigateAndActive(this.layout.menus(),'Promoters','promoters/all', this.router, this.layout)

      }, (err) =>{
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.error.err_message,
          // footer: '<a href="#">Why do I have this issue?</a>'
        });
      })

    }
    addValidation() {
      // add
      this.promoterShareForm.get('cheque_group.name_of_bank')?.setValidators([Validators.required])
      this.promoterShareForm.get('cheque_group.cheque_no')?.setValidators([Validators.required])
      // update
      this.promoterShareForm.get('cheque_group.name_of_bank')?.updateValueAndValidity()
      this.promoterShareForm.get('cheque_group.cheque_no')?.updateValueAndValidity()
    }
    removeValidation() {
      // clear
      this.promoterShareForm.get('cheque_group.name_of_bank')?.clearValidators();
      this.promoterShareForm.get('cheque_group.cheque_no')?.clearValidators();
      // update
      this.promoterShareForm.get('cheque_group.name_of_bank')?.updateValueAndValidity();
      this.promoterShareForm.get('cheque_group.cheque_no')?.updateValueAndValidity();

    }
    addValidationBank() {
      // add
      this.promoterShareForm.get('bank_group.name_of_bank')?.setValidators([Validators.required])
      this.promoterShareForm.get('bank_group.utr_no')?.setValidators([Validators.required])
      // update
      this.promoterShareForm.get('bank_group.name_of_bank')?.updateValueAndValidity()
      this.promoterShareForm.get('bank_group.utr_no')?.updateValueAndValidity()
    }
    removeValidationBank() {
      // clear
      this.promoterShareForm.get('bank_group.name_of_bank')?.clearValidators();
      this.promoterShareForm.get('bank_group.utr_no')?.clearValidators();
      // update
      this.promoterShareForm.get('bank_group.name_of_bank')?.updateValueAndValidity();
      this.promoterShareForm.get('bank_group.utr_no')?.updateValueAndValidity();




    }
    ngOnDestroy(): void {
      this.subscription_add_share_to_promoter?.unsubscribe()
    }
}
