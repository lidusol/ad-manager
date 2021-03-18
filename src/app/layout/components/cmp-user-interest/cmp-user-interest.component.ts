import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatRadioGroup } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { SearchService } from 'src/app/campaigns-management/services/search.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { USER_INTEREST, User_Role } from 'src/app/utils/data';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'adf-cmp-user-interest',
  templateUrl: './cmp-user-interest.component.html',
  styleUrls: ['./cmp-user-interest.component.scss']
})
export class CmpUserInterestComponent implements OnInit {
  @ViewChild('channelsExpansion', { static: false }) channelsExpansion: MatExpansionPanel
  @ViewChild('channelsOptions', { static: false }) channelsOptions: MatRadioGroup;
  @ViewChild('matSelectionListInMarket', { static: false }) matSelectionListInMarket: MatSelectionList;
  @ViewChild('matSelectionListBrand', { static: false }) matSelectionListBrand: MatSelectionList;
  @ViewChild('matSelectionListMobileApp', { static: false }) matSelectionListMobileApp: MatSelectionList;
  searchChannels: FormControl = new FormControl('')
  videosPanel: boolean = false
  channelsPanel: boolean = false
  generalPanel: boolean = true
  websitesPanel: boolean = false
  showProgressSearch: boolean = false
  aacid: string = ""
  cid: string = undefined
  uid: string = undefined;
  campaignId: number = 0
  ad_group_id: number = 0
  idA: string = ""
  adf_account_id: string = ""
  uid_action: string= ""
  user_access: User_Role;
  campaignType: string = ""
  currentUserInterest: USER_INTEREST[] = []
  newUserInterest: USER_INTEREST[] = []
  user_interest_brand: USER_INTEREST[] = []
  user_interest_in_market: USER_INTEREST[] = []
  user_interest_mobile_app_installer: USER_INTEREST[] = []
  new_user_interest_brand: USER_INTEREST[] = []
  new_user_interest_in_market: USER_INTEREST[] = []
  new_user_interest_mobile_app_installer: USER_INTEREST[] = []
  new_brand_find: USER_INTEREST[] = []
  new_in_market_find: USER_INTEREST[] = []
  new_mobile_app_installer_find: USER_INTEREST[] = []
  constructor(private route: ActivatedRoute, private storageService: LocalStorageService, private displayService: DisplayService, private youtubeService: YoutubeService, private searchService: SearchService, private router: Router) { 
    this.displayService.getListBRAND().pipe(take(1)).subscribe(brand=>{
      this.displayService.getListIN_MARKET().pipe(take(1)).subscribe(inMarket=>{
        this.displayService.getListMOBILE_APP_INSTALL_USER().pipe(take(1)).subscribe(mai=>{
          mai.shift()
          this.user_interest_brand = brand
          this.user_interest_in_market = inMarket
          this.user_interest_mobile_app_installer = mai
          this.new_brand_find = brand
          this.new_in_market_find = inMarket
          this.new_mobile_app_installer_find = mai
          
        })
      })
    })
    this.searchChannels.valueChanges.subscribe(val=>{
      this.search()
    })
  }

  selectedElements: USER_INTEREST[] = []
  onMobileAppSelect(args) {
    let selected = this.matSelectionListMobileApp.selectedOptions.selected
  let websites: USER_INTEREST[] = []
    selected.forEach(site => {
      websites.push(site.value)
      return websites
    })
    this.new_user_interest_mobile_app_installer = websites
    this.selectedElements = [...this.selectedElements, ...[...this.new_user_interest_brand, ...this.user_interest_in_market, ...this.new_user_interest_mobile_app_installer]]

  
  }
  onInMarketSelect(args) {
    let selected = this.matSelectionListInMarket.selectedOptions.selected
     let videos: USER_INTEREST[] = []
    selected.forEach(video => {
      videos.push(video.value)
      return videos
    })
    this.new_user_interest_in_market = videos
    this.selectedElements = [...this.selectedElements, ...[...this.new_user_interest_brand, ...this.user_interest_in_market, ...this.new_user_interest_mobile_app_installer]]
  
  }
  onBrandSelect(args) {
    let selected: MatListOption[] = this.matSelectionListBrand.selectedOptions.selected
    let channels: USER_INTEREST[] = []
    selected.forEach(channel => {
      channels.push(channel.value)
      return channels
    })
    this.new_user_interest_brand = channels
    this.selectedElements = [...this.selectedElements, ...[...this.new_user_interest_brand, ...this.user_interest_in_market, ...this.new_user_interest_mobile_app_installer]]
  }

  toggleBrandPanel() {
    this.channelsPanel = true
    this.videosPanel = false
    this.websitesPanel = false
    this.generalPanel = false 
  setTimeout(() => {
      if (this.new_user_interest_brand.length > 0) {
      this.new_user_interest_brand.forEach(channel => {
        this.matSelectionListBrand.options.forEach(element => {
        if (element.value.criterionId.toString() === channel.criterionId) {
          if (!element.selected) {
            element.toggle()
          }
        }
      })
        
      })
    }
   },500)
  }
  toggleInMarketPanel() {
    this.videosPanel = true
    this.channelsPanel = false
    this.websitesPanel = false
    this.generalPanel = false 
    setTimeout(() => {
      if (this.new_user_interest_in_market.length > 0) {
        this.new_user_interest_in_market.forEach(video => {
        this.matSelectionListInMarket.options.forEach(element => {
        if (element.value.criterionId.toString() === video.criterionId.toString()) {
          if (!element.selected) {
            element.toggle()
          }
        }
      })
        
      })
    }
    },500)
  }

toggleMobileAppPanel() {
    this.websitesPanel = true
    this.videosPanel = false
    this.channelsPanel = false
    this.generalPanel = false 
    setTimeout(() => {
      if (this.new_user_interest_mobile_app_installer.length > 0) {
        this.new_user_interest_mobile_app_installer.forEach(site => {
        this.matSelectionListMobileApp.options.forEach(element => {
        if (element.value.criterionId.toString() === site.criterionId.toString()) {
          if (!element.selected) {
            element.toggle()
          }
        }
      })
        
      })
    }
    },500)
  }

  toggleGeneralPanel() {
    this.generalPanel = true 
    this.channelsPanel = false
  this.videosPanel = false
  this.websitesPanel = false
  }

  removeSelectedBrand(channel: USER_INTEREST) {
    this.new_user_interest_brand.forEach((item, index, arr) => {
      if (item.criterionId.toString() === channel.criterionId.toString()) {
        this.new_user_interest_brand.splice(index, 1)
      }
    })
    this.matSelectionListBrand.selectedOptions.selected.forEach(element => {
      if (element.value.criterionId.toString() === channel.criterionId.toString()) {
        if (element.selected) {
          element.toggle()
        }
      }
    })
  }

  removeSelectedInMarket(video: USER_INTEREST) {
    this.new_user_interest_in_market.forEach((item, index, arr) => {
      if (item.criterionId.toString() === video.criterionId.toString()) {
        this.new_user_interest_in_market.splice(index, 1)
      }
    })
    this.matSelectionListInMarket.selectedOptions.selected.forEach(element => {
      if (element.value.criterionId.toString() === video.criterionId.toString()) {
        if (element.selected) {
          element.toggle()
        }
      }
    })
  }
  removeSelectedMobileApp(site: USER_INTEREST) {
    this.new_user_interest_mobile_app_installer.forEach((item, index, arr) => {
      if (item.criterionId.toString() === site.criterionId.toString()) {
        this.new_user_interest_mobile_app_installer.splice(index, 1)
      }
    })
    this.matSelectionListMobileApp.selectedOptions.selected.forEach(element => {
      if (element.value.criterionId.toString() === site.criterionId.toString()) {
        if (element.selected) {
          element.toggle()
        }
      }
    })
  }

  search() {
    this.showProgressSearch = true
    setTimeout(() => {

      if(this.searchChannels.value.toString().length>0){
        
        this.new_brand_find = this.user_interest_brand.filter(brand=>brand.name.includes(this.searchChannels.value.toString()))
        this.new_in_market_find = this.user_interest_in_market.filter(market=>market.name.includes(this.searchChannels.value.toString()))
        this.new_mobile_app_installer_find = this.user_interest_mobile_app_installer.filter(mob_app=>mob_app.name.includes(this.searchChannels.value.toString()))
        
        this.showProgressSearch = false
        }else{
          this.new_brand_find = this.user_interest_brand
          this.new_in_market_find = this.user_interest_in_market
          this.new_mobile_app_installer_find = this.user_interest_mobile_app_installer
          this.showProgressSearch = false
        }

      
    },1000)
   

  }

  mergeMobileAppInUnique<USER_INTEREST>(array: USER_INTEREST[], property: any): USER_INTEREST[] {

  const newArray = new Map();

  array.forEach((item: USER_INTEREST) => {
    const propertyValue = item[property];
    newArray.has(propertyValue) ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) }) : newArray.set(propertyValue, item);
  });

  return Array.from(newArray.values());
}

  mergeBrandInUnique<USER_INTEREST>(array: USER_INTEREST[], property: any): USER_INTEREST[] {

  const newArray = new Map();

  array.forEach((item: USER_INTEREST) => {
    const propertyValue = item[property];
    newArray.has(propertyValue) ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) }) : newArray.set(propertyValue, item);
  });

  return Array.from(newArray.values());
  }
  
  mergeInMarketInUnique<USER_INTEREST>(array: USER_INTEREST[], property: any): USER_INTEREST[] {

  const newArray = new Map();

  array.forEach((item: USER_INTEREST) => {
    const propertyValue = item[property];
    newArray.has(propertyValue) ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) }) : newArray.set(propertyValue, item);
  });

  return Array.from(newArray.values());
}
createdNewUserInterest: USER_INTEREST[] = []
getUserInterest():Promise<string> {
  return new Promise(resolve => {
    if (this.new_user_interest_brand.length > 0 || this.new_user_interest_in_market.length>0 || this.new_user_interest_mobile_app_installer.length>0) {
      this.createdNewUserInterest = []  
      this.createdNewUserInterest = [...this.new_user_interest_brand, ...this.new_user_interest_in_market, ...this.new_user_interest_mobile_app_installer]
        resolve('ok')
    } else {
      this.createdNewUserInterest = []
      resolve('ok')
      }
    })
}
  ngOnInit(): void {
    if(this.creationStep){
      this.route.queryParams.subscribe(params => {
        this.storageService.getUserIdAndAccountId().then(response => {
          if (response !== null) {
            this.user_access = response.role
            this.aacid = response.aacid
            if (response.fromOwned) {
                this.uid_action = response.auid
               
              
              this.cid = params['cid'];
                   this.uid = response.auid
                   
                   this.getCampaignData()
              
            
                
            } else {
              
              this.uid_action = response.account.owner
       
              
              this.cid = params['cid'];
                 this.uid = response.auid;
                 this.getCampaignData()
              
           
                
              }
           
            
          
          }
          })
    
    })
    }
  }
  spinnerSave: boolean = false
  saveUserInterest(){
    this.spinnerSave= true
    this.getUserInterest().then(inter=>{
      if(this.createdNewUserInterest.length>0){
        this.displayService.targetNewUserInterest(this.createdNewUserInterest, this.cid, this.campaignId, this.idA, this.ad_group_id).then(saved=>{
          if(saved==='ok'){
            this.new_user_interest_brand = [] 
            this.new_user_interest_in_market= []
            this.new_user_interest_mobile_app_installer = []
            this.createdNewUserInterest = []
            this.spinnerSave= false
          }else{
            this.spinnerSave= false
          }
        }).catch(()=>{
          this.spinnerSave= false
        })
      }else{
        this.spinnerSave= false
      }
    })
  }
  spinnerRemove: boolean = false
  removeUserInterest(user_interest: USER_INTEREST){
    this.spinnerRemove = true
    if(this.campaignId!==0){
      this.displayService.removeUserInterest([user_interest], this.cid, this.campaignId, this.idA, this.ad_group_id).then(removed=>{
        if(removed==='ok'){
          this.spinnerRemove = false
        }else{
          this.spinnerRemove = false
        }
      }).catch(()=>{
        this.spinnerRemove = false
      })
    }else{
      let current: USER_INTEREST[] = this.currentUserInterest
      current.forEach((item, index)=>{
        if(item.criterionId.toString()===user_interest.criterionId.toString()){
            current.splice(index,1)
            this.displayService.updateCampaign(this.cid, {user_interest: current}).then(updated=>{
              if(updated==='ok'){
                this.spinnerRemove = false
              }else{
                this.spinnerRemove = false
              }
            })
        }
      })
    }
  }
  creationStep: boolean = true
  getCampaignData() {
    if (window.location.pathname === '/campaigns/settings/display') {
      
     this.displayService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
       console.log(campaign)
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
            this.creationStep=false
            this.idA = campaign.ad_group_id_firebase
            this.ad_group_id = campaign.ad_group_id
            this.campaignId = campaign.id_campagne
            this.campaignType = campaign.type
            if(this.campaignId===0){
              this.currentUserInterest = campaign.user_interest?campaign.user_interest:[] 
            }else{
              try{
                this.displayService.getAdGroup(this.idA).valueChanges().subscribe(adgroup=>{
                  if(adgroup!==undefined && adgroup!==null){
                    this.currentUserInterest = adgroup.user_interest?adgroup.user_interest:[]
                  }
                })

              }catch(e){
                console.log('error')
              }
            }
            }
          })
    } else if (window.location.pathname === '/campaigns/settings/native') {
      this.youtubeService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
        if (campaign === undefined) {
            this.router.navigate(['/campaigns'])
        } else {
          this.creationStep = false
          this.idA = campaign.ad_group_id_firebase
          this.ad_group_id = campaign.ad_group_id
          this.campaignId = campaign.id_campagne
          this.campaignType = campaign.type
          if(this.campaignId===0){
            this.currentUserInterest = campaign.user_interest?campaign.user_interest:[] 
          }else{
            try{
              this.youtubeService.getAdGroup(this.idA).valueChanges().subscribe(adgroup=>{
                if(adgroup!==undefined && adgroup!==null){
                  this.currentUserInterest = adgroup.user_interest?adgroup.user_interest:[]
                }
              })

            }catch(e){
              console.log('error')
            }
          }
          }
        })
    }  else {
      this.creationStep = true
   }
    
  }

}
