import { Component, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-fixed-assets',
  templateUrl: './fixed-assets.component.html',
  styleUrl: './fixed-assets.component.scss'
})
export class FixedAssetsComponent implements OnInit {
  data:any[] = []
  balance:number = 0
  // paginations
  is_sppiner:boolean=true
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 0;
  pages:number = 0
  // paginations
  private destroy$ = new Subject<void>();
constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private activeroute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
  ){}
  ngOnInit(): void {
      this.activeroute.params.subscribe((res:any) =>{
        this.currentPage = res.page
        // this.load_stock_register(this.currentPage, this.itemsPerPage)
        this.loadFixedAssets()
      })

  }

  pageChange(e:any){
    this.data = []
    this.currentPage  = e
    // console.log(this.currentPage)
    this.router.navigate(['dashboard/fixed-assets/', this.currentPage ])

  }
  loadFixedAssets(){
    this.is_sppiner = true
    this.spinner.show()
    this.dashapi.all_fixed_assets(this.helper.get_local('token'), this.currentPage, this.itemsPerPage)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => {

          console.log("next", res)
          this.data = res.body.data
          this.balance = res.body.balance
            // pagination
          this.currentPage = res.body.pagination.page
          this.totalItems = res.body.pagination.count
          this.pages = res.body.pagination.pages
          this.itemsPerPage = res.body.pagination.items

      },
      error: (err: any) => {
        this.is_sppiner = false
        this.spinner.hide()
      },
      complete: () => {
           this.is_sppiner = false
           this.spinner.hide()


      }

    })
  }
}
