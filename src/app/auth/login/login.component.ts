import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from '../shared/auth.service';
import { LoginRequestPayload } from './LoginRequestPayload';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  loginRequestPayload!: LoginRequestPayload;
  showErrorMessage : Boolean | undefined
  formstatus!:Boolean

 
  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required]),
  });


  constructor(private authService: AuthService, private router: Router,private localStorage: LocalStorageService) {
    this.loginRequestPayload = {
      email: '',
      password: ''
    };
   }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required,Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  login() {
    if(this.loginForm.invalid){
      this.formstatus = true;
      this.showErrorMessage = false
    }else{
      this.formstatus = false;
      this.loginRequestPayload.email = this.loginForm.get('email')?.value;
      this.loginRequestPayload.password = this.loginForm.get('password')?.value;
      this.authService.login(this.loginRequestPayload).subscribe(data => {
        this.router.navigateByUrl('/my-library');
      }, error=>{
          this.showErrorMessage = true
      });
    }
  }
}
