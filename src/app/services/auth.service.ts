import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseurl:any ="http://127.0.0.1:3000"
  // baseurl:any ="https://dri.devrising.in"
  // baseurl:any ="http://devrising.in"
  // baseurl:any ="http://164.52.196.226"

  private loggedIn = false;
  constructor(
    private http: HttpClient
  ) { }

  login_api(email:string, password:string){

    let data:any ={
      "user": {
        "email": email,
        "password": password
      }
    }
    let contentHeader = new HttpHeaders({ "Content-Type":"application/json" });
    return this.http.post<any>(this.baseurl+'/users/sign_in', data, { headers: contentHeader, observe: 'response' })
  }
  // working fine --- for registering user
  // register_user(f_name:string, l_name:string, email:string, password:string, role:string, company_id:number){

  //   let data:any ={
  //     "user": {
  //       "f_name": f_name,
  //       "l_name": l_name,
  //       "email": email,
  //       "password": password,
  //       "role": role,
  //       "company_id": company_id
  //     }
  //   }
  //   let contentHeader = new HttpHeaders({ "Content-Type":"application/json" });
  //   return this.http.post<any>(this.baseurl+'/users', data, { headers: contentHeader })
  // }

  logout_api(token:any){
  return  this.http.delete(this.baseurl+"/users/sign_out",{
      headers: new HttpHeaders({
        "Authorization": `${token}`
      })
    })
  }
  isLoggedIn(): boolean {
    return this.loggedIn;
  }



}
