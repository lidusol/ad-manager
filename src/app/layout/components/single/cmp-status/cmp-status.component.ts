import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'adf-cmp-status',
  templateUrl: './cmp-status.component.html',
  styleUrls: ['./cmp-status.component.scss']
})
export class CmpStatusComponent implements OnInit {

   public componentReady: boolean = true
 expanded = false;
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
      this.statusExpansion.open(); // Here's the magic
    }else{
      this.statusExpansion.close()
    }
  }
  public STATUS_CAMPAIGN: string = "ENABLED"
  public selectExpansionDisabled = true
  @ViewChild('statusExpansion', { static: false }) statusExpansion: MatExpansionPanel
   @ViewChild('select', {static: false}) select: MatSelect
  constructor() { }

  ngOnInit(): void {
  }

  /* selectOptionClick() {
    this.selectExpansionDisabled = false
    this.statusExpansion.close()
    
  } */
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.select.valueChange.subscribe(value => {
      if(this.statusExpansion!==undefined && this.statusExpansion!==null){
        this.statusExpansion.close()

      }
      
    })
  
  }

}
