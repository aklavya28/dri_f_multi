import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DashApiService } from '../../../services/dash-api.service';
import { HelperService } from '../../../services/helper.service';
import { FormGroup, FormBuilder, AbstractControl, Validators, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { CustomValidation } from '../../../interfaces/autocomplete-validation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrl: './ledger.component.scss'
})
export class LedgerComponent implements OnInit, OnDestroy {

  sub_new_ladger:Subscription |undefined
  newLedherForm!: FormGroup
  matcher:any

  constructor(
    private dashapi: DashApiService,
    private helper: HelperService,
    private fb: FormBuilder,

    ){}
    ngOnInit(){
      this.newLedherForm = this.load_form()
      this.matcher = new ErrorStateMatcher();

    }

    load_form(){
      return this.fb.group({
        type: this.fb.control('', [Validators.required]),
        name: this.fb.control('', [Validators.required, CustomValidation.alphanumeric()]),
      });
    }

    submit(){
     let data = this.newLedherForm?.value
     console.log(data,typeof data)
        this.dashapi.new_ladger(this.helper.get_local('token'), data ).subscribe(async (res) =>{
          Swal.fire({
            title: "Success",
            text: res.status,
            icon: "success"
          });
            // Reset the form after successful submission
            this.newLedherForm.reset();
            this.newLedherForm.markAsPristine();
            this.newLedherForm.markAsUntouched();

        }, (err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.error.error,
            // footer: '<a href="#">Why do I have this issue?</a>'
          });
          this.newLedherForm.reset();
          this.newLedherForm.markAsPristine();
          this.newLedherForm.markAsUntouched();
        })

    }
    ngOnDestroy(): void {
      this.sub_new_ladger?.unsubscribe()
    }
}
