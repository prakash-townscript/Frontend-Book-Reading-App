import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { SignupRequestPayload } from './signup-request.payload';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupRequestPayload: SignupRequestPayload;
  formstatus!:boolean
  showErrorMessage : Boolean | undefined
  showSuccessMessage  : Boolean | undefined
  signupForm = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    firstname: new FormControl('',[Validators.required]),
    lastname: new FormControl(''),
    password: new FormControl('',[Validators.required]),
  });
 
  constructor(private authService: AuthService,private router: Router
    ) {
    this.signupRequestPayload = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
  }

  ngOnInit() {
  }

  signup() {
    if(this.signupForm.invalid){
      this.formstatus = true;
      this.showErrorMessage = false
      this.showSuccessMessage = false
    }else{
      this.signupRequestPayload.email = this.signupForm.get('email')?.value;
      this.signupRequestPayload.firstName = this.signupForm.get('firstname')?.value;
      this.signupRequestPayload.lastName = this.signupForm.get('lastname')?.value;
      this.signupRequestPayload.password = this.signupForm.get('password')?.value;
      this.authService.signup(this.signupRequestPayload)
      .subscribe(data => {
        this.showSuccessMessage = true
        this.formstatus = false;
        this.showErrorMessage = false
      }, error => {
        this.showErrorMessage = true
        this.formstatus = false
        this.showSuccessMessage = false
      });
    }
  }
}