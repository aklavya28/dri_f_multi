import { HelperService } from './../../../services/helper.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrl: './create-new-user.component.scss'
})
export class CreateNewUserComponent implements OnInit, OnDestroy{
  newUserForm!: FormGroup
  matcher:any
  api_error:any[]=[]
  subscribe_create_new_user:Subscription | undefined
  constructor(
    private dashapi: DashApiService,
    private fb: FormBuilder,
    private helper: HelperService,
    private router: Router

  ){
    // this.create_user_methods()
  }
  ngOnInit():void{
    this.newUserForm = this.fb.group({
      f_name: this.fb.control('', [Validators.required]),
      l_name: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),

    })
    this.matcher = new ErrorStateMatcher();

    console.log("form",this.newUserForm)
  }
  get f(): { [key: string]: AbstractControl } {
    return this.newUserForm.controls;
  }
  creatNewUser(){
   let data ={
      f_name: this.newUserForm.get('f_name')?.value,
      l_name: this.newUserForm.get('l_name')?.value,
      email: this.newUserForm.get('email')?.value,
    }
    let token =  this.helper.get_local('token')

    // this.ngOnInit()
    this.subscribe_create_new_user = this.dashapi.create_new_user(token,{data}).subscribe({
      next:(res)=>{
        Swal.fire({
          title: "Success",
          text: res.body.message,
          icon: "success"
        });
        this.newUserForm.reset()
      },
      error:(err:any) =>{
       console.log(err.error.err_message)

        this.api_error = err.error.err_message

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.error.err_message,
        // footer: '<a href="#">Why do I have this issue?</a>'
      });
      }
    })
  }
  ngOnDestroy(): void {
    this.subscribe_create_new_user?.unsubscribe();
  }
}
