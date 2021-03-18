import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { urlSchemeValidator, urlDomainValidator, urlValidator } from 'src/app/utils/form-validators';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User_Role } from 'src/app/utils/data';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import {take} from 'rxjs/operators'
import { SearchService } from 'src/app/campaigns-management/services/search.service';

@Component({
  selector: 'adf-cmp-landing-page-edit',
  templateUrl: './cmp-landing-page-edit.component.html',
  styleUrls: ['./cmp-landing-page-edit.component.scss']
})
export class CmpLandingPageEditComponent implements OnInit {

 public componentReady: boolean = false
 expanded = true;
  selected = false;
  selectedBid: string = "CPM"
  URL_TO_PROMOTE: string = ""
    aacid: string = ""
  cid: string = undefined
  uid: string = undefined;
  campaignId: number = 0
  ad_group_id: number = 0
  idA: string = ""
  adf_account_id: string = ""
  uid_action: string= ""
  user_access: User_Role;
  currentLandingPage: string  =""


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
      this.urlExpansion.open(); // Here's the magic
    }else{
      this.urlExpansion.close()
    }
  }
  public urlControl = new FormControl('', [Validators.required, urlValidator, urlDomainValidator, urlSchemeValidator])
  @ViewChild('urlExpansion', {static: false}) urlExpansion: MatExpansionPanel
  constructor(private displayService: DisplayService, private searchService: SearchService, private router: Router, private route: ActivatedRoute, private storageService: LocalStorageService, private youtubeService: YoutubeService) { }

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
    this.urlControl.valueChanges.subscribe(value => {
      if (this.urlControl.valid) {
        this.URL_TO_PROMOTE=this.urlControl.value
        this.componentReady = true
      } else {
        this.URL_TO_PROMOTE = ""
        this.componentReady = false
      }
    })
   
    
  }

  getCampaignData() {
  
    if (window.location.pathname === '/campaigns/settings/display') {
     this.displayService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
            this.currentLandingPage = campaign.urlPromote
            this.urlControl.setValue(this.currentLandingPage)
            }
          })
    } else if (window.location.pathname === '/campaigns/settings/native') {
      this.youtubeService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
            this.currentLandingPage = campaign.urlPromote
            this.urlControl.setValue(this.currentLandingPage)
            }
          })
    } else if (window.location.pathname === '/campaigns/settings/search') {
      this.searchService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
            this.currentLandingPage = campaign.urlPromote
            this.urlControl.setValue(this.currentLandingPage)
            }
          })
    } else {
      this.router.navigate(['/campaigns'])
   }
    
  }

  public spinnerUpdate: boolean = false
  public landingPageNotChange: boolean = true
  updateLandingPage() {
 
    if (window.location.pathname === '/campaigns/settings/display') {
     if (this.currentLandingPage !== this.urlControl.value && this.urlControl.valid) {
       this.spinnerUpdate = true
      this.displayService.updateCampaign(this.cid, { urlPromote: this.urlControl.value }).then(update => {
        if (update === "ok") {
          this.spinnerUpdate = false
          this.togglePanel(event)
          this.getCampaignData()
        } else {
          this.spinnerUpdate = false
        }
      })
    }
    } else if (window.location.pathname === '/campaigns/settings/native') {
     if (this.currentLandingPage !== this.urlControl.value && this.urlControl.valid) {
       this.spinnerUpdate = true
      this.youtubeService.updateCampaign(this.cid, { urlPromote: this.urlControl.value }).then(update => {
        if (update === "ok") {
          this.spinnerUpdate = false
          this.togglePanel(event)
          this.getCampaignData()
        } else {
          this.spinnerUpdate = false
        }
      })
    }
    }else if (window.location.pathname === '/campaigns/settings/search') {
      if (this.currentLandingPage !== this.urlControl.value && this.urlControl.valid) {
        this.spinnerUpdate = true
       this.searchService.updateCampaign(this.cid, { urlPromote: this.urlControl.value }).then(update => {
         if (update === "ok") {
           this.spinnerUpdate = false
           this.togglePanel(event)
           this.getCampaignData()
         } else {
           this.spinnerUpdate = false
         }
       })
     }
     } else {
      this.router.navigate(['/campaigns'])
   }
    
   
  }

}
