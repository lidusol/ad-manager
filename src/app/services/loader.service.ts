import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class LoaderService {
  isLoading = new Subject<boolean>();
  messageSubject = new Subject<string>();
  message: string = ""
  show() {
    this.messageSubject.next(this.message)
      this.isLoading.next(true);
      
    }
  hide() {
    this.isLoading.next(false);
    
  }

  setMessage(message: string) {
  /*   console.log(this.message)
    this.message = message
    this.messageSubject.next(message) */
  }
  cleanMessage() {
    this.messageSubject.next("")
  }

  getMessage(): Observable<any> {
        return this.messageSubject.asObservable();
    }
  constructor() { }
}
