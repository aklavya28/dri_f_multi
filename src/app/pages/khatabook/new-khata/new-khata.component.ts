import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,   Validators } from '@angular/forms';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { HelperService } from '../../../services/helper.service';
import { DashApiService } from '../../../services/dash-api.service';
import Swal from 'sweetalert2';
import { LayoutComponent } from '../../layout/layout.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-khata',
  templateUrl: './new-khata.component.html',
  styleUrl: './new-khata.component.scss'
})
export class NewKhataComponent implements OnInit ,OnDestroy{
  sub_new_khata!:Subscription
  sub_get_states!:Subscription
  newKhataForm!:FormGroup
  api_validation:any[] = []
  private destroy$ = new Subject<void>();
  states:any[] = []
  constructor(
    private fb: FormBuilder,
    private helper: HelperService,
    private dashapi: DashApiService,
    private layout: LayoutComponent,
    private router: Router
  ){}


  ngOnInit() {

    this.load_states(this.helper.get_local('token'))

    this.newKhataForm = this.newKhataFuntion()
    // on change validations
      this.newKhataForm.get('email')?.valueChanges.subscribe((res:any) =>{
        let val = this.newKhataForm.get('email')?.value
          val ? this.email_add_validation() : this.remove_validation('email')
      })
      this.newKhataForm.get('company_name')?.valueChanges.subscribe((res:any) =>{
          res ? this.company_name_add_validation() : this.remove_validation('company_name')
          // console.log(res.length !== 0)
      })
      this.newKhataForm.get('gst')?.valueChanges.subscribe((res:any) =>{
          res ? this.gst_add_validation() : this.remove_validation('gst')
          // console.log(res.length !== 0)
      })
       this.newKhataForm.get('tan')?.valueChanges.subscribe((res:any) =>{
          res ? this.tan_add_validation() : this.remove_validation('tan')
          // console.log(res.length !== 0)
      })

    // on change validations

  }
  newKhataFuntion(){
    return this.fb.group({
      khata_type:   this.fb.control('', [Validators.required]),
      name:   this.fb.control('', [Validators.required]),
      mobile: this.fb.control('',[Validators.required, Validators.minLength(10), CustomValidation.only_digit()]),
      email:  this.fb.control(null),
      // bussiness
      state_id: this.fb.control('', [Validators.required]),
      company_name: this.fb.control(null),
      gst:          this.fb.control(null),
      // pan:          this.fb.control('', [Validators.required, CustomValidation.pan(),Validators.minLength(10)]),
      pan:          this.fb.control(null),
      tan:          this.fb.control(null),
      // address
      address:      this.fb.control('', [Validators.required, Validators.maxLength(70)]),
    })
  }
  email_add_validation(){
    this.newKhataForm.get('email')?.setValidators([Validators.email])
  }
  company_name_add_validation(){
    this.newKhataForm.get('company_name')?.setValidators([Validators.minLength(5), Validators.maxLength(30),CustomValidation.alphanumeric()] )
  }
  gst_add_validation(){
    this.newKhataForm.get('gst')?.setValidators([Validators.minLength(15), Validators.minLength(15), CustomValidation.alphanumeric_without_space()] )
  }
  tan_add_validation(){
    this.newKhataForm.get('tan')?.setValidators([Validators.minLength(10), Validators.minLength(10), CustomValidation.alphanumeric_without_space()] )
  }


  // remove
  remove_validation(col_name:string){
    this.newKhataForm.get(col_name)?.clearValidators()
  }
  submit(){


   let data = this.newKhataForm?.value

    let token = this.helper.get_local('token')
    this.dashapi.new_khata(token, {data:data})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) =>{
        Swal.fire({
              title: "Success",
              text: res.body.status,
              icon: "success"
            });
            this.helper.navigateAndActive(this.layout.menus(),'Khatabook', 'khatabook/khatabook-accounts/1', this.router, this.layout)
      },
      error: (err)=>{
                  Swal.fire({
                    icon: "error",
                    text: err.error.error
                  });

      },
      complete: ()=>{
        console.log("complete")
      }
    })

  }

  load_states(token:string){
  this.sub_get_states =  this.dashapi.get_states(token).subscribe((res:any) =>{
      console.log(res)
      this.states = res.data
    })
  }


  ngOnDestroy(): void {
    this.sub_new_khata?.unsubscribe()
    this.sub_get_states?.unsubscribe()
    this.destroy$.next();
    this.destroy$.complete();
  }

}
