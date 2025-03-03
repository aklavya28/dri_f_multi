import { HelperService } from './../../services/helper.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashApiService } from '../../services/dash-api.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit, OnDestroy{
  company_profile:any = []
  private subscription: Subscription | undefined;
  constructor(
    private spinner: NgxSpinnerService,
    private api_dash: DashApiService,
    private helper: HelperService
    ){

  }
  ngOnInit(): void {

    this.spinner.show();
    this.subscription = this.api_dash.company_profile(this.helper.get_local('token')).subscribe({
      next:(res:any) =>{
        this.spinner.hide();
        if (res.status === 204) {
          this.company_profile = []
          return; // Exit early
        }else{
          res = res.body
        }
        this.company_profile = res.data
      },
      error:(err:any) =>{
        console.log(err)
        this.spinner.hide();
      }
    })


  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
