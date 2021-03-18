import { Component, OnInit, ViewChild } from '@angular/core';
import { Display } from 'src/app/campaigns-management/models/youtube.models';
import { ActivatedRoute, Router } from '@angular/router';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { PositionDataModel } from '@syncfusion/ej2-popups';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { PublishCampaignComponent } from '../publish-campaign/publish-campaign.component';
import { CURRENCY, SERVER } from 'src/environments/environment';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Account, User_Role, NATIVE_ADS_TO_PUBLISH, RESPONSIVE_DISPLAY_ADS, AdToDelete, adDispalyError } from '../../../utils/data'
import { AccountsService } from 'src/app/accounts/accounts.service';
import { LocalStorageService } from '../../services/local-storage.service';
import {take} from 'rxjs/operators'
import { CmpNativeAdsCreatorComponent } from '../single/cmp-native-ads-creator/cmp-native-ads-creator.component';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ResponsiveDisplayPreviewSimulationComponent } from '../native-tools/responsive-display-preview-simulation/responsive-display-preview-simulation.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';


@Component({
  selector: 'adf-youtube-settings',
  templateUrl: './youtube-settings.component.html',
  styleUrls: ['./youtube-settings.component.scss']
})
export class YoutubeSettingsComponent implements OnInit {
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
  @ViewChild(CmpNativeAdsCreatorComponent, { static: false }) nativeAdsCreator: CmpNativeAdsCreatorComponent;
  @ViewChild('dialogPreviewSimulation', { static: false }) dialogPreviewSimulation: DialogComponent
  @ViewChild(ResponsiveDisplayPreviewSimulationComponent, {static: false}) simulationComponent: ResponsiveDisplayPreviewSimulationComponent
  @ViewChild(SnackbarComponent, { static: false }) appSnackbar: SnackbarComponent;

  constructor(private route: ActivatedRoute, private youtubeService: YoutubeService, private router: Router, private accountsService: AccountsService, private storageService: LocalStorageService) { }

  ngOnInit(): void {

  }
  duplicateAd(data: NATIVE_ADS_TO_PUBLISH) {
    let new_ad: NATIVE_ADS_TO_PUBLISH = data
    new_ad.id = 'duplicate-ad ' + data.id
    this.nativeAdsCreator.toggleDuplicateNativeBeforeUpload(new_ad)
  }

 
  defaulClientCustomerId = SERVER.CLIENT_CUSTOMER_ID
  changeAdStatus(id: string, ad_id: string, status: string, ad_group_id: number) {
    //this.loaderEdit = true

    this.youtubeService.changeResponsiveDisplayAdStatus(id, ad_group_id, ad_id, status).then(res_status => {
      if (res_status === "ok") {
        this.getAdsData()
        this.openSnackBar(15, "Status de l'annonce mis à jour avec succès !", 'ok', 'snack-success')
        //this.spinner.message = "Status mis é jour avec succés !"
        //this.loaderEdit = false
        
      } else {
         this.openSnackBar(15, 'Une erreur est survenue, réessayez', 'fermer', 'snack-warn')
      }
    }).catch((e) => {
       this.openSnackBar(15, 'Une erreur est survenue, réessayez', 'fermer', 'snack-warn')
    })
 
  }

  adsPublishedToDelete: AdToDelete[] = []
  adsNotPublishedToDelete: AdToDelete[] = []
  @ViewChild('confirmDeleteDialog', { static: false }) confirmDeleteDialog: DialogComponent;
  removeResponsiveDisplayAd(id: string, ad_id?: number, ad_group_id?: number) {
    //this.loaderEdit = true
    if (ad_id === 0) {
      this.adsNotPublishedToDelete.push({
        id: id,
        ad_id: ad_id,
        ad_group_id: ad_group_id

      })
    } else {
     this.adsPublishedToDelete.push({
        id: id,
        ad_id: ad_id,
        ad_group_id: ad_group_id

      }) 
    }
  
  
  }
  triggerDeletion() {
    this.confirmDeleteDialog.show()
  }
  abortDeletion() {
    this.confirmDeleteDialog.hide()
    this.adsPublishedToDelete = []
    this.adsNotPublishedToDelete = []
  }
  hideToolbarDeletion() {
    this.adsPublishedToDelete = []
    this.adsNotPublishedToDelete = []
  }
  confirmDelete() {
    if(this.adsNotPublishedToDelete.length>0){
       this.youtubeService.removeResponsiveDisplayAdsNotPublished(this.adsNotPublishedToDelete).then(res_remove => {
           //console.log(res_remove)
          if (res_remove === "ok") {
            //this.spinner.message = "Visuel supprimé avec succés"
            //this.loaderEdit = false
            this.adsPublishedToDelete = []
            this.adsNotPublishedToDelete = []
            this.confirmDeleteDialog.hide()
            this.getAdsData()
           
            this.openSnackBar(15, 'Suppression éffectuée avec succès', 'ok', 'snack-success')
            
         
          } else {
            //this.loaderEdit = false
           this.openSnackBar(15, 'Une erreur est survenue', 'fermer', 'snack-warn')
       }

         }).catch((e) => {
           //this.loaderEdit = false
           this.openSnackBar(15, 'Une erreur est survenue', 'fermer', 'snack-warn')
      });
    }else{

      this.youtubeService.removeResponsiveDisplayAd(this.adsPublishedToDelete).then(res_remove => {
           //console.log(res_remove)
          if (res_remove === "ok") {
            //this.spinner.message = "Visuel supprimé avec succés"
            //this.loaderEdit = false
            this.adsPublishedToDelete = []
            this.adsNotPublishedToDelete = []
            this.confirmDeleteDialog.hide()
            this.getAdsData()
           
            this.openSnackBar(15, 'Suppression éffectuée avec succès', 'ok', 'snack-success')
            
         
          } else {
            //this.loaderEdit = false
           this.openSnackBar(15, 'Une erreur est survenue', 'fermer', 'snack-warn')
       }

         }).catch((e) => {
           //this.loaderEdit = false
           this.openSnackBar(15, 'Une erreur est survenue', 'fermer', 'snack-warn')
      });
    }
  }
   openSnackBar(timeout: number, message: string, action: string, css: string) {
    this.appSnackbar.openSnackBar(timeout, message, action, css)
  }
  partialErrors: adDispalyError[] = []
  detectAddedNewAd(ads: NATIVE_ADS_TO_PUBLISH[]) {
    if(this.campaignId=== 0) {
      this.notPublishedAds = [...this.notPublishedAds, ...ads]
      this.nativeAdsCreator.native_before_upload = []
      this.nativeAdsCreator.abortOperation()
  this.youtubeService.updateCampaign(this.cid, { imagesNative: this.notPublishedAds }).then(updated => {
    if (updated === 'ok') {
           this.openSnackBar(15, "Campagne mis à jour avec succès !", 'ok', 'snack-success')
    } else {
       this.openSnackBar(15, 'Une erreur est survenue, réessayez', 'fermer', 'snack-warn')
        }
  }).catch((e) => {
         this.openSnackBar(15, 'Une erreur est survenue, réessayez', 'fermer', 'snack-warn')
      })
    }else{
      this.youtubeService.addNewAdResponsive(this.uid, this.aacid, this.ad_group_id, this.url, ads).then(ad_added => {
        this.partialErrors = ad_added.partialErrors
        if (ad_added.status === 'ok') {
          this.getAdsData()
          this.nativeAdsCreator.native_before_upload = []
          this.nativeAdsCreator.abortOperation()
          this.openSnackBar(15, "Campagne mis à jour avec succès !", 'ok', 'snack-success')
        } else {
           this.openSnackBar(15, 'Une erreur est survenue, réessayez', 'fermer', 'snack-warn')
        }
      }).catch((e) => {
         this.openSnackBar(15, 'Une erreur est survenue, réessayez', 'fermer', 'snack-warn')
      })
    }

    

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
  previewSimulationNotPublished(ad: NATIVE_ADS_TO_PUBLISH) {
    this.dialogPreviewSimulation.show()
    setTimeout(() => {
      this.simulationComponent.data__PB = ad
      this.simulationComponent.triggerSimulation()
    },500)
  }

  public initialPage: PageSettingsModel= { pageSize: 5 };
  publishedAds: RESPONSIVE_DISPLAY_ADS[] = []
  notPublishedAds: NATIVE_ADS_TO_PUBLISH[] = []
    getAdsData():Promise<string>{
      return new Promise(resolve => {
      this.youtubeService.getListResponsiveDisplayAdsFormACampaign(this.aacid, this.ad_group_id).pipe(take(1)).subscribe(data => {
        this.publishedAds = data
          resolve('ok')
       })
    })
  }
  ad_group_id: number = 0
  url: string = ""
    getCampaignData() {
   
     this.youtubeService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
       //console.log(campaign)
       if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
              this.campaignData = []
            this.campaignData.push(campaign)
         this.campaignId = campaign.id_campagne
         this.ad_group_id = campaign.ad_group_id
         this.url = campaign.urlPromote
         this.notPublishedAds = campaign.imagesNative?campaign.imagesNative:[]
         if(this.campaignId===0){
         } else {
           this.getAdsData()
         }
            if (campaign.budgetEnded) {
              this.router.navigate(['/campaigns'])
            }
            }
          })
    }
  
  
  activateCampaign(id: string, campaign_id: number, type: string, budgetEnded: boolean) {
    if (budgetEnded === false) {
      
      /* this.loader = true */
      /* setTimeout(() => { */
        this.spinner.message = "Activation de la campagne en cours"
      this.youtubeService.enableCampaign(id, campaign_id).then(res_activate => {
          if (res_activate === "ok") {
            /* this.spinner.message = "Campagne activée avec succès"
            this.loader = false */
            
          }
        })
      /* },500) */
    }
  }

  loader: boolean = false
  pauseCampaign(id: string, campaign_id: number, type: string, budgetEnded: boolean) {
    /*  this.loader = true
    setTimeout(() => { */
     /*  this.spinner.message = "Désactivation de la campagne en cours" */
    this.youtubeService.disableCampaign(id, campaign_id).then(res_activate => {
        if (res_activate === "ok") {
          /* this.spinner.message = "Campagne déactivée avec succès"
          this.loader = false */
          
        }
      })
    /* },500) */
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
    if (this.currentCampaignToDeleteIsUsedPack || this.currentCampaignToDeleteUsePromoCode) {

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
      
    } else {


      if (this.currentCampaignIdToDelete === 0) {
       this.youtubeService.deleteCampaign(this.currentCampaignIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
      
         }
       })
     } else {
       this.youtubeService.removeCampaign(this.currentCampaignIdFirebaseToDelete, this.currentCampaignIdToDelete, this.currentAdGroupIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
               this.restituteFundsBeforeRemove(this.currentCampaignStartDateToDelete, this.currentCampaignEndDateToDelete, this.currentCampaignBudgetToDelete, this.currentCampaignDailyBudgetToDelete, this.currentCampaignNumberOfDaysToDelete).then(res_restitute => {
             if (res_restitute === "ok") {
             
             } else {
       
               alert('Une erreur est survenue')
           }
         })
           
         }
       })
     } 
      
 

    }

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
