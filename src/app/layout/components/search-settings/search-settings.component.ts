import { Component, OnInit, ViewChild } from '@angular/core';
import { Display } from 'src/app/campaigns-management/models/youtube.models';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/campaigns-management/services/search.service';
import { PositionDataModel } from '@syncfusion/ej2-popups';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { PublishCampaignComponent } from '../publish-campaign/publish-campaign.component';
import { CURRENCY, SERVER } from 'src/environments/environment';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Account, User_Role, NATIVE_ADS_TO_PUBLISH, RESPONSIVE_DISPLAY_ADS, AdToDelete, SEARCH_ADS_BEFORE_UPLOAD, KEYWORDS_TARGET, SEARCH_ADS, adDispalyError } from '../../../utils/data'
import { AccountsService } from 'src/app/accounts/accounts.service';
import { LocalStorageService } from '../../services/local-storage.service';
import {take} from 'rxjs/operators'
import { CmpNativeAdsCreatorComponent } from '../single/cmp-native-ads-creator/cmp-native-ads-creator.component';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ResponsiveDisplayPreviewSimulationComponent } from '../native-tools/responsive-display-preview-simulation/responsive-display-preview-simulation.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { ResponsiveSearchAd, Search } from 'src/app/campaigns-management/models/search.models';
import { CmpSearchAdsCreatorComponent } from '../single/cmp-search-ads-creator/cmp-search-ads-creator.component';
import { CmpKeywordsSelectorComponent } from '../single/cmp-keywords-selector/cmp-keywords-selector.component';
import { CallExtensionSetupComponent } from '../search-tools/call-extension-setup/call-extension-setup.component';

@Component({
  selector: 'adf-search-settings',
  templateUrl: './search-settings.component.html',
  styleUrls: ['./search-settings.component.scss']
})
export class SearchSettingsComponent implements OnInit {

  public campaignData: Search[] = [];
  cid: string = undefined;
  uid: string = undefined;
  aacid: string = undefined;
  campaignId: number = null
 
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
  @ViewChild('dialogNoEnoughFounds', {static: false}) dialogNoEnoughFounds: DialogComponent
  @ViewChild(PublishCampaignComponent, { static: false }) publishCampaignComponent: PublishCampaignComponent;
  @ViewChild('dialogPublishWithCodePromo', {static: false}) dialogPublishWithCodePromo: DialogComponent
  @ViewChild('dialogPublishChoose', { static: false }) dialogPublishChoose: DialogComponent
  @ViewChild(CmpNativeAdsCreatorComponent, { static: false }) nativeAdsCreator: CmpNativeAdsCreatorComponent;
  @ViewChild('dialogPreviewSimulation', { static: false }) dialogPreviewSimulation: DialogComponent
  @ViewChild(ResponsiveDisplayPreviewSimulationComponent, {static: false}) simulationComponent: ResponsiveDisplayPreviewSimulationComponent
  @ViewChild(SnackbarComponent, { static: false }) appSnackbar: SnackbarComponent;
  @ViewChild(CallExtensionSetupComponent, { static: false }) appCall: CallExtensionSetupComponent;

  constructor(private route: ActivatedRoute, private searchService: SearchService, private router: Router, private accountsService: AccountsService, private storageService: LocalStorageService) { }

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

    this.searchService.changeAdStatus(id, ad_group_id, ad_id, status).then(res_status => {
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
    // if(this.adsNotPublishedToDelete.length>0){
    //    this.searchService.removeDisplayAdsNotPublished(this.adsNotPublishedToDelete).then(res_remove => {
    //        //console.log(res_remove)
    //       if (res_remove === "ok") {
    //         //this.spinner.message = "Visuel supprimé avec succés"
    //         //this.loaderEdit = false
    //         this.adsPublishedToDelete = []
    //         this.adsNotPublishedToDelete = []
    //         this.confirmDeleteDialog.hide()
    //         this.getAdsData()
           
    //         this.openSnackBar(15, 'Suppression éffectuée avec succès', 'ok', 'snack-success')
            
         
    //       } else {
    //         //this.loaderEdit = false
    //        this.openSnackBar(15, 'Une erreur est survenue', 'fermer', 'snack-warn')
    //    }

    //      }).catch((e) => {
    //        //this.loaderEdit = false
    //        this.openSnackBar(15, 'Une erreur est survenue', 'fermer', 'snack-warn')
    //   });
    // }else{

    //   this.searchService.removeResponsiveDisplayAd(this.adsPublishedToDelete).then(res_remove => {
    //        //console.log(res_remove)
    //       if (res_remove === "ok") {
    //         //this.spinner.message = "Visuel supprimé avec succés"
    //         //this.loaderEdit = false
    //         this.adsPublishedToDelete = []
    //         this.adsNotPublishedToDelete = []
    //         this.confirmDeleteDialog.hide()
    //         this.getAdsData()
           
    //         this.openSnackBar(15, 'Suppression éffectuée avec succès', 'ok', 'snack-success')
            
         
    //       } else {
    //         //this.loaderEdit = false
    //        this.openSnackBar(15, 'Une erreur est survenue', 'fermer', 'snack-warn')
    //    }

    //      }).catch((e) => {
    //        //this.loaderEdit = false
    //        this.openSnackBar(15, 'Une erreur est survenue', 'fermer', 'snack-warn')
    //   });
    // }
  }
   openSnackBar(timeout: number, message: string, action: string, css: string) {
    this.appSnackbar.openSnackBar(timeout, message, action, css)
  }
  detectAddedNewAd(ads: NATIVE_ADS_TO_PUBLISH[]) {
    if(this.campaignId=== 0) {
      this.notPublishedAds = [...this.notPublishedAds, ...ads]
      this.nativeAdsCreator.native_before_upload = []
      this.nativeAdsCreator.abortOperation()
  this.searchService.updateCampaign(this.cid, { imagesNative: this.notPublishedAds }).then(updated => {
    if (updated === 'ok') {
           this.openSnackBar(15, "Campagne mis à jour avec succès !", 'ok', 'snack-success')
    } else {
       this.openSnackBar(15, 'Une erreur est survenue, réessayez', 'fermer', 'snack-warn')
        }
  }).catch((e) => {
         this.openSnackBar(15, 'Une erreur est survenue, réessayez', 'fermer', 'snack-warn')
      })
    }else{
      // this.searchService.addNewAdResponsive(this.uid, this.aacid, this.ad_group_id, this.url, ads).then(ad_added => {
      //   if (ad_added === 'ok') {
      //     this.getAdsData()
      //     this.nativeAdsCreator.native_before_upload = []
      //     this.nativeAdsCreator.abortOperation()
      //     this.openSnackBar(15, "Campagne mis à jour avec succès !", 'ok', 'snack-success')
      //   } else {
      //      this.openSnackBar(15, 'Une erreur est survenue, réessayez', 'fermer', 'snack-warn')
      //   }
      // }).catch((e) => {
      //    this.openSnackBar(15, 'Une erreur est survenue, réessayez', 'fermer', 'snack-warn')
      // })
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
  publishedAds: ResponsiveSearchAd[] = []
  notPublishedAds: SEARCH_ADS_BEFORE_UPLOAD[] = []
    getAdsData():Promise<string>{
      return new Promise(resolve => {
      this.searchService.getListDisplayAdsFormACampaign(this.aacid, this.ad_group_id).pipe(take(1)).subscribe(data => {
        this.publishedAds = data
          resolve('ok')
       })
    })
  }
  ad_group_id: number = 0
  url: string = ""
  ad_group_id_firebase: string = ''
    getCampaignData() {
   
     this.searchService.getCampaign(this.cid).snapshotChanges().pipe(take(1)).subscribe(_campaign_ => {
       if (_campaign_ === undefined && _campaign_!==null) {
              this.router.navigate(['/campaigns'])
          } else {
            let campaign: Search = {id: _campaign_.payload.id, ..._campaign_.payload.data()}
              this.campaignData = []
            this.campaignData.push(campaign)
         this.campaignId = campaign.id_campagne
         this.ad_group_id = campaign.ad_group_id
         this.ad_group_id_firebase = campaign.ad_group_id_firebase
         this.url = campaign.urlPromote
         this.notPublishedAds = campaign.text_ads?campaign.text_ads:[]
         this.appCall.user_access = this.user_access
         this.appCall.showSaveBlock = true
         this.appCall.campaignId = campaign.id_campagne
         this.appCall.cid = campaign.id
         if(campaign.callExtension!==undefined && campaign.callExtension!==null){
          this.appCall.PHONE_DATA = campaign.callExtension
          this.appCall.PREVIOUS_DATA = campaign.callExtension
           this.appCall.selectedCountry = campaign.callExtension.country
           this.appCall.phone.setValue(campaign.callExtension.phoneInfo.nationalNumber)
         }
         this.keywordsComponent.campaignId = campaign.id_campagne
         this.keywordsComponent.cid = campaign.id
         this.keywordsComponent.user_access = this.user_access
         this.keywordsComponent.ad_group_id_firebase = campaign.ad_group_id_firebase
         this.keywordsComponent.ad_group_id = campaign.ad_group_id
         this.keywordsComponent.showSaveBlock = true
         if(this.campaignId===0){
           setTimeout(()=>{
             this.keywordsComponent.presetKeywords(campaign.keywords)

           },500)
          } else {
               this.searchService.getAdGroupKeywordsValue(campaign.id_campagne, campaign.ad_group_id).then((res)=>{
                if(res==='ok'){
                  this.publishedKeywords =  this.searchService.currentAdGroupTargetedKeywords
                  this.keywordsComponent.CURRENT_AD_GROUP_KEYWORDS = this.searchService.currentAdGroupTargetedKeywords
                  this.keywordsComponent.presetKeywords(this.searchService.currentAdGroupTargetedKeywords)
                  this.getAdsData()
                }else{
                  this.getAdsData()
                }
               })
         }
            if (campaign.budgetEnded) {
              this.router.navigate(['/campaigns'])
            }
            }
          })
    }
  
  publishedKeywords: KEYWORDS_TARGET[] = []
  activateCampaign(id: string, campaign_id: number, type: string, budgetEnded: boolean) {
    if (budgetEnded === false) {
      
      /* this.loader = true */
      /* setTimeout(() => { */
        this.spinner.message = "Activation de la campagne en cours"
      this.searchService.enableCampaign(id, campaign_id).then(res_activate => {
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
    this.searchService.disableCampaign(id, campaign_id).then(res_activate => {
        if (res_activate === "ok") {
          /* this.spinner.message = "Campagne déactivée avec succès"
          this.loader = false */
          
        }
      })
    /* },500) */
  }
  adToRemove: AdToDelete[] = [];
  removeAd(ad: ResponsiveSearchAd){
    this.adToRemove.push({
      id: ad.id,
      ad_id: ad.ad_id,
      ad_group_id: ad.ad_group_id
    })
    this.adConfirmDelete.show()
  }
  deletionAborted(){
    this.adToRemove = []
    this.adConfirmDelete.hide()
  }

  confirmDeteteAd(){
    this.searchService.removeAd(this.adToRemove).then((removed)=>{
      if(removed==='ok'){
        this.adToRemove = []
        this.adConfirmDelete.hide()
        this.openSnackBar(5,'Annonce supprimée avec succès', 'ok', '')
        this.getAdsData()
      }else{
        this.adToRemove = []
        this.adConfirmDelete.hide()
        this.openSnackBar(5,'Une erreur est survenue veuillez rééssayer !', 'ok', '')
        this.getAdsData()
      }
    }).catch((e)=>{
      console.log(e)
      this.adToRemove = []
      this.adConfirmDelete.hide()
      this.openSnackBar(5,'Une erreur est survenue veuillez rééssayer !', 'ok', '')
      this.getAdsData()
    })
  }
  @ViewChild('adConfirmDelete', { static: false }) adConfirmDelete: DialogComponent

  toggleNewAdPublished(){
    if(!this.isAdPanel){
      this.isAdPanel = true
      setTimeout(()=>{
        this.searchCreator.url_promote_subject.next(this.campaignData[0].urlPromote)
        if(this.campaignId===0){
          this.searchCreator.KEYWORDS = this.campaignData[0].keywords

        }else{
          this.searchCreator.KEYWORDS = this.publishedKeywords
        }
      },500)

    }
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
   isAdPanel: boolean = false
   @ViewChild(CmpSearchAdsCreatorComponent, {static: false}) searchCreator: CmpSearchAdsCreatorComponent
   @ViewChild(CmpKeywordsSelectorComponent, {static: false}) keywordsComponent: CmpKeywordsSelectorComponent
   partialErrors: adDispalyError[] = []
   onSaveAd(ad: {type: string, ad: SEARCH_ADS_BEFORE_UPLOAD, editing_id: string}){
     console.log(ad)
     if(this.editingIndex===null){
       if(this.campaignId===0){
        this.notPublishedAds.push(ad.ad)
        this.searchCreator.resetComponent()
        this.searchService.updateCampaign(this.cid, {text_ads: this.notPublishedAds}).then(()=>{
          this.appSnackbar.openSnackBar(5, 'Annonce sauvegardée avec succès', 'ok', 'sanck-success')
          this.getCampaignData()
        }).catch((e)=>{
          this.appSnackbar.openSnackBar(5, "Nous n'avons pas pu sauvegarder votre annonce, veuillez rééssayer", 'ok', 'sanck-error')
          this.getCampaignData()
        })
      }else{
        this.searchCreator.resetComponent()
        this.searchService.addAdResponsiveSearchAd(this.uid_action, this.aacid, [ad.ad], this.ad_group_id).then((added)=>{
          this.partialErrors = added.partialErrors
          if(added.status==='ok'){
            this.appSnackbar.openSnackBar(5, 'Annonce sauvegardée avec succès', 'ok', 'sanck-success')
            this.getCampaignData()
          }else{
            this.appSnackbar.openSnackBar(5, "Nous n'avons pas pu sauvegarder votre annonce, veuillez rééssayer", 'ok', 'sanck-error')
            this.getCampaignData()
          }
        }).catch((e)=>{
          this.appSnackbar.openSnackBar(5, "Nous n'avons pas pu sauvegarder votre annonce, veuillez rééssayer", 'ok', 'sanck-error')
          this.getCampaignData()
        })
      }
     }else if(this.editingIndex!==null){
       console.log(this.notPublishedAds[this.editingIndex])
          this.notPublishedAds[this.editingIndex] = ad.ad
          this.editingIndex = null
          this.searchCreator.resetComponent()
          this.searchService.updateCampaign(this.cid, {text_ads: this.notPublishedAds}).then(()=>{
            this.appSnackbar.openSnackBar(5, 'Annonce modifiée avec succès', 'ok', 'sanck-success')
            this.getCampaignData()
          }).catch((e)=>{
            this.appSnackbar.openSnackBar(5, "Nous n'avons pas pu sauvegarder votre annonce, veuillez rééssayer", 'ok', 'sanck-error')
            this.getCampaignData()
          })
        
     }
   }
   editingIndex: number = null
   editNotPublishedSearch(ad: SEARCH_ADS_BEFORE_UPLOAD, index: number){
    this.isAdPanel = true
    setTimeout(()=>{
      this.editingIndex = index
      this.searchCreator.search_before_upload.push(ad)
      this.searchCreator.editSearchBeforeUpload(ad, 0)
    },500)
   }
   deleteNotPublishedSearch(ad: SEARCH_ADS_BEFORE_UPLOAD, index: number){
    this.notPublishedAds.splice(index, 1)
    this.searchService.updateCampaign(this.cid, {text_ads: this.notPublishedAds}).then(()=>{
      this.appSnackbar.openSnackBar(5, 'Annonce supprimée avec succès', 'ok', 'sanck-success')
      this.getCampaignData()
    }).catch((e)=>{
      this.appSnackbar.openSnackBar(5, "Nous n'avons pas pu supprimer votre annonce, veuillez rééssayer", 'ok', 'sanck-error')
      this.getCampaignData()
    })
   }
    deletionConfirmed() {
    this.campaignConfirmDelete.hide()
    if (this.currentCampaignToDeleteIsUsedPack || this.currentCampaignToDeleteUsePromoCode) {

      if (this.currentCampaignIdToDelete === 0) {
       this.searchService.deleteCampaign(this.currentCampaignIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
          this.loader = false
   
          
         }
       })
     } else {
       this.searchService.removeCampaign(this.currentCampaignIdFirebaseToDelete, this.currentCampaignIdToDelete, this.currentAdGroupIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
       
               this.loader = false
             
            
           
         }
       })
     } 
      
    } else {


      if (this.currentCampaignIdToDelete === 0) {
       this.searchService.deleteCampaign(this.currentCampaignIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
      
         }
       })
     } else {
       this.searchService.removeCampaign(this.currentCampaignIdFirebaseToDelete, this.currentCampaignIdToDelete, this.currentAdGroupIdFirebaseToDelete).then(res_delete => {
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
