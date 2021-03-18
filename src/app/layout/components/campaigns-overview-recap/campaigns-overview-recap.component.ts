import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsRoutingModule } from 'src/app/accounts/accounts-routing.modules';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { Display } from 'src/app/campaigns-management/models/display.models';
import {Account, User_Role} from '../../../utils/data'
import { ToolbarItems, ContextMenuItem, GridLine, SelectionSettingsModel, GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { LocalStorageService } from '../../services/local-storage.service';
import { SERVER } from 'src/environments/environment';
import { SpinnerComponent } from '../spinner/spinner.component';
import { take } from 'rxjs/operators';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SearchService } from 'src/app/campaigns-management/services/search.service';
import { AdOverviewRecapComponent } from '../ad-overview-recap/ad-overview-recap.component';
import { AgePerformanceReportComponent } from '../age-performance-report/age-performance-report.component';
import { CampaignNativeOverviewRecapComponent } from '../campaign-native-overview-recap/campaign-native-overview-recap.component';
import { CampaignSearchOverviewRecapComponent } from '../campaign-search-overview-recap/campaign-search-overview-recap.component';
import { GenderPerformanceReportComponent } from '../gender-performance-report/gender-performance-report.component';
import { GeoPerformanceTargetComponent } from '../geo-performance-target/geo-performance-target.component';
import { NativeAdsOverviewRecapComponent } from '../native-ads-overview-recap/native-ads-overview-recap.component';
import { SearchAdsOverviewRecapComponent } from '../search-ads-overview-recap/search-ads-overview-recap.component';



@Component({
  selector: 'adf-campaigns-overview-recap',
  templateUrl: './campaigns-overview-recap.component.html',
  styleUrls: ['./campaigns-overview-recap.component.scss']
})
export class CampaignsOverviewRecapComponent implements OnInit {
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
  @ViewChild(CampaignsOverviewRecapComponent, { static: false }) campaignsOverviewrecap: CampaignsOverviewRecapComponent
	@ViewChild(CampaignNativeOverviewRecapComponent, { static: false }) campaignsNativeOverviewrecap: CampaignNativeOverviewRecapComponent
	@ViewChild(AdOverviewRecapComponent, { static: false }) adsOverviewrecap: AdOverviewRecapComponent
	@ViewChild(CampaignSearchOverviewRecapComponent, { static: false }) campaignsSearchOverviewrecap: CampaignSearchOverviewRecapComponent
	@ViewChild(SearchAdsOverviewRecapComponent, { static: false }) adsSearchOverviewrecap: SearchAdsOverviewRecapComponent
	@ViewChild(NativeAdsOverviewRecapComponent, { static: false }) nativeAdsOverviewrecap: NativeAdsOverviewRecapComponent
	@ViewChild(SearchAdsOverviewRecapComponent, { static: false }) searchAdsOverviewrecap: SearchAdsOverviewRecapComponent
	@ViewChild(GeoPerformanceTargetComponent, { static: false }) geoPerformanceComponent: GeoPerformanceTargetComponent
	@ViewChild(AgePerformanceReportComponent, { static: false }) agePerformanceComponent: AgePerformanceReportComponent
	@ViewChild(GenderPerformanceReportComponent, { static: false }) gendersPerformanceComponent: GenderPerformanceReportComponent
  DEFAULT_CLIENT_CUSTOMER_ID = SERVER.CLIENT_CUSTOMER_ID
  @ViewChild('gridCampaignsRecap', {static: false}) gridCampaign: GridComponent
  uid: string = ""
  adf_account_id: string = ""
  constructor(private route: ActivatedRoute, private accountsService: AccountsService, private displayService: DisplayService, private searchService: SearchService, private router: Router, private storageService: LocalStorageService, private youtubeService: YoutubeService) {
    
   }
  campaigns: Display[] = []
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
          this.router.navigate(['/campaigns/review/display'], {queryParams: {cid: id, auid: this.uid, aacid: this.adf_account_id}})
        }else  if (type === "YOUTUBE" || type === "Youtube") {
          this.router.navigate(['/campaigns/review/native'], {queryParams: {cid: id, auid: this.uid, aacid: this.adf_account_id}})
        }else  if (type === "SEARCH" || type === "Search") {
          this.router.navigate(['/campaigns/review/search'], {queryParams: {cid: id, auid: this.uid, aacid: this.adf_account_id}})
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

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([])
  currentExpanded: string = ''
  currentAdGroupId: number;
  expandTab(id: string, type: string, ad_group_id: number){
    //console.log(type)
    //console.log(ad_group_id)
    let element = document.getElementById(id)
    this.currentExpanded = id
    this.currentAdGroupId = ad_group_id
    // if(this.currentExpanded!==''){
    //   if(document.getElementById(this.currentExpanded)!==undefined){
    //     document.getElementById(this.currentExpanded).classList.remove('expanded') 
    //   }
    //   this.triggerExpansion(element, id)
    // }else{
    // } 
    // this.triggerExpansion(element, id)
    if (type === "DISPLAY" || type === "Display") {
      //console.log('getting-data')
      setTimeout(() => {
        if(this.currentAdGroupId!==0){
          this.adsOverviewrecap.ad_group_id = this.currentAdGroupId
          this.adsOverviewrecap.getData()
        }
        
      }, 500);
    } else if (type === "YOUTUBE" || type === "Youtube") {
      setTimeout(() => {
        if(this.currentAdGroupId!==0){
          this.nativeAdsOverviewrecap.ad_group_id = this.currentAdGroupId
          this.nativeAdsOverviewrecap.getData()
        }
        
      }, 500);
    }else if (type === "SEARCH" || type === "Search") {
      setTimeout(() => {
        if(this.currentAdGroupId!==0){
          this.searchAdsOverviewrecap.ad_group_id = this.currentAdGroupId
          this.searchAdsOverviewrecap.getData()
        }
        
      }, 500);
    }
    
  }

  triggerExpansion(element: any, id: string, ){
    if(element!==undefined && element!==null){
      if(!element.classList.contains('expanded')){
        element.classList.add('expanded')
      }
    }
    this.currentExpanded = id
  }
  // { id: 'all', name: 'cmp_data_table.all_cmp_label'  }, 
  MENU_FILTER_OPTION_SUB_MENU: { id: string, name?: string} = { id: 'az', name: 'cmp_data_table.a_to_z'  }
  MENU_FILTER_OPTION: { id: string, menu?: {id: string, name: string}[], name?: string}[] = [
    {
      id: 'order_menu', name: 'cmp_data_table.order_label', menu: [
        { id: 'az', name: 'cmp_data_table.a_to_z' }, { id: 'za', name: 'cmp_data_table.z_to_a'}, 
      ]
    },
    {id: 'network_menu', name: 'cmp_data_table.network_label_menu', menu: [
      { id: 'dsp', name: 'cmp_data_table.all_dsp_campaigns' }, { id: 'rsdp', name: 'cmp_data_table.all_rsdp_campaigns' },{ id: 'sa', name: 'cmp_data_table.all_sa_campaigns' }]
    },
    {
      id: 'status_menu', name: 'cmp_data_table.status_label_menu', menu: [
        { id: 'enabled', name: 'cmp_data_table.enabled' }, { id: 'paused', name: 'cmp_data_table.paused'},{ id: 'ended', name: 'cmp_data_table.all_ended_campaigns' }, 
      ]
    },
    {
      id: 'budget_menu', name: 'cmp_data_table.budget_label_menu', menu: [
        { id: 'asc', name: 'cmp_data_table.ascending_order_label' }, { id: 'desc', name: 'cmp_data_table.ascending_order_label'}, 
      ]
    },
  ]
  selectedOptionFilterStatus: { id: string, menu?: {id: string, name: string}[], name?: string} =  this.MENU_FILTER_OPTION[0]

  selectedItem(option: { id: string, menu?: {id: string, name: string}[], name?: string}) {
    return this.MENU_FILTER_OPTION.some(item=>item.id===option.id && this.selectedOptionFilterStatus.id===item.id)
  }

  selectedItemSubMenu(option: {id: string, name: string}):boolean {
  
    return this.MENU_FILTER_OPTION_SUB_MENU.id===option.id;
  }
  dataDisplayFiltered: any;
  onOptionSubmenuSelect(opt: { id: string, menu?: {id: string, name: string}[], name?: string}, option: {id: string, name: string}){
    this.selectedOptionFilterStatus = opt
    this.MENU_FILTER_OPTION_SUB_MENU = option
    if(this.selectedOptionFilterStatus.id==='order_menu'){
      if(this.MENU_FILTER_OPTION_SUB_MENU.id==='az'){
        this.dataDisplayFiltered = this.campaigns.sort((a, b)=>{
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
      })
      this.dataSource.data = this.dataDisplayFiltered
      }else if(this.MENU_FILTER_OPTION_SUB_MENU.id==='za'){
        this.dataDisplayFiltered = this.campaigns.sort((a, b)=>{
          if(b.name < a.name) { return -1; }
          if(b.name > a.name) { return 1; }
          return 0;
      })
      this.dataSource.data = this.dataDisplayFiltered
      } 
    }else if(this.selectedOptionFilterStatus.id==='network_menu'){
      if(this.MENU_FILTER_OPTION_SUB_MENU.id==='dsp'){
        this.dataDisplayFiltered = this.campaigns.filter(campaign=> campaign.type.toLowerCase()==='display')
      this.dataSource.data = this.dataDisplayFiltered
      }else if(this.MENU_FILTER_OPTION_SUB_MENU.id==='rsdp'){
        this.dataDisplayFiltered = this.campaigns.filter(campaign=> campaign.type.toLowerCase()==='youtube')
        this.dataSource.data = this.dataDisplayFiltered
      }else if(this.MENU_FILTER_OPTION_SUB_MENU.id==='sa'){
        this.dataDisplayFiltered = this.campaigns.filter(campaign=> campaign.type.toLowerCase()==='search')
        this.dataSource.data = this.dataDisplayFiltered
      } 
    }else if(this.selectedOptionFilterStatus.id==='status_menu'){
      if(this.MENU_FILTER_OPTION_SUB_MENU.id==='enabled'){
        this.dataDisplayFiltered = this.campaigns.filter(campaign=> !campaign.budgetEnded && campaign.isPayed && campaign.type==='ENABLED')
        this.dataSource.data = this.dataDisplayFiltered
      }else if(this.MENU_FILTER_OPTION_SUB_MENU.id==='paused'){
        this.dataDisplayFiltered = this.campaigns.filter(campaign=> !campaign.budgetEnded && campaign.isPayed && campaign.type==='PAUSED')
        this.dataSource.data = this.dataDisplayFiltered
      }else if(this.MENU_FILTER_OPTION_SUB_MENU.id==='ended'){
        this.dataDisplayFiltered = this.campaigns.filter(campaign=> campaign.budgetEnded && campaign.isPayed)
        this.dataSource.data = this.dataDisplayFiltered
      }
    }else if(this.selectedOptionFilterStatus.id==='budget_menu'){
      if(this.MENU_FILTER_OPTION_SUB_MENU.id==='asc'){
        this.dataDisplayFiltered = this.campaigns.sort((a, b)=>{
          if(a.realBudget < b.realBudget) { return -1; }
          if(a.realBudget > b.realBudget) { return 1; }
          return 0;
      })
      this.dataSource.data = this.dataDisplayFiltered
      }else if(this.MENU_FILTER_OPTION_SUB_MENU.id==='desc'){
        this.dataDisplayFiltered = this.campaigns.sort((a, b)=>{
          if(b.realBudget < a.realBudget) { return -1; }
          if(b.realBudget > a.realBudget) { return 1; }
          return 0;
      })
      this.dataSource.data = this.dataDisplayFiltered
      }
    }
    
  }
  onOptionSelect(selected: {id: string, name: string}) { 
    this.selectedOptionFilterStatus = selected
    if (this.selectedOptionFilterStatus.id === 'all') {
      this.dataDisplayFiltered = this.campaigns
      this.dataSource.data = this.dataDisplayFiltered
    } else if (this.selectedOptionFilterStatus.id === 'enabled'){
      this.dataDisplayFiltered = this.campaigns.filter(campaign=> !campaign.budgetEnded && campaign.isPayed && campaign.status==='ENABLED')
      this.dataSource.data = this.dataDisplayFiltered
    } else if (this.selectedOptionFilterStatus.id === 'paused') {
      this.dataDisplayFiltered = this.campaigns.filter(campaign=> !campaign.budgetEnded && campaign.isPayed && campaign.status==='PAUSED')
      this.dataSource.data = this.dataDisplayFiltered
    } else if (this.selectedOptionFilterStatus.id === 'ended') {
      this.dataDisplayFiltered = this.campaigns.filter(campaign=> campaign.budgetEnded && campaign.isPayed)
      this.dataSource.data = this.dataDisplayFiltered
    }else if (this.selectedOptionFilterStatus.id === 'dsp') {
      this.dataDisplayFiltered = this.campaigns.filter(campaign=> campaign.budgetEnded && campaign.isPayed)
      this.dataSource.data = this.dataDisplayFiltered
    }else if (this.selectedOptionFilterStatus.id === 'rsdp') {
      this.dataDisplayFiltered = this.campaigns.filter(campaign=> campaign.budgetEnded && campaign.isPayed)
      this.dataSource.data = this.dataDisplayFiltered
    }else if (this.selectedOptionFilterStatus.id === 'sa') {
      this.dataDisplayFiltered = this.dataDisplayFiltered.filter(campaign=> campaign.type)
      this.dataSource.data = this.dataDisplayFiltered
    }
  }
  compareWith(o1: { id: string, menu?: {id: string, name: string}[], name?: string}, o2: { id: string, menu?: {id: string, name: string}[], name?: string}) {
    return o1.id===o2.id && o1.name===o2.name
  }

  compareWithSubMenu(o1: {id: string, name: string}, o2: {id: string, name: string}) {
    return o1.id===o2.id && o1.name===o2.name
  }
  hideTab(id: string, type: string, ad_group_id: number){
    this.currentExpanded = ''
    // let element = document.getElementById(id) 
    // if(element!==undefined && element!==null){
    //   if(element.classList.contains('expanded')){
    //     element.classList.remove('expanded')
    //   }
    // }
  }

  onPageChange(pageNo: number) {
    //console.log("Current page: ", pageNo);
  }
  pageOfItems: Array<any>;
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
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
          this.displayService.getListCampaign(this.uid, this.adf_account_id).pipe(take(1)).subscribe(dataDisplay => {
            this.youtubeService.getListCampaign(this.uid, this.adf_account_id).pipe(take(1)).subscribe(dataYoutube => {
              this.searchService.getListCampaign(this.uid, this.adf_account_id).pipe(take(1)).subscribe(dataSearch => {
                this.isLoading = false
                this.campaigns = [...dataDisplay, ...dataYoutube, ...dataSearch]
                this.dataSource.data = this.campaigns.sort((a, b)=>{
                  if(a.name < b.name) { return -1; }
                  if(a.name > b.name) { return 1; }
                  return 0;
              })
              
                setTimeout(() => {
                  this.dataSource.paginator = this.paginator;
              
                  this.obs = this.dataSource.connect();
                  if(this.paginator!==undefined){
                    this.paginator.page.subscribe(page=>{
                      //console.log(page)
                      document.getElementById('cmp_block').scrollIntoView()
                    })

                  }
                  if(this.gridCampaign!==undefined){
                    this.gridCampaign.refresh()
   
                  }
                }, 500);
  
               })


             })
              

            
         })
          
        } else {
          this.displayService.getListCampaign(response.account.owner, this.adf_account_id).pipe(take(1)).subscribe(dataDisplay => {
            this.youtubeService.getListCampaign(response.account.owner, this.adf_account_id).pipe(take(1)).subscribe(dataYoutube => {
              this.searchService.getListCampaign(response.account.owner, this.adf_account_id).pipe(take(1)).subscribe(dataSearch => {
                this.isLoading = false
                this.campaigns = [...dataDisplay, ...dataYoutube, ...dataSearch]
                this.dataSource.data = this.campaigns.sort((a, b)=>{
                  if(a.name < b.name) { return -1; }
                  if(a.name > b.name) { return 1; }
                  return 0;
              })
              
                setTimeout(() => {
                  this.dataSource.paginator = this.paginator;
                  this.obs = this.dataSource.connect();
                  

                  if(this.paginator!==undefined){
                    this.paginator.page.subscribe(page=>{
                      //console.log(page)
                      document.getElementById('cmp_block').scrollIntoView()
                    })

                  }

                  if(this.gridCampaign!==undefined){
                    this.gridCampaign.refresh()
   
                  }
                }, 500);
  
               })


             })
              

            
         })
        }
      }
    })
  }

  ngOnDestroy() {
    if (this.dataSource) { 
      this.dataSource.disconnect(); 
    }
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
      
  
      if (type === "DISPLAY" || type === "Display") {
        this.displayService.enableCampaign(id, campaign_id).then(res_activate => {
          if (res_activate === "ok") {
             this.openSnackBar(15, "Campagne activée avec succés !", "ok", "snack-success")
            this.getData()
            
          }else{
             this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
          }
        }).catch((e) => {
          this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
        })
      } else if (type === "YOUTUBE" || type === "Youtube") {
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
      }
   
    }
  }

  loader: boolean = false
  pauseCampaign(id: string, campaign_id: number, type: string, budgetEnded: boolean) {

    if (type === "DISPLAY" || type === "Display") {
      this.displayService.disableCampaign(id, campaign_id).then(res_activate => {
        if (res_activate === "ok") {
           this.openSnackBar(15, "Campagne mis en veille !", "ok", "snack-danger")
         this.getData()
          
        } else {
          
        }
      }).catch((e) => {
       
      })
    } else if (type === "YOUTUBE" || type === "Youtube") {
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
    }else if (type === "SEARCH" || type === "Search") {
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
