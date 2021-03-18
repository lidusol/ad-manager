import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER } from 'src/environments/environment';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/auth.service';
import { Display, AdGroup, Ads, AdsReport, CAMPAIGN_PERFORMANCE_REPORT_MODEL_1, PlacementReport } from '../models/youtube.models';
import { map, delay, take } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import { AGES_TYPE, GENDERS_TYPE, DISPLAY_ADS, LOCATION, SCHEDULE_INTERFACE, Assets, CPRC, AdToDelete, YOUTUBE_CHANNELS_INTERFACE, YOUTUBE_SEARCH_INTERFACE, YOUTUBE_VIDEOS_INTERFACE, VIDEO_ASSET, NATIVE_ADS_TO_PUBLISH, Native_While_Publish, RESPONSIVE_DISPLAY_ADS, WEBSITE, URL_PARSER, adDispalyError, RESPONSIVE_DISPLAY_ADS_WITHOUT_OWNER } from 'src/app/utils/data';
import _ from 'lodash'

declare var require: any;

@Injectable()
export class YoutubeService {
  private uid: string = "";
  private campaignYoutube: Display;
  private adsModel: Ads;
  public campaignYoutubeCollection: AngularFirestoreCollection<Display>;
  public adGroupCollection: AngularFirestoreCollection<AdGroup>;
  public annonceCollection: AngularFirestoreCollection<Ads>;
  public strategie: string = ""
  public startegie_bid: string = ""
  public channel: string = ""
  public budget: number = 0
  public realBudget: number = 0
  public budgetToSend: number = 0
  public dailyBudget: number = 0
  public realDailyBudget: number = 0
  public microDollarValue = 1000000
  public campaign_id: number;
  public adgroup: AdGroup;
  public currentCampaignId: number = 0
  public currentCampaignIdFirebase: string = ""
  public currentAdGroupId: number = 0
  public currentAdGroupIdFirebase: string = ""
  public newLocation: any = []
  public currentAdGroupYoutubeChannels: YOUTUBE_CHANNELS_INTERFACE[] = []
  public currentAdGroupCriterionYoutubeChannels: any = []
  public currentAdGroupYoutubeVideos: YOUTUBE_VIDEOS_INTERFACE[] = []
  public currentAdGroupCriterionYoutubeVideos: any = []
  public currentAdGroupAge: any = []
  public currentAdGroupGenders: any = []
  public currentAdGroupDevices: any = []
  public currentAdGroupCriterionAge: any = []
  public currentLocationsTargeted: LOCATION[] = []
  public currentLocationsExcluded: LOCATION[] = []
  public currentAdsSchedules: SCHEDULE_INTERFACE[] = []
  public currentCriterionLocation: any = []
  public accountValue: number = 0
  public newAccountValue: number = 0
  public currentAdGroupTargetedPlacement: WEBSITE[] = []
  public currentAdGroupCriterionPlacement: any = []
  public assetsCollection: AngularFirestoreCollection<Assets>;
  public assetsYoutubeCollection: AngularFirestoreCollection<Assets>;
  public assetsDisplay: Assets[];
  constructor(private http: HttpClient, private auth: AuthService, public afs: AngularFirestore) {
    this.campaignYoutubeCollection = this.afs.collection('youtube-ads', (ref) => ref.where('owner', '==', this.uid));

  }
  getAllLocations(loc: string): Promise<any> {
    return new Promise(async (resolve) => {
      this.http.post(SERVER.url + "/getAllLocations", { q: loc })
        .subscribe(
          res => {
            //////console.log(res)
            if (res.toString().length > 0) {
                  
              resolve(res['result'])
            } else {
              resolve(null)
            }
                
          },
          err => {
            resolve(null)
          }
        );
      
    })
      
  }
  searchYoutubeChannel(q: string): Promise<YOUTUBE_SEARCH_INTERFACE[]> {
    return new Promise(async (resolve) => {
      this.http.post<YOUTUBE_SEARCH_INTERFACE[]>(SERVER.url + "/searchYoutubeChannels", { q: q }).pipe(take(1))
        .subscribe(
          (res: YOUTUBE_SEARCH_INTERFACE[]) => {
            ////console.log(res)
            if (res.length > 0) {
                  
              resolve(res)
            } else {
              resolve(null)
            }
                
          },
          err => {
            resolve(null)
          }
        );
      
    })
      
  }

  searchChannelByID(q: string): Promise<YOUTUBE_CHANNELS_INTERFACE[]> {
    return new Promise(async (resolve) => {
      this.http.post<YOUTUBE_CHANNELS_INTERFACE[]>(SERVER.url + "/searchChannelByID", { channelId: q }).pipe(take(1))
        .subscribe(
          (res: YOUTUBE_CHANNELS_INTERFACE[]) => {
            ////console.log(res)
            if (res.length > 0) {
                  
              resolve(res)
            } else {
              resolve(null)
            }
                
          },
          err => {
            resolve(null)
          }
        );
      
    })
      
  }
  
  searchVideoByID(q: string): Promise<YOUTUBE_VIDEOS_INTERFACE[]> {
    return new Promise(async (resolve) => {
      this.http.post<YOUTUBE_VIDEOS_INTERFACE[]>(SERVER.url + "/searchVideoByID", { videoId: q }).pipe(take(1))
        .subscribe(
          (res: YOUTUBE_VIDEOS_INTERFACE[]) => {
            ////console.log(res)
            if (res.length > 0) {
                  
              resolve(res)
            } else {
              resolve(null)
            }
                
          },
          err => {
            resolve(null)
          }
        );
      
    })
      
  }

  detectSafeBrowsing(url: string):Promise<string>{
    return new Promise(resolve=>{
      this.http.post(SERVER.url+'/detectSafeBrowsing', {
        url: url
      }).subscribe((response: any)=>{
        //console.log(response)
        if(response.toString().length>0){
          resolve('error')
        }else{
          resolve('ok')

        }
        
      },error=>{
        //console.log(error)
        resolve('error')
      })
      
    })
  }

  
  public getVideosAssets(accountId: string) {
    //////////console.log(uid)
    return this.afs.collection<VIDEO_ASSET>('videos-assets', (ref) => ref.where('accountId', '==', accountId)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }
  
  addVideoAsset(video: VIDEO_ASSET): Promise<VIDEO_ASSET> {
    return new Promise(resolve => {
      let batch = this.afs.firestore.batch()
      batch.set(this.afs.collection('videos-assets').doc(video.videoId).ref, video)
      return this.afs.collection('videos-assets').add(video).then(added => {
        resolve({ id: added.id, ...video })
      }).catch(e => {
        resolve(null)
      })
      
    }
    )
  }
  addVideosAssets(videos: VIDEO_ASSET[]): Promise<VIDEO_ASSET[]> {
    return new Promise(resolve => {
      let VIDEO_ADDED: VIDEO_ASSET[] = []
      let batch = this.afs.firestore.batch()
     
      videos.forEach(async (video, index, arr) => {
        batch.set(this.afs.collection('videos-assets').doc(video.videoId).ref, video)
        VIDEO_ADDED.push({ id: video.videoId, ...video })
        if (VIDEO_ADDED.length === videos.length) {
          await batch.commit().then(() => {
            
            resolve(VIDEO_ADDED)
          }).catch((e) => {
            resolve(VIDEO_ADDED)
          })
        }
        /* return await this.addVideoAsset(video).then(video_added => {
          VIDEO_ADDED.push(video_added)
          if (VIDEO_ADDED.length === videos.length) {
            resolve(VIDEO_ADDED)
          }
         }) */
      })
    })
  }
  searchVideoAsset(q: string, url: string, aacid: string): Promise<VIDEO_ASSET[]> {
    return new Promise(async (resolve) => {
      this.http.post<VIDEO_ASSET[]>(SERVER.url + "/searchVideoAsset", { videoId: q, url: url, accountId: aacid }).pipe(take(1))
        .subscribe(
          (res: VIDEO_ASSET[]) => {
            ////console.log(res)
            if (res.length > 0) {
                  
              resolve(res)
            } else {
              resolve(null)
            }
                
          },
          err => {
            resolve(null)
          }
        );
      
    })
      
  }
  public getCampaignName(uid: string, name: string) {
    //////////console.log(uid)
    
    return this.afs.collection<Display>('youtube-ads', (ref) => ref.where('owner', '==', uid).where('name', '==', name)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }

  

  createCampaign(display: Display): Promise<string> {
    return new Promise(resolve => {
      this.campaignYoutube = this.prepareSaveCampaign(display);
      const docRef = this.campaignYoutubeCollection.add(this.campaignYoutube);
      docRef
        .then((add) => {
          resolve(add.id)
          
        })
        .catch((e) => {
          //////console.log(e)
          resolve('error')
        })
        
      
    })
  }

  prepareSaveCampaign(display: Display): Display {

    const newCampaign = display
    return { ...newCampaign };
  }

  saveDuplicateCampaign(display: Display):Promise<Display>{
    return new Promise(resolve => {
      this.afs.collection('youtube-ads').add(display).then(added => {
        resolve({id: added.id, ...display})
      }).catch((e)=>{
        resolve(null)
      })
      
    })
  }
  prepareSaveAdGroup(uid: string, accountId: string, campaign_id: number, name: string, status: string, ad_group_id: number): AdGroup {
    const userDoc = this.afs.doc(`users/${uid}`);
    const newAdGroup: AdGroup = {
      campaign_id: campaign_id,
      ad_group_id: ad_group_id,
      name: name,
      status: status,
      ages: [],
      genders: [],
      devicesTargeted: [],
      devicesExcluded: [],
      youtubeChannels: [],
      youtubeVideos: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: userDoc.ref,
      owner: uid,
      accountId: accountId,
    };
    return { ...newAdGroup };
  }
  
  public getListAdsWithAdGroupId(ad_group_id: number) {
    //////console.log(uid)
    //////console.log(accountId)
    return this.afs.collection<RESPONSIVE_DISPLAY_ADS>('responsive-display-ads', (ref) => ref.where('ad_group_id', '==', ad_group_id)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
   }
  public getListCampaign(uid: string, accountId: string) {
    //////////console.log(uid)
    return this.afs.collection<Display>('youtube-ads', (ref) => ref.where('owner', '==', `${uid}`).where('accountId', '==', `${accountId}`).where('isArchived', '==', false).where('isExpress', '==', true)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }
  
  public getCampaignWithAdGroupId(ad_group_id: number, uid: string) {
    //////console.log(uid)
    //////console.log(ad_group_id)
    let campaign: Display[] = []
    return this.afs.collection<Display>('youtube-ads', (ref) => ref.where('owner', '==', uid).where('ad_group_id', '==', ad_group_id).where('isArchived', '==', false).where('isExpress', '==', true)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          //////console.log(data)
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }
  
  public getListAds(uid: string, accountId: string) {
    //////console.log(uid)
    //////console.log(accountId)
    return this.afs.collection<RESPONSIVE_DISPLAY_ADS>('responsive-display-ads', (ref) => ref.where('owner', '==', `${uid}`).where('accountId', '==', `${accountId}`)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }
  
  getCampaign(id: string) {
    return this.afs.doc<Display>(`youtube-ads/${id}`);
  }

  updateCampaign(id: string, data: any): Promise<string> {
    return new Promise(resolve => {

      this.getCampaign(id).update(data).then((value) => {
        resolve("ok")
      }).catch((e) => {
        resolve("error")
      })
    })
  }
  
  createAdGroup(uid: string, accountId: string, id_campagne: number, name: string, status: string, ad_group_id: number): Promise<any> {
    return new Promise(resolve => {
      this.adgroup = this.prepareSaveAdGroup(uid, accountId, id_campagne, name, status, ad_group_id);
      const docRef = this.afs.collection('adgroup-youtube').add(this.adgroup).then(res => {
         
        resolve("ok")
      }).catch((e) => {
        resolve("error")
      })
    })
  }
  
  PromiseGetAdGroup(campaign_id: number, ad_group_id: number): Promise<any> {
    return new Promise(resolve => {
      this.getSingleAdGroupID(campaign_id, ad_group_id).subscribe(single => {
        //////////////console.log("getting adgroup")
        //////////////console.log(single)
        resolve(single[0])
      })
    })
  }

  
  getSingleAdGroupID(campaign_id: number, ad_group_id: number) {
    // //////////////console.log(`campaign_id: ${campaign_id} ad_group_id: ${ad_group_id}`)
    return this.afs.collection<AdGroup>('adgroup-youtube', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  
  }
  
  promiseGetListAdGroupId(campaign_id) {
    return this.afs.collection<AdGroup>('adgroup-youtube', (ref) => ref.where('campaign_id', '==', parseInt(`${campaign_id}`))).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getAdsSummuryFirestore(client_customer_id: number) {
    return this.afs.collection<AdsReport>('default-reports-account', (ref) => ref.where('client_customer_id', '==', client_customer_id)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getCampaignsSummuryFirestore(client_customer_id: number) {
    return this.afs.collection<CAMPAIGN_PERFORMANCE_REPORT_MODEL_1>('default-campaign-reports-performance', (ref) => ref.where('client_customer_id', '==', client_customer_id)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getPlacementSummuryFirestore(client_customer_id: number) {
    return this.afs.collection<PlacementReport>('default-placement-reports-performance-youtube', (ref) => ref.where('client_customer_id', '==', client_customer_id)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  currentAdSummuryReport: AdsReport[] = []
  /*   getAdsSummuryReport(client_customer_id: number,): Promise<AdsReport[]> {
      return new Promise(resolve => {
       this.afs.collection('default-reports-account').snapshotChanges()
        if (this.currentAdSummuryReport.length > 0) {
         resolve(this.currentAdSummuryReport)
        } else {
          
          this.http.post<AdsReport[]>(SERVER.url+"/getAdSummuryReport", {client_customer_id: client_customer_id})
                .subscribe(
                  res => {
               
                    
                    if (res.toString().length > 0) {
                        this.currentAdSummuryReport = res
                        resolve(res)
                  
                      
                    }
                    
                  },
                  err => {
                   //////console.log('une erreur est survenue')
                  }
                );
       }

    })
  } */

  getUrlsSummuryReport(): Promise<any> {
    return new Promise(resolve => {
      this.http.post<any>(SERVER.url + "/getCampaignAllSummuryReport", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID })
        .subscribe(
          res => {
               
                    
            if (res.toString().length > 0) {
              resolve(res)
              //////console.log(res)
                  
                      
            }
                    
          },
          err => {
                   
          }
        );

    })
  }

  getCampaignSummuryReportWithSelectorDate(uid: string, accountId: string, query: string, startDate: string, endDate: string): Promise<CPRC[]> {
    return new Promise(resolve => {
      this.http.post<CPRC[]>(SERVER.url + "/getCampaignAllSummuryReport", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID, query: query, startDate: startDate, endDate: endDate, message: 'Chargement en cours' })
        .subscribe(
          res => {
            if (res.length > 0) {
              //////console.log(res)
              let rep: CPRC[] = []
              let data: CPRC[] = []
              this.getListCampaign(uid, accountId).subscribe(campaigns => {
                //////console.log(campaigns)
                if (campaigns.length > 0) {
                  campaigns.forEach((campaign: Display, index, arr) => {
                    //////console.log(campaign)
                    //////console.log(index)
                    //////console.log(arr)
                    if (index === campaigns.length - 1) {
                      data = [...data, ...res.filter((report: CPRC, index_1, arr) => {
                        return parseInt(report.id) === campaign.id_campagne && report.impressions !== '0'
                                   
                                
                      })]
                             
                      resolve(data)
                    } else {
                      data = [...data, ...res.filter((report: CPRC, index_1, arr) => {
                        return parseInt(report.id) === campaign.id_campagne && report.impressions !== '0'
                                   
                                
                      })]
                    }
                  })
                          
                } else {
                  resolve(data)
                }
              })
                     

                  
                      
            }
                    
          },
          err => {
            resolve([])
            //////console.log('une erreur est survenue')
          }
        );

    })
  }

  getChannelsSummuryReport(listCampaignId: any): Promise<PlacementReport[]> {
    return new Promise(resolve => {
      this.http.post<PlacementReport[]>(SERVER.url + "/getPlacementSummuryReport", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID, list: listCampaignId, })
        .subscribe(
          res => {
                    
                     
            resolve(res)
                    
                    
          },
          err => {
            resolve([])
            //////console.log('une erreur est survenue')
          }
        );

    })
  }
  addAdGroup(campaign_id: number, accountId: string, uid: string, name: string, strategie: string, strategie_bid: any, bid: any, targetAllPlacement: boolean): Promise<any> {
    return new Promise(resolve => {
      this.http.post(SERVER.url + '/addAdGroup', {
        'ad_group_name': name,
        'campaign_id': campaign_id,
        'strategie_bid': strategie_bid,
        'strategie': strategie,
        'bid': (bid.toFixed(2) * 1000000).toFixed(0),
        'targetAllPlacement': targetAllPlacement,
        message: "Paramétrage du groupe d'annonces en cours"
      })
        .subscribe(
          res => {
            //////////console.log('res adgroup')
            //////////console.log(res)
            if (res['status'] == "ok") {
              var id = res['id']
              this.createAdGroup(uid, accountId, campaign_id, res['name'], res['status_adgroup'], res['id']).then(res => {
                if (res == "ok") {
                  //////////////console.log(res)
                  this.PromiseGetAdGroup(campaign_id, id).then(adgroup => {
                    //////////////console.log(adgroup)
                    if (adgroup !== null) {
                      var response = []
                      response.push({
                        "id": adgroup['id'],
                        "ad_group_id": id
                      })
                      //////////console.log(response)
                      resolve(response)

                    
                    }
                  })
                }
              })
            }
          },
          err => {
            resolve('error')
          })
    })
  }

  removeCampaign(id: string, id_campaign: number, ad_group_id_firebase: string): Promise<any> {
    return new Promise(resolve => {
      this.http.post<{status: string, handler: string}[]>(SERVER.url + "/deleteCampaign", {
        "id": id_campaign,
        message: 'Suppression de la campagne'
      })
        .subscribe(
          res => {
              this.deleteCampaign(id).then(res_delete => {
                if (res_delete === "ok") {
                  if (ad_group_id_firebase !== '') {
                    this.deleteAdGroup(ad_group_id_firebase).then(res_delete_ad_group => {
                      if (res_delete_ad_group === "ok") {
                         
                        resolve("ok")
                      } else {
                        resolve('ok')
                      }
                    }).catch((e) => {
                      resolve('ok')
                    })
                      
                  } else {
                    resolve('ok')
                  }
                }
              }).catch((e) => {
                resolve('error')
              })

          
             
              
          
          },
          err => {
            resolve('error')
          }
        );
       


      
    })
  }
  

  deleteCampaign(id: string): Promise<string> {
    return new Promise((resolve) => {
      this.getCampaign(id).delete().then(() => {
        resolve('ok')
        
      }).catch(e => {
        resolve('error')
      })
    }
   
    )

    
  }
  
  enableCampaign(id: string, id_campagne: number): Promise<string> {

    return new Promise(resolve => {
      this.http.post(SERVER.url + '/updateCampaignStatus', {
        'campaign_id': id_campagne,
        'status': 'ENABLED',
        message: 'Activation de la campagne en cours'
      })

        .subscribe(
          res => {
            if (res[0].status != "error") {
              this.updateCampaign(id, {
                status: 'ENABLED'
              }).then(res_update => {
                if (res_update === "ok") {
                  resolve('ok')
                }
              })
            } else {
              resolve('error')
            }

             
          },
          err => {
            resolve('error')
             
          }
        );
    })
  }
  disableCampaign(id: string, id_campagne: number) {

    return new Promise(resolve => {
      this.http.post(SERVER.url + '/updateCampaignStatus', {
        'campaign_id': id_campagne,
        'status': 'PAUSED',
        message: 'Désactivation de la campagne'
      })

        .subscribe(
          res => {
            if (res[0].status != "error") {
              this.updateCampaign(id, {
                status: 'PAUSED'
              }).then(res_update => {
                if (res_update === "ok") {
                  resolve('ok')
                }
              })
            }

             
          },
          err => {
            resolve('error')
             
          }
        );
    })
  }

  getAdGroup(id: string) {
    return this.afs.doc<AdGroup>(`adgroup-youtube/${id}`);
  }
  
  updateAdgroup(id: string, data: any): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroup(id).update(data).then(res => {
        
        resolve("ok")
      })
    })
  
  }
  
  deleteAdGroup(id: string): Promise<any> {
    return new Promise(resolve => {
      this.getAdGroup(id).delete();
      resolve("ok")
    })
  }
  
  setStrategie(strategie: string): Promise<string> {
    return new Promise(resolve => {
      if (strategie === "CPM") {
        this.strategie = "MANUAL_CPM"
        this.startegie_bid = "CpmBid"
        resolve('ok')
      } else if (strategie === "CPC") {
        this.strategie = "MANUAL_CPC"
        this.startegie_bid = "CpcBid"
        resolve('ok')
      }
    })
  }


  
  setBudgetValue(budget: number, dailyBudget, numberOfDays): Promise<string> {
    return new Promise(resolve => {
      var gain = (budget * 20) / 100
      var new_budget = budget - gain
      var new_daily_budget = dailyBudget
      this.budgetToSend = new_daily_budget * this.microDollarValue
      /*  this.budget = budget */
      /* this.realBudget = new_budget
      this.dailyBudget = this.budget / numberOfDays
      this.realDailyBudget = new_daily_budget */
      resolve('ok')
      /* this.updateCampaign(id, {budget: this.budget, dailyBudget: this.dailyBudget, realBudget: this.realBudget, realDailyBudget: this.realDailyBudget}) */
      
    })
  }
  setChannelType(type: string): Promise<string> {
    return new Promise(resolve => {
      if (type === "YOUTUBE") {
        this.channel = "DISPLAY"
        resolve('ok')
         
      }
      
    })
  }
  
  updateCampaignName(id: string, name: string, email: string, campaign_id: number, type: string): Promise<string> {
    return new Promise(resolve => {

      this.http.post(SERVER.url + '/updateCampaignName', {
        'email': email,
        'name': name,
        'campaign_id': campaign_id,
        'type': type,
        message: 'Modification du nom de la campagne'
      })
        .subscribe(
          res => {
            if (res[0]['status'] === "ok") {
              this.updateCampaign(id, { name: name }).then(res_update_campaign => {
                if (res_update_campaign === "ok") {
                  resolve('ok')
                }
              })
            }
          },
          err => {
            resolve('error')
            
          })
    })
  }
 

  updateCampaignEndDate(id: string, campaign_id: number, numberOfDays: number, endDateEnglish: string, endDateFrench: string, endDateFormattedGoogle: string, endDate: any): Promise<string> {
    return new Promise(resolve => {

      this.http.post(SERVER.url + '/updateCampaignEndDate', {
        'campaign_id': campaign_id,
        'endDate': endDateFormattedGoogle,
        message: 'Modification de la date dfin en cours'
      })
        .subscribe(
          res => {
            //////////console.log(res)
            if (res[0]['status'] === "ok") {
              this.updateCampaign(id, { numberOfDays: numberOfDays, endDateFrench: endDateFrench, endDateFormattedGoogle: endDateFormattedGoogle, endDateEnglish: endDateEnglish, endDate: endDate }).then(res_update_campaign => {
                if (res_update_campaign === "ok") {
                  resolve('ok')
                }
              })
            }
          },
          err => {
            resolve('error')
            
          })
    })
  }
  
  updateCampaignStartDate(id: string, campaign_id: number, numberOfDays: number, startDateEnglish: string, startDateFrench: string, startDateFormattedGoogle: string, startDate: any): Promise<string> {
    return new Promise(resolve => {

      this.http.post(SERVER.url + '/updateCampaignStartDate', {
        'campaign_id': campaign_id,
        'startDate': startDateFormattedGoogle,
        message: 'Modification de la date de début'
      })
        .subscribe(
          res => {
            //////////console.log(res)
            if (res[0]['status'] === "ok") {
              this.updateCampaign(id, { numberOfDays: numberOfDays, startDateFrench: startDateFrench, startDateFormattedGoogle: startDateFormattedGoogle, startDateEnglish: startDateEnglish, startDate: startDate }).then(res_update_campaign => {
                if (res_update_campaign === "ok") {
                  resolve('ok')
                }
              })
            }
          },
          err => {
            resolve('error')
            
          })
    })
  }
 
  publishCampaignToYoutube(uid: string, accountId: string, id: string, email: string, name: string, status: string, startDateFormattedGoogle: string, endDateFormattedGoogle: string, budget: number, dailyBudget: number, numberOfDays: number, strategie: any, bid: any, type: string, packType: string, targetContentNetwork: boolean, targetGoogleSearch: boolean, targetSearchNetwork: boolean, targetPartnerSearchNetwork: boolean, locationOptionTargeted: string, locationOptionExcluded: string, impressions: number, targetAllPlacement: boolean): Promise<string> {
    this.uid = uid
    return new Promise(resolve => {
      var max_impressions: number = 0
      if (impressions === 0) {
        if (packType === '0') {
        max_impressions===20000
      }else if (packType === '1') {
        max_impressions===100000
      } else if (packType === '2') {
        max_impressions===250000
      } else if (packType==='3') {
        max_impressions=500000
      }
      } else {
        if (strategie === 'CPM') {
          max_impressions = impressions
          
        } else if(strategie === 'CPC') {
          max_impressions = 0
        }
      }
      var DAILY_BUDGET: number = 0
      

      if (dailyBudget === 4) {
        DAILY_BUDGET = 8*this.microDollarValue
      } else if (dailyBudget === 17) {
          DAILY_BUDGET = 8*this.microDollarValue
      }else if(dailyBudget===30){
         DAILY_BUDGET = 15*this.microDollarValue
      } else if (dailyBudget === 50) {
         DAILY_BUDGET = 23*this.microDollarValue
      } else if(dailyBudget<5){
        DAILY_BUDGET = 8 * this.microDollarValue
      } else{
        DAILY_BUDGET = parseInt(((dailyBudget * 80) / 100).toFixed(0)) * this.microDollarValue
      }


      this.setStrategie(strategie).then(strategie_response => {
        if (strategie_response === "ok") {
        
          this.setChannelType(type).then(channel_response => {
            if (channel_response === "ok") {
              this.setBudgetValue(budget, dailyBudget, numberOfDays).then(budget_response => {
                if (budget_response === "ok") {
                  this.http.post(SERVER.url + '/addCampaign', {
                    'email': email,
                    'campaign_name': name,
                    'status': status,
                    'startDate': startDateFormattedGoogle,
                    'endDate': endDateFormattedGoogle,
                    'budget': DAILY_BUDGET,
                    'bid': bid,
                    'strategie': this.strategie,
                    'channel': this.channel,
                    'type': type,
                    'max_impressions': max_impressions,
                    'targetContentNetwork': targetContentNetwork,
                    'targetGoogleSearch': targetGoogleSearch,
                    'targetSearchNetwork': targetSearchNetwork,
                    'targetPartnerSearchNetwork': targetPartnerSearchNetwork,
                    'optionLocationTargeted': locationOptionTargeted,
                    'optionLocationExcluded': locationOptionExcluded,
                    
                    message: 'Création de la campagne en cours'
                  })
                    .subscribe(
                      res => {
                        if (res['status'] == "ok") {
                          this.currentCampaignId = res['id']
                          this.currentCampaignIdFirebase = id
                          this.updateCampaign(id, { id_campagne: res['id'], status: res['status_campaign'], servingStatus: res['servingStatus'], budgetId: res['budgetId'] }).then(update_campaign => {
                            if (update_campaign === "ok") {
                              //////////console.log(update_campaign + " update campaign")
                              this.addAdGroup(res['id'], accountId, uid, name, this.strategie, this.startegie_bid, bid, targetAllPlacement).then(adgroup => {
                                if (adgroup !== "error") {
                                  //////////console.log('adgroup')
                                  //////////console.log(adgroup)
                                  this.currentAdGroupId = adgroup[0]['ad_group_id']
                                  this.currentAdGroupIdFirebase = adgroup[0]['id']
                                  this.updateCampaign(id, { ad_group_id: adgroup[0]['ad_group_id'], ad_group_id_firebase: adgroup[0]['id'] }).then(update_again => {
                                    if (update_again === "ok") {
                                      resolve('ok')
                                    }
                                  })
                                }
                              })
                            }
                          })
                        } else {
                          resolve('error')
                          //////////console.log(res)
                        }
                      
                      },
                      err => {
                      
                      })
                }
              })
            }
          })
        }
      })
    })
  }
  getAdGroupAge(campaign_id: number, ad_group_id: number): Promise<AGES_TYPE[]> {
    return new Promise(resolve => {
      this.afs.collection<AdGroup>('adgroup-youtube', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).valueChanges().subscribe(el => {
        resolve(el[0].ages)
      })
    
    });
  }
  
  
  getNewCriterionAge(criterion: number): Promise<string> {
    //////////console.log(criterion)
    return new Promise(resolve => {
      this.currentAdGroupCriterionAge.push({
        "criterion_type": "AGE_RANGE",
        "criterion_id": criterion,
        "id": ""
      })
        
      
      resolve('ok')
    })
   
  }
  getNewAge(age): Promise<string> {
    //////////console.log(age)

    return new Promise(resolve => {
      this.currentAdGroupAge.splice(this.currentAdGroupAge.indexOf(age), 1)
   
      resolve('ok')
    })
   
  }
  getNewAgeAfterEnable(ages): Promise<string> {
    //////////console.log(ages)

    return new Promise(resolve => {
      for (var i = 0; i < ages.length; i++) {
        this.currentAdGroupAge.push(ages[i])
        
      }
   
      resolve('ok')
    })
   
  }
  
  removeAge(criterion: any, campaign_id: number, ad_group_id: number, ad_group_id_firebase: string): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupYoutubeChannelsValue(campaign_id, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/excludeAge', {
            'ad_group_id': ad_group_id,
            'criterion': criterion,
            message: 'Exclusion en cours'
        
          })
            .subscribe(
              res => {
                //////////console.log(res)
                if (res[0]['status'] === "ok") {
                  this.getNewAge(criterion).then(res_new_age => {
                    if (res_new_age === "ok") {
       
                      this.updateAdgroup(ad_group_id_firebase, { ages: this.currentAdGroupAge, criterion_ages: this.currentAdGroupCriterionAge }).then(res => {
                        if (res == "ok") {
                          resolve('ok')
                    
                        }
                      })
                
                    }
                  })
                }
          
              },
              err => {
                resolve('error')
              }
            );
        }
      })
   
    })
  }

  enableAge(criterion: any, campaign_id: number, ad_group_id: number, ad_group_id_firebase: string): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupYoutubeChannelsValue(campaign_id, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/enableAge', {
            'ad_group_id': ad_group_id,
            'criterion': criterion,
            message: 'Ciblage en cours'
        
          })
            .subscribe(
              res => {
                //////////console.log(res)
                if (res[0]['status'] === "ok") {
                  this.getNewAgeAfterEnable(criterion).then(res_new_age => {
                    if (res_new_age === "ok") {
       
                      this.updateAdgroup(ad_group_id_firebase, { ages: this.currentAdGroupAge, criterion_ages: this.currentAdGroupCriterionAge }).then(res => {
                        if (res == "ok") {
                          resolve('ok')
                    
                        }
                      })
                
                    }
                  })
                }
          
              },
              err => {
                resolve('error')
              }
            );
        }
      })
   
    })
  }
  


  targetAge(age: AGES_TYPE[]): Promise<string> {
    return new Promise(resolve => {
      if (age.length === 7) {
        this.updateCampaign(this.currentCampaignIdFirebase, { ages: age }).then(res => {
          if (res == "ok") {
            this.updateAdgroup(this.currentAdGroupIdFirebase, { ages: age }).then(res => {
              if (res == "ok") {
                resolve('ok')
              } else {
                resolve('error')
              }
            })
          } else {
            resolve('error')
          }
        })
      } else {
        this.getAdGroupAge(this.currentCampaignId, this.currentAdGroupId).then(value => {
          this.http.post(SERVER.url + '/targetAge', {
            'ad_group_id': this.currentAdGroupId,
            'ages': age,
            'last_ages': value,
            message: 'Ciblage en cours'
          })
            .subscribe(
              (res: AGES_TYPE[]) => {
                if (res.toString().length > 0) {
                  this.updateAdgroup(this.currentAdGroupIdFirebase, { ages: age }).then(res => {
                    if (res == "ok") {
                      resolve('ok')
                    } else {
                      resolve('error')
                    }
                  })
                }
          
              },
              err => {
                resolve('error')
              }
            );

        })
      }
    })
   
  }

  targetNewAge(age: AGES_TYPE[], idc: string, campaignId: number, idA: string, ad_group_id: number): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupAge(campaignId, ad_group_id).then(value => {
        if (age.length < 7) {
        
          if (value.length < 7) {
            this.http.post(SERVER.url + '/targetAge', {
              'ad_group_id': ad_group_id,
              'ages': age,
              'last_ages': value,
              message: 'Ciblage en cours'
            })
              .subscribe(
                (res: AGES_TYPE[]) => {
                  if (res.toString().length > 0) {
                    this.updateCampaign(idc, { ages: age }).then(res_camp => {
                      if (res_camp === "ok") {
                        this.updateAdgroup(idA, { ages: age }).then(res_group => {
                          if (res_group === "ok") {
                            resolve('ok')
                          } else {
                            resolve('error')
                          }
                        })
                      } else {
                        resolve('error')
                      }
                    })
                    
                  }
            
                },
                err => {
                  resolve('error')
                }
              );
            
          } else if (value.length === 7) {
            this.http.post(SERVER.url + '/targetAgeOnly', {
              'ad_group_id': ad_group_id,
              'ages': age,
              message: 'Ciblage en cours'
            })
              .subscribe(
                (res) => {
                  if (res.toString().length > 0) {
                    this.updateCampaign(idc, { ages: age }).then(res_camp => {
                      if (res_camp === "ok") {
                        this.updateAdgroup(idA, { ages: age }).then(res_group => {
                          if (res_group === "ok") {
                            resolve('ok')
                          } else {
                            resolve('error')
                          }
                        })
                      } else {
                        resolve('error')
                      }
                    })
                    
                  }
            
                },
                err => {
                  resolve('error')
                }
              );
          }
            
        } else if (age.length === 7) {
          if (value.length < 7) {
            this.http.post(SERVER.url + '/removeNegativeAgesCriterion', {
              'ad_group_id': ad_group_id,
              'last_ages': value,
              message: 'Ciblage en cours'
            })
              .subscribe(
                (res) => {
                  if (res[0]['status'] === "ok") {
                    this.updateCampaign(idc, { ages: age }).then(res_camp => {
                      if (res_camp === "ok") {
                        this.updateAdgroup(idA, { ages: age }).then(res_group => {
                          if (res_group === "ok") {
                            resolve('ok')
                          } else {
                            resolve('error')
                          }
                        })
                      } else {
                        resolve('error')
                      }
                    })
                    
                  }
            
                },
                err => {
                  resolve('error')
                }
              );
          } else if (value.length === 7) {
            resolve('ok')
          }
        }
        
          

      })
      
    })
   
  }


  getAdGroupGenre(campaign_id: number, ad_group_id: number): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection<AdGroup>('adgroup-youtube', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).valueChanges().subscribe(el => {
        resolve(el[0].genders)
      })
    });
  }
  
  targetGenre(genre: GENDERS_TYPE[]): Promise<any> {
    return new Promise(resolve => {
      if (genre.length === 3) {
        this.updateCampaign(this.currentCampaignIdFirebase, { genders: genre }).then(res => {
          if (res == "ok") {
            this.updateAdgroup(this.currentAdGroupIdFirebase, { genders: genre }).then(res => {
              if (res == "ok") {
                resolve('ok')
              } else {
                resolve('error')
              }
            })
          } else {
            resolve('error')
          }
        })
      } else {
        this.getAdGroupGenre(this.currentCampaignId, this.currentAdGroupId).then(value => {
          this.http.post(SERVER.url + '/targetGender', {
            'ad_group_id': this.currentAdGroupId,
            'genders': genre,
            'last_genders': value,
            message: 'Ciblage en cours'
          })
            .subscribe(
              res => {
                // //////////////console.log(`res from location backend: ${res}`)
                if (res.toString().length > 0) {
                  this.updateAdgroup(this.currentAdGroupIdFirebase, { genders: genre }).then(res => {
                    if (res == "ok") {
                      resolve('ok')
                    } else {
                      resolve('error')
                    }
                  })
                }
          
              },
              err => {
                resolve('error')
              }
            );
        })
      }
   
    })
  }

  targetNewGender(genders: GENDERS_TYPE[], idc: string, campaignId: number, idA: string, ad_group_id: number): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupGenre(campaignId, ad_group_id).then(value => {
        if (genders.length < 3) {
          if (value.length < 3) {
            this.http.post(SERVER.url + '/targetGender', {
              'ad_group_id': ad_group_id,
              'genders': genders,
              'last_genders': value,
              message: 'Ciblage en cours'
            })
              .subscribe(
                (res: GENDERS_TYPE[]) => {
                  if (res.toString().length > 0) {
                    
                    this.updateCampaign(idc, { genders: genders }).then(res_camp => {
                      if (res_camp === "ok") {
                        this.updateAdgroup(idA, { genders: genders }).then(res_group => {
                          if (res_group === "ok") {
                            resolve('ok')
                          } else {
                            resolve('error')
                          }
                        })
                      } else {
                        resolve('error')
                      }
                    })
                    
                  }
            
                },
                err => {
                  resolve('error')
                }
              );
            
          } else if (value.length === 3) {
            this.http.post(SERVER.url + '/targetGenderOnly', {
              'ad_group_id': ad_group_id,
              'genders': genders,
              message: 'Ciblage en cours'
            })
              .subscribe(
                (res: GENDERS_TYPE[]) => {
                  if (res.toString().length > 0) {
                    
                    this.updateCampaign(idc, { genders: genders }).then(res_camp => {
                      if (res_camp === "ok") {
                        this.updateAdgroup(idA, { genders: genders }).then(res_group => {
                          if (res_group === "ok") {
                            resolve('ok')
                          } else {
                            resolve('error')
                          }
                        })
                      } else {
                        resolve('error')
                      }
                    })
                    
                  }
            
                },
                err => {
                  resolve('error')
                }
              );
          }
            
        } else if (genders.length === 3) {
          if (value.length < 3) {
            this.http.post(SERVER.url + '/removeNegativeGendersCriterion', {
              'ad_group_id': ad_group_id,
              'last_genders': value,
              message: 'Ciblage en cours'
            })
              .subscribe(
                (res) => {
                  if (res[0]['status'] === "ok") {
                    this.updateCampaign(idc, { genders: genders }).then(res_camp => {
                      if (res_camp === "ok") {
                        this.updateAdgroup(idA, { genders: genders }).then(res_group => {
                          if (res_group === "ok") {
                            resolve('ok')
                          } else {
                            resolve('error')
                          }
                        })
                      } else {
                        resolve('error')
                      }
                    })
                    
                  }
            
                },
                err => {
                  resolve('error')
                }
              );
          } else if (value.length === 3) {
            resolve('ok')
          }
        }
        
          

      })
      
    })
   
  }


  getNewGender(gender: GENDERS_TYPE): Promise<string> {
    //////////console.log(gender)

    return new Promise(resolve => {
      this.currentAdGroupGenders.splice(this.currentAdGroupGenders.indexOf(gender), 1)
   
      resolve('ok')
    })
   
  }
  getNewGenderAfterEnable(genders: GENDERS_TYPE[]): Promise<string> {
    //////////console.log(genders)

    return new Promise(resolve => {
      for (var i = 0; i < genders.length; i++) {
        this.currentAdGroupGenders.push(genders[i])
        
      }
   
      resolve('ok')
    })
   
  }

  
  
  removeGender(criterion: any, campaign_id: number, ad_group_id: number, ad_group_id_firebase: string): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupYoutubeChannelsValue(campaign_id, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/excludeGender', {
            'ad_group_id': ad_group_id,
            'criterion': criterion,
            message: 'Exclusion en cours'
        
          })
            .subscribe(
              res => {
                //////////console.log(res)
                if (res[0]['status'] === "ok") {
                  this.getNewGender(criterion).then(res_new_gender => {
                    if (res_new_gender === "ok") {
       
                      this.updateAdgroup(ad_group_id_firebase, { sexes: this.currentAdGroupGenders }).then(res => {
                        if (res == "ok") {
                          resolve('ok')
                    
                        }
                      })
                
                    }
                  })
                }
          
              },
              err => {
                resolve('error')
              }
            );
        }
      })
   
    })
  }

  enableGender(criterion: any, campaign_id: number, ad_group_id: number, ad_group_id_firebase: string): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupYoutubeChannelsValue(campaign_id, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/enableGender', {
            'ad_group_id': ad_group_id,
            'criterion': criterion,
            message: 'Ciblage en cours'
        
          })
            .subscribe(
              res => {
                //////////console.log(res)
                if (res[0]['status'] === "ok") {
                  this.getNewGenderAfterEnable(criterion).then(res_new_gender => {
                    if (res_new_gender === "ok") {
       
                      this.updateAdgroup(ad_group_id_firebase, { sexes: this.currentAdGroupGenders }).then(res => {
                        if (res == "ok") {
                          resolve('ok')
                    
                        }
                      })
                
                    }
                  })
                }
          
              },
              err => {
                resolve('error')
              }
            );
        }
      })
   
    })
  }


  getAdGroupDevices(campaign_id: number, ad_group_id: number): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection('adgroup-youtube', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).valueChanges().subscribe(el => {
        resolve(el[0]['devices'])
      })
    });
  }



  getNewDevice(device): Promise<string> {
    //////////console.log(device)

    return new Promise(resolve => {
      this.currentAdGroupDevices.splice(this.currentAdGroupDevices.indexOf(device), 1)
   
      resolve('ok')
    })
   
  }
  getNewDeviceAfterEnable(devices): Promise<string> {
    //////////console.log(devices)

    return new Promise(resolve => {
      for (var i = 0; i < devices.length; i++) {
        this.currentAdGroupDevices.push(devices[i])
        
      }
   
      resolve('ok')
    })
   
  }
  
  removeDevice(criterion: any, campaign_id: number, ad_group_id: number, ad_group_id_firebase: string): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupYoutubeChannelsValue(campaign_id, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/removeDevice', {
            'ad_group_id': ad_group_id,
            'criterion': criterion,
        
          })
            .subscribe(
              res => {
                //////////console.log(res)
                if (res[0]['status'] === "ok") {
                  this.getNewDevice(criterion).then(res_new_device => {
                    if (res_new_device === "ok") {
       
                      this.updateAdgroup(ad_group_id_firebase, { devices: this.currentAdGroupDevices }).then(res => {
                        if (res == "ok") {
                          resolve('ok')
                    
                        }
                      })
                
                    }
                  })
                }
          
              },
              err => {
                resolve('error')
              }
            );
        }
      })
   
    })
  }

  enableDevice(criterion: any, campaign_id: number, ad_group_id: number, ad_group_id_firebase: string): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupYoutubeChannelsValue(campaign_id, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/enableDevice', {
            'ad_group_id': ad_group_id,
            'criterion': criterion,
        
          })
            .subscribe(
              res => {
                //////////console.log(res)
                if (res[0]['status'] === "ok") {
                  this.getNewDeviceAfterEnable(criterion).then(res_new_device => {
                    if (res_new_device === "ok") {
       
                      this.updateAdgroup(ad_group_id_firebase, { devices: this.currentAdGroupDevices }).then(res => {
                        if (res == "ok") {
                  
                          resolve('ok')
                    
                        }
                      })
                
                    }
                  })
                }
          
              },
              err => {
                resolve('error')
              }
            );
        }
      })
   
    })
  }
  targetDevices(devices: any): Promise<string> {
    return new Promise(resolve => {
      if (devices.length === 4) {
        this.updateAdgroup(this.currentAdGroupIdFirebase, { devices: devices, criterion_devices: [] }).then(res => {
          if (res == "ok") {
            resolve('ok')
          } else {
            resolve('error')
          }
        })
      } else {
        this.getAdGroupDevices(this.currentCampaignId, this.currentAdGroupId).then(value => {
          this.http.post(SERVER.url + '/targetDevices', {
            'ad_group_id': this.currentAdGroupId,
            'devices': devices,
            'last_devices': value
          })
            .subscribe(
              res => {
                if (res.toString().length > 0) {
                  this.updateAdgroup(this.currentAdGroupIdFirebase, { devices: devices, criterion_devices: res }).then(res => {
                    if (res == "ok") {
                      resolve('ok')
                    } else {
                      resolve('error')
                    }
                  })
                
                }
              },
              err => {
                resolve('error')
              }
            );
        })
      }
    })
   
  }
 

  getAdGroupYoutubeChannelsValue(campaign_id: number, ad_group_id: number): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection<AdGroup>('adgroup-youtube', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).valueChanges().forEach(el => {
       
        this.currentAdGroupYoutubeChannels = el[0].youtubeChannels
        this.currentAdGroupAge = el[0].ages
        this.currentAdGroupGenders = el[0].genders
        this.currentAdGroupDevices = el[0].devicesTargeted
        resolve('ok')
      })
   
      
    });
  }

  getAdGroupYoutubeVideosValue(campaign_id: number, ad_group_id: number): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection<AdGroup>('adgroup-youtube', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).valueChanges().forEach(el => {
        if (el[0].youtubeVideos !== undefined) {
          this.currentAdGroupYoutubeVideos = el[0].youtubeVideos
         
        } else {
          this.currentAdGroupYoutubeVideos = []
        }
        this.currentAdGroupAge = el[0].ages
        this.currentAdGroupGenders = el[0].genders
        this.currentAdGroupDevices = el[0].devicesTargeted
        resolve('ok')
      })
   
      
    });
  }
  
  

 
  getAdGroupYoutubeChannels(campaign_id: number, ad_group_id: number): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection('adgroup-youtube', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).valueChanges().forEach(el => {
        this.currentAdGroupCriterionYoutubeChannels = el[0]['youtubeChannels']
        resolve(el[0]['youtubeChannels'])
      })
   
      
    });
  }

  getAdGroupYoutubeVideos(campaign_id: number, ad_group_id: number): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection('adgroup-youtube', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).valueChanges().forEach(el => {
        this.currentAdGroupCriterionYoutubeVideos = el[0]['youtubeVideos']
        resolve(el[0]['youtubeVideos'])
      })
   
      
    });
  }

  
  targetPlacement(placement: WEBSITE[]): Promise<string> {
    return new Promise(resolve => {
      if (placement.length > 0) {
        this.http.post(SERVER.url + '/targetWebsite', {
          'ad_group_id': this.currentAdGroupId,
          'placements': placement,
          message: 'Paramétrage des emplacements'
        })
          .subscribe(
            (res: WEBSITE[]) => {
              if (res.toString().length > 0) {
                this.updateAdgroup(this.currentAdGroupIdFirebase, { websites: res }).then(res => {
                  if (res == "ok") {
                    resolve('ok')
                  } else {
                    resolve('error')
                  }
                })
              }
            },
            err => {
              resolve('error')
            }
          );
      } else {
        resolve('ok')
      }
    })
   
  }
    getAdGroupPlacementValue(campaign_id: number, ad_group_id: number): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection<AdGroup>('adgroup-youtube', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).valueChanges().forEach(el => {
       
        this.currentAdGroupTargetedPlacement = el[0].websites?el[0].websites:[]
        resolve('ok')
      })
   
      
    });
  }
  

    getNewCriterionPlacement(criterion): Promise<string> {
    //////////console.log(criterion)
    return new Promise(resolve => {
      for (var i = 0; i < criterion.length; i++) {
        this.currentAdGroupCriterionPlacement.push(criterion[i])
            
            
      }
      resolve('ok')
    })
   
  }
  getNewPlacement(placement): Promise<string> {
    //////////console.log(placement)

    return new Promise(resolve => {
      for (var i = 0; i < placement.length; i++) {
        this.currentAdGroupTargetedPlacement.push(placement[i])
            
            
      }
      resolve('ok')
    })
   
  }

 targetNewPlacement(placement: WEBSITE[], idc: string, campaignId: number, idA: string, ad_group_id: number): Promise<string> {
    return new Promise(resolve => {
      if (placement.length > 0) { 
        this.getAdGroupPlacementValue(campaignId, ad_group_id).then(getting => {
          if (getting === "ok") {
            this.http.post(SERVER.url + '/targetWebsite', {
            'ad_group_id': ad_group_id,
              'placements': placement,
            message: 'Paramétrage des emplacements'
          })
            .subscribe(
              (res: WEBSITE[]) => {
                
                if (res.length > 0) {
                  //////console.log('success')
                  //////console.log(res)
                  this.updateCampaign(idc, { websites: [...this.currentAdGroupTargetedPlacement, ...res] }).then(response_campaign => {
                    if (response_campaign === "ok") {
                       this.updateAdgroup(idA, { websites: [...this.currentAdGroupTargetedPlacement, ...res] }).then(response_adgroup => {
                    if (response_adgroup === "ok") {
                      
                      resolve('ok')
                    } else {
                      resolve('error')
                    }
                  })
                    } else {
                      resolve('error')
                    }
                  }).catch((e) => {
                    resolve('error')
                  })
                 
                }
              },
              err => {
                resolve('error')
              }
            );
          } else{
              resolve('error')
          }
        }).catch((e) => {
          resolve('error')
        })
           
      } else {
        resolve('ok')
      }
    })
   
  }

  getNewCriterionPlacementAfterRemove(criterion: number): Promise<string> {
    //////////console.log(criterion)
    return new Promise(resolve => {
      for (var i = 0; i < this.currentAdGroupCriterionPlacement.length; i++) {
        if (this.currentAdGroupCriterionPlacement[i].criterion_id === criterion) {
          this.currentAdGroupCriterionPlacement.splice(i, 1);
              
        }
            
            
      }
      resolve('ok')
    })
   
  }
  getNewPlacementAfterRemove(placement: WEBSITE[]): Promise<string> {
    //////////console.log(placement)

    return new Promise(resolve => {
      for (var j = 0; j < placement.length; j++){
        for (var i = 0; i < this.currentAdGroupTargetedPlacement.length; i++) {
          if (this.currentAdGroupTargetedPlacement[i].criterionId === placement[j].criterionId) {
            this.currentAdGroupTargetedPlacement.splice(i, 1);
                
          }
        
      }
            
            
      }
      resolve('ok')
    })
   
  }

   removeTargetedPlacement(placement: WEBSITE[], idc: string,  campaignId: number, idA: string, ad_group_id: number, ): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupPlacementValue(campaignId, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/removeTargetedPlacement', {
            'ad_group_id': ad_group_id,
            'placements': placement,
            message: 'Paramétrage des emplacements'
        
          })
            .subscribe(
              res => {
                //////////console.log(res)
                if (res[0]['status'] === "ok") {
                  this.getNewPlacementAfterRemove(placement).then(res_new_placement => {
                    if (res_new_placement === "ok") {
                      this.updateCampaign(idc, { targetedPlacements: this.currentAdGroupTargetedPlacement }).then(response_campaign => {
                    if (response_campaign === "ok") {
                       this.updateAdgroup(idA, { targetedPlacements: this.currentAdGroupTargetedPlacement }).then(response_adgroup => {
                    if (response_adgroup == "ok") {
                      
                      resolve('ok')
                    } else {
                      resolve('error')
                    }
                  })
                    } else {
                      resolve('error')
                    }
                  }).catch((e) => {
                    resolve('error')
                  })
                    }
                  })
                } else {
                  resolve('error')
                }
          
              },
              err => {
                resolve('error')
              }
            );
        }
      })
   
    })
  }
   

  excludePlacement(placement: WEBSITE[]): Promise<string> {
    return new Promise(resolve => {
      if (placement.length > 0) {
        this.http.post(SERVER.url + '/excludePlacement', {
          'ad_group_id': this.currentAdGroupId,
          'placements': placement,
          message: "Paramétrage des emplacements"
        })
          .subscribe(
            (res: WEBSITE[]) => {
              if (res.toString().length > 0) {
                this.updateAdgroup(this.currentAdGroupIdFirebase, { excludedPlacements: res }).then(res => {
                  if (res == "ok") {
                    resolve('ok')
                  } else {
                    resolve('error')
                  }
                })
              }
            },
            err => {
              resolve('error')
            }
          );
        
      } else {
        resolve('ok')
      }
    })
   
  }
  
  
  
  getNewCriterionChannels(channels: YOUTUBE_CHANNELS_INTERFACE[]): Promise<string> {
    //////////console.log(criterion)
    return new Promise(resolve => {
      for (var i = 0; i < channels.length; i++) {
        this.currentAdGroupCriterionYoutubeChannels.push(channels[i])
            
            
      }
      resolve('ok')
    })
   
  }

  getNewCriterionVideos(videos: YOUTUBE_VIDEOS_INTERFACE[]): Promise<string> {
    //////////console.log(criterion)
    return new Promise(resolve => {
      for (var i = 0; i < videos.length; i++) {
        this.currentAdGroupCriterionYoutubeVideos.push(videos[i])
            
            
      }
      resolve('ok')
    })
   
  }
  getNewChannels(channels: YOUTUBE_CHANNELS_INTERFACE[]): Promise<string> {
    //////////console.log(placement)

    return new Promise(resolve => {
      for (var i = 0; i < channels.length; i++) {
        this.currentAdGroupYoutubeChannels.push(channels[i])
            
            
      }
      resolve('ok')
    })
   
  }

  getNewVideos(videos: YOUTUBE_VIDEOS_INTERFACE[]): Promise<string> {
    //////////console.log(placement)

    return new Promise(resolve => {
      for (var i = 0; i < videos.length; i++) {
        this.currentAdGroupYoutubeVideos.push(videos[i])
            
            
      }
      resolve('ok')
    })
   
  }

  targetNewYoutubeChannels(youtubeChannels: YOUTUBE_CHANNELS_INTERFACE[], idc: string, campaignId: number, idA: string, ad_group_id: number, ad_group_id_firebase: string): Promise<string> {
    return new Promise(resolve => {
      if (youtubeChannels.length > 0) {
        this.getAdGroupYoutubeChannelsValue(campaignId, ad_group_id).then(getting => {
          if (getting === "ok") {
            this.http.post(SERVER.url + '/targetYoutubeChannels', {
              'ad_group_id': ad_group_id,
              'channels': youtubeChannels,
              message: 'Paramétrage des chaînes de diffusion'
            })
              .subscribe(
                (res: any) => {
                  ////console.log(res)
                
                  if (res.toString().length > 0) {
                    this.getNewChannels(res).then(res_new_placement => {
                      if (res_new_placement === "ok") {
                        this.getNewCriterionChannels(res).then(res_new_youtubeChannels => {
                          if (res_new_youtubeChannels === "ok") {
                            this.updateAdgroup(ad_group_id_firebase, { youtubeChannels: this.currentAdGroupYoutubeChannels }).then(res => {
                              if (res == "ok") {
                                resolve('ok')
                              } else {
                                resolve('error')
                              }
                            })
              
                          }
                        })
           
                      }
                    })
                  }
                },
                err => {
                  resolve('error')
                }
              );
          } else {
            resolve('error')
          }
        }).catch((e) => {
          resolve('error')
        })
           
      } else {
        resolve('ok')
      }
    })
   
  }

  targetNewYoutubeVideos(youtubeVideos: YOUTUBE_VIDEOS_INTERFACE[], idc: string, campaignId: number, idA: string, ad_group_id: number, ad_group_id_firebase: string): Promise<string> {
    return new Promise(resolve => {
      if (youtubeVideos.length > 0) {
        this.getAdGroupYoutubeVideosValue(campaignId, ad_group_id).then(getting => {
          if (getting === "ok") {
            this.http.post(SERVER.url + '/targetYoutubeVideos', {
              'ad_group_id': ad_group_id,
              'videos': youtubeVideos,
              message: 'Paramétrage des vidéos de diffusion'
            })
              .subscribe(
                (res: any) => {
                  ////console.log(res)
                
                  if (res.toString().length > 0) {
                    this.getNewVideos(res).then(res_new_placement => {
                      if (res_new_placement === "ok") {
                        this.getNewCriterionVideos(res).then(res_new_youtubeChannels => {
                          if (res_new_youtubeChannels === "ok") {
                            this.updateAdgroup(ad_group_id_firebase, { youtubeVideos: this.currentAdGroupYoutubeVideos }).then(res => {
                              if (res == "ok") {
                                resolve('ok')
                              } else {
                                resolve('error')
                              }
                            })
              
                          }
                        })
           
                      }
                    })
                  }
                },
                err => {
                  resolve('error')
                }
              );
          } else {
            resolve('error')
          }
        }).catch((e) => {
          resolve('error')
        })
           
      } else {
        resolve('ok')
      }
    })
   
  }
 
  getNewCriterionChannelsAfterRemove(criterion: number): Promise<string> {
    //////////console.log(criterion)
    return new Promise(resolve => {
      for (var i = 0; i < this.currentAdGroupCriterionYoutubeChannels.length; i++) {
        if (this.currentAdGroupCriterionYoutubeChannels[i].criterion_id === criterion) {
          this.currentAdGroupCriterionYoutubeChannels.splice(i, 1);
              
        }
            
            
      }
      resolve('ok')
    })
   
  }

  getNewCriterionVideosAfterRemove(criterion: number): Promise<string> {
    //////////console.log(criterion)
    return new Promise(resolve => {
      for (var i = 0; i < this.currentAdGroupCriterionYoutubeVideos.length; i++) {
        if (this.currentAdGroupCriterionYoutubeVideos[i].criterion_id === criterion) {
          this.currentAdGroupCriterionYoutubeVideos.splice(i, 1);
              
        }
            
            
      }
      resolve('ok')
    })
   
  }
  getNewChannelsAfterRemove(channels: YOUTUBE_CHANNELS_INTERFACE[]): Promise<string> {
    //////////console.log(placement)

    return new Promise(resolve => {
      for (var j = 0; j < channels.length; j++) {
        for (var i = 0; i < this.currentAdGroupYoutubeChannels.length; i++) {
          if (this.currentAdGroupYoutubeChannels[i].channelId === channels[j].channelId) {
            this.currentAdGroupYoutubeChannels.splice(i, 1);
                
          }
        
        }
            
            
      }
      resolve('ok')
    })
   
  }

  getNewVideosAfterRemove(videos: YOUTUBE_VIDEOS_INTERFACE[]): Promise<string> {
    //////////console.log(placement)

    return new Promise(resolve => {
      for (var j = 0; j < videos.length; j++) {
        for (var i = 0; i < this.currentAdGroupYoutubeVideos.length; i++) {
          if (this.currentAdGroupYoutubeVideos[i].videoId === videos[j].videoId) {
            this.currentAdGroupYoutubeVideos.splice(i, 1);
                
          }
        
        }
            
            
      }
      resolve('ok')
    })
   
  }
  



  removeTargetedChannels(channels: YOUTUBE_CHANNELS_INTERFACE[], idc: string, campaignId: number, idA: string, ad_group_id: number, ): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupYoutubeChannelsValue(campaignId, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/removeChannels', {
            'ad_group_id': ad_group_id,
            'channels': channels,
            message: 'Paramétrage des chaînes de diffusion'
        
          })
            .subscribe(
              res => {
                //////////console.log(res)
                if (res[0]['status'] === "ok") {
                  this.getNewChannelsAfterRemove(channels).then(res_new_placement => {
                    if (res_new_placement === "ok") {
                      this.updateCampaign(idc, { youtubeChannels: this.currentAdGroupYoutubeChannels }).then(response_campaign => {
                        if (response_campaign === "ok") {
                          this.updateAdgroup(idA, { youtubeChannels: this.currentAdGroupYoutubeChannels }).then(response_adgroup => {
                            if (response_adgroup == "ok") {
                      
                              resolve('ok')
                            } else {
                              resolve('error')
                            }
                          })
                        } else {
                          resolve('error')
                        }
                      }).catch((e) => {
                        resolve('error')
                      })
                    }
                  })
                } else {
                  resolve('error')
                }
          
              },
              err => {
                resolve('error')
              }
            );
        }
      })
   
    })
  }

  removeTargetedVideos(videos: YOUTUBE_VIDEOS_INTERFACE[], idc: string, campaignId: number, idA: string, ad_group_id: number, ): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupYoutubeVideosValue(campaignId, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/removeVideos', {
            'ad_group_id': ad_group_id,
            'videos': videos,
            message: 'Paramétrage des vidéos de diffusion'
        
          })
            .subscribe(
              res => {
                //////////console.log(res)
                if (res[0]['status'] === "ok") {
                  this.getNewVideosAfterRemove(videos).then(res_new_placement => {
                    if (res_new_placement === "ok") {
                      this.updateCampaign(idc, { youtubeVideos: this.currentAdGroupYoutubeVideos }).then(response_campaign => {
                        if (response_campaign === "ok") {
                          this.updateAdgroup(idA, { youtubeVideos: this.currentAdGroupYoutubeVideos }).then(response_adgroup => {
                            if (response_adgroup == "ok") {
                      
                              resolve('ok')
                            } else {
                              resolve('error')
                            }
                          })
                        } else {
                          resolve('error')
                        }
                      }).catch((e) => {
                        resolve('error')
                      })
                    }
                  })
                } else {
                  resolve('error')
                }
          
              },
              err => {
                resolve('error')
              }
            );
        }
      })
   
    })
  }
  
  
  targetYoutubeChannels(youtubeChannels: YOUTUBE_CHANNELS_INTERFACE[]): Promise<string> {
    return new Promise(resolve => {
      if (youtubeChannels.length > 0) {
        this.getAdGroupYoutubeChannels(this.currentCampaignId, this.currentAdGroupId).then(value => {
        this.http.post<YOUTUBE_CHANNELS_INTERFACE[]>(SERVER.url + '/targetYoutubeChannels', {
          'ad_group_id': this.currentAdGroupId,
          'channels': youtubeChannels,
          message: 'Paramétrage des chaînes de diffusion'
        })
          .subscribe(
            res => {
              this.updateAdgroup(this.currentAdGroupIdFirebase, { youtubeChannels: res, criterion_youtube_channels: res }).then(res => {
                if (res === "ok") {
                  resolve('ok')
                } else {
                  resolve('error')
                }
              }).catch((e) => {
                resolve('error')
              })
            },
            err => {
              resolve('error')
            }
          );
      })
      } else {
        resolve('ok')
      }
      
    })
  }
  targetYoutubeVideos(youtubeVideos: YOUTUBE_VIDEOS_INTERFACE[]): Promise<string> {
    return new Promise(resolve => {
      if (youtubeVideos.length > 0) {
         this.getAdGroupYoutubeVideos(this.currentCampaignId, this.currentAdGroupId).then(value => {
        this.http.post<YOUTUBE_VIDEOS_INTERFACE[]>(SERVER.url + '/targetYoutubeVideos', {
          'ad_group_id': this.currentAdGroupId,
          'videos': youtubeVideos,
          message: 'Paramétrage des videos de diffusion'
        })
          .subscribe(
            res => {
              this.updateAdgroup(this.currentAdGroupIdFirebase, { youtubeVideos: res, criterion_youtube_videos: res }).then(res => {
                if (res === "ok") {
                  resolve('ok')
                } else {
                  resolve('error')
                }
              }).catch((e) => {
                resolve('error')
              })
            },
            err => {
              resolve('error')
            }
          );
      })
      } else {
        resolve('ok')
      }
     
    })
  }
  
  
  getNewCriterionLocationAfterRemove(criterion: number): Promise<string> {
    //////////console.log(criterion)
    return new Promise(resolve => {
      for (var i = 0; i < this.currentCriterionLocation.length; i++) {
        if (this.currentCriterionLocation[i].id === criterion) {
          this.currentCriterionLocation.splice(i, 1);
        }
            
            
      }
      resolve('ok')
    })
   
  }
  getNewLocationsTargetedAfterRemove(location: LOCATION[]): Promise<string> {
    //////////console.log(location)

    return new Promise(resolve => {
      for (var j = 0; j < location.length; j++) {
        for (var i = 0; i < this.currentLocationsTargeted.length; i++) {
          if (this.currentLocationsTargeted[i].id === location[j].id) {
            this.currentLocationsTargeted.splice(i, 1);
          }
        }
            
            
      }
      resolve('ok')
    })
   
  }

  getNewSchedulesTargetedAfterRemove(schedules: SCHEDULE_INTERFACE[]): Promise<string> {
    //////////console.log(location)

    return new Promise(resolve => {
      for (var j = 0; j < schedules.length; j++) {
        for (var i = 0; i < this.currentAdsSchedules.length; i++) {
          if (this.currentAdsSchedules[i].criterionId === schedules[j].criterionId) {
            this.currentAdsSchedules.splice(i, 1);
          }
        }
            
            
      }
      resolve('ok')
    })
   
  }

  getNewLocationsTargetedAfterTarget(location: LOCATION[]): Promise<string> {
    //////////console.log(location)

    return new Promise(resolve => {
      for (var i = 0; i < location.length; i++) {
        this.currentLocationsTargeted.push(location[i])
      }
            
      resolve('ok')
    })
   
  }

  getNewLocationsExcludedAfterRemove(location: LOCATION[]): Promise<string> {
    //////////console.log(location)

    return new Promise(resolve => {
      for (var j = 0; j < location.length; j++) {
        for (var i = 0; i < this.currentLocationsExcluded.length; i++) {
          if (this.currentLocationsExcluded[i].id === location[j].id) {
            this.currentLocationsExcluded.splice(i, 1);
          }
       
        }
      }
      resolve('ok')
    })
   
  }
  
  getNewLocationsExcludedAfterExclude(location: LOCATION[]): Promise<string> {
    return new Promise(resolve => {
      for (var i = 0; i < location.length; i++) {
        this.currentLocationsExcluded.push(location[i])
      }
      resolve('ok')
    })
   
  }



  getCampaignData(id: string): Promise<string> {
    return new Promise(resolve => {

      this.getCampaign(id).valueChanges().subscribe(data => {
        //////////console.log(data)
        
        this.currentLocationsTargeted = data.targetedLocations
        this.currentLocationsExcluded = data.excludedLocations
        this.currentAdsSchedules = data.adsSchedules
        resolve('ok')
        
      })
  
      
    });
  }

  getCampaignDataValue__IdNotIncluded(id: string): Promise<Display> {
    return new Promise(resolve => {

      this.getCampaign(id).valueChanges().subscribe(data => {
        //////////console.log(data)
        resolve(data)
        
        

      })
  
      
    });
  }
  
  getSingleCampaignData(id: string): Promise<Display> {
    return new Promise(resolve => {

      this.getCampaign(id).snapshotChanges().pipe(
        map((actions) => {
          return { id: actions.payload.id, ...actions.payload.data() }
     
        })
      ).subscribe((res => {
        resolve(res)
      }));
      
    });
  }
  
  removeTargetedLocation(location: LOCATION[], id: string, campaign_id: number): Promise<string> {
    
    return new Promise(resolve => {
      this.getCampaignData(id).then(res_location => {
        if (res_location === "ok") {
          this.http.post(SERVER.url + '/removeTargetedLocation', {
            'campaign_id': campaign_id,
            'location': location,
            message: 'Ciblage géographique en cours'
        
          })
            .subscribe(
              res => {
                if (res[0]['status'] === "ok") {
                  this.getNewLocationsTargetedAfterRemove(location).then(res_new_placement => {
                    if (res_new_placement === "ok") {
                      this.updateCampaign(id, { targetedLocations: this.currentLocationsTargeted }).then(res => {
                        if (res == "ok") {
                          resolve('ok')
                    
                        }
                      })
                    }
                  })
                }
          
              },
              err => {
                resolve('error')
              }
            );
       
        }
      })
          
      
   
    })
  }

  removeAdsSchedules(schedules: SCHEDULE_INTERFACE[], idc: string, campaign_id: number): Promise<string> {
    
    return new Promise(resolve => {
      this.getCampaignData(idc).then(res_data => {
        if (res_data === "ok") {
          this.http.post(SERVER.url + '/removeAdsSchedule', {
            'campaign_id': campaign_id,
            'schedules': schedules,
            message: 'Modification des heures de diffusion'
        
          })
            .subscribe(
              res => {
                if (res[0]['status'] === "ok") {
                  this.getNewSchedulesTargetedAfterRemove(schedules).then(res_new_schedules => {
                    if (res_new_schedules === "ok") {
                      this.updateCampaign(idc, { adsSchedules: this.currentAdsSchedules }).then(res => {
                        if (res == "ok") {
                          resolve('ok')
                    
                        }
                      })
                    }
                  })
                }
          
              },
              err => {
                resolve('error')
              }
            );
       
        }
      })
          
      
   
    })
  }

  removeExcludedLocation(location: LOCATION[], id: string, campaign_id: number): Promise<string> {
    
    return new Promise(resolve => {
      this.getCampaignData(id).then(res_location => {
        if (res_location === "ok") {
          this.http.post(SERVER.url + '/removeExcludedLocation', {
            'campaign_id': campaign_id,
            'location': location,
            message: 'Exclusions géographique en cours'
        
          })
            .subscribe(
              res => {
                if (res[0]['status'] === "ok") {
                  this.getNewLocationsExcludedAfterRemove(location).then(res_new_placement => {
                    if (res_new_placement === "ok") {
                      this.updateCampaign(id, { excludedLocations: this.currentLocationsExcluded }).then(res => {
                        if (res == "ok") {
                          resolve('ok')
                    
                        }
                      })
                    }
                  })
                }
          
              },
              err => {
                resolve('error')
              }
            );
       
        }
      })
          
      
   
    })
  }

  targetSchedules(schedules: SCHEDULE_INTERFACE[]): Promise<any> {
    return new Promise(resolve => {
      if (schedules.length > 0) {
        this.http.post(SERVER.url + '/adsShedule', {
          'campaign_id': this.currentCampaignId,
          'schedule': schedules,
          message: 'Paramétrage des heures de diffusion'
        })
          .subscribe(
            (res: SCHEDULE_INTERFACE[]) => {
              if (res.toString().length > 0) {
                this.updateCampaign(this.currentCampaignIdFirebase, { adsSchedules: res }).then(response => {
                  if (response == "ok") {
                    resolve('ok')
                  }
                })
              }
            },
            err => {
              resolve('error')
            }
          );
        
      } else {
        resolve('ok')
      }
    })
   
  }


  targetNewSchedules(schedules: SCHEDULE_INTERFACE[], cid: string, campaignId: number, currentSchedules: SCHEDULE_INTERFACE[]): Promise<any> {
    return new Promise(resolve => {
      if (schedules.length > 0) {
        this.http.post(SERVER.url + '/adsShedule', {
          'campaign_id': campaignId,
          'schedule': schedules,
          message: 'Paramétrage des heures de diffusion'
        })
          .subscribe(
            (res: SCHEDULE_INTERFACE[]) => {
              if (res.toString().length > 0) {
                this.updateCampaign(cid, { adsSchedules: [...currentSchedules, ...res] }).then(response => {
                  if (response == "ok") {
                    resolve('ok')
                  }
                })
              }
            },
            err => {
              resolve('error')
            }
          );
        
      } else {
        resolve('ok')
      }
    })
   
  }


  targetLocation(location: LOCATION[]): Promise<string> {
    
    return new Promise(resolve => {
      if (location.length > 0) {
        this.http.post(SERVER.url + '/targetLocation', {
          'campaign_id': this.currentCampaignId,
          'locations': location,
          message: 'Ciblage géographique en cours'
        })
          .subscribe(
            (res: LOCATION[]) => {
              if (res.toString().length > 0) {
                this.updateCampaign(this.currentCampaignIdFirebase, { targetedLocations: res }).then(response => {
                  if (response == "ok") {
                    resolve('ok')
                  }
                })
              }
         
            },
            err => {
              resolve('error')
            }
          );
      
      } else {
        resolve('ok')
      }
         
    })
   
  }

  excludeLocation(location: LOCATION[]): Promise<any> {
    
    return new Promise(resolve => {
      if (location.length > 0) {
        this.http.post(SERVER.url + '/excludeLocation', {
          'campaign_id': this.currentCampaignId,
          'locations': location,
          message: 'Exclusion géographique en cours'
        })
          .subscribe(
            (res: LOCATION[]) => {
              if (res.toString().length > 0) {
                this.updateCampaign(this.currentCampaignIdFirebase, { excludedLocations: res }).then(response => {
                  if (response == "ok") {
                    resolve('ok')
                  }
                })
              }
         
            },
            err => {
              resolve('error')
            }
          );
      
      } else {
        resolve('ok')
      }
         
    })
   
  }
  
  targetNewLocation(location: LOCATION[], idc: string, campaignId: number): Promise<string> {
    
    return new Promise(resolve => {
      if (location.length > 0) {
        this.getCampaignData(idc).then(response => {
          if (response === 'ok') {
            this.http.post(SERVER.url + '/targetLocation', {
              'campaign_id': campaignId,
              'locations': location,
              message: 'Ciblage géographique en cours'
            })
              .subscribe(
                (res: LOCATION[]) => {
                  if (res.toString().length > 0) {
                    this.getNewLocationsTargetedAfterTarget(res).then(getting_new => {
                      if (getting_new === "ok") {
                        this.updateCampaign(idc, { targetedLocations: this.currentLocationsTargeted }).then(response => {
                          if (response == "ok") {
                            resolve('ok')
                          }
                        })
                        
                      }
                    })
                  }
             
                },
                err => {
                  resolve('error')
                }
              );
            
          } else {
            resolve('error')
          }
        })
      
      } else {
        resolve('ok')
      }
         
    })
   
  }

  excludeNewLocation(location: LOCATION[], idc: string, campaignId: number): Promise<any> {
    
    return new Promise(resolve => {
      if (location.length > 0) {
        this.getCampaignData(idc).then(response => {
          if (response === "ok") {
            this.http.post(SERVER.url + '/excludeLocation', {
              'campaign_id': campaignId,
              'locations': location,
              message: 'Exclusion géographique en cours'
            })
              .subscribe(
                (res: LOCATION[]) => {
                  if (res.toString().length > 0) {
                    this.getNewLocationsExcludedAfterExclude(res).then(getting_loc => {
                      if (getting_loc === "ok") {
                        this.updateCampaign(idc, { excludedLocations: this.currentLocationsExcluded }).then(response => {
                          if (response == "ok") {
                            resolve('ok')
                          }
                        })
                        
                      }
                    })
                  }
             
                },
                err => {
                  resolve('error')
                }
              );
            
          } else {
            resolve('error')
          }
        })
      
      } else {
        resolve('ok')
      }
         
    })
   
  }

  getNewCriterionLocation(criterion): Promise<string> {
    //////////console.log(criterion)
    return new Promise(resolve => {
      for (var i = 0; i < criterion.length; i++) {
        this.currentCriterionLocation.push(criterion[i])

      }
      resolve('ok')
    })
   
  }

  getNewLocation(location): Promise<string> {
    //////////console.log(location)

    return new Promise(resolve => {
      for (var i = 0; i < location.length; i++) {
        this.currentLocationsTargeted.push(location[i])

      }
      resolve('ok')
    })
   
  }

  addNewtargetLocation(id: string, location: any, campaign_id: number): Promise<string> {
 
    return new Promise(resolve => {
      this.getCampaignData(id).then(res_data => {
        
        ////////////////console.log(`promise result: ${value}`)
        if (res_data === "ok") {
          //////////console.log(this.currentCriterionLocation)
          //////////console.log(this.currentLocationsTargeted)
          this.http.post(SERVER.url + '/targetLocation', {
            'campaign_id': campaign_id,
            'location_id': location,
            message: 'Ciblage géographique en cours'
          })
            .subscribe(
              res => {
                if (res.toString().length > 0) {
                  //////////console.log(res)
                  ////////////////console.log(`res from location backend: ${res}`)
                  this.getNewCriterionLocation(res).then(res_criterion_location => {
                    if (res_criterion_location === "ok") {
                      this.getNewLocation(location).then(res_new_location => {
                        if (res_new_location === "ok") {
                          this.updateCampaign(id, { zones: this.currentLocationsTargeted, criterion_zones: this.currentCriterionLocation }).then(response => {
                            if (response == "ok") {
                              resolve('ok')
                            }
                          })
                        }
                      })
                    }
                  })
         
                }
         
              },
              err => {
                resolve('error')
              }
            );
        }
     
         
      
       
      
        
       

      })
    })
   
  }

  
  concateLocation(previousLocation, location): Promise<any> {
    return new Promise(resolve => {
      if (previousLocation.length > 0) {
        this.newLocation = [...previousLocation, ...location]
        resolve("ok")
      } else {
        this.newLocation = location
        resolve("ok")
      }
    })
  }
  
  getCampaignZones(campaign_id: number, name: string): Promise<any> {
    return new Promise(resolve => {
      //////////console.log(this.currentCampaignId)
      setTimeout(() => {
       
        this.afs.collection<Display>('youtube-ads', (ref) => ref.where('name', '==', name).where('owner', '==', this.uid).where('id_campagne', '==', campaign_id)).valueChanges().subscribe(el => {
          ////////////////console.log(el[0]['zones'])
          resolve(el[0]['zones'])
        })
      }, 2000);
    });
  }

  
  prepareSaveAd(ad_id: any, accountId: string, ad_group_id: any, ad_name: any, status: any, url_image: any, image_content: any, displayUrl: any, finalUrls: any, finalMobileUrls: any, finalAppUrls: any, referenceId: any, automated: any, uid: any, size: any, ad_type: any): Ads {
    const userDoc = this.afs.doc(`users/${uid}`);
    const newAd = {
      ad_id: ad_id,
      ad_name: ad_name,
      ad_group_id: ad_group_id,
      status: status,
      url_image: url_image,
      image_content: image_content,
      displayUrl: displayUrl,
      finalUrls: finalUrls,
      finalMobileUrls: finalMobileUrls,
      finalAppUrls: finalAppUrls,
      referenceId: referenceId,
      automated: automated,
      combinedApprovalStatus: "",
      policy: "",
      size: size,
      ad_type: ad_type,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: userDoc.ref,
      owner: uid,
      accountId: accountId
    };
    return { ...newAd };
  }
  
  createAd(ad_id: any, accountId: string, ad_group_id: any, ad_name: any, status: any, url_image: any, image_content: any, displayUrl: any, finalUrls: any, finalMobileUrls: any, finalAppUrls: any, referenceId: any, automated: any, uid: any, size: any, ad_type: any): Promise<any> {
    return new Promise(resolve => {
      this.adsModel = this.prepareSaveAd(ad_id, accountId, ad_group_id, ad_name, status, url_image, image_content, displayUrl, finalUrls, finalMobileUrls, finalAppUrls, referenceId, automated, uid, size, ad_type);
      const docRef = this.afs.collection('ads').add(this.adsModel);
      resolve('ok')
    })
  }
  
   
  prepareSaveAdResponsiveDisplay(uid: string, ad_id: number, ad_group_id: number, accountId: string, adData: NATIVE_ADS_TO_PUBLISH): RESPONSIVE_DISPLAY_ADS {
    const userDoc = this.afs.doc(`users/${uid}`);
    const newAd = {
      ad_id: ad_id,
      ad_group_id: ad_group_id,
      adData: adData,
      accountId: accountId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: userDoc.ref,
      owner: uid,
      
    };
    return { ...newAd };
  }
  
  createAdResponsiveDisplay(uid: string, ad_id: number, ad_group_id: number, accountId: string, adData: NATIVE_ADS_TO_PUBLISH): Promise<string> {
    return new Promise(resolve => {
      this.adsModel = this.prepareSaveAdResponsiveDisplay(uid, ad_id, ad_group_id, accountId, adData);
      const docRef = this.afs.collection('responsive-display-ads').add(this.adsModel);
      resolve('ok')
    })
  }

  
  addNewAd(uid: string, accountId: string, ad_group_id: number, finalUrls: any, ad_type: string, data: any): Promise<string> {
    return new Promise(resolve => {
      this.http.post(SERVER.url + '/addAd', {
        'ad_group_id': ad_group_id,
        'data': data,
        'finalUrls': [finalUrls],
        'finalAppUrls': [],
        'finalMobileUrls': [],
        message: 'Création des annonces en cours'
         
      })
        .subscribe(
          res => {
            if (res.toString().length > 0) {
              let images = []
              let _images_ = []
              
              ////////console.log(res)
              _.forEach(res, (response) => {
                ////////console.log(response)
                _images_.push(response)
                this.createAd(response['ad_id'], accountId, ad_group_id, response['ad_id'], response['status'], response['url_image'], "", response['displayUrl'], response['finalUrls'], response['finalMobileUrls'], response['finalAppUrls'], response['referenceId'], response['automated'], uid, [], ad_type).then(res_create => {
                  if (res_create === "ok") {
                    images.push(response)
                    ////////console.log(images.length)
                    ////////console.log(_images_.length)
                    if (_images_.length === images.length) {
                      resolve('ok')
                    
                    }
              
                  }
                })
              })
             
         
            }
          
          
          },
          err => {
            resolve('error')
          }
        );
  
    })
   
  }
  
  addAd(uid: string, accountId: string, ad_name: any, image_url: any, image_content, finalUrls: any, width: number, height: number, ad_type: string, data: any): Promise<string> {
    return new Promise(resolve => {
      if (data.length > 0) {
        
        this.http.post(SERVER.url + '/addAd', {
          'ad_group_id': this.currentAdGroupId,
          'data': data,
          'finalUrls': [finalUrls],
          'finalAppUrls': [],
          'finalMobileUrls': [],
          message: 'Création des annonces en cours'
  
           
        })
          .subscribe(
            res => {
              if (res.toString().length > 0) {
                let images = []
                let _images_ = []
                
                ////////console.log(res)
                _.forEach(res, (response) => {
                  ////////console.log(response)
                  _images_.push(response)
                  this.createAd(response['ad_id'], accountId, this.currentAdGroupId, response['ad_id'], response['status'], response['url_image'], image_content, response['displayUrl'], response['finalUrls'], response['finalMobileUrls'], response['finalAppUrls'], response['referenceId'], response['automated'], uid, [], ad_type).then(res_create => {
                    if (res_create === "ok") {
                      images.push(response)
                      ////////console.log(images.length)
                      ////////console.log(_images_.length)
                      if (_images_.length === images.length) {
                        resolve('ok')
                      
                      }
                
                    }
                  }).catch((e) => {
                    resolve('error')
                  })
                })
               
           
              }
            
            
            },
            err => {
              resolve('error')
            }
          );
      } else {
        resolve('ok')
      }
  
    })
   
  }

  

  public getListDisplayAdsFormACampaign(accountId: string, ad_group_id: number) {
    //////////console.log(uid)
  
    return this.afs.collection<RESPONSIVE_DISPLAY_ADS>('responsive-display-ads', (ref) => ref.where('accountId', '==', accountId).where('ad_group_id', '==', ad_group_id)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }

  public getListResponsiveDisplayAdsFormACampaign(accountId: string, ad_group_id: number) {
    //////////console.log(uid)
  
    return this.afs.collection<Ads>('responsive-display-ads', (ref) => ref.where('accountId', '==', accountId).where('ad_group_id', '==', ad_group_id)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }
  sizeObject(obj) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  /*  public getListResponsiveDisplayUpload(uid: string) {
   //////////console.log(uid)
 
   return this.afs.collection<UploadResponsiveDisplay>('uploads-responsive-display', (ref) => ref.where('owner', '==', `${uid}`)).snapshotChanges().pipe(
     map((actions) => {
       return actions.map((a) => {
         const data = a.payload.doc.data();
         return { id: a.payload.doc.id, ...data };
       });
     })
   );
   
 }

    public getListDisplayUpload(uid: string) {
   //////////console.log(uid)
 
   return this.afs.collection<Upload>('uploads', (ref) => ref.where('owner', '==', `${uid}`)).snapshotChanges().pipe(
     map((actions) => {
       return actions.map((a) => {
         const data = a.payload.doc.data();
         return { id: a.payload.doc.id, ...data };
       });
     })
   );
   
 } */
  /* 
    deleteUploadsResponsiveDisplay(uid: string) {
      return new Promise(resolve => {
        this.getListResponsiveDisplayUpload(uid).subscribe(data => {
          
          for (let index in data) {
              this.afs.collection('uploads-responsive-display').doc(data[index].id).delete()
          }
          resolve('ok')
       })
        
      })
    } */

  /*    deleteUploadsDisplay(uid: string): Promise<string> {
      return new Promise(resolve => {
        this.getListDisplayUpload(uid).subscribe(data => {
          
          for (let index in data) {
              this.afs.collection('uploads').doc(data[index].id).delete()
          }
          resolve('ok')
       })
          
        })
    } */

 
 addNewAdResponsive(uid: string, accountId: string, ad_group_id: number, url: string, data: NATIVE_ADS_TO_PUBLISH[]): Promise<{status: string, partialErrors: adDispalyError[]}> {
    return new Promise(resolve => {
      var parse = require('url-parse')
      , url_parsed: URL_PARSER = parse(url, true);
      this.getAdsToPublish(data).then(ad_to_publish => {
        if (ad_to_publish.length === data.length) {
        this.http.post(SERVER.url + '/addResponsiveDisplayAd', {
        'ad_group_id': ad_group_id,
        'data': ad_to_publish,
        'finalUrls': [url],
        'display_url': [url_parsed.hostname],
        'finalAppUrls': [],
        'finalMobileUrls': [],
         message: 'Création des annonces en cours'
      })
        .subscribe(
          (res: {response: RESPONSIVE_DISPLAY_ADS_WITHOUT_OWNER[], errors: adDispalyError[]}) => {
            if (res.response.length > 0) {
              let batch = this.afs.firestore.batch()
              const userDoc = this.afs.doc(`users/${uid}`);
              res.response.forEach(async(rsp_dsp_ad, index, arr) => {
                batch.set(this.afs.collection('responsive-display-ads').doc(rsp_dsp_ad.ad_id.toString()).ref, {owner: uid, accountId: accountId,  createdAt: firebase.firestore.FieldValue.serverTimestamp(), createdBy: userDoc.ref,  ...rsp_dsp_ad})
                if (index === res.response.length - 1) {
                  await batch.commit().then(() => {
                    resolve({status: 'ok', partialErrors: res.errors})
                  }).catch((e) => {
                    resolve({status: 'error', partialErrors: res.errors})
                  })
                }
              })
              }else{
                resolve({status: 'error', partialErrors: res.errors})
              }
          },
          err => {
            resolve({status: 'error', partialErrors: []})
          }
        );
      }
    })
      
  
    })
   
  }

  getAdsToPublish(data: NATIVE_ADS_TO_PUBLISH[]): Promise<Native_While_Publish[]> {
    return new Promise(resolve => {
      let TO_PUBLISH: Native_While_Publish[] = []
      data.forEach(item => {
        if (item.logoImages.length > 0 && item.landscapeLogoImages.length>0) {
            TO_PUBLISH.push({
            adData: item,
            requireLogo: true,
            requireLandscapeLogo: true,
            
          })
        }
        
         if (item.logoImages.length > 0 && item.landscapeLogoImages.length===0) {
            TO_PUBLISH.push({
            adData: item,
            requireLogo: true,
            requireLandscapeLogo: false,
            
          })
        }

         if (item.logoImages.length === 0 && item.landscapeLogoImages.length>0) {
            TO_PUBLISH.push({
            adData: item,
            requireLogo: false,
            requireLandscapeLogo: true,
            
          })
        }
        if (item.logoImages.length === 0 && item.landscapeLogoImages.length === 0) {
            TO_PUBLISH.push({
              adData: item,
              requireLogo: false,
              requireLandscapeLogo: false
            })
          }
          if (TO_PUBLISH.length === data.length) {
            resolve(TO_PUBLISH)
          }
       
      })
      
    })
  }

  addAdResponsive(uid: string, accountId: string, url: string, data: NATIVE_ADS_TO_PUBLISH[]): Promise<string> {
    return new Promise(resolve => {
      this.getAdsToPublish(data).then(ad_to_publish => {
        if (ad_to_publish.length === data.length) {
        this.http.post<RESPONSIVE_DISPLAY_ADS[]>(SERVER.url + '/addResponsiveDisplayAd', {
        'ad_group_id': this.currentAdGroupId,
        'data': ad_to_publish,
        'finalUrls': [url],
        'finalAppUrls': [],
        'finalMobileUrls': [],
         message: 'Création des annonces en cours'
      })
        .subscribe(
          res => {
            if (res.length > 0) {
              let batch = this.afs.firestore.batch()
              const userDoc = this.afs.doc(`users/${uid}`);
              res.forEach(async(rsp_dsp_ad, index, arr) => {
                batch.set(this.afs.collection('responsive-display-ads').doc(rsp_dsp_ad.ad_id.toString()).ref, {owner: uid, accountId: accountId,  createdAt: firebase.firestore.FieldValue.serverTimestamp(), createdBy: userDoc.ref,  ...rsp_dsp_ad})
                if (index === res.length - 1) {
                  ////console.log(`index ${index}`)
                  ////console.log(`total items ${res.length}`)
                  ////console.log(`total items - 1 ${res.length-1}`)
                  await batch.commit().then(() => {
                    ////console.log('batch save successfull')
                    resolve('ok')
                  }).catch((e) => {
                     ////console.log('batch save error')
                    ////console.log(e)
                    resolve('error')
                  })
                }
              })
              }
          },
          err => {
            resolve('error')
          }
        );
      }
    })
      
  
    })
   
  }

  changeAdStatus(id: string, adgroup_id: number, ad_id: string, last_status: string): Promise<string> {
    return new Promise(resolve => {
      this.http.post(SERVER.url + '/changeAdStatus', {
        'ad_group_id': adgroup_id,
        'ad_id': ad_id,
        'last_status': last_status,
        message: "Modification du statut de l'annonce"
      })

        .subscribe(
          res => {
            if (res.toString().length > 0) {
              this.updateAd(id, { status: res[0]['status'] })
              resolve('ok')
            }
          },
          err => {
            resolve('error')
          }
        );
    })
     
  }

  changeResponsiveDisplayAdStatus(id: string, adgroup_id: number, ad_id: string, last_status: string): Promise<string> {
    return new Promise(resolve => {
      this.http.post(SERVER.url + '/changeAdStatus', {
        'ad_group_id': adgroup_id,
        'ad_id': ad_id,
        'last_status': last_status,
        message: "Modification du statut de l'annonce"
      })

        .subscribe(
          res => {
            if (res.toString().length > 0) {
              this.updateResponsiveDisplayAd(id, { status: res[0]['status'] })
              resolve('ok')
            }
          },
          err => {
            resolve('error')
          }
        );
    })
     
  }




   updateAd(id: string, data: any):Promise<string> {
    return new Promise(resolve => {
      this.getAd(id).update(data)
      resolve("ok")
    })
   }
   updateResponsiveDisplayAd(id: string, data: any):Promise<string> {
    return new Promise(resolve => {
      this.afs.collection('responsive-display-ads').doc(id).update(data)
      resolve("ok")
    })
   }
  
    deleteAd(id: string): Promise<string> {
    return new Promise(resolve => {
        this.getAd(id).delete().then(()=>{
        resolve('ok')
      })
    })
    }
    async removeAd(ads: AdToDelete[]):Promise<string> {

      return await new Promise(resolve => {
        ////console.log('removing')
        ////console.log(typeof(ads))
          this.http.post(SERVER.url+'/removeAd', {
            'ads': ads,
            message: 'Suppression des annonces en cours'

          })

          .subscribe(
            res => {
              if (res[0]['status'] === "ok") {
                let batch = this.afs.firestore.batch()
                ads.forEach(async(ad, index) => {
                  let adsCollectionRef = this.getAd(ad.id)
                  await batch.delete(adsCollectionRef.ref)
                  if (index === ads.length - 1) {
                    batch.commit()
                    resolve('ok')
                  
                }
                  
                })
              }
              ////////////////console.log(res)


            },
            err => {
              ////console.log(err)
              resolve('error')
            }
          );
    })

     
  }
  
  removeResponsiveDisplayAdsNotPublished(ads: AdToDelete[]): Promise<string>{
    return new Promise(resolve => {
        let batch = this.afs.firestore.batch()
                ads.forEach(async(ad, index) => {
                  let adsCollectionRef = this.afs.collection('responsive-display-ads').doc(ad.ad_id.toString())
                  batch.delete(adsCollectionRef.ref)
                  if (index === ads.length - 1) {
                    await batch.commit().then(() => {
                      resolve('ok')
                      
                    }).catch((e) => {
                      ////console.log(e)
                      resolve('error')
                    })
                  
                }
                  
                })
    })
}
 removeResponsiveDisplayAd(ads: AdToDelete[]):Promise<string> {

      return new Promise(resolve => {
        ////console.log('removing')
        ////console.log(typeof(ads))
          this.http.post(SERVER.url+'/removeAd', {
            'ads': ads,
            message: 'Suppression des annonces en cours'

          })

          .subscribe(
            res => {
              if (res[0]['status'] === "ok") {
                let batch = this.afs.firestore.batch()
                ads.forEach(async(ad, index) => {
                  let adsCollectionRef = this.afs.collection('responsive-display-ads').doc(ad.ad_id.toString())
                  batch.delete(adsCollectionRef.ref)
                  if (index === ads.length - 1) {
                    await batch.commit().then(() => {
                      resolve('ok')
                      
                    }).catch((e) => {
                      ////console.log(e)
                      resolve('error')
                    })
                  
                }
                  
                })
              }
              ////////////////console.log(res)


            },
            err => {
              ////console.log(err)
              
              resolve('error')
            }
          );
    })

     
    }
  
  getAdsPolicy(ad_group_id: number): Promise<any> {
    return new Promise(resolve => {
      var infos = []
      this.http.post(SERVER.url + '/getPolicySummury', {
        "ad_group_id": ad_group_id,
      })
        .subscribe(
          res => {
            var arr = [];
            for (var key in res) {
              if (res.hasOwnProperty(key)) {
                var ad_id = res[key]['ad_id']
                var combinedApprovalStatus = res[key]['combinedApprovalStatus']
                var policy = res[key]['policy']
                infos.push({
                  "ad_id": ad_id,
                  "combinedApprovalStatus": combinedApprovalStatus,
                  "policy": policy
                })

              }
            };
            resolve(infos)
          },
          err => {
            resolve("error")
          }
        );
    })
  }
  
   getAd(id: string) {
    return this.afs.doc<RESPONSIVE_DISPLAY_ADS>(`responsive-display-ads/${id}`);
   }
  
     getSingleAd(ad_group_id: number, ad_id: number): Promise<any> {
  
  
   
     return new Promise(resolve => {
    this.afs.collection<RESPONSIVE_DISPLAY_ADS>('responsive-display-ads', (ref) => ref.where('ad_group_id','==',ad_group_id).where('ad_id','==',ad_id)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    ).subscribe(res => {
      ////////////console.log(res)
      resolve(res[0])
    });

 })
    
  
  }

}
