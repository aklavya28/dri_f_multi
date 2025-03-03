import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.scss',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ opacity: 0}),
          animate('.8s', style({ opacity: 1}))
        ]),
        transition(':leave', [
          style({ opacity: 1}),
          animate('.8s', style({ opacity: 0}))
        ])
      ]
    )
  ],
})
export class RevenueComponent implements OnInit {
  entries:any[] =[]
  entries_index:any[] =[]
  entry_dtl_api:any[] =[]

    // paginations
    is_sppiner:boolean=true
    totalItems = 0;
    currentPage = 1;
    itemsPerPage = 0;
    pages:number = 0
  // paginations
   // search_date_from
   trialSearchForm!: FormGroup
   currentDate = new Date(); // Current date
    start_date:any
    end_date:any

// search_date_from
  constructor(
    private activRoute: ActivatedRoute,
    private helper: HelperService,
    private dashapi: DashApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder
  ){}
  ngOnInit(): void {
    this.activRoute.params.subscribe((res:any)=>{
      this.currentPage = res.page
      // this.get_all_entries(this.activeSlug, this.currentPage, this.itemsPerPage)
      this.load_data(this.currentPage, this.itemsPerPage)
      this.trialSearchForm = this.load_form()


    })
  }
  load_data(currentPage:number,itemsPerPage:number,currentDate?:Date,oneMonthAgo?:Date){
    this.is_sppiner = true
    this.spinner.show()
    let api;
    if (currentDate){
      api = this.dashapi.get_all_entries_plutus(this.helper.get_local('token'),currentPage,itemsPerPage, currentDate, oneMonthAgo )

    }else{
      api  = this.dashapi.get_all_entries_plutus(this.helper.get_local('token'),currentPage,itemsPerPage )
    }

    api.subscribe((res:any) =>{
      this.entries = []
  // pagination
        this.is_sppiner = false
        this.entries = res.data

         this.currentPage = res.pagination.page
         this.totalItems = res.pagination.count
         this.pages = res.pagination.pages
         this.itemsPerPage = res.pagination.items
         this.start_date = res.start
         this.end_date = res.end

    }, err =>{
          this.is_sppiner = false
          this.entries = []
    })
   }
   load_form(){
    return this.fb.group({
        start: ['', Validators.required],
        end: ['', Validators.required]
      },
      { validators: CustomValidation.dateRangeValidator('start', 'end')
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
    this.router.navigate(['entries/accounting-entries', this.currentPage ])
    //  this.get_all_entries(this.activeSlug, this.currentPage, this.itemsPerPage)

  }
  submit(){
    let s_date = this.trialSearchForm.get('start')?.value
    let e_date = this.trialSearchForm.get('end')?.value
    this.load_data(this.currentPage, this.itemsPerPage,s_date,e_date)
  }

}
