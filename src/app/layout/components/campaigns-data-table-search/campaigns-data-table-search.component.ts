import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { SelectLinkedAccountComponent } from '../select-linked-account/select-linked-account.component';
import { GridComponent, ToolbarItems, ContextMenuItem, GridLine, SelectionSettingsModel, RowSelectEventArgs, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { SearchService } from 'src/app/campaigns-management/services/search.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Display } from 'src/app/campaigns-management/models/display.models';
import { Router } from '@angular/router';
import { DialogComponent, PositionDataModel } from '@syncfusion/ej2-angular-popups';
import { CURRENCY, SERVER } from 'src/environments/environment';
import { PublishCampaignComponent } from '../publish-campaign/publish-campaign.component';
import { SeoService } from 'src/app/seo.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { Account, User_Role } from '../../../utils/data'
import { SpinnerComponent } from '../spinner/spinner.component'
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { take, takeUntil } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import { MatSelectionListChange } from '@angular/material/list';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Search } from 'src/app/campaigns-management/models/search.models';

@Component({
  selector: 'adf-campaigns-data-table-search',
  templateUrl: './campaigns-data-table-search.component.html',
  styleUrls: ['./campaigns-data-table-search.component.scss']
})
export class CampaignsDataTableSearchComponent implements OnInit {

  
  @ViewChild('gridCampaigns', { static: false }) gridCampaigns: GridComponent
  @ViewChild(SpinnerComponent, { static: false }) spinner: SpinnerComponent
  @ViewChild('campaignConfirmDelete', { static: false }) campaignConfirmDelete: DialogComponent 
  @ViewChild('campaignConfirmDuplicate', { static: false }) campaignConfirmDuplicate: DialogComponent 
  @ViewChild(SnackbarComponent, {static: false}) appSnackbar: SnackbarComponent
  public accounts: any;
  public toolbarOptions: ToolbarItems[];
  public contextMenuItems: ContextMenuItem[];
  public gridLines: GridLine;
  public selectionOptions: SelectionSettingsModel;
  selectedCampaign: any; 
  public clrIntervalFun: any;
    public clrIntervalFun1: any;
  public clrIntervalFun2: any;    
  public intervalFun: any;
    public dropSlectedIndex: number = null;
    public stTime: any;
  public data: Display[] = [];
   public filter: Object;
    public filterSettings: Object;
    public selectionSettings: Object;  
  public height: string = '240px';
  public uid: string = ""
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
  public modeSelected: string = "";
  public email: string = ""
  public publishComponent: boolean = false
  public account_value: number = 0
  public visible: Boolean = false;
  public isModal: Boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  public initialPage: PageSettingsModel = { pageSize: 5 };
  DEFAULT_CLIENT_CUSTOMER_ID = SERVER.CLIENT_CUSTOMER_ID
  @ViewChild('dialogNoEnoughFounds', {static: false}) dialogNoEnoughFounds: DialogComponent
  @ViewChild(PublishCampaignComponent, { static: false }) publishCampaignComponent: PublishCampaignComponent;
  @ViewChild('dialogPublishWithCodePromo', {static: false}) dialogPublishWithCodePromo: DialogComponent
   @ViewChild('dialogPublishChoose', { static: false }) dialogPublishChoose: DialogComponent
  constructor(private searchService: SearchService, private auth: AuthService, private router: Router, private seo: SeoService, private storageService: LocalStorageService, private accountsService: AccountsService) {
    /* this.auth.getUserCredential().then(user => {
      if (user !== null) {
        this.uid_action = user.uid_action
        
        
      }
    }) */
    
  }
  MENU_FILTER_OPTION: { id: string, name: string }[] = [{ id: 'all', name: 'Toutes les campagnes' }, { id: 'enabled', name: 'Toutes les campagnes activées' }, { id: 'paused', name: 'Toutes les campagnes mise en veille'},{ id: 'ended', name: 'Toutes les campagnes terminées' }]
  selectedOptionFilterStatus: { id: string, name: string } =  this.MENU_FILTER_OPTION[0]
  listFindFromSearch: Display[] = []
  public dataDisplayFiltered: Display[] = [];
  searchInput: FormControl = new FormControl()
  selectedItem(option: {id: string, name: string}) {
    return this.MENU_FILTER_OPTION.some(item=>item.id===option.id && this.selectedOptionFilterStatus.id===item.id)
  }
  onOptionSelect(selected: {id: string, name: string}) { 
    this.selectedOptionFilterStatus = selected
    if (this.selectedOptionFilterStatus.id === 'all') {
      this.dataDisplayFiltered = this.data
    } else if (this.selectedOptionFilterStatus.id === 'enabled'){
      this.dataDisplayFiltered = this.data.filter(campaign=> !campaign.budgetEnded && campaign.status==='ENABLED')
    } else if (this.selectedOptionFilterStatus.id === 'paused') {
      this.dataDisplayFiltered = this.data.filter(campaign=> !campaign.budgetEnded && campaign.status==='PAUSED')
    } else if (this.selectedOptionFilterStatus.id === 'ended') {
      this.dataDisplayFiltered = this.data.filter(campaign=> campaign.budgetEnded)
    }
  }
  compareWith(o1: {id: string, name: string}, o2: {id: string, name: string}) {
    return o1.id===o2.id && o1.name===o2.name
  }
  campaign_to_duplicate: Search = null
  triggerDuplication(campaign_to_duplicate: Search) {
    this.campaign_to_duplicate = campaign_to_duplicate
    this.campaignConfirmDuplicate.show()
  }
  confirmDuplication() {
    this.campaignConfirmDuplicate.hide()
    this.duplicateCampaign(this.campaign_to_duplicate)
  }
  abortDuplication() {
    this.campaign_to_duplicate = null
    this.campaignConfirmDuplicate.hide()
  }
   duplicateCampaign(campaign_to_duplicate: Search) {
    this.isLoading = true
     this.searchService.getCampaignDataValue__IdNotIncluded(campaign_to_duplicate.id).then(campaign => {
       let budget: number = 0
       let realBudget: number = 0
       let dailyBudget: number = 0
       let realDailyBudget: number = 0
       let totalImpressions: number = 0
       let totalClics: number = 0
       if (campaign_to_duplicate.totalImpressions === undefined) {
         if (campaign_to_duplicate.packType === '0') {
           totalImpressions = 20000
           totalClics = 0
         }else if (campaign_to_duplicate.packType === '1') {
           totalImpressions = 100000
           totalClics = 0
         }else if (campaign_to_duplicate.packType === '2') {
           totalImpressions = 250000
           totalClics = 0
         }else if (campaign_to_duplicate.packType === '3') {
           totalImpressions = 500000
           totalClics = 0
         }
       } else {
         totalImpressions = campaign_to_duplicate.totalImpressions
         totalClics = campaign_to_duplicate.totalClics
       }
       if (campaign_to_duplicate.packType === "4") {
         budget = parseInt(((campaign_to_duplicate.realBudget * 70) / 100).toFixed(0)) 
         realBudget = campaign_to_duplicate.realBudget
         dailyBudget = parseInt((budget / 2).toFixed(0))
         realDailyBudget = parseInt((campaign_to_duplicate.realBudget / 2).toFixed(0))
        
         
       } else {
         budget = campaign_to_duplicate.realBudget
         realBudget = campaign_to_duplicate.realBudget
         dailyBudget = campaign_to_duplicate.realDailyBudget
         realDailyBudget = campaign_to_duplicate.realDailyBudget
       }
      let new_campaign: Display = campaign
      new_campaign.id_campagne = 0
      new_campaign.ad_group_id = 0
      new_campaign.ad_group_id_firebase = ""
      new_campaign.name = new_campaign.name + Math.floor(Math.random() * 999999999).toString()
      new_campaign.budgetEnded = false
      new_campaign.isPayed = false
      new_campaign.isUsePromoteCode = false
      new_campaign.budgetId = 0
      new_campaign.last_check_date =  ""
      new_campaign.last_daily_cost = 0
      new_campaign.last_check_time = 0
      new_campaign.impressions = 0
      new_campaign.clicks = 0
      new_campaign.costs = 0
      new_campaign.servingStatus = ""
      new_campaign.isArchived = false
      new_campaign.isEnded = false
      new_campaign.isComplete = false
      new_campaign.createdAt = firebase.firestore.FieldValue.serverTimestamp()
      new_campaign.budget = budget
      new_campaign.dailyBudget =  dailyBudget
      new_campaign.realBudget =  realBudget
       new_campaign.realDailyBudget = realDailyBudget
       new_campaign.totalImpressions = totalImpressions
       new_campaign.totalClics = totalClics
       if(campaign_to_duplicate.objective!==undefined && campaign_to_duplicate.objective!==null){
        new_campaign.objective = campaign_to_duplicate.objective
        new_campaign.adChannel = campaign_to_duplicate.adChannel
      }
      this.searchService.saveDuplicateCampaign(new_campaign).then(campaignDuplicated=>{
        if (campaignDuplicated !== null) {
           this.searchService.getListCampaign(this.uid_action, this.aacid).pipe(take(1)).subscribe(campaigns => {
             this.data = campaigns
             this.dataDisplayFiltered = this.data
            this.isLoading = false
             this.router.navigate(['/campaigns/review/search'], {queryParams: {cid: campaignDuplicated.id, auid: this.uid, aacid: this.aacid}})
          })
        } else {
          this.isLoading = false
        }
      }).catch((e) => {
        this.isLoading = false
      })
      
    })
  }
  user_access: User_Role = undefined
  uid_action: string = ""
  aacid: string = ""
  isLoading = true

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getData()
    this.searchInput.valueChanges.subscribe(value => {
      this.listFindFromSearch = this.dataDisplayFiltered.filter(campaign=>campaign.name.includes(value))
    })
    
  }
  goSelectCampaign() {
    this.router.navigate(['campaigns/new/select'])
    
  }
public campaigns: Observable<Display[]> = new Observable<Display[]>();

  getData() {
    this.storageService.getUserIdAndAccountId().then(response => {
      if (response !== null) {
        this.user_access = response.role
        this.aacid = response.aacid
        if (response.fromOwned) {
          this.uid = response.auid
          this.uid_action = response.auid
          this.campaigns = this.searchService.getListCampaign(response.auid, response.aacid)
          this.searchService.getListCampaign(response.auid, response.aacid).pipe(take(1)).subscribe(campaigns => {
            this.data = campaigns
            this.dataDisplayFiltered = this.data
            
            this.isLoading = false
            this.getAccountValue()
          })
          
        } else {
          this.uid_action = response.account.owner
          this.uid = response.auid
          this.campaigns = this.searchService.getListCampaign(response.auid, response.aacid)
           this.searchService.getListCampaign(response.account.owner, response.aacid).pipe(take(1)).subscribe(campaigns => {
             this.data = campaigns
             this.dataDisplayFiltered = this.data
             this.isLoading = false
             this.getAccountValue()
          })
        }
      }
    })
  }
  onSelectCampaign(args: RowSelectEventArgs) {
    
    ////console.log(args)
    this.selectedCampaign=args.data
    
    ////console.log(this.selectedCampaign)
  }

   onDataBound(args:any):void {
        clearTimeout(this.clrIntervalFun);
        clearInterval(this.intervalFun);
        
   }
    public customAttributes: object; 
  ngOnInit(): void {
     this.filterSettings = { type: "Menu" };      
        this.filter = { type: "CheckBox" };    
       this.stTime = performance.now();
        this.selectionSettings = {persistSelection: true, type: "Single", checkboxOnly: true };
         this.customAttributes = {class: 'custom-css'};
      this.gridLines = 'Both';
        this.selectionOptions = { type: 'Multiple' };
        this.toolbarOptions = ['Search', 'ColumnChooser'];
        this.contextMenuItems = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
                'Copy', 'Edit', 'Delete', 'Save', 'Cancel', 'FirstPage', 'PrevPage',
          'LastPage', 'NextPage'];
        
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  
  }

  goReviewNotPublish(id: string, type: string, accountId: string) {
    //console.log(id)
    this.storageService.setCid(id).then(setting_id => {
      if (setting_id === "ok") {
          this.router.navigate(['/campaigns/review/search'], {queryParams: {cid: id, auid: this.uid, aacid: accountId}})
      
        
      }
    })
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
      this.appSnackbar.openSnackBar(1000, 'changez la date début de votre campagne puis réessayer', 'ok', 'snack-warning')
     }
     
    
   }
  CURRENT_ACCOUNT: Account
  accountId: string  =""
  getAccountValue():Promise<string> {
    return new Promise(resolve => {
     this.accountsService.getListAccounts(this.uid_action).subscribe(accounts => {
          this.CURRENT_ACCOUNT = accounts.find(account => account.id === this.aacid)
          this.account_value = this.CURRENT_ACCOUNT.account_value
          this.accountId = this.CURRENT_ACCOUNT.id
          resolve('ok')
        })
   })
  }
    buttonStatusEnter(id: string) {
    document.getElementById(id).classList.remove('d-none')
  }
  buttonStatusLeave(id: string) {
        document.getElementById(id).classList.add('d-none')
  }
     getUserCredentials():Promise<string> {
    return new Promise(resolve => {
        this.auth.user.forEach(child => {
      ////////console.log(child)
          this.uid = child.uid
          this.email = child.email
          /* this.account_value = child.account_value */
          resolve('ok')
      
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
            this.publishCampaignComponent.uid = this.uid_action
            this.publishCampaignComponent.account_value = this.account_value
               this.publishCampaignComponent.injectedDataSearch = this.currentInjectedData
                   this.publishCampaignComponent.onOpenDialog()
          },500)
          
        } else {
          this.openDialog()
          
        }
     
  }
  
      spinnerPublication: boolean = false
      useAccountValueForPack() {
    this.spinnerPublication = true
        this.getAccountValue().then(get => {
          if (get === 'ok') {
               if (this.account_value  >= this.currentBudget) {     
                  this.publishCampaignComponent.isTestPack=true
                  this.publishCampaignComponent.email = this.email
                  this.publishCampaignComponent.uid = this.uid_action
                  this.publishCampaignComponent.account_value = this.account_value
                  this.publishCampaignComponent.injectedDataSearch = this.currentInjectedData
                this.publishCampaignComponent.publishCampaignExpress().then(published => {
                  if (published === "ok") {
                    this.spinnerPublication = false
                     this.dialogPublishChoose.hide()
                  } else {
                    this.spinnerPublication = false
                    }
                }).catch((e) => {
                    this.spinnerPublication = false
                  })
                
    
              } else {
                this.spinnerPublication = false
              this.openDialog()
              
            }
            
          } else {
            this.spinnerPublication = false
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

    activateCampaign(id: string, campaign_id: number, type: string, budgetEnded: boolean) {
    if (budgetEnded === false) {

        this.searchService.enableCampaign(id, campaign_id).then(res_activate => {
          if (res_activate === "ok") {
            /* //this.spinner.message = "Campagne activée avec succès"
            this.loader = false */
            this.appSnackbar.openSnackBar(10, 'Campagne activée avec succès !', 'ok', 'snack-success', 'right', 'top')
            this.getData()
          } else {
            this.appSnackbar.openSnackBar(10, 'Une erreur est survenue veuillez réessayer !', 'ok', 'snack-error', 'right', 'bottom')
          }
        }).catch((e) => {
          this.appSnackbar.openSnackBar(10, 'Une erreur est survenue vérifiez votre connexion puis réssayez !', 'ok', 'snack-error', 'right', 'bottom')
        })
     
    }
  }

  loader: boolean = false
  pauseCampaign(id: string, campaign_id: number, type: string, budgetEnded: boolean) {
     /* this.loader = true */

      this.searchService.disableCampaign(id, campaign_id).then(res_activate => {
        if (res_activate === "ok") {
          /* //this.spinner.message = "Campagne désactivée avec succés"
          this.loader = false */
          this.appSnackbar.openSnackBar(10, 'Campagne mise en veille avec succès !', 'ok', 'snack-success', 'right', 'top')
          this.getData()
          
        } else {
           this.appSnackbar.openSnackBar(10, 'Une erreur est survenue veuillez réessayer !', 'ok', 'snack-error', 'right', 'bottom')
        }
      }).catch((e) => {
          this.appSnackbar.openSnackBar(10, 'Une erreur est survenue vérifiez votre connexion puis réssayez !', 'ok', 'snack-error', 'right', 'bottom')
        })
   
  }

   deleteSelectedCampain(id: string, campaign_id: number, type: string, ad_group_id_firebase: string, startDateEnglish: string, endDateEnglish: string, budget: number, dailyBudget: number, numberOfDays: number, isUsedPack: boolean, isUsePromoteCode: boolean) {

    this.currentCampaignIdToDelete = campaign_id
    this.currentCampaignIdFirebaseToDelete = id
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
    /* this.loader = true */
    //////console.log(this.currentCampaignTypeToDelete)
   
    if (this.currentCampaignToDeleteIsUsedPack || this.currentCampaignToDeleteUsePromoCode) {
  
        if (this.currentCampaignIdToDelete === 0) {
        
       this.searchService.deleteCampaign(this.currentCampaignIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
          this.loader = false
   
           this.appSnackbar.openSnackBar(10, 'Campagne supprimée !', 'ok', 'snack-default', 'right', 'top')
           this.getData()
         } else {
           this.appSnackbar.openSnackBar(10, 'Une erreur est survenue veuillez réessayer !', 'ok', 'snack-error', 'right', 'bottom')
         }
       }).catch((e) => {
          this.appSnackbar.openSnackBar(10, 'Une erreur est survenue vérifiez votre connexion puis réssayez !', 'ok', 'snack-error', 'right', 'bottom')
        })
     } else {
       this.searchService.removeCampaign(this.currentCampaignIdFirebaseToDelete, this.currentCampaignIdToDelete, this.currentAdGroupIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
       
           this.loader = false
           this.appSnackbar.openSnackBar(10, 'Campagne supprimée !', 'ok', 'snack-default', 'right', 'top')
           this.getData()
             
            
           
         } else {
           this.appSnackbar.openSnackBar(10, 'Une erreur est survenue veuillez réessayer !', 'ok', 'snack-error', 'right', 'bottom')
         }
       }).catch((e) => {
          this.appSnackbar.openSnackBar(10, 'Une erreur est survenue vérifiez votre connexion puis réssayez !', 'ok', 'snack-error', 'right', 'bottom')
        })
     } 
      
    
      
    } else {

      if (this.currentCampaignIdToDelete === 0) {
       this.searchService.deleteCampaign(this.currentCampaignIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
          /* this.loader = false */
   this.getData()
          
         }
       })
     } else {
       this.searchService.removeCampaign(this.currentCampaignIdFirebaseToDelete, this.currentCampaignIdToDelete, this.currentAdGroupIdFirebaseToDelete).then(res_delete => {
         if (res_delete === "ok") {
               this.restituteFundsBeforeRemove(this.currentCampaignStartDateToDelete, this.currentCampaignEndDateToDelete, this.currentCampaignBudgetToDelete, this.currentCampaignDailyBudgetToDelete, this.currentCampaignNumberOfDaysToDelete).then(res_restitute => {
             if (res_restitute === "ok") {
             /* this.loader = false */
               this.getData()
             
             } else {
               /* this.loader = false */
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

}
