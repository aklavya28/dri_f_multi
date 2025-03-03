
import {  Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import Swal from 'sweetalert2';
import { LayoutComponent } from '../../layout/layout.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',

})
export class ViewComponent implements OnInit, OnDestroy{
  sub_get_all_entries:Subscription | undefined
  sub_reverse_entry:Subscription | undefined

  data:any[] =[]
  // paginations
    is_sppiner:boolean=true
    totalItems = 0;
    currentPage = 1;
    itemsPerPage = 0;
    pages:number = 0
  // paginations
    trialSearchForm!: FormGroup
    currentDate = new Date(); // Current date
    start_date:any
    end_date:any

  constructor(
      private helper: HelperService,
      private dashapi: DashApiService,
      private layout: LayoutComponent,
      private router: Router,
      private spinner: NgxSpinnerService,
      private activeroute: ActivatedRoute,
      private fb: FormBuilder

  ){}
  ngOnInit(): void {
    this.activeroute.params.subscribe((res:any) =>{
      this.trialSearchForm = this.load_form()
      this.currentPage = res.page
      this.get_all_entries(this.currentPage, this.itemsPerPage)
    })
  }
  get_all_entries(currentPage:number, itemsPerPage:number, currentDate?:any,oneMonthAgo?:any){
    this.is_sppiner = true
    this.spinner.show()
    let api;
    if (currentDate){
      api = this.dashapi.get_all_entries(this.helper.get_local('token'),currentPage,itemsPerPage, currentDate, oneMonthAgo )

    }else{
      api  = this.dashapi.get_all_entries(this.helper.get_local('token'),currentPage,itemsPerPage )
    }
    this.sub_get_all_entries  = api.subscribe((res)=>{
          this.is_sppiner = false
          this.data = res.data
          console.log("data", this.data)
         // pagination

         this.currentPage = res.pagination.page
         this.totalItems = res.pagination.count
         this.pages = res.pagination.pages
         this.itemsPerPage = res.pagination.items
         this.start_date = res.start
         this.end_date = res.end

    }, err =>{
      this.is_sppiner = false
    })
  }
  pageChange(e:any){
    this.data = []
    this.currentPage  = e
     this.router.navigate(['/entries/view/', this.currentPage ])
  }
  getObjectKeys(narration: string): { key: string, value: any }[] {
    const parsedObject = JSON.parse(narration);
    return Object.keys(parsedObject).map(key => ({ key, value: parsedObject[key] }));
  }

  reverse(slug:string){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reverse it!"
    }).then((result) => {
     if (result.isConfirmed) {
        let token = this.helper.get_local('token')
        this.is_sppiner = true
        this.spinner.show()

       this.sub_reverse_entry = this.dashapi.reverse_entry(token, slug).subscribe((res:any) =>{
            // console.log(res)
            this.data = []
            this.is_sppiner = false
            this.spinner.hide()
            Swal.fire({
              title: "Reversed!",
              text: "Transaction successfully reversed.",
              icon: "success",
            });
            this.get_all_entries(this.currentPage, this.itemsPerPage)

        }, err =>{
          this.is_sppiner = false
          this.spinner.hide()
        })



      }
    });
  }
  navigate_to(){
     this.helper.navigateAndActive(this.layout.menus(),'Entries', 'entries/asset', this.router, this.layout)
    // this.helper.navigateAndActive(this.layout.menus(),'Dashboard', 'dashboard/view-order', this.router, this.layout)
  }
  load_form(){
    return this.fb.group({
        start: ['', Validators.required],
        end: ['', Validators.required]
      },
      { validators: CustomValidation.dateRangeValidator('start', 'end')
    })
  }

  ngOnDestroy(): void {
    this.sub_get_all_entries?.unsubscribe()
    this.sub_reverse_entry?.unsubscribe()
  }
  submit(){
    this.data = []
    let s_date = this.trialSearchForm.get('start')?.value
    let e_date = this.trialSearchForm.get('end')?.value
    this.get_all_entries(this.currentPage, this.itemsPerPage,s_date,e_date)

  }
}
