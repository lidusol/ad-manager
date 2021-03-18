import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { User, User_Role, Link, Linked_ADAFRI_ACCOUNT, Selected_Date_Range } from 'src/app/utils/data';
import { switchMap, map, mergeMap, take, tap, first } from 'rxjs/operators';
import _ from 'lodash'
import {Account} from '../../utils/data'
  import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase/app';
import  'firebase/database';
import  'firebase/auth';
import { CRYPTO_SHARE_ALGORITHM, CRYPTO_SHARE_KEY, SERVER, STORAGE_KEY } from 'src/environments/environment';
declare var require: any;
import CryptoJS from 'crypto-js';
import * as crypto from 'crypto'
const SecureStorage = require('secure-web-storage');
const SECRET_KEY = STORAGE_KEY;
interface CURRENT_USER_ACCESS{
  auid?: string;
  aacid?: string;
  cid?: string;
  role?: User_Role
  account?: Account,
  fromOwned?: boolean,
  link?: Linked_ADAFRI_ACCOUNT,
  deviceInfo?: DeviceInfo,
  email?: string,
  creationTime: string,
  user_company: string,

}

const algorithm = CRYPTO_SHARE_ALGORITHM;
const secretKey = CRYPTO_SHARE_KEY;
const iv = crypto.randomBytes(16);
const encrypt = (text: Buffer): {iv: string, content: string} => {
  try{
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
  }catch(e){
    return null
  }
};

@Injectable()
export class LocalStorageService {
  public secureStorage = new SecureStorage(localStorage, {
    hash: function hash(key) {
      key = CryptoJS.SHA256(key, SECRET_KEY);
      return key.toString();
  },
    // Encrypt the localstorage data
    encrypt: function encrypt(data) {
        data = CryptoJS.AES.encrypt(data, SECRET_KEY);
        data = data.toString();
        return data;
    },
    // Decrypt the encrypted data
    decrypt: function decrypt(data) {
        data = CryptoJS.AES.decrypt(data, SECRET_KEY);
        data = data.toString(CryptoJS.enc.Utf8);
        return data;
    }
    });
  deviceInfo = null;
  isMobile = null;
  isTablet = null;
  isDesktopDevice = null;
  constructor(private router: Router, private afAuth: AngularFireAuth,
    private afs: AngularFirestore, private deviceService: DeviceDetectorService, private db: AngularFireDatabase) {
        this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {

          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
    this.epicFunction();
    this.updateOnUser().subscribe();
    this.updateOnDisconnect().subscribe();
    this.updateOnAway();
  }
  
  epicFunction(): Promise<string> {
    return new Promise(resolve => {
      this.deviceInfo = this.deviceService.getDeviceInfo();
      this.isMobile = this.deviceService.isMobile();
      this.isTablet = this.deviceService.isTablet();
      this.isDesktopDevice = this.deviceService.isDesktop();
          resolve('ok')
       
     })
    }
  storatge_prefix = "adafri-"
  public setCreationTime(uid: string, value: string): Promise<string> {
    return new Promise(resolve => {
      this.secureStorage.setItem(this.storatge_prefix+'_cTime_', JSON.stringify({uid: uid, value: value}))
      resolve('ok')
    })
  }


  public userAccountIdEncryption(accountId: string): Promise<{iv: string, content: string}> {
    return new Promise(resolve => {
      try{
        var hash = encrypt(Buffer.from(accountId, 'utf8'));
        resolve(hash)
      }catch(e){
        resolve(null)
      }
    })
  }
  public setInvitationProvider(hash: {iv: string, content: string}): Promise<string> {
    return new Promise(resolve => {
      try{
        this.secureStorage.setItem(this.storatge_prefix+'client_provider', JSON.stringify({provider: hash}))
        resolve('ok')
      }catch(e){
        resolve(null)
      }
    })
  }

  public getInvitationProvider(): Promise<{iv: string, content: string}> {
    return new Promise(resolve => {
      try{
        let provider = this.secureStorage.getItem(this.storatge_prefix+'client_provider')
        if(provider!==undefined && provider!==null){
          try{
            let provider_hash = JSON.parse(provider)['provider']
            if(provider_hash['iv']!==undefined && provider_hash['iv']!==null && provider_hash['content']!==undefined && provider_hash['content']!==null){
              resolve(provider_hash)
            }else{
              resolve(null)
            }
          }catch(e){
            resolve(null)
          }
        }else{
          resolve(null)
        }

      }catch(err){
        resolve(null)
      }
    })
  }

  public removeInvitationProvider(): Promise<string> {
    return new Promise(resolve => {
      try{
        localStorage.removeItem(this.storatge_prefix + 'client_provider')
        resolve('ok')
      }catch(e){
        resolve(null)
      }
      
    })
  }

  public setLastRangeSelectedValue(range: Selected_Date_Range): Promise<string> {
    return new Promise(resolve => {
      this.secureStorage.setItem(this.storatge_prefix+'_range_value_', JSON.stringify({range: range}))
      resolve('ok')
    })
  }

  public getLastRangeSelectedValue(): Promise<Selected_Date_Range> {
    return new Promise(resolve => {
      let range = this.secureStorage.getItem(this.storatge_prefix + '_range_value_')
      if(range!==undefined && range!==null){
        resolve(JSON.parse(range)['range'])
      }else{
        resolve(null)
      }
    })
    
  }


  public setTheme(theme: string): Promise<string> {
    return new Promise(resolve => {
      this.secureStorage.setItem(this.storatge_prefix+'_theme', JSON.stringify({theme: theme}))
      resolve('ok')
    })
  }


  public getTheme(): Promise<string> {
    return new Promise(resolve => {
      let theme = this.secureStorage.getItem(this.storatge_prefix + '_theme')
      if(theme!==undefined && theme!==null){
        resolve(JSON.parse(theme)['theme'])
      }else{
        resolve(null)
      }
    })
    
  }

  public setLang(lang: string): Promise<string> {
    return new Promise(resolve => {
      this.secureStorage.setItem(this.storatge_prefix+'_lang', JSON.stringify({lang: lang}))
      resolve('ok')
    })
  }
  public getLang(): Promise<string> {
    return new Promise(resolve => {
      let language = this.secureStorage.getItem(this.storatge_prefix + '_lang')
      if(language!==undefined && language!==null){
        resolve(JSON.parse(language)['lang'])
      }else{
        resolve(null)
      }
    })
    
  }
  public setAccountId(value: string): Promise<string> {
    return new Promise(resolve => {
      this.secureStorage.setItem(this.storatge_prefix+'aacid', value)
      resolve('ok')
    })
  }
  public setCid(cid: string): Promise<string> {
    return new Promise(resolve => {
      this.secureStorage.setItem(this.storatge_prefix+'cid', cid)
      resolve('ok')
    })
  }

 
  public getAccountId(): Promise<string> {
    return new Promise(resolve => {
      let id = this.secureStorage.getItem(this.storatge_prefix + 'aacid')
      resolve(id)
    })
    
  }

   public setUserId(value: string): Promise<string> {
    return new Promise(resolve => {
      this.secureStorage.setItem(this.storatge_prefix+'auid', value)
      resolve('ok')
    })
  }
  public getUserId(): Promise<string> {
    return new Promise(resolve => {
      let id = this.secureStorage.getItem(this.storatge_prefix + 'auid')
      resolve(id)
    })
    
  }

  public removeAccountId(): Promise<string> {
    return new Promise(resolve => {
      localStorage.removeItem(this.storatge_prefix + 'aacid')
      resolve('ok')
      
    })
  }

   public removeUserId(): Promise<string> {
    return new Promise(resolve => {
      localStorage.removeItem(this.storatge_prefix + 'auid')
      resolve('ok')
      
    })
   }
  
  public setUserIdAndAccountId(uid: string, account_id: string, role: User_Role): Promise<string> {
    return new Promise(resolve => {
     
     
      this.secureStorage.setItem(this.storatge_prefix + 'auid', uid)
      this.secureStorage.setItem(this.storatge_prefix + 'aacid', account_id)
      if (role.admin) {
        this.secureStorage.setItem(this.storatge_prefix+ 'access', 'adm')
        
      } else {
        this.secureStorage.setItem(this.storatge_prefix+ 'access', 'usr')
        
      }
      resolve('ok')
    })
  }

   public removeUserIdAndAccountId(): Promise<string> {
    return new Promise(resolve => {
      localStorage.removeItem(this.storatge_prefix + 'auid')
      localStorage.removeItem(this.storatge_prefix+'aacid')
      resolve('ok')
    })
   }
  
   public getListAccountsOwned(uid: string) {
    ////////console.log(uid)
    return this.afs.collection<Account>('accounts', (ref) => ref.where('owner', '==', `${uid}`)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
   }
  
    public searchAccount(accountId: string, currentAccountValue, link: Link):Promise<Link> {
      return new Promise(resolve => {
       this.afs.doc<Account>(`accounts/${accountId}`).valueChanges().subscribe(account => {
        if(account!==undefined){
          if (account.account_value !== currentAccountValue) {
            link.linked_account.account.account_value = account.account_value
            this.afs.doc<Link>(`accounts_link/${link.id}`).set(link).then(() => {
              resolve(link)
            })
          } else {
            resolve(link)
        }

        }else{
          this.router.navigate(['/select/account'])
        }
    });
    })
    
    }
  public getListActiveLink(uid: string) {
    ////////console.log(uid)
    return this.afs.collection<Link>('accounts_link', (ref) => ref.where('target', '==', `${uid}`).where('status', '==', 'ACTIVE')).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }

  setUserInactive(uid):Promise<string>{
    return new Promise(resolve=>{
      this.setPresence('offline');
      resolve('ok')    
      
     

    })
  }

  checkSession(): Promise<string>{
    return new Promise(resolve => {
      if (this.afAuth.user !== null && this.afAuth.user !== undefined) {
        this.afAuth.user.pipe(take(1)).subscribe(user => {
          if (user !== null) {
            const diffTime = Math.abs(new Date().getTime() - new Date(user.metadata.lastSignInTime).getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            const hours = Math.floor(diffTime / 3600000)
            if (hours > 2) {
              this.removeUserIdAndAccountId().then(remove => {
                this.setUserInactive(user.uid).then(()=>{
    
                  this.afAuth.auth.signOut().then(() => {
                    this.router.navigate(['/auth/login'])
                    
                  }).catch(e => {
                    this.router.navigate(['/auth/login'])
                  })

                })
                         
              })
    
            } else {
              resolve('ok')
            }
            
          }else{
            resolve(null)
          }
        })
        
      } else {
        
        this.removeUserIdAndAccountId().then(remove => {
          this.router.navigate(['/auth/login'])
                         
        })
      }
    })
  }
  user: Observable<User | null>;
  access: CURRENT_USER_ACCESS = null
   public getUserIdAndAccountId(): Promise<CURRENT_USER_ACCESS> {
     return new Promise(resolve => {
       this.checkSession().then(check_session => {
         if (check_session === "ok") {
          /* this.afAuth.currentUser.then((currentUser)=>{ */
            let uid = this.secureStorage.getItem(this.storatge_prefix + 'auid')
             let account_id = this.secureStorage.getItem(this.storatge_prefix + 'aacid')
            let access = this.secureStorage.getItem(this.storatge_prefix + 'access')
            let cid = this.secureStorage.getItem(this.storatge_prefix + 'cid')
           
          
            let creationTime = ""
             let role: User_Role = null
             if (access === 'adm') {
               role = {admin: true, readOnly: false}
             } else if(access==='usr') {
               role = {admin: false, readOnly: true}
             }
             if (uid === null || account_id === null || uid === undefined || account_id === undefined || uid === '' || account_id === '' || access === undefined || access === null || access === '') {
             
               
               this.user.pipe(take(1)).subscribe(data => {
                 if (data !== null) {
                   //console.log(data)
                   if (data.profileCompleted) {
                     this.epicFunction().then(response_device => {
                       if (response_device === 'ok') {
                         this.afs.doc(`users/${data.uid}`).update({ isDesktopDevice: this.isDesktopDevice, isMobile: this.isMobile, isTablet: this.isTablet, deviceInfo: this.deviceInfo }).then(() => {
                           resolve(null)
                           this.router.navigate(['/select/account'])
                           
                         })
                       }
                     })
                    
                   } else {
                     if(this.afAuth.auth.currentUser.emailVerified){
                       
                       this.getListAccountsOwned(data.uid).pipe(take(1)).subscribe(accounts => {
                         if (accounts.length > 0) {
                           this.router.navigate(['/accounts/setup'], {queryParams: {aacid: accounts[0].id, auid: data.uid}})
        
                         }
                       })
                     }
                  }
                 } else {
                   this.removeUserIdAndAccountId().then(remove => {
                     this.afAuth.auth.signOut().then(() => {
                 this.router.navigate(['/auth/login'])
               }).catch(e => {
                 this.router.navigate(['/auth/login'])
               })
                          
                   })
                 }
               })
      
             } else {
               
                 this.user.subscribe(data => {
                   if (data !== null) {
                     //console.log(data)
                     let deviceInfo: DeviceInfo = data.deviceInfo
                     if (data.profileCompleted) {
                       //console.log(data.uid === uid)
                        if (data.uid!==undefined && data.uid!==null){
                          this.epicFunction().then(response_device => {
                       if (response_device === 'ok') {
                         this.afs.doc(`users/${data.uid}`).update({ isDesktopDevice: this.isDesktopDevice, isMobile: this.isMobile, isTablet: this.isTablet, deviceInfo: this.deviceInfo }).then(() => {
                           this.getListAccountsOwned(data.uid).pipe(take(1)).subscribe(OWNED_ACCOUNTS => {
                         let isOwned = OWNED_ACCOUNTS.some(account=>account.id===account_id)
                         if (isOwned) {
                           this.access = {creationTime: creationTime,  user_company: data.entrepriseName, aacid: account_id, auid: uid, role: {admin: true, readOnly: false}, fromOwned: true, account: OWNED_ACCOUNTS.find(account=>account.id===account_id) , cid: cid, deviceInfo: deviceInfo, email: data.email}
                           resolve(this.access)
           
                         } else {
                           this.getListActiveLink(data.uid).pipe(take(1)).subscribe(accounts_link => {
                             if (accounts_link.length > 0) {
                               let exist = accounts_link.some(account_link => account_link.linked_account.account.id === account_id)
                               if (exist) {
                                 let currentAccountValue: number =accounts_link.find(account_link => account_link.linked_account.account.id === account_id).linked_account.account.account_value 
                                 this.searchAccount(account_id, currentAccountValue, accounts_link.find(account_link => account_link.linked_account.account.id === account_id)).then(new_link => {
                                   this.access = {creationTime: creationTime, user_company: data.entrepriseName ,aacid: account_id, auid: uid, role: role, fromOwned: false, account: new_link.linked_account.account, cid: cid, deviceInfo: deviceInfo, email: data.email}
                                  resolve(this.access)
                                 })
                                  
                               } else {
                                 this.checkIfProfileComplete()
                               }
                             } else {
                               this.checkIfProfileComplete()
                             }
                           })
                           
                         }
                         
                       })
                         })
                       }
                     })
                       
                       
                        } else {
                         this.setUserInactive(data.uid).then(()=>{
                           this.removeUserIdAndAccountId().then(remove => {
                             this.afAuth.auth.signOut().then(() => {
                this.router.navigate(['/auth/login'])
              }).catch(e => {
                this.router.navigate(['/auth/login'])
              }) 
  
                           })
                   
                         })
                     }
                     } else {
                       this.checkIfProfileComplete()
                     }
                    
                   } else {
                     this.removeUserIdAndAccountId().then(remove => {
                       console.log('remove')
                       this.afAuth.auth.signOut().then(() => {
                  this.router.navigate(['/auth/login'])
                }).catch(e => {
                  this.router.navigate(['/auth/login'])
                }) 
  
                          })
                  }
                })
                 
              
      
             }
             
 
      /*     }) */

         }else{
           resolve(null)
         }
       })
    })
   }

  checkDevicechange(device: DeviceInfo, isMobile: boolean, isTablet: boolean, isDesktopDevice: boolean):Promise<string> {
    return new Promise(resolve => {
      if (this.isMobile) {
        
      } else if (this.isTablet) {
        
      } else if (this.isDesktopDevice) {
        
        }
      })
  }
  
  checkIfProfileComplete() {
    this.user.pipe(take(1)).subscribe(data => {
      if (data !== null && data.profileCompleted) {
        ////console.log(data)
        this.epicFunction().then(response_device => {
                 if (response_device === 'ok') {
                   this.afs.doc(`users/${data.uid}`).update({ isDesktopDevice: this.isDesktopDevice, isMobile: this.isMobile, isTablet: this.isTablet, deviceInfo: this.deviceInfo }).then(() => {
                     this.router.navigate(['/select/account'])
                     
                   })
                 }
               })
      } else {
            this.getListAccountsOwned(data.uid).pipe(take(1)).subscribe(accounts => {
                      if (accounts.length > 0) {
                        this.router.navigate(['/accounts/setup'], {queryParams: {aacid: accounts[0].id, auid: data.uid}})
     
                      }
                    })
      }
    })
  }
  
  public setMessageRequest(): Promise<string> {
    return new Promise(resolve => {
      this.secureStorage.setItem(this.storatge_prefix + 'pushRequest', new Date().getTime().toString())
      resolve('ok')
    })
  }

  public getMessageRequest(): Promise<string> {
    return new Promise(resolve => {
      let id = this.secureStorage.getItem(this.storatge_prefix + 'pushRequest')
      resolve(id)
    })
    
  }

  getPresence(uid: string) {
    return this.db.object(`status/${uid}`).valueChanges();
  }

  getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }


 async setPresence(status: string) {
    const user = await this.getUser();
    if (user) {
      return this.db.object(`status/${user.uid}`).update({ status, timestamp: this.timestamp });
    }
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  updateOnUser() {
    const connection = this.db.object('.info/connected').valueChanges().pipe(
      map(connected => connected ? 'online' : 'offline')
    );

    return this.afAuth.authState.pipe(
      switchMap(user =>  user ? connection : of('offline')),
      tap(status => this.setPresence(status))
    );
  }

  updateOnDisconnect() {
    return this.afAuth.authState.pipe(
      tap(user => {
        if (user) {
          this.db.object(`status/${user.uid}`).query.ref.onDisconnect()
            .update({
              status: 'offline',
              timestamp: this.timestamp
          });
        }
      })
    );
  }

  updateOnAway() {
    document.onvisibilitychange = (e) => {

      if (document.visibilityState === 'hidden') {
        this.setPresence('away');
      } else {
        this.setPresence('online');
      }
    };
  }

  public setFirstActCustomerId(client_customer_id: number): Promise<string> {
    return new Promise(resolve => {
      this.secureStorage.setItem(this.storatge_prefix + '_act_f_c_id', client_customer_id.toString())
      resolve('ok')
    })
  }

  public getFirstActCustomerId(): Promise<{status: string, value: number}> {
    return new Promise(resolve => {
      let first_client_customer_id: number = parseInt(this.secureStorage.getItem(this.storatge_prefix + '_act_f_c_id'))
      resolve({status: 'ok', value: first_client_customer_id})
    })
  }

  public setSecondActCustomerId(client_customer_id: number): Promise<string> {
    return new Promise(resolve => {
      this.secureStorage.setItem(this.storatge_prefix + '_act_s_c_id', client_customer_id.toString())
      resolve('ok')
    })
  }

  public getSecondActCustomerId(): Promise<{status: string, value: number}> {
    return new Promise(resolve => {
      let second_client_customer_id: number = parseInt(this.secureStorage.getItem(this.storatge_prefix + '_act_s_c_id'))
      resolve({status: 'ok', value: second_client_customer_id})
    })
  }

  


  getUserClientCustomerId(): Promise<{first_client_customer_id: number, second_client_customer_id: number}>{
    return new Promise(resolve=>{
      this.user.pipe(take(1)).subscribe(data => {
        if (data !== null) {
          this.getListAccountsOwned(data.uid).pipe(take(1)).subscribe(act=>{
            if(act!==undefined && act!==null && act.length>0){
              let f = act[0].first_client_customer_id?act[0].first_client_customer_id:SERVER.FIRST_CLIENT_CUSTOMER_ID
              let s = act[0].second_client_customer_id?act[0].second_client_customer_id:SERVER.SECOND_CLIENT_CUSTOMER_ID
                this.setFirstActCustomerId(f).then((res1)=>{
                  if(res1==='ok'){
                    this.setSecondActCustomerId(s).then((res1)=>{
                      if(res1==='ok'){
                        resolve({first_client_customer_id: f, second_client_customer_id: s})
                      }else{
                        resolve(undefined)
                      }
                    }).catch((e2)=>{
                      resolve(undefined)
                    })
                  }else{
                    resolve(undefined)
                  }
                }).catch((e1)=>{
                  resolve(undefined)
                })
            }
          })
        }
      })
    })
  }
}


