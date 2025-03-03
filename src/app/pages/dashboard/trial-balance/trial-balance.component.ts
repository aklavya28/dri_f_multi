import { CustomValidation } from './../../../interfaces/autocomplete-validation';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrl: './trial-balance.component.scss'
})
export class TrialBalanceComponent implements OnInit {
  sub_company_trial_balance!: Subscription
  data:any[] =[]
  dr_sum:number =0
  cr_sum:number =0
  open_bal:number =0
  close_bal:number =0
  start_date:any
  end_date:any
  is_sppiner:boolean=true
  // search_date_from
  trialSearchForm!: FormGroup
   currentDate = new Date(); // Current date

// search_date_from


  constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder

  ){}
  ngOnInit(): void {
    this.trialSearchForm = this.load_form()
    this.load_data(this.currentDate)
  }

  load_form(){
    return this.fb.group({
        start: ['', Validators.required],
        end: ['', Validators.required]
      },
      { validators: CustomValidation.dateRangeValidator('start', 'end')
    })
  }
  load_data(currentDate:any,oneMonthAgo?:any){
    this.is_sppiner = true
    this.spinner.show()

    this.sub_company_trial_balance = this.dashapi.company_trial_balance(this.helper.get_local('token'),currentDate,oneMonthAgo).subscribe((res:any) =>{
      this.data = []
        this.is_sppiner = false
        this.data = res.data
        this.dr_sum= res.dr_sum
        this.cr_sum= res.cr_sum
        this.open_bal= res.open_bal
        this.close_bal= res.close_bal
        this.start_date= res.start
        this.end_date= res.end

    }, err =>{
      this.is_sppiner = false
    })
  }
  submit(){
    let s_date = this.trialSearchForm.get('start')?.value
    let e_date = this.trialSearchForm.get('end')?.value
    this.load_data(s_date,e_date)
  }
}
