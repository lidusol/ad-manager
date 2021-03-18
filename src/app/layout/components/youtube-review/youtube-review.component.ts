import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { Display, Ads } from 'src/app/campaigns-management/models/youtube.models';
import { MdePopoverTrigger, MdePopover } from '@material-extended/mde';
import { AuthService } from 'src/app/auth/auth.service';
import { SeoService } from 'src/app/seo.service';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { DialogComponent, PositionDataModel } from '@syncfusion/ej2-angular-popups';
import {Account, User_Role, DISPLAY_ADS, NATIVE_ADS_TO_PUBLISH, RESPONSIVE_DISPLAY_ADS} from '../../../utils/data'
import { PublishCampaignComponent } from '../publish-campaign/publish-campaign.component';
import { CURRENCY, SERVER } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { CmpYoutubeRecapComponent } from '../single/cmp-youtube-recap/cmp-youtube-recap.component';
/* import { PlacementsOverviewRecapComponent } from '../placements-overview-recap/placements-overview-recap.component'; */
import {take} from 'rxjs/operators'
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { ChannelsOverviewRecapComponent } from '../channels-overview-recap/channels-overview-recap.component';
import { ResponsiveDisplayPreviewSimulationComponent } from '../native-tools/responsive-display-preview-simulation/responsive-display-preview-simulation.component';
import { GeoPerformanceReportSingleComponent } from '../geo-performance-report-single/geo-performance-report-single.component';
import { AgePerformanceReportSingleComponent } from '../age-performance-report-single/age-performance-report-single.component';
import { GenderPerformanceReportSingleComponent } from '../gender-performance-report-single/gender-performance-report-single.component';
import { ChartReviewComponent } from '../chart-review/chart-review.component';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'adf-youtube-review',
  templateUrl: './youtube-review.component.html',
  styleUrls: ['./youtube-review.component.scss']
})
export class YoutubeReviewComponent implements OnInit {
  public campaignData: Display[] = [];
  cid: string = undefined;
  uid: string = undefined;
  aacid: string = undefined;
  isLoading = true;
  DEFAULT_CLIENT_CUSTOMER_ID = SERVER.CLIENT_CUSTOMER_ID
  public initialPage: PageSettingsModel= { pageSize: 5 };

     public selectedOptionStats1 = { text: 'Clics', value: 'clicks' }
  public selectedOptionStats3 = { text: 'Impressions', value: 'impressions' }
  public selectedOptionStats2   = { text: 'Dépenses', value: 'costs' }
    statsOptions = [
      { text: 'Clics', value: 'clicks' },
      { text: 'Impressions', value: 'impressions' },
    { text: 'Dépenses', value: 'costs' },
    { text: 'Ctr', value: 'ctr' },
    { text: 'Interactions', value: 'interactions' },
    { text: 'Conversions', value: 'conversions' },
    { text: 'Taux de conversion', value: 'convRate' },
  ]

   compareStats(o1: any, o2: any): boolean {
    return o1.text.toString() === o2.text.toString() && o1.value.toString() === o2.value.toString();
  }
   compareStats2(o1: any, o2: any): boolean {
    return o1.value === o2.value && o1.text === o2.text;
  }
   @ViewChild(SpinnerComponent, { static: false }) spinner: SpinnerComponent
  @ViewChild('campaignConfirmDelete', { static: false }) campaignConfirmDelete: DialogComponent 
  @ViewChild(CmpYoutubeRecapComponent, { static: false }) displayRecapComponent: CmpYoutubeRecapComponent
  @ViewChild(GeoPerformanceReportSingleComponent, {static: false}) geoSingle: GeoPerformanceReportSingleComponent 
  @ViewChild(AgePerformanceReportSingleComponent, {static: false}) ageSingle: AgePerformanceReportSingleComponent
  @ViewChild(GenderPerformanceReportSingleComponent, {static: false}) genderSingle: GenderPerformanceReportSingleComponent
  @ViewChild(ChartReviewComponent, {static: false}) chartReview: ChartReviewComponent
  defaulClientCustomerId =  SERVER.CLIENT_CUSTOMER_ID
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
  @ViewChild('dialogNoEnoughFounds', { static: false }) dialogNoEnoughFounds: DialogComponent
  @ViewChild('dialogPreviewSimulation', { static: false }) dialogPreviewSimulation: DialogComponent
  
  @ViewChild(PublishCampaignComponent, { static: false }) publishCampaignComponent: PublishCampaignComponent;
  @ViewChild('dialogPublishWithCodePromo', {static: false}) dialogPublishWithCodePromo: DialogComponent
   @ViewChild('dialogPublishChoose', { static: false }) dialogPublishChoose: DialogComponent
  @ViewChild(ChannelsOverviewRecapComponent, { static: false }) channelsOverviewrecap: ChannelsOverviewRecapComponent
  @ViewChild(ResponsiveDisplayPreviewSimulationComponent, {static: false}) simulationComponent: ResponsiveDisplayPreviewSimulationComponent
  @ViewChild(MdePopoverTrigger, { static: false }) popover: MdePopoverTrigger;
  @ViewChild(MdePopover, { static: false }) popoverComponent: MdePopover;
  constructor( public translate: TranslateService, private route: ActivatedRoute, private youtubeService: YoutubeService,  private auth: AuthService, private router: Router, private seo: SeoService, private storageService: LocalStorageService, private accountsService: AccountsService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    translate.use('en');
   }
  
  ngOnInit(): void {
    
  }

  uid_action: string = ""
  user_access: User_Role = undefined

  ads: Ads[] = []
  nativeAds: NATIVE_ADS_TO_PUBLISH[] = []
  nativeAdsPublished: RESPONSIVE_DISPLAY_ADS[] = []
  currentImagesDisplay: DISPLAY_ADS[] = []

  @ViewChild(SnackbarComponent, { static: false }) appSnackbar: SnackbarComponent
   openSnackBar(timeout: number, message: string, action: string, css: string) {
    this.appSnackbar.openSnackBar(timeout, message, action, css)
  }

  previewSimulationNotPublished(ad: NATIVE_ADS_TO_PUBLISH) {
    this.dialogPreviewSimulation.show()
    setTimeout(() => {
      this.simulationComponent.data__PB = ad
      // this.simulationComponent.triggerSimulation()
    },500)
  }
  showPublishPopup: boolean = false
  hidePublishPopup(){
    this.showPublishPopup = false
  }
  isPayed: boolean = false
  isComplete: boolean = false
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.initialPage = { pageSize: 5 };
    this.storageService.getUserIdAndAccountId().then(response => {
      if (response !== null) {
        this.user_access = response.role
        this.route.queryParams.subscribe(params => {
        this.cid = params['cid'];
        this.uid = params['auid'];
        this.aacid = params['aacid']
          if (this.cid !== undefined && this.uid !== undefined && this.aacid !== undefined && this.aacid === response.aacid && this.uid === response.auid) {
            this.account_value = response.account.account_value
            this.accountsService.getListAccounts(response.account.owner).pipe(take(1)).subscribe(accounts => {
              this.CURRENT_ACCOUNT = accounts.find(account => account.id === response.aacid)
              this.account_value = this.CURRENT_ACCOUNT.account_value
              this.accountId = this.CURRENT_ACCOUNT.id
              if (response.fromOwned) {
                this.uid_action = response.auid
                this.getCampaignData()/* .pipe(take(1)) */.subscribe(campaign => {
                  this.campaignData = []
                  this.campaignData.push(campaign)
                  //console.log(this.campaignData)
                  
                  this.isPayed = campaign.isPayed
                  this.isComplete = campaign.isComplete
                  this.currentImagesDisplay = campaign.images?campaign.images:[]
                  this.nativeAds = campaign.imagesNative?campaign.imagesNative:[]
                  
                   if (campaign.id_campagne === 0) {
                     this.isLoading = false
                     this.playAudio()
                    
                   } else {
                     
                     setTimeout(() => {
                       this.channelsOverviewrecap.campaign_id = campaign.id_campagne
                       this.channelsOverviewrecap.getData()
                       this.geoSingle.aacid = response.aacid
                       this.geoSingle.uid = response.auid
                       this.geoSingle.campaignId = campaign.id_campagne
                       this.geoSingle.getGeoPerformanceReportData()
  
                       this.ageSingle.aacid = response.aacid
                       this.ageSingle.uid = response.auid
                       this.ageSingle.campaignId = campaign.id_campagne
                       this.ageSingle.getAgePerformanceReportData()
  
                       this.genderSingle.aacid = response.aacid
                       this.genderSingle.uid = response.auid
                       this.genderSingle.campaignId = campaign.id_campagne
                       this.genderSingle.getGendersPerformanceReportData()
                     }, 1500);
                    this.youtubeService.getListDisplayAdsFormACampaign(this.aacid, campaign.ad_group_id)/* .pipe(take(1)) */.subscribe(data => {
                      this.ads = data
                      this.youtubeService.getListResponsiveDisplayAdsFormACampaign(this.aacid, campaign.ad_group_id)/* .pipe(take(1)) */.subscribe(dataResponsive => {
                       this.nativeAdsPublished =  dataResponsive
                    this.isLoading = false
         })
                    
         })
                  }
            
                  
                })
              
              } else {
                this.uid_action = response.account.owner
                this.getCampaignData()/* .pipe(take(1)) */.subscribe(campaign => {
                  this.campaignData = []
                  this.campaignData.push(campaign)
                  this.isPayed = campaign.isPayed
                  this.isComplete = campaign.isComplete
                  //console.log(this.campaignData)
                   this.currentImagesDisplay = campaign.images?campaign.images:[]
                  this.nativeAds = campaign.imagesNative?campaign.imagesNative:[]
                  if (campaign.id_campagne === 0) {
                    
                    this.isLoading = false
                    this.playAudio()
                    
                  } else {
                    setTimeout(() => {
                      this.channelsOverviewrecap.campaign_id = campaign.id_campagne
                      this.channelsOverviewrecap.getData()
                      this.geoSingle.aacid = response.aacid
                      this.geoSingle.uid = response.auid
                      this.geoSingle.campaignId = campaign.id_campagne
                      this.geoSingle.getGeoPerformanceReportData()
  
                      this.ageSingle.aacid = response.aacid
                      this.ageSingle.uid = response.auid
                      this.ageSingle.campaignId = campaign.id_campagne
                      this.ageSingle.getAgePerformanceReportData()
  
                      this.genderSingle.aacid = response.aacid
                      this.genderSingle.uid = response.auid
                      this.genderSingle.campaignId = campaign.id_campagne
                      this.genderSingle.getGendersPerformanceReportData()
                     }, 500);
                    this.youtubeService.getListDisplayAdsFormACampaign(this.aacid, campaign.ad_group_id)/* .pipe(take(1)) */.subscribe(data => {
                                  this.youtubeService.getListResponsiveDisplayAdsFormACampaign(this.aacid, campaign.ad_group_id)/* .pipe(take(1)) */.subscribe(dataResponsive => {
                                    this.ads = data
                       this.nativeAdsPublished =  dataResponsive
                    this.isLoading = false
         })
                     
  
            
            /* this.gridCampaign.refresh() */
            /* this.accountsService.getListAccounts(this.uid).subscribe(accounts => {
              this.accounts = accounts
            }) */
         })
                  }
                  
                })
            }
            })
      
          } else {
             this.router.navigate(['/campaigns'], {queryParams: {auid: response.auid, aacid: response.aacid}})
        }
      })
        
      }
    })
  }

  getCampaignData() {
   return  this.youtubeService.getCampaign(this.cid).snapshotChanges().pipe(
      map((actions) => {
        const data = actions.payload.data();
      
        return { id: actions.payload.id, ...data };
      })
    );
  
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

  budgetPanelOutputAction(close: boolean) {
    if (close) {
      this.popover.closePopover()
      this.refreshData()
    }
  }

  goSettings() {
    this.router.navigate(['/campaigns/settings/native'], {queryParams: {cid: this.cid, auid: this.uid, aacid: this.aacid}})
  }

  activateCampaign(id: string, campaign_id: number, type: string, budgetEnded: boolean) {
    if (budgetEnded === false) {
      
      this.youtubeService.enableCampaign(id, campaign_id).then(res_activate => {
        if (res_activate === "ok") {
          this.openSnackBar(15, "Campagne activée avec succès !", "ok", "snack-danger")
          this.refreshData()
        } else {
          this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
        }
      }).catch((e) => {
        this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
      })
    }

  }
  playAudio() {
   /*  let audio = new Audio();
    audio.src = "assets/notifications/swiftly.mp3";
    audio.load();
    audio.play(); */
    this.showPublishPopup = true
  }
    refreshData(){
 this.getCampaignData()/* .pipe(take(1)) */.subscribe(campaign => {
                this.campaignData = []
                this.campaignData.push(campaign)
                //console.log(this.campaignData)
   this.isPayed = campaign.isPayed;
   this.isComplete = campaign.isComplete

    this.currentImagesDisplay = campaign.images?campaign.images:[]
                this.nativeAds = campaign.imagesNative?campaign.imagesNative:[]
                 if (campaign.id_campagne === 0) {
                   this.isLoading = false
                   this.playAudio()
                   
                   
                 } else {
                   setTimeout(() => {
                     /* this.placementOverviewrecap.campaign_id = campaign.id_campagne
                     this.placementOverviewrecap.getData() */
                   }, 500);
                   this.youtubeService.getListDisplayAdsFormACampaign(this.aacid, campaign.ad_group_id)/* .pipe(take(1)) */.subscribe(data => {
                                this.youtubeService.getListResponsiveDisplayAdsFormACampaign(this.aacid, campaign.ad_group_id)/* .pipe(take(1)) */.subscribe(dataResponsive => {
                                  this.ads = data
                     this.nativeAdsPublished =  dataResponsive
                  this.isLoading = false
       })
                  

          
          /* this.gridCampaign.refresh() */
          /* this.accountsService.getListAccounts(this.uid).subscribe(accounts => {
            this.accounts = accounts
          }) */
       })
   }
   
                
              })
    }
  loader: boolean = false
  pauseCampaign(id: string, campaign_id: number, type: string, budgetEnded: boolean) {
this.youtubeService.disableCampaign(id, campaign_id).then(res_activate => {
  if (res_activate === "ok") {
       this.openSnackBar(15, "Campagne mise en veille !", "ok", "snack-danger")
          this.refreshData()
          
  } else {
    this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
        }
}).catch((e) => {
        this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
      })
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
           this.openSnackBar(15, "Campagne supprimée !", "ok", "snack-danger")
          this.loader = false
   
          
         } else {
           this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
         }
       }).catch((e) => {
         this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
       })
     } else {
       this.youtubeService.removeCampaign(this.currentCampaignIdFirebaseToDelete, this.currentCampaignIdToDelete, this.currentAdGroupIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
          this.openSnackBar(15, "Campagne supprimée !", "ok", "snack-danger")
               this.loader = false
             
            
           
         } else {
           this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
         }
       }).catch((e) => {
         this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
       })
     } 
      
    
      
    } else {
      if (this.currentCampaignIdToDelete === 0) {
       this.youtubeService.deleteCampaign(this.currentCampaignIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
          
          this.openSnackBar(15, "Campagne supprimée !", "ok", "snack-danger")
          
         } else {
           this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
         }
       }).catch((e) => {
         this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
       })
     } else {
       this.youtubeService.removeCampaign(this.currentCampaignIdFirebaseToDelete, this.currentCampaignIdToDelete, this.currentAdGroupIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
               this.restituteFundsBeforeRemove(this.currentCampaignStartDateToDelete, this.currentCampaignEndDateToDelete, this.currentCampaignBudgetToDelete, this.currentCampaignDailyBudgetToDelete, this.currentCampaignNumberOfDaysToDelete).then(res_restitute => {
                 if (res_restitute === "ok") {
               this.openSnackBar(15, "Campagne supprimée !", "ok", "snack-danger")
               this.loader = false
             
                 } else {
                   this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
               this.loader = false
               alert('Une erreur est survenue')
           }
               }).catch((e) => {
           this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
         })
           
         }
       }).catch((e) => {
         this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
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
     selectHighlightEnter(id: string) {
    document.getElementById(id).classList.add('highlight')
  }
  selectHighlightLeave(id: string) {
     document.getElementById(id).classList.remove('highlight')
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
      console.log(this.CURRENT_ACCOUNT)
       
          if (this.CURRENT_ACCOUNT !== undefined && this.CURRENT_ACCOUNT !== null) {
            this.account_value = this.CURRENT_ACCOUNT.account_value
            this.accountId = this.CURRENT_ACCOUNT.id
            resolve('ok')
            
          }
     
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
  
      spinnerPublication: boolean = false
      useAccountValueForPack() {
        this.spinnerPublication = true
        this.showPublishPopup = false
        this.getAccountValue().then(get => {
          if (get === 'ok') {
               if (this.account_value  >= this.currentBudget) {     
                  this.publishCampaignComponent.isTestPack=true
                  this.publishCampaignComponent.email = this.email
                  this.publishCampaignComponent.uid = this.uid_action
                  this.publishCampaignComponent.account_value = this.account_value
                  this.publishCampaignComponent.injectedDataYoutube = this.currentInjectedData
                this.publishCampaignComponent.publishYoutubeExpressCampaign().then(published => {
                  if (published === "ok") {
                    this.spinnerPublication = false
                     this.dialogPublishChoose.hide()
                  } else {
                    this.spinnerPublication = false
                    this.showPublishPopup = true
                    }
                }).catch((e) => {
                  this.spinnerPublication = false
                  this.showPublishPopup = true
                  })
                
    
              } else {
                 this.spinnerPublication = false
                 this.showPublishPopup = true
              this.openDialog()
              
            }
            
          } else {
            this.spinnerPublication = false
            this.showPublishPopup = true
          }
        })
     
     
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
     this.publishCampaign(this.currentInjectedData)
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
    this.publishCampaign(this.currentInjectedData)
  }
  
   publishCampaign(injectedData: Display) {
    let start = new Date(injectedData.startDateEnglish)
    start.setHours(0, 0, 0, 0)
    let today = new Date()
    today.setHours(0,0,0,0)
    if (start >= today) {
      this.currentInjectedData = injectedData
      this.currentBudget = injectedData.realBudget
      this.currentCampaignSaveId = injectedData.id
      this.currentCampaignIsUsedPack = injectedData.isUsedPack
      this.currentCampaignPackType = injectedData.packType
      this.currentCampaignType = injectedData.type
       this.currentCampaignisExpress = injectedData.isExpress
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
