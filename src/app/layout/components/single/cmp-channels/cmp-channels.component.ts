import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'adf-cmp-channels',
  templateUrl: './cmp-channels.component.html',
  styleUrls: ['./cmp-channels.component.scss']
})
export class CmpChannelsComponent implements OnInit {
  @ViewChild('channelsExpansion', { static: false }) channelsExpansion: MatExpansionPanel
  expanded = true;
  selected = false;
  selectedBid: string = "CPM"


  componentSelected($event) {
    this.selected = !this.selected;
    event.stopPropagation();
  
  }

  buttonClick($event) {
    this.selected = !this.selected;
    event.stopPropagation();
  }

  togglePanel($event) {
    this.expanded = !this.expanded;
    //event.stopPropagation();
  }

  expandPanel(event): void {
    event.stopPropagation(); // Preventing event bubbling

    if (this.expanded) {
      this.channelsExpansion.open(); // Here's the magic
    }else{
      this.channelsExpansion.close()
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
