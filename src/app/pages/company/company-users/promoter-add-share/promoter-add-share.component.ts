import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DashApiService } from '../../../../services/dash-api.service';
import { HelperService } from '../../../../services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { min, Subscription } from 'rxjs';
import { CustomValidation } from '../../../../interfaces/autocomplete-validation';
import Swal from 'sweetalert2';
import { LayoutComponent } from '../../../layout/layout.component';

@Component({
  selector: 'app-promoter-add-share',
  templateUrl: './promoter-add-share.component.html',
  styleUrl: './promoter-add-share.component.scss'
})
export class PromoterAddShareComponent implements OnInit,OnDestroy {
  sub_current_share_price!:Subscription
  sub_add_shares_to_promoter!:Subscription
  sub_get_liquid!:Subscription
  shareForm!:FormGroup
  liquid:any[] = []

  slug:string=""
  name:string=""
  share_price:number = 0
  today = new Date(); // Get today's date

  // form show hide
    show_bank_inputs:boolean = false
    check_paid:boolean = false
  // form show hide


  constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private active_r: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private layout: LayoutComponent
  ){}
  ngOnInit() {
    this.active_r.paramMap.subscribe((res:any) =>{
      this.slug = res.params.slug
      this.name = res.params.name
    })
    let token = this.helper.get_local('token')
    this.sub_get_liquid = this.dashapi.get_liquid(token).subscribe((res:any)=>{
      this.liquid = res.data
    })
    this.sub_current_share_price = this.dashapi.current_share_price(token).subscribe((res:any) =>{
      console.log(res)
      this.share_price = res

    })
    this.shareForm = this.shareFormFunction()

    // on change payment_ledger_id

      this.shareForm.get('payment_ledger_id')?.valueChanges.subscribe((res:string) =>{
        this.show_bank_inputs = JSON.parse(res.split(',')[1])
          if(JSON.parse(res.split(',')[1])){
            console.log("true")
            this.utr_add_validation()
            this.shareForm.get('payment_mode')?.setValue("bank")
            this.shareForm.get('is_cheque')?.setValue(false)


          }else{
            console.log("false")
            this.utr_remove_validation()
            this.is_cheque_remove_validation()
            this.shareForm.get('is_cheque')?.setValue(false)
            this.shareForm.get('payment_mode')?.setValue("cash")
            this.shareForm.get('utr_no')?.reset()
            this.shareForm.get('bank_name')?.reset()
            this.shareForm.get('cheque_no')?.reset()

          }

       })
       this.shareForm.get('is_cheque')?.valueChanges.subscribe((res:string) =>{
         this.check_paid = JSON.parse(res)
         if(this.check_paid){
           this.is_cheque_add_validation()
           this.utr_remove_validation()
           this.shareForm.get('utr_no')?.reset()
           this.shareForm.get('payment_mode')?.setValue("cheque")


          }else if(!this.show_bank_inputs){
            this.utr_remove_validation()
            this.shareForm.get('bank_name')?.reset()
           this.shareForm.get('cheque_no')?.reset()
           this.shareForm.get('utr_no')?.reset()
           this.shareForm.get('payment_mode')?.setValue("cash")

          }
          else{
            this.shareForm.get('bank_name')?.reset()
            this.shareForm.get('cheque_no')?.reset()
            this.shareForm.get('payment_mode')?.setValue("bank")
          this.utr_add_validation()
          this.is_cheque_remove_validation()
        }
        // this.show_bank_inputs = JSON.parse(res.split(',')[1])
       })
    // on change payment_ledger_id
  }

  shareFormFunction(){
    return this.fb.group({
      nominal_value: this.fb.control({value:'', disabled: true }),
      allotment_date: ['', [Validators.required, this.dateNotGreaterThanTodayValidator.bind(this)]],
      total_shares: this.fb.control('',[Validators.required,CustomValidation.only_digit(),Validators.min(1), Validators.max(1000000)]),
      payment_ledger_id: this.fb.control('',[Validators.required]),
      // daynamic validations
      is_cheque:this.fb.control(null),
      utr_no: [null],

      bank_name: this.fb.control(null),
      cheque_no: this.fb.control(null),
      payment_mode: this.fb.control(null),
    })
  }
  dateNotGreaterThanTodayValidator(control: FormControl) {
    const selectedDate = new Date(control.value);
    return selectedDate <= this.today ? null : { dateGreaterThanToday: true };
  }
  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }
 getTodayBefore10(): string {
  var temp = new Date();
  temp.setDate(temp.getDate()-1000);
  return temp.toISOString().split('T')[0]
  }

// validation add remove
  utr_add_validation(){
    this.shareForm.get('utr_no')?.setValidators([Validators.required,  Validators.minLength(12), Validators.maxLength(22)])
    // update
    this.shareForm.get('utr_no')?.updateValueAndValidity()
  }
  is_cheque_add_validation(){
    this.shareForm.get('bank_name')?.setValidators([Validators.required, CustomValidation.alphabets(),  Validators.minLength(5), Validators.maxLength(50)])
    this.shareForm.get('cheque_no')?.setValidators([Validators.required, CustomValidation.only_digit(),  Validators.minLength(6), Validators.maxLength(6)])
    // update
    this.shareForm.get('bank_name')?.updateValueAndValidity()
    this.shareForm.get('cheque_no')?.updateValueAndValidity()
  }
  utr_remove_validation(){
    this.shareForm.get('utr_no')?.clearValidators();
    // update
    this.shareForm.get('utr_no')?.updateValueAndValidity()
  }
  is_cheque_remove_validation(){
    this.shareForm.get('bank_name')?.clearValidators();
    this.shareForm.get('cheque_no')?.clearValidators();
    // update
    this.shareForm.get('bank_name')?.updateValueAndValidity()
    this.shareForm.get('cheque_no')?.updateValueAndValidity()
  }



// validation add remove



  submit(){
    let data = this.shareForm.value
    data.nominal_value = this.share_price
    data.amount = Number((data.total_shares * this.share_price))
    data.payment_ledger_id = Number(this.shareForm.get('payment_ledger_id')?.value.split(",")[0])
    data.is_cheque = JSON.parse(this.shareForm.get('is_cheque')?.value)
    let main = {data: data, promoter_slug: this.slug}
    let token = this.helper.get_local('token')
    this.aloteShares(main, token)

  }
  aloteShares(main:any, token:string){
    this.sub_add_shares_to_promoter = this.dashapi.add_shares_to_promoter(token, main).subscribe({
      next:(res) =>{
        Swal.fire({
                title: "Success",
                text: res.status,
                icon: "success"
              });
              this.helper.navigateAndActive(this.layout.menus(),'Company', 'company/promoters', this.router, this.layout)
      },
      error:() =>{
           Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something Went Wrong",
            // footer: '<a href="#">Why do I have this issue?</a>'
          });
      }
    })
  }

  ngOnDestroy(): void {
    this.sub_add_shares_to_promoter?.unsubscribe()
    this.sub_current_share_price?.unsubscribe()
    this.sub_get_liquid?.unsubscribe()
  }

}
