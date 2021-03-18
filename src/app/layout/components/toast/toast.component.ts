import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {ToastComponent} from '@syncfusion/ej2-angular-notifications'

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastAdafriComponent implements OnInit {
  @ViewChild('element', { static: false }) toast: ToastComponent;
  @Input() title: string = "";
  @Input() content: string = "";
  @Input() cssClass: string = "";
  @Input() playSong: string = ""

    public position = { X: 'Right', Y: 'Bottom' };
    public toasts = [
      { title: this.title, content: this.content, cssClass: this.cssClass } ];
    public toastFlag: number = 0;

    onCreate() {
      this.toast.show(this.toasts[this.toastFlag]);
      ++this.toastFlag;
    }
   /*  btnClick() {
      this.toastShow();
    } */
  onBeforeOpen() {
    if (this.playSong === "ok") {
      let audio: HTMLAudioElement = new Audio('https://drive.google.com/uc?export=download&id=1M95VOpto1cQ4FQHzNBaLf0WFQglrtWi7');
     audio.play();
       
     }
    }
  toastShow() {
      
          setTimeout(
            () => {
              /* this.element.title = this.title
              this.element.content = this.content
              this.element.cssClass = this.cssClass
              this.element.timeOut = 
    
              this.element.show() */
            /* this.element.show(this.toasts[this.toastFlag]);
            ++this.toastFlag;
              if (this.toastFlag === (this.toasts.length)) {
                this.toastFlag = 0;
               } */
        }, 500);
    }
  constructor() { }

  ngOnInit() {
    
    
  }

}
