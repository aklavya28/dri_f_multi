import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-asign-roles',
  templateUrl: './asign-roles.component.html',
  styleUrl: './asign-roles.component.scss'
})
export class AsignRolesComponent implements OnInit,OnDestroy{
  sub_get_roles!:Subscription
  sub_get_user_associated_roles!:Subscription
  slug:string=""
  name:string=""

  role_api:any[]=[]
  selected:any[] = []
  roleForm!:FormGroup

  constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private active_r: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ){

  }
  ngOnInit() {
    this.active_r.paramMap.subscribe((res:any) =>{
      this.slug = res.params.slug
      this.name = res.params.name
    })
    let token = this.helper.get_local('token')
    this.getRoles()

  }

  getRoles(){
    let token = this.helper.get_local('token')
    this.sub_get_roles = this.dashapi.get_roles(token).subscribe({
      next:(res) =>{
        this.fetchRoles(token, res.body)
      }
    })
  }
  fetchRoles(token:string, res:any){
    this.role_api = res.data
    this.roleForm = this.roleFormFunction()
    this.sub_get_user_associated_roles = this.dashapi.get_user_associated_roles(token, this.slug).subscribe({
      next:(res) =>{
        this.roleForm.get('roles')?.setValue(res.body.data)
      }
    })
  }

  roleFormFunction(){
    return this.fb.group({
      roles: this.fb.control('', [Validators.required])
    })
  }
  submit(){
    console.log("dfdsf")
    let data = {
      user_slug: this.slug,
      roles: this.roleForm.get('roles')?.value
    }
    let token = this.helper.get_local('token')
    this.dashapi.assign_roles(token, data).subscribe({
      next:(res) =>{
        Swal.fire({
              // title: "Success",
              text: res.body.message,
              icon: "success",
              width: 300,
              imageWidth: 10

        });
        this.router.navigate(['/company/users'])
      },
      error:()=>{
        Swal.fire({
              icon: "error",
              // title: "Oops...",
              // text: err.error.err_message,
              text: "Something Went Wrong",
              // footer: '<a href="#">Why do I have this issue?</a>'
            });
      }
    })
  }

  ngOnDestroy() {
    this.sub_get_roles?.unsubscribe()
    this.sub_get_user_associated_roles?.unsubscribe()
  }

}
