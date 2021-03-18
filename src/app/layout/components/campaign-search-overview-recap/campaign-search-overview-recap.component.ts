import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsRoutingModule } from 'src/app/accounts/accounts-routing.modules';
import { AccountsService } from 'src/app/accounts/accounts.service';
import {Account, User_Role} from '../../../utils/data'
import { ToolbarItems, ContextMenuItem, GridLine, SelectionSettingsModel, GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { LocalStorageService } from '../../services/local-storage.service';
import { SERVER } from 'src/environments/environment';
import { SpinnerComponent } from '../spinner/spinner.component';
import { take } from 'rxjs/operators';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { Search } from 'src/app/campaigns-management/models/search.models';
import { SearchService } from 'src/app/campaigns-management/services/search.service';

@Component({
  selector: 'adf-campaign-search-overview-recap',
  templateUrl: './campaign-search-overview-recap.component.html',
  styleUrls: ['./campaign-search-overview-recap.component.scss']
})
export class CampaignSearchOverviewRecapComponent implements OnInit {

  isLoading = true
  public toolbarOptions: ToolbarItems[];
  public contextMenuItems: ContextMenuItem[];
  public gridLines: GridLine;
  public selectionOptions: SelectionSettingsModel;
  public filter: Object;
  public filterSettings: Object;
  public selectionSettings: Object;
  public customAttributes1: object;
  public customAttributes2: object;
  public customAttributes3: object;
  public selectedOptionStats1: string = "clicks"
  public selectedOptionStats3: string = "impressions"
  public selectedOptionStats2: string  ="costs"
   statsOptions = [
    { text: 'Clics', value: 'clicks' },
    { text: 'Impressions', value: 'impressions'},
    { text: 'Dépenses', value: 'costs' },
    { text: 'Ctr', value: 'ctr' },
    { text: 'Interactions', value: 'interactions' },
    { text: 'Conversions', value: 'conversions' },
    { text: 'Taux de conversion', value: 'convRate' },
    
  ]
  user_access: User_Role = undefined

  DEFAULT_CLIENT_CUSTOMER_ID = SERVER.CLIENT_CUSTOMER_ID
  @ViewChild('gridCampaignsRecap', {static: false}) gridCampaign: GridComponent
  uid: string = ""
  adf_account_id: string = ""
  constructor(private route: ActivatedRoute, private accountsService: AccountsService, private searchService: SearchService, private router: Router, private storageService: LocalStorageService, private youtubeService: YoutubeService) { }
  campaigns: Search[] = []
  accounts: Account[] = []
   public entityName: Object = {class: 'entity-column'};
  public initialPage: PageSettingsModel = { pageSize: 5 };
   @ViewChild(SnackbarComponent, { static: false }) appSnackbar: SnackbarComponent
   openSnackBar(timeout: number, message: string, action: string, css: string) {
    this.appSnackbar.openSnackBar(timeout, message, action, css)
  }

  goReviewNotPublish(id: string, type: string, accountId: string) {
   this.storageService.setCid(id).then(setting_id => {
      if (setting_id === "ok") {
        if (type === "DISPLAY" || type === "Display") {
          this.router.navigate(['/campaigns/review/display'], {queryParams: {cid: id, auid: this.uid, aacid: accountId}})
        }else  if (type === "YOUTUBE" || type === "Youtube") {
          this.router.navigate(['/campaigns/review/native'], {queryParams: {cid: id, auid: this.uid, aacid: accountId}})
        }else  if (type === "SEARCH" || type === "Search") {
          this.router.navigate(['/campaigns/review/search'], {queryParams: {cid: id, auid: this.uid, aacid: accountId}})
        }
        
      }
    })
  }
  ngOnInit(): void {
 
     this.filterSettings = { type: "Menu" };      
        this.filter = { type: "CheckBox" };    
        this.selectionSettings = {persistSelection: true, type: "Single", checkboxOnly: true };
      this.gridLines = 'Both';
        this.selectionOptions = { type: 'Multiple' };
        this.toolbarOptions = ['Search', 'ColumnChooser'];
        this.contextMenuItems = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
                'Copy', 'Edit', 'Delete', 'Save', 'Cancel', 'FirstPage', 'PrevPage',
          'LastPage', 'NextPage'];
        
    this.customAttributes1 = { class: 'customCss1' };
    this.customAttributes2 = { class: 'customCss2' };
    this.customAttributes3 = {class: 'customCss3'};
  }
  ngAfterViewInit(): void {
   
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
   
      

  }

   initialValue: number = 1
  nextPage() {
        
        this.initialPage = { currentPage:  ++this.initialValue};
  }
  previousPage() {
        
        this.initialPage = { currentPage:  --this.initialValue};
    }

    buttonStatusEnter(id: string) {
    document.getElementById(id).classList.remove('d-none')
  }
  buttonStatusLeave(id: string) {
        document.getElementById(id).classList.add('d-none')
  }

  selectHighlightEnter(id: string) {
    document.getElementById(id).classList.add('highlight')
  }
  selectHighlightLeave(id: string) {
     document.getElementById(id).classList.remove('highlight')
  }
  user_role: User_Role = undefined
  getData() {
    this.storageService.getUserIdAndAccountId().then(response => {
      if (response !== null) {
        this.uid = response.auid
        this.adf_account_id = response.aacid
        this.user_role = response.role
        if (response.fromOwned) {
          this.searchService.getListCampaign(this.uid, this.adf_account_id).pipe(take(1)).subscribe(dataDisplay => {

              this.campaigns = dataDisplay
              this.isLoading = false
             
              setTimeout(() => {
                if(this.gridCampaign!==undefined){
                  this.gridCampaign.refresh()

                }
              }, 500);

            
         })
          
        } else {
         this.searchService.getListCampaign(response.account.owner, this.adf_account_id).pipe(take(1)).subscribe(dataDisplay => {
              this.campaigns = dataDisplay
              this.isLoading = false
             
              setTimeout(() => {
                if(this.gridCampaign!==undefined){
                  this.gridCampaign.refresh()

                }
              }, 500);

            
         })
        }
      }
    })
  }

   onDataBound(args:any):void {
       
        
   }

  selectChange(event: any) {
    this.gridCampaign.showSpinner()
    setTimeout(() => {
      this.gridCampaign.hideSpinner()
    },1000)
  }

  @ViewChild(SpinnerComponent, { static: false }) spinner: SpinnerComponent

   activateCampaign(id: string, campaign_id: number, type: string, budgetEnded: boolean) {
    if (budgetEnded === false) {
      
  
      if (type === "DISPLAY" || type === "NATIVE") {
        this.searchService.enableCampaign(id, campaign_id).then(res_activate => {
          if (res_activate === "ok") {
             this.openSnackBar(15, "Campagne activée avec succés !", "ok", "snack-success")
            this.getData()
            
          }else{
             this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
          }
        }).catch((e) => {
          this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
        })
      } else if (type === "YOUTUBE") {
        this.youtubeService.enableCampaign(id, campaign_id).then(res_activate => {
          if (res_activate === "ok") {
             this.openSnackBar(15, "Campagne activée avec succés !", "ok", "snack-success")
            this.getData()
            
          }else{
             this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
          }
        }).catch((e) => {
          this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
        })
          /* this.youtubeService.enableCampaign(id, campaign_id).then(res_activate => {
          if (res_activate === "ok") {
            this.spinner.message = "Campagne activée avec succés"
            this.loader = false
            
          }
        }) */
      }else if (type === "SEARCH" || type === "Search") {
        this.searchService.enableCampaign(id, campaign_id).then(res_activate => {
          if (res_activate === "ok") {
             this.openSnackBar(15, "Campagne activée avec succés !", "ok", "snack-success")
            this.getData()
            
          }else{
             this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
          }
        }).catch((e) => {
          this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
        })
          /* this.youtubeService.enableCampaign(id, campaign_id).then(res_activate => {
          if (res_activate === "ok") {
            this.spinner.message = "Campagne activée avec succés"
            this.loader = false
            
          }
        }) */
      }
   
    }
  }

  loader: boolean = false
  pauseCampaign(id: string, campaign_id: number, type: string, budgetEnded: boolean) {

    if (type === "DISPLAY" || type === "NATIVE") {
      this.searchService.disableCampaign(id, campaign_id).then(res_activate => {
        if (res_activate === "ok") {
           this.openSnackBar(15, "Campagne mis en veille !", "ok", "snack-danger")
         this.getData()
          
        } else {
          
        }
      }).catch((e) => {
       
      })
    } else if (type === "YOUTUBE") {
        this.youtubeService.disableCampaign(id, campaign_id).then(res_activate => {
          if (res_activate === "ok") {
           this.openSnackBar(15, "Campagne mise en veille !", "ok", "snack-danger")
         this.getData()
          
        } else {
           this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
        }
      }).catch((e) => {
        this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
      })
    }else if (type === "SEARCH" || type==='Search') {
      this.searchService.disableCampaign(id, campaign_id).then(res_activate => {
        if (res_activate === "ok") {
         this.openSnackBar(15, "Campagne mise en veille !", "ok", "snack-danger")
       this.getData()
        
      } else {
         this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
      }
    }).catch((e) => {
      this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
    })
  }
    
  }
}
