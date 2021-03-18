import { Component, OnInit, Input } from '@angular/core';
import { Search } from 'src/app/campaigns-management/models/search.models';

@Component({
  selector: 'adf-preview-created-search',
  templateUrl: './preview-created-search.component.html',
  styleUrls: ['./preview-created-search.component.scss']
})
export class PreviewCreatedSearchComponent implements OnInit {

  @Input() data: Search[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
