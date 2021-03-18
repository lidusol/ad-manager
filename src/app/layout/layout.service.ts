import { HttpClient } from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import { SERVER } from 'src/environments/environment';


@Injectable()
export class LayoutService {

  public appDrawer: any;
  public currentUrl = new BehaviorSubject<string>(undefined);

  constructor(private router: Router, private http: HttpClient) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  public closeNav() {
    setTimeout(() => {
      this.appDrawer.close();
      
    }, 500);
  }

  public openNav() {
    setTimeout(() => {
      
      this.appDrawer.open();
    }, 500);
  }

  getIPAddress()  
  {  
    return this.http.get("https://api.ipify.org/?format=json").subscribe(res=>{
      //console.log(res)
    }, err=>{
      //console.log(err)
    });  
  }  

  sendMail(from_email_prefix: string, recipient_email: string, subject_email: string, html: string){
    this.http.post<{status: number, message: string}>(SERVER.url+'/sendMail', {
      from_email_prefix: from_email_prefix,
      recipient_email: recipient_email,
      subject_email: subject_email,
      html: html,
    }).subscribe(res=>{
      console.log(res.status)
      console.log(res.message)
    }, err=>{
      console.log(err)
    });  
  }
}
