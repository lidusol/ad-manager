import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { PLACEMENTS } from 'src/app/utils/data';

@Component({
  selector: 'adf-fb-ad-preview-selector',
  templateUrl: './fb-ad-preview-selector.component.html',
  styleUrls: ['./fb-ad-preview-selector.component.scss']
})
export class FbAdPreviewSelectorComponent implements OnInit {
  @Input() dataimage: any
  @Input() primaryText: string
  @Input() placements: PLACEMENTS[]
  selectedPlacement: PLACEMENTS = null
  count: number = 0
  headline:string = ""
  minLength: number = 35
  maxLength: number = 70
  
 
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.placements){
      this.count = 0;
      changes.placements.currentValue.forEach(placement => placement.options.forEach(option => this.count += 1));
      this.customizeHeadline(this.primaryText)
    }else if(changes.primaryText){
      this.customizeHeadline(changes.primaryText.currentValue)
    }
  }

  ngOnInit(): void {
    this.selectedPlacement = this.placements[0].options[0];
  }

  ngAfterViewInit(){
    document.getElementById(this.selectedPlacement.name).children[0].children[0].children[0].classList.add('active');
  }

  selectPlacement(placement: PLACEMENTS){
    if(this.selectedPlacement !== null && this.selectedPlacement.name === placement.name){
      return;
      
    }else {
      if(this.selectedPlacement !== null) {
        document.getElementById(this.selectedPlacement.name).children[0].children[0].children[0].classList.remove('active');
      } 
    }
    document.getElementById(placement.name).children[0].children[0].children[0].classList.add('active');
    this.selectedPlacement = placement;
  }

  customizeHeadline(headline){
    let length = headline.length;
    let lineBreaks = headline.match(/\n/g)||[];
    let numberOfLineBreaks = lineBreaks.length;
    
    if((length > this.maxLength || numberOfLineBreaks > 2) && length !== numberOfLineBreaks){
      let visibleHeadline = "";
      if(numberOfLineBreaks < 2){
        visibleHeadline = headline.slice(0, this.maxLength);
      }else {
        let index = headline.trim().split(lineBreaks[0], 2).join(lineBreaks[0]).length;
        visibleHeadline = headline.slice(0, index);
      }
      this.headline = visibleHeadline.concat('    ...see more');
    }else if(length > this.minLength && numberOfLineBreaks < 2){
      let visibleHeadline = headline.slice(0, this.minLength).concat("\n").concat(headline.slice(this.minLength,)).concat('    ...see more');
      this.headline = visibleHeadline
    }else if((length === numberOfLineBreaks) && numberOfLineBreaks !== 0){
      this.headline = "";
    }else {
      this.headline = headline;
    }
  }
}