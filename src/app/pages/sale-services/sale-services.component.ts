import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CustomValidation } from '../../interfaces/autocomplete-validation';
import { HelperService } from '../../services/helper.service';
import { DashApiService } from '../../services/dash-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sale-services',
  templateUrl: './sale-services.component.html',
  styleUrl: './sale-services.component.scss'
})
export class SaleServicesComponent implements OnInit, OnDestroy {
  sub_get_exp_categories!:Subscription
  sub_change_active_exp_categories !:Subscription
  sub_save_sale_services!: Subscription
  categories:any[] = []
  catForm!:FormGroup
  balance_check_err:string[] = []

  constructor(
    private helper: HelperService,
    private dashapi: DashApiService,
    private fb: FormBuilder

  ){}
  ngOnInit(): void {
     this.load_data()
     this.catForm = this.load_form()
  }

  load_data(){
    this.categories = []
    this.dashapi.get_sale_services(this.helper.get_local('token')).subscribe((res:any) =>{
      this.categories = res.data
     })
  }
  load_form(){
   return  this.fb.group({
      name: this.fb.control('', [Validators.required, CustomValidation.alphanumeric(), Validators.maxLength(30)]),
      gst: this.fb.control('', [Validators.required, CustomValidation.only_digit_with_zero(), Validators.max(50)]),
      description: this.fb.control(null),

   })
  }

  change_active_exp_cat(id:any, e:any){

      console.log(e.checked)
      e.checked = !e.checked
      let token = this.helper.get_local('token')
      this.sub_change_active_exp_categories = this.dashapi.change_active_sale_services(token,Number(id) ).subscribe((res)=>{

        Swal.fire({
          position: "center",
          icon: "success",
          width:'300px',
          imageWidth:"70px",
          text: "Status changed Successfully",
          showConfirmButton: false,
          timer: 1500
        });
      })

  }
  submit(){
    let data = this.catForm.value

    this.dashapi.save_sale_services(this.helper.get_local('token'), data).subscribe((res:any) =>{
      this.categories = []
      Swal.fire({
        position: "center",
        icon: "success",
        width:'300px',
        imageWidth:"70px",
        text: "Saved Successfully",
        showConfirmButton: false,
        timer: 1500
      });
      this.load_data()
      this.catForm.reset()
      this.markFormGroupUntouched(this.catForm);
    }, err =>{
        this.balance_check_err = []
      this.balance_check_err.push(`${err.error.error} `)
        this.balance_check_err = []
    })
  }
  markFormGroupUntouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        control.markAsUntouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupUntouched(control);
      }
    });
  }
  ngOnDestroy(): void {
    this.sub_change_active_exp_categories?.unsubscribe()
    this.sub_get_exp_categories?.unsubscribe()
    this.sub_save_sale_services?.unsubscribe()
  }
}
