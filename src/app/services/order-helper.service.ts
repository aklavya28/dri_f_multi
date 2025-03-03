import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OrderHelperService {
  constructor() { }
  jsonServiceBinding(sarvice:any[]){
    let source_data:any[] =[]
    sarvice.forEach(item =>{
      var choose_service = item.choose_service? item.choose_service  : item.sale_service
      let gst = Number(item.amount) * Number(choose_service.gst) / 100
      let data =  {
        "choose_service": choose_service,
        "amount": Number(Number(item.amount).toFixed(2)),
        "sale_service_id" : choose_service.id,
        "gst": Number(Number(gst).toFixed(2)),
        "gst_percent": Number(Number(item.gst).toFixed(2)) > 0 ? Number(Number(choose_service.gst).toFixed(2)) : 0,
        "total": Number(Number(item.amount).toFixed(2)) + Number(Number(gst).toFixed(2)),
        "id": item.id,
      }
      source_data.push(data)
    })

  return source_data

  }
  jsonFixedBinding(fixed:any[]){
    let source_data:any[] =[]

    fixed.forEach(item =>{
      let name = item.name
      let hsn = item.hsn
      let gst = Number(Number(item.gst).toFixed(2))
      let gst_amount = Number(Number(item.no_of_unit)* Number(item.unit_amount)) * gst / 100
      let total = (Number(item.unit_amount)* Number(item.no_of_unit)) + gst_amount
      let taxable = (Number(item.unit_amount)* Number(item.no_of_unit))
      let data =  {
        "name": name,
        "hsn": hsn,
        "unit_amount": Number(Number(item.unit_amount).toFixed(2)),
        "gst_amount": gst_amount,
        "no_of_unit": Number(item.no_of_unit),
        "gst": gst,
        "taxable": taxable,
        "total": total,
        "order_date": item.order_date? item.order_date : Date.now(),
        "id": item.id ? item.id : null,
        "refrence_id": item.refrence_id ? item.refrence_id : null,
      }
      source_data.push(data)
    })

  return source_data

  }



  jsonProductBinding(product:any[]) : any{
    let source_data:any[] =[]
    product.forEach(item =>{
     let taxable = ((Number(item.unit_price) * Number(item.no_of_unit)) - Number(item.discount))
    let data =  {
        "product_name": item.product_description.name,
        "no_of_unit": Number(Number(item.no_of_unit)),
        "mrp" : Number(item.mrp),
        "discount": Number(item.discount),
        "unit_price": Number(item.unit_price),
        "gst_percent": item.gst > 0 ? Number(item?.product_description.gst) : 0,
        "gst": Number(item.gst),
        "slug": item.slug,
        "id": Number(item.id),
        "product_description":item.product_description,
        // "taxable": Number(item.total - (item.s_gst + item.c_gst + item.i_gst)),
        "taxable": taxable,
        "total":this.roundToTwo(Number(item.total)) ,
      }
      source_data.push(data)

    })

  return source_data

  }
  purchase_item_list_render(discount_percent:any, newOrderForm:FormGroup){
    let category_id = newOrderForm.get('product_f.category_id')?.value
    let product_description = newOrderForm.get('product_f.product_description')?.value
    let no_of_unit = newOrderForm.get('product_f.no_of_unit')?.value
    let unit_price = newOrderForm.get('product_f.unit_price')?.value
    let mrp =   newOrderForm.get('product_f.mrp')?.value
    let gst = newOrderForm.get('product_f.gst')?.value
    let expired_date = newOrderForm.get('product_f.expired_date')?.value
    let name = product_description
      // calculation
      let cal_discount = (Number(no_of_unit) * Number(unit_price) * Number(discount_percent)/100)
      let cal_gst =(((Number(no_of_unit) * Number(unit_price)) - cal_discount) * Number(gst)/100 )
      let amount = this.roundToTwo((Number(no_of_unit) * Number(unit_price) + cal_gst - cal_discount))
      // calculation
        let json_obj = {
          category_id: category_id,
          product_description: product_description,
          product_name: name.name,
          no_of_unit: no_of_unit,
          mrp:mrp,
          discount: cal_discount,
          unit_price: unit_price,
          expired_date:expired_date,
          gst_percent:  gst,
          gst:          cal_gst,
          total:        amount
        }
        return json_obj
  }
  sale_item_list_render(discount_percent:any, saleOrderForm:FormGroup){
      let category_id = saleOrderForm.get('product.category_id')?.value
      let product_description = saleOrderForm.get('product.product_description')?.value
      let no_of_unit = saleOrderForm.get('product.no_of_unit')?.value
      let unit_price = saleOrderForm.get('product.unit_price')?.value
      let mrp = saleOrderForm.get('product.mrp')?.value
      let gst = saleOrderForm.get('product.gst')?.value
      let purchase_unit_price = saleOrderForm.get('product.purchase_unit_price')?.value
      let name = product_description?.name
      // calculation
      let cal_discount = (Number(no_of_unit) * Number(unit_price) )* Number(discount_percent)/100
      let cal_gst = ((Number(no_of_unit) * Number(unit_price) - cal_discount) )* Number(gst)/100
      let amount = (Number(no_of_unit) * Number(unit_price) ) + (cal_gst) - cal_discount
      // calculation
        let json_obj = {
          category_id: category_id,
          name: name,
          product_description: product_description,
          no_of_unit:  parseFloat(Number(no_of_unit).toFixed(2)),
          mrp: parseFloat(Number(mrp.mrp).toFixed(2)),
          purchase_unit_price: parseFloat(Number(purchase_unit_price).toFixed(2)),
          discount: parseFloat(Number(cal_discount).toFixed(2)),
          unit_price: parseFloat(Number(unit_price).toFixed(2)),
          gst:          parseFloat(Number(cal_gst).toFixed(2)),
          gst_percent:  parseFloat(Number(gst).toFixed(2)),
          total:          parseFloat(Number(amount).toFixed(2))
        }
        return json_obj
  }
  getGrandTotal(list:any[], service:any[],form:FormGroup, fixed:any = []){

    list =  this.jsonProductBinding(list)
    service =  this.jsonServiceBinding(service)
    fixed =  this.jsonFixedBinding(fixed)

     // grand total area
     let  grand_gst:number = 0
     let  product_taxable:number = 0
     let  grand_discount:number = 0
     let  grand_total:number = 0
     let  round_off_amount:number = 0
     // grand total area
     list.forEach((item:any) =>{
     grand_gst += this.roundToTwo(Number(item.gst));
     grand_discount += this.roundToTwo(Number(item.discount));
     grand_total += this.roundToTwo(Number(item.total));
     product_taxable += this.roundToTwo(Number(item.taxable));
   })
     // service
     let  service_total:number = 0
     let  ser_gst:number = 0
     if(service.length){
         service.forEach((item:any) =>{
           ser_gst += this.roundToTwo(Number(Number(item.gst)));
           service_total += this.roundToTwo(Number(Number(item.amount)));
         })
     }
      // service
      let  fixed_total:number = 0
      let  fixed_gst:number = 0
      let  fixed_taxable:number = 0
      if(fixed.length){
        fixed.forEach((item:any) =>{
          fixed_gst += this.roundToTwo(Number(Number(item.gst_amount))) ;
          fixed_taxable += this.roundToTwo(Number(Number(item.taxable)));
          fixed_total += this.roundToTwo(Number(Number(item.total)));
          })
      }
   // round off
   grand_total = (grand_total + (service_total+ser_gst) + (fixed_total) )
   if (grand_total % 1 !== 0 && form.get('round_off')?.value == true){
     let new_total =  Math.round(grand_total)
     form.get('round_off_amt')?.setValue(this.roundToTwo(new_total - grand_total) )
   }else{
    form.get('round_off_amt')?.setValue(0)
   }
   let temp_round_off_amt =  Number(form.get('round_off_amt')?.value)
   if(temp_round_off_amt !== 0 && temp_round_off_amt > 0){
     round_off_amount = temp_round_off_amt
     grand_total = (grand_total + Number(round_off_amount));
   }else if(temp_round_off_amt !== 0 && temp_round_off_amt < 0){
     round_off_amount = temp_round_off_amt
     grand_total = (grand_total + Number(round_off_amount));
   }
     const data =   { round_off_amount: this.roundToTwo(Number(round_off_amount)),
                               grand_gst: this.roundToTwo(Number(grand_gst)  + Number(ser_gst) + Number(fixed_gst)),
                               grand_discount:  this.roundToTwo(Number(grand_discount)),
                               service_total: this.roundToTwo(Number(service_total)),
                                fixed_total: this.roundToTwo( Number(fixed_taxable)),
                               grand_total: this.roundToTwo(Number(grand_total)),
                               product: list,
                               service: service,
                               fixed: fixed,
                               product_taxable: this.roundToTwo(Number(product_taxable)),
                               taxable: this.roundToTwo(Number(product_taxable) + Number(fixed_taxable) + Number(service_total))
                             }
                             return data
   }
  // roundToTwo = (num: number) => Math.round(num * 100) / 100;
  roundToTwo = (num: number) => Math.round(num * 100 + 1e-9) / 100;
}
