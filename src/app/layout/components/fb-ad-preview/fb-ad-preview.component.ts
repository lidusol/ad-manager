import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'adf-fb-ad-preview',
  templateUrl: './fb-ad-preview.component.html',
  styleUrls: ['./fb-ad-preview.component.scss']
})
export class FbAdPreviewComponent implements OnInit {
  @Input() adImage: any
  @Input() headline: string
  @Input() placement: any

  constructor() { }

  ngOnInit(): void { }
}