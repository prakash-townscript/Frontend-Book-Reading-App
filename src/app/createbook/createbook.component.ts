import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../shared/book.service';
import { BookRequestPayload } from './book-request.payload';

@Component({
  selector: 'app-createbook',
  templateUrl: './createbook.component.html',
  styleUrls: ['./createbook.component.css']
})
export class CreatebookComponent implements OnInit {

  bookForm!: FormGroup;
  bookRequestPayload!: BookRequestPayload;
  showErrorMessage : Boolean | undefined
  showSuccessMessage  : Boolean | undefined
  formstatus!:boolean


  constructor(private bookservice:BookService) { 
    this.bookRequestPayload = {
      name: '',
      description: '',
      author: '',
      image: '',
      pages: 0
    };
  }

  ngOnInit(): void {
    this.bookForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      pages: new FormControl('', [Validators.pattern("^[0-9]*$"),Validators.minLength(2),Validators.required])
    });
  }

  createBook(){
    if(this.bookForm.invalid){
      this.formstatus = true;
      this.showSuccessMessage = false
      this.showErrorMessage = false
    }else{
      this.bookRequestPayload.name = this.bookForm.get('name')?.value;
      this.bookRequestPayload.description = this.bookForm.get('description')?.value;
      this.bookRequestPayload.author = this.bookForm.get('author')?.value;
      this.bookRequestPayload.image = this.bookForm.get('image')?.value;
      this.bookRequestPayload.pages = this.bookForm.get('pages')?.value;
      this.bookservice.createBook(this.bookRequestPayload)
      .subscribe(data => {
        this.showSuccessMessage = true
        this.formstatus = false;
        this.showErrorMessage = false
      }, error => {
        this.showErrorMessage = true
        this.showSuccessMessage = false
        this.formstatus = false
      });
    }
    
  }
  }
