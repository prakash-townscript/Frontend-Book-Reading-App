import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { BookModel } from '../shared/book-model';
import { BookService } from '../shared/book.service';


@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  [x: string]: any;

  readingBooks: Array<BookModel> = [];
  completedBooks: Array<BookModel> = [];
  data: Array<any> = [];
  userId!:number
  bookId!:number
 
 
  constructor(private bookService:BookService,private localstorage:LocalStorageService) { 
    this.userId = localstorage.retrieve('userId')
    this.getBookByUserId()
  }

  ngOnInit(): void { 
    this.bookService.refreshNeeded.subscribe(()=>{
      this.getBookByUserId()
    })
  }

  getBookByUserId(){
    this.readingBooks.length = 0
    this.completedBooks.length = 0
    this.bookService.getBookByUserId(this.userId)
      .subscribe(
        bookdata =>{
          this.data = bookdata
          for(let i=0;i<this.data.length;i++){
          var model = {
            bookId:this.data[i][0],
            name: this.data[i][1],
            description: this.data[i][2],
            pages: this.data[i][3],
            author: this.data[i][4],
            image: this.data[i][5],
          }
          if(this.data[i][6]=='reading'){
            this.readingBooks.push(model)
          }else{
            this.completedBooks.push(model)
          }
        }
          }, error => {
            console.log(error)
        }
    );
  }

  markAsComplete(id:number){
    this.bookService.updateUserReadingList(this.userId,id)
    .subscribe()
  }

  deleteFromReadingList(id:number){
    this.bookService.deleteFromReadingList(this.userId,id)
    .subscribe()
  }

}
