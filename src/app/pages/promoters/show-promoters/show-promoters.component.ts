import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-show-promoters',
  // templateUrl: './show-promoters.component.html',
  // styleUrl: './show-promoters.component.scss',
  template: `
  <div class="page_wrapper">
    <div class="backbutton">
        <a mat-fab color="primary" [routerLink]="'/promoters/all'">
        <mat-icon>arrow_back</mat-icon>
      </a>
    </div>
    <div class="inner_page_table table-responsive">
    <table class="table table-striped">
    <thead  *ngIf="transactions.length">
        <tr>
            <th colspan="8" style="text-align: right;">Total Share Value: </th>
            <th colspan="1">{{total_value | currency:"INR"}}</th>
        </tr>
        <tr>
            <th>#</th>
            <th>Nominal Value</th>
            <th>Shares</th>
            <th>Payment Mode</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Is Processed</th>
            <th>Transaction Date</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
      @if(transactions.length){
        @for(trns of transactions; track $index){
          <tr>
              <td>{{$index+1}}</td>
              <td>{{trns.nominal_value}}</td>
              <td>{{trns.total_shares}}</td>
              <td>{{trns.payment_mode | uppercase}}</td>
              <td><span ngClass="{{ trns.payment_status === 'success'? 'badge-success': 'badge-danger'}} " class="badge">{{trns.payment_status | uppercase}} </span></td>
              <td>{{trns.amount | currency:"INR"}}</td>
              <td><span ngClass="{{ trns.is_processed ? 'badge-success': 'badge-danger'}} " class="badge">{{trns.is_processed ? 'Yes': 'No  '}} </span></td>
              <td>{{trns.allotment_date | date }}</td>
              <td>
                @if (trns.payment_status === 'pending') {
                  <button mat-raised-button color="primary">Approve</button>

                }

              </td>
          </tr>
        }
      }@else {
        <tr>
          <td colspan="9"> No Data</td>
        </tr>
      }

    </tbody>
  </table>
    </div>
</div>




  `,
  styles: [`
  .badge-success {
      background: #8BC34A;
      border-radius: 5px;
      font-weight: normal;
  }
  .badge-danger {
      background: #ff0000;
      border-radius: 5px;
      font-weight: normal;
  }

`],


})
export class ShowPromotersComponent implements OnInit, OnDestroy {
  sub_get_promoter_transactions:Subscription |undefined
  slug:string = ''
  transactions:any
  total_value:number = 0
  constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private activatedRoute:ActivatedRoute

  ){}
  ngOnInit() {
      // this.slug = this.activatedRoute.snapshot.paramMap.get('slug');
      this.activatedRoute.params.subscribe((res:any)=>{
        this.slug = res.slug
        this.getPromoterTrans(this.slug)
      })



  }
  getPromoterTrans(slug:string){
    this.sub_get_promoter_transactions = this.dashapi.get_promoter_transactions(this.helper.get_local('token'), slug).subscribe({
      next:(res)=>{
        if (res.status === 204) {
           this.transactions = []; // or handle accordingly
           return; // Exit early
        }else{res= res.body}
        this.transactions = res.data
        this.total_value = res.total_value
      },
      error:(err) =>{
        console.log(err)
      }
    })

  }


  ngOnDestroy(): void {
    this.sub_get_promoter_transactions?.unsubscribe()
  }
}
