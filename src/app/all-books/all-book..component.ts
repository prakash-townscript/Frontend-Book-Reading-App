import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { BookModel } from '../shared/book-model';
import { BookService } from '../shared/book.service';
import { ReadingListPayload } from '../shared/ReadingListPayload';


@Component({
  selector: 'app-all-book',
  templateUrl: './all-book.component.html',
  styleUrls: ['./all-book.component.css']
})
export class AllBookComponent implements OnInit {

  readingListPayload:ReadingListPayload
  data: Array<any> = [];
  books: Array<BookModel> = [];
  book!:ReadingListPayload

  constructor(private bookService:BookService,
    private localstorage:LocalStorageService) {
    this.readingListPayload = {
      bookId: 0,
      userId:localstorage.retrieve('userId'),
      readingStatus:"reading"
    };
    this.getBookAvailableToUser()
   }
   
  ngOnInit(): void {
    this.bookService.refreshNeeded.subscribe(()=>{
      this.getBookAvailableToUser()
    })
  }

  getBookAvailableToUser(){
    this.books.length = 0;
    const id = this.localstorage.retrieve('userId')
    this.bookService.getBookByNotInUserId(id)
      .subscribe(
        bookdata =>{
          this.data = bookdata
          for(let i=0;i<this.data.length;i++){
          var model = {
            image: this.data[i][5],
            author: this.data[i][4],
            bookId:this.data[i][0],
            description: this.data[i][2],
            name: this.data[i][1],
            pages: this.data[i][3]
          }
          this.books.push(model)
        }
          }, error => {
            console.log(error)
        }
    );
  }

  markAsReading(id:number){
    this.readingListPayload.bookId = id;
    this.addToReadingList(this.readingListPayload);
  }

  addToReadingList(readingListPayload:ReadingListPayload){
    this.bookService.addToReadingList(readingListPayload).subscribe()
   }
}
