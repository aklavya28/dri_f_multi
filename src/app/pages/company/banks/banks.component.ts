import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.scss'
})
export class BanksComponent implements OnInit, OnDestroy{
  sub_get_company_banks:Subscription | undefined
  banks:any[] =[]
  constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private router: Router
   ){}
   ngOnInit(){
    this.getBanks()
   }
   getBanks(){
    this.sub_get_company_banks = this.dashapi.get_company_banks(this.helper.get_local('token')).subscribe({
      next:(res) =>{
        if (res.status === 204) {
          this.banks = []; // or handle accordingly
          return; // Exit early
        }else{
          res = res.body
        }
        this.banks = res.data
      },
      error:(err)=>{
        console.log(err)
      }
    })
   }
   editBank(data:any){

    this.router.navigate(['company/edit-bank', JSON.stringify(data) ])
   }
   ngOnDestroy(): void {
     this.sub_get_company_banks?.unsubscribe()
   }
}
