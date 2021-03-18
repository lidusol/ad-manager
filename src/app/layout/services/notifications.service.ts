import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import { Notifications } from '../models/notifications.models';
import { AuthService } from 'src/app/auth/auth.service';
import { Notifications_Accounts_Link, Link } from 'src/app/utils/data';
import { map } from 'rxjs/operators';


@Injectable()
export class NotificationsService implements OnInit { 
  private notificationsCollection: AngularFirestoreCollection<Notifications>;
  private notificationsLink: AngularFirestoreCollection<Notifications_Accounts_Link>;
    uid: string;
    currentUser: string;
    email: string;
  notification: any;
  notificationLink: Notifications_Accounts_Link;
    ngOnInit() {
    
    }
  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.notificationsLink = this.afs.collection<Notifications>('notifications_link_accounts');
    if (this.auth.user !== undefined && this.auth.user !== null) {
      this.auth.user.forEach(child => {
        if (child !== null) {
          this.uid =child.uid
          this.notificationsCollection = this.afs.collection<Notifications>('notifications', (ref) => ref.where('owner', '==', child.uid));
          this.currentUser = child.displayName
          this.email = child.email
                
              }
      })
      
    }
    
  }
  getNotifLinkAct(id: string) {
    return this.notificationsLink.doc(id)
  }
    prepareSaveNotification(uid: string, type: string, content: string, campaign_id: number, campaign_name: string): Notifications {
        const newNotification = {
          owner: uid,
          type: type,
          content: content,
          campaign_id: campaign_id,
          campaign_name: campaign_name,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          isArchived: false,
    };
    return {...newNotification};
  }
      createNotification(uid: string,  type: string, content: string, campaign_id: number, campaign_name: string): Promise<string> {
    return new Promise(resolve => {
      this.notification = this.prepareSaveNotification(uid, type, content, campaign_id, campaign_name );
      const docRef = this.notificationsCollection.add(this.notification);
    
      resolve("ok")
      
    })
  }

    prepareSaveNotificationLinkAccount(uid: string, content: string, link: Link): Notifications_Accounts_Link {
        const newNotificationLink: Notifications_Accounts_Link = {
          owner: uid,
          content: content,
          isRead: false,
          link: link,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          isArchived: false,
    };
    return {...newNotificationLink};
    }
  
   createNotificationLink(uid: string, content: string, link: Link): Promise<Notifications_Accounts_Link> {
    return new Promise(resolve => {
      this.notificationLink = this.prepareSaveNotificationLinkAccount(uid, content, link);
      const docRef = this.notificationsLink.add(this.notificationLink);
      docRef.then(link_notification => {
        const newNotificationLink: Notifications_Accounts_Link = {
          id: link_notification.id,
          owner: this.notificationLink.owner,
          content: this.notificationLink.content,
          isRead: this.notificationLink.isRead,
          link: this.notificationLink.link,
          createdAt: this.notificationLink.createdAt,
          isArchived: this.notificationLink.isArchived,
        };
        resolve(newNotificationLink)
      }).catch((e) => {
        resolve(null)
      })
    
      
      
    })
   }
  
   public getListNotifications(uid: string) {
    ////console.log(uid)
    return this.afs.collection<Link>('notifications_link_accounts', (ref) => ref.where('owner', '==', `${uid}`).where('isRead', '==', false)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }
}