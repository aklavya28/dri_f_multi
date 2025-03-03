import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-khata-profile',
  templateUrl: './khata-profile.component.html',
  styleUrl: './khata-profile.component.scss',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ opacity: 0}),
          animate('.8s', style({ opacity: 1}))
        ]),
        transition(':leave', [
          style({ opacity: 1}),
          animate('1.5s', style({ opacity: 0}))
        ])
      ]
    )
  ],
})
export class KhataProfileComponent implements OnInit,OnDestroy{
  entries:any[] =[]
  ac_info:any[] =[]
  entries_index:any[] =[]
  entry_dtl_api:any[] =[]

  is_sppiner:boolean = true
  show:boolean = false;
  balance:number = 0
  // activated_routes
  name:string = ''
  slug:string = ''
   // paginations

   totalItems = 0;
   currentPage = 1;
   pages = 0;
   itemsPerPage = 100;
   // paginations
   private destroy$ = new Subject<void>();
  constructor(
    private router: Router,
    private active_route: ActivatedRoute,
    private dashapi: DashApiService,
    private helper: HelperService,
    private spinner: NgxSpinnerService,
  ){}


  ngOnInit() {
    this.active_route.params.subscribe((res:any)=>{
      this.name = res.name
      this.slug = res.slug
      this.currentPage = res.page

      this.load_khata(this.currentPage, this.itemsPerPage)
    })

  }

  load_khata(currentPage:number,itemsPerPage:number){
    this.is_sppiner = true
    this.spinner.show()
    this.dashapi.khata_profile(this.helper.get_local("token"),this.slug, currentPage,itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) =>{
         // pagination
         this.entries = res.body.data
         this.balance = res.body.balance
          // pagination
          this.currentPage = res.body.pagination.page
          this.pages = res.body.pagination.pages
          this.totalItems = res.body.pagination.count
          this.itemsPerPage = res.body.pagination.items
        },
        error: (err)=>{
                    Swal.fire({
                      icon: "error",
                      text: err.error.error,
                     confirmButtonText: "Ok",

                    }).then((result) => {
                      /* Read more about isConfirmed, isDenied below */
                      if (result.isConfirmed) {
                        this.router.navigate(['khatabook/khata-profile/', this.slug, this.name, 1 ])
                      }
                    });




        },
        complete: ()=>{
          this.spinner.hide()
          this.is_sppiner = false
        }
      })

  }

  entry_dtl( e:any, slug:string){

    this.entries_index.push(e)
    // console.log(this.entries_index.push(e))
    this.entries_index.forEach(el=>{
      this.entries[el].is_show = false
    })
    this.entries[e].is_show = true

    this.dashapi.get_entry_detail(this.helper.get_local('token'), slug).subscribe((res:any) =>{
      this.entry_dtl_api = res.data
    })

  }

  pageChange(e:any){
    this.entries = []
    this.entries_index = []
    this.currentPage  = e
    console.log(this.slug, this.name, this.currentPage)
    this.router.navigate(['khatabook/khata-profile/', this.slug, this.name, this.currentPage ])
    //  this.get_all_entries(this.activeSlug, this.currentPage, this.itemsPerPage)
    // "khata-profile/:slug/:name/:page"
  }
  addpayment(slug:any){
    this.router.navigate(['khatabook/add-payment',slug ])
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
