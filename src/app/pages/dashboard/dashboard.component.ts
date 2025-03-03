import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-dashboard',
  template:`
  <div class="dashboard_wrapper">
      <router-outlet />
    </div>

  `,
  styles: [
  `
  .dashboard_wrapper{
     margin: 10px;
    }
`],
  // templateUrl: './dashboard.component.html',
  // styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(  ){

  }
  ngOnInit(): void {

  }

}
