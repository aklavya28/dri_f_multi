import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-disbursement-history',
  templateUrl: './disbursement-history.component.html',
  styleUrl: './disbursement-history.component.scss'
})
export class DisbursementHistoryComponent implements OnInit, OnDestroy{
  sub_get_disbursement_history!: Subscription

  history:any[] =[]

  constructor(
    private helper: HelperService,
    private dashapi: DashApiService

  ){}

  ngOnInit(): void {

    let token = this.helper.get_local('token')
    this.sub_get_disbursement_history = this.dashapi.get_disbursement_history(token).subscribe((res:any) =>{
      console.log("histrory", res)
      this.history = res.data
    })
  }
  ngOnDestroy(): void {

  }
}
