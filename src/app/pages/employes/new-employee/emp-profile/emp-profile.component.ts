import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from '../../../../services/helper.service';
import { DashApiService } from '../../../../services/dash-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emp-profile',
  templateUrl: './emp-profile.component.html',
  styleUrl: './emp-profile.component.scss'
})
export class EmpProfileComponent implements OnInit, OnDestroy{
 sub_show_employee: Subscription | undefined
 sub_get_advance_salary_payouts: Subscription | undefined
 sub_change_active_status_employee: Subscription | undefined
  profile:any
  slug:string = ""
  panelOpenState = true;
  checked:boolean = false
  // advance salary
  installment_amt:number = 0.0
  pending_amt_sum:number = 0.0
  payouts:any[] = []

// advance salary

  constructor(
    private helper: HelperService,
    private dashapi: DashApiService,
    private router: Router,
    private activeroute: ActivatedRoute
  ){}

  ngOnInit() {
    this.activeroute.paramMap.subscribe((res:any) =>{
      this.slug = res.params.slug
    })
    let token = this.helper.get_local('token')
    this.sub_show_employee = this.dashapi.show_employee(token, this.slug).subscribe((res:any) =>{
      this.profile = res.data
      this.checked = res.data.is_active
    })
   // get advance salary

   this.sub_get_advance_salary_payouts = this.dashapi.get_advance_salary_payouts(token, this.slug).subscribe((res:any) =>{
    this.installment_amt = res.current_installment_amt?.amount ? res.current_installment_amt?.amount : 0
    this.pending_amt_sum = res.sum
    this.payouts = res.payout
    // console.log("advance" ,res)
    console.log("advance" ,this.installment_amt,this.pending_amt_sum, this.payouts )

  })
  // get advance salary
  }
  ngOnDestroy(): void {
    this.sub_show_employee?.unsubscribe()
    this.sub_change_active_status_employee?.unsubscribe()
    this.sub_get_advance_salary_payouts?.unsubscribe()
  }
  change_active_status_employee(e:any, slug:string){
    let data = {is_active: e.checked, slug: slug}
    // console.log(data)
    let token = this.helper.get_local('token')
    this.sub_change_active_status_employee = this.dashapi.change_active_status_employee(token, data ).subscribe((res)=>{
      // console.log(res)
      Swal.fire({
        position: "center",
        icon: "success",
        width:'300px',
        imageWidth:"70px",
        text: "Status changed Successfully",
        showConfirmButton: false,
        timer: 1500
      });
    })

  }
}
