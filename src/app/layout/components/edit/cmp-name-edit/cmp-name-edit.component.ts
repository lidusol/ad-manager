import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { AngularFirestore } from '@angular/fire/firestore';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User_Role } from 'src/app/utils/data';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import {take} from 'rxjs/operators'
import { SearchService } from 'src/app/campaigns-management/services/search.service';

@Component({
  selector: 'adf-cmp-name-edit',
  templateUrl: './cmp-name-edit.component.html',
  styleUrls: ['./cmp-name-edit.component.scss']
})
export class CmpNameEditComponent implements OnInit {

    public componentReady: boolean = true
  expanded = true;
  selected = false;
  selectedBid: string = "CPM"
  aacid: string = ""
  cid: string = undefined
  uid: string = undefined;
  campaignId: number = 0
  ad_group_id: number = 0
  idA: string = ""
  adf_account_id: string = ""
  uid_action: string= ""
  user_access: User_Role;
  campaignType: string = ""
  NAME: string = ""
  currentName: string = ""


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
      this.nameExpansion.open(); // Here's the magic
    }else{
      this.nameExpansion.close()
    }
  }
  input_name_status: string = "" 
  public name: string = "display-1"
  public nameControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)])
  @ViewChild('nameExpansion', {static: false}) nameExpansion: MatExpansionPanel
  constructor(private afs: AngularFirestore, private displayService: DisplayService, private searchService: SearchService, private youtubeService: YoutubeService, private router: Router, private route: ActivatedRoute, private storageService: LocalStorageService) { }

  ngOnInit(): void {
        
    this.route.queryParams.subscribe(params => {
        this.storageService.getUserIdAndAccountId().then(response => {
          if (response !== null) {
            this.user_access = response.role
            this.aacid = response.aacid
            if (response.fromOwned) {
                this.uid_action = response.auid
               
              
              this.cid = params['cid'];
                   this.uid = response.auid
                   this.getCampaignData()
              
            
                
            } else {
              
              this.uid_action = response.account.owner
       
              
              this.cid = params['cid'];
                 this.uid = response.auid;
                 this.getCampaignData()
              
           
                
              }
           
            
          
          }
          })
    
    })
  
  }



  ngAfterViewInit(): void {
    this.nameControl.valueChanges.subscribe(value => {
      this.verifyCampaignName(this.nameControl.value)
    })
   
    
  }
  public nameExist: boolean = false
  public nameNotChange: boolean = true
  verifyCampaignName(name: string) {
    if (window.location.pathname === "/campaigns/settings/display") {
      if (name !== this.currentName) {
      this.nameNotChange = false
      this.displayService.getCampaignName(this.uid_action, name).pipe(take(1)).subscribe(campaign => {
        if (campaign.length > 0) {
          this.NAME = ""
          this.nameExist = true
          if (!document.getElementsByClassName('name-field')[0].classList.contains('mat-form-field-invalid')) {
            document.getElementsByClassName('name-field')[0].classList.add('mat-form-field-invalid')
            
          }
        } else {
          this.NAME = name
          this.nameExist = false
          if (document.getElementsByClassName('name-field')[0].classList.contains('mat-form-field-invalid')) {
            document.getElementsByClassName('name-field')[0].classList.remove('mat-form-field-invalid')
            
          }
          this.checkIfComponentReady()
          }
    
        })
      
    } else {
      this.nameNotChange=true
    }
    } else if (window.location.pathname === "/campaigns/settings/native") {
      if (name !== this.currentName) {
      this.nameNotChange = false
      this.youtubeService.getCampaignName(this.uid_action, name).pipe(take(1)).subscribe(campaign => {
        if (campaign.length > 0) {
          this.NAME = ""
          this.nameExist = true
          if (!document.getElementsByClassName('name-field')[0].classList.contains('mat-form-field-invalid')) {
            document.getElementsByClassName('name-field')[0].classList.add('mat-form-field-invalid')
            
          }
        } else {
          this.NAME = name
          this.nameExist = false
          if (document.getElementsByClassName('name-field')[0].classList.contains('mat-form-field-invalid')) {
            document.getElementsByClassName('name-field')[0].classList.remove('mat-form-field-invalid')
            
          }
          this.checkIfComponentReady()
          }
    
        })
      
    } else {
      this.nameNotChange=true
    }
    }else if (window.location.pathname === "/campaigns/settings/search") {
      if (name !== this.currentName) {
      this.nameNotChange = false
      this.searchService.getCampaignName(this.uid_action, name).pipe(take(1)).subscribe(campaign => {
        if (campaign.length > 0) {
          this.NAME = ""
          this.nameExist = true
          if (!document.getElementsByClassName('name-field')[0].classList.contains('mat-form-field-invalid')) {
            document.getElementsByClassName('name-field')[0].classList.add('mat-form-field-invalid')
            
          }
        } else {
          this.NAME = name
          this.nameExist = false
          if (document.getElementsByClassName('name-field')[0].classList.contains('mat-form-field-invalid')) {
            document.getElementsByClassName('name-field')[0].classList.remove('mat-form-field-invalid')
            
          }
          this.checkIfComponentReady()
          }
    
        })
      
    } else {
      this.nameNotChange=true
    }
    }
    
    
  }

  checkIfComponentReady() {
    if (this.nameControl.valid) {
      this.componentReady = true
    } else {
      this.componentReady = false
    }
  }

  /* if (window.location.pathname === '/campaigns/settings/display') {
     this.displayService.getCampaign(this.cid).valueChanges().subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
           
            }
          })
    } else if (window.location.pathname === '/campaigns/settings/youtube') {
      this.displayService.getCampaign(this.cid).valueChanges().subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
           
            }
          })
    } else {
      this.router.navigate(['/campaigns'])
   } */

  getCampaignData() {
    if (window.location.pathname === '/campaigns/settings/display') {
     this.displayService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
           this.currentName = campaign.name 
            this.campaignId = campaign.id_campagne
            this.campaignType = campaign.type
             this.nameControl.setValue(this.currentName)
            }
          })
    } else if (window.location.pathname === '/campaigns/settings/native') {
      this.youtubeService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
           this.currentName = campaign.name 
            this.campaignId = campaign.id_campagne
            this.campaignType = campaign.type
             this.nameControl.setValue(this.currentName)
            }
          })
    } else if (window.location.pathname === '/campaigns/settings/search') {
      this.searchService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
           this.currentName = campaign.name 
            this.campaignId = campaign.id_campagne
            this.campaignType = campaign.type
             this.nameControl.setValue(this.currentName)
            }
          })
    } else {
      this.router.navigate(['/campaigns'])
   }
    
  }

  public spinnerUpdate: boolean = false
  updateName() {
    if (window.location.pathname === '/campaigns/settings/display') { 
       if (!this.nameNotChange) {
      if (this.campaignId === 0) {
        this.spinnerUpdate = true
        this.displayService.updateCampaign(this.cid, { name: this.nameControl.value }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
        
      } else {
        this.spinnerUpdate = true
        this.displayService.updateCampaignName(this.cid, this.nameControl.value, this.aacid, this.campaignId, this.campaignType).then(update => {
          if (update === "ok") {
             this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
      }
        
      }
    } else if (window.location.pathname === '/campaigns/settings/native') {
      
       if (!this.nameNotChange) {
      if (this.campaignId === 0) {
        this.spinnerUpdate = true
        this.youtubeService.updateCampaign(this.cid, { name: this.nameControl.value }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
        
      } else {
        this.spinnerUpdate = true
        this.youtubeService.updateCampaignName(this.cid, this.nameControl.value, this.aacid, this.campaignId, this.campaignType).then(update => {
          if (update === "ok") {
             this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
      }
        
      }
    }else if (window.location.pathname === '/campaigns/settings/search') {
      
      if (!this.nameNotChange) {
     if (this.campaignId === 0) {
       this.spinnerUpdate = true
       this.searchService.updateCampaign(this.cid, { name: this.nameControl.value }).then(update => {
         if (update === "ok") {
           this.spinnerUpdate = false
           this.togglePanel(event)
           this.getCampaignData()
         } else {
           this.spinnerUpdate = false
         }
       })
       
     } else {
       this.spinnerUpdate = true
       this.searchService.updateCampaignName(this.cid, this.nameControl.value, this.aacid, this.campaignId, this.campaignType).then(update => {
         if (update === "ok") {
            this.spinnerUpdate = false
           this.togglePanel(event)
           this.getCampaignData()
         } else {
           this.spinnerUpdate = false
         }
       })
     }
       
     }
   }
   
  }
}
