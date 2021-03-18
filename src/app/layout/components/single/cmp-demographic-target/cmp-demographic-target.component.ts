import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { ages, genders, AGES_TYPE, GENDERS_TYPE } from 'src/app/utils/data';

@Component({
  selector: 'adf-cmp-demographic-target',
  templateUrl: './cmp-demographic-target.component.html',
  styleUrls: ['./cmp-demographic-target.component.scss']
})
export class CmpDemographicTargetComponent implements OnInit {
    expanded = true;
  selected = false;
  @ViewChild('demographicExpansion', { static: false }) demographicExpansion: MatExpansionPanel
  @ViewChild('matSelectionListAges', { static: false }) matSelectionListAges: MatSelectionList;
  @ViewChild('matSelectionListGenders', { static: false }) matSelectionListGenders: MatSelectionList;
  ages = ages()
  genders = genders()
  AGES: AGES_TYPE[] = []
  GENDERS: GENDERS_TYPE[] = []

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

  ngOnInit(): void {
  }

  onAgeSelect(args: MatSelectionListChange) {
    if (args.option.selected) {
      this.AGES.push({
        text: args.option.value.name,
        ageRangeType: '',
        criterionId: args.option.value.id,
        citerionType: '',
        type: ''
      })
    } else {
      for (let i = 0; i < this.AGES.length; i++){
        if (this.AGES[i].criterionId === args.option.value.id) {
          this.AGES.splice(this.AGES.indexOf(this.AGES[i]), 1)
        }
      }
    }
  }
   onGenderSelect(args: MatSelectionListChange) {
        if (args.option.selected) {
           this.GENDERS.push({
            text: args.option.value.name,
            gendersRangeType: '',
            criterionId: args.option.value.id,
            citerionType: '',
            type: ''
      })
          
    } else {
      for (let i = 0; i < this.GENDERS.length; i++){
        if (this.GENDERS[i].criterionId === args.option.value.id) {
          this.GENDERS.splice(this.GENDERS.indexOf(this.GENDERS[i]), 1)
        }
      }
    }
   }
  ngAfterViewInit(): void {
    this.matSelectionListAges.selectAll()
    this.matSelectionListGenders.selectAll()
    for (let age of this.ages) {
      this.AGES.push({
        text: age.name,
        ageRangeType: '',
        criterionId: age.id,
        citerionType: '',
        type: ''
        })
    }
    for (let gender of this.genders) {
      this.GENDERS.push({
          text: gender.name,
        gendersRangeType: '',
        criterionId: gender.id,
        citerionType: '',
        type: ''
        })
    }

  }

}
