import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Assets,  DISPLAY_ADS_ASSETS, IMAGES_UPLOAD_AS_ASSET, ASSETS_NATIVE, ASSETS_NATIVE_UPLOADED } from 'src/app/utils/data';
import { AuthService } from 'src/app/auth/auth.service';
import { map } from 'rxjs/operators';
import { SERVER } from 'src/environments/environment';

import * as _ from 'lodash'
declare var require: any;


@Injectable()
export class AssetsService {
  public displayAdCollection: AngularFirestoreCollection<DISPLAY_ADS_ASSETS>;
  constructor(private auth: AuthService, public afs: AngularFirestore, private http: HttpClient) { 
    this.displayAdCollection = this.afs.collection('display-ads-assets')
    this.assetsCollection = this.afs.collection('assets');
    this.assetsNativeCollection = this.afs.collection('assets-native');
    this.assetsYoutubeCollection = this.afs.collection('assets-youtube');
  }
  addDisplayAd(asset: DISPLAY_ADS_ASSETS) {
   return this.displayAdCollection.add(asset)
  }

   public getListAssets(uid: string) {
    //////console.log(uid)
    return this.afs.collection<Assets>('assets', (ref) => ref.where('owner', '==', `${uid}`)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }

     public getListAssetsNative(aacid: string) {
    //////console.log(uid)
    return this.afs.collection<ASSETS_NATIVE>('assets-native', (ref) => ref.where('aacid', '==', `${aacid}`)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }

  removeAsset(asset: DISPLAY_ADS_ASSETS): Promise<string> {
    return new Promise(resolve => {
      this.deleteMedia(asset.id).then(deleting=> {
              if(deleting === 'ok'){
                resolve('ok')
              } else {
                resolve('error')
              }
            })
      /* this.http.post(SERVER.url +'/removeMedia', { mediaId: asset.mediaId, message: 'Supression en cours' }).subscribe(
        res => {
          if (res[0]['status'] === 'ok') {
            
          }
        },
        err => {
          
        }
      ) */
      
    })
  }

  public getListImagesDisplay(accountId: string) {
    //////console.log(uid)
    return this.afs.collection<DISPLAY_ADS_ASSETS>('display-ads-assets', (ref) => ref.where('accountId', '==', `${accountId}`)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }

  deleteMedia(id: string): Promise<string> {
    return new Promise((resolve) => {
      this.getMedia(id).delete().then(() => {
        resolve('ok')
        
      }).catch(e => {
        resolve('error')
      })
    }
   
    )

    
  }

  getMedia(id: string) {
    return this.afs.doc<DISPLAY_ADS_ASSETS>(`display-ads-assets/${id}`);
  }






  public assetsCollection: AngularFirestoreCollection<Assets>;
  public assetsNativeCollection: AngularFirestoreCollection<ASSETS_NATIVE>;
  public assetsYoutubeCollection: AngularFirestoreCollection<Assets>;
  

  private allAssets: Assets[] = []
  private allAssetsYoutube: Assets[] = []
  
  addAsset(asset: Assets) {
   return this.assetsCollection.add(asset)
  }

   addAssetNative(asset: ASSETS_NATIVE) {
   return this.assetsNativeCollection.add(asset)
  }

   addAssetYoutube(asset: Assets) {
   return this.assetsYoutubeCollection.add(asset)
  }
  public getAsset(uid: string): Promise<Assets[]> {
    return new Promise(resolve => {
      this.http.get<Assets[]>(SERVER.url + '/listAssets').subscribe(
      res => {
          if (res.length > 0) {
            let assets: Assets[] = []
            this.allAssets = res
            for (let item of res) {
              if (item.owner === uid && item.parentId===0) {
                assets.push(item)
              }
            }
          resolve(assets)
          } else {
            resolve(null)
        }
      },
      err => {
        resolve(null)
      }
     )
    })
    
  }

   public uploadImageAsset(data: IMAGES_UPLOAD_AS_ASSET[]): Promise<ASSETS_NATIVE_UPLOADED[]> {
    return new Promise(resolve => {
      this.http.post(SERVER.url + '/UploadImageAsset', {data: data}).subscribe(
        (res: ASSETS_NATIVE[]) => {
          let response: ASSETS_NATIVE_UPLOADED[] = []
         
          let batch = this.afs.firestore.batch()
          res.forEach(async (el, i, arr) => {
           
            let im: ASSETS_NATIVE = {
assetId: el.assetId,
width: el.width,
height: el.height,
imageUrl: el.imageUrl,
imageFileSize: el.imageFileSize,
imageMimeType: el.imageMimeType,
usage: el.usage,
useFor: el.useFor,
owner: el.owner,
aacid: el.aacid
            }
            batch.set(this.assetsNativeCollection.doc(el.assetId.toString()).ref, im)
            response.push({id: el.assetId.toString(),  ...el})
                console.log(`${i} and ${res.length-1}`)
            if (i === res.length - 1) {
              await batch.commit().then(() => {
                resolve(response) 
                    
              }).catch((e) => {
                      resolve(null)
                  })
                }
           
            })
         
      },
        err => {
          console.log('error')
        console.log(err)
        resolve(null)
      }
     )
    })
    
  }

  public getImagesFromWebsite(url: string, is_url: boolean): Promise<any> {
    return new Promise(resolve => {
      var parse = require('url-parse')
    , url_parsed = parse(url, true);
      this.http.post(SERVER.url + '/getImagesFromWebsite', {url: url, protocol: url_parsed?.protocol?url_parsed.protocol:'', hostname: url_parsed?.origin?url_parsed.origin:'', is_url: is_url}).subscribe(
      res => {
        resolve(res)  
      },
        err => {
        resolve(null)
      }
     )
    })
    
  }
  public searchImageApi(q: string): Promise<any> {
    return new Promise(resolve => {
      this.http.post(SERVER.url + '/searchImageApi', {q: q}).subscribe(
      res => {
        resolve(res)  
      },
      err => {
        
        resolve(null)
      }
     )
    })
    
  }

   public getAssetYoutube(uid: string): Promise<Assets[]> {
    return new Promise(resolve => {
      this.http.get<Assets[]>(SERVER.url + '/listAssetsYoutube').subscribe(
      res => {
          if (res.length > 0) {
            let assets: Assets[] = []
            this.allAssetsYoutube = res
            for (let item of res) {
              if (item.owner === uid && item.parentId===0) {
                assets.push(item)
              }
            }
          resolve(assets)
          } else {
            resolve(null)
        }
      },
      err => {
        resolve(null)
      }
     )
    })
    
  }
  
  
  getAssetsRectangleWithParentId(uid: string, parentId: number):Promise<Assets[]> {
    return new Promise(resolve => {
  
            let assets: Assets[] = []
            for (let item of this.allAssets) {
              if (item.owner === uid && item.parentId===parentId && item.usedForRectangle) {
                assets.push(item)
              }
            }
          resolve(assets)
         
        })
     
   }
    
 getAssetsSquareWithParentId(uid: string, parentId: number):Promise<Assets[]> {
    return new Promise(resolve => {
  
            let assets: Assets[] = []
            for (let item of this.allAssets) {
              if (item.owner === uid && item.parentId===parentId && item.usedForSquare) {
                assets.push(item)
              }
            }
          resolve(assets)
         
        })
     
   }
  
    getAssetsLogoWithParentId(uid: string, parentId: number):Promise<Assets[]> {
    return new Promise(resolve => {
  
            let assets: Assets[] = []
            for (let item of this.allAssets) {
              if (item.owner === uid && item.parentId===parentId && item.usedForLogo) {
                assets.push(item)
              }
            }
          resolve(assets)
         
        })
     
  }
  
 getAssetsWithMediaId(uid: string, mediaId: number):Promise<Assets[]> {
    return new Promise(resolve => {
  
            let assets: Assets[] = []
            for (let item of this.allAssets) {
              if (item.owner === uid && item.mediaId===mediaId) {
                assets.push(item)
              }
            }
          resolve(assets)
         
        })
     
   }

   getAssetsYoutubeWithMediaId(uid: string, mediaId: number):Promise<Assets[]> {
    return new Promise(resolve => {
  
            let assets: Assets[] = []
            for (let item of this.allAssetsYoutube) {
              if (item.owner === uid && item.mediaId===mediaId) {
                assets.push(item)
              }
            }
          resolve(assets)
         
        })
     
   }


 getAssetsYoutubeRectangleWithParentId(uid: string, parentId: number):Promise<Assets[]> {
    return new Promise(resolve => {
  
            let assets: Assets[] = []
            for (let item of this.allAssetsYoutube) {
              if (item.owner === uid && item.parentId===parentId && item.usedForRectangle) {
                assets.push(item)
              }
            }
          resolve(assets)
         
        })
     
   }
  
 getAssetsYoutubeSquareWithParentId(uid: string, parentId: number):Promise<Assets[]> {
    return new Promise(resolve => {
  
            let assets: Assets[] = []
            for (let item of this.allAssetsYoutube) {
              if (item.owner === uid && item.parentId===parentId && item.usedForRectangle) {
                assets.push(item)
              }
            }
          resolve(assets)
         
        })
     
   }
  
   /*  getAssetsLogoWithParentId(uid: string, parentId: number) {
    //console.log(uid)
     return this.afs.collection<Assets>('assets', (ref) => ref.where('owner', '==', `${uid}`).where('parentId', '==', parentId).where('usedForLogo', '==', true)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  } */


 getAssetYoutubeWithMediaId(uid: string, mediaId: number):Promise<Assets[]> {
    return new Promise(resolve => {
  
            let assets: Assets[] = []
            for (let item of this.allAssetsYoutube) {
              if (item.owner === uid && item.mediaId===mediaId) {
                assets.push(item)
              }
            }
          resolve(assets)
         
        })
     
   }

 

   createAsset(uid: string, url: string, usedForRectangle: boolean, usedForSquare: boolean, usedForLogo: boolean, parentId: number): Promise<Assets> {
    return new Promise(resolve => {
    
      this.http.post<Assets[]>(SERVER.url + '/addAsset', {
        owner: uid,
        parentId: parentId || 0,
        url: url,
        usedForRectangle: usedForRectangle,
        usedForSquare: usedForSquare,
        usedForLogo: usedForLogo
          
      }).subscribe(
        res => {
          if (res.length > 0) {
            this.addAsset(res[0]).then(add => {
              if (add) {
                resolve(res[0])      
              }
            })
          }
        },
        err => {
           resolve(null) 
        }
      )
     
    })
  }

   createAssetYoutube(uid: string, url: string, usedForRectangle: boolean, usedForSquare: boolean, usedForLogo: boolean, parentId: number): Promise<Assets> {
    return new Promise(resolve => {
    
      this.http.post<Assets[]>(SERVER.url + '/addAsset', {
        owner: uid,
        parentId: parentId,
        url: url,
        usedForRectangle: usedForRectangle,
        usedForSquare: usedForSquare,
        usedForLogo: usedForLogo
          
      }).subscribe(
        res => {
          if (res.length > 0) {
            this.addAssetYoutube(res[0]).then(add => {
              if (add) {
                resolve(res[0])      
              }
            })
          }
        },
        err => {
            
        }
      )
     
    })
  }


}
