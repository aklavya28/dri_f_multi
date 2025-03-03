import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import { ErrorStateMatcher } from '@angular/material/core';
import Swal from 'sweetalert2';
import { LayoutComponent } from '../../layout/layout.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit, OnDestroy {
  sub_new_category:Subscription | undefined
  newCategoryForm!:FormGroup
  matcher:any

  constructor(
    private helper: HelperService,
    private fb: FormBuilder,
    private dashapi: DashApiService,
    private layout: LayoutComponent,
    private router: Router
  ){}
    ngOnInit(): void {
      this.newCategoryForm = this.fb.group({
        name: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]),
        description: this.fb.control(null)
      })
      this.matcher = new ErrorStateMatcher();
    }
    submit(){
      let name = this.newCategoryForm.get('name')?.value;
      let description = this.newCategoryForm.get('description')?.value;
      let token = this.helper.get_local('token');
      let current_user = this.helper.get_local('current_user');
      let company_id = current_user.body.status.data.company_id;
      let user_id = current_user.body.status.data.id;

      this.sub_new_category = this.dashapi.new_category(token, name, description, company_id, user_id).subscribe(async(res:any)=>{
        this.newCategoryForm.reset()
        console.log( await res)

        Swal.fire({
          position: "top-end",
          icon: "success",
          text: res.message,
          showConfirmButton: false,
          timer: 1500
        });
        this.helper.navigateAndActive(this.layout.menus(),'Manage Items','store/show-categories', this.router, this.layout)
      }, (err) =>{
        console.log(err)
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.error.error
          // footer: '<a href="#">Why do I have this issue?</a>'
        });
      })

    }
    ngOnDestroy(): void {
      this.sub_new_category?.unsubscribe()
    }
}
