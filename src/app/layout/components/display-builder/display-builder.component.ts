import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import * as $ from 'jquery'
import { AuthService } from 'src/app/auth/auth.service';
import { CmpNameComponent } from '../single/cmp-name/cmp-name.component';
import { CmpLandingPageComponent } from '../single/cmp-landing-page/cmp-landing-page.component';
import { CmpStatusComponent } from '../single/cmp-status/cmp-status.component';
import { CmpZonesComponent } from '../single/cmp-zones/cmp-zones.component';
import { CmpDatesComponent } from '../single/cmp-dates/cmp-dates.component';
import { CmpDemographicTargetComponent } from '../single/cmp-demographic-target/cmp-demographic-target.component';
import { CmpBidsComponent } from '../single/cmp-bids/cmp-bids.component';
import { CmpBudgetComponent } from '../single/cmp-budget/cmp-budget.component';
import { CmpPlacementTargetComponent } from '../single/cmp-placement-target/cmp-placement-target.component';
import { CmpSchedulesComponent } from '../single/cmp-schedules/cmp-schedules.component';
import { CmpAdsUploaderComponent } from '../single/cmp-ads-uploader/cmp-ads-uploader.component';
import { LOCATION, SCHEDULE_INTERFACE, DISPLAY_ADS, PLACEMENT_TYPE, AGES_TYPE, GENDERS_TYPE, User_Role } from 'src/app/utils/data';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { MatStepper } from '@angular/material/stepper';
import { Display } from 'src/app/campaigns-management/models/display.models';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
declare var jQuery: any;
declare var require: any;

import { CmpPackChooserComponent } from '../single/cmp-pack-chooser/cmp-pack-chooser.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { SERVER } from 'src/environments/environment';
import { CmpObjectiveComponent } from '../cmp-objective/cmp-objective.component';



@Component({
  selector: 'adf-display-builder',
  templateUrl: './display-builder.component.html',
  styleUrls: ['./display-builder.component.scss'],
   providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class DisplayBuilderComponent implements OnInit {
/* Stepper */
  panelOpenState = false;
  panel1OpenState = false;
  spinnerCreation: boolean = false
   mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  @ViewChild('snavBuilder', { static: false }) snav: MatSidenav
  @ViewChild(CmpNameComponent, { static: false }) nameComponent: CmpNameComponent
  @ViewChild(CmpLandingPageComponent, { static: false }) landingPageComponent: CmpLandingPageComponent
  @ViewChild(CmpStatusComponent, { static: false }) statusComponent: CmpStatusComponent
  @ViewChild(CmpZonesComponent, { static: false }) zonesComponent: CmpZonesComponent
  @ViewChild(CmpDatesComponent, { static: false }) datesComponent: CmpDatesComponent
  @ViewChild(CmpDemographicTargetComponent, { static: false }) demographicComponent: CmpDemographicTargetComponent
  @ViewChild(CmpBidsComponent, { static: false }) bidsComponent: CmpBidsComponent
  @ViewChild(CmpBudgetComponent, { static: false }) budgetComponent: CmpBudgetComponent
  @ViewChild(CmpPlacementTargetComponent, { static: false }) placementComponent: CmpPlacementTargetComponent
  @ViewChild('schedule', { static: false }) schedulesComponent: CmpSchedulesComponent
  @ViewChild(CmpAdsUploaderComponent, { static: false }) adsComponent: CmpAdsUploaderComponent
   @ViewChild(CmpPackChooserComponent, { static: false }) packComponent: CmpPackChooserComponent
  @ViewChild('appSnackBar', { static: false }) appSnackBar: SnackbarComponent
  @ViewChild('stepper', { static: false }) stepperCreation: MatStepper
  public opened: boolean = true
  public disableRippleStepper: boolean = true
  private aacid: string = ""
  uid: string = ""
  canShowComponents: boolean = true
  public numberOfPersonPotential: number = 0
  public displayPersonPotential: string
  public numberOfPersonExclude: number = 0
  public impressionsEstimate: number = 0
  public clicsEstimate: number = 0
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
  STATUS: string = ""
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
  PACK_TYPE: string = ""
  PACK_VALUE: number = 0
  REAL_PACK_VALUE: number = 0
  new_created: Display[] = [];
  ACCOUNT_ID: string = ""
  uid_action: string = ""
  user_access: User_Role = undefined
  public hasEndDate: boolean = false
  /* END CAMPAIGN DATA  */
  constructor(private router: Router, private route: ActivatedRoute, private _formBuilder: FormBuilder, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private auth: AuthService, private displayService: DisplayService, private youtubeService: YoutubeService, private storageService: LocalStorageService) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => {
      this.opened = false
      changeDetectorRef.detectChanges();
      
    }
    this.mobileQuery.addListener(this._mobileQueryListener);
  
    /* this.auth.getUserCredential().then(user => {
      if (user) {
        this.uid = user.uid
        this.canShowComponents = true
      }
    }) */
  }
  @ViewChild(CmpObjectiveComponent, {static: false}) objectiveComponent: CmpObjectiveComponent;
  saveData() {
    
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
              devices: this.DEVICES,
              targetedPlacements: this.TARGETED_PLACEMENTS,
              excludedPlacements: this.EXCLUDED_PLACEMENTS,
              strategie: this.BID_MODEL,
              bid: this.DEFAULT_BID,
              last_check_date: "",
              last_daily_cost: 0,
              last_check_time: 0,
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
              areaTargetedOption: this.zonesComponent.optionLocationTargeted,
  areaExcludedOption: this.zonesComponent.optionLocationExcluded,
  objective: this.objectiveComponent.current_objective,
  adChannel: this.objectiveComponent.current_ad_channel
    }

      this.displayService.createCampaign(campaign).
        then(response => {
          if (response !== "error") {
            let createdCampaign: Display = {id: response, ...campaign}
            this.new_created.push(createdCampaign) 
            this.opened = false
            this.canShowNav = false
            this.spinnerCreation = false
            // this.stepperCreation.next()
            this.accessToCampaign()
          } else {
            this.openSnackbar(5, 'Une erreur est survenue lors de la création de votre campagne', 'ok', 'snack-danger')
            this.spinnerCreation = false
          }
        }).catch((e) => {
          console.log(e)
        this.openSnackbar(5, 'Une erreur est survenue lors de la création de votre campagne', 'ok', 'snack-danger')
            this.spinnerCreation = false
      })
  }
  uploadFinish: boolean = false

  detectUploadFinish(state: boolean) {
    if (state) {
      this.uploadFinish = true
      this.saveData()
      
    } else {
      this.spinnerCreation = false
      this.saveData()

      /* this.openSnackbar(5, 'Le serveur ne réponds pas', 'ok', 'snack-danger') */
    }
  }

  accessToCampaign() {
    this.storageService.setCid(this.new_created[0].id).then(setting_id => {
      if (setting_id === "ok") {
        //this.router.navigate(['/campaigns/review/display'], {queryParams: {cid: this.new_created[0].id, auid: this.uid, aacid: this.aacid}})
        window.location.replace(SERVER.url_redirect+`/campaigns/review/display?cid=${this.new_created[0].id}&aacid=${this.aacid}&auid=${this.uid}`)
      }
    })
    
  }
  ngOnInit(): void {
  
    this.auth.getUserCredential().then(user => {
      if (user !== null) {
        this.uid = user.uid
      }
    })
    
     this.getAccountId().then(getting_account_id => {
      if (getting_account_id === "ok") {
      
      } else {
        this.router.navigate(['/select/account'])  
      }
    })

  
/*     this.route.queryParams.subscribe(param => {
      let cid = param['cid']
      if (cid !== undefined) {
        this.customerId = cid
      } else {
        this.router.navigate(['/campaigns'], {replaceUrl: true})
      }
    }) */

  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  
  goSelectCampaignType() {
    this.router.navigate(['/campaigns/new/select'], {queryParams: {aacid: this.aacid, auid: this.uid}})
  }
  cancelCampaignCreation() {
    this.router.navigate(['/campaigns'])
  }

   openSideNav() {
 if (this.snav.opened) {
      this.snav.close()
    } else {
      this.snav.open()
    }
   }


   isLoading = true
  ngAfterViewInit(): void {

      this.storageService.getUserIdAndAccountId().then(response => {
			  if (response !== null) {
				  this.route.queryParams.subscribe(params => {
				   const adf_account_id: string = params['aacid'];
					  const uid = params['auid'];
					 
					  if (response.aacid === adf_account_id && uid === response.auid && adf_account_id!==undefined && uid!==undefined) {
              if (response.role.admin) {
                if (response.fromOwned) {
                this.aacid = adf_account_id
                this.uid = response.auid
                this.user_access = response.role
                  this.uid_action = response.auid
                  this.isLoading = false
                  setTimeout(() => {
                    this.adsComponent.aacid = this.aacid
                  }, 500);
                
          } else {
                this.aacid = adf_account_id
                this.uid = response.auid
                this.user_access = response.role
                  this.uid_action = response.account.owner
                  this.isLoading = false
                  setTimeout(() => {
                    this.adsComponent.aacid = this.aacid
                  }, 500);
                
              }
                this.canShowComponents = false
                this.changeDetectorRef.detectChanges()
                
              } else {
                this.router.navigate(['/campaigns/list'])
              }

              
    
						 
					  } else {
						  this.router.navigate(['/campaigns/new/display/create'], { queryParams: { aacid: response.aacid, auid: response.auid, obj: params['obj'] } })
					  }
			 
				 })
				
			}
      })
      
   
  }

  onLocationTarget(locations: LOCATION[]) {
    this.showSpinnerPotential = true
    this.numberOfPersonPotential = 0
    if(locations.length>0){
      for (let i = 0; i < locations.length; i++){
        this.numberOfPersonPotential += locations[i].reach
        if (i === locations.length - 1) {
          this.showSpinnerPotential = false
        }
        
      }

    }else{
      this.numberOfPersonPotential = 0
      this.showSpinnerPotential = false
    }
  }

  bidChange(bid_model: string) {
      this.BID_MODEL = bid_model
  }

  budgetChange(budget: number) {
    this.showSpinnerBid = true
    if (this.BID_MODEL === "CPM") {
      this.impressionsEstimate = parseInt(((budget * 1000) / this.DEFAULT_BID).toFixed(0))
      this.showSpinnerBid = false
    } else if(this.BID_MODEL==="CPC"){
      this.clicsEstimate = parseInt((budget / this.DEFAULT_BID).toFixed())
      this.showSpinnerBid = false
    }
  }
  onLocationExclude(locations: LOCATION[]) {
    this.showSpinnerPotential = true
    this.numberOfPersonExclude = 0
    for (let i = 0; i < locations.length; i++){
      this.numberOfPersonExclude += locations[i].reach
      if (i === locations.length - 1) {
        this.showSpinnerPotential = false
      }
    }
  }

  saveCampaign() {
    this.spinnerCreation = true
   
    this.getName().then(getting_name => {
      //console.log(getting_name)
      if (getting_name === "ok") {
        this.getLandingPage().then(getting_landing => {
          //console.log(getting_landing)
          if (getting_landing === "ok") {
            this.getDates().then(getting_dates => {
              //console.log(getting_dates)
              if (getting_dates === "ok") {
                this.getStatus().then(getting_status => {
                  //console.log(getting_status)
                  if (getting_status === "ok") {
                    this.getZones().then(getting_zones => {
                      //console.log(getting_zones)
                      if (getting_zones === "ok") {
                            this.getDemoTarget().then(getting_demo_target => {
                              //console.log(getting_demo_target)
                              if (getting_demo_target === "ok") {
                                this.getPack().then(getting_budget => {
                                  //console.log(getting_budget)
                                  if (getting_budget === "ok") {
                                    this.getPlacementTarget().then(getting_placement => {
                                      //console.log(getting_placement)
                                      if (getting_placement === "ok") {
                                        this.getSchedules().then(getting_schedules => {
                                          //console.log(getting_schedules)
                                          if (getting_schedules === "ok") {
                                            if (this.uploadFinish) {
                                              this.saveData()
                                            } else {
                                              this.getAds()
                                              
                                            }
                                           
                                            /* this.openSnackbar(5, 'ALl is okay', 'ok', 'snack-success') */
                                          }
                                        })
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          
                      }
                    })
                  }
                })
                
              }
            })
          }
        })
      }
    })
  }

   openSnackbar(duration: number, content: string, action: string, status: string) {
    this.appSnackBar.openSnackBar(duration, content, action, status)  

  }

  getAccountId(): Promise<string> {
    return new Promise(resolve => {
      this.storageService.getUserIdAndAccountId().then(response => {
        if (response !== null) {
          this.ACCOUNT_ID = response.aacid
          resolve('ok')
        } else {
          resolve('error')
        }
      })
      
    })
  }
  getName(): Promise<string>{
    return new Promise(resolve => {
      this.nameComponent.verifyCampaignName().then(verified => {
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
  getLandingPage(): Promise<string> {
    return new Promise(resolve => {
      if (this.landingPageComponent.componentReady) {
        this.displayService.detectSafeBrowsing(this.landingPageComponent.URL_TO_PROMOTE).then(res=>{
          if(res==='ok'){
            this.LANDING_PAGE = this.landingPageComponent.URL_TO_PROMOTE
            resolve('ok')

          }else{
            this.spinnerCreation = false
         this.openSnackbar(5, 'Url de la landing page invalide', '', 'snack-danger')
            resolve('error')
          }
        }).catch((e)=>{
          this.spinnerCreation = false
         this.openSnackbar(5, 'Url de la landing page invalide !', '', 'snack-danger')
        })
      } else {
        this.spinnerCreation = false
         this.openSnackbar(5, 'Url de la landing page invalide !', '', 'snack-danger')
        resolve('error')
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
      //console.log(this.schedulesComponent)
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
  
   getAds(): Promise<string> {
     return new Promise(resolve => {
    
      this.adsComponent.uploadDisplayImages().then(res => {
        //console.log(res)
        if (res === "error") {
          if (this.adsComponent.selectedImagesFromGallery.length > 0) {
            this.saveData()
          }else{
            this.spinnerCreation = false
          }
        } else if(res==='length'){
          this.openSnackbar(8, 'Vous ne pouvez pas importer plus de 8 visuels', 'ok', '')
          this.spinnerCreation = false
        } else{
          resolve('ok')
          
        }
      })
    })

  }
  
}
