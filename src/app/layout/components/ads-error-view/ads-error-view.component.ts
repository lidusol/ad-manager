import { Component, Input, OnInit } from '@angular/core';
import { adDispalyError } from 'src/app/utils/data';

@Component({
  selector: 'adf-ads-error-view',
  templateUrl: './ads-error-view.component.html',
  styleUrls: ['./ads-error-view.component.scss']
})
export class AdsErrorViewComponent implements OnInit {
  @Input() error: adDispalyError;
  constructor() { }

  ngOnInit(): void {
  }

}
