import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from '../../../../services/helper.service';
import { DashApiService } from '../../../../services/dash-api.service';
import {  Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../../../interfaces/autocomplete-validation';
import Swal from 'sweetalert2';
import { LayoutComponent } from '../../../layout/layout.component';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent  implements OnInit, OnDestroy{
  order:any
  sub_order_detail:Subscription | undefined
  discount:number =0
  discount_amt:number =0
  currentPage:number = 0
  returnProductForm!: FormGroup;
  returnProductData:any[] =[];
  liquid:any[] = []
  matchTotal:any[]=[]
  mobile:string =""
  khatabooks_id:number =0
  parent_order_id:number= 0

  ApiProducts:any = [];

  sold_poducts:number = 0


  constructor(
    private a_route: ActivatedRoute,
    private helper: HelperService,
    private dashapi: DashApiService,
    private fb: FormBuilder,
    private router: Router,
    private layout: LayoutComponent
  ){}


  ngOnInit(){
    // liquid

    this.dashapi.get_liquid(this.helper.get_local('token')).subscribe((res:any) =>{
      this.liquid = res.data

    })
    // liquid

    this.a_route.paramMap.subscribe((res:any )=>{
      let token = this.helper.get_local('token')
      let slug = res.params.slug
      this.currentPage = res.params.page

     this.sub_order_detail = this.dashapi.order_detail(token, slug).subscribe((res:any) =>{

        this.order = res.data
        this.mobile = res.data.vendor.mobile
        this.khatabooks_id = res.data.vendor.id
        // if(this.order.length > 0){
        //   this.parent_order_id = res.data.products[0].order_id
        // }
        console.log(res)
          this.parent_order_id = res.data.order.id
        this.ApiProducts = res.data.products

          this.returnProductForm = this.fb.group({
            products: this.fb.array([]),
            credit_from: this.fb.control('', [Validators.required]),
            credit_fromInputs: this.fb.array([]),
            order_type: this.fb.control({value:'', disabled: true }),
            Khatabook_id: this.fb.control({value:'', disabled: true }),
            // round off charges
              round_off: [false],
              round_off_amt: this.fb.control({value:'', disabled: true }),
            // round off charges
            });
            this.setProducts();

          })


      console.log(res.params.slug)
    })
    const headers = {
      "Content-Type":"application/json"
    }


  }
  // dynamic inputs
  get credit_fromInputs(): FormArray {
    return this.returnProductForm.get('credit_fromInputs') as FormArray;
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

  // dynamic inputs


  get productsArray(): FormArray {
    return this.returnProductForm.get('products') as FormArray;
  }



  setProducts(): void {
    const control = this.returnProductForm.get('products') as FormArray;
    this.ApiProducts.forEach((product:any) => {
      control.push(this.fb.group({
        selected: [false],
        return_quantity: [{ value: '', disabled: true }, [Validators.required, Validators.min(1), Validators.max((this.sold_poducts))]],
        remarks: [{ value: '', disabled: true }, Validators.required],
        item: [product]
      }));
    });
  }

  onCheckboxChange(index: number, product:any): void {
    const control = this.productsArray.controls[index] as FormGroup;

    if (control.get('selected')?.value) {
        let data:any = {
          product_id:  Number(product?.product_id),
          unit_price: Number(product?.unit_price),
          no_of_unit: Number(product?.no_of_unit),
          id: product?.id,
          product_type: product?.product_type
        }

      this.dashapi.get_sold_product(this.helper.get_local('token'), JSON.stringify(data)).subscribe((res:any) =>{
        console.log("apoi", res)
        control.get('return_quantity')?.setValidators([Validators.max(res.data)]);
        control.get('return_quantity')?.enable();
        control.get('remarks')?.enable();
        this.sold_poducts = res.data?  Number(res.data) : 0

      })

    } else {
      this.retrunQtyChange()
      control.get('return_quantity')?.disable();
      control.get('remarks')?.disable();
      control.get('return_quantity')?.reset();
      control.get('remarks')?.reset();
    }
  }
  retrunQtyChange(){
    this.returnProductData = []
    let returnData:any [] =[]
    let  round_off_amount:number = 0
    const return_pro = this.returnProductForm.get('products')?.value
    this.discount =  Number(this.order.order.discount_percent)
    return_pro.forEach((el:any) => {

        let old_returned_qty = el.item.returned_qty  ? el.item.returned_qty  + el.return_quantity : el.return_quantity
        let cal_discount = (Number(el.return_quantity) * Number(el.item.unit_price) )* Number(this.discount/100)
        let discouned_total = (Number(el.return_quantity) * Number(el.item.unit_price) - cal_discount)
        let gst = discouned_total * Number(Number(el.item.product_description.gst).toFixed(2)) /100
      if(el.selected === true && this.returnProductForm.get('products')?.valid){
            let row_total = Number(gst) + Number(Number(el.return_quantity) * Number(Number(el.item.net_unit_price).toFixed(2)) )
          let re_obj = {
            update_info:  { returned_qty: old_returned_qty, item:el.item.id, old_order_id: el.item.order_id },
            product_description: el.item.product_description,
            gst: gst,
            unit_price: Number(Number(el.item.unit_price).toFixed(2)),
            no_of_unit: el.return_quantity,
            return_remarks: el.remarks,
            product_id: el.item.product_id,
            mrp:  Number(Number(el.item.mrp).toFixed(2)),
            product_type: el.item.product_type === "debit" ? "credit" : "debit",
            discount: Number(Number(cal_discount.toFixed(2))),
            net_unit_price: Number(Number(el.item.net_unit_price).toFixed(2)),

            total: Number(row_total.toFixed(2))

          }

        returnData.push(re_obj)
      }
    });
    console.log("dsfdsf", returnData)

    // console.log("qty",returnData)
    let gst = 0.0, total = 0.0, discount = 0.0
    for (let index = 0; index < returnData.length; index++) {
      gst  += returnData[index].gst;
      total += returnData[index].total;
      discount += returnData[index].discount;
    }
     // round off
    if (total % 1 !== 0 && this.returnProductForm.get('round_off')?.value == true){
      let new_total =  Math.round(total)
      this.returnProductForm.get('round_off_amt')?.setValue((new_total - total).toFixed(2) )
    }
    if (total % 1 !== 0 && this.returnProductForm.get('round_off')?.value == true){
      let new_total =  Math.round(total)
      this.returnProductForm.get('round_off_amt')?.setValue((new_total - total).toFixed(2) )
    }
    let temp_round_off_amt =  Number(this.returnProductForm.get('round_off_amt')?.value)
    if(temp_round_off_amt !== 0 && temp_round_off_amt > 0){
      round_off_amount = temp_round_off_amt
      total = (total + Number(round_off_amount));
    }else if(temp_round_off_amt !== 0 && temp_round_off_amt < 0){
      round_off_amount = temp_round_off_amt
      total = (total + Number(round_off_amount));
    }
   const data = {
      items: returnData,
              grand_totals: {
                gst,
                total,
                discount,
              round_off_amount
              }
   }
    // for(let i =0; i >returnData)
      this.returnProductData.push(data)
  }

  creditFromOnChange(el:any, order_type?:string){

      this.updateCredit_fromInputs(el)
      console.log("order_type", order_type)
      if(order_type?.toLowerCase() ==="credit"){
        this.returnProductForm.get('order_type')?.setValue("debit")
      }else{
        this.returnProductForm.get('order_type')?.setValue("credit")
      }

  }

  roundOffChange(e:any){
    // console.log(e)
    if(e ){
      let total = Number(this.returnProductData[0].grand_totals.total)
      let new_total =  Math.round(total)
      this.returnProductForm.get('round_off_amt')?.setValue((new_total - total).toFixed(2) )
      this.retrunQtyChange()
    }else{
      this.returnProductForm.get('round_off_amt')?.setValue(0)
      this.retrunQtyChange()
    }
  }



  onSubmit(): void {

     let  databoj:any[]= []
      let bill_total = 0.0
      // create and mange order type
      let order_type = this.returnProductForm.get('order_type')?.value
      if ( order_type === 'credit'){
          this.returnProductForm.get('credit_fromInputs')?.value.forEach((el:any) =>{
            bill_total += Number(el.value)
            if(el.name === "creditor"){
              el.is_creditor = true
            }else{
              el.is_creditor = false
            }
            databoj.push(el)
          })
      }else{
        this.returnProductForm.get('credit_fromInputs')?.value.forEach((el:any) =>{
          bill_total += Number(el.value)
          if(el.name === "debitor"){
            el.is_debtor = true
          }else{
            el.is_debtor = false
          }
          databoj.push(el)
        })
        }
      // create and mange order type

      let total = this.returnProductData[0]?.grand_totals?.total.toFixed(2)
      this.matchTotal = []
     if(bill_total.toFixed(2) != total){
        this.matchTotal.push(`Amount not matched with return total Rs. ${total}`)
    }else{

      let data = {
        paid_from: databoj,

        mobile_no: this.mobile,
        order_date: Date(),
        order_type: order_type,
        // payment_type: this.newOrderForm.get('payment_mode')?.value,
        // vechile_no: this.newOrderForm.get('vehical_no')?.value,
        khatabooks_id: this.khatabooks_id,
        // auto_approved: Number(this.newOrderForm.get('auto_approve')?.value),
        items: this.returnProductData[0].items,
        gst:this.returnProductData[0].grand_totals.gst,
        grand_total:this.returnProductData[0].grand_totals.total,
        parent_order_id: this.parent_order_id,
        is_returned:true,
        discount_percent: this.discount,
        discount: this.returnProductData[0]?.grand_totals.discount,
        round_off_amount: this.returnProductData[0]?.grand_totals.round_off_amount
      }
      this.dashapi.create_return_order(this.helper.get_local('token'), {data}).subscribe(res =>{
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500
        });
        this.helper.navigateAndActive(this.layout.menus(),'Orders', 'accounting/orders/1', this.router, this.layout)
      }, (err:any) =>{
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.error.error ,
          footer: 'Why do I have this issue '
        });
      })


    }
      // console.log("sdfsdf sdfs d ", total)





    // console.log("return", this.returnProductForm.value);
  }





  download_bill(){
    window.print()
  //  let data:any =  document.getElementById("data")

  //  const blob = new Blob([data],{type: 'application/pdf'})
  //  const url = window.URL.createObjectURL(blob)
  //  console.log(blob)

  //  let doc = new jsPDF()
  //  let content:any =document.getElementById("data")
  //  await doc.html(

  //   content);


  //  doc.save('test.pdf');

  }
  ngOnDestroy(): void {
    this.sub_order_detail?.unsubscribe()
  }
}
