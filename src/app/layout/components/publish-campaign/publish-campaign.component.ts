import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import {
  EmitType
} from '@syncfusion/ej2-base';
import {
  DialogComponent
} from '@syncfusion/ej2-angular-popups';


import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  DateRangePickerComponent
} from '@syncfusion/ej2-angular-calendars';

import {
  createSpinner,
  showSpinner,
  hideSpinner
} from '@syncfusion/ej2-angular-popups';
import {
  SpinnerComponent
} from '../spinner/spinner.component';

import * as _ from "lodash";

import {
  HttpClient
} from '@angular/common/http';
import { ToastAdafriComponent } from '../toast/toast.component';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Display } from 'src/app/campaigns-management/models/display.models';
import { Display as youtubeDisplay } from 'src/app/campaigns-management/models/youtube.models';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Search } from 'src/app/campaigns-management/models/search.models';
import { SearchService } from 'src/app/campaigns-management/services/search.service';



declare var require: any;
@Component({
  selector: 'adf-publish-campaign',
  templateUrl: './publish-campaign.component.html',
  styleUrls: ['./publish-campaign.component.scss']
})
export class PublishCampaignComponent implements OnInit{
  @ViewChild('ejDialog', {
    static: false
  }) ejDialog: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', {
    static: false
  }) container: ElementRef;
  @ViewChild('dateCampaignPicker', {
    static: false
  }) DateRange: DateRangePickerComponent;
  @ViewChild('toast', {
    static: false
  }) ToastAdafriComponent: ToastAdafriComponent;
  @ViewChild(SpinnerComponent, {
    static: false
  }) spinnerComponent: SpinnerComponent;
  public today: Date = new Date(new Date().toDateString());
  public currentYear: number = this.today.getFullYear();
  public currentMonth: number = this.today.getMonth();
  public currentDay: number = this.today.getDate();
  public minDateCampaign: Object = new Date(this.currentYear, this.currentMonth, this.currentDay);
  public visible: Boolean = false;
  // The Dialog shows within the target element.
  public targetElement: HTMLElement;
  public headerText: string = ""
  public dialogContent: string = ""
  public injectedData: Display;
  public injectedDataYoutube: youtubeDisplay;
  public injectedDataSearch: Search;
  public email: string = ""
  public uid: string = ""
  public numberOfDays: number = 0
  public validationForm: FormGroup
  public startDateFrench: string = ""
  public startDateFormattedGoogle: string = ""
  public endDateFrench: string = ""
  public endDateFormattedGoogle: string = ""
  public startDateEnglish: string = ""
  public endDateEnglish: string = ""
  public isvalidationForm: boolean = false
  public isSpinner: boolean = true
  public valueDailyBudget: number = 0;
  public valueTotalBudget: number = 0;
  public numberImpressionsTotal: number = 0
  public numberImpressionsDaily: number = 0
  public cpcValue: number = 0
  public cpmValue: number = 0
  public bidType: string = ''
  public spinnerLabel: string = ""
  public youtubeCampaign: boolean = false
  public adwordsCampaign: boolean = false
  public campaignOnProcess: boolean = false
  public isNativeAds: boolean = false
  public init_text: string = ""
  public loader: boolean = false
  public text_init: string = "Vous êtes sûr de votre action ?"
  public IMAGES: any = []
  public LIST_UPLOADS: any = []
  uploads: any;
  public hasUseCode: boolean = false;

  public account_value: number = 0
  public codePromo: string = ""
  public codePromoId: number = 0
  public showToast: boolean = false
  public isExpress: boolean = false
  //To get all element of the dialog component after component get initialized.
  ngOnInit() {
    this.validationForm = this._formBuilder.group({
      daterange: ['', Validators.required],
      budget: ["", [Validators.required, Validators.min(5)]]
    })

  }

  ngAfterViewInit() {

  }

  checkDates(): Promise < string > {
    return new Promise(resolve => {
      var now = new Date();
      //console.log(this.injectedData)
      var start;
      if(this.injectedData!==undefined && this.injectedData!==null){
        start = new Date(this.injectedData.startDateEnglish.toString().replace(/-/g, '/'))
        
      }else if(this.injectedDataYoutube!==undefined && this.injectedDataYoutube!==null){
        start = new Date(this.injectedDataYoutube.startDateEnglish.toString().replace(/-/g, '/'))
      }else if(this.injectedDataSearch!==undefined && this.injectedDataSearch!==null){
        start = new Date(this.injectedDataSearch.startDateEnglish.toString().replace(/-/g, '/'))
      }

      
      now.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0)
      if (start < now) {
        resolve('past')
        //console.log("Selected date is in the past");
      } else {
        resolve('not past')
        //console.log("Selected date is NOT in the past");
      }

    })
  }

  dateCampaignChange() {


    var debut = new Date(new Date(this.DateRange.startDate));
    var fin = new Date(new Date(this.DateRange.endDate))
    this.numberOfDays = ((fin.getTime() - debut.getTime()) / (1000 * 3600 * 24)) + 1;

    var start = new Date(this.DateRange.startDate);
    var end = new Date(this.DateRange.endDate);
    this.startDateFrench = [('0' + (start.getDate())).slice(-2), ('0' + (start.getMonth() + 1)).slice(-2), start.getFullYear()].join('/');
    this.endDateFrench = [('0' + (end.getDate())).slice(-2), ('0' + (end.getMonth() + 1)).slice(-2), end.getFullYear()].join('/');
    this.startDateFormattedGoogle = [start.getFullYear(), ('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2), ].join('');
    this.endDateFormattedGoogle = [end.getFullYear(), ('0' + (end.getMonth() + 1)).slice(-2), ('0' + (end.getDate())).slice(-2)].join('');
    this.startDateEnglish = [('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2), start.getFullYear()].join('-');
    this.endDateEnglish = [('0' + (end.getMonth() + 1)).slice(-2), ('0' + (end.getDate())).slice(-2), end.getFullYear()].join('-');
    this.valueTotalBudget = this.valueDailyBudget * this.numberOfDays



  }

  // Initialize the Dialog component's target element.
  initilaizeTarget: EmitType < object > = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  }


  //Animation options
  public animationSettings: Object = {
    effect: 'SideLeft',
    duration: 1000,
    delay: 0
  };

  public showCloseIcon: boolean = true;
  public isModal = true
  // Hide the Dialog when click the footer button.
  public hideDialog() {
   /*  this.ejDialog.hide(); */
  }
  // Enables the footer buttons

  // Sample level code to handle the button click action
  
  public onOpenDialog() {
    // Call the show method to open the Dialog
    if (this.injectedData.isExpress) {
      this.isExpress = true
      this.checkDates().then(response_check => {
        if (response_check === "not past") {
          this.ejDialog.position = {
          X: 'center',
          Y: 'center'
        }
        if (this.injectedData.type === "Youtube") {
          this.youtubeCampaign = true
          this.adwordsCampaign = false
            this.ejDialog.show();
        } else if (this.injectedData.type === "Display" || this.injectedData.type === "Native") {
          if (this.injectedData.type === "Native") {
            this.isNativeAds = true
          } else {
            this.isNativeAds = false
          }
          this.adwordsCampaign = true
          this.youtubeCampaign = false
          }else
          this.ejDialog.show();
          
        }else if (response_check === "past") {
        
      }
      })
    } else {
      this.isExpress = false
       this.checkDates().then(response_check => {
      if (response_check === "not past") {
        this.ejDialog.position = {
          X: 'center',
          Y: 'center'
        }
        if (this.injectedData.type === "Youtube") {
          this.youtubeCampaign = true
          this.adwordsCampaign = false
        } else if (this.injectedData.type === "Display" || this.injectedData.type === "Native") {
          if (this.injectedData.type === "Native") {
            this.isNativeAds = true
          } else {
            this.isNativeAds = false
          }
          this.adwordsCampaign = true
          this.youtubeCampaign = false
        }
        this.ejDialog.show();

      } else if (response_check === "past") {
        this.bidType = this.injectedData.strategie
        this.cpmValue = this.injectedData.bid
        this.cpcValue = this.injectedData.bid
        this.isvalidationForm = true
        this.adwordsCampaign = true
        this.youtubeCampaign = false

        setTimeout(() => {
          this.numberOfDays = this.injectedData.numberOfDays
          this.validationForm.controls.budget.patchValue(this.injectedData.dailyBudget)
          this.valueDailyBudget = this.injectedData.dailyBudget
          this.valueTotalBudget = this.injectedData.budget
          this.DateRange.startDate = new Date(this.injectedData.startDateEnglish)
          this.DateRange.endDate = new Date(this.injectedData.endDateEnglish)
          this.DateRange.showTodayButton = true
        }, 500);
      }
      this.IMAGES = this.injectedData.images

    this.ejDialog.position = {
      X: 'left',
      Y: 'top'
    }
    this.ejDialog.enableResize = true
    this.ejDialog.show();
       })
       this.headerText = "Publier la campagne"
    this.init_text = "Vous allez publier la campagne " + this.injectedData.name + " ?"
    }
   
   


  }

  showLoader() {
    showSpinner(document.getElementById('spinner'));


  }
  hideLoader() {
    hideSpinner(document.getElementById('spinner'));
  }
  constructor(private displayService: DisplayService,
    private _formBuilder: FormBuilder,
    private auth: AuthService,
    private http: HttpClient, private accountsService: AccountsService, private youtubeService: YoutubeService, private searchService: SearchService) {}
  publishCampaign1() {

    this.hideDialog()
    this.loader = true



  }

  setBudget(uid, budget): Promise < string > {
    return new Promise(resolve => {
      var new_account_value = this.account_value - budget
      if (new_account_value > 0) {
        this.auth.updateUser(uid, {
          account_value: new_account_value
        }).then(res => {
          if (res === "ok") {
            resolve('ok')
          }
        })

      } else {
        resolve('error')
      }
    })
  }
  targetContentNetwork: boolean = true
  targetGoogleSearch: boolean =  true
  targetSearchNetwork: boolean = true
  targetPartnerSearchNetwork: boolean = true
  targetAllPlacement: boolean = true
  



  checktIfPackValid(): Promise<string>{
    return new Promise(resolve => {
      resolve('ok')
   
  })
  }
  
  checkIfPackYoutubeValid(): Promise<string>{
    return new Promise(resolve => {
      resolve('ok')
    
  })
  }
  
  
  isTestPack: boolean =false
 publishCampaignExpress(): Promise <string> {
   return new Promise(resolve => {
     if (this.isTestPack) {
       this.checktIfPackValid().then(isValid => {
         if (isValid === "ok") {
           this.hideDialog()
           
           setTimeout(() => {
               if (this.injectedData.targetedPlacements.length > 0) {
               this.targetGoogleSearch = false
               this.targetSearchNetwork = false
               this.targetPartnerSearchNetwork = false
               this.targetAllPlacement = false
             }
             this.displayService.publishCampaignToGoogle(this.uid, this.injectedData.accountId, this.injectedData.id, this.injectedData.accountId, this.injectedData.name, this.injectedData.status, this.injectedData.startDateFormattedGoogle, this.injectedData.endDateFormattedGoogle, this.injectedData.budget, this.injectedData.dailyBudget, this.injectedData.numberOfDays, this.injectedData.strategie, this.injectedData.bid, this.injectedData.type, this.injectedData.packType, this.targetContentNetwork, this.targetGoogleSearch, this.targetSearchNetwork, this.targetPartnerSearchNetwork, this.injectedData.areaTargetedOption, this.injectedData.areaExcludedOption, this.injectedData.totalImpressions ? this.injectedData.totalImpressions : 0, this.targetAllPlacement).then(publish => {
                if (publish.status === "ok") {
                  this.displayService.updateCampaign(this.injectedData.id, {
                   isUsePromoteCode: this.hasUseCode,
                   isPayed: true
                 }).then(res_update_complete => {
                   if (res_update_complete === "ok") { 
                    this.accountsService.updateAccount(this.injectedData.accountId, { account_value: this.account_value - this.injectedData.realBudget }).then(account_updated => {
                   if (account_updated === "ok") {
                     this.displayService.targetNewUserInterest(this.injectedData.user_interest, this.injectedData.id, publish.campaignId, publish.idA, publish.ad_group_id).then(user_interest_targeted=>{
                      if(user_interest_targeted==='ok'){
                        this.displayService.targetNewDevicesCampaignLevel(this.injectedData.devicesTargeted, this.injectedData.id, publish.campaignId, publish.idA, publish.ad_group_id, 'ADD').then(device_targeted=>{
                          if(device_targeted==='ok'){
                            this.displayService.excludeNewDevicesCampaignLevel(this.injectedData.devicesExcluded, this.injectedData.id, publish.campaignId, publish.idA, publish.ad_group_id, 'ADD').then(device_excluded=>{
                              if(device_excluded==='ok'){
                                this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                                this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                                this.ToastAdafriComponent.toast.show()
                                resolve('ok')
                              }else{
                                this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                                this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                                this.ToastAdafriComponent.toast.show()
                                resolve('ok')
                              }
                            }).catch(()=>{
                              this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                              this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                              this.ToastAdafriComponent.toast.show()
                              resolve('ok')
                            })
                            this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                            this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                            this.ToastAdafriComponent.toast.show()
                            resolve('ok')
                          }
                        }).catch(()=>{
                          this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                          this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                          this.ToastAdafriComponent.toast.show()
                          resolve('ok')
                        })
                  

                      }else{
                        this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                        this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                        this.ToastAdafriComponent.toast.show()
                        resolve('ok')
                      }
                    }).catch((errUserInt)=>{
                      this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                      this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                      this.ToastAdafriComponent.toast.show()
                      resolve('ok')
                    })
                   } else {
                     this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                  }
                 }).catch((e) => {
                  this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne erreur  "+ e
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                })
                   } else {
                      this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                   }
                 })
            
               } else {     
                   this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                   
               }
              
              
             }).catch((e) => {    
                   this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
               this.ToastAdafriComponent.toast.show()
               console.log(e)
                   resolve('error')
                   
             })
     
           }, 500)
            
         } else {
           resolve('error')
          }
       }).catch(e => {
          console.log(e)
          resolve('error')
        })
       
     } else {
        this.hideDialog()
           setTimeout(() => {
               if (this.injectedData.targetedPlacements.length > 0) {
               this.targetGoogleSearch = false
               this.targetSearchNetwork = false
               this.targetPartnerSearchNetwork = false
               this.targetAllPlacement = false
             }
             this.displayService.publishCampaignToGoogle(this.uid, this.injectedData.accountId, this.injectedData.id, this.injectedData.accountId, this.injectedData.name, this.injectedData.status, this.injectedData.startDateFormattedGoogle, this.injectedData.endDateFormattedGoogle, this.injectedData.budget, this.injectedData.dailyBudget, this.injectedData.numberOfDays, this.injectedData.strategie, this.injectedData.bid, this.injectedData.type, this.injectedData.packType, this.targetContentNetwork, this.targetGoogleSearch, this.targetSearchNetwork, this.targetPartnerSearchNetwork, this.injectedData.areaTargetedOption, this.injectedData.areaExcludedOption, this.injectedData.totalImpressions?this.injectedData.totalImpressions:0, this.targetAllPlacement).then(publish => {
               if (publish.status === "ok") {
                 this.accountsService.updateAccount(this.injectedData.accountId, { account_value: this.account_value - this.injectedData.realBudget }).then(account_updated => {
                   if (account_updated === "ok") {
                       this.displayService.updateCampaign(this.injectedData.id, {
                   isUsePromoteCode: this.hasUseCode,
                   isPayed: true
                 }).then(res_update_complete => {
                   if (res_update_complete === "ok") { 
                    this.displayService.targetNewUserInterest(this.injectedData.user_interest, this.injectedData.id, publish.campaignId, publish.idA, publish.ad_group_id).then(user_interest_targeted=>{
                      if(user_interest_targeted==='ok'){
                        this.displayService.targetNewDevicesCampaignLevel(this.injectedData.devicesTargeted, this.injectedData.id, publish.campaignId, publish.idA, publish.ad_group_id, 'ADD').then(device_targeted=>{
                          if(device_targeted==='ok'){
                            this.displayService.excludeNewDevicesCampaignLevel(this.injectedData.devicesExcluded, this.injectedData.id, publish.campaignId, publish.idA, publish.ad_group_id, 'ADD').then(device_excluded=>{
                              if(device_excluded==='ok'){
                                this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                                this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                                this.ToastAdafriComponent.toast.show()
                                resolve('ok')
                              }else{
                                this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                                this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                                this.ToastAdafriComponent.toast.show()
                                resolve('ok')
                              }
                            }).catch(()=>{
                              this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                              this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                              this.ToastAdafriComponent.toast.show()
                              resolve('ok')
                            })
                          }else{
                            this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                            this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                            this.ToastAdafriComponent.toast.show()
                            resolve('ok')
                          }
                        }).catch(()=>{
                          this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                          this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                          this.ToastAdafriComponent.toast.show()
                          resolve('ok')
                        })

                      }else{
                        this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                        this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                        this.ToastAdafriComponent.toast.show()
                        resolve('ok')
                      }
                    }).catch((errUserInt)=>{
                      this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                      this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                      this.ToastAdafriComponent.toast.show()
                      resolve('ok')
                    })
                   }
                 })
                   } else {
                      this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                  }
                 }).catch((e) => {
                   this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne erreur "+e
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                })
                
            
               } else {     
                   this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                   
               }
             }).catch((e) => {    
                   this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
               this.ToastAdafriComponent.toast.show()
               console.log(e)
                   resolve('error')
                   
             })
     
           }, 500)
     }
     
     
    })

  }


  publishCampaignSearchExpress(): Promise <string> {
    return new Promise(resolve => {
      if (this.isTestPack) {
        this.checktIfPackValid().then(isValid => {
          if (isValid === "ok") {
            this.hideDialog()
            
            setTimeout(() => {

              this.searchService.publishCampaignToGoogle(this.uid, this.injectedDataSearch.accountId, this.injectedDataSearch.id, this.injectedDataSearch.accountId, this.injectedDataSearch.name, this.injectedDataSearch.status, this.injectedDataSearch.startDateFormattedGoogle, this.injectedDataSearch.endDateFormattedGoogle, this.injectedDataSearch.budget, this.injectedDataSearch.dailyBudget, this.injectedDataSearch.numberOfDays, this.injectedDataSearch.strategie, this.injectedDataSearch.bid, this.injectedDataSearch.type, this.injectedDataSearch.packType, this.targetContentNetwork, this.targetGoogleSearch, this.targetSearchNetwork, this.targetPartnerSearchNetwork, this.injectedDataSearch.areaTargetedOption, this.injectedDataSearch.areaExcludedOption, this.injectedDataSearch.totalImpressions ? this.injectedDataSearch.totalImpressions : 0, this.targetAllPlacement).then(publish => {
                 if (publish === "ok") {
                   this.searchService.updateCampaign(this.injectedDataSearch.id, {
                    isUsePromoteCode: this.hasUseCode,
                    isPayed: true
                  }).then(res_update_complete => {
                    if (res_update_complete === "ok") { 
                     this.accountsService.updateAccount(this.injectedDataSearch.accountId, { account_value: this.account_value - this.injectedDataSearch.realBudget }).then(account_updated => {
                    if (account_updated === "ok") {
                      this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                    this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                    this.ToastAdafriComponent.toast.show()
                    this.searchService.addCallExtension(this.injectedDataSearch.callExtension).then(callAdded=>{
                      if(callAdded==='ok'){
                        this.ToastAdafriComponent.toast.title = "Extension d'appel définit avec succès"
                        this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                        this.ToastAdafriComponent.toast.show()
                        resolve('ok')
                  
                        // this.searchService.addAdResponsiveSearchAd(this.injectedDataSearch.owner, this.injectedDataSearch.accountId, this.injectedDataSearch.text_ads).then(ad_added=>{
                        //   if(ad_added==='ok'){
                        //     this.ToastAdafriComponent.toast.title = "Annonces crées avec succès"
                        //   this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                        //   this.ToastAdafriComponent.toast.show()
                        //   this.searchService.updateCampaign(this.injectedDataSearch.id, {
                        //     isComplete: true
                        //   })
                        //   resolve('ok')
                        //   }else{
                        //     this.ToastAdafriComponent.toast.title = "Une erreur est survenue lors de la création des annonces"
                        //   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                        //   this.ToastAdafriComponent.toast.show()
                        //   resolve('error')
                        //   }
                        // }).catch(()=>{
                        //   this.ToastAdafriComponent.toast.title = "Une erreur est survenue lors de la création des annonces"
                        //   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                        //   this.ToastAdafriComponent.toast.show()
                        // })
                      }else{
                        this.ToastAdafriComponent.toast.title = "Une erreur est survenue lors de la création de l'extension d'appel"
                        this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                        this.ToastAdafriComponent.toast.show()
                        resolve('error')
                      }
                   
                    }).catch(()=>{
                      this.ToastAdafriComponent.toast.title = "Une erreur est survenue lors de la création de l'extension d'appel"
                      this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                      this.ToastAdafriComponent.toast.show()
                      resolve('error')
                    })
                    // this.searchService.targetKeywords(this.injectedDataSearch.keywords).then((keywords_targeted)=>{
                    //   if(keywords_targeted==='ok'){
                    //     this.ToastAdafriComponent.toast.title = "Mots clés définis avec succès !"
                    //     this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                    //     this.ToastAdafriComponent.toast.show()     
                    //   }else{
                    //     this.ToastAdafriComponent.toast.title = "Une erreur est survenue lors de la création des mots clés"
                    //     this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                    //     this.ToastAdafriComponent.toast.show()
                    //     //resolve('error')
                    //   }

                
                    // }).catch((e)=>{
                    //   this.ToastAdafriComponent.toast.title = "Une erreur est survenue lors de la création des mots clés"
                    //     this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                    //     this.ToastAdafriComponent.toast.show()
                    //     resolve('error')
                    // })
                    // resolve('ok')
                    } else {
                      this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                    this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                    this.ToastAdafriComponent.toast.show()
                    resolve('error')
                   }
                  }).catch((e) => {
                   this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne erreur  "+ e
                    this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                    this.ToastAdafriComponent.toast.show()
                    resolve('error')
                 })
                    } else {
                       this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                    this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                    this.ToastAdafriComponent.toast.show()
                    resolve('error')
                    }
                  })
             
                } else {     
                    this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                    this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                    this.ToastAdafriComponent.toast.show()
                    resolve('error')
                    
                }
               
               
              }).catch((e) => {    
                    this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                    this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                this.ToastAdafriComponent.toast.show()
                console.log(e)
                    resolve('error')
                    
              })
      
            }, 500)
             
          } else {
            resolve('error')
           }
        }).catch(e => {
           console.log(e)
           resolve('error')
         })
        
      } else {
         this.hideDialog()
            setTimeout(() => {
              this.searchService.publishCampaignToGoogle(this.uid, this.injectedDataSearch.accountId, this.injectedDataSearch.id, this.injectedDataSearch.accountId, this.injectedDataSearch.name, this.injectedDataSearch.status, this.injectedDataSearch.startDateFormattedGoogle, this.injectedDataSearch.endDateFormattedGoogle, this.injectedDataSearch.budget, this.injectedDataSearch.dailyBudget, this.injectedDataSearch.numberOfDays, this.injectedDataSearch.strategie, this.injectedDataSearch.bid, this.injectedDataSearch.type, this.injectedDataSearch.packType, this.targetContentNetwork, this.targetGoogleSearch, this.targetSearchNetwork, this.targetPartnerSearchNetwork, this.injectedDataSearch.areaTargetedOption, this.injectedDataSearch.areaExcludedOption, this.injectedDataSearch.totalImpressions?this.injectedDataSearch.totalImpressions:0, this.targetAllPlacement).then(publish => {
                if (publish === "ok") {
                  this.accountsService.updateAccount(this.injectedDataSearch.accountId, { account_value: this.account_value - this.injectedDataSearch.realBudget }).then(account_updated => {
                    if (account_updated === "ok") {
                        this.searchService.updateCampaign(this.injectedDataSearch.id, {
                    isUsePromoteCode: this.hasUseCode,
                    isPayed: true
                  }).then(res_update_complete => {
                    if (res_update_complete === "ok") { 
                     this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                    this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                    this.ToastAdafriComponent.toast.show()
                    resolve('ok')
                    }
                  })
                    } else {
                       this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                    this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                    this.ToastAdafriComponent.toast.show()
                    resolve('error')
                   }
                  }).catch((e) => {
                    this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne erreur "+e
                    this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                    this.ToastAdafriComponent.toast.show()
                    resolve('error')
                 })
                 
             
                } else {     
                    this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                    this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                    this.ToastAdafriComponent.toast.show()
                    resolve('error')
                    
                }
              }).catch((e) => {    
                    this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                    this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                this.ToastAdafriComponent.toast.show()
                console.log(e)
                    resolve('error')
                    
              })
      
            }, 500)
      }
      
      
     })
 
   }





  publishYoutubeExpressCampaign(): Promise<string>{
    return new Promise(resolve => {
      console.log('publishing')
      if (this.isTestPack) {
       this.checkIfPackYoutubeValid().then(isValid => {
         if (isValid === "ok") {
           this.hideDialog()      
              this.targetGoogleSearch = false
              this.targetSearchNetwork = false
              this.targetPartnerSearchNetwork = false
              if(this.injectedDataYoutube.youtubeChannels.length>0 || this.injectedDataYoutube.websites.length>0 || this.injectedDataYoutube.youtubeVideos.length>0){
                this.targetAllPlacement = false
              }
             this.youtubeService.publishCampaignToYoutube(this.uid, this.injectedDataYoutube.accountId, this.injectedDataYoutube.id, this.injectedDataYoutube.accountId, this.injectedDataYoutube.name, this.injectedDataYoutube.status, this.injectedDataYoutube.startDateFormattedGoogle, this.injectedDataYoutube.endDateFormattedGoogle, this.injectedDataYoutube.budget, this.injectedDataYoutube.dailyBudget, this.injectedDataYoutube.numberOfDays, this.injectedDataYoutube.strategie, this.injectedDataYoutube.bid, this.injectedDataYoutube.type, this.injectedDataYoutube.packType, this.targetContentNetwork, this.targetGoogleSearch, this.targetSearchNetwork, this.targetPartnerSearchNetwork, this.injectedDataYoutube.areaTargetedOption, this.injectedDataYoutube.areaExcludedOption, this.injectedDataYoutube.totalImpressions?this.injectedDataYoutube.totalImpressions:0, this.targetAllPlacement).then(publish => {
               if (publish === "ok") {
                 this.accountsService.updateAccount(this.injectedDataYoutube.accountId, { account_value: this.account_value - this.injectedDataYoutube.realBudget }).then(account_updated => {
                   if (account_updated === "ok") {
                     this.youtubeService.updateCampaign(this.injectedDataYoutube.id, {
                       isUsePromoteCode: this.hasUseCode,
                       isPayed: true
                     }).then(res_update_complete => {
                       if (res_update_complete === "ok") { 
                        this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                       this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                       this.ToastAdafriComponent.toast.show()
                       resolve('ok')
                       }
                     })
                    
                   } else {
                      this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                  }
                 }).catch((e) => {
                   this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne erreur "+e
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                })
               } else {     
                   this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                   
               }
             }).catch((e) => {    
                  console.log(e)
                   this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                   
             })
 
            
         } else {
           resolve('error')
          }
       }).catch(e => {
         console.log(e)
          resolve('error')
        })
       
     } else {
        this.hideDialog()
              this.targetGoogleSearch = false
              this.targetSearchNetwork = false
              this.targetPartnerSearchNetwork = false
              if(this.injectedDataYoutube.youtubeChannels.length>0 || this.injectedDataYoutube.websites.length>0 || this.injectedDataYoutube.youtubeVideos.length>0){
                this.targetAllPlacement = false
              }
             this.youtubeService.publishCampaignToYoutube(this.uid, this.injectedDataYoutube.accountId, this.injectedDataYoutube.id, this.injectedDataYoutube.accountId, this.injectedDataYoutube.name, this.injectedDataYoutube.status, this.injectedDataYoutube.startDateFormattedGoogle, this.injectedDataYoutube.endDateFormattedGoogle, this.injectedDataYoutube.budget, this.injectedDataYoutube.dailyBudget, this.injectedDataYoutube.numberOfDays, this.injectedDataYoutube.strategie, this.injectedDataYoutube.bid, this.injectedDataYoutube.type, this.injectedDataYoutube.packType, this.targetContentNetwork, this.targetGoogleSearch, this.targetSearchNetwork, this.targetPartnerSearchNetwork, this.injectedDataYoutube.areaTargetedOption, this.injectedDataYoutube.areaExcludedOption, this.injectedDataYoutube.totalImpressions?this.injectedDataYoutube.totalImpressions:0, this.targetAllPlacement).then(publish => {
               if (publish === "ok") {
                 this.accountsService.updateAccount(this.injectedDataYoutube.accountId, { account_value: this.account_value - this.injectedDataYoutube.realBudget }).then(account_updated => {
                   if (account_updated === "ok") {
                     this.youtubeService.updateCampaign(this.injectedDataYoutube.id, {
                   isUsePromoteCode: this.hasUseCode,
                   isPayed: true
                 }).then(res_update_complete => {
                   if (res_update_complete === "ok") { 
                    this.ToastAdafriComponent.toast.title = "Votre campagne a été publiée avec succès vos ciblages se feront en arrière plan."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-success"
                   this.ToastAdafriComponent.toast.show()
                   resolve('ok')
                   }
                 })
                   } else {
                     this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                  }
                 }).catch((e) => {
                  this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne erreur "+e
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                })
                  
               } else {     
                   //this.loader = false
                   //this.spinnerComponent.message = "Connexion perdue."
                   this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
                   this.ToastAdafriComponent.toast.show()
                   resolve('error')
                   
               }
             }).catch((e) => {    
                   //this.loader = false
                   //this.spinnerComponent.message = "Connexion perdue."
                   this.ToastAdafriComponent.toast.title = "Nous n'avons pas pu créer votre campagne vérifiez que vous êtes connecté à internet."
                   this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
               this.ToastAdafriComponent.toast.show()
               console.log(e)
                   resolve('error')
                   
             })
     
      
     }
    })
  }
  
  showErrorCreation() {
    //this.loader = false

      //this.spinnerComponent.message = "Connexion perdue."
      this.ToastAdafriComponent.toast.content = "Une erreur est survenue, la campagne a été créée partiellement nous vous recommandons de la supprimée puis réessayez !"
      this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
      this.ToastAdafriComponent.toast.timeOut = 20000
      this.ToastAdafriComponent.toast.showCloseButton = true
      this.ToastAdafriComponent.toast.show()
      
   
  }

   showErrorCreation1() {
    //this.loader = false

      //this.spinnerComponent.message = "Connexion perdue."
      this.ToastAdafriComponent.toast.content = "Une erreur est survenue lors de la création des annonces. Vous pourrez toujours créer des annonces en accédant aux paramètres de campagne."
      this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
      this.ToastAdafriComponent.toast.timeOut = 20000
      this.ToastAdafriComponent.toast.showCloseButton = true
      this.ToastAdafriComponent.toast.show()
      
   
  }

 

  budgetChange(value: number) {
    this.valueDailyBudget = value
    this.valueTotalBudget = value * this.numberOfDays

    if (this.bidType === "CPM") {
      if (this.validationForm.get('budget').valid) {
        this.numberImpressionsTotal = (this.valueTotalBudget * 1000) / this.cpmValue
        this.numberImpressionsDaily = (this.valueDailyBudget * 1000) / this.cpmValue
         var numeral = require('numeral');
         this.ToastAdafriComponent.toast.content = "Nombre d'impressions par jours: " + numeral(parseInt(this.numberImpressionsDaily.toString())).format('0,0.0000') + "<br> Nombre d'impressions total: " + numeral(parseInt(this.numberImpressionsTotal.toString())).format('0,0.0000')
        this.ToastAdafriComponent.playSong = "ok"
        this.ToastAdafriComponent.toast.timeOut = 10000
        this.ToastAdafriComponent.toast.showCloseButton = true
        this.ToastAdafriComponent.toast.cssClass = "e-toast-info"
        this.ToastAdafriComponent.toast.position = {
          X: 'Right',
          Y: 'Top'
        }
        this.ToastAdafriComponent.toast.show()

        this.setInputControlState(this.validationForm, 'budget', 'budgetCampaign')
      } else {
        this.setInputControlState(this.validationForm, 'budget', 'budgetCampaign')
      }


    } else if (this.bidType === "CPC") {
      if (this.validationForm.get('budget').valid) {
        this.setInputControlState(this.validationForm, 'budget', 'budgetCampaign')
        this.numberImpressionsTotal = (this.valueTotalBudget * 1000) / this.cpcValue
        this.numberImpressionsDaily = (this.valueDailyBudget * 1000) / this.cpcValue
        this.ToastAdafriComponent.toast.content = "Nombre d'impressions par jours: " + numeral(this.numberImpressionsDaily).format('0,0.0000') + "<br> Nombre d'impressions total: " + numeral(this.numberImpressionsTotal).format('0,0.0000')
        this.ToastAdafriComponent.playSong = "ok"
        this.ToastAdafriComponent.toast.timeOut = 10000
        this.ToastAdafriComponent.toast.showCloseButton = true
        this.ToastAdafriComponent.toast.cssClass = "e-toast-info"
        this.ToastAdafriComponent.toast.position = {
          X: 'Right',
          Y: 'Top'
        }
        this.ToastAdafriComponent.toast.show()
      } else {
        this.setInputControlState(this.validationForm, 'budget', 'budgetCampaign')
      }

    }



    /*  this.defaultBid = value / 655
     this.defaultBidConvert = value
     ////console.log(Number((this.defaultBid).toFixed(2))) */
  }





  setInputControlState(form: FormGroup, field: string, id: string) {
    if (form.get(field).valid) {

      if (document.getElementById(id).classList.contains('e-error')) {
        document.getElementById(id).classList.remove('e-error')
      }

    } else {
      if (!document.getElementById(id).classList.contains('e-error')) {
        document.getElementById(id).classList.add('e-error')
      }

    }
  }
  public focusIn(target: HTMLElement): void {
    target.parentElement.classList.add('e-input-focus');
  }

  public focusOut(target: HTMLElement): void {
    target.parentElement.classList.remove('e-input-focus');

  }


}
