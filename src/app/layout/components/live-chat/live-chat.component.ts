import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User, User_Role } from 'src/app/utils/data';
import { ChatService } from '../../services/chat.service';
import { LocalStorageService } from '../../services/local-storage.service';


@Component({
	selector: 'adf-live-chat',
	templateUrl: './live-chat.component.html',
	styleUrls: ['./live-chat.component.scss']
})
export class LiveChatComponent implements OnInit {
	toggled: boolean = false;
	message: string = '';

	handleSelection(event) {
		////console.log(event.char);
		this.messageControl.setValue(this.messageControl.value + event.char)
	}
	sidePanelOpened = true;
	images: { url: string }[] = []
	// MESSAGE
	selectedMessage: User;
	messagesList: any = [];
	searchableList = [];
	users: User[] = [];
	usersList = [];
	selectedUser: any;

	chatItem: any;
	agent: User;

	newChatComment: any;
	files: File[] = [];

	onSelectImage(event) {
		////console.log(event);
		this.files.push(...event.addedFiles);
		////console.log(this.files)
	}

	onRemove(event) {
		////console.log(event);
		this.files.splice(this.files.indexOf(event), 1);
	}

	uploadImages(): Promise<string> {
		return new Promise(resolve => {
			if (this.files.length === 0) {
				resolve('ok')
			} else {
				this.chatService.uploadImageStorage(this.files).then(uploaded => {
					if (uploaded !== null) {
						////console.log(uploaded)
						this.images = uploaded
						this.files = []
						resolve('ok')
					} else {
						////console.log('Error occurated')
						resolve('ok')
					}
				})

			}

		})
	}
	uid: string = ""
	constructor(
		private chatService: ChatService,
		private authService: AuthService,
		public dialog: MatDialog,
		private storageService: LocalStorageService, private router: Router
	) {


	}
	chatVisible: boolean = false
	aacid: string = ""
	user_access: User_Role;
	uid_action: string = ""
	isLoading: boolean = true
	toggleChat() {
		this.chatVisible = !this.chatVisible
	}
	showChatUI() {
		this.chatVisible = true
	}
	hideChatUI() {
		this.chatVisible = false
	}
	ngOnInit() {
		this.storageService.getUserIdAndAccountId().then(response => {
			if (response !== null) {
				this.aacid = response.aacid
				this.uid = response.auid
				this.user_access = response.role
				if (response.fromOwned) {
					this.uid_action = response.auid
					this.isLoading = false
				} else {
					this.uid_action = response.account.owner
					this.isLoading = false
				}

				this.authService.user.subscribe(data => {
					if (data !== null) {
						// this.selectedUser = data
						// this.selectedMessage = data
						this.agent = data;
						this.users = [this.agent]
						this.uid = this.agent.uid
						this.getMessage().then(users => {
							if (users !== undefined && users !== null) {
								this.onSelect(null, this.selectedUser);

							}
							//this.(this.selectedUser);
						});
					}
				})





			}
		})

	}

	getMessage() {
		return new Promise((res, rej) => {
			this.chatService.getMessagesList().subscribe(messagesList => {
				////console.log(messagesList)
				let list = messagesList.filter(msg => msg.conversations !== undefined && msg.conversations.from === this.agent.uid || msg.conversations.destination === this.agent.uid)
				this.messagesList = list.sort((a, b) => { return new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime() });
				//console.log('the message list: ', this.messagesList);
				if (this.messagesList !== null) {
					this.usersList = Object.keys(this.messagesList).map(val => {
						////console.log(val)
						return this.messagesList[val].conversations.from;
					});
					////console.log(this.usersList)
					this.authService.getAllUsers().subscribe(usr => {
						//console.log(usr)
						//this.users = usr
						this.searchableList = usr
						////console.log(this.users)
						////console.log(this.messagesList)
						let selectUser: User = null
						if (this.messagesList.length > 0) {
							//selectUser = usr.filter(a => { return a.uid === this.messagesList[0].conversations.from || a.uid === this.messagesList[0].conversations.destination })[0]
							selectUser = usr.filter(a =>  a.email === 'support@adafri.com' )[0]
							this.selectedUser = selectUser
							this.getChat(this.agent);
							this.selectedMessage = this.users.length > 0 ? this.users[1] : null;
							res(selectUser);
						} else {
							//console.log(usr)
							selectUser = usr.filter(a =>  a.email === 'support@adafri.com' )[0]
							this.selectedUser = selectUser
							//console.log(selectUser)
							//console.log(this.selectedUser)
							//this.getChat(this.agent);
							this.selectedMessage = null
							res(selectUser);
						}

					})

				}



			});
		});
	}

	chatToDelete: any;
	openDialogDeleteMessage() {
		const dialogRef = this.dialog.open(DialogConfirmDeleteMessage);

		dialogRef.afterClosed().subscribe(result => {
			if (result !== undefined && result === 'confirm') {
				////console.log(this.chatToDelete)
				this.chatService.deleteChat(this.chatToDelete.ref).then(res => {
					if (res === "ok") {
						this.chatToDelete = null
					} else {

					}
				})
			}
			////console.log(`Dialog result: ${result}`);
		});
	}
	deleteMessage(chat) {
		////console.log(chat)
		this.chatToDelete = chat
		this.openDialogDeleteMessage()
	}

	defineDateAgo(time: number) {
		moment.locale('fr-FR')
		return moment(time).fromNow()
	}

	MOMENT = moment()

	getLatestMessage(msg) {
		const indx = Object.keys(msg.messages)[Object.keys(msg.messages).length - 1];
		const lastMsg = msg.messages[indx];
		if (lastMsg.card) {
			return lastMsg.card.tourTitle;
		} else {
			return lastMsg.messageBody;
		}
	}

	getLatestMessageTime(msg) {
		const indx = Object.keys(msg.messages)[Object.keys(msg.messages).length - 1];
		const lastMsg = msg.messages[indx];
		return lastMsg.timeStamp;
	}

	showChat(user: User) {
		//this.loaderService.show();
		this.chatService.getMessages(user.uid).subscribe(messages => {
			this.chatItem = messages;
			////console.log(this.chatItem)
			Object.keys(this.chatItem).map(key => { });
			//this.loaderService.hide();
		});
		setTimeout(() => {
			document.querySelector('.message-fixed-section').scroll(0, 99999);
		}, 100);
	}

	getChat(user: User) {
		//this.selectedUser = user;
		//this.loaderService.show();
		this.chatService.getMessagesId(user.uid).subscribe(messages => {
			if (messages) {
				Object.keys(messages).map(key => { });
				this.showChat(user);
				//this.loaderService.hide();
			}
		});
	}

	filterItems(event) {
		const input = event.target.value;
		this.searchableList = this.users.filter(item => {
			if (item.email.toLowerCase().includes(input.toLowerCase())) {
				return item;
			}
		});
	}
	showDropzone: boolean = false
	messageControl: FormControl = new FormControl('')
	showDropzoneFn() {
		if (!this.showDropzone) {
			this.showDropzone = true
			setTimeout(() => {
				var element = document.querySelector("#dropzone");
				element.scrollIntoView({ behavior: 'smooth', block: 'end' });
			});

		} else {
			this.showDropzone = false

		}
	}
	showLoader: boolean = false
	postMessage() {
		this.showLoader = true
		this.messageControl.disable()
		this.uploadImages().then((uploaded) => {
			if (uploaded === 'ok') {
				const message = this.messageControl.value;
				if (message !== '') {
					this.chatService.sendMessage(this.agent, message, this.selectedUser, this.images, this.selectedMessage);
					this.messageControl.reset()
					this.images = []
					this.showDropzone = false
					this.showLoader = false
					this.messageControl.enable()
				} else if (this.images.length > 0) {
					this.chatService.sendMessage(this.agent, message, this.selectedUser, this.images, this.selectedMessage);
					this.messageControl.reset()
					this.images = []
					this.showDropzone = false
					this.showLoader = false
					this.messageControl.enable()
				} else {
					this.showLoader = false
					this.messageControl.enable()
				}

			} else {
				this.showLoader = false
				this.messageControl.enable()
			}
		}).catch((e) => {
			this.showLoader = false
			this.messageControl.enable()
		})
	}
	endConversation() {
		this.chatService.endConversation(this.selectedUser);
	}

	isOver(): boolean {
		return window.matchMedia(`(max-width: 960px)`).matches;
	}

	onSelect(msg: any, user: User): void {
		this.selectedMessage = msg
		this.selectedUser = user
		this.showChat(user)
	}

}


@Component({
	selector: 'dialog-confirm-delete-message',
	templateUrl: 'dialog-confirm-delete-message.html',
})
export class DialogConfirmDeleteMessage {
	constructor(
		public dialogRef: MatDialogRef<DialogConfirmDeleteMessage>) { }
	abortDeletion() {
		this.dialogRef.close()
	}
	confirmDelete() {
		this.dialogRef.close('confirm')
	}
}