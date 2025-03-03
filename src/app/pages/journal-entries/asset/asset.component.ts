import { DashApiService } from './../../../services/dash-api.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder,  FormControl,  FormGroup, Validators } from '@angular/forms';

import { HelperService } from '../../../services/helper.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { Account } from '../../../interfaces/account';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrl: './asset.component.scss'
})
export class AssetComponent implements OnInit, OnDestroy{
  sub_get_all_ledgers:Subscription | undefined
  sub_create_new_journal_entry:Subscription | undefined

  today = new Date(); // Get today's date
  journalForm!:FormGroup;
  allLedgers:any[] = []
  credit_debit_validation:any
  accout_validation:any[] =[]
  // autocomplete
  filteredCat:  Observable<Account[]> | undefined ;
  // autocomplete
  constructor(
    private fb: FormBuilder,
    private dashapi: DashApiService,
    private helper: HelperService,
    private router: Router

  ){

  }
  ngOnInit() {
    this.journalForm = this.jForm()
    let token = this.helper.get_local('token');
    this.sub_get_all_ledgers = this.dashapi.get_all_ledgers(token).subscribe((res:any) => {
      this.allLedgers = res.data

      this.journalForm = this.jForm()
    })
    this.filter_accounts(0);
  }

  filter_accounts(i:any,type?:any){
    if (type == 'debit'){
      this.filteredCat  = this.debit.at(i)?.get('ledger_name')?.valueChanges.pipe(
        startWith(''),
        map(value => {
          return this._filter1(value || '')
        })
      )
    }else if(type == 'credit'){
      this.filteredCat  = this.credit.at(i)?.get('ledger_name')?.valueChanges.pipe(
        startWith(''),
        map(value => {
          return this._filter1(value || '')
        })
      )
    }
  }

  private _filter1(value: any): any{
    const filterValue = typeof value === 'object' ?  value.name.toLowerCase() : value.toLowerCase();
            return this.allLedgers.filter((option:any) => ((option.name).toLocaleLowerCase()).includes(filterValue) ||
     JSON.stringify( option.id).toLocaleLowerCase().includes(filterValue));
   }

   onOptionSelect(e:any,i:number,type:string){
    this.journalForm.get(type)?.get(i.toString())?.get('ledger_name')?.setValue(e.name)
    this.journalForm.get(type)?.get(i.toString())?.get('id')?.setValue(e.id)
    // this.debit.at(i)?.get('ledger_name')?.setValue(e.name)
   }


  jForm(){
    return this.fb.group({
      date: ['', [Validators.required, this.dateNotGreaterThanTodayValidator.bind(this)]],
      // date: this.fb.control('', [Validators.required]),
      narration: this.fb.control('', [Validators.required, Validators.minLength(15), Validators.maxLength(200)]),
      debit: this.fb.array([this.debitForm()]),
      credit: this.fb.array([this.creditForm()])
    })
  }
  get debit(){
    return this.journalForm.get("debit") as FormArray;
    }
  get credit(){
    return this.journalForm.get("credit") as FormArray;
    }
  debitForm(){
    return this.fb.group({
      ledger_name: this.fb.control('', [Validators.required,CustomValidation.valueSelected(this.allLedgers)]),
      id: this.fb.control(null),
      amount: this.fb.control('', [Validators.required,Validators.min(1)]),
     })
  }
  creditForm(){
    return this.fb.group({
      ledger_name: this.fb.control('', [Validators.required,CustomValidation.valueSelected(this.allLedgers)]),
      id: this.fb.control(null),
      amount: this.fb.control('', [Validators.required,Validators.min(1)]),

    })
  }

  addNewDebit(){
    this.debit.push(this.debitForm());
  }
  addNewCredit(){
    this.credit.push(this.creditForm());
  }
  removeDebit(i:Required<number>){
    this.debit.removeAt(i);
  }
 removeCredit(i:Required<number>){
    this.credit.removeAt(i);
  }
  submit(){


    let debit =  this.journalForm.get('debit')?.value
    let credit =  this.journalForm.get('credit')?.value
    let data = {
      date: this.journalForm.get('date')?.value,
      narration: this.journalForm.get('narration')?.value,
      debit: debit,
      credit: credit
    }
    // error renring
    let ledgers:number[]= []
    let d_amount:number = 0
     let c_amount:number = 0
    debit.forEach((e:any) => {
      ledgers.push(e.ledger_name);
      d_amount += e.amount;
    });
    credit.forEach((e:any) => {
      ledgers.push(e.ledger_name);
      c_amount += e.amount;
    });
    let resArr = ledgers.filter((value, index, self) => {
       return self.indexOf(value) === index;
    });
    // code is also working
      // let resArr:any[] = [];
      // ledgers.filter(function(item){
      //   let i = resArr.findIndex(x => (x== item));
      //   console.log(i)
      //   if(i <= -1){
      //         resArr.push(item);
      //   }
      // });



    if(ledgers.length === resArr.length && d_amount === c_amount){
      this.accout_validation=[]
      // server rendring
      let token = this.helper.get_local('token')
      this.sub_create_new_journal_entry = this.dashapi.create_new_journal_entry(token,{ data} ).subscribe((res:any) =>{
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: `${res.status}`,
          showConfirmButton: false,
          timer: 1500
        });
        // this.journalForm.reset()
        // this.router.navigate(['entries/asset'])
        this.ngOnInit();

      }, (err:any) =>{
        Swal.fire({
          position: "top-end",
          icon: "warning",
          text: `Somthing want wrong!`,
          showConfirmButton: false,
          timer: 1500
        });
      })
    }else{
      if(ledgers.length !== resArr.length && d_amount !== c_amount){
        this.accout_validation = ["Duplicate ledger account. Please provide unique account.","The credit and debit amounts are not reconciling." ]

      } else if(ledgers.length !== resArr.length){
        this.accout_validation = ["Duplicate ledger account. Please provide unique account."]

      } else if(d_amount !== c_amount){
        this.accout_validation = ["The credit and debit amounts are not reconciling." ]

      }
    }

  }

  dateNotGreaterThanTodayValidator(control: FormControl) {
    const selectedDate = new Date(control.value);
    return selectedDate <= this.today ? null : { dateGreaterThanToday: true };
  }
  getToday(): string {
    return new Date().toISOString().split('T')[0]
 }

//  revocation form past enrtries

 getTodayBefore10(): string {
  var temp = new Date();
  temp.setDate(temp.getDate()-10);
  return temp.toISOString().split('T')[0]
}
ngOnDestroy(): void {
  this.sub_get_all_ledgers?.unsubscribe()
  this.sub_create_new_journal_entry?.unsubscribe()
}
}
