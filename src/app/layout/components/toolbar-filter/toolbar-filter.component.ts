import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'adf-toolbar-filter',
  templateUrl: './toolbar-filter.component.html',
  styleUrls: ['./toolbar-filter.component.scss']
})
export class ToolbarFilterComponent implements OnInit {
  @Input() navigationLink: string = ''
  constructor() { }

  ngOnInit(): void {
  }

}
