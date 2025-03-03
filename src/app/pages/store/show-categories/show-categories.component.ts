import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-show-categories',
  templateUrl: './show-categories.component.html',
  styleUrl: './show-categories.component.scss'
})
export class ShowCategoriesComponent implements OnInit, OnDestroy {
  categories:any
  sub_get_product_categories:Subscription | undefined
  is_spinner:boolean = false
  constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private spinner: NgxSpinnerService
  ){}
  ngOnInit() {
    let token = this.helper.get_local('token')
    let company_id = this.helper.company_id()
    this.is_spinner = true
    this.spinner.show()
     this.sub_get_product_categories = this.dashapi.get_product_categories(token, company_id).subscribe((res) =>{
        this.is_spinner = false
        this.spinner.hide()
        this.categories = res.data
    }, err =>{
        this.is_spinner = false
        this.spinner.hide()
    })

    // console.log("sdfsdfsfsd sdf sd sf")
  }
  ngOnDestroy(): void {
    this.sub_get_product_categories?.unsubscribe()
  }
}
