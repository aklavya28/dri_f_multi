import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-summery',
  templateUrl: './stock-summery.component.html',
  styleUrl: './stock-summery.component.scss'
})
export class StockSummeryComponent implements OnInit, OnDestroy{
  sub_stock_summery:Subscription | undefined
  data:any[] =[]
  stock_data:any[] =[]
   // paginations
   is_sppiner:boolean=true
   totalItems = 0;
   currentPage = 1;
   itemsPerPage = 0;
   pages:number = 0
   // paginations
  constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private activeroute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
  ){  }
  ngOnInit(): void {
    this.activeroute.params.subscribe((res:any) =>{
      console.log(res)
      this.currentPage = res.page
      this.load_summry_data(this.currentPage, this.itemsPerPage)
    })

  }
  load_summry_data(currentPage:number, itemsPerPage:number){
    this.is_sppiner = true
    this.spinner.show()
    this.sub_stock_summery = this.dashapi.stock_summery(this.helper.get_local('token'),currentPage,itemsPerPage).subscribe({
      next:(res:any) =>{

        if (res.status === 204){
          this.is_sppiner = false
          this.data = []
          this.stock_data = []
          return
        }else{
          res = res.body
        }
          this.is_sppiner = false
          this.data = res.data
          this.stock_data = res.stock_data
          this.currentPage = res.pagination.page
          this.totalItems = res.pagination.count
          this.pages = res.pagination.pages
          this.itemsPerPage = res.pagination.items

      },
      error: (err:any) =>{
        console.log("dfdfdf")
        this.is_sppiner = false
      },
      complete: () =>{}
    })


  }
  pageChange(e:any){
    this.data = []
    this.currentPage  = e
    // console.log(this.currentPage)
    this.router.navigate(['dashboard/stock-summery/', this.currentPage ])

  }
  ngOnDestroy(): void {
    this.sub_stock_summery?.unsubscribe()
  }
}
