import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { SERVER, CURRENCY } from 'src/environments/environment';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { CmpBudgetComponent } from '../cmp-budget/cmp-budget.component';
import { CmpBidsComponent } from '../cmp-bids/cmp-bids.component';

@Component({
  selector: 'adf-cmp-pack-chooser',
  templateUrl: './cmp-pack-chooser.component.html',
  styleUrls: ['./cmp-pack-chooser.component.scss']
})
export class CmpPackChooserComponent implements OnInit, AfterViewInit {
   @ViewChild('packExpansion', { static: false }) packExpansion: MatExpansionPanel
   @ViewChild(CmpBudgetComponent, {static: false}) budgetComponent: CmpBudgetComponent
   @ViewChild(CmpBidsComponent, {static: false}) bidsComponent: CmpBidsComponent
  expanded = true;
  selected = false;
  bindingScheme: string = "CPM";
  packType = "1"
  packValue: number = 17
  daily_budget_for_pack: number = 17
  realPackValue: number = 17
  real_daily_budget_for_pack: number = 17
  pack_impressions: number = 100000
  pack_clics: number = 100000
  pack_scheme: string = "CPM"
  

  deliveryOptionSelected: string = "custom";
  deliveryDataLabel: any = [{'id': 'pack', 'label': 'Utiliser nos packs'}, {'id': 'custom', 'label': "Définir vos stratégies d'enchères"},
    ];

    
  bidChanging(bindingScheme: string) {
      if(this.budgetComponent!==undefined){
        this.budgetComponent.bindingScheme = bindingScheme

      }
 
  }

  bidValueChanging(bidValue: number) {
      if(this.budgetComponent!==undefined){
        this.budgetComponent.bidValue = bidValue
        this.budgetComponent.validate()

      }
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
  constructor(private accountService: AccountsService, private storageService: LocalStorageService, /* private cd: ChangeDetectorRef */) { }

  ngOnInit(): void {
   
  }
  isLoading: boolean = true
  showPackTest: boolean = false
  packColClass: any = ['col-md-3', 'text-center', 'p-2']

  setDefaultPack() {
    this.packValue = 17
    this.daily_budget_for_pack = 17
    this.packType = "1"
    this.pack_impressions = 100000
    this.pack_clics = 0
    this.pack_scheme = "CPM"
    this.currentTypeSelected = "basic"
  }
  ngAfterViewInit(): void {
    this.isLoading = false
    this.setDefaultPack()
  }

  setDefaultBid(strategy: string, disabled: boolean){
    this.bidsComponent.setBidStrategy(strategy, disabled)
  }

  

  public currentTypeSelected: string = ""
  selectType(id: string) :Promise<string>{
    return new Promise(resolve => {
      
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
        resolve('ok')
      } else {
        document.getElementById(this.currentTypeSelected).classList.remove('active', 'pulse')
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
        resolve('ok')
      }
    })
    
  }
BID: number = 0.1
  getPack(): Promise<string>{
    return new Promise(resolve => {
      if (this.deliveryOptionSelected === 'pack') {
        this.selectType(this.currentTypeSelected).then(getting_pack => {
          resolve('ok')
        }).catch((e)=>{
          console.log(e)
          resolve('error')
        })
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
            this.BID = budget.bidValue
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

}
