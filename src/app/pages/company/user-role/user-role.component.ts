import { Token } from '@angular/compiler';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashApiService } from '../../../services/dash-api.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HelperService } from '../../../services/helper.service';
import { ErrorStateMatcher } from '@angular/material/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrl: './user-role.component.scss'
})
export class UserRoleComponent implements OnInit, OnDestroy {
  sub_get_roles:Subscription | undefined;
  sub_all_users:Subscription | undefined
  sub_set_role:Subscription | undefined

  userRoleForm!:FormGroup
  roles:any
  matcher:any
  // select
  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:IDropdownSettings = {};
  // select

  constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private fb: FormBuilder

  ){

  }
  ngAfterViewChecked(){
    // this.processData()
  }
  ngOnInit() {

      this.userRoleForm = this.fb.group({
        user: this.fb.control('', [Validators.required]),
        role: this.fb.control('', [Validators.required])

      })
      this.matcher = new ErrorStateMatcher();
      this.processData()
  }
  // select

  onItemSelect(item: any) {
    console.log("toched");
  }
  onSelectAll(items: any) {
    console.log(items);
  }
// select
  get f(): { [key: string]: AbstractControl } {
    return this.userRoleForm.controls;
  }
  processData() {
     let token = this.helper.get_local('token')
   this.sub_all_users = this.dashapi.all_users(token).subscribe(async(res:any)=>{
      let data = await res.data.map( (user:any) =>{
       return {item_id: user.id, item_text: user.f_name+' '+ user.l_name +" "+user.email  }
     })
     this.dropdownList = await data
     if(this.dropdownList.length){
        this.dashapi.get_roles(token).subscribe(async (res) =>{
          this.roles = await res.data
        })
     }

     console.log('inner', this.dropdownList)
     this.dropdownSettings = {
       singleSelection: true,
       idField: 'item_id',
       textField: 'item_text',
       selectAllText: 'Select All',
       unSelectAllText: 'UnSelect All',
       itemsShowLimit: 3,
       allowSearchFilter: true,
       closeDropDownOnSelection: true
      };

   }, (err) =>{
     console.log(err)
   })
  }
  submitForm(){
    let token  = this.helper.get_local('token')
    let user_id = this.userRoleForm.get('user')?.value
    let role_id = this.userRoleForm.get('role')?.value
    if(user_id[0] && role_id){
      console.log(user_id[0], role_id)
      this.dashapi.set_role(token, Number(user_id[0].item_id), Number(role_id)).subscribe(async (res) =>{
        await res
        Swal.fire({
          title: "Success",
          text: res.message,
          icon: "success"
        });
        this.userRoleForm.reset()
      }, (err) =>{
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.error.err_message,
          // footer: '<a href="#">Why do I have this issue?</a>'
        });
      })
    }
  }
  ngOnDestroy(): void {
    this.sub_all_users?.unsubscribe()
    this.sub_get_roles?.unsubscribe()
    this.sub_set_role?.unsubscribe()
  }
}
