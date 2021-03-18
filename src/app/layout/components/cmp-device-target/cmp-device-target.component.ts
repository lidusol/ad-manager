import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router} from '@angular/router';
import { take } from 'rxjs/operators';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { SearchService } from 'src/app/campaigns-management/services/search.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { DEVICES_DATA, DEVICE_INTERFACE, User_Role } from 'src/app/utils/data';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'adf-cmp-device-target',
  templateUrl: './cmp-device-target.component.html',
  styleUrls: ['./cmp-device-target.component.scss']
})
export class CmpDeviceTargetComponent implements OnInit {
  devicesList: DEVICE_INTERFACE[] = DEVICES_DATA
  constructor(private displayService: DisplayService, private searchService: SearchService, private youtubeService: YoutubeService, private storageService: LocalStorageService, private route: ActivatedRoute, private router: Router) { }
  targetDesktop: boolean = true
  targetMobile: boolean = true
  targetTablet: boolean = true
  targetTv: boolean = true
  targetedDevices: DEVICE_INTERFACE[] = DEVICES_DATA
  excludedDevices: DEVICE_INTERFACE[] = []
  creationStep: boolean = undefined
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
  currentDevicesTargeted: DEVICE_INTERFACE[] = []
  currentDevicesExcluded: DEVICE_INTERFACE[] = []
  desktopChange(arg: MatCheckboxChange){
    this.devicesList = DEVICES_DATA
    this.targetDesktop = arg.checked
    let exist = this.targetedDevices.some(device=>device.criterionId===30000)
    let existExcluded = this.excludedDevices.some(device=>device.criterionId===30000)
    if(this.targetDesktop){
      if(!exist){
        this.targetedDevices.push(this.devicesList[0])  
      }
      if(existExcluded){
        this.excludedDevices.forEach((el,idx)=>{
          if(el.criterionId===30000){
            this.excludedDevices.splice(idx, 1)
          }
        })
      }
    }else{
      if(exist){
        this.targetedDevices.forEach((el,idx)=>{
          if(el.criterionId===30000){
            this.targetedDevices.splice(idx, 1)
            if(!existExcluded){
              this.excludedDevices.push(el)
            }
          }
        })
      }else{
        if(!existExcluded){
          this.excludedDevices.push(this.devicesList[0])
        }
      }
    }
    //console.log(this.excludedDevices)
  }
  mobileChange(arg: MatCheckboxChange){
    this.devicesList = DEVICES_DATA
    this.targetMobile = arg.checked
    let exist = this.targetedDevices.some(device=>device.criterionId===30001)
    let existExcluded = this.excludedDevices.some(device=>device.criterionId===30001)
    
    if(this.targetMobile){
      if(!exist){
        this.targetedDevices.push(this.devicesList[1])
      }
      if(existExcluded){
        this.excludedDevices.forEach((el,idx)=>{
          if(el.criterionId===30001){
            this.excludedDevices.splice(idx, 1)
          }
        })
      }
    }else{
      if(exist){
        this.targetedDevices.forEach((el,idx)=>{
          if(el.criterionId===30001){
            this.targetedDevices.splice(idx, 1)
            if(!existExcluded){
              this.excludedDevices.push(el)
            }
          }
        })
      }else{
        if(!existExcluded){
          this.excludedDevices.push(this.devicesList[1])
        }
      }
    }
    //console.log(this.excludedDevices)
  }
  tabletChange(arg: MatCheckboxChange){
    this.devicesList = DEVICES_DATA
    this.targetTablet = arg.checked
    let exist = this.targetedDevices.some(device=>device.criterionId===30002)
    let existExcluded = this.excludedDevices.some(device=>device.criterionId===30002)
    if(this.targetTablet){
      if(!exist){
        this.targetedDevices.push(this.devicesList[2])
      }
      if(existExcluded){
        this.excludedDevices.forEach((el,idx)=>{
          if(el.criterionId===30002){
            this.excludedDevices.splice(idx, 1)
          }
        })
      }
    }else{
      if(exist){
        this.targetedDevices.forEach((el,idx)=>{
          if(el.criterionId===30002){
            this.targetedDevices.splice(idx, 1)
            if(!existExcluded){
              this.excludedDevices.push(el)
            }
          }
        })
      }else{
        if(!existExcluded){
          this.excludedDevices.push(this.devicesList[2])
        }
      }
    }
    //console.log(this.excludedDevices)
  }
  tvChange(arg: MatCheckboxChange){
    this.devicesList = DEVICES_DATA
    this.targetTv = arg.checked
    let exist = this.targetedDevices.some(device=>device.criterionId===30004)
    let existExcluded = this.excludedDevices.some(device=>device.criterionId===30004)
    if(this.targetTv){
      if(!exist){
        this.targetedDevices.push(this.devicesList[3])
      }
      if(existExcluded){
        this.excludedDevices.forEach((el,idx)=>{
          if(el.criterionId===30004){
            this.excludedDevices.splice(idx, 1)
          }
        })
      }
    }else{
      if(exist){
        this.targetedDevices.forEach((el,idx)=>{
          if(el.criterionId===30004){
            this.targetedDevices.splice(idx, 1)
            if(!existExcluded){
              this.excludedDevices.push(el)
            }
          }
        })
      }else{
        if(!existExcluded){
              this.excludedDevices.push(this.devicesList[3])
            }
      }
    }
    //console.log(this.excludedDevices)
  }
  
  getCampaignData() {
    if (window.location.pathname === '/campaigns/settings/display') {
      
     this.displayService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
       //console.log(campaign)
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
            this.creationStep=false
            this.idA = campaign.ad_group_id_firebase
            this.ad_group_id = campaign.ad_group_id
            this.campaignId = campaign.id_campagne
            this.campaignType = campaign.type
            if(this.campaignId===0){
              this.currentDevicesTargeted = campaign.devicesTargeted?campaign.devicesTargeted:[]
            this.currentDevicesExcluded = campaign.devicesExcluded?campaign.devicesExcluded:[] 
            this.definedSelection()
            }else{
              try{
                this.displayService.getAdGroup(this.idA).valueChanges().subscribe(adgroup=>{
                  if(adgroup!==undefined && adgroup!==null){
                  this.currentDevicesTargeted = adgroup.devicesTargeted?adgroup.devicesTargeted:[]
                  this.currentDevicesExcluded = adgroup.devicesExcluded?adgroup.devicesExcluded:[]
                  this.definedSelection()
                  }
                })

              }catch(e){
                //console.log('error')
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
            this.currentDevicesTargeted = campaign.devicesTargeted?campaign.devicesTargeted:[]
            this.currentDevicesExcluded = campaign.devicesExcluded?campaign.devicesExcluded:[] 
            this.definedSelection()
          }else{
            try{
              this.youtubeService.getAdGroup(this.idA).valueChanges().subscribe(adgroup=>{
                if(adgroup!==undefined && adgroup!==null){
                  this.currentDevicesTargeted = adgroup.devicesTargeted?adgroup.devicesTargeted:[]
                  this.currentDevicesExcluded = adgroup.devicesExcluded?adgroup.devicesExcluded:[]
                  this.definedSelection()
                }
              })

            }catch(e){
              //console.log('error')
            }
          }
          }
        })
    }else if (window.location.pathname === '/campaigns/settings/search') {
      this.searchService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
        if (campaign === undefined) {
            this.router.navigate(['/campaigns'])
        } else {
          this.creationStep = false
          this.idA = campaign.ad_group_id_firebase
          this.ad_group_id = campaign.ad_group_id
          this.campaignId = campaign.id_campagne
          this.campaignType = campaign.type
          if(this.campaignId===0){
            this.currentDevicesTargeted = campaign.devicesTargeted?campaign.devicesTargeted:[]
            this.currentDevicesExcluded = campaign.devicesExcluded?campaign.devicesExcluded:[]
            this.definedSelection() 
          }else{
            try{
              this.youtubeService.getAdGroup(this.idA).valueChanges().subscribe(adgroup=>{
                if(adgroup!==undefined && adgroup!==null){
                  this.currentDevicesTargeted = adgroup.devicesTargeted?adgroup.devicesTargeted:[]
                  this.currentDevicesExcluded = adgroup.devicesExcluded?adgroup.devicesExcluded:[]
                  this.definedSelection()
                }
              })

            }catch(e){
              //console.log('error')
            }
          }
          }
        })
    }  else {
      this.creationStep = true
   }
    
  }
  ngOnInit(): void {

      this.route.queryParams.subscribe(params => {
        this.storageService.getUserIdAndAccountId().then(response => {
          if (response !== null) {
            this.user_access = response.role
            this.aacid = response.aacid
            //console.log(params['cid'])
            if (response.fromOwned) {
                this.uid_action = response.auid
               if(params['cid']!==undefined && params['cid']!==null){

                 this.cid = params['cid'];
                      this.uid = response.auid
                      
                      this.getCampaignData()
               }else{
                 this.creationStep = true
                 //console.log('is creation step')
                 //console.log(this.creationStep)
               }
              
              
            
                
            } else {
              
              this.uid_action = response.account.owner
       
              if(params['cid']!==undefined && params['cid']!==null){
                this.cid = params['cid'];
                   this.uid = response.auid;
                   this.getCampaignData()
                
                 
               }else{
                 this.creationStep = true
                 //console.log('is creation step')
                 //console.log(this.creationStep)
               }
           
                
              }
           
            
          
          }
          })
    
    })
    
  }

  getDevices():Promise<string>{
    return new Promise(resolve=>{
      if(this.targetedDevices.length>0){
        resolve('ok')
      }else{
        resolve('error')
      }
    })
  }
  spinnerSave: boolean = false
  saveDevices(){
    this.spinnerSave = true
    // //console.log(this.campaignId)
    // //console.log(this.cid)
    // //console.log(this.ad_group_id)
    // //console.log(this.idA)
    if(this.targetedDevices.length>0 || this.excludedDevices.length >0){
      this.displayService.targetNewDevicesCampaignLevel(this.targetedDevices, this.cid, this.campaignId, this.idA, this.ad_group_id, 'SET').then(devices=>{
        if(devices==='ok'){
          //console.log('targeting successfull')
          this.displayService.excludeNewDevicesCampaignLevel(this.excludedDevices, this.cid, this.campaignId, this.idA, this.ad_group_id, 'SET').then(devices_excluded=>{
            if(devices_excluded==='ok'){
              //console.log('exclusion successfull')
              this.spinnerSave = false
            }else{
              this.spinnerSave = false
            }
          }).catch((e)=>{
            this.spinnerSave = false
          })
        }else{
          this.displayService.excludeNewDevicesCampaignLevel(this.excludedDevices, this.cid, this.campaignId, this.idA, this.ad_group_id, 'SET').then(devices_excluded=>{
            if(devices_excluded==='ok'){
              //console.log('exclusion successfull')
              this.spinnerSave = false
            }else{
              this.spinnerSave = false
            }
          }).catch((e)=>{
            this.spinnerSave = false
          })
        }
      }).catch((e)=>{
        this.spinnerSave = false
      })
    }
  }

  definedSelection(){
    //this.targetedDevices = this.currentDevicesTargeted
    //this.excludedDevices = this.currentDevicesExcluded
    let desktopTargeted = this.currentDevicesTargeted.some(device=>device.criterionId===30000)
    let mobileTargeted = this.currentDevicesTargeted.some(device=>device.criterionId===30001)
    let tabletTargeted = this.currentDevicesTargeted.some(device=>device.criterionId===30002)
    let tvTargeted = this.currentDevicesTargeted.some(device=>device.criterionId===30004)
    if(desktopTargeted){
      this.targetDesktop = true
    }else{
      this.targetDesktop = false
    }
    if(mobileTargeted){
      this.targetMobile = true
    }else{
      this.targetMobile = false
    }
    if(tabletTargeted){
      this.targetTablet = true
    }else{
      this.targetTablet = false
    }

    if(tvTargeted){
      this.targetTv = true
    }else{
      this.targetTv = false
    }

  }
  

}
