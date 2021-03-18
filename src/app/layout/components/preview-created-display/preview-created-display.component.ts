import { Component, OnInit, Input } from '@angular/core';
import { Display } from 'src/app/campaigns-management/models/display.models';

@Component({
  selector: 'adf-preview-created-display',
  templateUrl: './preview-created-display.component.html',
  styleUrls: ['./preview-created-display.component.scss']
})
export class PreviewCreatedDisplayComponent implements OnInit {
  @Input() data: Display[] = [];
  constructor() { }
  
  ngOnInit(): void {
  }

}
