import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, Subject } from 'rxjs';
import { ReviewRequestPayload } from '../bookdetail/review-payload';
import { BookRequestPayload } from '../createbook/book-request.payload';
import { ReadingListPayload } from './ReadingListPayload';
import { BookModel } from './book-model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  param = { 
    email: this.localStorage.retrieve('email')
  }

  private _refreshNeeded = new Subject<void>();

  get refreshNeeded(){
    return this._refreshNeeded
  }

  booksSubject: Subject<BookModel>;  
  readingBooksSubject: Subject<BookModel>;  
  compltedBooksSubject: Subject<BookModel>;  
  books: Array<BookModel>;  
  readingBooks: Array<BookModel>;  
  completedBooks: Array<BookModel>;  


  url:String = "http://bookservice-env.eba-pppjn4py.us-east-2.elasticbeanstalk.com";
  //url:String = "http://localhost:8080";

   
  constructor(private http:HttpClient,private localStorage: LocalStorageService ) { 
    this.readingBooksSubject = new Subject<BookModel>()
    this.compltedBooksSubject = new Subject<BookModel>()
    this.booksSubject = new Subject<BookModel>()
    this.books = new Array<BookModel>()
    this.completedBooks = new Array<BookModel>()
    this.readingBooks = new Array<BookModel>()
  }


  getAllBook():Observable<Array<BookModel>>{
    return this.http.get<Array<BookModel>>(this.url+'/api/book')
  }

  createBook(bookRequestPayload:BookRequestPayload):Observable<any>{
    return this.http.post(this.url+'/api/book',bookRequestPayload,
    {responseType:'text'}
    );
  }

  createReview(reviewRequestPayLoad:ReviewRequestPayload):Observable<any>{
    return this.http.post(this.url+'/api/book/review',reviewRequestPayLoad,
    {responseType:'text'}
    ).pipe(
      tap(()=>{
        this._refreshNeeded.next()
      }))
  }

  addToReadingList(readingListPayload:ReadingListPayload):Observable<any>{
    return this.http.post(this.url+'/api/readinglist/add',readingListPayload,
    {responseType:'text'})
    .pipe(
      tap(()=>{
        this._refreshNeeded.next()
      }))
  }
  
  getBookByID(id:number):Observable<any>{
    let urllink = this.url+`/api/book/${id}`;
    return this.http.get(urllink);
  }

  getReviewById(id:number):Observable<any>{
    let params = new HttpParams();
    params = params.append('id', id);
    let urllink = this.url+`/api/book/review`;
    return this.http.get(urllink,{params: params})
  }

  getBookByUserId(id:number):Observable<any>{
    let params = new HttpParams();
    params = params.append('id', id);
    let urllink = this.url+`/api/book/library`;
    return this.http.get(urllink,{params: params})
  }

  getBookByNotInUserId(id:number):Observable<any>{
    let params = new HttpParams();
    params = params.append('id', id);
    let urllink = this.url+`/api/book/filter`;
    return this.http.get(urllink,{params: params})
  }

  updateUserReadingList(userId:number,bookId:number){
    let params = new HttpParams()
    .set('userId', userId+'')
    .set('bookId', bookId+'');
    console.log(params.toString()); 
     let urllink = this.url+`/api/readinglist`;
     return this.http.put(urllink,null,{ params: params })
     .pipe(
      tap(()=>{
        this._refreshNeeded.next()
      }))
  }

  deleteFromReadingList(userId:number,bookId:number){
    let params = new HttpParams()
    .set('userId', userId+'')
    .set('bookId', bookId+'');
     let urllink = this.url+`/api/readinglist`;
     return this.http.delete(urllink,{ params: params })
     .pipe(
      tap(()=>{
        this._refreshNeeded.next()
      }))
  }
}
