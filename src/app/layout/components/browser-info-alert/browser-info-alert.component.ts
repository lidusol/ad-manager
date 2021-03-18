import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'adf-browser-info-alert',
  templateUrl: './browser-info-alert.component.html',
  styleUrls: ['./browser-info-alert.component.scss']
})
export class BrowserInfoAlertComponent implements OnInit {

  constructor() { }
  @Input() showCard: boolean;
  ngOnInit(): void {
  }

  hidePopup() {
    this.showCard = false
  }

}
