import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';


@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss'
})
export class ExpenseComponent implements OnInit, OnDestroy {
  sub_get_exp_entries:Subscription | undefined
  sub_reverse_exp_entry:Subscription | undefined
  data:any[] =[]
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
    private helper: HelperService,
    private dashapi: DashApiService,
    private activeroute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder

    ){}

    ngOnInit() {
      this.activeroute.params.subscribe((res:any) =>{
        console.log(res)
        this.currentPage = res.page
        // this.load_entries(this.currentPage, this.itemsPerPage,this.currentDate,this.currentDate)
        this.load_entries(this.currentPage, this.itemsPerPage)
        this.trialSearchForm = this.load_form()
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
  load_entries(currentPage:number, itemsPerPage:number, currentDate?:Date,oneMonthAgo?:Date){
    this.is_sppiner = true
    this.spinner.show()
    let api;
    if (currentDate){
      api = this.dashapi.get_exp_entries(this.helper.get_local('token'),currentPage,itemsPerPage, currentDate, oneMonthAgo )

    }else{
      api  = this.dashapi.get_exp_entries(this.helper.get_local('token'),currentPage,itemsPerPage )
    }
    // this.sub_get_exp_entries = this.dashapi.get_exp_entries(this.helper.get_local('token'), currentPage,itemsPerPage, currentDate,oneMonthAgo )
    api.subscribe((res:any) =>{
      console.log(res)
          this.is_sppiner = false
          this.data = res.data

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
    // console.log(this.currentPage)
    this.router.navigate(['entries/expense/', this.currentPage ])
  }
  reverse_entry(slug:string){
    // this.dashapi.reverse_exp_entry(this.helper.get_local('token'),slug).subscribe((res:any)=>{
    //   console.log(res)
    // })

    Swal.fire({
      text: "Are your sure you want to reverse this entry?",
      showDenyButton: true,
      confirmButtonText: "Save",
      }).then((result) => {

      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.sub_reverse_exp_entry  = this.dashapi.reverse_exp_entry(this.helper.get_local('token'),slug).subscribe((res:any) =>{

          this.load_entries(this.currentPage, this.itemsPerPage)
          Swal.fire("Saved", "", "success");
          // this.router.navigate(['entries/expense/', 1])
          // this.load_entries(1, this.itemsPerPage)

        }, err =>{
          Swal.fire("data not Saved", err.error.error, "error");
        })
        //
      }
    })
  }
  submit(){
    this.data = []
    let s_date = this.trialSearchForm.get('start')?.value
    let e_date = this.trialSearchForm.get('end')?.value
    this.load_entries(this.currentPage, this.itemsPerPage,s_date,e_date)

  }
  ngOnDestroy(): void {
    this.sub_reverse_exp_entry?.unsubscribe()
    this.sub_get_exp_entries?.unsubscribe()

  }

}
