import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { FormValidators, urlValidator, urlDomainValidator, urlSchemeValidator } from 'src/app/utils/form-validators';
import { MatRadioGroup, MatRadioChange } from '@angular/material/radio';
import { PLACEMENT_TYPE } from 'src/app/utils/data';

@Component({
  selector: 'adf-cmp-placement-target',
  templateUrl: './cmp-placement-target.component.html',
  styleUrls: ['./cmp-placement-target.component.scss']
})
export class CmpPlacementTargetComponent implements OnInit {
  @ViewChild('placementExpansion', { static: false }) placementExpansion: MatExpansionPanel
  @ViewChild('placementOptions', { static: false }) placementOptions: MatRadioGroup;
  expanded = true;
  selected = false;
  selectedBid: string = "CPM"
  PLACEMENTS: PLACEMENT_TYPE[] = []
  placementOptionSelected: string = "custom"
  public componentReady: boolean = true


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
      this.placementExpansion.open(); // Here's the magic
    }else{
      this.placementExpansion.close()
    }
  }
  constructor() { }


  ngOnInit(): void {
    this.addSkill()
  }

  skills = new FormArray([]);

  formOvered(i: number) {
    if (this.skills.length!==1) {
      document.getElementById(i.toFixed()).classList.remove('d-none')
      
    }
  }
    formLeaved(i: number) {
      document.getElementById(i.toFixed()).classList.add('d-none')
  }
  removeSkill(index: number) {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
       
     }
  }

  
  getUrls(): Promise<string> {
    return new Promise(resolve => {
      if (this.placementOptionSelected === "none") {
        this.componentReady = true
        resolve('ok')
      } else {
        let promise = (status: string) => {
          resolve(status)
        }
        if (this.skills.length > 0) {
          if (this.skills.valid) {
  
            this.PLACEMENTS = []
            for (let i = 0; i < this.skills.length; i++ ) {
              let form = this.skills.controls[i] as FormControl
              //console.log(form)
              this.PLACEMENTS.push({
                  url: form.value,
                  criterionId: 0,
                  criterionType: ''
                })
              //console.log(this.PLACEMENTS)
              if (this.skills.length === this.PLACEMENTS.length) {
                this.componentReady = true
                promise('ok')
              }
              
            }
            
          } else {
            this.componentReady = false
            promise('error')
          }
          
        } else {
          this.componentReady = true
          promise('ok')
        }
        
      }
        
      })
  }

  addSkill() {
    this.skills.push(new FormControl('https://', [Validators.required, urlValidator, urlDomainValidator, urlSchemeValidator]));
  }

  register(args: MatRadioChange) {
    if (args.value === 'none') {
      this.componentReady = true
    } else {
      this.componentReady = false
    }
  }

}
