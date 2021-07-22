import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth/shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  toggle:boolean =  false;
  constructor(private authservice:AuthService) {  
    if(authservice.isLoggedIn())this.toggle = true;
  }

  ngOnInit(): void { 
    this.authservice.refreshNeeded.subscribe(()=>{
      this.updateHeaderLinks();
    })
  }

  updateHeaderLinks(){
    if (this.toggle) {this.toggle=false}
    else this.toggle = true
  }

  logout(){
    console.log("logout")
  }

}
