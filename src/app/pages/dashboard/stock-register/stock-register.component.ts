import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';
import { Product } from '../../../interfaces/product';

@Component({
  selector: 'app-stock-register',
  templateUrl: './stock-register.component.html',
  styleUrl: './stock-register.component.scss'
})
export class StockRegisterComponent implements OnInit, OnDestroy {
  sub_stock_register:Subscription | undefined
  products: Product[] = [];
  filteredProduct:  Observable<Product[]> | undefined ;
  seachable_pro_id:number=0;

  data:any[] = []

     // paginations
     is_sppiner:boolean=true
     totalItems = 0;
     currentPage = 1;
     itemsPerPage = 0;
     pages:number = 0;
     daybookSearchForm!:FormGroup

     // paginations
  constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private activeroute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ){}
  ngOnInit(): void {
      this.activeroute.params.subscribe((res:any) =>{
        this.currentPage = res.page
        this.load_stock_register(this.currentPage, this.itemsPerPage)

      })
    this.daybookSearchForm = this.load_form()
    this.load_products()

      console.log("producvt ", this.products)
      this.filteredProduct  = this.daybookSearchForm.get('name')?.valueChanges.pipe(
            startWith(''),
            map(value => {
              return this._filter2(value || '')
            })
          )
  }

  load_products(){
    this.dashapi.get_all_products_dashboard(this.helper.get_local('token')).subscribe({
      next:(res) => {
        this.products = res.body.data
      }
    })
  }
  onOptionSelect(e:any){
    console.log("my", e)
    if (e == 'all'){
      this.load_stock_register(this.currentPage, this.itemsPerPage)
    }else{
      this.seachable_pro_id = Number(e.id)
      this.daybookSearchForm.get('name')?.setValue(e.name)
      console.log(this.products)
    }
  }
  private _filter2(value: any): any{

    const filterValue = typeof value === 'object' ?  value.name.toLowerCase() : value.toLowerCase();
            return this.products.filter((option:any) => ((option?.name + option?.part_no).toLocaleLowerCase()).includes(filterValue) ||
     JSON.stringify( option.id).toLocaleLowerCase().includes(filterValue));
   }

  load_stock_register(currentPage:number, itemsPerPage:number, product_id?:number){
    this.is_sppiner = true
    this.spinner.show()
    this.sub_stock_register = this.dashapi.stock_register(this.helper.get_local('token'),currentPage,itemsPerPage, product_id).subscribe({
      next:(res:any)=>{
          this.is_sppiner = false
          // console.log("dsfsdf",res?.data == undefined)
          this.data = res?.data == undefined ? [] : res.data
        // pagination

        this.currentPage = res?.pagination == undefined ? 0 : res.pagination.page
        this.totalItems = res?.pagination == undefined ? 0 : res.pagination.count
        this.pages = res?.pagination == undefined ? 0 : res.pagination.pages
        this.itemsPerPage = res?.pagination == undefined ? 0 : res.pagination.items
      },
      error: (err) =>  {
        this.is_sppiner = false
        console.log(err)
      },
      complete: () => console.log('t:'),
    })

  }
  pageChange(e:any){
    this.data = []
    this.currentPage  = e
    // console.log(this.currentPage)
    this.router.navigate(['dashboard/stock-register/', this.currentPage ])

  }
    load_form(){
        return this.fb.group({
          name:['', [Validators.required]]
        })
    }
    submit(){
      // console.log(this.daybookSearchForm.value)
      this.load_stock_register(1, this.itemsPerPage, this.seachable_pro_id)
    }
  ngOnDestroy(): void {
    this.sub_stock_register?.unsubscribe()
  }
}
