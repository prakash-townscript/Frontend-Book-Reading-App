import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { BookModel } from '../shared/book-model';
import { BookService } from '../shared/book.service';
import { ReviewModel } from './review-model';
import { ReviewRequestPayload } from './review-payload';

@Component({
  selector: 'app-bookdetail',
  templateUrl: './bookdetail.component.html',
  styleUrls: ['./bookdetail.component.css']
})
export class BookdetailComponent implements OnInit {

  book : BookModel | undefined;
  reviewForm!: FormGroup;
  reviewBookPayLoad:ReviewRequestPayload
  data: Array<any> = [];
  review: Array<ReviewModel> = [];


  constructor(private route: ActivatedRoute,private bookService :BookService,
    private localStorage:LocalStorageService) { 
    this.getBookById();
    this.getReviewById();
    this.reviewBookPayLoad = {
     userId:this.localStorage.retrieve('userId'),
     bookId:Number(this.route.snapshot.paramMap.get('id')),
     review:''
    };
    
  }

  ngOnInit():void {
    this.reviewForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
    this.bookService.refreshNeeded.subscribe(()=>{
      this.getReviewById()
    })
  }

  //Fetching single book by Id
  getBookById(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBookByID(id)
      .subscribe(
        book1 =>{
          this.book = book1;
        }, error => {
          console.log(error)
        }
    );
  }

  addReview(){
    this.review.length = 0;
    this.reviewBookPayLoad.review = this.reviewForm.get('name')?.value;
    this.bookService.createReview(this.reviewBookPayLoad)
    .subscribe(data => {
    }, error => {
      console.log(error)
    });
  }

  getReviewById(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getReviewById(id)
      .subscribe(
        reviewsdata =>{
          this.data = reviewsdata
          for(let i=0;i<this.data.length;i++){
             var r = (this.data[i][0])+' '
             var e = (this.data[i][1])+' '
             var model = {
              review:r,
              email:e
           };
           this.review.push(model);
          }
          }, error => {
        }
    );
  }
}
