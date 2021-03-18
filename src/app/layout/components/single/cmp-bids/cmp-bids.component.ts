import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { bids } from 'src/app/utils/data';
import { MatSelectChange} from '@angular/material/select'
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'adf-cmp-bids',
  templateUrl: './cmp-bids.component.html',
  styleUrls: ['./cmp-bids.component.scss']
})
export class CmpBidsComponent implements OnInit {

  @ViewChild('demographicExpansion', { static: false }) demographicExpansion: MatExpansionPanel
  BIDS = bids()
  expanded = true;
  selected = false;
  selectedBid: string = "CPM"
  public DEFAULT_BID: number = 0.1
  CPM_CPC_Control: FormControl = new FormControl(0.1, [Validators.required, Validators.min(0.1), Validators.max(10)])
  CPA_Control: FormControl = new FormControl(5.28, [Validators.required, Validators.min(5.28), Validators.max(50)])
  @Output() bidChanging: EventEmitter<string> = new EventEmitter<string>()
  @Output() bidValueChanging: EventEmitter<number> = new EventEmitter<number>()

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
      this.demographicExpansion.open(); // Here's the magic
    }else{
      this.demographicExpansion.close()
    }
  }

  constructor() { }
  selectDisabled: boolean = false
  setBidStrategy(strategy: string, disabled?: boolean){
    this.selectedBid = strategy
    if(disabled){
      this.selectDisabled = disabled
    }
  }
  
  ngOnInit(): void {
   if(window.location.pathname==='/campaigns/new/search/create'){
     this.selectedBid = "MC"
     this.selectDisabled = true
   } 
  }

  bidChange(args: string) {
    this.bidChanging.emit(args)
  }
  bidValueChange(args: number) {
    this.bidValueChanging.emit(args)
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
    this.CPM_CPC_Control.valueChanges.subscribe(value=>{
      if(this.CPM_CPC_Control.valid){
        this.bidValueChange(value)

      }
    })
    this.CPA_Control.valueChanges.subscribe(value=>{
      if(this.CPA_Control.valid){
        this.bidValueChange(value)

      }
    })
    setTimeout(()=>{
      this.bidChanging.emit(this.selectedBid)
    this.bidValueChanging.emit(0.1)
    },500)
    
  }

}
