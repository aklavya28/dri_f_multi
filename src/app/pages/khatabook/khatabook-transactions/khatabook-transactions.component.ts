import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-khatabook-transactions',
  templateUrl: './khatabook-transactions.component.html',
  styleUrl: './khatabook-transactions.component.scss'
})
export class KhatabookTransactionsComponent implements OnInit {
  name:string = ''
  slug:string = ''
  is_sppiner:boolean=true
  trans:any[] =[]
   // paginations
   totalItems = 0;
   currentPage = 1;
   itemsPerPage = 0;
   pages:number = 0
   // paginations


  constructor(
    private active_route: ActivatedRoute,
    private router: Router,
    private helper: HelperService,
    private dashapi: DashApiService,
    private spinner: NgxSpinnerService,
  ){}
  ngOnInit(): void {
    this.active_route.params.subscribe((res:any)=>{
      this.name = res.name
      this.slug = res.slug

      this.load_transactions(this.slug, this.currentPage, this.itemsPerPage)

      // this.currentPage = res.page

      // this.load_khata(this.currentPage, this.itemsPerPage)
    })

  }
  load_transactions(slug:string, page:number, par_page_itmes:number){
    this.is_sppiner = true
    this.spinner.show()
    this.dashapi.get_khata_transactions(this.helper.get_local('token'), slug,page, par_page_itmes).subscribe((res:any) =>{

          this.is_sppiner = false
          this.trans = res.data
        // pagination
        this.currentPage = res.pagination.page
        this.totalItems = res.pagination.count
        this.pages = res.pagination.pages
        this.itemsPerPage = res.pagination.items

    }, err =>{
         this.is_sppiner = false
    })
  }
  pageChange(e:any){
    this.trans = []
    this.currentPage  = e
    console.log(this.slug, this.name, this.currentPage)
    this.router.navigate(['khatabook/view-trans/', this.slug, this.name, this.currentPage ])

  }
  delete_trans(e:any){
    Swal.fire({
      text: "Are your sure you want to delete this transation?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      }).then((result) => {

      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
          let id = Number(e)
          this.dashapi.delete_khata_trans(this.helper.get_local('token'),id).subscribe((res:any)=>{
          this.trans = []
          this.load_transactions(this.slug, this.currentPage, this.itemsPerPage)
          Swal.fire("Deleted", "", "success");
        }, err =>{
          Swal.fire("Deleted", err.error.error, "error");
        })
        //
      }
    });


  }


}
