import { OrderHelperService } from '../../../services/order-helper.service';

import { Router } from '@angular/router';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { LayoutComponent } from '../../layout/layout.component';
import { map, max, Observable, startWith, Subscription } from 'rxjs';
import { CustomValidation } from './../../../interfaces/autocomplete-validation';
import { Product } from '../../../interfaces/product';
import { Khata } from '../../../interfaces/khata';
import { trigger, style, animate, transition } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
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



export class OrderComponent implements OnInit, OnDestroy {
  sub_get_product_categories:Subscription | undefined
  sub_get_products:Subscription | undefined
  sub_new_order:Subscription | undefined
  sub_get_venders:Subscription | undefined
  sub_get_sale_services:Subscription | undefined

  // animation
  show:boolean = false;
  discount_val:number = 0

  // animation

  product_categories:any
  api_errors:any[] =[]
  input_leder_vender:string = ""
  stockForm:boolean =false
  add_product_btn:boolean =false

  item_data:any[] = []
  liquid:any[] = []
  billTotal: any
  venders_api:any
  category_id:number = 0
  newOrderForm!:FormGroup
  matcher:any


   // autocomplete
   categories: Product[] = [];
   khata: Khata[] = [];
   filteredCat:  Observable<Product[]> | undefined ;
   filteredKhata:  Observable<Khata[]> | undefined ;
 // autocomplete
  khatabook_state_id:number = 0

  // other chages
  add_service:boolean = false
  services_data:any[] = []
  services_items:any[] = []
  is_spinner: boolean = false

    // fixed Assets
    show_fixed:boolean = false
    fixedAssets:any = []

  constructor(
      private helper: HelperService,
      private dashapi: DashApiService,
      private fb: FormBuilder,
      private dialog: MatDialog,
      private router: Router,
      private layout: LayoutComponent,
      private spinner: NgxSpinnerService,
      private oService: OrderHelperService

    ){

    }


  ngOnInit(){
    // apin hit to getting products
    let token = this.helper.get_local('token')
    let company_id = this.helper.company_id()
    this.dashapi.get_liquid(token).subscribe((res:any) =>{
      this.liquid = res.data
    })

   this.sub_get_product_categories = this.dashapi.purchase_product_categories(token).subscribe( (res:any)=>{
      this.product_categories = res.data
    }, (err)=>{

      if(err.error ==="Signature has expired"){
        localStorage.clear()
        this.router.navigate(['/login'])
      }
    })

    this.newOrderForm =   this.order()
    this.matcher = new ErrorStateMatcher();

    // this.sub_get_venders = this.dashapi.get_venders(token, company_id).subscribe((res) =>{
    //   this.venders_api = res.data
    // })

    // change ductction

    // change ductction
    this.newOrderForm.get('credit_from')?.valueChanges.subscribe((res:any) =>{
      this.newOrderForm.get('lenders')?.reset()
      // console.log("gggg")
      if(res.length > 1){
        this.updateCredit_fromInputs(res)
      }else{
        this.updateCredit_fromInputs([])
      }

      // setting creditor and vendors api
      if (res.includes("creditor")){
        this.dashapi.get_all_khatabooks_drop(token,"creditor").subscribe(res =>{

          this.khata = res.data
          this.input_leder_vender = "creditor"
          this.addValidation_check_lenders()
        })
      }else{
        this.dashapi.get_all_khatabooks_drop(token).subscribe(res =>{
          this.khata = res.data
          this.input_leder_vender = "Khata"
          this.addValidation_check_lenders()
        })
      }
      // setting creditor and vendors api
    })

    // product_api

    // testing
    this.filteredCat  = this.getProductNameControl()?.valueChanges.pipe(
      startWith(''),
      map(value => {
        return this._filter2(value || '')
      })
    )



    // enable and disable validation
    this.stockForm ? this.addValidation() : this.removeValidation();


  }
    // service
    AddService(){
      this.addServiceValidation()
      this.add_service = true
      this.sub_get_sale_services = this.dashapi.get_sale_services_active(this.helper.get_local('token')).subscribe((res:any) =>{
        this.services_data = res.data
      })
    }
    show_fixed_method(){
      this.show_fixed = true
      this.addAssetValidation()
    }

    cancelService(e:any){
      this.removeServiceValidation()
      this.add_service = false
      this.newOrderForm.get('service')?.reset()
    }
    cancelFixed(e:any){
      this.removeAssetValidation()
      this.show_fixed = false
      this.newOrderForm.get('fixedAsset')?.reset()
    }

    SaveService(e:any){
      e.preventDefault()
      let serv = this.newOrderForm.get('service')?.value
      this.services_items.push(serv)
      this.services_items = this.oService.jsonServiceBinding(this.services_items)
      this.newOrderForm.get('service')?.reset()
      this.add_service = false
      this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)
      this.removeServiceValidation()
    }
    saveFiexed(){

      const formData = this.newOrderForm.get('fixedAsset')?.value
      this.fixedAssets.push(formData)
      this.fixedAssets = this.oService.jsonFixedBinding(this.fixedAssets)
      this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)
      this.show_fixed = false
      this.removeAssetValidation()
      this.newOrderForm.get('fixedAsset')?.reset()
    }
    ChangeChooseServie(e:any){
      this.newOrderForm.get('service.gst')?.setValue(e.gst)
      this.newOrderForm.get('service.sale_service_id')?.setValue(e.id)
    }
    removeService(index:number){
      this.services_items.splice(index, 1)
      this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)

    }
    removeAssets(index:number){
      this.fixedAssets.splice(index, 1)
      this.getGrandTotal(this.item_data,this.services_items, this.fixedAssets)

    }
    addServiceValidation(){
      this.newOrderForm.get('service.choose_service')?.setValidators([Validators.required])
      this.newOrderForm.get('service.amount')?.setValidators([Validators.required,CustomValidation.only_digit()])
      this.newOrderForm.get('service.choose_service')?.updateValueAndValidity()
      this.newOrderForm.get('service.amount')?.updateValueAndValidity()
    }
    removeServiceValidation(){
      this.newOrderForm.get('service.choose_service')?.clearValidators();
      this.newOrderForm.get('service.amount')?.clearValidators();
      this.newOrderForm.get('service.choose_service')?.updateValueAndValidity()
      this.newOrderForm.get('service.amount')?.updateValueAndValidity()
    }
    // service


  getProductNameControl() {
    return this.newOrderForm.get('product_f.product_name');
  }
  get_productsdata(e:any){

    let token = this.helper.get_local('token')
    let company_id = this.helper.company_id();
    this.sub_get_products = this.dashapi.get_products(token, company_id, e).subscribe((res)=>{

      this.categories = res.data
      this.addValidation_check_category()
      this.getProductNameControl()?.reset()
    })
  }
  credit_from_change(){
    this.filteredKhata  = this.newOrderForm.get('lenders')?.valueChanges.pipe(
      startWith(''),
      map(value => {
        return this._filter3(value || '')
      })
    )
  }
   order(){
    return  this.fb.group({
      // order_type: this.fb.control('', [Validators.required]),
      credit_from: this.fb.control('', [Validators.required]),
      credit_fromInputs: this.fb.array([]),
      lenders: this.fb.control('', [Validators.required]),
      lenders_ac: this.fb.control(null),
      khatabook_id: this.fb.control(null),
      // vender_ledger: this.fb.control('', [Validators.required]),
      order_date: this.fb.control('', [Validators.required]),
      vehical_no: this.fb.control(null),
      mobile_no: this.fb.control(null),
      irn_no: this.fb.control(null),
      ack_no: this.fb.control(null),
      auto_approve: this.fb.control(null),
      apply_validation: this.fb.control(null),
          // service
          service: this.fb.group({
            choose_service: this.fb.control(null),
            amount: this.fb.control(null),
            gst: this.fb.control(null),
            sale_service_id: this.fb.control(null),
          }),
          // service
          fixedAsset: this.fb.group({
            name: this.fb.control(null),
            hsn: this.fb.control(null),
            no_of_unit: this.fb.control(null),
            unit_amount: this.fb.control(null),
            gst: this.fb.control(null)
          }),

      is_discount: [false],
      orver_all_discount:[''],
      // round off charges
      round_off: [false],
      round_off_amt: this.fb.control({value:'', disabled: true }),
      // round off charges


      product_f: this.fb.group({
        category_id: this.fb.control(null),
        // product_name:this.fb.control(null),
        product_name:[],
        product_description: this.fb.control(null),
        expired_date: this.fb.control(null),
        no_of_unit:this.fb.control(null),
        unit_price:this.fb.control(null),
        mrp:this.fb.control(null),
        gst :this.fb.control({value:'', disabled: true }),
        discount : this.fb.control(null)
      })
    })
  }

  roundOffChange(e:any){
    // console.log(e)
    if(e ){
      // let total = Number(this.getGrandTotal(this.item_data, this.services_items).grand_total)
      let grand = this.getGrandTotal(this.item_data, this.services_items, this.fixedAssets)
      let total = Number(Number(grand.grand_total).toFixed(2))
      // console.log(total)
      let new_total =  Math.round(total)
      this.newOrderForm.get('round_off_amt')?.setValue((new_total - total).toFixed(2) )
      this.inputChange()

      // console.log(this.getGrandTotal(this.item_data, this.services_items))
    }else{
      this.newOrderForm.get('round_off_amt')?.setValue(0)
      this.inputChange()
    }
  }




  onMobileChange(e:any){
    if(e.length > 0){
      this.newOrderForm.get('mobile_no')?.setValidators([ Validators.maxLength(10),Validators.minLength(10), CustomValidation.only_digit()])
      this.newOrderForm.updateValueAndValidity();
    }else{
      this.removeDiscountV('mobile_no')
    }
    // console.log("hhhh")
  }
  apply_discount(){
    this.discount_val = Number(this.newOrderForm.get('orver_all_discount')?.value)
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
    this.item_data = neew_list_data
    this.getGrandTotal(this.item_data, this.services_items, this.fixedAssets )
    if (this.discount_val > 0){
      Swal.fire({
        position: "center",
        icon: "success",
        text: "Discount applied successfully",
        showConfirmButton: false,
        timer: 1500
      });

    }

  }

  discount_change(e:any){
    if(e == true){
      this.discount_val = Number(this.newOrderForm.get('orver_all_discount')?.value)
      this.addDiscountV()

    }else{
      this.removeDiscountV('orver_all_discount')
      this.newOrderForm.get('orver_all_discount')?.reset()
      this.discount_val = 0
      this.apply_discount()
    }
    this.apply_discount()
    this.discount_val = 0

  }
  addDiscountV(): void {
    this.newOrderForm.get('orver_all_discount')?.setValidators([Validators.required,Validators.max(80), CustomValidation.only_digit()])
    this.newOrderForm.updateValueAndValidity();
  }
  removeDiscountV(key:string): void {
    const orver_all_discount = this.newOrderForm.get(key);
    orver_all_discount?.clearValidators();
    this.newOrderForm.clearValidators(); // Clear the group validators
    orver_all_discount?.updateValueAndValidity();
    this.newOrderForm.updateValueAndValidity(); // Revalidate the form group
  }



     // auto_complete
  addValidation_check_lenders(){
  this.newOrderForm.get('lenders')?.setValidators(Validators.compose([CustomValidation.valueSelected(this.khata)]))
  }
  addValidation_check_category() {
  // add
  this.newOrderForm.get('product_f.product_name')?.setValidators(Validators.compose([Validators.required, CustomValidation.valueSelected(this.categories)]))
  // update
  this.newOrderForm.get('product_f.product_name')?.updateValueAndValidity()
  }

    private _filter2(value: any): any{
     const filterValue = typeof value === 'object' ?  value.name.toLowerCase() : value.toLowerCase();

             return this.categories.filter((option:any) => ((option.name + option.part_no).toLocaleLowerCase()).includes(filterValue) ||
      JSON.stringify( option.id).toLocaleLowerCase().includes(filterValue));
    }
    private _filter3(value: any): any{
     const filterValue = typeof value === 'object' ?  value.name.toLowerCase() : value.toLowerCase();
             return this.khata.filter((option:any) => (option.name.toLocaleLowerCase() + option.ledger_name.toLocaleLowerCase()).includes(filterValue) ||
      JSON.stringify( option.id).toLocaleLowerCase().includes(filterValue));
    }
  onOptionSelectLander(e:any){
      this.newOrderForm.get('lenders')?.setValue(e.name)
      this.newOrderForm.get('lenders_ac')?.setValue(e.ledger_name)
      this.newOrderForm.get('mobile_no')?.setValue(e.mobile)
      this.newOrderForm.get('khatabook_id')?.setValue(e.id)
      // gst calculations
      // console.log("dfdfdf")
    //  this.getGrandTotal(this.item_data,this.services_items)
  }


  onOptionSelect(e:any){
       this.newOrderForm.get('product_f.product_name')?.setValue(e.name)
       this.newOrderForm.get('product_f.product_description')?.setValue(e)
      let gst = e.gst
      this.newOrderForm.get('product_f.gst')?.setValue(gst)
  }
  findProductById(id: number): Product | undefined {
    return this.categories.find(product => product.id === id);
  }
     // auto_complete

  inputChange(){
    this.billTotal = this.getGrandTotal(this.item_data, this.services_items, this.fixedAssets)
    // this.RoundOffInputChange()
  }

  get credit_fromInputs(): FormArray {
    return this.newOrderForm.get('credit_fromInputs') as FormArray;
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
  addtoStock(){
   this.item_data.push(this.oService.purchase_item_list_render(this.discount_val, this.newOrderForm))
   this.getGrandTotal(this.item_data, this.services_items, this.fixedAssets)
    this.roundOffChange(this.newOrderForm.get("round_off")?.value)
    this.removeValidation()
    this.add_product_btn = false

    // (this.item_data)
  }


  getGrandTotal(list:any[], service:any[], fixed:any = []){
    let data = this.oService.getGrandTotal(list,service,this.newOrderForm, fixed)
    this.item_data = data.product
    this.services_items = data.service
    this.fixedAssets = data.fixed
    return this.billTotal = data
  }
  addValidation() {
    // add
    this.newOrderForm.get('product_f.category_id')?.setValidators([Validators.required])
    this.newOrderForm.get('product_f.no_of_unit')?.setValidators([Validators.required, CustomValidation.only_digit_without_decimal()])
    this.newOrderForm.get('product_f.unit_price')?.setValidators([Validators.required, CustomValidation.only_digit()])

    this.newOrderForm.get('product_f.discount')?.setValidators([
      (control: AbstractControl) => Validators.max(this.newOrderForm.get('product_f.unit_price')?.value)(control)
      ,Validators.pattern(this.helper.numRegex)]),
      this.newOrderForm.get('product_f.mrp')?.setValidators([Validators.required,Validators.pattern(this.helper.numRegex)])

    // update
    this.newOrderForm.get('product_f.category_id')?.updateValueAndValidity()
    this.newOrderForm.get('product_f.no_of_unit')?.updateValueAndValidity()
    this.newOrderForm.get('product_f.unit_price')?.updateValueAndValidity()

    this.newOrderForm.get('product_f.discount')?.updateValueAndValidity()
    this.newOrderForm.get('product_f.mrp')?.updateValueAndValidity()

  }
  removeValidation() {
    // clear
    this.newOrderForm.get('product_f.category_id')?.clearValidators();
    this.newOrderForm.get('product_f.product_name')?.clearValidators();
    this.newOrderForm.get('product_f.no_of_unit')?.clearValidators();
    this.newOrderForm.get('product_f.unit_price')?.clearValidators();

    this.newOrderForm.get('product_f.discount')?.clearValidators();
    this.newOrderForm.get('product_f.mrp')?.clearValidators();

    // update

    this.newOrderForm.get('product_f.category_id')?.updateValueAndValidity();
    this.newOrderForm.get('product_f.product_name')?.updateValueAndValidity();
    this.newOrderForm.get('product_f.no_of_unit')?.updateValueAndValidity();
    this.newOrderForm.get('product_f.unit_price')?.updateValueAndValidity();

    this.newOrderForm.get('product_f.discount')?.updateValueAndValidity();
    this.newOrderForm.get('product_f.mrp')?.updateValueAndValidity();


  }
  addAssetValidation(){

    this.newOrderForm.get('fixedAsset.name')?.setValidators([Validators.required, Validators.maxLength(50), CustomValidation.alphanumeric()])
    this.newOrderForm.get('fixedAsset.unit_amount')?.setValidators([Validators.required, Validators.max(5000000), CustomValidation.only_digit()])
    this.newOrderForm.get('fixedAsset.no_of_unit')?.setValidators([Validators.required, Validators.max(10000), CustomValidation.only_digit_without_decimal()])
    this.newOrderForm.get('fixedAsset.gst')?.setValidators([Validators.required, Validators.max(50), CustomValidation.only_digit_with_zero()])
    // update
    this.newOrderForm.get('fixedAsset.name')?.updateValueAndValidity()
    this.newOrderForm.get('fixedAsset.unit_amount')?.updateValueAndValidity()
    this.newOrderForm.get('fixedAsset.no_of_unit')?.updateValueAndValidity()
    this.newOrderForm.get('fixedAsset.gst')?.updateValueAndValidity()
  }
  removeAssetValidation(){
    this.newOrderForm.get('fixedAsset.name')?.clearValidators();
    this.newOrderForm.get('fixedAsset.unit_amount')?.clearValidators();
    this.newOrderForm.get('fixedAsset.no_of_unit')?.clearValidators();
    this.newOrderForm.get('fixedAsset.gst')?.clearValidators();

    this.newOrderForm.get('fixedAsset.name')?.updateValueAndValidity()
    this.newOrderForm.get('fixedAsset.unit_amount')?.updateValueAndValidity()
    this.newOrderForm.get('fixedAsset.no_of_unit')?.updateValueAndValidity()
    this.newOrderForm.get('fixedAsset.gst')?.updateValueAndValidity()
  }



  openItemForm(){
    // this.newOrderForm.controls['product_f'].reset()
    this.newOrderForm.controls['product_f'].patchValue({
      product_name:'',
      product_description: '',
      expired_date: '',
      no_of_unit: '',
      unit_price: '',
      mrp: '',
      gst:'',
      discount:''
    })
    this.addValidation()
    this.add_product_btn = true
  }
  price_change(e:any){
    let gst = this.newOrderForm.get('product_f.product_description')?.value.gst
    let purchase_gst = Number(e.value)*Number(gst)/100
    let mrp_per = (purchase_gst + Number(e.value))*30/100
    let mrp = (Number(e.value) + purchase_gst + mrp_per).toFixed()
    this.newOrderForm.get('product_f.mrp')?.setValue(mrp)
  }
  cancelProductAdd(){
    this.newOrderForm.controls['product_f'].reset()
    this.removeValidation()
    this.add_product_btn = false
  }
  removeProduct(index:number){
    this.item_data.splice(index, 1)
    this.getGrandTotal(this.item_data, this.services_items, this.fixedAssets)
  }
  submit(){
    // this.ApiSubmit()
    if(this.newOrderForm?.valid){
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
    }
  }

  ApiSubmit( ){
      // "sunil bhard".split(" ").join("_")

        let databoj:any[] = [];
        let token = this.helper.get_local('token');
        let credit_from_array = this.newOrderForm.get('credit_from')?.value
        let paid_obj = this.newOrderForm.get('credit_fromInputs')?.value
        let khata = this.newOrderForm.get('lenders_ac')?.value
        if( credit_from_array.length <= 1 && credit_from_array.includes('creditor')){
         let data = {
          name: `${khata}`,
          value: Number(this.billTotal ? this.billTotal?.grand_total.toFixed(2) : 0),
          is_creditor: true
         }
         databoj.push(data)
        }
        else if ( credit_from_array.length <= 1 && !credit_from_array.includes('creditor')){
          let data = {
            name: credit_from_array[0],
            value: Number(this.billTotal ? this.billTotal?.grand_total.toFixed(2) : 0),
            is_creditor: false
           }
           databoj.push(data)
        }

        else if (credit_from_array.length > 1 && !credit_from_array.includes('creditor')){

          for (let index = 0; index < paid_obj.length; index++) {
            paid_obj[index].is_creditor = false
            databoj = paid_obj
          }
        }
        else if (credit_from_array.length > 1 && credit_from_array.includes('creditor')){
          for (let index = 0; index < paid_obj.length; index++) {
            if(paid_obj[index].name === 'creditor' || paid_obj[index].is_creditor){

              paid_obj[index].name = `${khata}`
              paid_obj[index].is_creditor = true
            }else{

              paid_obj[index].is_creditor = false
            }
          }

          databoj = paid_obj
        }

        let data = {
          services_items:this.services_items,
          paid_from: databoj,
          discount_percent: Number(this.newOrderForm.get('orver_all_discount')?.value),
          ack_no: this.newOrderForm.get('ack_no')?.value,
          irn_no: this.newOrderForm.get('irn_no')?.value,
          mobile_no: this.newOrderForm.get('mobile_no')?.value,
          order_date: this.newOrderForm.get('order_date')?.value,
          order_type: "Debit",
          // payment_type: this.newOrderForm.get('payment_mode')?.value,
          vechile_no: this.newOrderForm.get('vehical_no')?.value,
          // khatabooks_id: this.newOrderForm.get('lenders')?.value.split(",")[0],
          khatabooks_id: this.newOrderForm.get('khatabook_id')?.value,
          auto_approved: Number(this.newOrderForm.get('auto_approve')?.value),
           items: this.item_data,
           assets: this.fixedAssets,
          bill_calculations: this.billTotal,
        }
        this.is_spinner = true
        this.spinner.show()
        this.sub_new_order = this.dashapi.new_order( token,{data}).subscribe((res)=>{
                    this.is_spinner = false
                    this.spinner.hide()
                    Swal.fire({
                      position: "top-end",
                      icon: "success",
                      title: "Your work has been saved",
                      showConfirmButton: false,
                      timer: 1500
                    });
                    this.helper.navigateAndActive(this.layout.menus(),'Orders', 'accounting/orders/1', this.router, this.layout)

                }, (err) =>{
                    // console.log(err)
                  this.is_spinner = false
                  this.spinner.hide()
                  this.api_errors = []

                  this.api_errors = err.error?.err_message ? err.error?.err_message : []
                    this.api_errors = []
                  if(err){
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: err.error.error ,
                      footer: 'Why do I have this issue '
                    });
                  }

        })
  }
  new_khata(url:string){
    this.helper.navigateAndActive(this.layout.menus(),'Khatabook', url, this.router, this.layout)
  }
  ngOnDestroy(): void {
    this.sub_get_product_categories?.unsubscribe()
    this.sub_get_products?.unsubscribe()
    this.sub_new_order?.unsubscribe()
    this.sub_get_venders?.unsubscribe()
    this.sub_get_sale_services?.unsubscribe()
  }


}
