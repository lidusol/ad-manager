import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { SERVER } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';

import { map, take } from 'rxjs/operators';

import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';

import { AGES_TYPE, GENDERS_TYPE, DISPLAY_ADS, PLACEMENT_TYPE, LOCATION, SCHEDULE_INTERFACE, Assets, CPRC, AdToDelete, GEO_TARGET_RESPONSE, GEO_TARGET_MODEL_COLLECTION_FOR_REPORT, GEO_REPORT_SAMPLE, AGE_RANGE_REPORT, AGE_RANGE_MODEL_COLLECTION_FOR_REPORT, AGE_REPORT_SAMPLE, GENDERS_REPORT, GENDERS_REPORT_SAMPLE, GENDERS_MODEL_COLLECTION_FOR_REPORT, URL_PARSER, adDispalyError, USER_INTEREST, DEVICE_INTERFACE } from 'src/app/utils/data';

import { Display, AdGroup, Ads, AdsReport, CAMPAIGN_PERFORMANCE_REPORT_MODEL_1, PlacementReport, AdsResponse } from '../models/display.models';
import _ from 'lodash'
import moment from 'moment';
import { Search } from '../models/search.models';
import { stringify } from '@angular/compiler/src/util';
declare var require: any;


@Injectable()
/**
 * Service for display campaigns 
 * @param  {HttpClient} privatehttp
 * @param  {AuthService} privateauth
 * @param  {AngularFirestore} publicafs
 */
export class DisplayService {
  private uid: string = "";
  private campaignDisplay: Display;
  private adsModel: Ads;
  public campaignDisplayCollection: AngularFirestoreCollection<Display>;
  public campaignDisplayBrouillonCollection: AngularFirestoreCollection<Display>;
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
  public currentAdGroupTargetedPlacement: PLACEMENT_TYPE[] = []
  public currentAdGroupCriterionPlacement: any = []
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
  public assetsCollection: AngularFirestoreCollection<Assets>;
  public assetsYoutubeCollection: AngularFirestoreCollection<Assets>;
  public assetsDisplay: Assets[];
  constructor(private http: HttpClient, private auth: AuthService, public afs: AngularFirestore) {
    this.campaignDisplayCollection = this.afs.collection('adwords-display', (ref) => ref.where('owner', '==', this.uid));
    this.campaignDisplayBrouillonCollection = this.afs.collection('adwords-display-brouillon', (ref) => ref.where('owner', '==', this.uid));
    /* this.updatesAdsForCampaigns() */

  }
  /**
   * Retourne la liste de toutes les zones correspondantes contenant le mot spécifié
   * @param  {string} word
   */
  getAllLocations(word: string): Promise<any> {
    return new Promise(async (resolve) => {
      this.http.post(SERVER.url + "/getAllLocations", { q: word })
        .subscribe(
          res => {
            ////////////console.log(res)
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

  

  getUserInterestTaxonomy(q: string): Promise<any> {
    return new Promise(async (resolve) => {
      this.http.post(SERVER.url + "/getUserInterestTaxonomyCriterion", { q: q })
        .subscribe(
          res => {
            ////////////console.log(res)
            if (res.toString().length > 0) {
              var result = res['result']
              const batches = _.chunk(result, 200)
              .map(postSnapshots => {
                const batch = this.afs.firestore.batch()
                postSnapshots.forEach((post: {criterionId: number, parentId: number, name: string, type: string}) => {
                  if (post.criterionId !== undefined && post.criterionId !== null) {
                    //console.log(`updating criterion ===> ${post.criterionId}`)
                    batch.set(this.afs.collection(`${q}-user-interest-fr`).doc(post.criterionId.toString()).ref, post);
        
                  } else {
                    console.log(`error while update ads metrics===> ${post}`)
        
                  }
        
                });
                return batch.commit().then(value => {
                  console.log(value)
                  console.log("Function finished success");
                }).catch(() => {
                  console.log("Une erreur est survenue");
                });
              })
     
    
           

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
  /**
   * Retourne la zone correspondante à l'id spécifié
   * @param  {string} locationId
   */
  getAllLocationWithId(locationId: string): Promise<LOCATION> {
    return new Promise(async (resolve) => {
      this.http.post<{ result: LOCATION[] }>(SERVER.url + "/getLocationWithId", { q: locationId })
        .subscribe(
          res => {
            if (res.result.length > 0) {

              resolve(res.result[0])
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
  /**
   * Get campaign data by user id and name
   * @param  {string} uid
   * @param  {string} name
   */
  public getCampaignName(uid: string, name: string) {
    return this.afs.collection<Display>('adwords-display', (ref) => ref.where('owner', '==', uid).where('name', '==', name)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }
  /**
   * Sauvegarder une campagne dupliquer
   * @param  {Display} display
   */
  saveDuplicateCampaign(display: Display): Promise<Display> {
    return new Promise(resolve => {
      this.afs.collection('adwords-display').add(display).then(added => {
        resolve({ id: added.id, ...display })
      }).catch((e) => {
        resolve(null)
      })

    })
  }
  /**
   * Ajouter une nouvelle campagne dans la collection de campagnes
   * @param  {Display} display
   */
  createCampaign(display: Display): Promise<string> {
    return new Promise(resolve => {
      this.campaignDisplay = this.prepareSaveCampaign(display);
      const docRef = this.campaignDisplayCollection.add(this.campaignDisplay);
      docRef
        .then((add) => {
          resolve(add.id)

        })
        .catch((e) => {
          ////////console.log(e)
          resolve('error')
        })


    })
  }
  createCampaignBrouillon(display: Display): Promise<string> {
    return new Promise(resolve => {
      this.campaignDisplay = this.prepareSaveCampaign(display);
      const docRef = this.campaignDisplayBrouillonCollection.add(this.campaignDisplay);
      docRef
        .then((add) => {
          resolve(add.id)
        })
        .catch((e) => {
          resolve('error')
        })


    })
  }
  /***
   * Retourne le modèle d'une campagne display avec ses données
   * @param  {Display} display
   * @returns Display
   */
  prepareSaveCampaign(display: Display): Display {
    const newCampaign = display
    return { ...newCampaign };
  }
  /**
   * Retounrne le modèle d'un groupe d'annonce avec ses données
   * @param  {string} uid
   * @param  {string} accountId
   * @param  {number} campaign_id
   * @param  {string} name
   * @param  {string} status
   * @param  {number} ad_group_id
   * @returns accountId
   */
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
      targetedPlacements: [],
      excludedPlacements: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: userDoc.ref,
      owner: uid,
      accountId: accountId,
    };
    return { ...newAdGroup };
  }

  /**
   * Retounrne la liste de toutes les campagnes display appartenant à un compte
   * @param  {string} uid
   * @param  {string} accountId
   */
  
  public getListCampaign(uid: string, accountId: string) {
    return this.afs.collection<Display>('adwords-display', (ref) => ref.where('owner', '==', uid).where('accountId', '==', accountId).where('isArchived', '==', false).where('isExpress', '==', true)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();

          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }

  public getListBRAND() {
    return this.afs.collection<USER_INTEREST>('BRAND-user-interest-fr').snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();

          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }

  public getListIN_MARKET() {
    return this.afs.collection<USER_INTEREST>('IN_MARKET-user-interest-fr').snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();

          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }

  public getListMOBILE_APP_INSTALL_USER() {
    return this.afs.collection<USER_INTEREST>('MOBILE_APP_INSTALL_USER-user-interest-fr').snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();

          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }

  public getListNEW_SMART_PHONE_USER() {
    return this.afs.collection<USER_INTEREST>('NEW_SMART_PHONE_USER-user-interest-fr').snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();

          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }
  /**
   * Vérifier si une url est blacklister ou pas
   * @param  {string} url
   */
  detectSafeBrowsing(url: string): Promise<string> {
    return new Promise(resolve => {
      this.http.post(SERVER.url + '/detectSafeBrowsing', {
        url: url
      }).subscribe((response: any) => {
        if (response.toString().length > 0) {
          resolve('error')
        } else {
          resolve('ok')

        }

      }, error => {
        resolve('error')
      })

    })
  }

  public getListCampaignYoutube(uid: string, accountId: string) {
    ////////////////console.log(uid)
    return this.afs.collection<Display>('youtube-ads', (ref) => ref.where('owner', '==', uid).where('accountId', '==', accountId).where('isArchived', '==', false)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }

  public getListCampaignSearch(uid: string, accountId: string) {
    ////////////////console.log(uid)
    return this.afs.collection<Search>('adwords-search', (ref) => ref.where('owner', '==', uid).where('accountId', '==', accountId).where('isArchived', '==', false)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }

  public getCampaignWithAdGroupId(ad_group_id: number, uid: string) {
    return this.afs.collection<Display>('adwords-display', (ref) => ref.where('owner', '==', uid).where('ad_group_id', '==', ad_group_id).where('isArchived', '==', false).where('isExpress', '==', true)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }

  public getListAds(uid: string, accountId: string) {
    ////////////console.log(uid)
    ////////////console.log(accountId)
    return this.afs.collection<Ads>('ads', (ref) => ref.where('owner', '==', uid).where('accountId', '==', accountId)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }

  public getListAdsWithAdGroupId(ad_group_id: number) {
    ////////////console.log(uid)
    ////////////console.log(accountId)
    return this.afs.collection<Ads>('ads', (ref) => ref.where('ad_group_id', '==', ad_group_id)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }

  getCampaign(id: string) {
    return this.afs.doc<Display>(`adwords-display/${id}`);
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
      const docRef = this.afs.collection('adgroup').add(this.adgroup).then(res => {

        resolve("ok")
      }).catch((e) => {
        resolve("error")
      })
    })
  }

  PromiseGetAdGroup(campaign_id: number, ad_group_id: number): Promise<any> {
    return new Promise(resolve => {
      this.getSingleAdGroupID(campaign_id, ad_group_id).subscribe(single => {
        ////////////////////console.log("getting adgroup")
        ////////////////////console.log(single)
        resolve(single[0])
      })
    })
  }


  getSingleAdGroupID(campaign_id: number, ad_group_id: number) {
    // ////////////////////console.log(`campaign_id: ${campaign_id} ad_group_id: ${ad_group_id}`)
    return this.afs.collection<AdGroup>('adgroup', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }

  promiseGetListAdGroupId(campaign_id) {
    return this.afs.collection<AdGroup>('adgroup', (ref) => ref.where('campaign_id', '==', parseInt(`${campaign_id}`))).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getAdsSummuryFirestore(ad_group_id: number) {
    return this.afs.collection<AdsReport>('default-reports-account', (ref) => ref.where('ad_group_id', '==', ad_group_id.toString())).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getCampaignsSummuryFirestore(campaign_id: number) {
    return this.afs.collection<CAMPAIGN_PERFORMANCE_REPORT_MODEL_1>('default-campaign-reports-performance', (ref) => ref.where('campaign_id', '==', campaign_id.toString())).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getPlacementSummuryFirestore(client_customer_id: number) {
    return this.afs.collection<PlacementReport>('default-placement-reports-performance', (ref) => ref.where('client_customer_id', '==', client_customer_id)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  currentAdSummuryReport: AdsReport[] = []
  getAdsSummuryReport(client_customer_id: number): Promise<AdsReport[]> {
    return new Promise(resolve => {

    })
  }

  updatesAdsForCampaigns() {

    alert('getting')
    this.http.get("https://us-central1-adafri-e5ceb.cloudfunctions.net/createNotCreatedAds").subscribe(res => {
      //////console.log(res)
    },
      err => {
        //////console.log(err)
      }
    )



  }

  getUrlsSummuryReport(): Promise<any> {
    return new Promise(resolve => {
      this.http.post<any>(SERVER.url + "/getCampaignAllSummuryReport", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID })
        .subscribe(
          res => {


            if (res.toString().length > 0) {
              resolve(res)
              ////////////console.log(res)


            }

          },
          err => {
            ////////////console.log('une erreur est survenue')
          }
        );

    })
  }

  /**
   * Rapport de performance par zones des campagnes appartennant à l'utilisateur.
   * @param  {string} uid
   * @param  {string} aacid
   * @param  {string} startDate
   * @param  {string} endDate
   */
  getGeoLocationsPerformanceReport(uid: string, aacid: string, startDate: string, endDate: string): Promise<GEO_TARGET_RESPONSE[]> {
    return new Promise(resolve => {
      try{
        this.getCombinedCampaign(uid, aacid).then(listID => {
          if (listID.length > 0) {
            this.http.post<GEO_TARGET_RESPONSE[]>(SERVER.url + "/getGeoLocationsPerformanceReport", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID, startDate: startDate, endDate: endDate, query: listID })
              .pipe(take(1)).subscribe(
                res => {
                  //////console.log(res.length)
                  resolve(res)
                },
                err => {
                  resolve([])
  
                }
              );
          } else {
            resolve([])
          }
        })

      }catch(e){
        resolve([])
        console.log(e)
      }

    })
  }
  /**
   * Rapport de performances géographiques d'une campagne.
   * @param  {number} campaignId
   * @param  {string} startDate
   * @param  {string} endDate
   */
  getGeoLocationsPerformanceReportSingle(campaignId: number, startDate: string, endDate: string): Promise<GEO_TARGET_RESPONSE[]> {
    return new Promise(resolve => {
      try{
        this.getCampaignZones(campaignId).then(zones => {
          if (zones.length > 0) {
            this.http.post<GEO_TARGET_RESPONSE[]>(SERVER.url + "/getGeoLocationsPerformanceReportSingle", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID, startDate: startDate, endDate: endDate, query: [campaignId.toString()], allTargeted: false })
              .pipe(take(1)).subscribe(
                res => {
                  //////console.log(res.length)
                  resolve(res)
                },
                err => {
                  resolve([])
                }
              );
          } else {
            this.http.post<GEO_TARGET_RESPONSE[]>(SERVER.url + "/getGeoLocationsPerformanceReportSingle", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID, startDate: startDate, endDate: endDate, query: [campaignId.toString()], allTargeted: true })
              .pipe(take(1)).subscribe(
                res => {
                  //////console.log(res.length)
                  resolve(res)
                },
                err => {
                  resolve([])
                }
              );
          }
        }).catch((e) => {
          ////console.log(e)
        })

      }catch(e){
        resolve([])
        console.log(e)
      }


    })
  }

  getLocationFirestore(id: string): Promise<LOCATION> {
    return new Promise(resolve => {
      this.afs.collection('locations').doc<{ data: LOCATION }>(id).valueChanges().subscribe(data => {
        if (data !== undefined && data !== null && data.data.id !== undefined && data.data.id !== null) {
          //////console.log('data location found')
          resolve(data.data)

        } else {
          resolve(null)
        }
      })
    })
  }
  saveLocation(locations: LOCATION[]): Promise<string> {
    return new Promise(resolve => {
      const batch = this.afs.firestore.batch()
      locations.forEach((item, index) => {
        batch.set(this.afs.collection('locations').doc(item.id.toString()).ref, { data: item })
        if (index === locations.length - 1) {
          batch.commit().then((commited) => {
            resolve('ok')
          }).catch((e) => {
            //////console.log(e)
            resolve('ok')
          })

        }

      })

    })
  }
  getCombinedCampaign(uid: string, aacid: string,): Promise<string[]> {
    return new Promise(resolve => {
      let listID = []
      this.getListCampaign(uid, aacid).pipe(take(1)).subscribe(campaignsDisplay => {
        ////////////console.log(campaigns)
        this.getListCampaignYoutube(uid, aacid).pipe(take(1)).subscribe(campaignsYoutube => {
          let campaigns: Display[] = [...campaignsDisplay, ...campaignsYoutube].filter(cmp => cmp.id_campagne > 0)
          if (campaigns.length > 0) {
            campaigns.forEach((campaign: Display, index, arr) => {
              if (campaign.id_campagne !== 0) {
                listID.push(campaign.id_campagne.toString())

              }
              if (listID.length - 1 === index) {
                /* var _arr_string_ = listID.join(",")
                //////console.log(_arr_string_) */
                resolve(listID)
              }
            })
          }else{
            resolve([])
          }
        })
        /* */
      })
    })
  }
  getCampaignListID(uid: string, accountId: string): Promise<any[]> {
    return new Promise(resolve => {
      this.getListCampaign(uid, accountId).pipe(take(1)).subscribe(campaignsDisplay => {
        ////////////console.log(campaigns)
        this.getListCampaignYoutube(uid, accountId).pipe(take(1)).subscribe(campaignsYoutube => {
          this.getListCampaignSearch(uid, accountId).pipe(take(1)).subscribe(campaignsSearch => {
            let campaigns: any[] = [...campaignsDisplay, ...campaignsYoutube, ...campaignsSearch]
            if (campaigns.length > 0) {
              resolve(campaigns)
            }else{
              resolve([])
            }
          })
        })
        /* */
      })
    })
  }
  getListAIDCampaignForReport(uid: string, accountId: string): Promise<any> {
    return new Promise(resolve => {
      let listID = []
      this.getCampaignListID(uid, accountId).then(campaigns => {
        if(campaigns.length>0){
          campaigns.forEach((campaign: any, index, arr) => {
            if (this.campaign_id !== 0) {
              listID.push(campaign.id_campagne.toString())
  
            }
            if (listID.length - 1 === index) {
              /*  var _arr_string_ = listID.join(",") */
              resolve(listID)
            }
          })

        }else{
          resolve([])
        }
        ////////////console.log(campaigns)

        /* */
      })
    })
  }

  getAgeRangePerformanceReport(uid: string, accountId: string, startDate: string, endDate: string): Promise<AGE_RANGE_REPORT[]> {
    return new Promise(resolve => {
      try{
        this.getListAIDCampaignForReport(uid, accountId).then(listID => {
          if (listID.length > 0) {
            //////console.log(listID)
            try{
              this.http.post<AGE_RANGE_REPORT[]>(SERVER.url + "/getAgesPerformanceReport", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID, query: listID, startDate: startDate, endDate: endDate, list: listID })
                .subscribe(
                  res => {
                    resolve(res)
                  },
                  err => {
                    //////console.log(err)
                    resolve([])
                    ////////////console.log('une erreur est survenue')
                  }
                );

            }catch(e){
              resolve([])
              console.log(e)
            }
          } else {
            resolve([])
          }
        })

      }catch(e){
        console.log(e)
        resolve([])
      }



    })
  }

  getAgeRangePerformanceReportSingle(campaignId: number, startDate: string, endDate: string): Promise<AGE_RANGE_REPORT[]> {
    return new Promise(resolve => {
      try{
        this.http.post<AGE_RANGE_REPORT[]>(SERVER.url + "/getAgesPerformanceReport", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID, query: [campaignId.toString()], startDate: startDate, endDate: endDate, list: [campaignId.toString()] })
          .subscribe(
            res => {
              resolve(res)
  
            },
            err => {
              //////console.log(err)
              resolve([])
              ////////////console.log('une erreur est survenue')
            }
          );

      }catch(e){
        resolve([])
        console.log(e)
      }




    })
  }

  getGendersPerformanceReport(uid: string, accountId: string, startDate: string, endDate: string): Promise<GENDERS_REPORT[]> {
    return new Promise(resolve => {
      try{
        this.getListAIDCampaignForReport(uid, accountId).then(listID => {
          if (listID.length > 0) {
            //////console.log(listID)
            this.http.post<GENDERS_REPORT[]>(SERVER.url + "/getGendersPerformanceReport", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID, query: listID, startDate: startDate, endDate: endDate, list: listID })
              .subscribe(
                res => {
                  resolve(res)
  
                },
                err => {
                  //////console.log(err)
                  resolve([])
                  ////////////console.log('une erreur est survenue')
                }
              );
          } else {
            resolve([])
          }
        })

      }catch(e){
        resolve([])
        console.log(e)
      }



    })
  }

  getGendersPerformanceReportSingle(campaignId: number, startDate: string, endDate: string): Promise<GENDERS_REPORT[]> {
    return new Promise(resolve => {
      try{
        this.http.post<GENDERS_REPORT[]>(SERVER.url + "/getGendersPerformanceReport", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID, query: [campaignId.toString()], startDate: startDate, endDate: endDate, list: [campaignId.toString()] })
          .subscribe(
            res => {
              resolve(res)
  
            },
            err => {
              //////console.log(err)
              resolve([])
              ////////////console.log('une erreur est survenue')
            }
          );

      }catch(e){
        resolve([])
        console.log(e)
      }

    })
  }
  getCampaignSummuryReportWithSelectorDate(uid: string, accountId: string, query: string, startDate: string, endDate: string): Promise<CPRC[]> {
    return new Promise(resolve => {
      //console.log('start')
      try{
        this.getListAIDCampaignForReport(uid, accountId).then(listID => {
          //console.log(listID)
          if (listID.length > 0) {
            //////console.log(listID)
            this.http.post<CPRC[]>(SERVER.url + "/getCampaignAllSummuryReport", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID, query: query, startDate: startDate, endDate: endDate, list: listID })
              .subscribe(
                res => {
                  if (res.length > 0) {
                    let rep: CPRC[] = []
                    let data: CPRC[] = []
                    this.getListCampaign(uid, accountId).subscribe(campaignsDisplay => {
                      ////////////console.log(campaigns)
                      this.getListCampaignYoutube(uid, accountId).subscribe(campaignsYoutube => {
                        this.getListCampaignSearch(uid, accountId).subscribe(campaignsSearch => {
                          let campaigns: Display[] = [...campaignsDisplay, ...campaignsYoutube, ...campaignsSearch]
                          if (campaigns.length > 0) {
                            campaigns.forEach((campaign: Display, index, arr) => {
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
                      })
  
                    })
  
  
  
  
                  }
  
                },
                err => {
                  resolve([])
                  ////////////console.log('une erreur est survenue')
                }
              );
          } else {
            resolve([])
          }
        })

      }catch(e){
        resolve([])
        console.log(e)
      }



    })
  }
  setDateTimeZero(date: any): Date {
    let new_date = new Date(date)
    new_date.setHours(0, 0, 0, 0)
    return new_date
  }
  /**
   * Obtenir la date de création de la campagne
   * @param  {number} campaignId
   */
  getCampaignStartDate(campaignId: number):Promise<string>{
    return new Promise(resolve=>{
      this.afs.collection<Display>('adwords-display', (ref)=>ref.where('id_campagne', '==', campaignId)).valueChanges().pipe(take(1)).subscribe(campaignDisplay=>{
        if(campaignDisplay.length>0){
          ////console.log(campaignDisplay[0].createdAt)
          let startDate: Date = new Date(campaignDisplay[0].createdAt.toDate())
          ////console.log(startDate)
          resolve([this.setDateTimeZero(startDate.getTime()).getFullYear(), ('0' + (this.setDateTimeZero(startDate).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(startDate).getDate())).slice(-2),].join(''));
        }else{
          this.afs.collection<Display>('youtube-ads', (ref)=>ref.where('id_campagne', '==', campaignId)).valueChanges().pipe(take(1)).subscribe(campaignNative=>{
            if(campaignNative.length>0){
              ////console.log(campaignNative[0].createdAt)
              let startDate: Date = new Date(campaignNative[0].createdAt.toDate())
              resolve([this.setDateTimeZero(startDate).getFullYear(), ('0' + (this.setDateTimeZero(startDate).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(startDate).getDate())).slice(-2),].join(''));
            }else{
              this.afs.collection<Search>('adwords-search', (ref)=>ref.where('id_campagne', '==', campaignId)).valueChanges().pipe(take(1)).subscribe(campaignSearch=>{
                if(campaignSearch.length>0){
                  ////console.log(campaignNative[0].createdAt)
                  let startDate: Date = new Date(campaignSearch[0].createdAt.toDate())
                  resolve([this.setDateTimeZero(startDate).getFullYear(), ('0' + (this.setDateTimeZero(startDate).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(startDate).getDate())).slice(-2),].join(''));
                }else{
                  resolve(null)  
                }
              }) 
            }
          })    
        }
      })
    })
  }
  getCampaignSummuryReportWithSelectorDateSingle(uid: string, accountId: string, campaignId: number, query: string, startDate: string, endDate: string): Promise<CPRC[]> {
    return new Promise(resolve => {
      try{
        this.http.post<CPRC[]>(SERVER.url + "/getCampaignAllSummuryReport", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID, query: query, startDate: startDate, endDate: endDate, list: [campaignId.toString()] })
          .subscribe(
            res => {
              ////console.log(res)
              resolve(res)
  
            },
            err => {
              resolve([])
              ////////////console.log('une erreur est survenue')
            }
          );

      }catch(e){
        resolve([])
        console.log(e)
      }

    })
  }

  getPlacementSummuryReport(listCampaignId: any): Promise<PlacementReport[]> {
    return new Promise(resolve => {
      try{
        if (listCampaignId.length > 0) {
          this.http.post<PlacementReport[]>(SERVER.url + "/getPlacementSummuryReport", { client_customer_id: SERVER.CLIENT_CUSTOMER_ID, list: listCampaignId })
            .subscribe(
              res => {
  
  
                resolve(res)
  
  
  
  
  
              },
              err => {
                resolve([])
                ////////////console.log('une erreur est survenue')
              }
            );
  
        } else {
          resolve([])
        }

      }catch(e){
        resolve([])
        console.log(e)
      }

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
            ////////////////console.log('res adgroup')
            ////////////////console.log(res)
            if (res['status'] == "ok") {
              var id = res['id']
              this.createAdGroup(uid, accountId, campaign_id, res['name'], res['status_adgroup'], res['id']).then(res => {
                if (res == "ok") {
                  ////////////////////console.log(res)
                  this.PromiseGetAdGroup(campaign_id, id).then(adgroup => {
                    ////////////////////console.log(adgroup)
                    if (adgroup !== null) {
                      var response = []
                      response.push({
                        "id": adgroup['id'],
                        "ad_group_id": id
                      })
                      ////////////////console.log(response)
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
      this.http.post<{ status: string, handler: string }[]>(SERVER.url + "/deleteCampaign", {
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
      ////////console.log(id)
      this.getCampaign(id).delete().then(() => {
        resolve('ok')

      }).catch(e => {
        ////////console.log(e)
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
                status: res[0].status
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
                status: res[0].status
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
    return this.afs.doc<AdGroup>(`adgroup/${id}`);
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
      } else if (strategie === "CPA") {
        this.strategie = "TARGET_CPA"
        this.startegie_bid = "CpaBid"
        resolve('ok')
      } else if (strategie === "MC") {
        this.strategie = "MAXIMIZE_CONVERSIONS"
        this.startegie_bid = "None"
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
      this.channel = "DISPLAY"
      resolve('ok')

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
            ////////////////console.log(res)
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
            ////////////////console.log(res)
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

  publishCampaignToGoogle(uid: string, accountId: string, id: string, email: string, name: string, status: string, startDateFormattedGoogle: string, endDateFormattedGoogle: string, budget: number, dailyBudget: number, numberOfDays: number, strategie: any, bid: any, type: string, packType: string, targetContentNetwork: boolean, targetGoogleSearch: boolean, targetSearchNetwork: boolean, targetPartnerSearchNetwork: boolean, locationOptionTargeted: string, locationOptionExcluded: string, impressions: number, targetAllPlacement: boolean): Promise<{status: string, campaignId: number, ad_group_id: number, idA: string, idC: string}> {
    this.uid = uid
    return new Promise(resolve => {
      var max_impressions: number = 0
      if (impressions === 0) {
        if (packType === '0') {
          max_impressions === 20000
        } else if (packType === '1') {
          max_impressions === 100000
        } else if (packType === '2') {
          max_impressions === 250000
        } else if (packType === '3') {
          max_impressions = 500000
        }
      } else {
        if (strategie === 'CPM') {
          max_impressions = impressions

        } else if (strategie === 'CPC') {
          max_impressions = 0
        }
      }
      var DAILY_BUDGET: number = 0

      if (dailyBudget === 4) {
        DAILY_BUDGET = 8 * this.microDollarValue
      } else if (dailyBudget === 17) {
        DAILY_BUDGET = 8 * this.microDollarValue
      } else if (dailyBudget === 30) {
        DAILY_BUDGET = 15 * this.microDollarValue
      } else if (dailyBudget === 50) {
        DAILY_BUDGET = 23 * this.microDollarValue
      }else if(dailyBudget<5){
        DAILY_BUDGET = 8 * this.microDollarValue
      } else{
        DAILY_BUDGET = parseInt(((dailyBudget * 80) / 100).toFixed(0)) * this.microDollarValue
      }

      this.setStrategie(strategie).then(strategie_response => {
        if (strategie_response === "ok") {

          this.setChannelType(type).then(channel_response => {
            if (channel_response === "ok") {
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
              })
                .subscribe(
                  res => {
                    if (res['status'] == "ok") {
                      this.currentCampaignId = res['id']
                      this.currentCampaignIdFirebase = id
                      this.updateCampaign(id, { id_campagne: res['id'], status: res['status_campaign'], servingStatus: res['servingStatus'], budgetId: res['budgetId'] }).then(update_campaign => {
                        if (update_campaign === "ok") {
                          ////////////////console.log(update_campaign + " update campaign")
                          this.addAdGroup(res['id'], accountId, uid, name, this.strategie, this.startegie_bid, bid, targetAllPlacement).then(adgroup => {
                            if (adgroup !== "error") {
                              ////////////////console.log('adgroup')
                              ////////////////console.log(adgroup)
                              this.currentAdGroupId = adgroup[0]['ad_group_id']
                              this.currentAdGroupIdFirebase = adgroup[0]['id']
                              this.updateCampaign(id, { ad_group_id: adgroup[0]['ad_group_id'], ad_group_id_firebase: adgroup[0]['id'] }).then(update_again => {
                                if (update_again === "ok") {
                                  resolve({status: 'ok', campaignId: res['id'], ad_group_id: adgroup[0]['ad_group_id'], idC: this.currentCampaignIdFirebase, idA: this.currentAdGroupIdFirebase})
                                }
                              })
                            }
                          })
                        }
                      })
                    } else {
                      resolve({status: 'error', campaignId: 0, ad_group_id: 0, idC: '', idA: ''})
                      ////////////////console.log(res)
                    }

                  },
                  err => {
                    resolve({status: 'error', campaignId: 0, ad_group_id: 0, idC: '', idA: ''})
                  })

            }
          })
        }
      })
    })
  }
  getAdGroupAge(campaign_id: number, ad_group_id: number): Promise<AGES_TYPE[]> {
    return new Promise(resolve => {
      this.afs.collection<AdGroup>('adgroup', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).valueChanges().subscribe(el => {
        resolve(el[0].ages)
      })

    });
  }


  getNewCriterionAge(criterion: number): Promise<string> {
    ////////////////console.log(criterion)
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
    ////////////////console.log(age)

    return new Promise(resolve => {
      this.currentAdGroupAge.splice(this.currentAdGroupAge.indexOf(age), 1)

      resolve('ok')
    })

  }
  getNewAgeAfterEnable(ages): Promise<string> {
    ////////////////console.log(ages)

    return new Promise(resolve => {
      for (var i = 0; i < ages.length; i++) {
        this.currentAdGroupAge.push(ages[i])

      }

      resolve('ok')
    })

  }

  removeAge(criterion: any, campaign_id: number, ad_group_id: number, ad_group_id_firebase: string): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupPlacementValue(campaign_id, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/excludeAge', {
            'ad_group_id': ad_group_id,
            'criterion': criterion,
            message: 'Exclusion en cours'

          })
            .subscribe(
              res => {
                ////////////////console.log(res)
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
      this.getAdGroupPlacementValue(campaign_id, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/enableAge', {
            'ad_group_id': ad_group_id,
            'criterion': criterion,
            message: 'Ciblage en cours'

          })
            .subscribe(
              res => {
                ////////////////console.log(res)
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
      this.afs.collection<AdGroup>('adgroup', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).valueChanges().subscribe(el => {
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
                // ////////////////////console.log(`res from location backend: ${res}`)
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
    ////////////////console.log(gender)

    return new Promise(resolve => {
      this.currentAdGroupGenders.splice(this.currentAdGroupGenders.indexOf(gender), 1)

      resolve('ok')
    })

  }
  getNewGenderAfterEnable(genders: GENDERS_TYPE[]): Promise<string> {
    ////////////////console.log(genders)

    return new Promise(resolve => {
      for (var i = 0; i < genders.length; i++) {
        this.currentAdGroupGenders.push(genders[i])

      }

      resolve('ok')
    })

  }



  removeGender(criterion: any, campaign_id: number, ad_group_id: number, ad_group_id_firebase: string): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupPlacementValue(campaign_id, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/excludeGender', {
            'ad_group_id': ad_group_id,
            'criterion': criterion,
            message: 'Exclusion en cours'

          })
            .subscribe(
              res => {
                ////////////////console.log(res)
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
      this.getAdGroupPlacementValue(campaign_id, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/enableGender', {
            'ad_group_id': ad_group_id,
            'criterion': criterion,
            message: 'Ciblage en cours'

          })
            .subscribe(
              res => {
                ////////////////console.log(res)
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
      this.afs.collection('adgroup', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).valueChanges().subscribe(el => {
        resolve(el[0]['devices'])
      })
    });
  }



  getNewDevice(device): Promise<string> {
    ////////////////console.log(device)

    return new Promise(resolve => {
      this.currentAdGroupDevices.splice(this.currentAdGroupDevices.indexOf(device), 1)

      resolve('ok')
    })

  }
  getNewDeviceAfterEnable(devices): Promise<string> {
    ////////////////console.log(devices)

    return new Promise(resolve => {
      for (var i = 0; i < devices.length; i++) {
        this.currentAdGroupDevices.push(devices[i])

      }

      resolve('ok')
    })

  }

  removeDevice(criterion: any, campaign_id: number, ad_group_id: number, ad_group_id_firebase: string): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupPlacementValue(campaign_id, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/removeDevice', {
            'ad_group_id': ad_group_id,
            'criterion': criterion,

          })
            .subscribe(
              res => {
                ////////////////console.log(res)
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
      this.getAdGroupPlacementValue(campaign_id, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/enableDevice', {
            'ad_group_id': ad_group_id,
            'criterion': criterion,

          })
            .subscribe(
              res => {
                ////////////////console.log(res)
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


  getAdGroupPlacementValue(campaign_id: number, ad_group_id: number): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection<AdGroup>('adgroup', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).valueChanges().forEach(el => {

        this.currentAdGroupTargetedPlacement = el[0].targetedPlacements?el[0].targetedPlacements:[]
        this.currentAdGroupAge = el[0].ages
        this.currentAdGroupGenders = el[0].genders
        this.currentAdGroupDevices = el[0].devicesTargeted
        if(el[0].user_interest!==undefined && el[0].user_interest!==null){
          this.currentAdGroupUserInterest = el[0].user_interest
        }else{
          this.currentAdGroupUserInterest = []
        }
        resolve('ok')
      })


    });
  }




  getAdGroupPlacement(campaign_id: number, ad_group_id: number): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection('adgroup', (ref) => ref.where('campaign_id', '==', campaign_id).where('ad_group_id', '==', ad_group_id)).valueChanges().forEach(el => {
        this.currentAdGroupCriterionPlacement = el[0]['criterion_placement']
        resolve(el[0]['criterion_placement'])
      })


    });
  }

  targetPlacement(placement: PLACEMENT_TYPE[]): Promise<string> {
    return new Promise(resolve => {
      if (placement.length > 0) {
        this.http.post(SERVER.url + '/targetPlacement', {
          'ad_group_id': this.currentAdGroupId,
          'placements': placement,
          message: 'Paramétrage des emplacements'
        })
          .subscribe(
            (res: PLACEMENT_TYPE[]) => {
              if (res.toString().length > 0) {
                this.updateAdgroup(this.currentAdGroupIdFirebase, { targetedPlacements: res }).then(res => {
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

  targetNewPlacement(placement: PLACEMENT_TYPE[], idc: string, campaignId: number, idA: string, ad_group_id: number): Promise<string> {
    return new Promise(resolve => {
      if (placement.length > 0) {
        this.getAdGroupPlacementValue(campaignId, ad_group_id).then(getting => {
          if (getting === "ok") {
            this.http.post(SERVER.url + '/targetPlacement', {
              'ad_group_id': ad_group_id,
              'placements': placement,
              message: 'Paramétrage des emplacements'
            })
              .subscribe(
                (res: PLACEMENT_TYPE[]) => {

                  if (res.length > 0) {
                    ////////////console.log('success')
                    ////////////console.log(res)
                    this.updateCampaign(idc, { targetedPlacements: [...this.currentAdGroupTargetedPlacement, ...res] }).then(response_campaign => {
                      if (response_campaign === "ok") {
                        this.updateAdgroup(idA, { targetedPlacements: [...this.currentAdGroupTargetedPlacement, ...res] }).then(response_adgroup => {
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
  currentAdGroupUserInterest: USER_INTEREST[] = []
  targetNewUserInterest(users_interest: USER_INTEREST[], idc: string, campaignId: number, idA: string, ad_group_id: number): Promise<string> {
    return new Promise(resolve => {
      if (users_interest.length > 0) {
        this.getAdGroupPlacementValue(campaignId, ad_group_id).then(getting => {
          if (getting === "ok") {
            this.http.post<USER_INTEREST[]>(SERVER.url + '/targetUserInterest', {
              'ad_group_id': ad_group_id,
              'user_interest': users_interest,
              message: 'Paramétrage des audiences'
            })
              .subscribe(
                (res: USER_INTEREST[]) => {
                  
                  if (res.length > 0) {
                    ////////////console.log('success')
                    ////////////console.log(res)
                    let new_user_interest: USER_INTEREST[] = this.mergeUserInterestInUnique([...this.currentAdGroupUserInterest, ...res], 'criterionId')
                    this.updateCampaign(idc, { user_interest: new_user_interest}).then(response_campaign => {
                      if (response_campaign === "ok") {
                        this.updateAdgroup(idA, { user_interest: new_user_interest }).then(response_adgroup => {
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

  targetNewDevicesCampaignLevel(devices: DEVICE_INTERFACE[], idc: string, campaignId: number, idA: string, ad_group_id: number, operand: string): Promise<string> {
    return new Promise(resolve => {
      if (devices.length > 0) {
            this.http.post<DEVICE_INTERFACE[]>(SERVER.url + '/targetDevicesCampaignLevel', {
              'ad_group_id': ad_group_id,
              'devices': devices,
              'bidModifier': 1.5,
              'operand': operand,
              message: 'Paramétrage des appareils'
            })
              .subscribe(
                (res: DEVICE_INTERFACE[]) => {
                  console.log(res)
                  if (res.length > 0) {
                    console.log(idc)
                    this.updateCampaign(idc, { devicesTargeted: res}).then(response_campaign => {
                      console.log(response_campaign)
                      if (response_campaign === "ok") {
                        this.updateAdgroup(idA, { devicesTargeted: res }).then(response_adgroup => {
                          console.log(response_adgroup)
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
                      console.log(e)
                      resolve('error')
                    })

                  }
                },
                err => {
                  console.log(err)
                  resolve('error')
                }
              );
         

      } else {
        resolve('ok')
      }
    })

  }

    excludeNewDevicesCampaignLevel(devices: DEVICE_INTERFACE[], idc: string, campaignId: number, idA: string, ad_group_id: number, operand: string): Promise<string> {
    return new Promise(resolve => {
      if (devices.length > 0) {
            this.http.post<DEVICE_INTERFACE[]>(SERVER.url + '/targetDevicesCampaignLevel', {
              'ad_group_id': ad_group_id,
              'devices': devices,
              'bidModifier': 0.1,
              'operand': operand,
              message: 'Paramétrage des appareils'
            })
              .subscribe(
                (res: DEVICE_INTERFACE[]) => {
                  console.log(res)
                  if (res.length > 0) {
                    this.updateCampaign(idc, { devicesExcluded: res}).then(response_campaign => {
                      console.log(response_campaign)
                      if (response_campaign === "ok") {
                        this.updateAdgroup(idA, { devicesExcluded: res }).then(response_adgroup => {
                          console.log(response_adgroup)
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
                      console.log(e)
                      resolve('error')
                    })

                  }
                },
                err => {
                  console.log(err)
                  resolve('error')
                }
              );
         

      } else {
        resolve('ok')
      }
    })

  }

  mergeUserInterestInUnique<USER_INTEREST>(array: USER_INTEREST[], property: any): USER_INTEREST[] {

    const newArray = new Map();
  
    array.forEach((item: USER_INTEREST) => {
      const propertyValue = item[property];
      newArray.has(propertyValue) ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) }) : newArray.set(propertyValue, item);
    });
  
    return Array.from(newArray.values());
  }

  excludePlacement(placement: PLACEMENT_TYPE[]): Promise<string> {
    return new Promise(resolve => {
      if (placement.length > 0) {
        this.http.post(SERVER.url + '/excludePlacement', {
          'ad_group_id': this.currentAdGroupId,
          'placements': placement,
          message: "Paramétrage des emplacements"
        })
          .subscribe(
            (res: PLACEMENT_TYPE[]) => {
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



  getNewCriterionPlacement(criterion): Promise<string> {
    ////////////////console.log(criterion)
    return new Promise(resolve => {
      for (var i = 0; i < criterion.length; i++) {
        this.currentAdGroupCriterionPlacement.push(criterion[i])


      }
      resolve('ok')
    })

  }
  getNewPlacement(placement): Promise<string> {
    ////////////////console.log(placement)

    return new Promise(resolve => {
      for (var i = 0; i < placement.length; i++) {
        this.currentAdGroupTargetedPlacement.push(placement[i])


      }
      resolve('ok')
    })

  }

  addNewPlacement(placement: any, campaign_id: number, ad_group_id: number, ad_group_id_firebase: string): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupPlacementValue(campaign_id, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          this.http.post(SERVER.url + '/setPlacement', {
            'ad_group_id': ad_group_id,
            'placement': placement,
            'last_placement': [],
            message: 'Paramétrage des emplacements'
          })
            .subscribe(
              res => {
                if (res.toString().length > 0) {
                  this.getNewPlacement(placement).then(res_new_placement => {
                    if (res_new_placement === "ok") {
                      this.getNewCriterionPlacement(res).then(res_new_criterion_placement => {
                        if (res_new_criterion_placement === "ok") {
                          this.updateAdgroup(ad_group_id_firebase, { placement: this.currentAdGroupTargetedPlacement, criterion_placement: this.currentAdGroupCriterionPlacement }).then(res => {
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
        }
      })

    })

  }
  getNewCriterionPlacementAfterRemove(criterion: number): Promise<string> {
    ////////////////console.log(criterion)
    return new Promise(resolve => {
      for (var i = 0; i < this.currentAdGroupCriterionPlacement.length; i++) {
        if (this.currentAdGroupCriterionPlacement[i].criterion_id === criterion) {
          this.currentAdGroupCriterionPlacement.splice(i, 1);

        }


      }
      resolve('ok')
    })

  }
  getNewPlacementAfterRemove(placement: PLACEMENT_TYPE[]): Promise<string> {
    ////////////////console.log(placement)

    return new Promise(resolve => {
      for (var j = 0; j < placement.length; j++) {
        for (var i = 0; i < this.currentAdGroupTargetedPlacement.length; i++) {
          if (this.currentAdGroupTargetedPlacement[i].criterionId === placement[j].criterionId) {
            this.currentAdGroupTargetedPlacement.splice(i, 1);

          }

        }


      }
      resolve('ok')
    })

  }

  getNewUserInterestAfterRemove(user_interest: USER_INTEREST[]): Promise<string> {
    ////////////////console.log(placement)

    return new Promise(resolve => {
      for (var j = 0; j < user_interest.length; j++) {
        for (var i = 0; i < this.currentAdGroupUserInterest.length; i++) {
          if (this.currentAdGroupUserInterest[i].criterionId.toString() === user_interest[j].criterionId.toString()) {
            console.log('equality found')
            this.currentAdGroupUserInterest.splice(i, 1);
            resolve('ok')

          }

        }


      }
    })

  }




  removeTargetedPlacement(placement: PLACEMENT_TYPE[], idc: string, campaignId: number, idA: string, ad_group_id: number,): Promise<string> {
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
                ////////////////console.log(res)
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

  removeUserInterest(user_interest: USER_INTEREST[], idc: string, campaignId: number, idA: string, ad_group_id: number,): Promise<string> {
    return new Promise(resolve => {
      this.getAdGroupPlacementValue(campaignId, ad_group_id).then(res_placement => {
        if (res_placement === "ok") {
          console.log(this.currentAdGroupUserInterest)
          this.http.post(SERVER.url + '/removeUserInterest', {
            'ad_group_id': ad_group_id,
            'user_interest': user_interest,
            message: 'Suppression en cours'

          })
            .subscribe(
              res => {
                ////////////////console.log(res)
                if (res[0]['status'].toString() === "ok" || res[0]['status'].toString()==="EntityNotFound") {
                  this.getNewUserInterestAfterRemove(user_interest).then(res_new_placement => {
                    if (res_new_placement === "ok") {
                      this.updateCampaign(idc, { user_interest: this.currentAdGroupUserInterest }).then(response_campaign => {
                        if (response_campaign === "ok") {
                          this.updateAdgroup(idA, { user_interest: this.currentAdGroupUserInterest }).then(response_adgroup => {
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


  targetYoutubeChannels(youtubeChannels: any): Promise<any> {
    return new Promise(resolve => {
      this.getAdGroupPlacement(this.currentCampaignId, this.currentAdGroupId).then(value => {
        this.http.post(SERVER.url + '/targetYoutubeChannels', {
          'ad_group_id': this.currentAdGroupId,
          'channels': youtubeChannels,
        })
          .subscribe(
            res => {
              this.updateAdgroup(this.currentAdGroupIdFirebase, { youtubeChannels: youtubeChannels, criterion_youtube_channels: res }).then(res => {
                if (res == "ok") {
                  resolve('ok')
                } else {
                  resolve('error')
                }
              })
            },
            err => {
              resolve('error')
            }
          );
      })
    })
  }


  getNewCriterionLocationAfterRemove(criterion: number): Promise<string> {
    ////////////////console.log(criterion)
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
    ////////////////console.log(location)

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
    ////////////////console.log(location)

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
    ////////////////console.log(location)

    return new Promise(resolve => {
      for (var i = 0; i < location.length; i++) {
        this.currentLocationsTargeted.push(location[i])
      }

      resolve('ok')
    })

  }

  getNewLocationsExcludedAfterRemove(location: LOCATION[]): Promise<string> {
    ////////////////console.log(location)

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

  getBrouillonCampaignData(id: string): Promise<Display> {
    return new Promise(resolve => {
      this.getCampaign(id).valueChanges().subscribe(data => {
        resolve(data)
      })
    });
  }


  getCampaignData(id: string): Promise<string> {
    return new Promise(resolve => {

      this.getCampaign(id).valueChanges().subscribe(data => {
        ////////////////console.log(data)

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
        ////////////////console.log(data)
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
    ////////////////console.log(criterion)
    return new Promise(resolve => {
      for (var i = 0; i < criterion.length; i++) {
        this.currentCriterionLocation.push(criterion[i])

      }
      resolve('ok')
    })

  }

  getNewLocation(location): Promise<string> {
    ////////////////console.log(location)

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

        //////////////////////console.log(`promise result: ${value}`)
        if (res_data === "ok") {
          ////////////////console.log(this.currentCriterionLocation)
          ////////////////console.log(this.currentLocationsTargeted)
          this.http.post(SERVER.url + '/targetLocation', {
            'campaign_id': campaign_id,
            'location_id': location,
            message: 'Ciblage géographique en cours'
          })
            .subscribe(
              res => {
                if (res.toString().length > 0) {
                  ////////////////console.log(res)
                  //////////////////////console.log(`res from location backend: ${res}`)
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

  getCampaignZones(campaign_id: number): Promise<LOCATION[]> {
    return new Promise(resolve => {
      ////////////////console.log(this.currentCampaignId)
      setTimeout(() => {

        this.afs.collection<Display>('adwords-display', (ref) => ref.where('id_campagne', '==', campaign_id)).valueChanges().subscribe(el => {
          if(el[0]!==undefined){
            resolve(el[0]['targetedLocations'])

          }else{
            this.afs.collection<Display>('youtube-ads', (ref) => ref.where('id_campagne', '==', campaign_id)).valueChanges().subscribe(el => {
              if(el[0]!==undefined){
                resolve(el[0]['targetedLocations'])
    
              }else{
                this.afs.collection<Display>('adwords-search', (ref) => ref.where('id_campagne', '==', campaign_id)).valueChanges().subscribe(el => {
                  if(el[0]!==undefined){
                    resolve(el[0]['targetedLocations'])
        
                  }else{
                    
                  }
                  //////////////////////console.log(el[0]['zones'])
                })
              }
              //////////////////////console.log(el[0]['zones'])
            })
          }
          //////////////////////console.log(el[0]['zones'])
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


  prepareSaveAdResponsiveDisplay(ad_id: any, ad_group_id: any, ad_name: any, status: any, imageRectangle: string, imageSquare: string, imageLogo: string, rectangleJson: string, squareJson: string, logoJson: string, displayUrl: any, finalUrls: any, finalMobileUrls: any, finalAppUrls: any, referenceId: any, automated: any, uid: any, ad_type: any, description: string, brand: string): Ads {
    const userDoc = this.afs.doc(`users/${uid}`);
    const newAd = {
      ad_id: ad_id,
      ad_name: ad_name,
      ad_group_id: ad_group_id,
      status: status,
      imageRectangle: imageRectangle,
      imageSquare: imageSquare,
      imageLogo: imageLogo,
      rectangleJson: rectangleJson,
      squareJson: squareJson,
      logoJson: logoJson,
      url_image: imageRectangle,
      image_content: "",
      displayUrl: displayUrl,
      finalUrls: finalUrls,
      finalMobileUrls: finalMobileUrls,
      finalAppUrls: finalAppUrls,
      referenceId: referenceId,
      automated: automated,
      combinedApprovalStatus: "",
      description: description,
      brand: brand,
      image_json: "",
      policy: "",
      size: [],
      ad_type: ad_type,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: userDoc.ref,
      owner: uid,

    };
    return { ...newAd };
  }

  createAdResponsiveDisplay(ad_id: any, ad_group_id: any, ad_name: any, status: any, imageRectangle: string, imageSquare: string, imageLogo: string, rectangleJson: string, squareJson: string, logoJson: string, displayUrl: any, finalUrls: any, finalMobileUrls: any, finalAppUrls: any, referenceId: any, automated: any, uid: any, ad_type: any, description: string, brand: string): Promise<any> {
    return new Promise(resolve => {
      this.adsModel = this.prepareSaveAdResponsiveDisplay(ad_id, ad_group_id, ad_name, status, imageRectangle, imageSquare, imageLogo, rectangleJson, squareJson, logoJson, displayUrl, finalUrls, finalMobileUrls, finalAppUrls, referenceId, automated, uid, ad_type, description, brand);
      const docRef = this.afs.collection('ads').add(this.adsModel);
      resolve('ok')
    })
  }


  addNewAd(uid: string, accountId: string, ad_group_id: number, finalUrls: any, ad_type: string, data: any): Promise<{status: string, partialErrors: adDispalyError[]}> {
    return new Promise(resolve => {
      var parse = require('url-parse')
      , url: URL_PARSER = parse(finalUrls, true);
      this.http.post(SERVER.url + '/addAd', {
        'ad_group_id': ad_group_id,
        'data': data,
        'finalUrls': [finalUrls],
        'display_url': [url.hostname],
        'finalAppUrls': [], 
        'finalMobileUrls': [],
        message: 'Création des annonces en cours'

      })
        .subscribe(
          (res: {response: AdsResponse[], errors: adDispalyError[]}) => {
            if (res.response.length > 0) {
              const batch = this.afs.firestore.batch()
              let userDoc = this.afs.doc(`users/${uid}`);
              ////////console.log(res)
              res.response.forEach((ad, index, arr) => {
                batch.set(this.afs.collection('ads').doc(ad.ad_id.toString()).ref, { owner: uid, accountId: accountId, createdAt: firebase.firestore.FieldValue.serverTimestamp(), createdBy: userDoc.ref, ...ad })
                if (index === res.response.length - 1) {
                  batch.commit().then(() => {
                    ////////console.log('batch save successfull')
                    resolve({status: 'ok', partialErrors: res.errors})
                  }).catch((e) => {
                    ////////console.log('batch save error')
                    ////////console.log(e)
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

    })

  }

  saveAgeRangeReport(aacid: string, clicks: any, costs: any, impressions: any, allData: AGE_RANGE_REPORT[], reportField: AGE_REPORT_SAMPLE[]): Promise<GEO_TARGET_MODEL_COLLECTION_FOR_REPORT> {
    return new Promise(resolve => {
      let date = new Date()
      date.setHours(0, 0, 0, 0)
      moment.fn.toJSON = function () { return this.format(); }
      let data: AGE_RANGE_MODEL_COLLECTION_FOR_REPORT = {
        id: aacid, registeredTime: JSON.stringify({
          postDate: moment()
        }), clicks: [], costs: [], impressions: [], allData: [], reportField: reportField
      }
      this.afs.collection('ageRangeReport').doc(aacid).set(data).then((value) => {
        resolve(data)
      }).catch(e => {
        //////console.log(e)
        resolve(null)
      })
    })
  }

  saveAgeRangeReportSingle(campaignId: number, clicks: any, costs: any, impressions: any, allData: AGE_RANGE_REPORT[], reportField: AGE_REPORT_SAMPLE[]): Promise<GEO_TARGET_MODEL_COLLECTION_FOR_REPORT> {
    return new Promise(resolve => {
      let date = new Date()
      date.setHours(0, 0, 0, 0)
      moment.fn.toJSON = function () { return this.format(); }
      let data: AGE_RANGE_MODEL_COLLECTION_FOR_REPORT = {
        id: campaignId.toString(), registeredTime: JSON.stringify({
          postDate: moment()
        }), clicks: [], costs: [], impressions: [], allData: [], reportField: reportField
      }
      this.afs.collection('ageRangeReportPerCampaign').doc(campaignId.toString()).set(data).then((value) => {
        resolve(data)
      }).catch(e => {
        //////console.log(e)
        resolve(null)
      })
    })
  }

  saveGendersReport(aacid: string, clicks: any, costs: any, impressions: any, allData: GENDERS_REPORT[], reportField: GENDERS_REPORT_SAMPLE[]): Promise<GENDERS_MODEL_COLLECTION_FOR_REPORT> {
    return new Promise(resolve => {
      let date = new Date()
      date.setHours(0, 0, 0, 0)
      moment.fn.toJSON = function () { return this.format(); }
      let data: GENDERS_MODEL_COLLECTION_FOR_REPORT = {
        id: aacid, registeredTime: JSON.stringify({
          postDate: moment()
        }), clicks: [], costs: [], impressions: [], allData: [], reportField: reportField
      }
      this.afs.collection('gendersReport').doc(aacid).set(data).then((value) => {
        resolve(data)
      }).catch(e => {
        //////console.log(e)
        resolve(null)
      })
    })
  }
  saveGendersReportSingle(campaignId: number, clicks: any, costs: any, impressions: any, allData: GENDERS_REPORT[], reportField: GENDERS_REPORT_SAMPLE[]): Promise<GENDERS_MODEL_COLLECTION_FOR_REPORT> {
    return new Promise(resolve => {
      let date = new Date()
      date.setHours(0, 0, 0, 0)
      moment.fn.toJSON = function () { return this.format(); }
      let data: GENDERS_MODEL_COLLECTION_FOR_REPORT = {
        id: campaignId.toString(), registeredTime: JSON.stringify({
          postDate: moment()
        }), clicks: [], costs: [], impressions: [], allData: [], reportField: reportField
      }
      this.afs.collection('gendersReportPerCampaign').doc(campaignId.toString()).set(data).then((value) => {
        resolve(data)
      }).catch(e => {
        //////console.log(e)
        resolve(null)
      })
    })
  }
  saveGeoTargetReport(aacid: string, clicks: any, costs: any, impressions: any, allData: GEO_TARGET_RESPONSE[], reportField: GEO_REPORT_SAMPLE[]): Promise<GEO_TARGET_MODEL_COLLECTION_FOR_REPORT> {
    return new Promise(resolve => {
      let date = new Date()
      date.setHours(0, 0, 0, 0)
      moment.fn.toJSON = function () { return this.format(); }
      let data: GEO_TARGET_MODEL_COLLECTION_FOR_REPORT = {
        id: aacid, registeredTime: JSON.stringify({
          postDate: moment()
        }), clicks: [], costs: [], impressions: [], allData: [], reportField: reportField
      }
      this.afs.collection('geoTargetReport').doc(aacid).set(data).then((value) => {
        resolve(data)
      }).catch(e => {
        //////console.log(e)
        resolve(null)
      })
    })
  }
  saveGeoTargetReportSingle(campaignId: number, clicks: any, costs: any, impressions: any, allData: GEO_TARGET_RESPONSE[], reportField: GEO_REPORT_SAMPLE[]): Promise<GEO_TARGET_MODEL_COLLECTION_FOR_REPORT> {
    return new Promise(resolve => {
      let date = new Date()
      date.setHours(0, 0, 0, 0)
      moment.fn.toJSON = function () { return this.format(); }
      let data: GEO_TARGET_MODEL_COLLECTION_FOR_REPORT = {
        id: campaignId.toString(), registeredTime: JSON.stringify({
          postDate: moment()
        }), clicks: [], costs: [], impressions: [], allData: [], reportField: reportField
      }
      this.afs.collection('geoTargetReportPerCampaign').doc(campaignId.toString()).set(data).then((value) => {
        resolve(data)
      }).catch(e => {
        //////console.log(e)
        resolve(null)
      })
    })
  }

  checkGeoTargetReport(aacid: string, campaignId?: number): Promise<GEO_TARGET_MODEL_COLLECTION_FOR_REPORT> {

    return new Promise(resolve => {
      this.afs.collection<GEO_TARGET_MODEL_COLLECTION_FOR_REPORT>('geoTargetReport', (ref) => ref.where("id", "==", aacid)).valueChanges().subscribe(value => {
        if (value.length > 0) {
          let timeSaved: { postDate: string } = JSON.parse(value[0].registeredTime)
          var dateofvisit = moment(timeSaved.postDate, 'YYYY-MM-DD HH:mm:ss');
          //////console.log(dateofvisit)
          var duration = moment.duration(moment().diff(dateofvisit));
          var hours: number = parseFloat(duration.asHours().toFixed(2));
          //////console.log(hours)
          if (hours >= 4) {
            resolve(null)
          } else {

            resolve(value[0])
          }
        } else {
          resolve(null)
        }
      })
    })
  }

  checkGeoTargetReportSingle(campaignId: number): Promise<GEO_TARGET_MODEL_COLLECTION_FOR_REPORT> {

    return new Promise(resolve => {
      this.afs.collection<GEO_TARGET_MODEL_COLLECTION_FOR_REPORT>('geoTargetReportPerCampaign', (ref) => ref.where("id", "==", campaignId.toString())).valueChanges().subscribe(value => {
        if (value.length > 0) {
          let timeSaved: { postDate: string } = JSON.parse(value[0].registeredTime)
          var dateofvisit = moment(timeSaved.postDate, 'YYYY-MM-DD HH:mm:ss');
          //////console.log(dateofvisit)
          var duration = moment.duration(moment().diff(dateofvisit));
          var hours: number = parseFloat(duration.asHours().toFixed(2));
          //////console.log(hours)
          if (hours >= 4) {
            resolve(null)
          } else {

            resolve(value[0])
          }
        } else {
          resolve(null)
        }
      })
    })
  }

  checkAgeRangeReport(aacid: string, campaignId?: number): Promise<AGE_RANGE_MODEL_COLLECTION_FOR_REPORT> {

    return new Promise(resolve => {
      this.afs.collection<AGE_RANGE_MODEL_COLLECTION_FOR_REPORT>('ageRangeReport', (ref) => ref.where("id", "==", aacid)).valueChanges().subscribe(value => {
        if (value.length > 0) {
          let timeSaved: { postDate: string } = JSON.parse(value[0].registeredTime)
          var dateofvisit = moment(timeSaved.postDate, 'YYYY-MM-DD HH:mm:ss');
          //////console.log(dateofvisit)
          var duration = moment.duration(moment().diff(dateofvisit));
          var hours: number = parseFloat(duration.asHours().toFixed(2));
          //////console.log(hours)
          if (hours >= 4) {
            resolve(null)
          } else {

            resolve(value[0])
          }
        } else {
          resolve(null)
        }
      })
    })
  }
  checkAgeRangeReportSingle(campaignId: number): Promise<AGE_RANGE_MODEL_COLLECTION_FOR_REPORT> {

    return new Promise(resolve => {
      this.afs.collection<AGE_RANGE_MODEL_COLLECTION_FOR_REPORT>('ageRangeReportPerCampaign', (ref) => ref.where("id", "==", campaignId.toString())).valueChanges().subscribe(value => {
        if (value.length > 0) {
          let timeSaved: { postDate: string } = JSON.parse(value[0].registeredTime)
          var dateofvisit = moment(timeSaved.postDate, 'YYYY-MM-DD HH:mm:ss');
          //////console.log(dateofvisit)
          var duration = moment.duration(moment().diff(dateofvisit));
          var hours: number = parseFloat(duration.asHours().toFixed(2));
          //////console.log(hours)
          if (hours >= 4) {
            resolve(null)
          } else {

            resolve(value[0])
          }
        } else {
          resolve(null)
        }
      })
    })
  }

  checkGendersReport(aacid: string, campaignId?: number): Promise<GENDERS_MODEL_COLLECTION_FOR_REPORT> {

    return new Promise(resolve => {
      this.afs.collection<AGE_RANGE_MODEL_COLLECTION_FOR_REPORT>('gendersReport', (ref) => ref.where("id", "==", aacid)).valueChanges().subscribe(value => {
        if (value.length > 0) {
          let timeSaved: { postDate: string } = JSON.parse(value[0].registeredTime)
          var dateofvisit = moment(timeSaved.postDate, 'YYYY-MM-DD HH:mm:ss');
          //////console.log(dateofvisit)
          var duration = moment.duration(moment().diff(dateofvisit));
          var hours: number = parseFloat(duration.asHours().toFixed(2));
          //////console.log(hours)
          if (hours >= 4) {
            resolve(null)
          } else {

            resolve(value[0])
          }
        } else {
          resolve(null)
        }
      })
    })
  }

  checkGendersReportSingle(campaignId: number): Promise<GENDERS_MODEL_COLLECTION_FOR_REPORT> {

    return new Promise(resolve => {
      this.afs.collection<AGE_RANGE_MODEL_COLLECTION_FOR_REPORT>('gendersReportPerCampaign', (ref) => ref.where("id", "==", campaignId.toString())).valueChanges().subscribe(value => {
        if (value.length > 0) {
          let timeSaved: { postDate: string } = JSON.parse(value[0].registeredTime)
          var dateofvisit = moment(timeSaved.postDate, 'YYYY-MM-DD HH:mm:ss');
          //////console.log(dateofvisit)
          var duration = moment.duration(moment().diff(dateofvisit));
          var hours: number = parseFloat(duration.asHours().toFixed(2));
          //////console.log(hours)
          if (hours >= 4) {
            resolve(null)
          } else {

            resolve(value[0])
          }
        } else {
          resolve(null)
        }
      })
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
            (res: AdsResponse[]) => {
              if (res.length > 0) {
                const batch = this.afs.firestore.batch()
                let userDoc = this.afs.doc(`users/${uid}`);
                res.forEach(async (ad, index, arr) => {
                  batch.set(this.afs.collection('display-ads-assets').doc(ad.ad_id.toString()).ref, { owner: uid, accountId: accountId, createdAt: firebase.firestore.FieldValue.serverTimestamp(), createdBy: userDoc.ref, ...ad })
                  if (index === res.length - 1) {
                    await batch.commit().then(() => {
                      //////////console.log('batch save successfull')
                      resolve('ok')
                    }).catch((e) => {
                      //////////console.log('batch save error')
                      //////////console.log(e)
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
      } else {
        resolve('ok')
      }

    })

  }



  public getListDisplayAdsFormACampaign(accountId: string, ad_group_id: number) {
    ////////////////console.log(uid)

    return this.afs.collection<Ads>('ads', (ref) => ref.where('accountId', '==', accountId).where('ad_group_id', '==', ad_group_id)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }

  public getListAdsError(accountId: string, ad_group_id: number) {
    ////////////////console.log(uid)

    return this.afs.collection<adDispalyError>('ads-error', (ref) => ref.where('accountId', '==', accountId).where('ad_group_id', '==', ad_group_id)).snapshotChanges().pipe(
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
   ////////////////console.log(uid)
 
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
   ////////////////console.log(uid)
 
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


  addNewAdResponsiveDisplay(uid: string, ad_group_id: number, ad_name: any, imageRectangle: string, imageSquare: string, imageLogo: string, rectangleJson: string, squareJson: string, logoJson: string, finalUrls: any, ad_type: string, description: string, brand: string, data: any): Promise<string> {
    return new Promise(resolve => {
      var parse = require('url-parse')
      , url: URL_PARSER = parse(finalUrls, true);
      this.http.post(SERVER.url + '/addResponsiveDisplayAd', {
        'ad_group_id': ad_group_id,
        'data': data,
        'finalUrls': [finalUrls],
        'display_url': [url.hostname],
        'finalAppUrls': [],
        'finalMobileUrls': [],
        message: 'Création des annonces en cours'
      })
        .subscribe(
          res => {
            if (res.toString().length > 0) {
              let images = []
              let _images_ = []

              //////////////console.log(res)
              _.forEach(res, (response) => {
                //////////////console.log(response)
                _images_.push(response)
                this.createAdResponsiveDisplay(response['ad_id'], ad_group_id, response['title'], response['status'], response['imageRectangle'], response['imageSquare'], response['imageLogo'], "", "", "", response['displayUrl'], response['finalUrls'], response['finalMobileUrls'], response['finalAppUrls'], response['referenceId'], response['automated'], uid, ad_type, response['description'], response['brand']).then(res_create => {
                  if (res_create === "ok") {
                    images.push(response)
                    //////////////console.log(images.length)
                    //////////////console.log(_images_.length)
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

  addAdResponsive(uid: string, ad_name: any, imageRectangle: string, imageSquare: string, imageLogo: string, rectangleJson: string, squareJson: string, logoJson: string, finalUrls: string, ad_type: string, description: string, brand: string, data: any): Promise<string> {
    return new Promise(resolve => {
      this.http.post(SERVER.url + '/addResponsiveDisplayAd', {
        'ad_group_id': this.currentAdGroupId,
        /* 'imageRectangle': imageRectangle,
        'imageSquare': imageSquare,
        'imageLogo': imageLogo, */
        /* 'ad_name': ad_name, */
        'data': data,
        'finalUrls': [finalUrls],
        'finalAppUrls': [],
        'finalMobileUrls': [],
        message: 'Création des annonces en cours'
        /* 'description': description,
        'brand': brand */

      })
        .subscribe(
          res => {
            if (res.toString().length > 0) {
              let images = []
              let _images_ = []

              //////////////console.log(res)
              _.forEach(res, (response) => {
                //////////////console.log(response)
                _images_.push(response)
                this.createAdResponsiveDisplay(response['ad_id'], this.currentAdGroupId, response['title'], response['status'], response['imageRectangle'], response['imageSquare'], response['imageLogo'], "", "", "", response['displayUrl'], response['finalUrls'], response['finalMobileUrls'], response['finalAppUrls'], response['referenceId'], response['automated'], uid, ad_type, response['description'], response['brand']).then(res_create => {
                  if (res_create === "ok") {
                    images.push(response)
                    //////////////console.log(images.length)
                    //////////////console.log(_images_.length)
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




  updateAd(id: string, data: any): Promise<string> {
    return new Promise(resolve => {
      this.getAd(id).update(data)
      resolve("ok")
    })
  }

  deleteAd(id: string): Promise<string> {
    return new Promise(resolve => {
      this.getAd(id).delete().then(() => {
        resolve('ok')
      })
    })
  }
  async removeAd(ads: AdToDelete[]): Promise<string> {

    return await new Promise(resolve => {
      //////////console.log('removing')
      //////////console.log(typeof(ads))
      this.http.post(SERVER.url + '/removeAd', {
        'ads': ads,
        message: 'Suppression des annonces en cours'

      })

        .subscribe(
          res => {
            if (res[0]['status'] === "ok") {
              let batch = this.afs.firestore.batch()
              ads.forEach(async (ad, index) => {
                let adsCollectionRef = this.getAd(ad.id)
                await batch.delete(adsCollectionRef.ref)
                if (index === ads.length - 1) {
                  batch.commit()
                  resolve('ok')

                }

              })
            }
            //////////////////////console.log(res)


          },
          err => {
            //////////console.log(err)
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
    return this.afs.doc<Ads>(`ads/${id}`);
  }

  getSingleAd(ad_group_id: number, ad_id: number): Promise<any> {



    return new Promise(resolve => {
      this.afs.collection<Ads>('ads', (ref) => ref.where('ad_group_id', '==', ad_group_id).where('ad_id', '==', ad_id)).snapshotChanges().pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            return { id: a.payload.doc.id, ...data };
          });
        })
      ).subscribe(res => {
        //////////////////console.log(res)
        resolve(res[0])
      });

    })


  }

}
