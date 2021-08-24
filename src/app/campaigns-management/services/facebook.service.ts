import { Injectable } from '@angular/core';
import { Facebook } from '../models/facebook.models';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FacebookService {

  constructor(private http: HttpClient, public afs: AngularFirestore,) { }

  public getListCampaign(uid: string, accountId: string) {
    return this.afs.collection<Facebook>('adwords-facebook', (ref) => ref.where('owner', '==', uid).where('accountId', '==', accountId).where('isArchived', '==', false).where('isExpress', '==', true)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();

          return { id: a.payload.doc.id, ...data };
        });
      })
    );

  }

}
