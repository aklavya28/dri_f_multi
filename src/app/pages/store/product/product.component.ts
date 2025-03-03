import { CustomValidation } from './../../../interfaces/autocomplete-validation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from './../../../services/helper.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { DashApiService } from '../../../services/dash-api.service';
import { Subscription } from 'rxjs';
import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Categories } from '../../../interfaces/categories';
import Swal from 'sweetalert2';
import { LayoutComponent } from '../../layout/layout.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})

export class ProductComponent implements OnInit, OnDestroy{
  sub_get_product_categories:Subscription | undefined
  sub_new_product:Subscription | undefined
  newProductForm!:FormGroup
  matcher:any
  // autocomplete
    categories: Categories[] = [];
    filteredCat!:  Observable<Categories[]>;
  // autocomplete
  units:any [] = []
    constructor(
      private helper: HelperService,
      private fb: FormBuilder,
      private dashapi: DashApiService,
      private layout: LayoutComponent,
      private router: Router
    ){
      this.newProductForm = this.formfields()
    }
    ngOnInit(): void {
      let token = this.helper.get_local('token')
      let company_id = this.helper.company_id()
     this.sub_get_product_categories  = this.dashapi.get_product_categories(token, company_id).subscribe((res:any)=>{
        // autocomplete
          this.categories = res.data
          this.addValidation_check_category()
        // autocomplete
      }, (err)=>{
        alert(err)
      })
      this.matcher = new ErrorStateMatcher();

      // testing
        this.filteredCat  = this.newProductForm.controls['testing'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter2(value || '')),
        )
      this.load_unites()
    }
    load_unites (){
      this.dashapi.product_units(this.helper.get_local('token')).subscribe((res:any) =>{
        this.units = res.data
      }, err =>{

      })
    }
    formfields(){
     return  this.fb.group({
      testing: [''],
      //
        category_id: this.fb.control('', [Validators.required]),
        name: this.fb.control('', [Validators.required,Validators.minLength(3),Validators.maxLength(50) ]),
        hsn_sac: this.fb.control('', [Validators.required, Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$') ]),
        part_no: this.fb.control(null),
        description: this.fb.control('', [ Validators.minLength(3),Validators.maxLength(100) ] ),
        qty_unit: this.fb.control('', [Validators.required ]),
        gst: this.fb.control('', [Validators.required, CustomValidation.only_digit(), Validators.min(1), Validators.max(50)]),

      })
    }

    submit(){

      let  data:any = {
           product_category_id: this.newProductForm.get('category_id')?.value,
           name: this.newProductForm.get('name')?.value,
           hsn_sac: this.newProductForm.get('hsn_sac')?.value,
           description: this.newProductForm.get('description')?.value,
           unit: this.newProductForm.get('qty_unit')?.value,
           gst: this.newProductForm.get('gst')?.value,
           part_no: this.newProductForm.get('part_no')?.value,
        }

        let token = this.helper.get_local('token');
      //  console.log("product", data )
        this.sub_new_product =  this.dashapi.new_product(token, data).subscribe((res:any) =>{
          Swal.fire({
            position: "top-end",
            icon: "success",
            text: `${res.status}`,
            showConfirmButton: false,
            timer: 1500
          });
          this.newProductForm.reset()
        }, (err) =>{
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.error.error,
            // footer: '<a href="#">Why do I have this issue?</a>'
          });
        })

    }
    navigate_to(){
      this.helper.navigateAndActive(this.layout.menus(),'Manage Items', 'store/show-categories', this.router, this.layout)
      this.router.navigate(['/store/new-category'])
    }
    ngOnDestroy(): void {
      this.sub_get_product_categories?.unsubscribe()
      this.sub_new_product?.unsubscribe()
    }


    // auto_complete
    addValidation_check_category() {
      // add
      this.newProductForm.get('testing')?.setValidators(Validators.compose([Validators.required, CustomValidation.valueSelected(this.categories)]))
      // update
      this.newProductForm.get('testing')?.updateValueAndValidity()
    }


    private _filter2(value: string): any{
      const filterValue = value.toLowerCase();
         return this.categories.filter(option => option.name.toLocaleLowerCase().includes(filterValue) ||
      JSON.stringify( option.id).toLocaleLowerCase().includes(filterValue));
    }
    onOptionSelect(e:any){
      let name =  e.split(',')[0]
      let id =  e.split(',')[1]
       this.newProductForm.get('testing')?.setValue(name)
       this.newProductForm.get('category_id')?.setValue(id)

     }
     // auto_complete
}
