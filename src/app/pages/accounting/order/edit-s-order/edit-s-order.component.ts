

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashApiService } from './../../../../services/dash-api.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { HelperService } from './../../../../services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LayoutComponent } from './../../../layout/layout.component';
import { map, Observable, startWith, Subject, Subscription, takeUntil } from 'rxjs';
import { CustomValidation } from './../../../../interfaces/autocomplete-validation';
import { Product } from './../../../../interfaces/product';
import { Khata } from './../../../../interfaces/khata';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderHelperService } from '../../../../services/order-helper.service';
import { Assets } from '../../../../interfaces/assets';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-edit-s-order',
  templateUrl: './edit-s-order.component.html',
  styleUrl: './edit-s-order.component.scss',
   animations: [
      trigger(
        'enterAnimation', [
          transition(':enter', [
            style({ opacity: 0}),
            animate('1s', style({ opacity: 1}))
          ]),
          transition(':leave', [
            style({ opacity: 1}),
            animate('.5s', style({ opacity: 0})),

          ])
        ]
      )
    ],
})
export class EditSOrderComponent implements OnInit, OnDestroy {
  sub_get_venders:Subscription | undefined
  sub_get_sale_categories:Subscription | undefined
  sub_get_sale_products:Subscription | undefined
  sub_get_sale_product_unit_price:Subscription | undefined
  sub_get_sale_product_available_units:Subscription | undefined
  sub_add_product_items_temp:Subscription | undefined
  sub_remove_temp_user_order_items:Subscription | undefined

  sub_save_sale_order:Subscription | undefined
  sub_get_sale_services:Subscription | undefined
// sdfsdfsdf
private destroy$ = new Subject<void>();
  saleOrderForm!:FormGroup;
  matcher:any;
  venders_api:any;
  item_data:any[] =[]
  billTotal: any
  liquid:any[] = []
  submitError:any[] = []
  // edit
    is_discount = false
    is_round_off = false
    before_order_info:any
    slug:string = ''
  // edit

  input_leder_vender:string = ""
  add_product_btn:boolean = false
  // product add form
    categories:any[]=[]

    mrp_list:any[]=[]
    no_of_unit_api:number = 0
    gst_api:number = 0
    purchase_unit_price_api:number = 0
    // validation
    max_unit:number = 0
  // product add form
  // autocomplete
    products:Product[] = []
    khata:Khata[] = []
    filteredCat:  Observable<Product[]> | undefined;
    filteredKhata:  Observable<Khata[]> | undefined ;
  // autocomplete
  khatabook_state_id:number = 0
  unit_price_with_discount:number = 0

  // discount
  discount_val:number = 0
  // service
  add_service:boolean = false
  services_data:any[] = []
  services_items:any[] = []
  is_sppiner:boolean = false

   // fixed Assets
    show_fixed:boolean = false
    fixedAssetsApi:any = []
    fixedAssets:any = []
    filterAssets:  Observable<Assets[]> | undefined;
    maxNoOfUnit: number = 0

  constructor(
    private dashapi: DashApiService,
    private fb: FormBuilder,
    private helper: HelperService,
    private router: Router,
    private layout: LayoutComponent,
    private aRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private oHelper: OrderHelperService
  ){

  }
  ngOnInit() {
    let token = this.helper.get_local('token')
    let company_id = this.helper.company_id()
    // apin hit to getting products

    this.aRoute.params.subscribe((res:any) =>{
      this.slug = res.slug
      this.apiOldProducts(token,this.slug)

    })

    this.dashapi.get_liquid(token).subscribe((res:any) =>{
      this.liquid = res.data
      // console.log(res.data)
    })



    this.sub_get_venders = this.dashapi.get_venders(token, company_id).subscribe((res) =>{
      // console.log("vendor",res)
      this.venders_api = res.data
    })

    this.saleOrderForm = this.addOrder()
    this.matcher = new ErrorStateMatcher();
    // onchage
      this.saleOrderForm.get('product.purchase_unit_price')?.disable()


      // on change credit from
      // change ductction
      this.saleOrderForm.get('credit_from')?.valueChanges.subscribe((res:any) =>{
        this.saleOrderForm.get('lenders')?.reset()
        if(res.length > 1){
          this.updateCredit_fromInputs(res)
        }else{
          this.updateCredit_fromInputs([])
        }
        // setting debtor and vendors api

        this.khata = []
        if (res.includes("debtor")){
          this.dashapi.get_all_khatabooks_drop(token, "debtor" ).subscribe(res =>{

            this.khata = res.data

            this.input_leder_vender = "debtor"
            this.addValidation_check_lenders()
          })
        }else{
          this.dashapi.get_all_khatabooks_drop(token).subscribe(res =>{
            // console.log("lenders", res)
            this.khata = res.data
            this.input_leder_vender = "Khata"
            this.addValidation_check_lenders()
          })
        }
        // setting debtor and vendors api
      })
      this.filteredCat  = this.saleOrderForm.get('product.product_name')?.valueChanges.pipe(
        startWith(''),
        map(value => {
          return this._filter2(value || '')
        }) )

        this.filterAssets  = this.saleOrderForm.get('fixedAsset.name')?.valueChanges.pipe(
          startWith(''),
          map(value => {
            return this._filter4(value || '')
          }) )
    // onchage

  }
  onCatChange(e:any){
    this.saleOrderForm.get('product.product_name')?.reset()
    this.sub_get_sale_products = this.dashapi.get_sale_products(this.helper.get_local('token'), Number(e)).subscribe((res:any) =>{
        this.resetProducts()
        // this.saleOrderForm.get('product.mrp')?.reset()
        this.products = res.data
        // console.log("1sat",this.products)
        this.productNameValidations()
      }, (err)=>{
      })
 }
  // service
  AddService(){
    this.addServiceValidation()
    this.add_service = true
    this.sub_get_sale_services = this.dashapi.get_sale_services_active(this.helper.get_local('token')).subscribe((res:any) =>{
      this.services_data = res.data
    })

  }
  cancelService(e:any){
    this.removeServiceValidation()

    this.add_service = false
    this.saleOrderForm.get('service')?.reset()

  }
  SaveService(e:any){
    e.preventDefault()
    let serv = this.saleOrderForm.get('service')?.value
    this.services_items.push(serv)
    this.saleOrderForm.get('service')?.reset()
    this.add_service = false
    this.services_items = this.oHelper.jsonServiceBinding(this.services_items)
    this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)
    this.removeServiceValidation()


  }
  ChangeChooseServie(e:any){
    this.saleOrderForm.get('service.gst')?.setValue(e.gst)
    this.saleOrderForm.get('service.sale_service_id')?.setValue(e.id)
  }
  // service


  onChangeMrp(e:any){
      let data = e?.value
      let token = this.helper.get_local('token')
      this.sub_get_sale_product_available_units = this.dashapi.get_sale_product_available_units(token, Number(data.product_id), Number(data.unit_price)).subscribe((res:any) =>{
      this.no_of_unit_api = res.data.available_units
      this.gst_api = res.data.gst
      this.addMax( res.data.available_units)
      this.purchase_unit_price_api = res.data.unit_price


      // this.unit_price = res.data.unit_price
    }, (err) =>{
    })
  }


  addOrder(){
    return this.fb.group({
      credit_from:  this.fb.control('',[Validators.required ]),
      credit_fromInputs: this.fb.array([]),

      lenders: this.fb.control('', [Validators.required]),
      lenders_ac: this.fb.control(null),
      order_date: this.fb.control('',[Validators.required]),
      mobile: this.fb.control(null),
      vehicle_no: this.fb.control(null),
      irn_no: this.fb.control(null),
      ack_no: this.fb.control(null),
      khatabook_id:this.fb.control(null),
      // service
      service: this.fb.group({
        choose_service: this.fb.control(null),
        amount: this.fb.control(null),
        gst: this.fb.control(null),
        sale_service_id: this.fb.control(null),
      }),
      // service
        // service
        fixedAsset: this.fb.group({
          name: this.fb.control(null),
          hsn: this.fb.control(null),
          no_of_unit: this.fb.control(null),
          unit_amount: this.fb.control(null),
          gst: this.fb.control(null),
          refrence_id: this.fb.control(null)
        }),
      // round off charges
      round_off: [false],
      round_off_amt: this.fb.control({value:'', disabled: true }),
      // round off charges
      is_discount: [false],
      orver_all_discount:[''],
      auto_approve: this.fb.control(null),
      product: this.fb.group({
        category_id: this.fb.control(null),
        product_name:this.fb.control(null),
        product_description: this.fb.control(null),
        mrp:this.fb.control(null), // we are using this column as unit_price segrigation
        no_of_unit:this.fb.control(null),
        purchase_unit_price:this.fb.control(null),
        unit_price:this.fb.control(null),
        gst :this.fb.control({value:'', disabled: true }),
        discount : this.fb.control(null)
      })

    })
  }
  discount_change(e:any){
    if(e == true){
      this.discount_val = Number(this.saleOrderForm.get('orver_all_discount')?.value)
      this.addDiscountV()
      this.apply_discount()
    }else{
      this.removeDiscountV('orver_all_discount')
      this.saleOrderForm.get('orver_all_discount')?.reset()
      this.discount_val = 0
      this.apply_discount()
    }

  }

  apply_discount(){
    this.discount_val = Number(this.saleOrderForm.get('orver_all_discount')?.value)
      let neew_list_data:any = []
      this.item_data.forEach((el, index) =>{
        let cal_discount = ( Number(el.no_of_unit) * Number(el.unit_price)) * Number(this.discount_val)/100
        let discouned_total = Number((Number(el.no_of_unit) * Number(el.unit_price)) - cal_discount)
        let cal_gst = Number((discouned_total *  Number(el.gst_percent)/100))
        let amount = (Number(el.no_of_unit) * Number(el.unit_price) ) + (cal_gst) - cal_discount
      let json_obj = el
          json_obj['gst'] = cal_gst
          json_obj['total'] = amount
          json_obj['discount'] = cal_discount
          neew_list_data.push(json_obj)
        })
    this.item_data = []
    this.item_data = neew_list_data
    this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)
    if (this.discount_val > 0){
      Swal.fire({
        position: "center",
        icon: "success",
        text: "Applied successfully",
        showConfirmButton: false,
        timer: 1500
      });

    }

  }


  addDiscountV(): void {
    this.saleOrderForm.get('orver_all_discount')?.setValidators([Validators.required,Validators.max(50), CustomValidation.only_digit()])
    this.saleOrderForm.updateValueAndValidity();
  }
  removeDiscountV(key:string): void {
    const orver_all_discount = this.saleOrderForm.get(key);
    orver_all_discount?.clearValidators();
    this.saleOrderForm.clearValidators(); // Clear the group validators
    orver_all_discount?.updateValueAndValidity();
    this.saleOrderForm.updateValueAndValidity(); // Revalidate the form group
  }

  roundOffChange(e:any){
    // console.log(e)
    if(e ){
      // let grand = this.getGrandTotal(this.item_data, this.services_items, this.fixedAssets)
      // let total = Number(Number(grand.grand_total).toFixed(2))
      let total = Number(Number(this.billTotal.grand_total).toFixed(2))
      let new_total =  Math.round(total)
      this.saleOrderForm.get('round_off_amt')?.setValue((new_total - total).toFixed(2) )
      this.inputChange()

    }else{
      this.saleOrderForm.get('round_off_amt')?.setValue(0)
      this.inputChange()
    }
  }




  get credit_fromInputs(): FormArray {
    return this.saleOrderForm.get('credit_fromInputs') as FormArray;
  }
  updateCredit_fromInputs(selectedOptions: string[]): void {
    this.credit_fromInputs.clear();
    selectedOptions.forEach(option => {
      this.credit_fromInputs.push(this.fb.group({
        name: [option],
        value: ['',  [Validators.required, CustomValidation.only_digit()]]
      }));
    });
  }

  addItems(){
    this.categories = []
    this.resetProducts()
    this.add_product_btn = true
    this.addValidation()
    this.addMax(0);
    let token = this.helper.get_local('token')
    this.sub_get_sale_categories = this.dashapi.get_sale_categories(token).subscribe((res) =>{
      this.categories = res.data
      // console.log("category", res)
    }, (err) =>{
      if(err.error == "revoked token"){
        localStorage.clear()
        // console.log("ee", err.error)
        this.helper.get_local('token')
      }
    })

  }

  addProduct(e:any){
    e.preventDefault()

    let token = this.helper.get_local('token')
    let form_data = {
      discount_percent: this.discount_val,
      round_off_amt: Number(this.saleOrderForm.get('round_off_amt')?.value),
      unit_price_with_discount: Number(this.unit_price_with_discount)
    }
    this.is_sppiner = true
    this.spinner.show()
    let render_list = this.oHelper.sale_item_list_render(this.discount_val, this.saleOrderForm)
    this.dashapi.add_product_items_sale_edit(this.helper.get_local('token'),this.slug, render_list, form_data )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => {
        this.add_product_btn = true
        this.item_data = this.oHelper.jsonProductBinding(res.body.product)
        this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)
        this.saleOrderForm.get('product')?.reset()
        this.removeValidation()
        this.removeMax()

      },
      error: (err: any) => {
        this.is_sppiner = false
        this.spinner.hide()
        console.error('Error removing product:', err);
        Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    text: `${err.error.error}`,
                    showConfirmButton: true,
                  });
      },
        complete: () => {
          this.is_sppiner = false
          this.spinner.hide()
          // Handle any cleanup if necessary
          // console.log('Request complete');

          // this.spinner.hide();
        }
    });

  }

  getGrandTotal(list:any[], service:any[], fixed:any[]){
      let data = this.oHelper.getGrandTotal(list,service,this.saleOrderForm, fixed)
      this.item_data = data.product
      this.services_items = data.service
      this.fixedAssets = data.fixed
    return this.billTotal = data
  }



  removeProduct(index:number, slug:string){
    this.is_sppiner = true
    this.spinner.show()
    this.dashapi.remove_sale_edit_product(this.helper.get_local('token'), slug )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => {
        this.item_data.splice(index, 1)
        // this.oHelper.sale_item_list_render(this.discount_val, this.saleOrderForm)
        this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)
      },
      error: (err: any) => {
        this.is_sppiner = false
        this.spinner.hide()
        console.error('Error removing product:', err);
        Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    text: `${err.error.error}`,
                    showConfirmButton: false,
                    timer: 1500
                  });
      },
      complete: () => {
          this.is_sppiner = false
          this.spinner.hide()
        // console.log('Request complete');
        // this.spinner.hide();
      }
    });

  }
  removeAssets(index:number, id:any){
    this.spinner.show()
    this.is_sppiner = true
    this.dashapi.delete_fixed_assets_sale(this.helper.get_local('token'), id).subscribe((res) =>{
      this.fixedAssets.splice(index, 1)
      this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)
      this.spinner.hide()
      this.is_sppiner = false
    }, err =>{
      alert("not working")
    })
  }
  show_fixed_method(){
    this.fixedAssetsApi = []
    this.dashapi.fixed_assets_sale(this.helper.get_local('token'))
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => {
             this.fixedAssetsApi = res.body.data
      },
      error: (err: any) => {
        this.is_sppiner = false
        this.spinner.hide()
        console.error('Error removing product:', err);
        Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    text: `${err.error.error}`,
                    showConfirmButton: true,
                  });
      },
          complete: () => {
            this.is_sppiner = false
            this.spinner.hide()
            // Handle any cleanup if necessary
            // console.log('Request complete');

            // this.spinner.hide();
      }
    })

    this.show_fixed = true
    this.addAssetValidation()
  }
  cancelFixed(e:any){
    this.removeAssetValidation()
    this.show_fixed = false
    this.saleOrderForm.get('fixedAsset')?.reset()
  }
saveFiexed(){
  // console.log(this.)
  const formData = this.saleOrderForm.get('fixedAsset')?.value
  this.spinner.hide()
        this.is_sppiner = false
  this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)
    this.dashapi.fixed_assets_sale_save(this.helper.get_local('token'), {asset: formData, order_slug: this.slug})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) =>{
        this.fixedAssets.push(res.body.data)
        this.fixedAssets = this.oHelper.jsonFixedBinding(this.fixedAssets)
        this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)
        this.show_fixed = false
        this.removeAssetValidation()
        this.saleOrderForm.get('fixedAsset')?.reset()
      },
      error : (err) =>{

      },
      complete: () =>{
        this.spinner.hide()
        this.is_sppiner = false
      }
    })

  // const formData = this.saleOrderForm.get('fixedAsset')?.value
  // this.fixedAssets.push(formData)
  // this.fixedAssets = this.oHelper.jsonFixedBinding(this.fixedAssets)
  // this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)
  // this.show_fixed = false
  // this.removeAssetValidation()
  // this.saleOrderForm.get('fixedAsset')?.reset()
  }
  onOptionSelectAsset(e:any){
    this.clearMaxAssetValidation()
    this.maxNoOfUnit = Number( e.dr) -  Number( e.cr)
    this.saleOrderForm.get('fixedAsset.name')?.setValue(e.name)
    this.saleOrderForm.get('fixedAsset.hsn')?.setValue(e.hsn)
    this.saleOrderForm.get('fixedAsset.gst')?.setValue(Number(e.gst))
    this.saleOrderForm.get('fixedAsset.no_of_unit')?.setValue(this.maxNoOfUnit)
    this.saleOrderForm.get('fixedAsset.unit_amount')?.setValue(e.unit_amount)
    this.saleOrderForm.get('fixedAsset.refrence_id')?.setValue(e.id)
    this.addMaxAssetValidation()

  }
  addMaxAssetValidation(){
    this.saleOrderForm.get('fixedAsset.no_of_unit')?.setValidators([Validators.required, Validators.max(this.maxNoOfUnit), CustomValidation.only_digit_without_decimal()])
    this.saleOrderForm.get('fixedAsset.gst')?.updateValueAndValidity()
  }
  clearMaxAssetValidation(){
    this.saleOrderForm.get('fixedAsset.no_of_unit')?.clearValidators();
    this.saleOrderForm.get('fixedAsset.no_of_unit')?.updateValueAndValidity()
  }

  addAssetValidation(){

    this.saleOrderForm.get('fixedAsset.name')?.setValidators([Validators.required, Validators.maxLength(50), CustomValidation.alphanumeric()])
    this.saleOrderForm.get('fixedAsset.unit_amount')?.setValidators([Validators.required, Validators.max(5000000), CustomValidation.only_digit()])
    this.saleOrderForm.get('fixedAsset.gst')?.setValidators([Validators.required])
    // update
    this.saleOrderForm.get('fixedAsset.name')?.updateValueAndValidity()
    this.saleOrderForm.get('fixedAsset.unit_amount')?.updateValueAndValidity()
    this.saleOrderForm.get('fixedAsset.no_of_unit')?.updateValueAndValidity()

  }
  removeAssetValidation(){
    this.saleOrderForm.get('fixedAsset.name')?.clearValidators();
    this.saleOrderForm.get('fixedAsset.unit_amount')?.clearValidators();
    this.saleOrderForm.get('fixedAsset.no_of_unit')?.clearValidators();
    this.saleOrderForm.get('fixedAsset.gst')?.clearValidators();

    this.saleOrderForm.get('fixedAsset.name')?.updateValueAndValidity()
    this.saleOrderForm.get('fixedAsset.unit_amount')?.updateValueAndValidity()
    this.saleOrderForm.get('fixedAsset.no_of_unit')?.updateValueAndValidity()
    this.saleOrderForm.get('fixedAsset.gst')?.updateValueAndValidity()
  }



  removeService(index:number){
    this.services_items.splice(index, 1)
    this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)

  }

  cancel(e:any){
    e.preventDefault()
    this.add_product_btn = false
    this.saleOrderForm.get('product')?.reset()
    this.removeValidation()
    this.removeMax()
  }

  submit(){
    if(this.saleOrderForm?.valid){
       // confirm
       Swal.fire({
        title: "Are you sure? ",
        text: 'This action cannot be reverted',
         showCancelButton: true,
        confirmButtonText: 'Confirm',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.ApiSubmit()
        }

      })

  }}
  ApiSubmit(){

    let databoj:any[] = [];

    let credit_from_array = this.saleOrderForm.get('credit_from')?.value
    let paid_obj = this.saleOrderForm.get('credit_fromInputs')?.value
    let khata = this.saleOrderForm.get('lenders_ac')?.value
        // console.log("bill", khata,this.newOrderForm.get('lenders')?.value)
    if( credit_from_array.length <= 1 && credit_from_array.includes('debtor')){
     let data = {
      name: `${khata}`,
      value: Number(this.billTotal ? this.billTotal?.grand_total : 0),
      is_debtor: true
     }
     databoj.push(data)
    }
    else if ( credit_from_array.length <= 1 && !credit_from_array.includes('debtor')){
      let data = {
        name: credit_from_array[0],
        value: Number(this.billTotal ? this.billTotal?.grand_total : 0),
        is_debtor: false
       }
       databoj.push(data)
    }

    else if (credit_from_array.length > 1 && !credit_from_array.includes('debtor')){

      for (let index = 0; index < paid_obj.length; index++) {
        //  console.log("ddd",paid_obj[index])
        paid_obj[index].is_debtor = false
        databoj = paid_obj
      }
    }
    else if (credit_from_array.length > 1 && credit_from_array.includes('debtor')){
      for (let index = 0; index < paid_obj.length; index++) {
        if(paid_obj[index].name === 'debtor' || paid_obj[index].is_debtor){
        //  console.log("ddd",paid_obj[index])
          paid_obj[index].name = `${khata}`
          paid_obj[index].is_debtor = true
        }else{
          // console.log("else ",paid_obj[index])
          paid_obj[index].is_debtor = false
        }
      }

      databoj = paid_obj
    }

      // let data = {baseform: baseform, items: this.item_data, grand_totals: this.getGrandTotal(this.item_data) }
      let data = {
        services_items:this.services_items,
        paid_from: databoj,
        ack_no: this.saleOrderForm.get('ack_no')?.value,
        irn_no: this.saleOrderForm.get('irn_no')?.value,
        mobile_no: this.saleOrderForm.get('mobile')?.value,
        order_date: this.saleOrderForm.get('order_date')?.value,
        order_type: "Credit",
        discount_percent: Number(this.saleOrderForm.get('orver_all_discount')?.value),
        // payment_type: this.saleOrderForm.get('payment_mode')?.value,
        vechile_no: this.saleOrderForm.get('vehicle_no')?.value,
        khatabooks_id: this.saleOrderForm.get('khatabook_id')?.value,
        auto_approved: Number(this.saleOrderForm.get('auto_approve')?.value),
        items: this.item_data,
        bill_calculations: this.billTotal,
      }
      let ledger_amount = 0.0
      this.saleOrderForm.get('credit_fromInputs')?.value.forEach((el:any) => {
        ledger_amount += Number(el?.value)
      });
      // console.log("ledger " ,  this.saleOrderForm.get('credit_fromInputs')?.value.length)
      this.submitError = []

      let token = this.helper.get_local('token')
      let final_ledger_amount = this.is_round_off ? Number(Math.round(ledger_amount)) : Number(ledger_amount.toFixed(2))
      if( data?.bill_calculations?.grand_total === ledger_amount ||  this.saleOrderForm.get('credit_fromInputs')?.value.length < 1){

        this.is_sppiner = true
      this.dashapi.save_edit_sale_order(this.helper.get_local('token'), this.slug, data )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
            this.is_sppiner = false
            this.spinner.hide()
            Swal.fire({
              position: "top-end",
              icon: "success",
              text: `${res.body.message}`,
              showConfirmButton: false,
              timer: 1500
            });
            this.helper.navigateAndActive(this.layout.menus(),'Orders','accounting/orders/1', this.router, this.layout)

        },
        error: (err: any) => {
          console.error('Error removing product:', err);
            this.is_sppiner = false
          this.spinner.hide()
            Swal.fire({
              position: "top-end",
              icon: "warning",
              text: `${err.error.error}`,
              showConfirmButton: true,
              timer: 5000
            });

        },
        complete: () => {
          // Handle any cleanup if necessary
          // console.log('Request complete');
          // this.spinner.hide();
        }
      });


      }



      else{
        // console.log("nahi", data?.bill_calculations?.grand_total, ledger_amount )
        this.submitError.push("Amount mismatched, Please check input amount")
          this.submitError = []
      }

  }

  private resetProducts(){
    this.products=[]
    this.mrp_list=[]
    this.no_of_unit_api = 0
    this.gst_api = 0
    this.purchase_unit_price_api = 0
  }
  addMax(max_unit:number){
    this.saleOrderForm.get('product.no_of_unit')?.setValidators([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.min(1),Validators.max(max_unit)])
    this.saleOrderForm.get('product.no_of_unit')?.updateValueAndValidity()
  }
  removeMax(){
    this.saleOrderForm.get('product.no_of_unit')?.clearValidators();
    this.saleOrderForm.get('product.no_of_unit')?.updateValueAndValidity();
  }

  addServiceValidation(){
    this.saleOrderForm.get('service.choose_service')?.setValidators([Validators.required])
    this.saleOrderForm.get('service.amount')?.setValidators([Validators.required,CustomValidation.only_digit()])

    this.saleOrderForm.get('service.choose_service')?.updateValueAndValidity()
    this.saleOrderForm.get('service.amount')?.updateValueAndValidity()
  }

  removeServiceValidation(){
    this.saleOrderForm.get('service.choose_service')?.clearValidators();
    this.saleOrderForm.get('service.amount')?.clearValidators();

    this.saleOrderForm.get('service.choose_service')?.updateValueAndValidity()
    this.saleOrderForm.get('service.amount')?.updateValueAndValidity()
  }
  addValidation() {

    // add
    this.saleOrderForm.get('product.category_id')?.setValidators([Validators.required])
    this.saleOrderForm.get('product.mrp')?.setValidators([Validators.required])

    this.saleOrderForm.get('product.unit_price')?.setValidators([Validators.required,CustomValidation.only_digit()])

    this.saleOrderForm.get('product.discount')?.setValidators([
      (control: AbstractControl) => Validators.max(this.saleOrderForm.get('product.unit_price')?.value)(control)
      ,Validators.pattern(this.helper.numRegex)]),
    //   this.newOrderForm.get('product_f.mrp')?.setValidators([Validators.required,Validators.pattern(this.helper.numRegex)])

    // update
    this.saleOrderForm.get('product.category_id')?.updateValueAndValidity()

    this.saleOrderForm.get('product.mrp')?.updateValueAndValidity()

    this.saleOrderForm.get('product.unit_price')?.updateValueAndValidity()

    this.saleOrderForm.get('product.discount')?.updateValueAndValidity()
    this.saleOrderForm.get('product.mrp')?.updateValueAndValidity()

  }
  removeValidation() {
    // clear
    this.saleOrderForm.get('product.category_id')?.clearValidators();
    this.saleOrderForm.get('product.product_name')?.clearValidators();
    this.saleOrderForm.get('product.mrp')?.clearValidators();
    this.saleOrderForm.get('product.no_of_unit')?.clearValidators();
    this.saleOrderForm.get('product.unit_price')?.clearValidators();

    this.saleOrderForm.get('product.discount')?.clearValidators();
    this.saleOrderForm.get('product.mrp')?.clearValidators();

    // update

    this.saleOrderForm.get('product.category_id')?.updateValueAndValidity();
    this.saleOrderForm.get('product.product_name')?.updateValueAndValidity();
    this.saleOrderForm.get('product.mrp')?.updateValueAndValidity();
    this.saleOrderForm.get('product.no_of_unit')?.updateValueAndValidity();
    this.saleOrderForm.get('product.unit_price')?.updateValueAndValidity();

    this.saleOrderForm.get('product.discount')?.updateValueAndValidity();
    this.saleOrderForm.get('product.mrp')?.updateValueAndValidity();


  }
  khataChangeAction(data:any){
    let mobile = data.value.split(',')[2]
    // console.log(data.value.split(',')[2])
    this.saleOrderForm.get('mobile')?.setValue(mobile)
  }
  ngOnDestroy(): void {
    this.sub_get_venders?.unsubscribe()
    this.sub_get_sale_categories?.unsubscribe()
    this.sub_get_sale_products?.unsubscribe()
    this.sub_get_sale_product_unit_price?.unsubscribe()
    this.sub_get_sale_product_available_units?.unsubscribe()
    this.sub_add_product_items_temp?.unsubscribe()
    this.sub_remove_temp_user_order_items?.unsubscribe()

    this.sub_save_sale_order?.unsubscribe()
    this.sub_get_sale_services?.unsubscribe()
    this.destroy$.next();
    this.destroy$.complete();
  }
  credit_from_change(){
    this.filteredKhata  = this.saleOrderForm.get('lenders')?.valueChanges.pipe(
      startWith(''),
      map(value => {
        return this._filter3(value || '')
      })
    )
  }
  // autocomplete
  addValidation_check_lenders(){
    this.saleOrderForm.get('lenders')?.setValidators(Validators.compose([CustomValidation.valueSelected(this.khata)]))
   }
  productNameValidations(){
    this.saleOrderForm.get('product.product_name')?.setValidators([Validators.required, CustomValidation.valueSelected(this.products )])
    this.saleOrderForm.get('product.product_name')?.updateValueAndValidity()
  }
  private _filter2(value: any): any{
      const filterValue = typeof value === 'object' ?  value.name.toLowerCase() : value.toLowerCase();
            return this.products.filter((option:any) => ((option.name + option.part_no).toLocaleLowerCase()).includes(filterValue) ||
     JSON.stringify( option.id).toLocaleLowerCase().includes(filterValue));
   }

  onOptionSelect(e:any){
    this.mrp_list = []
    this.saleOrderForm.get('product.product_name')?.setValue(e.name)
    this.saleOrderForm.get('product.product_description')?.setValue(e)
    let token = this.helper.get_local('token')
    this.sub_get_sale_product_unit_price = this.dashapi.get_sale_product_unit_price(token, Number(e?.id)).subscribe((res:any) =>{
          this.mrp_list = res.data
          this.unit_price_with_discount = this.mrp_list[0]?.unit_price_with_discount
          }, (err) =>{
        })
  }
  private _filter3(value: any): any{
    const filterValue = typeof value === 'object' ?  value.name.toLowerCase() : value.toLowerCase();
             return this.khata?.filter((option:any) => (option?.name.toLocaleLowerCase() + option?.ledger_name.toLocaleLowerCase()).includes(filterValue) ||
      JSON.stringify( option.id).toLocaleLowerCase().includes(filterValue));

   }
   private _filter4(value: any): any{
    const filterValue = typeof value === 'object' ?  value.name.toLowerCase() : value.toLowerCase();
          return this.fixedAssetsApi?.filter((option:any) => ((option.name).toLocaleLowerCase()).includes(filterValue) ||
      JSON.stringify( option.id).toLocaleLowerCase().includes(filterValue));
    }
  onOptionSelectLander(e:any){
    // console.log(e)
    this.saleOrderForm.get('lenders')?.setValue(e.name)
    this.saleOrderForm.get('lenders_ac')?.setValue(e.ledger_name)
    this.saleOrderForm.get('mobile')?.setValue(e.mobile)
    this.saleOrderForm.get('khatabook_id')?.setValue(e.id)

  }

  inputChange(){
    this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)
    this.apply_discount()
   }

  new_khata(url:string){
    this.helper.navigateAndActive(this.layout.menus(),'Khatabook', url, this.router, this.layout)
  }

    // helper menthod
    apiOldProducts(token:string, slug:any){

      this.dashapi.edit_order_with_detail(token, slug).subscribe((res) =>{
         this.services_items = this.oHelper.jsonServiceBinding(res.body.services)
         this.item_data = this.oHelper.jsonProductBinding(res.body.product)
         this.fixedAssets = this.oHelper.jsonFixedBinding(res.body.assets)
          // fetchecing old form inputs
        let order = res.body.data
        this.saleOrderForm.get('irn_no')?.setValue(order.irn_no)
        this.saleOrderForm.get('vehicle_no')?.setValue(order.vechile_no)
        this.saleOrderForm.get('ack_no')?.setValue(order.ack_no)
        if(Number(order.discount_percent) > 0){
          this.saleOrderForm.get('is_discount')?.setValue(true)
          this.is_discount = true
          this.saleOrderForm.get('orver_all_discount')?.setValue(Number(order.discount_percent))
          this.discount_val = Number(order.discount_percent)
        }
        if(Number(order.round_off_amount) !== 0){
          this.saleOrderForm.get('round_off')?.setValue(true)
          this.saleOrderForm.get('round_off_amt')?.setValue(order.round_off_amount)
          this.is_round_off = true
        }
        this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)
        this.before_order_info = res.body.khata
        this.apply_discount()
      })
    }


}
