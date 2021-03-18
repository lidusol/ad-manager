import {
  Injectable,
  NgZone
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
// import * as $ from 'jquery'
/* 
import { firebase } from '@firebase/app'; */

import {
  SERVER
} from '../../environments/environment';

import {
  Observable,
  of ,
  from
} from 'rxjs';

import firebase from 'firebase/app';
import 'firebase/auth';
import {
  switchMap,
  startWith,
  tap,
  filter,
  map
} from 'rxjs/operators';


import {
  MatDialog
} from '@angular/material/dialog';

import {
  resolve
} from 'url';
import {
  AccountsService
} from '../accounts/accounts.service';
import {
  LinkedUser,
  Account,
  Linked_ADAFRI_ACCOUNT,
  User,
  FirebaseErrors,
  CREDENTIALS_AUTH_FLOW
} from '../utils/data';
import {
  HttpClient
} from '@angular/common/http';



interface LOGIN_RESPONSE {
  user ? : firebase.User,
    additionalUserInfo ? : firebase.auth.AdditionalUserInfo
}

interface NotificationAccountValue {
  uid: string;
  notification ? : any;
}

@Injectable()
export class AuthService {
  user: Observable < User | null > ;
  notificationAccount: Observable < NotificationAccountValue | null >
    private accountsService: AccountsService
  loginResponse = ""

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    public ngZone: NgZone,
    public dialog: MatDialog,
    private http: HttpClient


  ) {

    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc < User > (`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })

    );


    this.notificationAccount = this.afAuth.authState.pipe(
      switchMap(amount => {
        if (amount) {
          return this.afs.doc < NotificationAccountValue > (`notifications_account_value/${amount.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.getUserCredential()




  }
  creationAccountDate: Date = null

  setUserActive() {
    this.user.subscribe(data => {
      if (data !== undefined && data !== null) {
        this.afs.collection('online-users').doc(data.uid).set({
          user: data,
          online: true
        }).then((saved) => {

        })

      }
    })
  }
  setUserInactive(): Promise < string > {
    return new Promise(resolve => {
      this.user.subscribe(data => {
        if (data !== undefined && data !== null) {
          this.afs.collection('online-users').doc(data.uid).set({
            user: data,
            online: false
          }).then((saved) => {
            resolve('ok')
          })

        } else {
          resolve('ok')
        }
      })

    })
  }
  getAuth() {
    return this.afAuth
  }
  /**
   * Register user with credentials
   * @param  {string} email
   * @param  {string} password
   * @param  {string} firstName
   * @param  {string} lastName
   */
  emailSignUp(email: string, password: string, firstName: string, lastName: string): Promise < LOGIN_RESPONSE | any > {
    return new Promise(resolve => {
      this.afAuth
        .auth.createUserWithEmailAndPassword(email, password)
        .then(credential => {
          if (credential !== null || credential !== undefined) {
            if (credential.additionalUserInfo.isNewUser) {
              this.updateUserData(credential.user, firstName, lastName, credential.user.displayName, true).then(res => {
                if (res === "ok") {
                  this.SendVerificationMail().then(sended => {
                    if (sended === "ok") {
                      resolve({
                        user: credential.user,
                        additionalUserInfo: credential.additionalUserInfo
                      })
                    }
                  })
                } else {
                  resolve(null)
                }
              }).catch(e => {
                this.afAuth.auth.currentUser.delete().then(() => {
                  this.handleError(e)
                  resolve(null)
                }).catch(err => {
                  this.handleError(e)
                  resolve(null)
                })
              })
            } else {
              this.setUserInactive()
              this.afAuth.auth.signOut()
              resolve(null)
            }
          }

        })
        .catch(error => {
          this.handleError(error)
          resolve(error)
        });
    })
  }


  /**
   * User login with credentials
   * @param  {string} email
   * @param  {string} password
   */
  emailLogin(email: string, password: string): Promise < LOGIN_RESPONSE | any > {
    return new Promise(resolve => {
      this.afAuth
        .auth.signInWithEmailAndPassword(email, password)
        .then(credential => {
          resolve({
            user: credential.user,
            additionalUserInfo: credential.additionalUserInfo
          })
        }).catch(error => {
          this.handleError(error).then(res => {
            resolve(res)
          })
        });
    })
  }

  /**
   * Trigger login with google button
   */
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return this.oAuthLogin(provider);
  }
  /**
   * Trigger signup with google nutton
   */
  googleSignUp() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return this.oAuthSignup(provider);
  }
  /**
   * This metthod allow user to get a login popup and save the credentials response on user document if its new user
   * 
   * @param  {any} provider
   */
  public oAuthLogin(provider: any): Promise < LOGIN_RESPONSE | any > {
    return new Promise(async (resolve) => {
      await this.afAuth.auth.signInWithPopup(provider)
        .then(credential => {
          if (credential !== null || credential !== undefined) {
            if (credential.additionalUserInfo.isNewUser) {
              this.updateUserData(credential.user, "", "", credential.user.displayName, false).then(res => {
                if (res === "ok") {
                  resolve({
                    user: credential.user,
                    additionalUserInfo: credential.additionalUserInfo
                  })
                } else {
                  resolve({
                    user: credential.user,
                    additionalUserInfo: credential.additionalUserInfo
                  })
                }
              });
            } else {
              resolve({
                user: credential.user,
                additionalUserInfo: credential.additionalUserInfo
              })
            }
          }
        })
        .catch(error => resolve(null));
    })
  }
  /**
   * This method allow user to signup with goole button in popup and check if this user is already registered or not
   * @param  {any} provider
   */
  public oAuthSignup(provider: any): Promise < LOGIN_RESPONSE | any > {
    return new Promise(async (resolve) => {
      await this.afAuth
        .auth.signInWithPopup(provider)
        .then(credential => {
          if (credential !== null || credential !== undefined) {
            this.getUserEmail(credential.user.email).then(response => {
              if (response.message === "not ok") {
                this.setUserInactive()
                this.afAuth.auth.signOut()
                resolve({
                  message: "Un compte utilisant ce mail existe déjà."
                })
              } else if (response.message === "ok") {
                if (credential.additionalUserInfo.isNewUser) {
                  this.updateUserData(credential.user, "", "", credential.user.displayName, false).then(res => {
                    if (res === "ok") {
                      resolve({
                        user: credential.user,
                        additionalUserInfo: credential.additionalUserInfo
                      })
                    } else {
                      resolve({
                        user: credential.user,
                        additionalUserInfo: credential.additionalUserInfo
                      })
                    }
                  });
                } else {
                  resolve({
                    user: credential.user,
                    additionalUserInfo: credential.additionalUserInfo
                  })
                }
              } else {
                resolve({
                  message: "Oups une erreur est survenue veuillez réessayer."
                })
              }
            })

          }
        })
        .catch(error => resolve(null));
    })
  }


  getUserEmail(email: string): Promise < {
    message: string
  } > {
    return new Promise(resolve => {
      this.http.post < {
        message: string
      } > ("https://us-central1-adafri-e5ceb.cloudfunctions.net/checkUser", {
        email: email
      }).subscribe(res => {
        resolve(res)
      }, err => {
        resolve({
          message: 'Une erreur est survenue'
        })
      })


    })

  }




  public getUserExist(email: string) {
    return this.afs.collection < User > ('users', (ref) => ref.where('email', '==', email)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return {
            id: a.payload.doc.id,
            ...data
          };
        });
      })
    );

  }
  /**
   * @param  {any} user
   * @param  {string} nom
   * @param  {string} prenom
   * @param  {string} username
   * @param  {string} entrepriseName
   * @param  {string} addresse
   * @param  {string} telephone
   * @param  {string} postal
   * @param  {boolean} connectionType
   * This metthod update user data on firestore document
   */
  public updateUserData(user: any, nom: string, prenom: string, username: string, connectionType: boolean): Promise < string > {
    return new Promise(resolve => {
      const userRef: AngularFirestoreDocument < User > = this.afs.doc(
        `users/${user.uid}`
      );
      const data: User = {
        uid: user.uid,
        first_name: nom,
        last_name: prenom,
        email: user.providerData[0].email || null,
        displayName: user.displayName || username,
        photoURL: user.photoURL || 'assets/img/images/user.png',
        account_value: 0,
        paymentKey: "",
        entrepriseName: "",
        addresse: "",
        telephone: user.providerData[0].phoneNumber,
        postal: "",
        user_type: "",
        hasApprouvedPolicy: false,
        authorizedPush: false,
        isConnectWithMailAndPassword: connectionType,
        linkedAccounts: [],
        credentials: [],
        accounts: [],
        auth_code: "",
        invitedAccounts: [],
        ownedAccounts: [],
        token: "",
        profileCompleted: false
      };
      userRef.set(data);
      resolve("ok")
    })
  }
  // githubLogin() {
  //   const provider = new firebase.auth.GithubAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  // facebookLogin() {
  //   const provider = new firebase.auth.FacebookAuthProvider();
  //   provider.addScope('manage_pages')
  //   return this.oAuthLogin(provider);
  // }

  // twitterLogin() {
  //   const provider = new firebase.auth.TwitterAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  getRefreshToken(): Promise < string > {
    return new Promise(resolve => {

      this.afAuth.user.subscribe(data => {

        resolve(data.refreshToken)
      })
    })
  }




  getCreationAccountTime(): Date {
    let date = new Date(this.afAuth.auth.currentUser.metadata.creationTime)
    date.setHours(0, 0, 0, 0)
    return date
  }




  SendVerificationMail(): Promise < string > {
    return new Promise(resolve => {
      this.afAuth.auth.currentUser.sendEmailVerification({
          url: SERVER.url_redirect + "/auth/reset"
        })
        .then(() => {
          resolve('ok')
        }).catch((e) => {
          console.log(e)
          resolve("error")
        })
    })

  }

  resetPasswordInit(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(
      email, {
        url: SERVER.url_redirect
      });
  }




  checkIfEmailVerified(): Promise < boolean > {
    return new Promise((resolve, reject) => {
      this.user.subscribe(data => {
        if (data.isConnectWithMailAndPassword) {
          resolve(this.afAuth.auth.currentUser.emailVerified)
        } else {
          resolve(true)
        }
      })
    })
  }

  public currentUser: User;
  getUserCredential(): Promise < User > {
    return new Promise(resolve => {
      this.user.subscribe(data => {
        if (data !== null) {
          this.currentUser = data
          resolve(data)
        } else {
          resolve(null)
        }
      })

    })

  }



  sendResetPasswordLink(email: string): Promise < string > {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.sendPasswordResetEmail(email, {
        url: SERVER.url_redirect + "/auth/reset"
      }).then(() => {
        resolve('ok')
      }).catch((e) => {
        reject('err')
      })

    })
  }
  confirmEmail(code: any): Promise < string > {
    return new Promise(resolve => {
      this.afAuth.auth.applyActionCode(code).then((filled) => {
        resolve('ok')
      })
    })
  }
  confirmResetPassword(code: any, password: string): Promise < string > {
    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .confirmPasswordReset(code, password)
        .then(() => {
          resolve('ok')
        })
        .catch(err => {
          const errorMessage = FirebaseErrors.Parse(err.code);
          resolve(errorMessage)
        });

    })
  }

  afterSignIn() {
    return this.router.navigate(['/']);
  }


  signOut() {
    this.setUserInactive()
    setTimeout(() => {
      this.afAuth.auth.signOut().then(() => {
        window.location.reload()

      });

    }, 1000);
  }
  signOutWithoutReload() {
    this.setUserInactive()
    setTimeout(() => {
      this.afAuth.auth.signOut()

    }, 1000);
  }

  // If error, console log and notify user
  private handleError(error: Error): Promise < any > {

    return new Promise(resolve => {

      var error_to_show = ""
      if (error.message == "There is no user record corresponding to this identifier. The user may have been deleted.") {
        error_to_show = "Cet utilisateur n'éxiste pas"
      } else if (error.message == "The password is invalid or the user does not have a password.") {
        error_to_show = "Indentifiants invalides"
      } else if (error.message == "The email address is badly formatted.") {
        error_to_show = "Adresse email invalide"
      } else if (error.message == "Password should be at least 6 characters") {
        error_to_show = "Mot de passe invalide"
      } else if (error.message == "The email address is already in use by another account.") {
        error_to_show = "Adresse email déjà utilisée"
      } else if (error.message == "Too many unsuccessful login attempts. Please try again later.") {
        error_to_show = "Trop de tentatives de connexion infructueuses. Veuillez réessayer plus tard."
      } else {
        error_to_show = "Une erreur s'est produite"
      }
      resolve(error_to_show)
    })
  }

  // Sets user data to firestore after succesful login





  getAuthFlowUrl(email: string): Promise < string > {
    return new Promise(resolve => {
      this.http.post(SERVER.url + "/requestOAuth2URL", {
          email: email,
          redirect_uri: window.location.href,
        })
        .subscribe(
          res => {
            //////console.log(res)
            if (res.toString().length > 0) {
              /* window.open(res[0]['url'], '_blank'); */
              window.open(res[0]['url'], '_self');
            }

          },
          err => {
            alert('une erreur est survenue')
          }
        );

    })
  }

  public getAllUsers() {
    return this.afs.collection < User > ('users').snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();

          return {
            id: a.payload.doc.id,
            ...data,
          };
        });
      })
    );

  }
  getAuthFlowCredentials(aacid: string, code: string): Promise < CREDENTIALS_AUTH_FLOW[] > {
    return new Promise(resolve => {
      this.http.post < CREDENTIALS_AUTH_FLOW[] > (SERVER.url + "/getCredentials", {
          code: code,
        })
        .subscribe(
          res => {
            //console.log(res)
            if (res[0] !== undefined && res[0].refresh_token !== undefined && res[0].refresh_token !== null) {
              this.getUser(aacid).update({
                credentials: res
              }).then(() => {
                resolve(res)
              })
            } else {
              resolve(null)
            }

          },
          err => {
            alert('une erreur est survenue')
          }
        );

    })
  }

  getUser(id: string) {
    return this.afs.doc < any > (`users/${id}`);
  }

  updateUser(id: string, data: any): Promise < any > {
    return new Promise(resolve => {
      this.getUser(id).update(data)
      resolve('ok')
    })
  }

  getNotification(id: string) {
    return this.afs.doc < any > (`notifications_account_value/${id}`);
  }

  updateNotification(id: string, data: any) {
    return this.getNotification(id).update(data);
  }
  public updateValueAccount(uid: any, email, account_value: any): Promise < any > {
    return new Promise(resolve => {
      const userRef: AngularFirestoreDocument < User > = this.afs.doc(
        `users/${uid}`
      );
      const data: User = {
        uid: uid,
        account_value: account_value,
        email: email,

      };
      const notificationRef: AngularFirestoreDocument < User > = this.afs.doc(
        `notifications_account_value/${uid}`
      );
      const data_notification: NotificationAccountValue = {
        uid: uid,
        notification: ""
      };
      userRef.set(data).then(() => {
        notificationRef.set(data_notification).then(() => {
          resolve("ok")
        })

      })
    })

  }

  getNotificationData(user_id: any) {
    return this.afs.collection < any > ('notifications_account_value', (ref) => ref.where('uid', '==', `${user_id}`)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return {
            id: a.payload.doc.id,
            ...data
          };
        });
      })
    );
  }

  // FacebookAuth() {
  //   const provider = new firebase.auth.FacebookAuthProvider();
  //   provider.addScope('manage_pages')
  //   return this.AuthLogin(provider);
  // }


}
