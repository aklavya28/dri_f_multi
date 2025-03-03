import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.scss'
})
export class ViewOrdersComponent implements OnInit {
  constructor(
    private router: Router
  ){}
  ngOnInit() {
    const currentState = this.router.lastSuccessfulNavigation;
    console.log(currentState?.extras.state?.['data'])

  }
}
