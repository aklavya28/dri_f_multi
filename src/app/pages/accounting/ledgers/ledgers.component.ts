import {  Component, OnDestroy, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ledgers',
  templateUrl: './ledgers.component.html',
  styleUrl: './ledgers.component.scss'
})
export class LedgersComponent implements OnInit, OnDestroy {
  sub_get_ledgers!:Subscription
  sub_get_ledgers_by_name!:Subscription
  ladgers:any[]=[]
  trialSearchForm!: FormGroup
  ledger_by_name:any[] = []
  constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private fb:FormBuilder,
    private router: Router

  ){}

  ngOnInit() {
    let token =this.helper.get_local('token')
    this.trialSearchForm = this.load_form()
    let company_id =this.helper.company_id()
      this.dashapi.get_ledgers(token, "assets").subscribe((res:any) => {
          this.ladgers = res.data

      })
  }
  load_form(){
    return this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.maxLength(30)])
    })
  }


  tabsEvent(e:any){
    let tablebal = e.tab.textLabel
  }
  refresh_ledgers(){
    let token = this.helper.get_local('token')
    this.dashapi.refresh_ledgers(token).subscribe((res:any) =>{
        this.dashapi.get_ledgers(token, "assets").subscribe((res:any) => {
          this.ladgers = res.data
      })
    })
  }
  lDetail(slug:any  ){
    console.log(slug)
    this.router.navigate(['accounting/ledgers', slug, 1])
  }
  ngOnDestroy(): void {
    this.sub_get_ledgers?.unsubscribe()
    this.sub_get_ledgers_by_name?.unsubscribe()
  }
  submit(){
    this.ledger_by_name = []
    let name = this.trialSearchForm.get('name')?.value
    this.sub_get_ledgers_by_name = this.dashapi.get_ledgers_by_name(this.helper.get_local('token'), name).subscribe((res) =>{
      this.ledger_by_name = res.data
    }, (err) =>{
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.error.err_message,
      });
      console.log(err.error.err_message)
    })


  }
}
