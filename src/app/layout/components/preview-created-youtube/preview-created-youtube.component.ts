import { Component, OnInit, Input } from '@angular/core';
import { Display } from 'src/app/campaigns-management/models/youtube.models';

@Component({
  selector: 'adf-preview-created-youtube',
  templateUrl: './preview-created-youtube.component.html',
  styleUrls: ['./preview-created-youtube.component.scss']
})
export class PreviewCreatedYoutubeComponent implements OnInit {
 @Input() data: Display[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
