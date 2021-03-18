import { Component, Inject, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { TranslateService } from '@ngx-translate/core';

import { Account, ages, AGES_TYPE, CHANNEL_DATA, CHANNEL_FORMAT, DEVICE_INTERFACE, DISPLAY_ADS, genders, GENDERS_TYPE, LOCATION, NATIVE_ADS_TO_PUBLISH, OBJECTIVES, OBJECTIVES_DATA, PHONE_TYPE, PLACEMENT_TYPE, SCHEDULE_INTERFACE, SEARCH_ADS_BEFORE_UPLOAD, USER_INTEREST, User_Role, WEBSITE, YOUTUBE_CHANNELS_INTERFACE, YOUTUBE_VIDEOS_INTERFACE } from 'src/app/utils/data';
import { SERVER } from 'src/environments/environment';
import { Display } from 'src/app/campaigns-management/models/display.models';
import { Display as Native } from 'src/app/campaigns-management/models/youtube.models';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { SearchService } from 'src/app/campaigns-management/services/search.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';

import firebase from 'firebase/app';

import { Search } from 'src/app/campaigns-management/models/search.models';

import { LangService } from '../lang.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { CallExtensionSetupComponent } from '../search-tools/call-extension-setup/call-extension-setup.component';
import { CmpAdsUploaderComponent } from '../single/cmp-ads-uploader/cmp-ads-uploader.component';
import { CmpBidsComponent } from '../single/cmp-bids/cmp-bids.component';
import { CmpBudgetComponent } from '../single/cmp-budget/cmp-budget.component';
import { CmpDatesComponent } from '../single/cmp-dates/cmp-dates.component';
import { CmpDemographicTargetComponent } from '../single/cmp-demographic-target/cmp-demographic-target.component';
import { CmpKeywordsSelectorComponent } from '../single/cmp-keywords-selector/cmp-keywords-selector.component';
import { CmpLandingPageComponent } from '../single/cmp-landing-page/cmp-landing-page.component';
import { CmpNameComponent } from '../single/cmp-name/cmp-name.component';
import { CmpNativeAdsCreatorComponent } from '../single/cmp-native-ads-creator/cmp-native-ads-creator.component';
import { CmpPackChooserComponent } from '../single/cmp-pack-chooser/cmp-pack-chooser.component';
import { CmpPlacementTargetComponent } from '../single/cmp-placement-target/cmp-placement-target.component';
import { CmpSchedulesComponent } from '../single/cmp-schedules/cmp-schedules.component';
import { CmpSearchAdsCreatorComponent } from '../single/cmp-search-ads-creator/cmp-search-ads-creator.component';
import { CmpStatusComponent } from '../single/cmp-status/cmp-status.component';
import { CmpZonesComponent } from '../single/cmp-zones/cmp-zones.component';
import { YoutubeChannelsSelectorComponent } from '../single/youtube-channels-selector/youtube-channels-selector.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PublishCampaignComponent } from '../publish-campaign/publish-campaign.component';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { take } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CmpUserInterestComponent } from '../cmp-user-interest/cmp-user-interest.component';
import { CmpDeviceTargetComponent } from '../cmp-device-target/cmp-device-target.component';

@Component({
  selector: 'adf-new-campaign-selector',
  templateUrl: './new-campaign-selector.component.html',
  styleUrls: ['./new-campaign-selector.component.scss']
})
export class NewCampaignSelectorComponent implements OnInit {
  objectives: OBJECTIVES[] = OBJECTIVES_DATA

  ads_channel: CHANNEL_FORMAT[] = CHANNEL_DATA
  frame1: boolean = true;
  frame2: boolean = false;
  frame3: boolean = false;
  frame4: boolean = false;
  defaultDemoConfig: boolean = true;
  defaultPlacementsConfig: boolean = true;
  defaultSchedulesConfig: boolean = true;
  defaultCallExtConfig: boolean = false;
  adsBlock: boolean = false;
  ages = ages()
  genders = genders()
  public DEFAULT_BID: number = 0.1
  public BID_MODEL: string = "CPM"
  public showSpinnerPotential: boolean = false
  public showSpinnerBid: boolean = false
  public isZoneTargetedDefault: boolean = true
  public isZoneTargetedAll: boolean = false
  public hasZoneTargeted: boolean = false
  public hasZoneExcluded: boolean = false
  public hasPlacements: boolean = false
  public canShowNav: boolean = true

/* CAMPAIGN DATA */
  NAME: string = ""
  LANDING_PAGE: string = ""
  STATUS: string = "ENABLED"
  START_DATE: string = ""
  END_DATE: string = ""
  START_DATE_ENGLISH: string = ""
  END_DATE_ENGLISH: string = ""
  START_DATE_FRENCH: string = ""
  END_DATE_FRENCH: string = ""
  START_DATE_FORMATTED_GOOGLE: string = ""
  END_DATE_FORMATTED_GOOGLE: string = ""
  NUMBER_OF_DAYS: number = 0
  TARGETED_LOCATIONS: LOCATION[] = []
  EXCLUDED_LOCATIONS: LOCATION[] = []
  DAILY_BUDGET: number = 0
  TOTAL_BUDGET: number = 0
  REAL_DAILY_BUDGET: number = 0
  REAL_TOTAL_BUDGET: number = 0
  TOTAL_IMPRESSIONS: number = 0
  TOTAL_CLICS: number = 0
  TARGETED_PLACEMENTS: PLACEMENT_TYPE[] = []
  EXCLUDED_PLACEMENTS: PLACEMENT_TYPE[] = []
  DEVICES: any = []
  AGES: AGES_TYPE[] = []
  GENDERS: GENDERS_TYPE[] = []
  SCHEDULES: SCHEDULE_INTERFACE[] = []
  IMAGES: DISPLAY_ADS[] = []
  optionLocationTargeted: string =''
  optionLocationExcluded: string = ''
  PACK_TYPE: string = ""
  PACK_VALUE: number = 0
  REAL_PACK_VALUE: number = 0
  new_created_display: Display[] = [];
  new_created_native: Native[] = [];
  new_created_search: Search[] = [];
  ACCOUNT_ID: string = ""
  uid_action: string = ""
  user_access: User_Role = undefined
  spinnerCreation: boolean = false
  YOUTUBE_CHANNELS: YOUTUBE_CHANNELS_INTERFACE[] = []
  YOUTUBE_VIDEOS: YOUTUBE_VIDEOS_INTERFACE[] = []
  WEBSITES: WEBSITE[] = []
  PHONE_DATA: PHONE_TYPE = null
  KEYWORDS: any = []
  currentInjectedDataDisplay: Display;
  currentInjectedDataNative: Native;
  currentInjectedDataSearch: Search;
  currentBudget: number = 0
  currentCampaignSaveId: string = ""
  currentCampaignIsUsedPack: boolean = false
  currentCampaignPackType: string = ""
  currentCampaignType: string = ""
  currentCampaignisExpress: boolean = false
  account_value: number = 0
  email: string = ""
  @ViewChild(CmpNameComponent, { static: false }) nameComponent: CmpNameComponent
  @ViewChild(CmpLandingPageComponent, { static: false }) landingPageComponent: CmpLandingPageComponent
  @ViewChild(CmpStatusComponent, { static: false }) statusComponent: CmpStatusComponent
  @ViewChild(CmpZonesComponent, { static: false }) zonesComponent: CmpZonesComponent
  @ViewChild(CmpDatesComponent, { static: false }) datesComponent: CmpDatesComponent
  @ViewChild(CmpDemographicTargetComponent, { static: false }) demographicComponent: CmpDemographicTargetComponent
  @ViewChild(CmpBidsComponent, { static: false }) bidsComponent: CmpBidsComponent
  @ViewChild(CmpBudgetComponent, { static: false }) budgetComponent: CmpBudgetComponent
  @ViewChild(CmpPlacementTargetComponent, { static: false }) placementComponent: CmpPlacementTargetComponent
  @ViewChild(YoutubeChannelsSelectorComponent, { static: false }) channelsComponent: YoutubeChannelsSelectorComponent
  @ViewChild('schedule', { static: false }) schedulesComponent: CmpSchedulesComponent
  @ViewChild(CmpAdsUploaderComponent, { static: false }) adsComponent: CmpAdsUploaderComponent
  @ViewChild(CmpPackChooserComponent, { static: false }) packComponent: CmpPackChooserComponent
  @ViewChild(CmpNativeAdsCreatorComponent, {static: false}) nativeAdsCreator: CmpNativeAdsCreatorComponent
  @ViewChild(CmpKeywordsSelectorComponent, {static: false}) appKeywords: CmpKeywordsSelectorComponent
  @ViewChild(CallExtensionSetupComponent, {static: false}) appPhoneExtension: CallExtensionSetupComponent
  @ViewChild(CmpSearchAdsCreatorComponent, {static: false}) searchAdsCreator: CmpSearchAdsCreatorComponent;
  @ViewChild('appSnackBar', { static: false }) appSnackBar: SnackbarComponent
  @ViewChild(PublishCampaignComponent, { static: false }) publishCampaignComponent: PublishCampaignComponent;
  @ViewChild(CmpUserInterestComponent, {static: false}) userInterest: CmpUserInterestComponent
  @ViewChild(CmpDeviceTargetComponent, {static: false}) deviceComponent: CmpDeviceTargetComponent
  defaultDemoConfigChange(arg: MatSlideToggleChange){
    this.defaultDemoConfig = arg.checked
  }
  defaultPlacementsConfigChange(arg: MatSlideToggleChange){
    this.defaultPlacementsConfig = arg.checked
  }
  defaultSchedulesConfigChange(arg: MatSlideToggleChange){
    this.defaultSchedulesConfig = arg.checked
  }

  defaultCallExtConfigChange(arg: MatSlideToggleChange){
    this.defaultCallExtConfig = arg.checked
  }

  openSnackbar(duration: number, content: string, action: string, style: string, horizontalPosition?: MatSnackBarHorizontalPosition, verticalPosition?: MatSnackBarVerticalPosition) {
    this._snackBar.open(content, action, {
          duration: duration * 1000,
          panelClass: [style],
          horizontalPosition: horizontalPosition,
          verticalPosition: verticalPosition}); 
  }

  getCallExt(): Promise<string> {
    return new Promise(resolve => {
      if(this.appPhoneExtension.PHONE_DATA!==null){
        this.PHONE_DATA = this.appPhoneExtension.PHONE_DATA
        resolve('ok')
      }else{
        this.PHONE_DATA = null
        this.openSnackbar(5, 'Vérifiez saisir un numéro de téléphone valide !', 'ok', 'snack-danger')
        resolve('error')
      }
    })
 
   }

   cancelCampaign(){
     this.router.navigate(['/campaigns'])
   }
  NATIVE_ADS_FOR_CAMPAIGN: NATIVE_ADS_TO_PUBLISH[] = []
  getAssetsNative(): Promise<string>{
    return new Promise(resolve => {
      this.NATIVE_ADS_FOR_CAMPAIGN = []
      this.nativeAdsCreator.getAssetsNativeForCampaign().then(assets_native => {
        if (assets_native !== null) {
          this.NATIVE_ADS_FOR_CAMPAIGN = assets_native
          this.saveNative().then((res)=>{
            this.loaderSaving = false
            this.openDialog(null, this.new_created_native[0], null)
            resolve('ok')
          }).catch((e)=>{
            this.loaderSaving = false
            //console.log(e)
          })
        } else {
          this.loaderSaving = false
          this.openSnackbar(5, 'Cette campagne ne contient aucune annonce veuillez en créer !', '', 'snack-danger')
          this.spinnerCreation = false
          resolve('error')
        }
      }).catch((e) => {
        this.loaderSaving = false
        this.spinnerCreation = false
      })
    })
  }

  getSearchAds(): Promise<string> {
    return new Promise(resolve => {
      if(this.searchAdsCreator.search_before_upload.length>0){
        this.SEARCH_ADS = this.searchAdsCreator.search_before_upload
        this.saveSearch().then((res)=>{
          this.loaderSaving = false
          this.openDialog(null, null, this.new_created_search[0])
          resolve('ok')
        }).catch((e)=>{
          this.loaderSaving = false
          //console.log(e)
        })
      }else{
        this.loaderSaving = false
        this.spinnerCreation = false
        this.SEARCH_ADS = []
        this.openSnackbar(8, 'Votre campagne ne contient aucune annonce !', 'ok', 'snack-danger')
        resolve('error')
      }
   })

 }
  getName(): Promise<string>{
    return new Promise(resolve => {
      this.nameComponent.verifyCampaignName().then(verified => {
        //console.log(verified)
        if (verified === 'ok') {
          this.NAME = this.nameComponent.NAME
        resolve('ok')
        } else if(verified==='duplicate') {
          this.openSnackbar(5, 'Nom de campagne déja utilisé !', '', 'snack-danger')
          this.spinnerCreation = false
        resolve('error')
        } else if(verified==='email') {
          this.openSnackbar(5, 'Nom de campagne invalide !', '', 'snack-danger')
           this.spinnerCreation = false
        resolve('error')
        } else {
          this.openSnackbar(5, 'Nom de campagne invalide !', '', 'snack-danger')
           this.spinnerCreation = false
        resolve('error')
        }
      }).catch((e) => {
        this.spinnerCreation = false
        this.openSnackbar(5, 'Une erreur est survenue !', '', 'snack-danger')
         resolve('error')
      })
      
    })
  }
  user_interest: USER_INTEREST[] = []
  getUserInterest(): Promise<string>{
    return new Promise(resolve => {
      this.userInterest.getUserInterest().then(verified => {
        //console.log(verified)
        if (verified === 'ok') {
          this.user_interest = this.userInterest.createdNewUserInterest
        resolve('ok')
        }else{
          resolve('ok')
        }
      }).catch((e) => {
        this.spinnerCreation = false
        this.openSnackbar(5, 'Une erreur est survenue !', '', 'snack-danger')
         resolve('error')
      })
      
    })
  }

  devicesTargeted: DEVICE_INTERFACE[] = []
  devicesExcluded: DEVICE_INTERFACE[] = []
  getDevices(): Promise<string>{
    return new Promise(resolve => {
      this.deviceComponent.getDevices().then(verified => {
        //console.log(verified)
        if (verified === 'ok') {
          this.devicesTargeted = this.deviceComponent.targetedDevices
          this.devicesExcluded = this.deviceComponent.excludedDevices
        resolve('ok')
        }else{
          this.spinnerCreation = false
          this.openSnackbar(5, 'Veuillez sélectionner un appareil cible !', '', 'snack-danger')
        }
      }).catch((e) => {
        this.spinnerCreation = false
        this.openSnackbar(5, 'Une erreur est survenue !', '', 'snack-danger')
         resolve('error')
      })
      
    })
  }
  getLandingPage(): Promise<string> {
    return new Promise(resolve => {
      let service: any = null
      if(this.landingPageComponent!==undefined && this.landingPageComponent!==null){
        this.landingPageComponent.showSpinner = true
      }
      if(this.currentChannelSelected.obj_id==='display'){
        if (this.landingPageComponent.componentReady) {
          this.displayService.detectSafeBrowsing(this.landingPageComponent.URL_TO_PROMOTE).then(res=>{
            if(res==='ok'){
              if(this.landingPageComponent!==undefined && this.landingPageComponent!==null){
                this.landingPageComponent.showSpinner = false
              }
              this.LANDING_PAGE = this.landingPageComponent.URL_TO_PROMOTE
              resolve('ok')
  
            }else{
              this.spinnerCreation = false
              if(this.landingPageComponent!==undefined && this.landingPageComponent!==null){
                this.landingPageComponent.showSpinner = false
              }
           this.openSnackbar(5, 'Url de la landing page invalide', '', 'snack-danger')
              resolve('error')
            }
          }).catch((e)=>{
            this.spinnerCreation = false
            if(this.landingPageComponent!==undefined && this.landingPageComponent!==null){
              this.landingPageComponent.showSpinner = false
            }
           this.openSnackbar(5, 'Url de la landing page invalide !', '', 'snack-danger')
          })
        } else {
          this.spinnerCreation = false
          if(this.landingPageComponent!==undefined && this.landingPageComponent!==null){
            this.landingPageComponent.showSpinner = false
          }
           this.openSnackbar(5, 'Url de la landing page invalide !', '', 'snack-danger')
          resolve('error')
        }
      }else if(this.currentChannelSelected.obj_id==='native'){
        if (this.landingPageComponent.componentReady) {
          this.youtubeService.detectSafeBrowsing(this.landingPageComponent.URL_TO_PROMOTE).then(res=>{
            if(res==='ok'){
              if(this.landingPageComponent!==undefined && this.landingPageComponent!==null){
                this.landingPageComponent.showSpinner = false
              }
              this.LANDING_PAGE = this.landingPageComponent.URL_TO_PROMOTE
              resolve('ok')
  
            }else{
              this.spinnerCreation = false
              if(this.landingPageComponent!==undefined && this.landingPageComponent!==null){
                this.landingPageComponent.showSpinner = false
              }
           this.openSnackbar(5, 'Url de la landing page invalide', '', 'snack-danger')
              resolve('error')
            }
          }).catch((e)=>{
            this.spinnerCreation = false
            if(this.landingPageComponent!==undefined && this.landingPageComponent!==null){
              this.landingPageComponent.showSpinner = false
            }
           this.openSnackbar(5, 'Url de la landing page invalide !', '', 'snack-danger')
          })
        } else {
          this.spinnerCreation = false
          if(this.landingPageComponent!==undefined && this.landingPageComponent!==null){
            this.landingPageComponent.showSpinner = false
          }
           this.openSnackbar(5, 'Url de la landing page invalide !', '', 'snack-danger')
          resolve('error')
        }
      }else if(this.currentChannelSelected.obj_id==='search'){
        if (this.landingPageComponent.componentReady) {
          this.searchService.detectSafeBrowsing(this.landingPageComponent.URL_TO_PROMOTE).then(res=>{
            if(res==='ok'){
              if(this.landingPageComponent!==undefined && this.landingPageComponent!==null){
                this.landingPageComponent.showSpinner = false
              }
              this.LANDING_PAGE = this.landingPageComponent.URL_TO_PROMOTE
              resolve('ok')
  
            }else{
              this.spinnerCreation = false
              if(this.landingPageComponent!==undefined && this.landingPageComponent!==null){
                this.landingPageComponent.showSpinner = false
              }
           this.openSnackbar(5, 'Url de la landing page invalide', '', 'snack-danger')
              resolve('error')
            }
          }).catch((e)=>{
            this.spinnerCreation = false
            if(this.landingPageComponent!==undefined && this.landingPageComponent!==null){
              this.landingPageComponent.showSpinner = false
            }
           this.openSnackbar(5, 'Url de la landing page invalide !', '', 'snack-danger')
          })
        } else {
          this.spinnerCreation = false
          if(this.landingPageComponent!==undefined && this.landingPageComponent!==null){
            this.landingPageComponent.showSpinner = false
          }
           this.openSnackbar(5, 'Url de la landing page invalide !', '', 'snack-danger')
          resolve('error')
        }
      }
      
    })

  }

   getStatus(): Promise<string> {
    return new Promise(resolve => {
      if (this.statusComponent.componentReady) {
        this.STATUS = this.statusComponent.STATUS_CAMPAIGN
        resolve('ok')
      } else {
        this.spinnerCreation = false
        this.STATUS = ''
         this.openSnackbar(5, 'Status component error', 'ok', 'snack-danger')
        resolve('error')
      }
    })

   }
  
   getZones(): Promise<string> {
     return new Promise(resolve => {
      this.optionLocationTargeted = this.zonesComponent.optionLocationTargeted
       this.optionLocationExcluded = this.zonesComponent.optionLocationExcluded
       this.zonesComponent.getOptionsTarget().then(option_targeted => {
         if (option_targeted === "ok") {
          this.zonesComponent.getOptionsExclude().then(option_excluded => {
         if (option_excluded === "ok") {
           if (this.zonesComponent.zonesOptionSelected === 'custom') {
        if (this.zonesComponent.LOCATIONS_TO_TARGET.length > 0) {
          this.hasZoneTargeted = true
          this.TARGETED_LOCATIONS = []
          this.TARGETED_LOCATIONS = this.zonesComponent.LOCATIONS_TO_TARGET
        } else {
          this.hasZoneTargeted = false
        }
        if (this.zonesComponent.LOCATIONS_TO_EXCLUDE.length > 0) {
          this.hasZoneExcluded = true
          this.EXCLUDED_LOCATIONS = []
           this.EXCLUDED_LOCATIONS = this.zonesComponent.LOCATIONS_TO_EXCLUDE
        } else {
          this.EXCLUDED_LOCATIONS = []
          this.hasZoneExcluded = false
        }
        if (this.zonesComponent.LOCATIONS_TO_TARGET.length === 0 && this.zonesComponent.LOCATIONS_TO_EXCLUDE.length === 0) {
          this.spinnerCreation = false
          this.openSnackbar(5, 'Aucun ciblage de zone définit !', '', 'snack-danger')
          resolve('error')
        } else {
          this.isZoneTargetedAll = false
          this.isZoneTargetedDefault = false
          resolve('ok')
          
        }
      } else if (this.zonesComponent.zonesOptionSelected === 'all'){
        this.isZoneTargetedAll = true
        this.hasZoneTargeted = false
        this.hasZoneExcluded = false
        this.TARGETED_LOCATIONS = []
        this.EXCLUDED_LOCATIONS = []
        resolve('ok')
      } else if (this.zonesComponent.zonesOptionSelected === 'default') {
        this.isZoneTargetedDefault = true
        this.hasZoneTargeted = true
        this.hasZoneExcluded = false
        this.TARGETED_LOCATIONS = [this.zonesComponent.SN_LOCATION]
        this.EXCLUDED_LOCATIONS = []
        resolve('ok')
      }
        }
      })
        }
      })
     
    })

   }

   getChannels(): Promise<string>{
    return new Promise(resolve => {
      this.channelsComponent.getChannels().then(get_channels => {
        if (get_channels === 'ok') {
          this.YOUTUBE_CHANNELS = this.channelsComponent.channels
          this.YOUTUBE_VIDEOS = this.channelsComponent.videos
          this.WEBSITES = this.channelsComponent.websites
          resolve('ok')
        } else {
           this.YOUTUBE_CHANNELS = []
          this.YOUTUBE_VIDEOS = []
          this.WEBSITES = []
          this.spinnerCreation = false
           this.openSnackbar(5, "Aucun site web , chaîne ou video  n'a été sélectionné !", 'ok', 'snack-danger')
          resolve('error')
        }
      })
    })
  }
  
   getDates(): Promise<string> {
     return new Promise(resolve => {
      this.START_DATE = this.datesComponent.startDate
        this.END_DATE = this.datesComponent.endDate
        this.START_DATE_FRENCH = this.datesComponent.startDateFrench
        this.END_DATE_FRENCH = this.datesComponent.endDateFrench
        this.START_DATE_ENGLISH = this.datesComponent.startDateEnglish
        this.END_DATE_ENGLISH = this.datesComponent.endDateEnglish
        this.START_DATE_FORMATTED_GOOGLE = this.datesComponent.startDateFormattedGoogle
        this.END_DATE_FORMATTED_GOOGLE = this.datesComponent.endDateFormattedGoogle
        this.NUMBER_OF_DAYS = this.datesComponent.numberOfDays
        resolve('ok')
   /*    if (this.datesComponent.noEndDate) {
        this.hasEndDate = true
        this.START_DATE = this.datesComponent.startDate
        this.END_DATE = this.datesComponent.endDate
        this.START_DATE_FRENCH = this.datesComponent.startDateFrench
        this.END_DATE_FRENCH = this.datesComponent.endDateFrench
        this.START_DATE_ENGLISH = this.datesComponent.startDateEnglish
        this.END_DATE_ENGLISH = this.datesComponent.endDateEnglish
        this.START_DATE_FORMATTED_GOOGLE = this.datesComponent.startDateFormattedGoogle
        this.END_DATE_FORMATTED_GOOGLE = this.datesComponent.endDateFormattedGoogle
        this.NUMBER_OF_DAYS = this.datesComponent.numberOfDays
        resolve('ok')
      } else {
        this.hasEndDate = false
        this.START_DATE = this.datesComponent.startDate
        this.END_DATE = this.datesComponent.endDate
        this.START_DATE_FRENCH = this.datesComponent.startDateFrench
        this.END_DATE_FRENCH = this.datesComponent.endDateFrench
        this.START_DATE_ENGLISH = this.datesComponent.startDateEnglish
        this.END_DATE_ENGLISH = this.datesComponent.endDateEnglish
        this.START_DATE_FORMATTED_GOOGLE = this.datesComponent.startDateFormattedGoogle
        this.END_DATE_FORMATTED_GOOGLE = this.datesComponent.endDateFormattedGoogle
        this.NUMBER_OF_DAYS = this.datesComponent.numberOfDays
        resolve('ok')
      } */
    })

   }
  
   getDemoTarget(): Promise<string> {
    return new Promise(resolve => {
      if (this.demographicComponent.AGES.length > 0 && this.demographicComponent.GENDERS.length > 0) {
        this.AGES = this.demographicComponent.AGES
        this.GENDERS = this.demographicComponent.GENDERS
        resolve('ok')
      } else {
        this.spinnerCreation = false
         this.openSnackbar(5, 'Sélection au moins un genre et un âge !', 'ok', 'snack-danger')
        resolve('error')
      }
    })

   }
  
   getBids(): Promise<string> {
     return new Promise(resolve => {
      this.BID_MODEL = this.bidsComponent.selectedBid
      resolve('ok')
    })

   }
  
   getBudget(): Promise<string> {
    return new Promise(resolve => {
      if (this.budgetComponent.componentReady) {
        this.DAILY_BUDGET = this.budgetComponent.budget
        this.TOTAL_BUDGET = parseInt((this.DAILY_BUDGET * this.NUMBER_OF_DAYS).toFixed())
      
        resolve('ok')
      } else {
        this.spinnerCreation = false
         this.openSnackbar(5, 'Budget de la campagne invalide !', 'ok', 'snack-danger')
        resolve('error')
      }
    })

   }
  
    getPack(): Promise<string> {
     return new Promise(resolve => {
       this.packComponent.getPack().then(getting_pack => {
         if (getting_pack === "ok") {
            this.PACK_TYPE = this.packComponent.packType
           this.PACK_VALUE = this.packComponent.packValue
           this.REAL_PACK_VALUE = this.packComponent.realPackValue
           this.DAILY_BUDGET = this.packComponent.daily_budget_for_pack
           this.REAL_DAILY_BUDGET = this.packComponent.real_daily_budget_for_pack
           this.TOTAL_BUDGET = this.packComponent.packValue
           this.REAL_TOTAL_BUDGET = this.packComponent.realPackValue
           this.TOTAL_IMPRESSIONS = this.packComponent.pack_impressions
           this.TOTAL_CLICS = this.packComponent.pack_clics
           this.BID_MODEL = this.packComponent.pack_scheme
           this.DEFAULT_BID = this.packComponent.BID
           
       resolve('ok')
         } else {
            this.spinnerCreation = false
         this.openSnackbar(5, 'Budget de la campagne invalide !', 'ok', 'snack-danger')
           resolve('error')
         }
       }).catch((e) => {
          this.spinnerCreation = false
         this.openSnackbar(5, 'Budget de la campagne invalide !', 'ok', 'snack-danger')
         resolve('error')
       })
    
     })

   }
   getPlacementTarget(): Promise<string> {
    return new Promise(resolve => {
      this.placementComponent.getUrls().then(getting_url => {
        if (getting_url === 'ok') {
          if (this.placementComponent.PLACEMENTS.length > 0) {
            this.hasPlacements = true
            this.TARGETED_PLACEMENTS = this.placementComponent.PLACEMENTS
            resolve('ok')
          } else {
            this.hasPlacements = false
            this.TARGETED_PLACEMENTS = []
            resolve('ok')
          }
        } else {
          this.spinnerCreation = false
           this.openSnackbar(5, "Il y'a un problème avec vos emplacements", 'ok', 'snack-danger')
          resolve('error')
        }
      })
    })

   }
  
   getSchedules(): Promise<string> {
    return new Promise(resolve => {
      ////console.log(this.schedulesComponent)
      this.schedulesComponent.getSchedules().then(getting_schedules => {
        if (getting_schedules === "ok") {
          this.SCHEDULES = this.schedulesComponent.SCHEDULE_DATA
          resolve('ok')
        } else {
          this.spinnerCreation = false
          this.SCHEDULES = []
           this.openSnackbar(8, 'Vérifer vos heures de diffusions si elles sont correctement renseignées !', 'ok', 'snack-danger')
          resolve('error')
        }
      })
    })

   }

   getKeywords(): Promise<string> {
    return new Promise(resolve => {
      if (this.appKeywords.KEYWORDS.length>0) {
        this.KEYWORDS = this.appKeywords.KEYWORDS
        resolve('ok')
      } else {
        this.spinnerCreation = false
         this.openSnackbar(5, 'Veuillez définir des mots clés pour votre campagne !', 'ok', 'snack-danger')
        resolve('error')
      }
    })
 
   }
   saveCampaign(){
    this.loaderSaving = true
    if(this.currentChannelSelected.obj_id==='display'){
     this.getAds()
    }else if(this.currentChannelSelected.obj_id==='native'){
      this.getAssetsNative()
    }else if(this.currentChannelSelected.obj_id==='search'){
      this.getSearchAds()
    }
  
   }
  
   getAds(): Promise<string> {
     return new Promise(resolve => {
    
      this.adsComponent.uploadDisplayImages().then(res => {
        ////console.log(res)
        if (res === "error") {
          if (this.adsComponent.selectedImagesFromGallery.length > 0) {
            this.saveDisplay().then((res)=>{
              this.loaderSaving = false
              this.openDialog(this.new_created_display[0], null, null)
            }).catch((e)=>{
              this.loaderSaving = false
              //console.log(e)
            })
          }else{
            //console.log('gallery null')
            this.loaderSaving = false
            this.spinnerCreation = false
            this.openSnackbar(15, 'Aucune image sélectionnée !', 'fermer', 'snack-warn')
          }
        } else if(res==='length'){
          this.spinnerCreation = false
          this.loaderSaving = false
          this.openSnackbar(15, 'Vous ne pouvez pas ajouter plus de 8 images !', 'fermer', 'snack-warn')
        }
      })
    })

  }
  accessToCampaign() {
    if(this.currentChannelSelected.obj_id==='display'){
      this.storageService.setCid(this.new_created_display[0].id).then(setting_id => {
        if (setting_id === "ok") {
          window.location.replace(SERVER.url_redirect+`/campaigns/review/display?cid=${this.new_created_display[0].id}&aacid=${this.aacid}&auid=${this.uid}`)
        }
      })
    }else if(this.currentChannelSelected.obj_id==='native'){
      this.storageService.setCid(this.new_created_native[0].id).then(setting_id => {
        if (setting_id === "ok") {
          window.location.replace(SERVER.url_redirect+`/campaigns/review/native?cid=${this.new_created_native[0].id}&aacid=${this.aacid}&auid=${this.uid}`)
        }
      })
    }else if(this.currentChannelSelected.obj_id==='search'){
      this.storageService.setCid(this.new_created_search[0].id).then(setting_id => {
        if (setting_id === "ok") {
          window.location.replace(SERVER.url_redirect+`/campaigns/review/search?cid=${this.new_created_search[0].id}&aacid=${this.aacid}&auid=${this.uid}`)
        }
      })
    }
  }
  constructor(private _snackBar: MatSnackBar, private accountsService: AccountsService, public dialog: MatDialog, private translate: TranslateService, private lang: LangService, private router: Router, private route: ActivatedRoute, private storageService: LocalStorageService, private sanitizer: DomSanitizer, private displayService: DisplayService, private searchService: SearchService, private youtubeService: YoutubeService) {
    this.lang.language.subscribe(lang=>{
      this.translate.use(lang)
    })

   }
   CURRENT_ACCOUNT: Account
   accountId: string  =""
   getAccountValue():Promise<string> {
     return new Promise(resolve => {
 
       if (this.CURRENT_ACCOUNT!==undefined && this.CURRENT_ACCOUNT !== null) {
         resolve('ok')
       }
 
    })
   }

   publishCampaign(injectedData: Display | Native | Search) {
     let start = new Date(injectedData.startDateEnglish)
     start.setHours(0, 0, 0, 0)
     let today = new Date()
     today.setHours(0,0,0,0)
    if(this.currentChannelSelected.obj_id==='display'){
      this.currentInjectedDataDisplay = injectedData
    }else if(this.currentChannelSelected.obj_id==='native'){
      this.currentInjectedDataNative = injectedData
    }else if(this.currentChannelSelected.obj_id==='search'){
      this.currentInjectedDataSearch = injectedData
    }

    if (start >= today) {
      this.currentBudget = injectedData.realBudget
      this.currentCampaignSaveId = injectedData.id
      this.currentCampaignIsUsedPack = injectedData.isUsedPack
      this.currentCampaignPackType = injectedData.packType
      this.currentCampaignType = injectedData.type
       this.currentCampaignisExpress = injectedData.isExpress
       this.getAccountValue().then(get => {
         if (get === "ok") {
           this.openDialogPublish(this.account_value, this.currentBudget)
         }
       })
       
    } else {
      alert('changez la date début puis réessayer')
     }
   }
  public customerId: number = 0
  ngOnInit(): void {
   
  }

  url_promote: string = ''

  onDataUrlEmitted(url: string){
    this.url_promote = url
    
  }
  onKeywordsAsk(arg: boolean){
    if(arg){
      this.getKeywordsAndPassItToCreator()
    }
  }

  getKeywordsAndPassItToCreator(){
    if(this.appKeywords!==undefined){
      this.appKeywords.getKeywords().then((res)=>{
        if(res==='ok'){
          if(this.searchAdsCreator!==undefined){
            this.searchAdsCreator.KEYWORDS = this.appKeywords.KEYWORDS
            this.searchAdsCreator.presetKeywords()
  
          }
        }
      })

    }
  }

  uploadFinish: boolean = false
  detectUploadFinish(state: boolean) {
    //console.log('upload finish')
    //console.log(state)
    if (state) {
      this.uploadFinish = true
      this.saveDisplay().then((res)=>{
        this.openDialog(this.new_created_display[0], null, null)
      }).catch((e)=>{
        //console.log(e)
      })
    } else {
      this.spinnerCreation = false
      this.saveDisplay().then((res)=>{
        this.openDialog(this.new_created_display[0], null, null)
      }).catch((e)=>{
        //console.log(e)
      })
    }
  }

  goAdsType(){

  }
  goFrame1(){
    this.frame1 = true
    this.frame2 = false
    this.frame3 = false
    this.frame4 = false
  }
  goFrame2(){
    this.getName().then(get_name=>{
      //console.log(get_name)
      if(get_name==='ok'){
        this.getLandingPage().then(get_LP=>{
          //console.log(get_LP)
          if(get_LP==='ok'){
            this.getDates().then(get_date=>{
              if(get_date==='ok'){
                this.frame2 = true
                this.frame1 = false
                this.frame3 = false
                this.frame4 = false
              }else{
                this.spinnerCreation = false
              }
            }).catch((e)=>{
              this.spinnerCreation = false
            })
          }else{
            this.spinnerCreation = false
          }
        }).catch((e)=>{
          this.spinnerCreation = false
        })
      }else{
        this.spinnerCreation = false
      }
    }).catch((e)=>{
      this.spinnerCreation = false
    })
    
  }
  goBackFrame2(){
    this.frame2 = true
    this.frame1 = false
    this.frame3 = false
    this.frame4 = false
  }
  goFrame3(){
    this.getZones().then(get_zones=>{
      if(get_zones==='ok'){
        if(this.currentChannelSelected!==undefined && this.currentChannelSelected!==null && (this.currentChannelSelected.obj_id==='display' || this.currentChannelSelected.obj_id==='native')){
          this.getUserInterest().then(user_int=>{
            if(user_int==='ok'){
              this.getDevices().then(devices_get=>{
                if(devices_get==='ok'){
                  
                  if(this.defaultDemoConfig && this.defaultPlacementsConfig && this.defaultSchedulesConfig){
                    this.frame3 = true
                    this.frame2 = false
                    this.frame1 = false
                    this.frame4 = false
                    this.autoSetBid()
                  }else if(!this.defaultDemoConfig && this.defaultPlacementsConfig && this.defaultSchedulesConfig){
                    this.getDemoTarget().then(get_demo=>{
                      if(get_demo==='ok'){
                        this.frame3 = true
                        this.frame2 = false
                        this.frame1 = false
                        this.frame4 = false
                        this.autoSetBid()
                      }else{
                        this.spinnerCreation = false
                      }
                    }).catch((e)=>{
                      this.spinnerCreation = false
                    })
                  }else if(this.defaultDemoConfig && !this.defaultPlacementsConfig && this.defaultSchedulesConfig){
                    if(this.currentChannelSelected.obj_id==='display'){
                      this.getPlacementTarget().then(get_placements=>{
                        if(get_placements==='ok'){
                          this.frame3 = true
                          this.frame2 = false
                          this.frame1 = false
                          this.frame4 = false
                          this.autoSetBid()
                        }else{
                          this.spinnerCreation = false
                        }
                      }).catch((e)=>{
                        this.spinnerCreation = false
                      })
                    }else if(this.currentChannelSelected.obj_id==='native'){
                      this.getChannels().then(get_channels=>{
                        if(get_channels==='ok'){
                          this.frame3 = true
                          this.frame2 = false
                          this.frame1 = false
                          this.frame4 = false
                          this.autoSetBid()
                        }else{
                          this.spinnerCreation = false
                        }
                      }).catch((e)=>{
                        this.spinnerCreation = false
                      })
                    }
                  }else if(this.defaultDemoConfig && this.defaultPlacementsConfig && !this.defaultSchedulesConfig){
                    this.getSchedules().then(get_schedules=>{
                      if(get_schedules==='ok'){
                        this.frame3 = true
                        this.frame2 = false
                        this.frame1 = false
                        this.frame4 = false
                        this.autoSetBid()
                      }else{
                        this.spinnerCreation = false
                      }
                    }).catch((e)=>{
                      this.spinnerCreation = false
                    })
                  }else if(!this.defaultDemoConfig && !this.defaultPlacementsConfig && !this.defaultSchedulesConfig){
                    this.getDemoTarget().then(get_demo=>{
                      if(get_demo==='ok'){
                        this.getSchedules().then(get_schedules=>{
                          if(get_schedules==='ok'){
                            if(this.currentChannelSelected.obj_id==='display'){
                              this.getPlacementTarget().then(get_placements=>{
                                if(get_placements==='ok'){
                                    this.frame3 = true
                                    this.frame2 = false
                                    this.frame1 = false
                                    this.frame4 = false
                                    this.autoSetBid()
                                }else{
                                  this.spinnerCreation = false
                                }
                              }).catch((e)=>{
                                this.spinnerCreation = false
                              })
                            }else if(this.currentChannelSelected.obj_id==='native'){
                              this.getChannels().then(get_channels=>{
                                if(get_channels==='ok'){
                                  this.frame3 = true
                                  this.frame2 = false
                                  this.frame1 = false
                                  this.frame4 = false
                                  this.autoSetBid()
                                }else{
                                  this.spinnerCreation = false
                                }
                              }).catch((e)=>{
                                this.spinnerCreation = false
                              })
                            }
                          }else{
                            this.spinnerCreation = false
                          }
                        }).catch((e)=>{
                          this.spinnerCreation = false
                        })
                      }else{
                        this.spinnerCreation = false
                      }
                    }).catch((e)=>{
                      this.spinnerCreation = false
                    })
                    
                  }else if(!this.defaultDemoConfig && !this.defaultPlacementsConfig && this.defaultSchedulesConfig){
                    this.getDemoTarget().then(get_demo=>{
                      if(get_demo==='ok'){
                        if(this.currentChannelSelected.obj_id==='display'){
                          this.getPlacementTarget().then(get_placements=>{
                            if(get_placements==='ok'){
                                this.frame3 = true
                                this.frame2 = false
                                this.frame1 = false
                                this.frame4 = false
                                this.autoSetBid()
                            }else{
                              this.spinnerCreation = false
                            }
                          }).catch((e)=>{
                            this.spinnerCreation = false
                          })
                        }else if(this.currentChannelSelected.obj_id==='native'){
                          this.getChannels().then(get_channels=>{
                            if(get_channels==='ok'){
                              this.frame3 = true
                              this.frame2 = false
                              this.frame1 = false
                              this.frame4 = false
                              this.autoSetBid()
                            }else{
                              this.spinnerCreation = false
                            }
                          }).catch((e)=>{
                            this.spinnerCreation = false
                          })
                        }
                      }else{
                        this.spinnerCreation = false
                      }
                    }).catch((e)=>{
                      this.spinnerCreation = false
                    })
                  }else if(this.defaultDemoConfig && !this.defaultPlacementsConfig && !this.defaultSchedulesConfig){
                    
                    this.getSchedules().then(get_schedules=>{
                      if(get_schedules==='ok'){
                        if(this.currentChannelSelected.obj_id==='display'){
                          this.getPlacementTarget().then(get_placements=>{
                            if(get_placements==='ok'){
                                this.frame3 = true
                                this.frame2 = false
                                this.frame1 = false
                                this.frame4 = false
                                this.autoSetBid()
                            }else{
                              this.spinnerCreation = false
                            }
                          }).catch((e)=>{
                            this.spinnerCreation = false
                          })
                        }else if(this.currentChannelSelected.obj_id==='native'){
                          this.getChannels().then(get_channels=>{
                            if(get_channels==='ok'){
                              this.frame3 = true
                              this.frame2 = false
                              this.frame1 = false
                              this.frame4 = false
                              this.autoSetBid()
                            }else{
                              this.spinnerCreation = false
                            }
                          }).catch((e)=>{
                            this.spinnerCreation = false
                          })
                        }
                 
                      }else{
                        this.spinnerCreation = false
                      }
                    }).catch((e)=>{
                      this.spinnerCreation = false
                    })
                  }else if(!this.defaultDemoConfig && this.defaultPlacementsConfig && !this.defaultSchedulesConfig){
                    this.getDemoTarget().then(get_demo=>{
                      if(get_demo==='ok'){
                        this.getSchedules().then(get_schedules=>{
                          if(get_schedules==='ok'){
                            this.frame3 = true
                            this.frame2 = false
                            this.frame1 = false
                            this.frame4 = false
                            this.autoSetBid()
                          }else{
                            this.spinnerCreation = false
                          }
                        }).catch((e)=>{
                          this.spinnerCreation = false
                        })
                      }else{
                        this.spinnerCreation = false
                      }
                    }).catch((e)=>{
                      this.spinnerCreation = false
                    })
                  }
                }else{
                  this.spinnerCreation = false
                }
              }).catch(()=>{
                this.spinnerCreation = false
              })
            }else{
              this.spinnerCreation = false
            }
          }).catch(()=>{
            this.spinnerCreation = false
          })
        }else if(this.currentChannelSelected.obj_id==='search'){
          this.getKeywords().then(get_keywords=>{
            if(get_keywords==='ok'){
              this.getDevices().then(devices_get=>{
                if(devices_get==='ok'){
                  if(this.defaultCallExtConfig && this.defaultSchedulesConfig){
                    this.getCallExt().then(get_call_ext=>{
                      if(get_call_ext==='ok'){
                            this.frame3 = true
                            this.frame2 = false
                            this.frame1 = false
                            this.frame4 = false
                            this.autoSetBid()
                      }else{
                        this.spinnerCreation = false
                      }
                    }).catch((e)=>{
                      this.spinnerCreation = false
                    })
                  }else if(!this.defaultCallExtConfig && this.defaultSchedulesConfig){
                    this.frame3 = true
                    this.frame2 = false
                    this.frame1 = false
                    this.frame4 = false
                    this.autoSetBid()
                  }else if(this.defaultCallExtConfig && !this.defaultSchedulesConfig){
                    this.getCallExt().then(get_call_ext=>{
                      if(get_call_ext==='ok'){
                        this.getSchedules().then(get_schedules=>{
                          if(get_schedules==='ok'){
                            this.frame3 = true
                            this.frame2 = false
                            this.frame1 = false
                            this.frame4 = false
                            this.autoSetBid()
                          }else{
                            this.spinnerCreation = false
                          }
                        }).catch((e)=>{
                          this.spinnerCreation = false
                        })
                      }else{
                        this.spinnerCreation = false
                      }
                    })
                  }else if(!this.defaultCallExtConfig && !this.defaultSchedulesConfig){
                        this.getSchedules().then(get_schedules=>{
                          if(get_schedules==='ok'){
                            this.frame3 = true
                            this.frame2 = false
                            this.frame1 = false
                            this.frame4 = false
                            this.autoSetBid()
                          }else{
                            this.spinnerCreation = false
                          }
                        }).catch((e)=>{
                          this.spinnerCreation = false
                        })
                      
                  }             

                }else{
                  this.spinnerCreation = false
                }
              }).catch(()=>{
                this.spinnerCreation = false
              })
            }else{
              this.spinnerCreation = false
            }
          }).catch((e)=>{
            this.spinnerCreation = false
          })
        }else{
          this.spinnerCreation = false
        }
        
      }else{
        this.spinnerCreation = false
      }
    }).catch((e)=>{
      this.spinnerCreation = false
    })
    
  }

  autoSetBid(){
    setTimeout(() => {
      if(this.currentChannelSelected.obj_id==='search'){
        this.packComponent.setDefaultBid('MC', true)
      }else if(this.currentChannelSelected.obj_id==='display' || this.currentChannelSelected.obj_id==='native'){
        if(this.currentObjectiveSelected.obj_id==='1'){
          this.packComponent.setDefaultBid('MC', false)
        }else if(this.currentObjectiveSelected.obj_id==='2'){
          this.packComponent.setDefaultBid('CPC', false)
        }else if(this.currentObjectiveSelected.obj_id==='3'){
          this.packComponent.setDefaultBid('CPC', false)
        }else if(this.currentObjectiveSelected.obj_id==='4'){
          this.packComponent.setDefaultBid('CPM', false)
        }else if(this.currentObjectiveSelected.obj_id==='5'){
          this.packComponent.setDefaultBid('CPM', false)
        }else if(this.currentObjectiveSelected.obj_id==='6'){
          this.packComponent.setDefaultBid('CPM', false)
        }
      }
    }, 300);
  }
  goBackFrame3(){
    this.frame3 = true
    this.frame2 = false
    this.frame1 = false
    this.frame4 = false
  }

  goFrame4(){
    this.getPack().then(get_pack=>{
      if(get_pack==='ok'){
        this.frame4 = true
        this.frame3 = false
        this.frame1 = false
        this.frame2 = false
        setTimeout(() => {
          if(this.currentChannelSelected.obj_id==='display'){
            this.adsComponent.aacid = this.aacid
          }else if(this.currentChannelSelected.obj_id==="native"){
            this.nativeAdsCreator.aacid = this.aacid
          }else if(this.currentChannelSelected.obj_id==='search'){
            this.searchAdsCreator.aacid = this.aacid
            this.searchAdsCreator.url_promote_subject.next(this.url_promote)
          }
        }, 500);
      }else{
        this.spinnerCreation = false
      }
    }).catch((e)=>{
      this.spinnerCreation = false
    })
  }

  openDialog(display: Display, native: Native, search: Search) {
    const dialogRef = this.dialog.open(DialogBuilderProcess, {
      data: {display: display, native: native, search: search},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result===undefined){
        this.accessToCampaign()
      }else{
        if(this.currentChannelSelected.obj_id==='display'){
         this.publishCampaign(this.new_created_display[0])
        }else if(this.currentChannelSelected.obj_id==='native'){
          this.publishCampaign(this.new_created_native[0])
        }else if(this.currentChannelSelected.obj_id==='search'){
          this.publishCampaign(this.new_created_search[0])
        }
      }
    });
  }
  spinnerPublication: boolean = false
  showPublishPopup: boolean = false 
  useAccountValueForPack() {
    this.spinnerPublication = true
    this.showPublishPopup = false
    this.getAccountValue().then(get => {
      if (get === 'ok') {
           if (this.account_value  >= this.currentBudget) {     
              this.publishCampaignComponent.isTestPack=false
              this.publishCampaignComponent.email = this.email
              this.publishCampaignComponent.uid = this.uid_action
              this.publishCampaignComponent.account_value = this.account_value
              this.openDialogPublishProcess()
              if(this.currentChannelSelected.obj_id==='display'){
                this.publishCampaignComponent.injectedData = this.currentInjectedDataDisplay
                this.publishCampaignComponent.publishCampaignExpress().then(published => {
                  if (published === "ok") {
                    this.spinnerPublication = false
                    this.hideDialogPublishProcess()
                    this.accessToCampaign();
                    //  this.dialogPublishChoose.hide()
                  } else {
                    this.spinnerPublication = false
                    this.showPublishPopup = true
                    this.hideDialogPublishProcess()
                    this.publishCampaign(this.new_created_display[0])
                    }
                }).catch((e) => {
                    this.spinnerPublication = false
                    this.showPublishPopup = true
                    this.hideDialogPublishProcess()
                    this.publishCampaign(this.new_created_display[0])
                  })
              }else if(this.currentChannelSelected.obj_id==='native'){
                this.publishCampaignComponent.injectedDataYoutube = this.currentInjectedDataNative
                this.publishCampaignComponent.publishYoutubeExpressCampaign().then(published => {
                  if (published === "ok") {
                    this.spinnerPublication = false
                    this.hideDialogPublishProcess()
                    this.accessToCampaign();
                    //  this.dialogPublishChoose.hide()
                  } else {
                    this.spinnerPublication = false
                    this.showPublishPopup = true
                    this.hideDialogPublishProcess()
                    this.publishCampaign(this.new_created_native[0])
                    }
                }).catch((e) => {
                    this.spinnerPublication = false
                    this.showPublishPopup = true
                    this.hideDialogPublishProcess()
                    this.publishCampaign(this.new_created_native[0])
                  })
              }else if(this.currentChannelSelected.obj_id==='search'){
                this.publishCampaignComponent.injectedDataSearch = this.currentInjectedDataSearch
                this.publishCampaignComponent.publishCampaignSearchExpress().then(published => {
                  if (published === "ok") {
                    this.spinnerPublication = false
                    this.hideDialogPublishProcess()
                    this.accessToCampaign();
                    //  this.dialogPublishChoose.hide()
                  } else {
                    this.spinnerPublication = false
                    this.showPublishPopup = true
                    this.hideDialogPublishProcess()
                    this.publishCampaign(this.new_created_search[0])
                    }
                }).catch((e) => {
                    this.spinnerPublication = false
                    this.showPublishPopup = true
                    this.hideDialogPublishProcess()
                    this.publishCampaign(this.new_created_search[0])
                  })
              }
          
  
            

          } else {
             this.spinnerPublication = false
             this.showPublishPopup = true
             
          // this.openDialog()
          
        }
        
      } else {
        this.spinnerPublication = false
        this.showPublishPopup = true
      }
    })
 
 
  }

  openDialogPublish(account_value: number, currentBudget: number) {
    const dialogRef = this.dialog.open(DialogPublish, {
      data: {account_value: account_value, currentBudget: currentBudget}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result===undefined){
        this.accessToCampaign()
      }else if(result==='publish'){
        this.useAccountValueForPack()
      }
    });
  }

  openDialogPublishProcess() {
   this.publishDialogRef = this.dialog.open(DialogPublishProcess);
  }
  publishDialogRef: MatDialogRef<any>;
  hideDialogPublishProcess() {
    this.publishDialogRef.close();
  
  }

  loaderSaving: boolean = false
  saveDisplay():Promise<string>{
    return new Promise(resolve=>{
      this.IMAGES = [...this.adsComponent.imagesDisplay, ...this.adsComponent.selectedImagesFromGallery]
      let campaign: Display = {
              id_campagne: 0,
              name: this.NAME,
              status: this.STATUS,
              startDate: this.START_DATE,
              endDate: this.END_DATE,
              startDateFrench: this.START_DATE_FRENCH,
              endDateFrench: this.END_DATE_FRENCH,
              startDateFormattedGoogle: this.START_DATE_FORMATTED_GOOGLE,
              endDateFormattedGoogle: this.END_DATE_FORMATTED_GOOGLE,
              budget: this.TOTAL_BUDGET,
              dailyBudget: this.DAILY_BUDGET,
              realBudget: this.REAL_TOTAL_BUDGET,
              realDailyBudget: this.REAL_DAILY_BUDGET,
              numberOfDays: this.NUMBER_OF_DAYS,
              budgetId: 0,
              ad_group_id_firebase: "",
              ad_group_id: 0,
              targetedLocations: this.TARGETED_LOCATIONS,
              excludedLocations: this.EXCLUDED_LOCATIONS,
              ages: this.AGES,
              genders: this.GENDERS,
              devicesTargeted: this.devicesTargeted,
              devicesExcluded: this.devicesExcluded,
              targetedPlacements: this.TARGETED_PLACEMENTS,
              excludedPlacements: this.EXCLUDED_PLACEMENTS,
              strategie: this.BID_MODEL,
              bid: this.DEFAULT_BID,
              last_check_date: "",
              last_daily_cost: 0,
              last_check_time: 0,
              user_interest: this.user_interest,
              images: this.IMAGES,
              adsSchedules: this.SCHEDULES,
              impressions: 0,
              totalImpressions: this.TOTAL_IMPRESSIONS,
              clicks: 0,
              totalClics: this.TOTAL_CLICS,
              costs: 0,
              servingStatus: "",
              isArchived: false,
              isEnded: false,
              isComplete: false,
              isUsedPack: true,
              packType: this.PACK_TYPE,
              urlPromote: this.LANDING_PAGE,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              createdBy: 'users/'+this.uid,
              owner: this.uid_action,
              type: "Display",
              startDateEnglish: this.START_DATE_ENGLISH,
              endDateEnglish: this.END_DATE_ENGLISH,
              isEdited: false,
              isPayed: false,
              isUsePromoteCode: false,
              budgetEnded: false,
              isExpress: true,
              accountId: this.aacid,
              areaTargetedOption: this.optionLocationTargeted,
              areaExcludedOption: this.optionLocationExcluded,
              objective: this.currentObjectiveSelected,
              adChannel: this.currentChannelSelected
            }
      this.displayService.createCampaign(campaign).
        then(response => {
          if (response !== "error") {
            let createdCampaign: Display = {id: response, ...campaign}
            //console.log(createdCampaign)
            this.new_created_display.push(createdCampaign) 
            this.loaderSaving = false
            resolve('ok')
          } else {
            this.openSnackbar(5, 'Une erreur est survenue lors de la création de votre campagne', 'ok', 'snack-danger')
            this.loaderSaving = false
            resolve('error')
          }
        }).catch((e) => {
          //console.log(e)
        this.openSnackbar(5, 'Une erreur est survenue lors de la création de votre campagne', 'ok', 'snack-danger')
            this.loaderSaving = false
      })
    })
  }

  saveNative():Promise<string>{
    return new Promise(resolve=>{
      let campaign: Native = {
        id_campagne: 0,
        name: this.NAME,
        status: this.STATUS,
        startDate: this.START_DATE,
        endDate: this.END_DATE,
        startDateFrench: this.START_DATE_FRENCH,
        endDateFrench: this.END_DATE_FRENCH,
        startDateFormattedGoogle: this.START_DATE_FORMATTED_GOOGLE,
        endDateFormattedGoogle: this.END_DATE_FORMATTED_GOOGLE,
        budget: this.TOTAL_BUDGET,
        dailyBudget: this.DAILY_BUDGET,
        realBudget: this.REAL_TOTAL_BUDGET,
        realDailyBudget: this.REAL_DAILY_BUDGET,
        numberOfDays: this.NUMBER_OF_DAYS,
        budgetId: 0,
        ad_group_id_firebase: "",
        ad_group_id: 0,
        targetedLocations: this.TARGETED_LOCATIONS,
        excludedLocations: this.EXCLUDED_LOCATIONS,
        totalClics: this.TOTAL_CLICS,
        totalImpressions: this.TOTAL_IMPRESSIONS,
        ages: this.AGES,
        genders: this.GENDERS,
        devicesTargeted: this.devicesTargeted,
        devicesExcluded: this.devicesExcluded,
        youtubeChannels: this.YOUTUBE_CHANNELS,
        youtubeVideos: this.YOUTUBE_VIDEOS,
        websites: this.WEBSITES,
        strategie: this.BID_MODEL,
        bid: this.DEFAULT_BID,
        last_check_date: "",
        last_daily_cost: 0,
        last_check_time: 0,
        images: this.IMAGES,
        imagesNative: this.NATIVE_ADS_FOR_CAMPAIGN,
        adsSchedules: this.SCHEDULES,
        impressions: 0,
        clicks: 0,
        costs: 0,
        user_interest: this.user_interest,
        servingStatus: "",
        isArchived: false,
        isEnded: false,
        isComplete: false,
        isUsedPack: true,
        packType: this.PACK_TYPE,
        urlPromote: this.LANDING_PAGE,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: 'users/'+this.uid,
        owner: this.uid_action,
        type: "YOUTUBE",
        startDateEnglish: this.START_DATE_ENGLISH,
        endDateEnglish: this.END_DATE_ENGLISH,
        isEdited: false,
        isPayed: false,
        isUsePromoteCode: false,
        budgetEnded: false,
        isExpress: true,
        accountId: this.aacid,
        areaTargetedOption: this.optionLocationTargeted,
        areaExcludedOption: this.optionLocationExcluded,
        objective: this.currentObjectiveSelected,
        adChannel: this.currentChannelSelected
        }
      this.youtubeService.createCampaign(campaign).
        then(response => {
          if (response !== "error") {
            let createdCampaign: Native = {id: response, ...campaign}
            this.new_created_native.push(createdCampaign) 
            this.loaderSaving = false
            resolve('ok')
          } else {
            //console.log(' ')
            this.openSnackbar(5, 'Une erreur est survenue lors de la création de votre campagne', 'ok', 'snack-danger')
            this.loaderSaving = false
            resolve('error')
          }
        }).catch((e) => {
          //console.log(e)
        this.openSnackbar(5, 'Une erreur est survenue lors de la création de votre campagne', 'ok', 'snack-danger')
            this.loaderSaving = false
      })
    })
  }


  SEARCH_ADS: SEARCH_ADS_BEFORE_UPLOAD[] = []
  saveSearch():Promise<string>{
    return new Promise(resolve=>{
      let campaign: Search = {
        id_campagne: 0,
        name: this.NAME,
        status: this.STATUS,
        startDate: this.START_DATE,
        endDate: this.END_DATE,
        startDateFrench: this.START_DATE_FRENCH,
        endDateFrench: this.END_DATE_FRENCH,
        startDateFormattedGoogle: this.START_DATE_FORMATTED_GOOGLE,
        endDateFormattedGoogle: this.END_DATE_FORMATTED_GOOGLE,
        budget: this.TOTAL_BUDGET,
        dailyBudget: this.DAILY_BUDGET,
        realBudget: this.REAL_TOTAL_BUDGET,
        realDailyBudget: this.REAL_DAILY_BUDGET,
        numberOfDays: this.NUMBER_OF_DAYS,
        budgetId: 0,
        ad_group_id_firebase: "",
        ad_group_id: 0,
        targetedLocations: this.TARGETED_LOCATIONS,
        excludedLocations: this.EXCLUDED_LOCATIONS,
        devicesTargeted: this.devicesTargeted,
        devicesExcluded: this.devicesExcluded,
        keywords: this.KEYWORDS,
        strategie: this.BID_MODEL,
        bid: this.DEFAULT_BID,
        last_check_date: "",
        last_daily_cost: 0,
        last_check_time: 0,
        text_ads: this.SEARCH_ADS,
        adsSchedules: this.SCHEDULES,
        impressions: 0,
        totalImpressions: this.TOTAL_IMPRESSIONS,
        callExtension: this.PHONE_DATA,
        clicks: 0,
        totalClics: this.TOTAL_CLICS,
        costs: 0,
        servingStatus: "",
        isArchived: false,
        isEnded: false,
        isComplete: false,
        isUsedPack: true,
        packType: this.PACK_TYPE,
        urlPromote: this.LANDING_PAGE,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: 'users/'+this.uid,
        owner: this.uid_action,
        type: "Search",
        startDateEnglish: this.START_DATE_ENGLISH,
        endDateEnglish: this.END_DATE_ENGLISH,
        isEdited: false,
        isPayed: false,
        isUsePromoteCode: false,
        budgetEnded: false,
        isExpress: true,
        accountId: this.aacid,
        areaTargetedOption: this.optionLocationTargeted,
        areaExcludedOption: this.optionLocationExcluded,
        objective: this.currentObjectiveSelected,
        adChannel: this.currentChannelSelected
}
      this.searchService.createCampaign(campaign).
        then(response => {
          if (response !== "error") {
            let createdCampaign: Search = {id: response, ...campaign}
            this.new_created_search.push(createdCampaign) 
            this.loaderSaving = false
            resolve('ok')
          } else {
            this.openSnackbar(5, 'Une erreur est survenue lors de la création de votre campagne', 'ok', 'snack-danger')
            this.loaderSaving = false
            resolve('error')
          }
        }).catch((e) => {
          //console.log(e)
        this.openSnackbar(5, 'Une erreur est survenue lors de la création de votre campagne', 'ok', 'snack-danger')
            this.loaderSaving = false
      })
    })
  }
  // saveCurrentCampaign(){
  //   this.loaderSaving = true
  //   if(this.currentChannelSelected.obj_id==='display'){
  //     this.saveDisplay().then((res)=>{
  //       this.openDialog(this.new_created_display[0], null, null)
  //     }).catch((e)=>{
  //       //console.log(e)
  //     })
  //   }else if(this.currentChannelSelected.obj_id==='native'){
  //     this.saveNative().then((res)=>{
  //       this.openDialog(null, this.new_created_native[0], null)
  //     }).catch((e)=>{
  //       //console.log(e)
  //     })
  //   }else if(this.currentChannelSelected.obj_id==='search'){
  //     this.saveSearch().then((res)=>{
  //       this.openDialog(null, null, this.new_created_search[0])
  //     }).catch((e)=>{
  //       //console.log(e)
  //     })
  //   }
  // }
  goCampaignGoal(){

  }

  setBg(icon: string){
    const style = `backgroud-image: url(${icon})`
    return this.sanitizer.bypassSecurityTrustStyle(style)
  }
  public currentTypeSelected: string = "display"
  public currentObjectiveSelected: OBJECTIVES = null
  public currentChannelSelected: CHANNEL_FORMAT = null
  selectType(id: string) {
    if (this.currentTypeSelected === id) {
      return;
    } else {
      document.getElementById(this.currentTypeSelected).classList.remove('active', 'pulse', 'mat-elevation-z9')
      
      document.getElementById(id).classList.add('active', 'pulse', 'mat-elevation-z9')
      this.currentTypeSelected = id
    }
    
  }

  selectObjective(obj: OBJECTIVES) {
    if (this.currentObjectiveSelected!==null && this.currentObjectiveSelected.obj_id === obj.obj_id) {
      return;
    } else {
      if(this.currentObjectiveSelected!==null){
        document.getElementById(this.currentObjectiveSelected.obj_id).classList.remove('active', 'pulse')
      }
      
      document.getElementById(obj.obj_id).classList.add('active', 'pulse')
      this.currentObjectiveSelected = obj
    }
    this.currentChannelSelected = null
    setTimeout(()=>{
      /* document.getElementById('ads-channel-container').scrollIntoView() */
    //   $([document.documentElement, document.body]).animate({
    //     scrollTop: $("#ads-channel-container").offset().top
    // }, 1000);

    },500)
  }
  selectAdFormat(obj: CHANNEL_FORMAT){
    if (this.currentChannelSelected!==null && this.currentChannelSelected.obj_id === obj.obj_id) {
      return;
    } else {
      if(this.currentChannelSelected!==null){
        document.getElementById(this.currentChannelSelected.obj_id).classList.remove('active', 'pulse')
      }
      
      document.getElementById(obj.obj_id).classList.add('active', 'pulse')
      this.currentChannelSelected = obj
    }
        setTimeout(()=>{
          /* document.getElementById('submit-block').scrollIntoView() */
          this.nameComponent.generateName(8)
        },500)
  }

  canShowAdChannel(channel: CHANNEL_FORMAT): boolean{
    let canShow: boolean = false
    if(this.currentObjectiveSelected!==undefined && this.currentObjectiveSelected!==null && (this.currentObjectiveSelected.obj_id==='4' || this.currentObjectiveSelected.obj_id==='5')){
      if(channel.obj_id==='search'){
        return canShow
      }else{
        return !canShow
      }
    }else{
      return !canShow
    }

  }
  goCreateCampaign() {
    if (this.currentChannelSelected.obj_id === 'display') {
      window.location.replace(SERVER.url_redirect+`/campaigns/new/display/create?aacid=${this.aacid}&auid=${this.uid}&obj=${this.currentObjectiveSelected.obj_id}&ocid=${this.currentChannelSelected.obj_id}`)
      // this.router.navigate(['campaigns/new/display/create'], { queryParams: { aacid: this.aacid, auid: this.uid } }).then(()=>{
      //   window.location.reload()
      // })
    }else if (this.currentChannelSelected.obj_id === 'native') {
      window.location.replace(SERVER.url_redirect+`/campaigns/new/native/create?aacid=${this.aacid}&auid=${this.uid}&obj=${this.currentObjectiveSelected.obj_id}&ocid=${this.currentChannelSelected.obj_id}`)
      // this.router.navigate(['campaigns/new/native/create'], { queryParams: { aacid: this.aacid, auid: this.uid } }).then(()=>{
      //   window.location.reload()
      // })
    }else if (this.currentChannelSelected.obj_id === 'search') {window.location.replace(SERVER.url_redirect+`/campaigns/new/search/create?aacid=${this.aacid}&auid=${this.uid}&obj=${this.currentObjectiveSelected.obj_id}&ocid=${this.currentChannelSelected.obj_id}`)

      // this.router.navigate(['campaigns/new/search/create'], { queryParams: { aacid: this.aacid, auid: this.uid } }).then(()=>{
      //   window.location.reload()
      // })
    }
  }

  exitCreateCampaign() {
    this.router.navigate(['/campaigns'])
  }

  aacid: string = ""
  uid: string = ""

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
   
      setTimeout(() => {
		  this.storageService.getUserIdAndAccountId().then(response => {
			  if (response !== null) {
				  this.route.queryParams.subscribe(params => {
				   const adf_account_id: string = params['aacid'];
					  const uid = params['auid'];
					 
					  if (response.aacid === adf_account_id && uid === response.auid) {
						  this.aacid = response.aacid
              this.uid = response.auid
              this.uid_action = response.auid
              this.user_access = response.role
              this.account_value = response.account.account_value
              for (let age of this.ages) {
                this.AGES.push({
                  text: age.name,
                  ageRangeType: '',
                  criterionId: age.id,
                  citerionType: '',
                  type: ''
                  })
              }
              for (let gender of this.genders) {
                this.GENDERS.push({
                    text: gender.name,
                  gendersRangeType: '',
                  criterionId: gender.id,
                  citerionType: '',
                  type: ''
                  })
              }
              this.accountsService.getListAccounts(response.account.owner).pipe(take(1)).subscribe(accounts => {
                this.CURRENT_ACCOUNT = accounts.find(account => account.id === response.aacid)
                this.account_value = this.CURRENT_ACCOUNT.account_value
                this.accountId = this.CURRENT_ACCOUNT.id
                if (response.fromOwned) {
                  this.uid_action = response.auid      
                  this.getAccountValue()
                
                } else {
                  this.uid_action = response.account.owner
                  this.getAccountValue()
              }
   
              })
					  } else {
              // window.location.replace(SERVER.url_redirect+`/campaigns/new/select?aacid=${response.aacid}&auid=${response.auid}`)
						  this.router.navigate(['/campaigns/new/select'], { queryParams: { aacid: response.aacid, auid: response.auid } });
						 
					  }
			 
				 })
				
			}
		})
      
    }, 500); 
   
  }

}


@Component({
  selector: 'dialog-builder-process',
  templateUrl: 'dialog-builder-process.html',
})
export class DialogBuilderProcess{
  constructor(
    public dialogRef: MatDialogRef<DialogBuilderProcess>,
    @Inject(MAT_DIALOG_DATA) public data: {display: Display, native: Native, search: Search}, ) {
      dialogRef.disableClose = true
    }
    onNoClick(): void {
      this.dialogRef.disableClose = false
      this.dialogRef.close(undefined);
    }
  
}

@Component({
  selector: 'dialog-publish',
  templateUrl: 'dialog-publish.html',
})
export class DialogPublish{
  constructor(
    public dialogRef: MatDialogRef<DialogPublish>,
    @Inject(MAT_DIALOG_DATA) public data: {account_value: number, currentBudget: number} ) {
      dialogRef.disableClose = true
    }
    spinnePublication: boolean = false
    onNoClick(): void {
      this.dialogRef.disableClose = false
      this.dialogRef.close(undefined);
    }
  
}


@Component({
  selector: 'dialog-publish-process',
  templateUrl: 'dialog-publish-process.html',
})
export class DialogPublishProcess{
  constructor(
    public dialogRef: MatDialogRef<DialogPublish>) {
      dialogRef.disableClose = true
    }
    
  
}
