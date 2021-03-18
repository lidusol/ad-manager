import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'adf-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, AfterViewInit, OnDestroy {
  color = 'primary';
  mode = 'indeterminate';
  value = 25;
  isLoading: Subject<boolean> = new Subject<boolean>()
  messageObject: Subject<string> = new Subject<string>()
  message: string = ""
  subscription: Subscription;

  constructor(private loaderService: LoaderService) {
    this.subscription = this.loaderService.getMessage().subscribe(message => {
      if (message) {
        this.message = message
      }
    })
  this. isLoading = this.loaderService.isLoading;
  this.messageObject = this.loaderService.messageSubject;
  this.message = this.loaderService.message;
   }

  ngOnInit(): void {
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

if(!isChrome) {
    /* document.getElementById('infinityChrome').style.display = "none";
    document.getElementById('infinity').style.display = "block"; */
}
  }
  ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

  ngAfterViewInit() {
    /* setTimeout(() => {
      this.cd.detectChanges()
    },500) */
  }

}
