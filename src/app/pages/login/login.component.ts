import { LayoutComponent } from './../layout/layout.component';
import { Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HelperService } from '../../services/helper.service';
import { DashApiService } from '../../services/dash-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',

})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  show_pass_container:boolean= false
  login_erros:any


  // password
  hide = true;
  // password


  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private helper: HelperService,
    private layout: LayoutComponent,
    private dashapi: DashApiService
  ){ }
  ngOnInit(): void {

    this.dashapi.sendingCompany().subscribe(res =>{
      console.log("company", res)
    })


      this.loginForm = this.load_form()

      // testing
      this.loginForm.get('email')?.setValue("admin@admin.com")
      this.loginForm.get('password')?.setValue("admin@admin.com")
      // testing
  }
  load_form(){
    return this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required]),
      show_pass: this.fb.control(null),

    })
  }
  togglePasswordVisibility(e:any) {
    e.preventDefault()
    this.hide = !this.hide;
  }
   login(){
    let email = this.loginForm.get('email')?.value
    let password = this.loginForm.get('password')?.value
    this.auth.login_api(email,password).subscribe((res:any)=>{

        let token_string = JSON.stringify(res.headers.get('Authorization'))
        let current_user = JSON.stringify(res)
        localStorage.setItem('current_user', current_user)
        localStorage.setItem('token',token_string)
        this.helper.navigateAndActive(this.layout.menus(),'Dashboard', 'dashboard/stock-summery/1', this.router, this.layout)

        // this.router.navigate(['dashboard/stock-summery/1'])

    }, (err) =>{
      if(err.status === 401){
        alert(err.error)
        this.login_erros = err.error
          this.login_erros = ''
      }

    })

  }

}
