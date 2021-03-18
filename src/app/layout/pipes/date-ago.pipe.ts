import {Pipe, PipeTransform} from '@angular/core';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Display, Ads, AdsReport, CAMPAIGN_PERFORMANCE_REPORT_MODEL_1, PlacementReport } from 'src/app/campaigns-management/models/display.models';
import { Observable } from 'rxjs';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { User } from 'src/app/utils/data';

@Pipe({
    name: 'dateAgo',
    pure: true
})
export class DateAgoPipe implements PipeTransform {

    transform(value: any, args?: any): any {
      if (value) {
          
          //const seconds = Math.floor((+new Date() - +new Date(value.seconds*1000 + (value.nanoseconds/1000000000))) / 1000);
           const seconds = Math.floor((+new Date() - +new Date(value*1000)) / 1000);
   
            if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
                return "A l'instant";
            const intervals = {
                'année': 31536000,
                'mois': 2592000,
                'semaines': 604800,
                'jour': 86400,
                'heure': 3600,
                'minute': 60,
                'seconde': 1
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0)
                  if (counter === 1) {
                      return "il y'a "+ counter + " " +i +""
                       /*  return counter + ' ' + i + ' ago';  */// singular (1 day ago)
                    } else {
                  /* return counter + ' ' + i + 's ago';  */// plural (2 days ago)
                     return "il y'a "+ counter + " " +i+ "s"
                    }
            }
        }
        return value;
    }

}




@Pipe({
    name: 'campaignNameFromAdGroupId',
    pure: true
})
export class CampaignNameFromAdGroupId implements PipeTransform {
     constructor(private displayService: DisplayService, private youtubeService: YoutubeService) {
        
    }
    

    public transform(ad_group_id: string, owner: string): Observable<string>{
  
        if (ad_group_id) {
            return Observable.create(observer => {
                this.displayService.getCampaignWithAdGroupId(parseInt(ad_group_id), owner).subscribe(campaign => {
                    if (campaign !== undefined && campaign !== null && campaign[0] !== undefined) {
                        observer.next(campaign[0].name)
                        observer.complete()
                        
                    } else {
                         this.youtubeService.getCampaignWithAdGroupId(parseInt(ad_group_id), owner).subscribe(campaign => {
                    if (campaign !== undefined && campaign !== null && campaign[0] !== undefined) {
                        observer.next(campaign[0].name)
                        observer.complete()
                        
                    }
            })
                    }
            })
                
            })
            
        }
        
        
    }

}

@Pipe({
    name: 'getUser',
    pure: true
  })
  
  export class GetUser implements PipeTransform {
    constructor(private auth: AuthService) {
        
    }
  
    public transform(uid: string): Observable<User> {
        if (uid) {
            return Observable.create(observer => {
              this.auth.getUser(uid).valueChanges().subscribe(data=>{
                if(data!==undefined){
                  observer.next(data)
                  observer.complete()  
  
                }else{
                  observer.next('User not found')
                  observer.complete()  
                }
              })
            })
        }
  
    }
  }
@Pipe({
    name: 'campaignStatusFromAdGroupId',
    pure: true
})
export class CampaignStatusFromAdGroupId implements PipeTransform {
     constructor(private displayService: DisplayService, private youtubeService: YoutubeService) {
        
    }
    

    public transform(ad_group_id: string, owner: string): Observable<string>{
  
        if (ad_group_id) {
            return Observable.create(observer => {
                this.displayService.getCampaignWithAdGroupId(parseInt(ad_group_id), owner).subscribe(campaign => {
                    if (campaign !== undefined && campaign !== null && campaign[0] !== undefined) {
                        if (campaign[0].budgetEnded) {
                            observer.next("ENDED")
                        } else {
                            observer.next(campaign[0].status)
                        }
                        observer.complete()
                        
                    } else {
                       this.youtubeService.getCampaignWithAdGroupId(parseInt(ad_group_id), owner).subscribe(campaign => {
                    if (campaign !== undefined && campaign !== null && campaign[0] !== undefined) {
                        if (campaign[0].budgetEnded) {
                            observer.next("ENDED")
                        } else {
                            observer.next(campaign[0].status)
                        }
                        observer.complete()
                        
                    } else {
                        
                    }
            }) 
                    }
            })
                
            })
            
        }
        
        
    }

}

@Pipe({
    name: 'getAdsSummuryReport',
    pure: true
})

export class GetAdsSummuryReport implements PipeTransform {
    currentCustomerId: number = 0
    currentReport: AdsReport[] = []
    constructor(private displayService: DisplayService) {
        
    }


    public transform(ad_group_id: number, client_customer_id: number, ad_id: number, field: string): Observable<string> {
        if (ad_group_id) {
            return Observable.create(observer => {
                this.displayService.getAdsSummuryFirestore(ad_group_id).subscribe(report => {
                    let reportData: AdsReport[] = report.filter((report, index, array) => {
                        if (report.ad_group_id === ad_group_id.toString()) {
                            return array
                        }
                    })
                    //console.log(reportData)
                    if (reportData.length > 0) {
                        if (field === 'combinedApprovalStatus') {
                            let data: AdsReport = reportData.find(ad => ad.ad_id === ad_id.toString())
                            if (data !== undefined) {
                                if (data.combinedApprovalStatus === null) {
                                    ////console.log('under_review')
                             observer.next('under_review')
                            observer.complete()
                                }
                                if (data.combinedApprovalStatus.toString() === 'approved') {
                                    observer.next('Approuvée')
                                    observer.complete()
                                    
                                }

                                if (data.combinedApprovalStatus.toString() === 'approved_limited' || data.combinedApprovalStatus.toString() === "approved (limited)") {
                                    observer.next('Approuvée (limitée)')
                                    observer.complete()
                                    
                                }
                                if (data.combinedApprovalStatus.toString() === 'eligible') {
                                    observer.next('Eligible')
                                    observer.complete()
                                    
                                }
                                if (data.combinedApprovalStatus.toString() === 'under_review' || data.combinedApprovalStatus.toString() === 'under review') {
                                    observer.next('under_review')
                                    observer.complete()
                                    
                                }
                                  if (data.combinedApprovalStatus.toString() === 'disapproved') {
                                    observer.next('disapproved')
                                    observer.complete()
                                    
                                }
                                  if (data.combinedApprovalStatus.toString() === 'site_supended') {
                                    observer.next('Site web suspendue')
                                    observer.complete()
                                    
                                }
                                
                            } else {
                                ////console.log('under_review')
                             observer.next('under_review')
                            observer.complete()
                            }
                        }

                        if (field === 'policySummary') {
                            let data: AdsReport = reportData.find(ad => ad.ad_id === ad_id.toString())
                            if (data !== undefined) {
                                         ////console.log(reportData)
                            observer.next(data.policySummary.replace(/^\[|\]$/g, "").split(", ")[0])
                            observer.complete()
                            } else {
                                observer.next('')
                            observer.complete()
                            }
                   
                                
                        }
                        
                        if (field === 'clicks') {
                            let data: AdsReport = reportData.find(ad => ad.ad_id === ad_id.toString())
                            if (data !== undefined) {
                                         ////console.log(reportData)
                            observer.next(data.clicks)
                            observer.complete()
                            } else {
                                observer.next('0')
                            observer.complete()
                            }
                   
                                
                        }
                        if (field === 'costs') {
                            let data: AdsReport = reportData.find(ad => ad.ad_id === ad_id.toString())
                            ////console.log(reportData)
                             if (data !== undefined) {
                                     let value = ((parseFloat(data.costs)*2)/1000000).toFixed(2)
                                    let cost = parseFloat(value)
                                    observer.next(cost)
                                observer.complete()
                            } else {
                                observer.next('0')
                            observer.complete()
                            }
                      
                                
                        }
                        if (field === 'impressions') {
                            let data: AdsReport = reportData.find(ad => ad.ad_id === ad_id.toString())
                            ////console.log(reportData)
                             if (data !== undefined) {
                                  observer.next(data.impressions)
                            observer.complete()
                            } else {
                                observer.next('0')
                            observer.complete()
                            }
                          
                                
                        }
                        if (field === 'conversions') {
                            let data: AdsReport = reportData.find(ad => ad.ad_id === ad_id.toString())
                            ////console.log(reportData)
                             if (data !== undefined) {
                                observer.next(data.conversions)
                            observer.complete() 
                            } else {
                                observer.next('0')
                            observer.complete()
                            }
                           
                                
                        }
                        if (field === 'ctr') {
                            let data: AdsReport = reportData.find(ad => ad.ad_id === ad_id.toString())
                            ////console.log(reportData)
                             if (data !== undefined) {
                                  observer.next(data.ctr)
                            observer.complete()
                            } else {
                                observer.next('0')
                            observer.complete()
                            }
                          
                                
                        } if (field === 'interactions') {
                            let data: AdsReport = reportData.find(ad => ad.ad_id === ad_id.toString())
                            ////console.log(reportData)
                             if (data !== undefined) {
                                      observer.next(data.interactions)
                            observer.complete()
                            } else {
                                observer.next('0')
                            observer.complete()
                            }
                      
                                
                        } else if (field === 'convRate') {
                            let data: AdsReport = reportData.find(ad => ad.ad_id === ad_id.toString())
                            ////console.log(reportData)
                             if (data !== undefined) {
                                  observer.next(data.convRate)
                            observer.complete() 
                            } else {
                                observer.next('0')
                            observer.complete()
                            }
                          
                        }
                        
               
             
             
         
         
            
                    } else {
                        if (field === 'combinedApprovalStatus') {
                            ////console.log('under_review')
                             observer.next('under_review')
                            observer.complete()
                        } else {
                             observer.next('0')
                            observer.complete()
                        }
            
                    }
        
        
                })
            })
        }

    }
}





@Pipe({
    name: 'getCampaignsSummuryReport',
    pure: true
})

export class GetCampaignsSummuryReport implements PipeTransform {
    currentCustomerId: number = 0
    currentReport: AdsReport[] = []
    constructor(private displayService: DisplayService) {
        
    }


    public transform(campaign_id: number, client_customer_id: number, field: string): Observable<string | number> {
        if (campaign_id) {
            return Observable.create(observer => {
                if (campaign_id === 0) {
                    observer.next('0')
                    observer.complete()
                } else {
                    this.displayService.getCampaignsSummuryFirestore(campaign_id).subscribe(campaign_report => {
                      
                        let reportData: CAMPAIGN_PERFORMANCE_REPORT_MODEL_1[] = campaign_report.filter((report, index, array) => {
                            if (report.campaign_id === campaign_id.toString()) {
                                return array
                            }
                        })
                        ////console.log(reportData)
                        if (reportData.length > 0) {
                            
                            if (field === 'clicks') {
                                if (reportData.length > 0) {
                                observer.next(parseFloat(reportData[0].clicks).toString())
                                observer.complete()
                                } else {
                                   observer.next('0')
                                observer.complete()  
                                }
                               
                                    
                            }
                            if (field === 'costs') {
                                if (reportData.length > 0) {
                                     let value = ((parseFloat(reportData[0].costs)*2)/1000000).toFixed(2)
                                    let cost = value
                                    observer.next(cost)
                                observer.complete()
                                } else {
                                    observer.next('0')
                                observer.complete()
                                }
                               
                                    
                            }
                            if (field === 'impressions') {
                                 if (reportData.length > 0) {
                                    observer.next(parseFloat(reportData[0].impressions).toString())
                                observer.complete()
                                } else {
                                    observer.next('0')
                                observer.complete()
                                }
                                
                                    
                            }
                            if (field === 'conversions') {
                                
                                 if (reportData.length > 0) {
                                    observer.next(reportData[0].impressions)
                                observer.complete()
                                } else {
                                    observer.next('0')
                                observer.complete()
                                }
                                observer.next(reportData[0].conversions)
                                observer.complete()
                                    
                            }
                            if (field === 'ctr') {
                                 if (reportData.length > 0) {
                                         observer.next(reportData[0].ctr)
                                observer.complete()
                                } else {
                                observer.next('0')
                                observer.complete()
                                }
                           
                                    
                            } if (field === 'interactions') {
                                 if (reportData.length > 0) {
                                observer.next(reportData[0].interactions)
                                observer.complete()
                                } else {
                                   observer.next('0')
                                observer.complete()  
                                }
                               
                                    
                            } else if (field === 'convRate') {
                                 if (reportData.length > 0) {
                                    observer.next(reportData[0].convRate)
                                observer.complete()
                                } else {
                                    observer.next('0')
                                observer.complete()
                                }
                                 
                            }
                            
                   
                 
                 
             
             
                
                        } else {
                                observer.next('0')
                                observer.complete()
                        }
            
            
                    })
                    
                }
            })
        }

    }
}



@Pipe({
    name: 'getPlacementsSummuryReport',
    pure: true
})

export class GetPlacementsSummuryReport implements PipeTransform {
    currentCustomerId: number = 0
    currentReport: AdsReport[] = []
    constructor(private displayService: DisplayService) {
        
    }


    public transform(campaign_id: number, client_customer_id: number, field: string): Observable<string> {
        if (campaign_id) {
            return Observable.create(observer => {
                if (campaign_id === 0) {
                    observer.next('--')
                    observer.complete()
                } else {
                    this.displayService.getPlacementSummuryFirestore(client_customer_id).subscribe(campaign_report => {
                        ////console.log(campaign_id)
                        ////console.log(campaign_report)
                        let reportData: PlacementReport[] = campaign_report.filter((report, index, array) => {
                            
                            if (report.campaignId === campaign_id.toString()) {
                                return array
                            }
                        })
                        ////console.log(reportData)
                        if (reportData.length > 0) {
                            
                            if (field === 'displayName') {
                                 if (reportData.length > 0) {
                                observer.next(reportData[0].displayName)
                                observer.complete()
                                } else {
                                   observer.next('0')
                                observer.complete()  
                                }
                            }

                            if (field === 'clicks') {
                                if (reportData.length > 0) {
                                observer.next(reportData[0].clicks)
                                observer.complete()
                                } else {
                                   observer.next('0')
                                observer.complete()  
                                }
                               
                                    
                            }
                            if (field === 'costs') {
                                 if (reportData.length > 0) {
                                    let value = ((parseFloat(reportData[0].costs)*2)/1000000).toFixed(2)
                                    let cost = parseFloat(value)
                                    observer.next(cost)
                                observer.complete()
                                } else {
                                    observer.next('0')
                                observer.complete()
                                }
                               
                                    
                            }
                            if (field === 'impressions') {
                                 if (reportData.length > 0) {
                                    observer.next(reportData[0].impressions)
                                observer.complete()
                                } else {
                                    observer.next('0')
                                observer.complete()
                                }
                                
                                    
                            }
                            if (field === 'conversions') {
                                
                                 if (reportData.length > 0) {
                                    observer.next(reportData[0].impressions)
                                observer.complete()
                                } else {
                                    observer.next('0')
                                observer.complete()
                                }
                                observer.next(reportData[0].conversions)
                                observer.complete()
                                    
                            }
                            if (field === 'ctr') {
                                 if (reportData.length > 0) {
                                         observer.next(reportData[0].ctr)
                                observer.complete()
                                } else {
                                observer.next('0')
                                observer.complete()
                                }
                           
                                    
                            } if (field === 'interactions') {
                                 if (reportData.length > 0) {
                                observer.next(reportData[0].interactions)
                                observer.complete()
                                } else {
                                   observer.next('0')
                                observer.complete()  
                                }
                               
                                    
                            } else if (field === 'convRate') {
                                 if (reportData.length > 0) {
                                    observer.next(reportData[0].convRate)
                                observer.complete()
                                } else {
                                    observer.next('0')
                                observer.complete()
                                }
                                 
                            }
                            
                   
                 
                 
             
             
                
                        } else {
                                observer.next('--')
                                observer.complete()
                        }
            
            
                    })
                    
                }
            })
        }

    }
}