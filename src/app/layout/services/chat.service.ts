import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { User } from 'src/app/utils/data';
import { SERVER } from 'src/environments/environment';
export interface UploadedImages{
	url: string;
}

export interface Chat{
	id?: string;
	conversations?: {
		from?: string;
		destination?: string;
		messages?: {
			photo: string;
			senderID?: string;
			messageBody?: string;
			senderName?: string;
			images?: {url: string}[];
			timeStamp?: number;
		}[],
		meta_data?: {
			agent?:{
				name: string;
				new: boolean;
			},
			user?:{
				new: boolean;
			}
		}
		
	},
	timeStamp?: number;

}
@Injectable()
export class ChatService {
	constructor(private db: AngularFireDatabase, private http: HttpClient) {}
	uploadImageStorage(files: File[]): Promise<UploadedImages[]>{
		return new Promise(resolve=>{
			//console.log(files)
			let results: UploadedImages[] = []
			files.forEach((file, index)=>{
				let formData = new FormData()
				formData.append('data',file)
				//console.log(formData.get('data'))
				this.http.post<UploadedImages[]>(SERVER.url+'/uploadImageStorage', formData).subscribe(res=>{
					//console.log(res)
					if(res.length===0){
						if(files.length-1===index){
							if(results.length>0){
								resolve(results)
							}else{
								resolve(null)
							}

						}
					}else{
						results.push(res[0])
						if(files.length-1===index){
							if(results.length>0){
								resolve(results)
							}else{
								resolve(null)
							}

						}
	
					}
				},err=>{
					//console.log(err)
					if(files.length-1===index){
						if(results.length>0){
							resolve(results)
						}else{
							resolve(null)
						}

					}
				})

			})
		})
	}


	getMessagesList() {
		return this.db.list('Chat', ref => {
			return ref.orderByChild('timeStamp');
    }).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data: any = a.payload.val();

          return { id: a.key, ...data };
        });
      })
    );;
	}

	getMessages(uid: string) {
		return this.db
			.list('Chat/' + uid + '/conversations/messages', ref => {
				return ref.orderByChild('timeStamp');
			})
			.snapshotChanges().pipe(
				map((actions) => {
				  return actions.map((a) => {
					const data: any = a.payload.val();
		  
					return { id: a.key, ...data , ref: a.payload.ref};
				  });
				})
			  );
	}

	deleteChat(ref: string):Promise<string>{
		return new Promise(resolve=>{
			let obj = this.db
			.object(ref)
			obj.remove().then(()=>{
				resolve('ok')
			}).catch((e)=>{
				//console.log(e)
				resolve('error')
			})

		})
	}

	getMessagesId(userID) {
		return this.db.object('Chat/' + userID + '/conversations/messages').valueChanges();
	}

	getUsersList(firebaseIds) {
		return this.http.post('/users/search', { firebaseIds });
	}

	sendMessage(user: User, message, chatID: User, images: {url: string}[], selectedMessage: any) {
		const messageData = {
      		photo: user.photoURL,
			senderID: user.uid,
			destination: chatID.uid,
			messageBody: message,
			senderName: user.email,
			images: images,
			timeStamp: new Date().getTime()
		};
		const agentMeta = {
			name: user.email,
			new: true
		};
		const userMeta = {
			new: false
		};
		//console.log(selectedMessage)
		if(selectedMessage===null || selectedMessage===''){
			this.db.list(`Chat/${user.uid}/conversations/messages`).push(messageData);
			this.db.database.ref(`Chat/${user.uid}/conversations`).update({from: user.uid, destination: chatID.uid});
			this.db.database.ref(`Chat/${user.uid}/meta-data/agent`).update(agentMeta);
			this.db.database.ref(`Chat/${user.uid}/meta-data/user`).update(userMeta);
			this.db.database.ref(`Chat/${user.uid}`).update({timeStamp: new Date().getTime()});

		}else{
			this.db.list(`Chat/${user.uid}/conversations/messages`).push(messageData);
			this.db.database.ref(`Chat/${user.uid}`).update({timeStamp: new Date().getTime()});
		}
	}

	endConversation(chatID) {
		const agentMeta = {
			name: '',
			new: false
		};
		const userMeta = {
			new: false
		};
		this.db.database.ref(`Chat/${chatID}/meta-data/agent`).update(agentMeta);
		this.db.database.ref(`Chat/${chatID}/meta-data/user`).update(userMeta);
	}
}
