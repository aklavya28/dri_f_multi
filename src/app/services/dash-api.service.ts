import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Categories } from '../interfaces/categories';
@Injectable({
  providedIn: 'root'
})
export class DashApiService {

  constructor(
    private http: HttpClient,
    private api: AuthService
  ) { }
  company_profile(token:any): Observable<any>{
    return this.http.get<any>(this.api.baseurl+'/api/v1/companies', {
      headers: new HttpHeaders({
        "Authorization": `${token}`,
        "company-name":  localStorage.getItem('comp_db') || ''
      }),
      observe: 'response'

    })

  }

  create_new_user(token:string,data:any): Observable<any>{
    let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
    return this.http.post<any>(this.api.baseurl+'/api/v1/companies/create-new-user', data, {
      headers: contentHeader,
      observe: 'response'
     })


  }

  // promoter_as_user(token:any, f_name:string, l_name:string, email:string, password:string, company_id:number){
  // let data:any ={

  //     "f_name": f_name,
  //     "l_name": l_name,
  //     "email": email,
  //     "password": password,
  //     "company_id": company_id
  //    }
  // let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}` });
  // return this.http.post<any>(this.api.baseurl+'/api/v1/promoters/new-promoter', data, { headers: contentHeader })
  // }
   promoter_as_user(token:any, data:any): Observable<any>{
    let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
    return this.http.post<any>(this.api.baseurl+'/api/v1/promoters/new-promoter', data,
    {
      headers: contentHeader,
      observe: 'response'
     }
  )
  }

  all_promoters(token:any):  Observable<any> {
    return this.http.get<any>(this.api.baseurl+'/api/v1/promoters', {
      headers: new HttpHeaders({
        "Authorization": `${token}`,
        "company-name":  localStorage.getItem('comp_db') || ''
      })})
  }
  add_share_to_promoter(
    token:any,
    nominal_value:number,
    total_shares:number,
    allotment_date:string,
    user_id:number,
    company_id:number,
    paymentdetail?:any

    ):   Observable<any>
    {
    let data:any ={

      token,
      nominal_value,
      total_shares,
      allotment_date,
      user_id,
      company_id,
      paymentdetail
       }
    let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}` });
    return this.http.post<any>(this.api.baseurl+'/api/v1/promoters', data, { headers: contentHeader })
    }
    all_users(token:any): Observable<any> {
      return this.http.get<any>(this.api.baseurl+'/api/v1/companies/all-users', {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response'

      })
    }
    get_roles(token:any): Observable<any> {
      return this.http.get<any>(this.api.baseurl+'/api/v1/companies/user-roles', {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response'
      })
    }

    assign_roles(token:string, data:any) : Observable<any>{
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",
         "Authorization": `${token}`,
         "company-name":  localStorage.getItem('comp_db') || ''
        });
      return this.http.post<any>(this.api.baseurl+'/api/v1/companies/assign-roles', data,
      {
        headers: contentHeader,
        observe: 'response'
       })
    }
    get_user_associated_roles(token:any, slug:string): Observable<any> {
      return this.http.get<any>(`${this.api.baseurl}/api/v1/companies/get-user-associated-roles/?slug=${slug}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response'
      })
    }

    set_role(token:any, user_id:number, role_id:number) {
      let data:any ={
        token,
        user_id,
        role_id
       }
       let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/companies/set-roles', data, { headers: contentHeader })
    }
      new_ladger(token:any, data:any) {
       let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/entries/create-new-ledger', data, { headers: contentHeader })
    }
    new_category(token:any,  name:string, description:string, company_id:number, user_id:any) {
      let data:any ={
        name,
        description,
        company_id,
        user_id
       }
       let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}` , "company-name":  localStorage.getItem('comp_db') || ''});
      return this.http.post<any>(this.api.baseurl+'/api/v1/store/create-new-category', data, { headers: contentHeader })
    }


   get_product_categories(token:any, company_id:number) {
      return this.http.get<any>(`${this.api.baseurl}/api/v1/store/product-categories/?company_id=${company_id}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
 get_product_categories2(token:any, company_id:number) {
      return this.http.get<Categories[]>(`${this.api.baseurl}/api/v1/store/product-categories/?company_id=${company_id}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }

    purchase_product_categories(token:string) {
      return this.http.get<Categories[]>(`${this.api.baseurl}/api/v1/store/purchase-product-categories`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }


    new_product(token:any, data:any) {
       let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/store/new-product', data, { headers: contentHeader })
    }

    get_products(token:any, company_id:number, category_id:number) {
      return this.http.get<any>(`${this.api.baseurl}/api/v1/store/get-category-products/?category_id=${category_id}&&company_id=${company_id}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    get_venders(token:any, company_id:number) {
      return this.http.get<any>(`${this.api.baseurl}/api/v1/store/get-venders/?company_id=${company_id}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    new_order( token:any, data:any ):Observable<any> {
       let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/store/new-order', data,
      {
        headers: contentHeader,
        observe: 'response'
       })
    }
    update_purchase_order( token:any, data:any ):Observable<any> {
       let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/store/update-purchase-order', data,
      {
        headers: contentHeader,
        observe: 'response'
       })
    }



    get_promoter_with_shares(token:any):Observable<any>{
      return this.http.get<any>(`${this.api.baseurl}/api/v1/promoters/all-promoter-with-share`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response'
      })
    }

    get_promoter_transactions(token:any,  slug:string) : Observable<any>{
      return this.http.get<any>(`${this.api.baseurl}/api/v1/promoters/${slug}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response'
      })
    }

    get_ledgers(token:any, lebal?:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/companies/all-ledgers/?lebal=${lebal}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }

    get_ledger_detail(token:any, slug:string, page:number, itemsPerPage:number,start_date?:Date, end_date?:Date){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/companies/get-ledger-detail/?slug=${slug}&&page=${page}&&par_page_items=${itemsPerPage}&&start_date=${start_date}&&end_date=${end_date}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    get_all_entries_plutus(token:any, page:number, itemsPerPage:number,start_date?:Date, end_date?:Date){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/entries/get-all-entries-plutus/?page=${page}&&par_page_items=${itemsPerPage}&&start_date=${start_date}&&end_date=${end_date}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }


    get_entry_detail(token:any, slug?:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/companies/get-entry-detail/?slug=${slug}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }

    // get_all_products(token:any, prduct_search?:any){
    //   return this.http.get<any>(`${this.api.baseurl}/api/v1/store/get-all-products/?product_search=${prduct_search}`, {
    //     headers: new HttpHeaders({
    //       "Authorization": `${token}`
    //     })})
    // }

      get_all_products(token:any,data?:any ) {

        let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`,"company-name":  localStorage.getItem('comp_db') || '' });
        return this.http.post<any>(this.api.baseurl+'/api/v1/store/get-all-products', data, { headers: contentHeader })
      }
      get_all_orders(token:any,page:number, itemsPerPage:number,data?:any ): Observable<any> {
        // let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}` });
      return this.http.get<any>(this.api.baseurl+`/api/v1/store/all-order/?page=${page}&&par_page_items=${itemsPerPage}&&data=${data}`,

       { headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response'
      }
    )
    }
    order_detail(token:any, slug:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/store/order-order/?slug=${slug}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }

    get_sale_categories(token:any){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/store/products-sale-categories`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    get_sale_products(token:any, category_id:number){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/store/get-sale-products/?category_id=${category_id}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    get_sale_product_mrp(token:any, product_id:number){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/store/get-sale-products-mrps/?product_id=${product_id}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    get_sale_product_unit_price(token:any, product_id:number){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/store/get-sale-products-unit-price/?product_id=${product_id}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`
        })})
    }
    get_sale_product_available_units(token:any, product_id:number, unit_price:number){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/store/get-sale-products-available-units/?product_id=${product_id}&&unit_price=${unit_price}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    get_sold_product(token:any, data:any){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/store/get-sold-product/?data=${data}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }


    remove_temp_user_order_items(token:any, data?:any){
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/store/remove-temp-user-order-items',data ,{ headers: contentHeader })
    }
    remove_temp_single_product(token:any, data:any){
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/store/remove-temp-single-product',data ,{ headers: contentHeader })
    }
    save_sale_order(token:any, data:any){
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/store/save-sale-order',data ,{ headers: contentHeader })
    }
    // entries

    get_ledgers_by_type(token:any, type:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/entries/get-ledgers-by-type/?type=${type}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    get_ledgers_by_name(token:any, name:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/companies/all-ledgers-by-name/?name=${name}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }

    get_list_of_banks(token:any){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/entries/get-list-of-banks/`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    save_journal_entry(token:any, data:any){
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}` , "company-name":  localStorage.getItem('comp_db') || ''});
      return this.http.post<any>(this.api.baseurl+'/api/v1/entries/save-journal-entry',data ,{ headers: contentHeader })
    }

    company_bank_account(token:any, ac_name:any){
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/companies/company-bank-account',ac_name ,{ headers: contentHeader })
    }
    update_company_bank_account(token:any, data:any){
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}` , "company-name":  localStorage.getItem('comp_db') || ''});
      return this.http.patch<any>(this.api.baseurl+'/api/v1/companies/update-company-bank-account',data ,{ headers: contentHeader })
    }
    get_company_banks(token:any): Observable<any>{
      return this.http.get<any>(`${this.api.baseurl}/api/v1/companies/get-company-banks/`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response'
      })
    }
    edit_company_bank(token:any, data?:any){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/companies/get-company-banks/`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    get_all_ledgers(token:any){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/entries/get-all-ledgers/`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    create_new_journal_entry(token:any, data:any){
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/entries/create-new-journal-entry',data ,{ headers: contentHeader })
    }



    get_all_entries(token:string, page:number, itemsPerPage:number,start_date?:Date, end_date?:Date ){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/entries/get-all-entries/?page=${page}&&par_page_items=${itemsPerPage}&&start_date=${start_date}&&end_date=${end_date}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })
      })
    }


  reverse_entry(token:any,slug:string){
    let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
    return this.http.post<any>(this.api.baseurl+'/api/v1/entries/reverse-entry', {slug}, { headers: contentHeader })
  }

  nominee_relation(token:any){
    return this.http.get<any>(`${this.api.baseurl}/api/v1/employees/nominee-relation/`, {
      headers: new HttpHeaders({
        "Authorization": `${token}`,
        "company-name":  localStorage.getItem('comp_db') || ''
      })})
  }
  create_employee(token:any,data:any){
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`,"company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/employees', data, { headers: contentHeader })
    }
  show_employees(token:any){
    return this.http.get<any>(`${this.api.baseurl}/api/v1/employees/`, {
      headers: new HttpHeaders({
        "Authorization": `${token}`,
        "company-name":  localStorage.getItem('comp_db') || ''
      })})
  }
  show_employee(token:any, slug:string){
    return this.http.get<any>(`${this.api.baseurl}/api/v1/employees/${slug}`, {
      headers: new HttpHeaders({
        "Authorization": `${token}`,
        "company-name":  localStorage.getItem('comp_db') || ''
      })})
  }
  allowance_deduction_list(token:any){
    return this.http.get<any>(`${this.api.baseurl}/api/v1/employees/allowance-deduction-list`, {
      headers: new HttpHeaders({
        "Authorization": `${token}`,
        "company-name":  localStorage.getItem('comp_db') || ''
      })})
  }
  create_salary(token:any, data:any, item_data:any){
    let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}` , "company-name":  localStorage.getItem('comp_db') || ''});
    return this.http.post<any>(this.api.baseurl+'/api/v1/employees/create-salary', data, { headers: contentHeader })
  }

  change_active_status_employee(token:any, data:any){
    let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
    return this.http.put<any>(this.api.baseurl+'/api/v1/employees/change-active-status-employee', data, { headers: contentHeader })
  }
  employees_salary_disbursement(token:any){
    return this.http.get<any>(`${this.api.baseurl}/api/v1/employees/employees-salary-disbursement`, {
      headers: new HttpHeaders({
        "Authorization": `${token}`,
        "company-name":  localStorage.getItem('comp_db') || ''
      })})
    }
    get_liquid(token:any){
    return this.http.get<any>(`${this.api.baseurl}/api/v1/employees/get-liquid`, {
      headers: new HttpHeaders({
        "Authorization": `${token}`,
        "company-name":  localStorage.getItem('comp_db') || ''
      })})
    }
    create_employee_salaries(token:any, data:any){
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/employee_salaries', data, { headers: contentHeader })
    }

    get_disbursement_history(token:any){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/employee_salaries/get-disbursement-history`, {
        headers: new HttpHeaders({
        "Authorization": `${token}`,
        "company-name":  localStorage.getItem('comp_db') || ''
      })})
    }
    get_disbursement_history_details(token:any, slug:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/employee_salaries/get-disbursement-history-details/?slug=${slug}`, {
        headers: new HttpHeaders({
        "Authorization": `${token}`,
        "company-name":  localStorage.getItem('comp_db') || ''
      })})
    }
    get_active_employees(token:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/employees/get-active-employees`, {
        headers: new HttpHeaders({
        "Authorization": `${token}`,
        "company-name":  localStorage.getItem('comp_db') || ''
      })})
    }
    create_advance_salary(token:any, data:any){
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}` , "company-name":  localStorage.getItem('comp_db') || ''});
      return this.http.post<any>(this.api.baseurl+'/api/v1/employees/create-advance-salary', data, { headers: contentHeader })
    }
    get_advance_salary_payouts(token:string,slug:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/employee_salaries/get-advance-salary-payouts/?slug=${slug}`, {
        headers: new HttpHeaders({
        "Authorization": `${token}`,
        "company-name":  localStorage.getItem('comp_db') || ''
      })})
    }
    current_share_price(token:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/promoters/current-share-price`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    add_shares_to_promoter(token:any, data:any) :Observable<any>{
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/promoters/add-shares-to-promoter', data,
      {
        headers: contentHeader,
        observe: 'response'
       })
    }

    new_khata(token:any, data:any): Observable<any>{
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}` , "company-name":  localStorage.getItem('comp_db') || ''});
      return this.http.post<any>(this.api.baseurl+'/api/v1/khatabooks', data, {
        headers: contentHeader,
        observe: 'response'
      })
    }

    // get_all_khatabooks(token:any,data?:any ) {
    //   let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}` });
    // return this.http.post<any>(this.api.baseurl+'/api/v1/khatabooks/get-all-khatabooks', data, { headers: contentHeader })
    // }
    get_all_khatabooks(token:string, page:number, itemsPerPage:number, search?:any ){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/khatabooks/get-all-khatabooks/?page=${page}&&par_page_items=${itemsPerPage}&&search=${search}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })
      })
    }


    get_all_khatabooks_drop(token:any,type?:string ) {

      return this.http.get<any>(`${this.api.baseurl}/api/v1/khatabooks/get-all-khatabooks-drop/?type=${type}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})

    }

    change_active_status_khata(token:any,slug:string, data:any){
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`,"company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.put<any>(`${this.api.baseurl}/api/v1/khatabooks/${slug}`, data, { headers: contentHeader })
    }

    get_all_lenders(token:string, type?:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/khatabooks/get-all-lenders/?type=${type}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    create_return_order(token:any,data?:any ) {
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
    return this.http.post<any>(this.api.baseurl+'/api/v1/store/create-return-order', data, { headers: contentHeader })
    }
    refresh_ledgers(token:any,data?:any ) {
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}` , "company-name":  localStorage.getItem('comp_db') || ''});
    return this.http.post<any>(this.api.baseurl+'/api/v1/companies/refresh-ledgers', data, { headers: contentHeader })
    }
    get_states(token:any){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/khatabooks/get-states`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    approve_bill(token:any, data:any ) {
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}` , "company-name":  localStorage.getItem('comp_db') || ''});
    return this.http.post<any>(this.api.baseurl+'/api/v1/store/approve-bill', {data}, { headers: contentHeader })
    }

    khata_profile(token:any,slug:string, page:number, par_page_itmes:number): Observable<any>{
      return this.http.get<any>(`${this.api.baseurl}/api/v1/khatabooks/khata-profile/?slug=${slug}&&page=${page}&&par_page_items=${par_page_itmes}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response'
      })
    }
    get_khata(token:any,slug:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/khatabooks/get-khata/?slug=${slug}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }


    get_khata_transactions(token:any,slug:string, page:number,par_page_itmes:number){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/khata_transactions/?slug=${slug}&&page=${page}&&par_page_items=${par_page_itmes}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    khata_orders(token:any,slug:string, page:number,par_page_itmes:number, form_data?:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/khata_transactions/khata-orders/?slug=${slug}&&page=${page}&&par_page_items=${par_page_itmes}&&form_data=${form_data}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }

    delete_khata_trans(token:any,id:number){
      return this.http.delete<any>(`${this.api.baseurl}/api/v1/khata_transactions/${id}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    stock_register(token:string, page:number, itemsPerPage:number, product_id?:number){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/dashboard/stock-register/?page=${page}&&par_page_items=${itemsPerPage}&&product_id=${product_id}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    // stock_summery(token:string, page:number, itemsPerPage:number){
    //   return this.http.get<any>(`${this.api.baseurl}/api/v1/dashboard/stock-register/?page=${page}&&par_page_items=${itemsPerPage}`, {
    //     headers: new HttpHeaders({
    //       "Authorization": `${token}`
    //     })})
    // }
    // stock_summery(token:string, page:number, itemsPerPage:number): Observable<void>{
    //   return this.http.get<any>(`${this.api.baseurl}/api/v1/dashboard/stock-summery/?page=${page}&&par_page_items=${itemsPerPage}`, {
    //     headers: new HttpHeaders({
    //       "Authorization": `${token}`,
    //     }),
    //   })
    // }
    stock_summery(token: string, page: number, itemsPerPage: number): Observable<any> {
      return this.http.get<any>(`${this.api.baseurl}/api/v1/dashboard/stock-summery/?page=${page}&par_page_items=${itemsPerPage}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response' // Use 'response' to get full HTTP response
      });
    }

    get_expense_category(token:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/expense/expense-category`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    save_expense_entry(token:any,data:any ) {
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`,"company-name":  localStorage.getItem('comp_db') || '' });
    return this.http.post<any>(this.api.baseurl+'/api/v1/expense/save-expense-entry', data, { headers: contentHeader })
    }
    get_exp_entries(token:string, page:number, itemsPerPage:number,start_date?:Date, end_date?:Date){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/expense/get-exp-entries/?page=${page}&&par_page_items=${itemsPerPage}&&start_date=${start_date}&&end_date=${end_date}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    get_exp_categories(token:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/expense/get-exp-categories`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    change_active_exp_categories(token:string, id:number){
      return this.http.patch<any>(`${this.api.baseurl}/api/v1/expense/change-active-exp-categories/`,{id}, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    save_expense_category(token:string, data:any){
      return this.http.post<any>(`${this.api.baseurl}/api/v1/expense/save-expense-category`,{data}, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    reverse_exp_entry(token:string,slug:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/expense/reverse-exp-entry/?slug=${slug}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    company_trial_balance(token:string, start_date?:Date, end_date?:Date){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/dashboard/company-trial-balance/?start_date=${start_date}&&end_date=${end_date}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    daybook(token:string, start_date?:Date){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/dashboard/daybook/?start_date=${start_date}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    income_statement(token:string, start_date?:Date, end_date?:Date){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/dashboard/income-statement/?start_date=${start_date}&&end_date=${end_date}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    product_units(token:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/companies/product-units`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    save_sale_services(token:string, data:any){
      return this.http.post<any>(`${this.api.baseurl}/api/v1/sale_services`,{data}, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    get_sale_services(token:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/sale_services`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    get_sale_services_active(token:string){
      return this.http.get<any>(`${this.api.baseurl}/api/v1/sale_services/get-sale-services-active`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }


    change_active_sale_services(token:string, id:number){
      return this.http.patch<any>(`${this.api.baseurl}/api/v1/sale_services/${id}`,id, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        })})
    }
    edit_order_with_detail(token:any, slug:string): Observable<any> {
      return this.http.get<any>(this.api.baseurl+`/api/v1/store/edit-order-with-detail/?slug=${slug}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response'
      })
    }
    remove_sale_edit_product(token: string, slug: string): Observable<any> {
      const contentHeader = new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": `${token}`,
        "company-name":  localStorage.getItem('comp_db') || ''
        // Add 'Bearer'
      });
      return this.http.post<any>(
        `${this.api.baseurl}/api/v1/store/remove-sale-edit-product`,
        { slug }, // Wrap slug in an object
        {
          headers: contentHeader,
          observe: 'response', // Optional: If you need the full response
        }
      );
    }

    add_product_items_sale_edit(token:any,order_slug:string, data?:any, form_data?:any ): Observable<any> {
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/store/add-product-items-sale-edit',{order_slug,data, form_data},
      {
        headers: contentHeader,
        observe: 'response',
      })
    }
    save_edit_sale_order(token:any,order_slug:string, data?:any, ): Observable<any> {
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/store/save-edit-sale-order',{order_slug,data},
      {
        headers: contentHeader,
        observe: 'response',
      })
    }

    all_fixed_assets(token:any, page:number, itemsPerPage:number,start_date?:Date, end_date?:Date) : Observable<any>
    {
      return this.http.get<any>(`${this.api.baseurl}/api/v1/fixed_assets/all-fixed-assets/?page=${page}&&par_page_items=${itemsPerPage}&&start_date=${start_date}&&end_date=${end_date}`, {
        headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response'
      })
    }
    fixed_assets_sale(token:any) : Observable<any>
    {
        return this.http.get<any>(`${this.api.baseurl}/api/v1/fixed_assets/fixed-assets-sale`, {
          headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response'
      })
    }
    fixed_assets_sale_save(token:string,data:any): Observable<any>{
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/fixed_assets/fixed-assets-sale-save', data, {
        headers: contentHeader,
        observe: 'response'
       })

    }
    delete_fixed_assets_sale(token:any,id:number): Observable<any>{
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.delete<any>(`${this.api.baseurl}/api/v1/fixed_assets/delete-fixed-assets-sale/${id}`, {
        headers: contentHeader,
        observe: 'response'
      })
    }

    create_khata_trns(token:any,data?:any ): Observable<any> {
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json",  "Authorization": `${token}`, "company-name":  localStorage.getItem('comp_db') || '' });
      return this.http.post<any>(this.api.baseurl+'/api/v1/khata_transactions', data, {
      headers: contentHeader,
        observe: 'response'
      })
    }
    company_trial_balance_new(token:any) : Observable<any>
    {
        return this.http.get<any>(`${this.api.baseurl}/api/v1/dashboard/company-trial-balance-new`, {
          headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response'
      })
    }
    get_all_products_dashboard(token:any) : Observable<any>
    {
        return this.http.get<any>(`${this.api.baseurl}/api/v1/dashboard/get-all-products-dashboard`, {
          headers: new HttpHeaders({
          "Authorization": `${token}`,
          "company-name":  localStorage.getItem('comp_db') || ''
        }),
        observe: 'response'
      })
    }
    // testing for multy
    sendingCompany(company:string){
      // this.http.get('https://staging.devrising.in/api/ledger', {
      //   headers: { 'Company-Name': 'company1' }
      // }).subscribe(response => {
      //   console.log(response);
      // });
      let contentHeader = new HttpHeaders({ "Content-Type":"application/json", 'Company-Name': company});
      return this.http.get<any>(this.api.baseurl+'/find-company',  { headers: contentHeader })
    }
  }
