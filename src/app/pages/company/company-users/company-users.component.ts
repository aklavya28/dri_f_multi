import { Component, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';

@Component({
  selector: 'app-company-users',
  templateUrl: './company-users.component.html',
  styleUrl: './company-users.component.scss'
})
export class CompanyUsersComponent implements OnInit {
  users:any[] =[]
  // users$!: Observable<string[]>;
  constructor(
    private dashapi: DashApiService,
    private helper: HelperService
  ){}
  ngOnInit() {
    this.getusers()
  }
  getusers(){
    let token = this.helper.get_local('token')
      this.dashapi.all_users(token).subscribe({
        next: (res) =>{
          if (res.status === 204) {
            this.users = []; // or handle accordingly
            return; // Exit early
          }else{
            this.users = res.body.data
          }
        },
        error: (err) =>{
          console.log(err)
        },
      })
  }
}
