import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from '../../../../services/helper.service';
import { DashApiService } from '../../../../services/dash-api.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-disbursement-history-detail',
  templateUrl: './disbursement-history-detail.component.html',
  styleUrl: './disbursement-history-detail.component.scss'
})
export class DisbursementHistoryDetailComponent implements OnInit, OnDestroy {
  sub_get_disbursement_history_details!:Subscription
  seleries:any[] = []
  detail_slug:string=""
  detail_date:any
  constructor(
    private helper: HelperService,
    private dashapi: DashApiService,
    private activeroute: ActivatedRoute
  ){}
  ngOnInit(): void {
      this.activeroute.paramMap.subscribe((res:any) =>{
          this.detail_slug = res.params.slug
          this.detail_date = res.params.date
      })
    let token = this.helper.get_local('token')
    this.sub_get_disbursement_history_details = this.dashapi.get_disbursement_history_details(token, this.detail_slug).subscribe((res:any) =>{
      console.log(res)
      this.seleries = res.data

    })
  }
  ngOnDestroy(): void {
    this.sub_get_disbursement_history_details?.unsubscribe()
  }
}
