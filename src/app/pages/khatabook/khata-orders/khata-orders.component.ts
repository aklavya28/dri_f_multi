import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-khata-orders',
  templateUrl: './khata-orders.component.html',
  styleUrl: './khata-orders.component.scss'
})
export class KhataOrdersComponent implements OnInit, OnDestroy{
  sub_khata_orders!:Subscription
  seachOrdersForm!:FormGroup
  value:string = ''
  show_dates:boolean = false

  slug:string = ''
  name:string = ''
  data:any[] =[]

  // pagination
    currentPage:number = 1
    itemsPerPage:number = 0
    is_sppiner:boolean = true
    totalItems:number = 0
    pages:number=0
  // pagination

    constructor(
      private helper: HelperService,
      private dashapi: DashApiService,
      private active_route: ActivatedRoute,
      private spinner: NgxSpinnerService,
      private router: Router,
      private fb: FormBuilder
    ){ }

  ngOnInit(): void {
    this.active_route.params.subscribe((res:any)=>{
      this.name = res.name
      this.slug = res.slug
      this.load_orders()
      this.seachOrdersForm = this.load_seach()


      // this.currentPage = res.page

      // this.load_khata(this.currentPage, this.itemsPerPage)
    })
  }
  load_orders(form?:any){
    this.is_sppiner = true
    this.spinner.show()
    let api:any
    if(form){
      console.log("ha")
      api = this.dashapi.khata_orders(this.helper.get_local('token'), this.slug, this.currentPage, this.itemsPerPage, form)
    }else{
      console.log("na")
      api = this.dashapi.khata_orders(this.helper.get_local('token'), this.slug, this.currentPage, this.itemsPerPage)
    }

     this.sub_khata_orders =  api.subscribe((res:any) =>{

          this.is_sppiner = false
          this.spinner.hide()
          this.data = res.data
        // pagination
        this.currentPage = res.pagination.page
        this.totalItems = res.pagination.count
        this.pages = res.pagination.pages
        this.itemsPerPage = res.pagination.items

    }, (err:any) =>{
         this.is_sppiner = false
         this.spinner.hide()
    })
  }
  load_seach(){
    return this.fb.group({
      search_by: this.fb.control('', [Validators.required]),
      // seach_value: this.fb.control('', [Validators.required, Validators.maxLength(30)]),
      seach_value: this.fb.control(''),
      order_type: this.fb.control(null),
      start: [''],
      end: ['']
    })
  }

  seach_value_ch(e:any){
    this.value = this.seachOrdersForm.get('seach_value')?.value
  }
  clear_fval(){
    this.seachOrdersForm.get('seach_value')?.setValue('')
  }
  convertToNumber(value: string): number {
    const number = Number(value);
    if (isNaN(number)) {
      throw new Error('Invalid number format');
    }
    return number;
  }
  pageChange(e:any){
    this.data = []
    this.currentPage  = e
    console.log(this.slug, this.name, this.currentPage)
    this.router.navigate(['khatabook/khata-orders/', this.slug, this.name, this.currentPage ])

  }

  search_by_change(e:any){
    console.log(e)
    if(e === 'order_date'){
      this.addDateValidators()
      this.show_dates = true
    }else if(e === 'order_type'){
      this.addDateValidators()
      this.addOrderTypeValidation()
      this.show_dates = true
    }else{
      this.removeDateValidators()
      this.removeaddOrderTypeValidation()
      this.show_dates = false
    }
  }
   // validations
  // Add date validators
  addOrderTypeValidation(): void{
    const order_type = this.seachOrdersForm.get('order_type');
    order_type?.setValidators([Validators.required]);
    order_type?.updateValueAndValidity();
    this.seachOrdersForm.updateValueAndValidity();
  }
  removeaddOrderTypeValidation(): void {
    const order_type = this.seachOrdersForm.get('order_type');
    order_type?.clearValidators();
    this.seachOrdersForm.clearValidators(); // Clear the group validators
    order_type?.updateValueAndValidity();
    this.seachOrdersForm.updateValueAndValidity(); // Revalidate the form group
  }

  addDateValidators(): void {
    const startControl = this.seachOrdersForm.get('start');
    const endControl = this.seachOrdersForm.get('end');

    startControl?.setValidators([Validators.required]);
    endControl?.setValidators([Validators.required]);

    this.seachOrdersForm.setValidators(CustomValidation.dateRangeValidator('start', 'end'));

    startControl?.updateValueAndValidity();
    endControl?.updateValueAndValidity();
    this.seachOrdersForm.updateValueAndValidity(); // Revalidate the form group
  }

  // Remove date validators
  removeDateValidators(): void {
    const startControl = this.seachOrdersForm.get('start');
    const endControl = this.seachOrdersForm.get('end');

    startControl?.clearValidators();
    endControl?.clearValidators();

    this.seachOrdersForm.clearValidators(); // Clear the group validators

    startControl?.updateValueAndValidity();
    endControl?.updateValueAndValidity();
    this.seachOrdersForm.updateValueAndValidity(); // Revalidate the form group
  }
  // validations
  submit(){

    this.data = []
    let data:any
    if (this.seachOrdersForm.get('search_by')?.value === "order_date"){
     data = {
        search_by: this.seachOrdersForm.get('search_by')?.value,
        end: this.seachOrdersForm.get('end')?.value,
        start: this.seachOrdersForm.get('start')?.value
      }
    } else if(this.seachOrdersForm.get('search_by')?.value === "order_type"){
      data = {
        search_by: this.seachOrdersForm.get('search_by')?.value,
        order_type: this.seachOrdersForm.get('order_type')?.value,
        end: this.seachOrdersForm.get('end')?.value,
        start: this.seachOrdersForm.get('start')?.value
      }
    }else {
      data = {
        search_by: this.seachOrdersForm.get('search_by')?.value,
        seach_value: this.seachOrdersForm.get('seach_value')?.value
      }
    }
    console.log(data)

    this.load_orders(JSON.stringify(data))

  }
  editOrder(slug:string, type:string){
    if(type.toLocaleLowerCase() === 'purchase'){
      this.router.navigate(['/accounting/edit-order', slug])
    }else{
      this.router.navigate(['/accounting/edit-sale-order', slug])
    }
  }
  approve_order(d:number, type?:string){
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Approve",
        showDenyButton: true,
        denyButtonText: `Reject`
      }).then((result) => {
        if (result.isConfirmed) {
          // this.get_all_orders(this.helper.get_local('token'), this.data)

          this.dashapi.approve_bill(this.helper.get_local('token'), {id:d}).subscribe((res:any) =>{
              // console.log(res)
              this.load_orders()
               Swal.fire({
                  title: "Success",
                  text: res.status,
                  icon: "success"
                });
            }, err=>{
              Swal.fire({
                text: err.error.error,
                icon: "error"
              });
            })

        }else if (result.isDenied) {
          this.dashapi.approve_bill(this.helper.get_local('token'), {id:d, type: "reject"}).subscribe((res:any) =>{
            // console.log(res)
            this.load_orders()
             Swal.fire({
                title: "Success",
                text: res.status,
                icon: "success"
              });
          }, err=>{
            Swal.fire({
              text: err.error.error,
              icon: "error"
            });
          })

        }
      });
    }
  ngOnDestroy(): void {
    this.sub_khata_orders?.unsubscribe()
  }
}
