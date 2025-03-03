import { Subscription } from 'rxjs';
import {Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import { LayoutComponent } from '../../layout/layout.component';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';

@Component({
  selector: 'app-khatabook-accounts',
  templateUrl: './khatabook-accounts.component.html',
  styleUrl: './khatabook-accounts.component.scss'
})
export class KhatabookAccountsComponent implements OnInit,OnDestroy {


  sub_get_all_khatabook!:Subscription
  sub_change_active_status_khata!:Subscription
  seachOrdersForm!:FormGroup
  data:any[] = []
  checked:boolean= false
  // paginations
    is_sppiner:boolean = true
    totalItems = 0;
    currentPage = 1;
    itemsPerPage = 0;
    pages:number = 0
  // paginations
   constructor(
    private helper: HelperService,
    private dashapi: DashApiService,
    private layout: LayoutComponent,
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private activeroute: ActivatedRoute,

    ){}
   // paginations

   ngOnInit(): void {

    this.activeroute.params.subscribe((res:any) =>{
      this.seachOrdersForm = this.load_search_form()
      this.currentPage = res.page
      this.get_all_khatabooks(this.currentPage, this.itemsPerPage)
    })

  }
  load_search_form(){
    return this.fb.group({
      search_by: this.fb.control('', [Validators.required]),
      mobile: [''],
      name: [''],
      ac: ['']
    })
  }

  search_by_change(e:string){
    if(e === 'mobile'){
      this.addMobileV()
      this.removeV('name')
      this.removeV('ac')

    }else if(e === 'name'){
      this.addNameAcV(e)
      this.removeV('mobile')
      this.removeV('ac')
    }else if(e === 'ac'){
      this.addNameAcV(e)
      this.removeV('mobile')
      this.removeV('name')
    }else{
      this.removeV('mobile')
      this.removeV('name')
      this.removeV('ac')
    }
  }


  addMobileV(): void{
    const mobile = this.seachOrdersForm.get('mobile');
    mobile?.setValidators([Validators.required, CustomValidation.only_digit(), Validators.maxLength(10)]);
    mobile?.updateValueAndValidity();
    this.seachOrdersForm.updateValueAndValidity();
  }
  addNameAcV(key:string): void{
    const name = this.seachOrdersForm.get(key);
    name?.setValidators([Validators.required,  Validators.maxLength(30)]);
    name?.updateValueAndValidity();
    this.seachOrdersForm.updateValueAndValidity();
  }
  removeV(key:string): void {
    const name = this.seachOrdersForm.get(key);
    name?.clearValidators();
    this.seachOrdersForm.clearValidators(); // Clear the group validators
    name?.updateValueAndValidity();
    this.seachOrdersForm.updateValueAndValidity(); // Revalidate the form group
  }

  get_all_khatabooks(currentPage:number, itemsPerPage:number, search?:any){
    this.is_sppiner = true
    this.spinner.show()
    this.sub_get_all_khatabook  = this.dashapi.get_all_khatabooks(this.helper.get_local('token'),currentPage,itemsPerPage, search).subscribe((res)=>{
        this.is_sppiner = false
        this.data = res.data
      this.currentPage = res.pagination.page
      this.totalItems = res.pagination.count
      this.pages = res.pagination.pages
      this.itemsPerPage = res.pagination.items

    }, err =>{
      this.is_sppiner = false
    })
  }
  pageChange(e:any){
        this.data = []
        this.currentPage  = e

        console.log(e)
        this.router.navigate(['khatabook/khatabook-accounts/', this.currentPage ])
    }
  getObjectKeys(narration: string): { key: string, value: any }[] {
    const parsedObject = JSON.parse(narration);
    return Object.keys(parsedObject).map(key => ({ key, value: parsedObject[key] }));
  }
  change_active_status_khata(e:any, slug:string){
    let data = {is_active: e.checked, slug: slug}
    // console.log(data)
    let token = this.helper.get_local('token')
    this.sub_change_active_status_khata = this.dashapi.change_active_status_khata(token,slug, data ).subscribe((res)=>{
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
  new_khata(url:string){
    this.helper.navigateAndActive(this.layout.menus(),'Khatabook', url, this.router, this.layout)
  }
  submit(){
    this.data = []
    let data = this.seachOrdersForm.value
    console.log(data)
    this.get_all_khatabooks(this.currentPage, this.itemsPerPage, JSON.stringify(data))
  }
  ngOnDestroy(): void {
    this.sub_get_all_khatabook?.unsubscribe()
    this.sub_change_active_status_khata?.unsubscribe()
  }

}
