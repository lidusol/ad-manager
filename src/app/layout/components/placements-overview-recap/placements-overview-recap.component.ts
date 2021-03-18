import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsRoutingModule } from 'src/app/accounts/accounts-routing.modules';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { Display, PlacementReport } from 'src/app/campaigns-management/models/display.models';
import {Account, User_Role} from '../../../utils/data'
import { ToolbarItems, ContextMenuItem, GridLine, SelectionSettingsModel, GridComponent, PageSettingsModel, GroupSettingsModel, SearchSettingsModel } from '@syncfusion/ej2-angular-grids';
import { LocalStorageService } from '../../services/local-storage.service';
import { SERVER } from 'src/environments/environment';
import { SpinnerComponent } from '../spinner/spinner.component';
import * as _ from 'lodash';


@Component({
  selector: 'adf-placements-overview-recap',
  templateUrl: './placements-overview-recap.component.html',
  styleUrls: ['./placements-overview-recap.component.scss']
})
export class PlacementsOverviewRecapComponent implements OnInit {
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
    { text: 'DÃ©penses', value: 'costs' },
    { text: 'Ctr', value: 'ctr' },
    { text: 'Interactions', value: 'interactions' },
    { text: 'Conversions', value: 'conversions' },
    { text: 'Taux de conversion', value: 'convRate' },
    
  ]
  user_access: User_Role = undefined

  DEFAULT_CLIENT_CUSTOMER_ID = SERVER.CLIENT_CUSTOMER_ID
  @ViewChild('gridPlacementsRecap', {static: false}) gridCampaign: GridComponent
  uid: string = ""
  adf_account_id: string = ""
  constructor(private route: ActivatedRoute, private accountsService: AccountsService, private displayService: DisplayService, private router: Router, private storageService: LocalStorageService) { }
  campaigns: Display[] = []
  accounts: Account[] = []
   public entityName: Object = {class: 'entity-column'};
 public initialPage: PageSettingsModel = { pageSize: 5 };

  goReviewNotPublish(id: string, type: string) {
    if (type === "DISPLAY") {
      this.router.navigate(['/campaigns/review/display'], {queryParams: {cid: id, uid: this.uid, aacid: this.adf_account_id}})
    }
    
  }
  PARSE_INT = (element: string) => {
    return parseInt(element)
  }
  PARSE_FLOAT = (element: string) => {
    return parseFloat(element)
  }
  public groupOptions: GroupSettingsModel;
    public searchSettings: SearchSettingsModel;
  ngOnInit(): void {
  this.searchSettings = {fields: ['displayName']};
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
    this.initialPage = { pageSize: 5 };
   /*  setTimeout(() => {
      
      this.getData()
    },2000) */
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
  campaignIDS = []
  data:Display[] = []
  getCampaignsIdList(uid: string, account_id: string): Promise<string>{
    return new Promise(resolve => {
      this.campaignIDS = []
      this.displayService.getListCampaign(uid, account_id).subscribe(result => {
        this.data = result
        let statement: Display[] = []
      
        let data: Display[] = this.data.filter(cmp=>cmp.id_campagne !== 0)

        //console.log(data)
        //console.log(data.length)
        
        _.forEach(data, (cmp, index, array) => {
          if (index === data.length - 1) {
              if (cmp.id_campagne !== 0) {
                this.campaignIDS.push(cmp.id_campagne.toString())
                
            }
            //console.log('ok')
              resolve('ok')
            } else {
               if (cmp.id_campagne !== 0) {
                this.campaignIDS.push(cmp.id_campagne.toString() + "")
                
              }
            }
        })
      })
    })
  }
  listString: string = ""
  uid_action: string = ""
  reports: PlacementReport[] = []
  campaign_id: number = 0
  getData() {
    this.storageService.getUserIdAndAccountId().then(response => {
      if (response !== null) {
        this.uid = response.auid
        this.adf_account_id = response.aacid
        this.user_role = response.role
        if (response.fromOwned) {
          this.uid_action = response.auid
          if (this.campaign_id === 0) {
             this.reports = []
            this.isLoading = false
             setTimeout(() => {
                  this.gridCampaign.dataSource = []
                   this.gridCampaign.refresh()
            
             }, 500);
          } else {
            this.displayService.getPlacementSummuryReport(this.campaign_id).then(report => {
                  //console.log(report)
                  this.reports = report
                  this.isLoading = false
                  setTimeout(() => {
                    this.gridCampaign.dataSource = report
                     this.gridCampaign.refresh()
              
               }, 500);
                }).catch((e) => {
                  this.isLoading = false
                })
            
          }
         /*  this.getCampaignsIdList(this.uid, this.adf_account_id).then(response_status => {
            //console.log(response_status)
            if (response_status === 'ok') {
              //console.log(this.campaignIDS.join(','))
              
            }
          }) */
      
          
        } else {
          this.uid_action = response.account.owner
           if (this.campaign_id === 0) {
             this.reports = []
            this.isLoading = false
             setTimeout(() => {
                  this.gridCampaign.dataSource = []
                   this.gridCampaign.refresh()
            
             }, 500);
          } else {
            
            this.displayService.getPlacementSummuryReport(this.campaign_id).then(report => {
                  //console.log(report)
                  this.reports = report
                  this.isLoading = false
                  setTimeout(() => {
                    this.gridCampaign.dataSource = report
                     this.gridCampaign.refresh()
              
               }, 500);
                }).catch((e) => {
                  this.isLoading = false
                })
          }
       /*  this.getCampaignsIdList(response.account.owner, this.adf_account_id).then(response_status => {
          if (response_status === 'ok') {
               //console.log(this.campaignIDS.join(','))
              this.displayService.getPlacementSummuryReport(this.campaign_id).then(report => {
                //console.log(report)
                this.reports = report
                this.isLoading = false
                setTimeout(() => {
                  this.gridCampaign.dataSource = report
                   this.gridCampaign.refresh()
          
             }, 500);
              }).catch((e) => {
                this.isLoading = false
              })
            }
          }) */
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
      
      this.loader = true
      setTimeout(() => {
        this.spinner.message = "Activation de la campagne en cours"
      if (type === "DISPLAY" || type === "Native") {
        this.displayService.enableCampaign(id, campaign_id).then(res_activate => {
          if (res_activate === "ok") {
            this.spinner.message = "Campagne activée avec succès"
            this.loader = false
            
          }else{
            this.loader = false
          }
        }).catch((e) => {
          this.spinner.message = "Une erreur est survenue réessayer"
          this.loader = false
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
    if (type === "DISPLAY" || type === "Native") {
      this.displayService.disableCampaign(id, campaign_id).then(res_activate => {
        if (res_activate === "ok") {
          this.spinner.message = "Campagne désactivée avec succès"
          this.loader = false
          
        } else {
          this.loader = false
        }
      }).catch((e) => {
        this.spinner.message = "Une erreur est survenue réessayer"
          this.loader = false
      })
    } else if (type === "Youtube") {
        /* this.youtubeService.disableCampaign(id, campaign_id).then(res_activate => {
        if (res_activate === "ok") {
          this.spinner.message = "Campagne déactivée avec succès"
          this.loader = false
          
        }
      }) */
    }
    },500)
  }

}
