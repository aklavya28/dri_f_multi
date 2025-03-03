import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { Subscription, map } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-all-promoters',
  templateUrl: './all-promoters.component.html',
  styleUrl: './all-promoters.component.scss'
})
export class AllPromotersComponent implements OnInit, OnDestroy{
  sub_get_promoter_with_shares:Subscription | undefined
  promoters:any[] = []
  total_share_value:number = 0
  constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private router: Router
    ){

  }
  ngOnInit(): void {
    this.getPromoters()
  }
  getPromoters(){
    this.sub_get_promoter_with_shares = this.dashapi.get_promoter_with_shares(this.helper.get_local('token')).subscribe({
      next: (res)=>{
        if (res.status === 204) {
         this.promoters  = []; // or handle accordingly
          return; // Exit early
        }else{ res = res.body}
        this.promoters = res.data
        this.total_share_value = res.total_value
      },
      error:(err) =>{
        console.log(err)
      }

    })
  }

  showShareTrans(slug:string){
    this.router.navigate(['promoters/all', slug])
    // console.log(slug)
  }
  ngOnDestroy(): void {
    this.sub_get_promoter_with_shares?.unsubscribe()
  }
}
