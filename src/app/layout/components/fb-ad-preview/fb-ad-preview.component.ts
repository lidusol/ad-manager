import { Component, OnInit, Input } from '@angular/core';
import { head } from 'lodash';

@Component({
  selector: 'adf-fb-ad-preview',
  templateUrl: './fb-ad-preview.component.html',
  styleUrls: ['./fb-ad-preview.component.scss']
})
export class FbAdPreviewComponent implements OnInit {
  @Input() adImage: any
  @Input() headline: string

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

}
