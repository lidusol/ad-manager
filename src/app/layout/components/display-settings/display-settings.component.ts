import { Component, OnInit, ViewChild } from '@angular/core';
import { Display } from 'src/app/campaigns-management/models/display.models';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { PositionDataModel } from '@syncfusion/ej2-popups';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { PublishCampaignComponent } from '../publish-campaign/publish-campaign.component';
import { CURRENCY } from 'src/environments/environment';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Account, User_Role } from '../../../utils/data'
import { AccountsService } from 'src/app/accounts/accounts.service';
import { LocalStorageService } from '../../services/local-storage.service';
import {take} from 'rxjs/operators'
import { CmpUserInterestComponent } from '../cmp-user-interest/cmp-user-interest.component';
import { CmpDeviceTargetComponent } from '../cmp-device-target/cmp-device-target.component';


@Component({
  selector: 'adf-display-settings',
  templateUrl: './display-settings.component.html',
  styleUrls: ['./display-settings.component.scss']
})
export class DisplaySettingsComponent implements OnInit {
   public campaignData: Display[] = [];
  cid: string = undefined;
  uid: string = undefined;
  aacid: string = undefined;
  campaignId: number = 0
 
  isLoading: boolean = true

  @ViewChild(SpinnerComponent, { static: false }) spinner: SpinnerComponent
  @ViewChild('campaignConfirmDelete', {static: false}) campaignConfirmDelete: DialogComponent 
  public currentInjectedData: any;
  public currentBudget: number = 0
  public currentCampaignSaveId: string = ""
  @ViewChild(CmpUserInterestComponent, {static: false}) userInterest: CmpUserInterestComponent
  @ViewChild(CmpDeviceTargetComponent, {static: false}) deviceTarget: CmpDeviceTargetComponent
  public currentCampaignIdToDelete: number = 0
  public currentCampaignIdFirebaseToDelete: string = ""
  public currentAdGroupIdFirebaseToDelete: string = ""
  public currentCampaignTypeToDelete: string = ""
  public currentCampaignStartDateToDelete: string = ""
  public currentCampaignEndDateToDelete: string = ""
  public currentCampaignBudgetToDelete: number = 0
  public currentCampaignNumberOfDaysToDelete: number = 0
  public currentCampaignDailyBudgetToDelete: number = 0
  public currentCampaignToDeleteIsUsedPack: boolean = false
  public currentCampaignToDeleteUsePromoCode: boolean = false
  public currentCampaignIsUsedPack: boolean = false
  public currentCampaignPackType: string = ""
  public currentCampaignType: string = ""
  public currentCampaignisExpress: boolean = false
  public account_value: number = 0
public modeSelected: string = "";
  public email: string = ""
  public publishComponent: boolean = false
  public visible: Boolean = false;
  public isModal: Boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  public uid_action: string = ""
  user_access: User_Role = undefined
  @ViewChild('dialogNoEnoughFounds', {static: false}) dialogNoEnoughFounds: DialogComponent
  @ViewChild(PublishCampaignComponent, { static: false }) publishCampaignComponent: PublishCampaignComponent;
  @ViewChild('dialogPublishWithCodePromo', {static: false}) dialogPublishWithCodePromo: DialogComponent
   @ViewChild('dialogPublishChoose', { static: false }) dialogPublishChoose: DialogComponent
  constructor(private route: ActivatedRoute, private displayService: DisplayService, private router: Router, private accountsService: AccountsService, private storageService: LocalStorageService) { }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.storageService.getUserIdAndAccountId().then(response => {
      if (response !== null) {
        this.user_access=response.role
        if (response.role.admin) {
          this.route.queryParams.subscribe(params => {
            this.cid = params['cid'];
            this.uid = params['auid'];
            this.aacid = params['aacid']
            if (response.fromOwned) {
              this.uid_action = response.auid
            } else {
              this.uid_action = response.account.owner
            }
            if (this.cid !== undefined && this.uid !== undefined && this.aacid === response.aacid) {
              this.isLoading = false
             this.getCampaignData()
            }
          
          })
          
        }
      }
    })
  }

  buttonStatusEnter() {
    document.getElementsByClassName('icon-status-dropdown')[0].classList.remove('d-none')
  }
  buttonStatusLeave() {
        document.getElementsByClassName('icon-status-dropdown')[0].classList.add('d-none')
  }

   buttonEditEnter() {
    document.getElementsByClassName('button-edit')[0].classList.remove('d-none')
  }
  buttonEditLeave() {
        document.getElementsByClassName('button-edit')[0].classList.add('d-none')
  }

  

    getCampaignData() {
   
     this.displayService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
              this.campaignData = []
            this.campaignData.push(campaign)
            this.campaignId = campaign.id_campagne
            if (campaign.budgetEnded) {
              this.router.navigate(['/campaigns'])
            }
            }
          })
    }
  
  
  activateCampaign(id: string, campaign_id: number, type: string, budgetEnded: boolean) {
    if (budgetEnded === false) {
      
      this.loader = true
      setTimeout(() => {
        this.spinner.message = "Activation de la campagne en cours"
      if (type.toLowerCase() === "display") {
        this.displayService.enableCampaign(this.cid, campaign_id).then(res_activate => {
          if (res_activate === "ok") {
            this.spinner.message = "Campagne activée avec succès"
            this.loader = false
            
          }
        })
      } else if (type === "Youtube") {
          /* this.youtubeService.enableCampaign(id, campaign_id).then(res_activate => {
          if (res_activate === "ok") {
            this.spinner.message = "Campagne activée avec succès"
            this.loader = false
            
          }
        }) */
      }
      },500)
    }
  }

  loader: boolean = false
  pauseCampaign(id: string, campaign_id: number, type: string, budgetEnded: boolean) {
     this.loader = true
    setTimeout(() => {
      this.spinner.message = "Désactivation de la campagne en cours"
    if (type.toLowerCase() === "display") {
      this.displayService.disableCampaign(this.cid, campaign_id).then(res_activate => {
        if (res_activate === "ok") {
          this.spinner.message = "Campagne désactivée avec succès"
          this.loader = false
          
        }
      })
    } else if (type.toLowerCase() === "youtube") {
        /* this.youtubeService.disableCampaign(id, campaign_id).then(res_activate => {
        if (res_activate === "ok") {
          this.spinner.message = "Campagne déactivée avec succès"
          this.loader = false
          
        }
      }) */
    }
    },500)
  }

  deleteSelectedCampain(id: string, campaign_id: number, type: string, ad_group_id_firebase: string, startDateEnglish: string, endDateEnglish: string, budget: number, dailyBudget: number, numberOfDays: number, isUsedPack: boolean, isUsePromoteCode: boolean) {

    this.currentCampaignIdToDelete = campaign_id
    this.currentCampaignIdFirebaseToDelete = this.cid
    this.currentAdGroupIdFirebaseToDelete = ad_group_id_firebase
    this.currentCampaignTypeToDelete = type
    this.currentCampaignStartDateToDelete = startDateEnglish
    this.currentCampaignEndDateToDelete = endDateEnglish
    this.currentCampaignBudgetToDelete = budget
    this.currentCampaignDailyBudgetToDelete = dailyBudget
    this.currentCampaignNumberOfDaysToDelete = numberOfDays
    this.currentCampaignToDeleteIsUsedPack = isUsedPack
    this.currentCampaignToDeleteUsePromoCode = isUsePromoteCode
    this.campaignConfirmDelete.show()
   
   }
  
    deletionConfirmed() {
    this.campaignConfirmDelete.hide()
    this.loader = true
    //console.log(this.currentCampaignTypeToDelete)
    setTimeout(() => {
    if (this.currentCampaignToDeleteIsUsedPack || this.currentCampaignToDeleteUsePromoCode) {
      this.spinner.message = "Suppression de la campagne en cours..."
      if (this.currentCampaignTypeToDelete === "DISPLAY" || this.currentCampaignTypeToDelete === "Native") {
      if (this.currentCampaignIdToDelete === 0) {
       this.displayService.deleteCampaign(this.currentCampaignIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
          this.loader = false
   
          
         }
       })
     } else {
       this.displayService.removeCampaign(this.currentCampaignIdFirebaseToDelete, this.currentCampaignIdToDelete, this.currentAdGroupIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
       
               this.loader = false
             
            
           
         }
       })
     } 
      
    
      } /* else if (this.currentCampaignTypeToDelete === "Youtube") { 
     
     //console.log(this.currentCampaignIdFirebaseToDelete)
      if (this.currentCampaignIdToDelete === 0) {
       this.youtubeService.deleteCampaign(this.currentCampaignIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
          this.loader = false
   
          
         }
       })
     } else {
       this.youtubeService.removeCampaign(this.currentCampaignIdFirebaseToDelete, this.currentCampaignIdToDelete, this.currentAdGroupIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
       
               this.loader = false
             
            
           
         }
       })
     } 
      
  
      } */
    } else {
        if (this.currentCampaignTypeToDelete === "DISPLAY" || this.currentCampaignTypeToDelete === "Native") {
     
      this.spinner.message = "Suppression de la campagne en cours..."
      if (this.currentCampaignIdToDelete === 0) {
       this.displayService.deleteCampaign(this.currentCampaignIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
          this.loader = false
   
          
         }
       })
     } else {
       this.displayService.removeCampaign(this.currentCampaignIdFirebaseToDelete, this.currentCampaignIdToDelete, this.currentAdGroupIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
               this.restituteFundsBeforeRemove(this.currentCampaignStartDateToDelete, this.currentCampaignEndDateToDelete, this.currentCampaignBudgetToDelete, this.currentCampaignDailyBudgetToDelete, this.currentCampaignNumberOfDaysToDelete).then(res_restitute => {
             if (res_restitute === "ok") {
               this.loader = false
             
             } else {
               this.loader = false
               alert('Une erreur est survenue')
           }
         })
           
         }
       })
     } 
      
 
    } /* else if (this.currentCampaignTypeToDelete === "Youtube") {
   
      this.spinner.message = "Suppression de la campagne en cours..."
      if (this.currentCampaignIdToDelete === 0) {
       this.youtubeService.deleteCampaign(this.currentCampaignIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
           this.loader = false
         }
       })
     } else {
       this.youtubeService.removeCampaign(this.currentCampaignIdFirebaseToDelete, this.currentCampaignIdToDelete, this.currentAdGroupIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
               this.restituteFundsBeforeRemove(this.currentCampaignStartDateToDelete, this.currentCampaignEndDateToDelete, this.currentCampaignBudgetToDelete, this.currentCampaignDailyBudgetToDelete, this.currentCampaignNumberOfDaysToDelete).then(res_restitute => {
             if (res_restitute === "ok") {
               this.loader = false
             
             } else {
               this.loader = false
               alert('Une erreur est survenue')
           }
         }) 
         }
       })
     } 
      
  
    } */
    }
  }, 500);
    }
  
     checkStartDates(startDateEnglish): Promise <string> {
    return new Promise(resolve => {
      
      var now = new Date();
      var start = new Date(startDateEnglish.toString().replace(/-/g, '/')

      )
      now.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0)
      if (start <= now) {

        resolve('started')

      }else {
        resolve('not started')
       
      }

    })
   }
  
     checkEndDates(endDateEnglish): Promise <string> {
    return new Promise(resolve => {
      
      var now = new Date();
      var end = new Date(endDateEnglish.toString().replace(/-/g, '/')

      )
      now.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0)
      if (end < now) {
        resolve('ended')

      } else {
        resolve('not ended')
       
      }

    })
  }

  restituteFundsBeforeRemove(startDateEnglish: string, endDateEnglish: string, budget: number, dailyBudget: number,  numberOfDays: number):Promise<string> {
    return new Promise(resolve => {
      this.getAccountValue().then(getting_av => {
        if (getting_av === "ok") {
          
          this.checkStartDates(startDateEnglish).then(res_start_date => {
          if (res_start_date === "not started") {
              this.accountsService.updateAccount(this.accountId, { account_value: parseFloat((this.account_value + budget).toFixed(2)) }).then(res_update_user => {
                if (res_update_user === "ok") {
                  resolve('ok')
                }
              }).catch((e) => {
                resolve("error")
              })
           
          } else {
            this.checkEndDates(endDateEnglish).then(res_end_date => {
              if (res_end_date === "not ended") {
                //restitute the rest
                    var debut = new Date(startDateEnglish); 
        var fin = new Date()
                var daysConsumed = parseInt((((fin.getTime() - debut.getTime()) / (1000 * 3600 * 24)) + 1).toFixed(0)); 
                let numberOfDaysRest = numberOfDays - daysConsumed
                let valueToRestitute = dailyBudget * numberOfDaysRest
                if (budget >= valueToRestitute) {
                  this.accountsService.updateAccount(this.accountId, { account_value: parseFloat((this.account_value + valueToRestitute).toFixed(2)) }).then(res_update_user => {
                    if (res_update_user === "ok") {
                      resolve('ok')
                    }
                  }).catch((e) => {
                    resolve('error')
                  })
                  
                } else {
                  resolve('ok')
                }
                
                
              } else {
                //restitute nothing
                resolve('ok')
              }
            })
          }
    })  
        }
      })
    })
  }

   CURRENT_ACCOUNT: Account
  accountId: string  =""
  getAccountValue():Promise<string> {
    return new Promise(resolve => {
      this.storageService.getUserIdAndAccountId().then(response => {
      if (response !== null) {
        this.accountsService.getListAccounts(response.auid).pipe(take(1)).subscribe(accounts => {
          this.CURRENT_ACCOUNT = accounts.find(account => account.id === response.aacid)
          this.account_value = this.CURRENT_ACCOUNT.account_value
          this.accountId = this.CURRENT_ACCOUNT.id
          resolve('ok')
        })
      }
    })
   })
  }

    usePromoteCode() {
    this.dialogPublishChoose.hide()
    this.dialogPublishWithCodePromo.show()
  }
  useAccountValue() {
    this.dialogPublishChoose.hide()
  
        if (this.account_value >= this.currentBudget) {

          this.publishComponent = true
          setTimeout(() => {
                    this.publishCampaignComponent.email = this.email
            this.publishCampaignComponent.uid = this.uid
            this.publishCampaignComponent.account_value = this.account_value
               this.publishCampaignComponent.injectedData = this.currentInjectedData
                   this.publishCampaignComponent.onOpenDialog()
          },500)
          
        } else {
          this.openDialog()
          
        }
     
  }
  
     
  public goPayments() {
     if (localStorage.getItem('wait_pay')) {
      localStorage.removeItem('wait_pay')
    }
    localStorage.setItem('wait_pay', JSON.stringify([{id: this.currentCampaignSaveId, type: "1"}]))
    this.router.navigate(['accounts/addFunds'])
  }
   public hideDialog () {
     this.dialogNoEnoughFounds.hide()
     this.publishCampaign(this.currentInjectedData, this.currentBudget, this.currentCampaignIsUsedPack, this.currentCampaignPackType, this.currentCampaignType, this.currentCampaignisExpress)
  }
    public openDialog () {
        this.dialogNoEnoughFounds.show()
  }
  public openDialogPromo() {
      this.dialogNoEnoughFounds.hide()
        this.dialogPublishWithCodePromo.show()
  }
  public hideDialogPromo () {
    this.dialogPublishWithCodePromo.hide()
    this.publishCampaign(this.currentInjectedData, this.currentBudget, this.currentCampaignIsUsedPack, this.currentCampaignPackType, this.currentCampaignType, this.currentCampaignisExpress)
  }
  
   publishCampaign(injectedData: Display, budget: number, isUsedPack: boolean, packType: string, type: string, isExpress: boolean) {
    let start = new Date(injectedData.startDateEnglish)
    start.setHours(0, 0, 0, 0)
    let today = new Date()
    today.setHours(0,0,0,0)
    if (start >= today) {
      this.currentInjectedData = injectedData
      this.currentBudget = budget
      this.currentCampaignSaveId = injectedData.id
      this.currentCampaignIsUsedPack = isUsedPack
      this.currentCampaignPackType = packType
      this.currentCampaignType = type
       this.currentCampaignisExpress = isExpress
       this.getAccountValue().then(get => {
         if (get === "ok") {
           this.dialogPublishChoose.show()
           
         }
       })
       
    } else {
      alert('changez la date début puis réessayer')
     }
     
    
   }

}
