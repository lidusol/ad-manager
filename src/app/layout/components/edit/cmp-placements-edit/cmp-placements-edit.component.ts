import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { FormValidators, urlValidator, urlDomainValidator, urlSchemeValidator } from 'src/app/utils/form-validators';
import { MatRadioGroup, MatRadioChange } from '@angular/material/radio';
import { PLACEMENT_TYPE, User_Role } from 'src/app/utils/data';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Display } from 'src/app/campaigns-management/models/display.models';
import { GridComponent, GridLine, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import {take} from 'rxjs/operators'

@Component({
  selector: 'adf-cmp-placements-edit',
  templateUrl: './cmp-placements-edit.component.html',
  styleUrls: ['./cmp-placements-edit.component.scss']
})
export class CmpPlacementsEditComponent implements OnInit {

   aacid: string = ""
  cid: string = undefined
  uid: string = undefined;
  campaignId: number = 0
  ad_group_id: number = 0
  idA: string = ""
  adf_account_id: string = ""
  uid_action: string= ""
  user_access: User_Role;
  currentLandingPage: string = ""
  public gridLines: GridLine;
   @ViewChild('placementExpansion', { static: false }) placementExpansion: MatExpansionPanel
  @ViewChild('placementOptions', { static: false }) placementOptions: MatRadioGroup;
  @ViewChild('gridPlacements', { static: false }) gridPlacements: GridComponent;
  expanded = true;
  selected = false;
  selectedBid: string = "CPM"
  PLACEMENTS: PLACEMENT_TYPE[] = []
  placementOptionSelected: string = ""
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
      this.addSkill()
      this.componentReady = false
    }
  }
  constructor(private displayService: DisplayService, private router: Router, private route: ActivatedRoute, private storageService: LocalStorageService) { }

 ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
        this.storageService.getUserIdAndAccountId().then(response => {
          if (response !== null) {
            this.aacid = response.aacid
            this.user_access  = response.role
            if (response.fromOwned) {
                this.uid_action = response.auid
               
              
              this.cid = params['cid'];
                   this.uid = response.auid
                    
              this.getCampaignData()
              this.addSkill()
              
            
                
            } else {
              
              this.uid_action = response.account.owner
       
              
              this.cid = params['cid'];
                 this.uid = response.auid;
                
              this.getCampaignData()
              this.addSkill()
              
           
                
              }
           
            
          
          }
          })
    
    })
 }
  currentTargetedPlacement: PLACEMENT_TYPE[] = []
  getCampaignData() {
   
     this.displayService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
            this.campaignId = campaign.id_campagne
            this.idA = campaign.ad_group_id_firebase
            this.ad_group_id = campaign.ad_group_id
            if (this.campaignId === 0) {
              if (campaign.targetedPlacements.length > 0) {
                this.skills.setValue([])
                this.skills.reset()
                this.placementOptionSelected = "custom"
                for (let placement of campaign.targetedPlacements) {
                  this.skills.push(new FormControl(placement.url, [Validators.required, urlValidator, urlDomainValidator, urlSchemeValidator]));
                  
                }
              } else {
                this.placementOptionSelected = "none"
              }
              
            } else {
              this.displayService.getAdGroup(this.idA).valueChanges().pipe(take(1)).subscribe(adgroup => {
                //console.log(adgroup)
                this.currentTargetedPlacement = adgroup.targetedPlacements
                if (this.currentTargetedPlacement.length > 0) {
                  this.placementOptionSelected = "custom"
                  
                } else {
                  this.placementOptionSelected = "none"
                }
               
              })

            }
           
             
            }
          })
  }

  public spinnerUpdate: boolean = false
  updatePlacement() {
    this.spinnerUpdate = true
    if (this.campaignId === 0) {
      if (this.placementOptionSelected === 'none') {
        this.displayService.updateCampaign(this.cid, { targetedPlacements: [] }).then(update => {
            if (update === "ok") {
              this.spinnerUpdate = false
              this.togglePanel(event)
              this.getCampaignData()
            } else {
              this.spinnerUpdate = false
            }
          })
      } else {
         this.getUrls().then(res => {
        if (res === "ok") {
            this.displayService.updateCampaign(this.cid, { targetedPlacements: this.PLACEMENTS }).then(update => {
            if (update === "ok") {
              this.spinnerUpdate = false
              this.togglePanel(event)
              this.skills.setValue([])
              this.skills.reset()
              this.getCampaignData()
            } else {
              this.spinnerUpdate = false
            }
          })
            
          
        } else {
          this.spinnerUpdate = false
        }
      }).catch((e) => {
        this.spinnerUpdate = false
      })
      }
    } else {
       if (this.placementOptionSelected === 'none') {
      if (this.currentTargetedPlacement.length > 0) {
        this.displayService.removeTargetedPlacement(this.currentTargetedPlacement, this.cid, this.campaignId, this.idA, this.ad_group_id).then(remove => {
          if (remove === "ok") {
            this.spinnerUpdate = false

            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
            }
        }).catch((e) => {
            this.spinnerUpdate = false
          })
      } else {
        this.spinnerUpdate = false
        }
    } else {
      this.getUrls().then(res => {
        if (res === "ok") {
          this.displayService.targetNewPlacement(this.PLACEMENTS, this.cid, this.campaignId, this.idA, this.ad_group_id).then(targeting_placement => {
            if (targeting_placement === "ok") {
                
              this.spinnerUpdate = false
            
              for (let i = 0; i < this.skills.length; i++){
                this.skills.removeAt(i)
              }
              this.getCampaignData()
              this.addSkill()
                }
            })
        } else {
          this.spinnerUpdate = false
        }
      }).catch((e) => {
        this.spinnerUpdate = false
      })
      
    }
    }
   
 
  }
  removePlacementTargetedFromGrid(placement: PLACEMENT_TYPE) {
    this.gridPlacements.showSpinner()
        this.displayService.removeTargetedPlacement([placement], this.cid, this.campaignId, this.idA, this.ad_group_id).then(remove => {
          if (remove === "ok") {
            this.spinnerUpdate = false
            this.getCampaignData()
            this.gridPlacements.hideSpinner()
          } else {
            this.spinnerUpdate = false
            this.gridPlacements.hideSpinner()
            }
        }).catch((e) => {
          this.spinnerUpdate = false
          this.gridPlacements.hideSpinner()
          })
  }

  selectedPlacement(args: RowSelectEventArgs) {
    
  
  }

}
