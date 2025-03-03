import { Component, effect, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.scss'
})
export class AllProductsComponent implements OnInit, OnDestroy {
  sub_get_product_categories:Subscription | undefined
  sub_get_all_products:Subscription | undefined
    products:any[] =[]
    categories:any
    productSearchForm!:FormGroup
    matcher:any
    // speninter
    is_spinner:boolean = false
    // speninter


    constructor(
      private dashapi: DashApiService,
      private helper: HelperService,
      private fb: FormBuilder,
      private spinner: NgxSpinnerService
    ){
      // effect((res)=>{
      //   let token = this.helper.get_local('token')

      // })


    }
    ngOnInit(){

      this.productSearchForm = this.fb.group({
        categories_list: this.fb.control('', [Validators.required]),
        type: this.fb.control('', [Validators.required]),
        search_key: this.fb.control(null)
      })
      this.matcher = new ErrorStateMatcher();

      // category api search
        let token = this.helper.get_local('token')
        let company_id = this.helper.company_id()
        this.get_categories(token, company_id)
        this.productData(token)
      // category api search


    }
    get_categories(token:any, company_id:number){
     this.sub_get_product_categories  =  this.dashapi.purchase_product_categories(token).subscribe((res:any)=>{
        this.categories = res.data
      })
    }
    productData(token:any, data?:any){
      this.is_spinner = true
      this.spinner.show()
     this.sub_get_all_products = this.dashapi.get_all_products(token, data).subscribe(async(res:any)=>{
        console.log(res)
          this.products = res.data
          this.spinner.hide()
          this.is_spinner = false

      }, (err)=>{
          this.spinner.hide()
          this.products = []
          this.is_spinner = false
      })
    }
    seach_data(){
      this.products = []
      let token = this.helper.get_local('token')
      const data = {
        categories_list: this.productSearchForm.get('categories_list')?.value,
        type: this.productSearchForm.get('type')?.value,
        search_key: this.productSearchForm.get('search_key')?.value,
      }

      this.productData(token, data)
    }
    ngOnDestroy(): void {
      this.sub_get_product_categories?.unsubscribe()
      this.sub_get_all_products?.unsubscribe()
    }

}
