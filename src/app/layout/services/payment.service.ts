import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Payment } from '../models/payment.models';
import { BIZAO_CARD_RESPONSE, BIZAO_SUCCESS, BIZAO_TOKEN_RESPONSE, PENDING_TRANSACTION } from 'src/app/utils/data';
import { SERVER } from 'src/environments/environment';


@Injectable()
export class PaymentService implements OnInit { 
    private paymentsCollection: AngularFirestoreCollection<Payment>;
    uid: string;
    currentUser: string;
    email: string;
    payment: any;
    ngOnInit() {
    
    }
    constructor(private afs: AngularFirestore, private http: HttpClient, private auth: AuthService) {
      this.auth.user.subscribe(child => {
        if (child !== null) {
                 this.uid =child.uid
      this.paymentsCollection = this.afs.collection('transactions', (ref) => ref.where('owner', '==', child.uid));
              this.currentUser = child.displayName
              this.email = child.email   
            }

    })
    
    }
prepareSavePayment(uid: string, accountId: string, accountName: string, email: string, type: string, value: number, paymentKey: string, campaign_id: number, campaign_name: string): Payment {
        var event = new Date();

        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', 'second': 'numeric' };
        var date = event.toLocaleDateString('fr-FR', options)
        const newPayment: Payment = {
          author_uid: uid,
          author_email: email,
          accountId: accountId,
          accountName: accountName,
          type: type,
          value: value,
          paymentKey: paymentKey,
          campaign_id: campaign_id,
          campaign_name: campaign_name,
          paymentDate: event,
          paymentDateString: date,
    };
    return {...newPayment};
  }
     createTransaction(uid: string, accountId: string, accountName: string, email: string,  type: string, value: number, paymentKey: string, campaign_id: number, campaign_name: string): Promise<any> {
    return new Promise(resolve => {
      this.payment = this.prepareSavePayment(uid, accountId, accountName,email, type, value, paymentKey, campaign_id, campaign_name );
      this.paymentsCollection.add(this.payment).then(added => {
        if (added) {
          resolve("ok")
          
        }
      });
    
      
    })
     }

public getPendingTransaction(uid: string, accountId: string) {
      return this.afs.collection<PENDING_TRANSACTION>('pending-transactions', (ref) => ref.where('accountId','==', accountId).where('uid','==', uid)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }
     createPendingTransaction(uid: string, accountId: string, country_code: string, token_info: BIZAO_TOKEN_RESPONSE, transaction_info: BIZAO_CARD_RESPONSE):Promise<string | null>{
       return new Promise(resolve=>{
         this.afs.collection('pending-transactions').doc(uid).set({uid: uid, accountId: accountId, country_code: country_code, auth_info: token_info, transaction_info: transaction_info}).then((value)=>{
          resolve('ok')
         }).catch((e)=>{
           console.log(e)
           resolve(null)
         })
       })
     }

    getPaymentStatus(pending_transaction: PENDING_TRANSACTION):Promise<string>{
      return new Promise(resolve=>{
        this.http.post('https://us-central1-adafri-e5ceb.cloudfunctions.net/requestBizaoPaymentStatus',{
          
            pending_transaction: pending_transaction
          
        }).pipe(take(1)).subscribe((payment_status: {body: BIZAO_SUCCESS})=>{
        console.log(payment_status)
        if(payment_status.body.status!==undefined && payment_status.body.status.toLowerCase()==='successful'){
          resolve('ok')
        }else{
          resolve('error')
        }
          
        })
      })
    }
    public getListTransaction(accountId: string) {
    
  
      return this.afs.collection<Payment>('transactions', (ref) => ref.where('accountId','==', accountId)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }

   public getSingleTransaction(uid: string, key: string) {
    
  
     return this.afs.collection<Payment>('transactions', (ref) => ref.where('uid','==', uid).where('key','==', key)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }
}