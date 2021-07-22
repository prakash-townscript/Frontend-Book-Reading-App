import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { LoginRequestPayload } from '../login/LoginRequestPayload';
import { LoginResponse } from '../login/LoginResponse';
import { LocalStorageService } from 'ngx-webstorage';
import { map, tap } from 'rxjs/operators';
import { BookModel } from 'src/app/shared/book-model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()
  }

  private _refreshNeeded = new Subject<void>();

  get refreshNeeded(){
    return this._refreshNeeded
  }

  url:String = "http://bookservice-env.eba-pppjn4py.us-east-2.elasticbeanstalk.com";
  //url:String = "http://localhost:8080";

  constructor(private httpClient : HttpClient,private localStorage: LocalStorageService) { 
     
  }
  
  signup(signupRequestPayload:SignupRequestPayload):Observable<any>{
    return this.httpClient.post(this.url+'/api/auth/signup',signupRequestPayload,
    {responseType:'text'}
    );
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient.post<LoginResponse>(this.url+'/api/auth/login',
      loginRequestPayload).pipe(map(data => {
        this.localStorage.store('authenticationToken', data.authenticationToken);
        this.localStorage.store('email', data.email);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('expiresAt', data.expiresAt);
        this.localStorage.store('userId', data.userId);
        return true;
      })).pipe(
        tap(()=>{
          this._refreshNeeded.next()
        }))
  }

  getUserName() {
    return this.localStorage.retrieve('email');
  }
  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
  }

  getEmail() {
    return this.localStorage.retrieve('email');
  }

  refreshToken() {
    return this.httpClient.post<LoginResponse>(this.url+'/api/auth/refresh/token',
      this.refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');
        this.localStorage.store('authenticationToken',
          response.authenticationToken);
        this.localStorage.store('expiresAt', response.expiresAt);
      }));
  }

  logout() {
    this.httpClient.post(this.url+'/api/auth/logout', this.refreshTokenPayload,
      { responseType: 'text' })
      .pipe(
        tap(()=>{
          this._refreshNeeded.next()
        }))
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('username');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
    this.localStorage.clear('userId');
  }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }
}
