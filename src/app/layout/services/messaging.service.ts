import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore';
import { SERVER } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable()
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireDB: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging, private http: HttpClient) {
    /* this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
   
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    ) */
     this.receiveMessage()
  }

  /**
   * update token in firebase database
   * 
   * @param userId userId as a key 
   * @param token token as a value
   */
  updateToken(userId, last_tokens, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = {};
        data[userId] = token
        
        this.angularFireDB.collection('users').doc(userId).update({ token: [...last_tokens, ...[token]], authorizedPush: true }).then(() => {
          this.createMessage(token, 'Notifications autorisées avec succès !').then(msg => {
            if (msg === "ok") {
              window.location.reload()
            } else {
              window.location.reload()
            }
          })
          /* window.location.reload() */
        })
      })
  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  requestPermission(userId, tokens) {
    
 
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        if (token) {
          
          this.updateToken(userId, tokens, token);
          
        }
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */

  sendMessage() {
    
  }
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        this.currentMessage.next(payload);
      })
  }

   createAuthorizationHeader(headers:Headers) {
    headers.append('Authorization', `Bearer ${SERVER.PRIVATE_KEY_WEB_PUSH}`); 
  }

  createMessage(token: string, content: string): Promise<string> {
    return new Promise(resolve => {
      //console.log(token)
        var message = JSON.stringify({"data":{"token":token, "content": content}});
         this.http.post(
          'https://us-central1-adafri-e5ceb.cloudfunctions.net/sendMessage', message).subscribe(
            res => {
              if (res['success'] !== undefined) {
                resolve('ok')
                
              } else {
                  resolve('error')
              }
           },
            err => {
        
    resolve('error')
           }
          )
        
      
   
    })
      }
}