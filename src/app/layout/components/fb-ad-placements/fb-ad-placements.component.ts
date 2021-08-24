import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {  PLACEMENTS, AD_PLACEMENTS } from 'src/app/utils/data';


@Component({
  selector: 'adf-fb-ad-placements',
  templateUrl: './fb-ad-placements.component.html',
  styleUrls: ['./fb-ad-placements.component.scss']
})
export class FbAdPlacementsComponent implements OnInit {
  ad_placements: PLACEMENTS[] = AD_PLACEMENTS;
  fbChecked: boolean = false;
  igChecked: boolean = false;
  facebookTag: string = 'fb';
  instagramTag: string = 'ig';

  ngOnInit(): void {
  }

  constructor() { }
  
  selectAllByTag(tag: string, checked: boolean){
    this.ad_placements.filter(placement => {
      return placement.options.map(option => {
          if(option.tag === tag){
            option.checked = checked; 
          } 
          return placement;
      });
    });
  }

  selectTag(tagChecked){
    return this.ad_placements.filter(placement => placement.checked).length > 0 && !tagChecked;
  }

  oneChecked(placement){
    return placement.options.filter(option => option.checked).length > 0 && !placement.checked;
  }

  selectPlacement(placement) {
    placement.options.forEach((option: any) => option.checked = placement.checked);
  }

  selectOptions(placement) {
    placement.checked = placement.options.every((option: any) => option.checked == true);
  }

  expandCollapse(obj) {
    obj.isClosed = !obj.isClosed;
  }
}
