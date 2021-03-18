import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'adf-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  displayNotif: boolean = true
  constructor(public translate: TranslateService,) {
    translate.addLangs(['en', 'fr']);
	translate.setDefaultLang('en');
	translate.use('en');
   }
  toggleNotifBlock(){
    this.displayNotif = !this.displayNotif
  }
  ngOnInit(): void {
  }

}
