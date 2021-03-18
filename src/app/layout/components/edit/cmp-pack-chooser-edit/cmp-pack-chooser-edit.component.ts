import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User_Role } from 'src/app/utils/data';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import {take} from 'rxjs/operators'
import { CmpBudgetComponent } from '../../single/cmp-budget/cmp-budget.component';
import { CmpBidsComponent } from '../../single/cmp-bids/cmp-bids.component';
import { SearchService } from 'src/app/campaigns-management/services/search.service';

@Component({
  selector: 'adf-cmp-pack-chooser-edit',
  templateUrl: './cmp-pack-chooser-edit.component.html',
  styleUrls: ['./cmp-pack-chooser-edit.component.scss']
})
export class CmpPackChooserEditComponent implements OnInit, AfterViewInit {

  @ViewChild('packExpansion', { static: false }) packExpansion: MatExpansionPanel
  @ViewChild(CmpBudgetComponent, { static: false }) budgetComponent: CmpBudgetComponent
  @ViewChild(CmpBidsComponent, {static: false}) bidComponent :CmpBidsComponent
  expanded = true;
  selected = false;
   aacid: string = ""
  cid: string = undefined
  uid: string = undefined;
  campaignId: number = 0
  ad_group_id: number = 0
  idA: string = ""
  adf_account_id: string = ""
  uid_action: string= ""
  user_access: User_Role;
   bindingScheme: string = "CPM";
  packType = "1"
  packValue: number = 17
  daily_budget_for_pack: number = 17
  realPackValue: number = 17
  real_daily_budget_for_pack: number = 17
  pack_impressions: number = 100000
  pack_clics: number = 100000
  pack_scheme: string = "CPM"
  isLoading: boolean = true
   showPackTest: boolean = false
  packColClass: any = ['col-md-3', 'text-center', 'p-2']
  

  deliveryOptionSelected: string = "custom";
  deliveryDataLabel: any = [{'id': 'pack', 'label': 'Utiliser nos packs'}, {'id': 'custom', 'label': "Définir vos stratégies d'enchères"},
    ];

    
  bidChanging(bindingScheme: string) {
    setTimeout(() => {
      this.budgetComponent.bindingScheme = bindingScheme
      this.budgetComponent.validate()
    },500)
  }


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
      this.packExpansion.open(); // Here's the magic
    }else{
      this.packExpansion.close()
    }
  }
  constructor(private displayService: DisplayService, private searchService: SearchService, private youtubeService: YoutubeService, private router: Router, private route: ActivatedRoute, private storageService: LocalStorageService) { }

  ngOnInit(): void {
       
  }

  public currentTypeSelected: string = ""
    selectType(id: string) {
      console.log(id)
    if (this.currentTypeSelected === id) {
      if (id === "test") {
        this.packType = "0"
        this.packValue = 4
        this.daily_budget_for_pack = 4
        this.realPackValue = 4
        this.real_daily_budget_for_pack = 4
        this.pack_impressions = 20000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
        //this.cd.detectChanges()
      }else if (id === "basic") {
        this.packType = "1"
        this.packValue = 17
        this.daily_budget_for_pack = 17
        this.realPackValue = 17
        this.real_daily_budget_for_pack = 17
        this.pack_impressions = 100000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
        //this.cd.detectChanges()
      } else if (id === "premium") {
        this.packType = "2"
        this.packValue = 30
        this.daily_budget_for_pack = 30
        this.realPackValue = 30
        this.real_daily_budget_for_pack = 30
        this.pack_impressions = 250000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
        //this.cd.detectChanges()
      } else if (id === "pro") {
        this.packType = "3"
        this.packValue = 50
        this.daily_budget_for_pack = 50
        this.realPackValue = 50
        this.real_daily_budget_for_pack = 50
        this.pack_impressions = 500000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
        //this.cd.detectChanges()
      }
    } else {
      if(document.getElementById(this.currentTypeSelected)!==null && document.getElementById(this.currentTypeSelected)!==undefined){
        document.getElementById(this.currentTypeSelected).classList.remove('active', 'pulse')

      }
      document.getElementById(id).classList.add('active', 'pulse')
      this.currentTypeSelected = id
      if (id === "test") {
        this.packType = "0"
        this.packValue = 4
        this.daily_budget_for_pack = 4
        this.realPackValue = 4
        this.real_daily_budget_for_pack = 4
        this.pack_impressions = 20000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
        //this.cd.detectChanges()
      }else if (id === "basic") {
        this.packType = "1"
        this.packValue = 17
        this.daily_budget_for_pack = 17
        this.realPackValue = 17
        this.real_daily_budget_for_pack = 17
        this.pack_impressions = 100000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
        //this.cd.detectChanges()
      } else if (id === "premium") {
        this.packType = "2"
        this.packValue = 30
        this.daily_budget_for_pack = 30
        this.realPackValue = 30
        this.real_daily_budget_for_pack = 30
        this.pack_impressions = 250000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
        //this.cd.detectChanges()
      } else if (id === "pro") {
        this.packType = "3"
        this.packValue = 50
        this.daily_budget_for_pack = 50
        this.realPackValue = 50
        this.real_daily_budget_for_pack = 50
        this.pack_impressions = 500000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
        //this.cd.detectChanges()
      }
    }
    
  }

  getPack(): Promise<string>{
    return new Promise(resolve => {
      if (this.deliveryOptionSelected === 'pack') {
        this.selectType(this.currentTypeSelected)
        resolve('ok')
      } else if (this.deliveryOptionSelected === 'custom') {
        this.budgetComponent.validate().then(budget => {
          if (budget !== null) {
            this.packType = "4"
            this.packValue = budget.budget
            this.daily_budget_for_pack = budget.dailyBudget
            this.realPackValue = budget.realBudget
            this.real_daily_budget_for_pack = budget.realDailyBudget
            this.pack_scheme = budget.biddingScheme
            this.pack_impressions = budget.impressions
            this.pack_clics = budget.clics
            resolve('ok')
          } else {
            resolve('error')
          }
        }).catch((e) => {
          resolve('error')
          console.log(e)
        })
      }
    })
  }

   getCampaignData() {
     this.isLoading = false
     setTimeout(() => {
       if (window.location.pathname === '/campaigns/settings/display') {
     this.displayService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
            this.packType = campaign.packType
            this.packValue = campaign.budget
            this.daily_budget_for_pack = campaign.dailyBudget
            if (this.packType === "0") {
              this.currentTypeSelected = "test"
              this.deliveryOptionSelected = 'pack'
              this.packType = "0"
        this.packValue = 4
        this.daily_budget_for_pack = 4
        this.realPackValue = 4
        this.real_daily_budget_for_pack = 4
        this.pack_impressions = 20000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
              this.packColClass = ['col-md-3', 'text-center', 'p-2']
               setTimeout(() => {
                 if(                 document.getElementById(this.currentTypeSelected)!==undefined){
                                    document.getElementById(this.currentTypeSelected).classList.add('active', 'pulse')
                 }
                
              },500)
            }
            if (this.packType === "1") {
              this.currentTypeSelected = "basic"
              this.deliveryOptionSelected = 'pack'
              this.packType = "0"
        this.packValue = 17
        this.daily_budget_for_pack = 17
        this.realPackValue = 17
        this.real_daily_budget_for_pack = 17
        this.pack_impressions = 100000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
              this.packColClass = ['col-md-3', 'text-center', 'p-2']
              setTimeout(() => {
                if(document.getElementById(this.currentTypeSelected)!==null){
                                  document.getElementById(this.currentTypeSelected).classList.add('active', 'pulse')
                }
                
              },500)
            }
            if (this.packType === "2") {
          this.currentTypeSelected = "premium"
          this.deliveryOptionSelected = 'pack'
          this.packType = "2"
          this.packValue = 30
        this.daily_budget_for_pack = 30
        this.realPackValue = 30
        this.real_daily_budget_for_pack = 30
        this.pack_impressions = 250000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
          this.packColClass = ['col-md-3', 'text-center', 'p-2']
          setTimeout(() => {
            if(document.getElementById(this.currentTypeSelected)!==null){
                          document.getElementById(this.currentTypeSelected).classList.add('active', 'pulse')
            }
                
              },500)
            }
            if (this.packType === "3") {
              this.deliveryOptionSelected = 'pack'
              this.currentTypeSelected = "pro"
              this.packType = "3"
              this.packValue = 50
              this.daily_budget_for_pack = 50
              this.realPackValue = 50
              this.real_daily_budget_for_pack = 50
              this.pack_impressions = 500000
              this.pack_clics = 0
              this.pack_scheme = "CPM"
              this.packColClass = ['col-md-3', 'text-center', 'p-2']
              setTimeout(() => {
                
                if(document.getElementById(this.currentTypeSelected)!==null){
                                  document.getElementById(this.currentTypeSelected).classList.add('active', 'pulse')
                }
              },500)
            }

            if (this.packType === '4') {
              this.deliveryOptionSelected = 'custom'
              setTimeout(() => {
                this.bidComponent.selectedBid = campaign.strategie
                this.budgetComponent.budgetControl.setValue(campaign.realBudget)
                this.bidComponent.bidChanging.emit(this.bidComponent.selectedBid)
                this.packValue = campaign.budget
                this.daily_budget_for_pack = campaign.dailyBudget
                this.realPackValue = campaign.realBudget
                this.real_daily_budget_for_pack = campaign.realDailyBudget
                this.pack_impressions = campaign.totalImpressions
                this.pack_clics = campaign.totalClics
                this.pack_scheme = campaign.strategie
              },500)
            }
           
            }
          })
    } else if (window.location.pathname === '/campaigns/settings/native') {
      this.youtubeService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
         if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
            this.packType = campaign.packType
            this.packValue = campaign.budget
            this.daily_budget_for_pack = campaign.dailyBudget
            if (this.packType === "0") {
              this.currentTypeSelected = "test"
              this.deliveryOptionSelected = 'pack'
              this.packType = "0"
        this.packValue = 4
        this.daily_budget_for_pack = 4
        this.realPackValue = 4
        this.real_daily_budget_for_pack = 4
        this.pack_impressions = 20000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
              this.packColClass = ['col-md-3', 'text-center', 'p-2']
               setTimeout(() => {
                 if(document.getElementById(this.currentTypeSelected)!==null){
                                    document.getElementById(this.currentTypeSelected).classList.add('active', 'pulse')
                 }
                
              },500)
            }
            if (this.packType === "1") {
              this.currentTypeSelected = "basic"
              this.deliveryOptionSelected = 'pack'
              this.packType = "0"
        this.packValue = 17
        this.daily_budget_for_pack = 17
        this.realPackValue = 17
        this.real_daily_budget_for_pack = 17
        this.pack_impressions = 100000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
              this.packColClass = ['col-md-3', 'text-center', 'p-2']
              setTimeout(() => {
                if(document.getElementById(this.currentTypeSelected)!==null){
                                  document.getElementById(this.currentTypeSelected).classList.add('active', 'pulse')
                }
                
              },500)
            }
            if (this.packType === "2") {
          this.currentTypeSelected = "premium"
          this.deliveryOptionSelected = 'pack'
          this.packType = "2"
          this.packValue = 30
        this.daily_budget_for_pack = 30
        this.realPackValue = 30
        this.real_daily_budget_for_pack = 30
        this.pack_impressions = 250000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
          this.packColClass = ['col-md-3', 'text-center', 'p-2']
          setTimeout(() => {
            if(document.getElementById(this.currentTypeSelected)!==null){
                          document.getElementById(this.currentTypeSelected).classList.add('active', 'pulse')
            }
                
              },500)
            }
            if (this.packType === "3") {
              this.deliveryOptionSelected = 'pack'
              this.currentTypeSelected = "pro"
              this.packType = "3"
              this.packValue = 50
              this.daily_budget_for_pack = 50
              this.realPackValue = 50
              this.real_daily_budget_for_pack = 50
              this.pack_impressions = 500000
              this.pack_clics = 0
              this.pack_scheme = "CPM"
              this.packColClass = ['col-md-3', 'text-center', 'p-2']
              setTimeout(() => {
                
                if(document.getElementById(this.currentTypeSelected)!==null){
                                  document.getElementById(this.currentTypeSelected).classList.add('active', 'pulse')
                }
              },500)
            }

            if (this.packType === '4') {
              this.deliveryOptionSelected = 'custom'
              setTimeout(() => {
                this.bidComponent.selectedBid = campaign.strategie
                this.budgetComponent.budgetControl.setValue(campaign.realBudget)
                this.bidComponent.bidChanging.emit(this.bidComponent.selectedBid)
                this.packValue = campaign.budget
                this.daily_budget_for_pack = campaign.dailyBudget
                this.realPackValue = campaign.realBudget
                this.real_daily_budget_for_pack = campaign.realDailyBudget
                this.pack_impressions = campaign.totalImpressions
                this.pack_clics = campaign.totalClics
                this.pack_scheme = campaign.strategie
              },500)
            }
           
            }
          })
    }else if (window.location.pathname === '/campaigns/settings/search') {
      this.searchService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
         if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
            this.packType = campaign.packType
            this.packValue = campaign.budget
            this.daily_budget_for_pack = campaign.dailyBudget
            if (this.packType === "0") {
              this.currentTypeSelected = "test"
              this.deliveryOptionSelected = 'pack'
              this.packType = "0"
        this.packValue = 4
        this.daily_budget_for_pack = 4
        this.realPackValue = 4
        this.real_daily_budget_for_pack = 4
        this.pack_impressions = 20000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
              this.packColClass = ['col-md-3', 'text-center', 'p-2']
               setTimeout(() => {
                 if(document.getElementById(this.currentTypeSelected)!==null){
                                    document.getElementById(this.currentTypeSelected).classList.add('active', 'pulse')
                 }
                
              },500)
            }
            if (this.packType === "1") {
              this.currentTypeSelected = "basic"
              this.deliveryOptionSelected = 'pack'
              this.packType = "0"
        this.packValue = 17
        this.daily_budget_for_pack = 17
        this.realPackValue = 17
        this.real_daily_budget_for_pack = 17
        this.pack_impressions = 100000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
              this.packColClass = ['col-md-3', 'text-center', 'p-2']
              setTimeout(() => {
                if(document.getElementById(this.currentTypeSelected)!==null){
                                  document.getElementById(this.currentTypeSelected).classList.add('active', 'pulse')
                }
                
              },500)
            }
            if (this.packType === "2") {
          this.currentTypeSelected = "premium"
          this.deliveryOptionSelected = 'pack'
          this.packType = "2"
          this.packValue = 30
        this.daily_budget_for_pack = 30
        this.realPackValue = 30
        this.real_daily_budget_for_pack = 30
        this.pack_impressions = 250000
        this.pack_clics = 0
        this.pack_scheme = "CPM"
          this.packColClass = ['col-md-3', 'text-center', 'p-2']
          setTimeout(() => {
            if(document.getElementById(this.currentTypeSelected)!==null){
                          document.getElementById(this.currentTypeSelected).classList.add('active', 'pulse')
            }
                
              },500)
            }
            if (this.packType === "3") {
              this.deliveryOptionSelected = 'pack'
              this.currentTypeSelected = "pro"
              this.packType = "3"
              this.packValue = 50
              this.daily_budget_for_pack = 50
              this.realPackValue = 50
              this.real_daily_budget_for_pack = 50
              this.pack_impressions = 500000
              this.pack_clics = 0
              this.pack_scheme = "CPM"
              this.packColClass = ['col-md-3', 'text-center', 'p-2']
              setTimeout(() => {
                
                if(document.getElementById(this.currentTypeSelected)!==null){
                                  document.getElementById(this.currentTypeSelected).classList.add('active', 'pulse')
                }
              },500)
            }

            if (this.packType === '4') {
              this.deliveryOptionSelected = 'custom'
              setTimeout(() => {
                this.bidComponent.selectedBid = campaign.strategie
                this.budgetComponent.budgetControl.setValue(campaign.realBudget)
                this.bidComponent.bidChanging.emit(this.bidComponent.selectedBid)
                this.packValue = campaign.budget
                this.daily_budget_for_pack = campaign.dailyBudget
                this.realPackValue = campaign.realBudget
                this.real_daily_budget_for_pack = campaign.realDailyBudget
                this.pack_impressions = campaign.totalImpressions
                this.pack_clics = campaign.totalClics
                this.pack_scheme = campaign.strategie
              },500)
            }
           
            }
          })
    } else {
      this.router.navigate(['/campaigns'])
   }
     },500)
   
  }
  public spinnerUpdate: boolean = false
  updatePack() {
    this.spinnerUpdate = true
    this.getPack().then(getting_pack => {
      console.log(getting_pack)
      if (getting_pack === "ok") {
         if (window.location.pathname === '/campaigns/settings/display') {
      this.displayService.updateCampaign(this.cid, { packType: this.packType, budget: this.packValue, realBudget: this.realPackValue, dailyBudget: this.daily_budget_for_pack, realDailyBudget: this.real_daily_budget_for_pack, strategie: this.pack_scheme, totalImpressions: this.pack_impressions,  totalClics: this.pack_clics}).then(update => {
        if (update === "ok") {
          this.spinnerUpdate = false
      /*     this.togglePanel(event) */
          this.getCampaignData()
        } else {
          this.spinnerUpdate = false
        }
      })
    } else if (window.location.pathname === '/campaigns/settings/native') {
       this.youtubeService.updateCampaign(this.cid, { packType: this.packType, budget: this.packValue, realBudget: this.packValue, dailyBudget: this.daily_budget_for_pack, realDailyBudget: this.daily_budget_for_pack, strategie: this.pack_scheme, totalImpressions: this.pack_impressions, totalClics: this.pack_clics }).then(update => {
        if (update === "ok") {
          this.spinnerUpdate = false
         /*  this.togglePanel(event) */
          this.getCampaignData()
        } else {
          this.spinnerUpdate = false
        }
      })
    }else if (window.location.pathname === '/campaigns/settings/search') {
      this.searchService.updateCampaign(this.cid, { packType: this.packType, budget: this.packValue, realBudget:  this.budgetComponent.budgetControl.value, dailyBudget: this.daily_budget_for_pack, realDailyBudget: this.daily_budget_for_pack, strategie: this.pack_scheme, totalImpressions: this.pack_impressions, totalClics: this.pack_clics }).then(update => {
       if (update === "ok") {
         this.spinnerUpdate = false
        /*  this.togglePanel(event) */
         this.getCampaignData()
       } else {
         this.spinnerUpdate = false
       }
     })
   } else {
      this.router.navigate(['/campaigns'])
   }
      } else {
        this.spinnerUpdate = false
      }
    }).catch((e) => {
      this.spinnerUpdate = false
      console.log(e)
    })
   
   
  }

  ngAfterViewInit() {
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

}
