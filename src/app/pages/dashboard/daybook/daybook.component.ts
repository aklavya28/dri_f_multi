import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';

@Component({
  selector: 'app-daybook',
  templateUrl: './daybook.component.html',
  styleUrl: './daybook.component.scss'
})
export class DaybookComponent implements OnInit, OnDestroy{
  sub_daybook!:Subscription
  daybookSearchForm!:FormGroup
  start_date:Date = new Date
  data:any[] =[]
  is_sppiner:boolean = true
  constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ){}
  ngOnInit() {
    this.load_data(this.start_date)
    this.daybookSearchForm = this.load_form()
  }
  load_form(){
      return this.fb.group({
        date:['', [Validators.required, CustomValidation.dateNotGreaterThanToday.bind(this)]]
      })
  }
  load_data(date:Date){
    this.is_sppiner = true
    this.spinner.show()
    this.sub_daybook = this.dashapi.daybook(this.helper.get_local('token'), date ).subscribe((res:any) =>{

      this.data = []
        this.is_sppiner = false
        this.data = res.data
        this.start_date= res.start
    }, (err:any) =>{
      this.is_sppiner = false
    })
  }


  submit(){
    let date = this.daybookSearchForm.get('date')?.value
    this.load_data(date)
    // console.log(this.daybookSearchForm.get('date')?.value)
  }
  getToday(): string {
    return new Date().toISOString().split('T')[0]
 }
  ngOnDestroy(): void {
    this.sub_daybook?.unsubscribe()
  }
}
