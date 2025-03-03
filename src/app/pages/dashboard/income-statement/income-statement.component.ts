import { Component, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';

@Component({
  selector: 'app-income-statement',
  templateUrl: './income-statement.component.html',
  styleUrl: './income-statement.component.scss'
})
export class IncomeStatementComponent implements OnInit {
  sub_income_statement!:Subscription
  ledger_rev:any[] = []
  ledger_exp:any[] = []
  ledger_exp_amt:number = 0
  ledger_rev_amt:number = 0
  start_date:Date= new Date
  end_date:Date= new Date
  is_spinner:boolean = false
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

    this.load_data()
    this.trialSearchForm = this.load_form()
  }
   load_form(){
      return this.fb.group({
          start: ['', Validators.required],
          end: ['', Validators.required]
        },
        { validators: CustomValidation.dateRangeValidator('start', 'end')
      })
    }

  load_data(currentDate?:any,oneMonthAgo?:any){
    this.is_spinner = true
    this.spinner.show()
    let api;
    if (currentDate){
      api = this.dashapi.income_statement(this.helper.get_local('token'), currentDate, oneMonthAgo )

    }else{
      api = this.dashapi.income_statement(this.helper.get_local('token'))
    }
    this.sub_income_statement = api.subscribe((res:any) =>{
        this.is_spinner = false
        this.spinner.hide()
        this.ledger_rev = res.ledger_rev
        this.ledger_exp = res.ledger_exp
        this.ledger_exp_amt = res.ledger_exp_amt
        this.ledger_rev_amt = res.ledger_rev_amt
        this.start_date = res.start
        this.end_date = res.end

    }, err =>{
        this.is_spinner = false
        this.spinner.hide()
        this.start_date = err.error.start
        this.end_date = err.error.end
        this.ledger_rev = []
        this.ledger_exp = []
    })
  }

  submit(){
    let s_date = this.trialSearchForm.get('start')?.value
    let e_date = this.trialSearchForm.get('end')?.value
    // this.load_data(this.activeSlug, this.currentPage, this.itemsPerPage,s_date,e_date)
    this.load_data(s_date,e_date)
  }

}
