import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-trial-balance-new',
  templateUrl: './trial-balance-new.component.html',
  styleUrl: './trial-balance-new.component.scss'
})
export class TrialBalanceNewComponent implements OnInit, OnDestroy{
  is_sppiner:boolean = false
  private destroy$ = new Subject<void>();
  dr:number =  0
  cr:number =  0
  data:any[]= []
  constructor(
    private helper:HelperService,
    private dashapi: DashApiService,
    private spinner: NgxSpinnerService
  ){}
  ngOnInit(): void {
    this.loadData()
  }
  loadData(){
    this.is_sppiner = true
    this.spinner.show()
    this.dashapi.company_trial_balance_new(this.helper.get_local('token'))
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) =>{
        console.log(res)
        this.data = res.body.data
        this.cr = res.body.cr_sum
        this.dr = res.body.dr_sum
      },
      error: (err)=>{
        console.log("sdfsodnsdfdf ")
      },
      complete: () => {
        this.is_sppiner = false
        this.spinner.hide()
        console.log('Request complete');

        // this.spinner.hide();
      }
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
