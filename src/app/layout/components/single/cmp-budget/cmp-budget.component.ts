import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FormControl, Validators } from '@angular/forms';
import { Budget_Settings } from 'src/app/utils/data';
import { budgetValueValidator } from 'src/app/utils/form-validators';
import { MatSliderChange } from '@angular/material/slider';


@Component({
  selector: 'adf-cmp-budget',
  templateUrl: './cmp-budget.component.html',
  styleUrls: ['./cmp-budget.component.scss']
})
export class CmpBudgetComponent implements OnInit {
  @ViewChild('budgetExpansion', { static: false }) budgetExpansion: MatExpansionPanel
  componentReady: boolean = false
  expanded = true;
  selected = false;
  bindingScheme: string = "CPM";
  budget_result: Budget_Settings = null
  budgetControl = new FormControl(4, [Validators.required, Validators.min(4), Validators.max(1000)])
  budget: number = 0
  bidValue: number = 0.1
  sliderValue: number=4000
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + '$';
    }

    return value;
  }

  sliderChange(arg: MatSliderChange){
    let value =  Math.round(arg.value / 1000)
    //console.log(value)
    this.budgetControl.setValue(value)
  }
  @Output() budgetChange: EventEmitter<number> = new EventEmitter<number>()

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
      this.budgetExpansion.open(); // Here's the magic
    }else{
      this.budgetExpansion.close()
    }
  }
  constructor() {
    this.budgetControl.valueChanges.subscribe(value => {
      if(value<=1000){
        this.sliderValue = Math.round(value*1000)
        this.validate()

      }
    })
   }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
   /*  setTimeout(() => { 
      this.validate()
    },500) */
  }


  
  budgetSuggestion: number = 0
  validate(): Promise<Budget_Settings> {
    return new Promise(resolve => {
      if (this.budgetControl.valid) {
        //console.log(this.bindingScheme)
        this.budget = this.budgetControl.value
          var budget_70: number = parseInt(((this.budget * 70) / 100).toFixed(0))
          var dailyBudget: number = parseInt((budget_70 / 2).toFixed(2))
          var real_daily_budget: number = parseInt((this.budget / 2).toFixed(2))
          var estimatedClicks: number = 0
          var estimatedImpressions: number = 0
          if(dailyBudget<5){
            dailyBudget = 5
          }
          if(real_daily_budget<5){
            real_daily_budget = 5
          }
          if (this.bindingScheme === 'CPM') {
            estimatedImpressions = parseInt(((budget_70 * 1000) / ((this.bidValue*80)/100)).toFixed(0))
            estimatedClicks = parseInt(((budget_70 / ((this.bidValue*80)/100))).toFixed(0))
            this.budget_result = {
          budget: budget_70,
          realBudget: this.budget,
          dailyBudget: dailyBudget,
          realDailyBudget: real_daily_budget,
          biddingScheme: this.bindingScheme,
          bidValue: this.bidValue,
          impressions: estimatedImpressions,
          clics: estimatedClicks
            }
               this.componentReady = true
          resolve(this.budget_result)
            
          } else if (this.bindingScheme === 'CPC') {
            estimatedClicks = parseInt(((budget_70 / ((this.bidValue*80)/100))).toFixed(0))
            estimatedImpressions = parseInt(((budget_70 * 1000) / ((this.bidValue*80)/100)).toFixed(0))
            this.budget_result = {
          budget: budget_70,
          realBudget: this.budget,
          dailyBudget: dailyBudget,
          realDailyBudget: real_daily_budget,
          biddingScheme: this.bindingScheme,
          bidValue: this.bidValue,
          impressions: estimatedImpressions,
          clics: estimatedClicks
            }
               this.componentReady = true
          resolve(this.budget_result)
          }else if (this.bindingScheme === 'CPA'){
            this.budget_result = {
              budget: budget_70,
              realBudget: this.budget,
              dailyBudget: dailyBudget,
              realDailyBudget: real_daily_budget,
              biddingScheme: this.bindingScheme,
              bidValue: this.bidValue,
              impressions: 0,
              clics: estimatedClicks
                }
                   this.componentReady = true
              resolve(this.budget_result)
          }else if (this.bindingScheme === 'MC'){
            //console.log('binding scheme selected')
            estimatedImpressions = parseInt(((budget_70 * 1000) / ((this.bidValue*80)/100)).toFixed(0))
            estimatedClicks = parseInt(((budget_70 / ((this.bidValue*80)/100))).toFixed(0))
            this.budget_result = {
              budget: budget_70,
              realBudget: this.budget,
              dailyBudget: dailyBudget,
              realDailyBudget: real_daily_budget,
              biddingScheme: this.bindingScheme,
              bidValue: this.bidValue,
              impressions: estimatedImpressions,
              clics: estimatedClicks
                }
                   this.componentReady = true
              resolve(this.budget_result)
          } else {
            this.budget_result = null
               this.componentReady = false
          resolve(null)
          }
       

      } else {
        this.budget_result = null
        this.componentReady = false
        this.budget = 0
        resolve(null)
      }
      
    })
  }

}
