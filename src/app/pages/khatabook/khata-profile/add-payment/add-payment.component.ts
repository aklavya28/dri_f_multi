import { map, max, startWith, Subject, Subscription, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashApiService } from '../../../../services/dash-api.service';
import { HelperService } from '../../../../services/helper.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../../../interfaces/autocomplete-validation';
import { ErrorStateMatcher } from '@angular/material/core';
import { LiquidAcc } from '../../../../interfaces/liquid';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrl: './add-payment.component.scss'
})
export class AddPaymentComponent implements OnInit, OnDestroy {
  sub_load_khata:Subscription | undefined
  sub_create_khata_trns:Subscription | undefined
  slug:string = ""
  name:string = ""
  balance:number = 0


  liquid:any[] = []
  paymentForm!:FormGroup
  matcher:any
  liquidAcc: LiquidAcc[] =[]
  // balcheck
    paid:number =  0
    recieved:number =  0
    paid_ac:string = ''
    received_ac:string = ''

    balance_check_err:string[] = []
  // balcheck
  private destroy$ = new Subject<void>();

  constructor(
    private activeRoute: ActivatedRoute,
    private dashapi: DashApiService,
    private helper: HelperService,
    private fb: FormBuilder,
    private router: Router

  ){}
  ngOnInit() {

    this.activeRoute.params.subscribe((res:any)=>{
      this.slug = res.slug
      this.name = res.name
      this.load_khata(this.slug)
      this.paymentForm = this.newForm()
      this.matcher = new ErrorStateMatcher();

    })

  }
  load_khata(slug:any){
    this.sub_load_khata =  this.dashapi.get_khata(this.helper.get_local('token'), slug).subscribe((res:any)=>{
      this.liquid = res.liquid
      this.balance = res.khata_balance

    })
  }
  newForm(){
    return this.fb.group({
      payment_type: this.fb.control('', [Validators.required]),
      remarks: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
      date: ['', [Validators.required, CustomValidation.dateNotGreaterThanToday.bind(this)]],
      paid_to: this.fb.control('', [Validators.required]),
      fromInputs: this.fb.array([]),
    })
  }
  get fromInputs(): FormArray {
    return this.paymentForm.get('fromInputs') as FormArray;
  }

  updateFromInputs(selectedOptions: string[]): void {
    const fromInputs = this.fromInputs;

    // Clear existing form controls
    while (fromInputs.length) {
      fromInputs.removeAt(0);
    }

    // Add a new form control for each selected option

    selectedOptions.forEach((option:any) => {
      console.log(option.name)
    let name_val = option.name
    let balance = 0
      if(this.paymentForm.get('payment_type')?.value === 'paid'){
        balance = option.balance
      }else{
        balance = 1000000
      }

      fromInputs.push(this.fb.group({
          title: this.fb.control({value: name_val, disabled:false}),
          value: this.fb.control('',[Validators.required, CustomValidation.only_digit(),Validators.max(balance)])
      }));
    });
  }
  from_change(e:any){
    // console.log(e[0].name)
    const selectedOptions = e; // Array of selected options
    this.updateFromInputs(selectedOptions);
  }



  submit(){
    let data = {
      payment_type: this.paymentForm.get('payment_type')?.value,
      remarks: this.paymentForm.get('remarks')?.value,
      paid_to: this.paymentForm.get('fromInputs')?.value,
      transaction_date: this.paymentForm.get('date')?.value,
      slug: this.slug
    }
    // this.dashapi.create_khata_trns(this.helper.get_local('token'), {data}).subscribe((res:any) =>{
    //     console.log(res)
    // })

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Save"
    }).then((result) => {
      if (result.isConfirmed) {
        // this.get_all_orders(this.helper.get_local('token'), this.data)

        this.dashapi.create_khata_trns(this.helper.get_local('token'), {data})
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) =>{
           Swal.fire({
            title: "Success",
            text: res.body.status,
            icon: "success"
           })
           this.balance = res.body.balance
           this.paymentForm.reset()
          },
          error: (err)=>{
            Swal.fire({
                    text: err.error.error,
                    icon: "error"
                  });
          },
          complete: ()=>{

          }
        })

      }
    });

  }



  payment_mode(e:any){
    this.paymentForm.get('paid_to')?.reset()
    this.updateFromInputs([])

  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
 }

  ngOnDestroy(): void {
    this.sub_load_khata?.unsubscribe()
    this.sub_create_khata_trns?.unsubscribe()
    this.destroy$.next();
    this.destroy$.complete();
  }

}
