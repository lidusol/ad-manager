import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { SERVER } from 'src/environments/environment';
import { User, User_Role, LinkedUser , Account, Link, Linked_ADAFRI_ACCOUNT, DATE_OPTIONS_WITH_FULL_TIME, CREDENTIALS_AUTH_FLOW} from '../utils/data';
import { map } from 'rxjs/operators';


@Injectable()
export class AccountsService {
  private user;
  public account: any = []
  public accountsLinked: any = []
  private accountData: Account
  private linkData: Link
  public accountsLink: AngularFirestoreCollection<Link>;
   public accountsCollection: AngularFirestoreCollection<Account>;
  constructor(private auth: AuthService, private afs: AngularFirestore, private http: HttpClient) { 
    
    this.accountsCollection = this.afs.collection<Account>('accounts');
    this.accountsLink = this.afs.collection<Link>('accounts_link');
  }


    getAdwordsAccountsFirebase():Promise<string>{
      return new Promise(resolve => {
      this.auth.getUserCredential().then(cred => {
      if (cred !== null && cred.accounts!== undefined) {
        this.account = cred.accounts
        resolve('ok')
      } else {
        this.account = []
      }
    })
   })
    }
    getAdwordsAccountsLinkedFirebase():Promise<string>{
      return new Promise(resolve => {
      this.auth.getUserCredential().then(cred => {
      if (cred !== null && cred.linkedAccounts!== undefined) {
        this.accountsLinked = cred.linkedAccounts
        resolve('ok')
      } else {
        this.accountsLinked = []
        resolve('ok')
      }
    })
   })
  }


  getAdwordsAccessAccounts(): Promise<string> {
    return new Promise(resolve => {
      this.auth.getUserCredential().then(cred => {
        if (cred !== null) {
          
          this.http.get(SERVER.url+"/requestOAuth2URL?email="+this.auth.currentUser.email)
            .subscribe(
              res => {
                ////console.log(res)
                if (res.toString().length > 0) {
                /* window.open(res[0]['url'], '_blank'); */
                  window.open(res[0]['url'], '_self');
                }
                
              },
              err => {
               alert('une erreur est survenue')
              }
            );
        }
      })
      
    })
  }

  getAdwordsAccounts(): Promise<string> {
    return new Promise(resolve => {
      this.auth.getUserCredential().then(cred => {
        if (cred !== null) {
          
          this.http.get(SERVER.url+"/getAccounts?refresh_token="+this.auth.currentUser.credentials[0].refresh_token)
            .subscribe(
              res => {
                if (res.toString().length > 0) {
                  ////console.log(res)
                    this.auth.updateUser(this.auth.currentUser.uid, { accounts:  res['customer'] }).then(res => {
                    if (res === "ok") {
                      resolve('ok')
                    }
                  })
                  
                }
                
              },
              err => {
               alert('une erreur est survenue')
              }
            );
        }
      })
      
    })
  }
  getAdwordsUserCredentials(): Promise<string> {
    return new Promise(resolve => {
       this.auth.getUserCredential().then(cred => {
      if (cred !== null) {
        
        this.http.get(SERVER.url+"/getCredentials?code="+this.auth.currentUser.auth_code)
          .subscribe(
            res => {
              if (res.toString().length > 0) {
                this.auth.updateUser(this.auth.currentUser.uid, { credentials: res }).then(res_update_user => {
                  if (res_update_user === "ok") {
                    resolve('ok')
                  }
                })
              }
              
            },
            err => {
             alert('une erreur est survenue')
            }
          );
      }
    })
     })
    
  }

   sendInvitation(customerId: number): Promise<string> {
    return new Promise(resolve => {
       this.auth.getUserCredential().then(cred => {
      if (cred !== null) {
        
        this.http.get(SERVER.url+"/requestLinkFromManager?customerId="+customerId)
          .subscribe(
            res => {
              if (res.toString().length > 0) {
                ////console.log(res)
                resolve('ok')
               /*  this.auth.updateUser(this.auth.currentUser.uid, { credentials: res['result'] }).then(res_update_user => {
                  if (res_update_user === "ok") {
                    resolve('ok')
                  }
                }) */
              }
              
            },
            err => {
              resolve('error')
             alert('une erreur est survenue')
            }
          );
      }
    })
     })
    
   }
  
  saveLinkedAccount(account): Promise<string> {
    ////console.log(account)
    return new Promise(resolve => {
      this.auth.getUserCredential().then(cred => {
      if (cred !== null) {
        if (cred.linkedAccounts === undefined) {
          let init = []
          init.push(account)
          ////console.log(init)
          this.auth.updateUser(cred.uid, {linkedAccounts: init }).then(res_update_user => {
            if (res_update_user === "ok") {
              resolve('ok')
            }
          }).catch((e) => {
            resolve('error')
          })
          
        } else {
          let new_accounts_links = cred.linkedAccounts.push(account)
          this.auth.updateUser(cred.uid, { linkedAccounts: new_accounts_links }).then(res_update_user => {
            if (res_update_user === "ok") {
              resolve('ok')
            }
          }).catch((e) => {
            resolve('error')
          })
        }
      }
    })
    })
    
  }
  
    acceptInvitation(customerId: number): Promise<string> {
    return new Promise(resolve => {
       this.auth.getUserCredential().then(cred => {
      if (cred !== null) {
        
        this.http.get(SERVER.url+"/acceptLinkFromCLient?customerId="+customerId+"&refresh_token="+cred.credentials[0].refresh_token)
          .subscribe(
            res => {
              if (res.toString().length > 0) {
                ////console.log(res)
                resolve('ok')
               /*  this.auth.updateUser(this.auth.currentUser.uid, { credentials: res['result'] }).then(res_update_user => {
                  if (res_update_user === "ok") {
                    resolve('ok')
                  }
                }) */
              }
              
            },
            err => {
              resolve('error')
             alert('une erreur est survenue')
            }
          );
      }
    })
     })
    
    }
  
  cancelLink(customerId: number): Promise<string> {
    return new Promise(resolve => {
       this.auth.getUserCredential().then(cred => {
      if (cred !== null) {
        
        this.http.get(SERVER.url+"/cancelLinkFromCLient?customerId="+customerId+"&refresh_token="+cred.credentials[0].refresh_token)
          .subscribe(
            res => {
              if (res.toString().length > 0) {
                ////console.log(res)
                let accounts = cred.linkedAccounts
                for (var i = 0; i < accounts.length; i++){
                  if (accounts[i].customerId === customerId) {
                    accounts.splice(accounts[i], 1)
                    this.auth.updateUser(cred.uid, { linkedAccounts: accounts }).then(res_update_user => {
                      if (res_update_user === 'ok') {
                        resolve('ok')
                        
                      }
                      
                    }).catch((e) => {
                      resolve('error')
                    })
                  }
                }
               /*  this.auth.updateUser(this.auth.currentUser.uid, { credentials: res['result'] }).then(res_update_user => {
                  if (res_update_user === "ok") {
                    resolve('ok')
                  }
                }) */
              }
              
            },
            err => {
              resolve('error')
             alert('une erreur est survenue')
            }
          );
      }
    })
     })
    
   }
  updateUserAuthCode(auth_code: string): Promise<string> {
    return new Promise(resolve => {
      this.auth.getUserCredential().then(cred => {
        if (cred !== null) {
       
            this.auth.updateUser(this.auth.currentUser.uid, { auth_code: auth_code }).then(res_update => {
               if (res_update === "ok") {
                 resolve('ok')
               }
             })
            
         
      }
    })
      })
  }


  createAccount(uid: string, email: string): Promise<Account> {
    return new Promise(resolve => {
      this.accountData = this.prepareSaveAccount(uid, email);
      const docRef = this.accountsCollection.add(this.accountData);
      docRef
        .then((add) => {
          const newAccount: Account = {
            id: add.id,
            name: this.accountData.name, 
            owner: uid,
            creationDate: this.accountData.creationDate,
            status: this.accountData.status,
            account_value: this.accountData.account_value,
            creationDateString: this.accountData.creationDateString,
            owner_email: this.accountData.owner_email,
            totalClics: this.accountData.totalClics,
            totalCosts: this.accountData.totalCosts,
            totalImpressions: this.accountData.totalImpressions,
          };
          resolve(newAccount)
          
        })
        .catch((e) => {
          ////console.log(e)
          resolve(null)
        })
        
      
    })
  }

  

  prepareSaveAccount(uid: string, email: string): Account {
    const newAccount: Account = {
      name: 'adafri-'+ new Date().getTime().toString(), 
      owner: uid,
      creationDate: new Date().getTime(),
      status: 'ENABLED',
      account_value: 0,
      owner_email: email,
      totalClics: 0,
      totalCosts: 0,
      totalImpressions: 0,
      creationDateString: new Date().toLocaleDateString('fr-FR', DATE_OPTIONS_WITH_FULL_TIME),
      usedPackTest: false,
    };
    return { ...newAccount };
  }

    public getListAccounts(uid: string) {
      //console.log(uid)
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
  public getListLink(uid: string) {
    ////////console.log(uid)
    return this.afs.collection<Link>('accounts_link', (ref) => ref.where('owner', '==', `${uid}`).where('status', '==', 'PENDING')).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }

  
  public getListPendingLink(uid: string) {
    ////////console.log(uid)
    return this.afs.collection<Link>('accounts_link', (ref) => ref.where('target', '==', `${uid}`).where('status', '==', 'PENDING')).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
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

   public getListOwnedActiveLink(uid: string) {
    ////////console.log(uid)
    return this.afs.collection<Link>('accounts_link', (ref) => ref.where('owner', '==', `${uid}`).where('status', '==', 'ACTIVE')).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }
  
  getAct(id: string) {
    return this.afs.doc<Account>(`accounts/${id}`) ;
  }

  getLinkAct(id: string) {
    return this.afs.doc<Link>(`accounts_link/${id}`);
  }
   updateAccount(id: string, data: any) :Promise<any>{
     return new Promise(resolve => {
       this.getAct(id).update(data)
       //////console.log(id)
       //////console.log(data)
         resolve('ok')
         
      
    })
   }
  
  updateLinkAccount(id: string, data: any) :Promise<string>{
     return new Promise(resolve => {
       this.getLinkAct(id).update(data).then(() => {
         resolve('ok')
         
       }).catch((e) => {
         resolve('error')
       })
         
      
    })
  }
  
  acceptLink(id: string): Promise<string>{
    return new Promise(resolve => {
      let linkDateString = new Date().toLocaleDateString('fr-FR', DATE_OPTIONS_WITH_FULL_TIME)
      this.updateLinkAccount(id, { status: "ACTIVE", linkDateString: linkDateString, linkDate: new Date().getTime() }).then(update => {
        if (update === "ok") {
          resolve('ok')
        } else {
          resolve('error')
        }
      })
    })
  }

  disableLink(id: string): Promise<string>{
    return new Promise(resolve => {
      this.getLinkAct(id).delete().then(() => {
        resolve('ok')
      }).catch((e)=>{
        resolve('error')
      })
      /* this.updateLinkAccount(id, { status: "DISABLED" }).then(update => {
        if (update === "ok") {
          resolve('ok')
        } else {
          resolve('error')
        }
      }) */
    })
  }

  rejectLink(id: string): Promise<string>{
    return new Promise(resolve => {
      this.updateAccount(id, { status: "REJECTED" }).then(update => {
        if (update === "ok") {
          resolve('ok')
        } else {
          resolve('error')
        }
      })
    })
  }
  
   createAccountLink(owner: string, owner_email: string,  target: string, target_email: string,  statusLink: string, linked_account: Linked_ADAFRI_ACCOUNT): Promise<Link> {
    return new Promise(resolve => {
      this.linkData = this.prepareSaveAccountLink(owner, owner_email, target, target_email,  statusLink, linked_account);
      const docRef = this.accountsLink.add(this.linkData);
      docRef
        .then((link) => {
          const newLink: Link = {
            id: link.id,
            owner: owner,
            owner_email: owner_email,
            target: target,
            target_email: target_email,
            status: this.linkData.status,
            linked_account: this.linkData.linked_account,
            linkDate: this.linkData.linkDate,
            linkDateString: this.linkData.linkDateString
          };
          resolve(newLink)
          
        })
        .catch((e) => {
          ////console.log(e)
          resolve(null)
        })
        
      
    })
  }

  prepareSaveAccountLink(owner: string, owner_email: string,  target: string, target_email: string, statusLink: string, linked_account: Linked_ADAFRI_ACCOUNT): Link {
    const newAccountLink: Link = {
      owner: owner,
      owner_email: owner_email,
      target: target,
      target_email: target_email,
      status: statusLink,
      linked_account: linked_account,
      linkDate: 0,
      linkDateString: ""
    };
    return { ...newAccountLink };
  }

  sendLinkInvitation(): Promise<string>{
    return new Promise(resolve => {
      
    })
  }
}
