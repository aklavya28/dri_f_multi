import { Token } from '@angular/compiler';
import { DashApiService } from './../../../services/dash-api.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy {
  sub_get_all_orders:Subscription | undefined
  sub_approve_bill:Subscription | undefined
  // search
  seachOrdersForm!:FormGroup
  value = '';
  show_dates:boolean = false

  // search

  data:any[] = [];



  balance:number = 0
  // paginations
  is_sppiner:boolean=true
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 0;
  pages:number = 0
// paginations

  constructor(
    private helper: HelperService,
    private dashapi: DashApiService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activeroute: ActivatedRoute
  ){

  }
  ngOnInit(): void {
    this.activeroute.params.subscribe((res:any) =>{
      this.currentPage = res.page
      this.get_all_orders(this.currentPage, this.itemsPerPage)
      this.seachOrdersForm = this.load_seach()
    })



  }

  get_all_orders(currentPage:number, itemsPerPage:number, data?:any){
    this.is_sppiner = true
    this.spinner.show()

    this.sub_get_all_orders  = this.dashapi.get_all_orders(this.helper.get_local('token') ,currentPage,itemsPerPage, data).subscribe({
      next:(res) =>{
        if (res.status === 204) {
           this.data = []; // or handle accordingly
          this.is_sppiner = false
          return; // Exit early
        }else{
          res = res.body
        }
                  this.is_sppiner = false
                  this.data = res.data

                 this.currentPage = res.pagination.page
                 this.totalItems = res.pagination.count
                 this.pages = res.pagination.pages
                 this.itemsPerPage = res.pagination.items
      },
      error: (err)=>{
        this.is_sppiner = false
        console.log(err)
      },
      complete:() =>{

      }
    })

  }
  pageChange(e:any){
    this.data = []
    this.currentPage  = e
     this.router.navigate(['/accounting/orders', this.currentPage ])
  }
  convertToNumber(value: string): number {
    const number = Number(value);
    if (isNaN(number)) {
      throw new Error('Invalid number format');
    }
    return number;
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
            this.get_all_orders(this.currentPage, this.itemsPerPage)
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
          this.get_all_orders(this.currentPage, this.itemsPerPage)
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
  submit(){

    this.data = []
    let from_data:any
    if (this.seachOrdersForm.get('search_by')?.value === "order_date"){
      from_data = {
        search_by: this.seachOrdersForm.get('search_by')?.value,
        end: this.seachOrdersForm.get('end')?.value,
        start: this.seachOrdersForm.get('start')?.value
      }
    } else if(this.seachOrdersForm.get('search_by')?.value === "order_type"){
      from_data = {
        search_by: this.seachOrdersForm.get('search_by')?.value,
        order_type: this.seachOrdersForm.get('order_type')?.value,
        end: this.seachOrdersForm.get('end')?.value,
        start: this.seachOrdersForm.get('start')?.value
      }
    }else {
      from_data = {
        search_by: this.seachOrdersForm.get('search_by')?.value,
        seach_value: this.seachOrdersForm.get('seach_value')?.value
      }
    }

    this.get_all_orders(this.currentPage, this.itemsPerPage, JSON.stringify(from_data))
    // this.get_all_orders(this.helper.get_local('token'), data)

  }

  seach_value_ch(e:any){
      this.value = this.seachOrdersForm.get('seach_value')?.value
  }
  clear_fval(){
    this.seachOrdersForm.get('seach_value')?.setValue('')
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
  getToday(): string {
    return new Date().toISOString().split('T')[0]
 }
  ngOnDestroy(): void {
    this.sub_get_all_orders?.unsubscribe()
    this.sub_approve_bill?.unsubscribe()
  }

  editOrder(slug:string, type:string){
    if(type.toLocaleLowerCase() === 'purchase'){
      this.router.navigate(['/accounting/edit-order', slug])
    }else{
      this.router.navigate(['/accounting/edit-sale-order', slug])
    }
  }


}
