import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User_Role } from 'src/app/utils/data';


@Component({
  selector: 'adf-cmp-budget-edit-popup',
  templateUrl: './cmp-budget-edit-popup.component.html',
  styleUrls: ['./cmp-budget-edit-popup.component.scss']
})
export class CmpBudgetEditPopupComponent implements OnInit {
   aacid: string = ""
  cid: string = undefined
  uid: string = undefined;
  campaignId: number = 0
  ad_group_id: number = 0
  idA: string = ""
  adf_account_id: string = ""
  uid_action: string= ""
  user_access: User_Role;
  budget: number = 0
  dailyBudget: number = 0
  numberOfDays: number = 0
  new_daily_budget: number = 0
  new_total_budget: number = 0
  showSpinnerBudget: boolean = false

  budgetControl = new FormControl('', [Validators.required, Validators.min(5)])
  constructor(private displayService: DisplayService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      this.cid = params['cid'];
      this.uid = params['uid'];   
        if (this.cid !== undefined  && this.uid!== undefined) {
        this.displayService.getCampaign(this.cid).valueChanges().subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
              this.numberOfDays=campaign.numberOfDays
            this.budget = campaign.budget
            this.dailyBudget = campaign.dailyBudget
              this.budgetControl.setValue(this.dailyBudget)
            }
          })
      }
    
    })
    this.budgetControl.valueChanges.subscribe(x => {
      this.new_daily_budget = this.budgetControl.value
      this.new_total_budget = parseInt((this.budgetControl.value*this.numberOfDays).toFixed(0))
    })
  }

  @Output() closePanel: EventEmitter<boolean> = new EventEmitter<boolean>()
  updateBudget() {
    this.showSpinnerBudget = true
    this.displayService.updateCampaign(this.cid, { budget: this.new_total_budget, dailyBudget: this.new_daily_budget, realBudget: this.new_total_budget, realDailyBudget: this.new_daily_budget }).then(update => {
      if (update === "ok") {
        this.showSpinnerBudget = false
        this.closePanel.emit(true)
      } else {
        this.showSpinnerBudget = false
      }
    })
  }

  closePanelBudget() {
    this.closePanel.emit(true)
  }

}
