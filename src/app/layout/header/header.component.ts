import { Component, OnInit, ViewChild, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
import { MatButton } from '@angular/material/button'
import { AuthService } from 'src/app/auth/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { AccountsService } from 'src/app/accounts/accounts.service';
import {Account, Notifications_Accounts_Link, User_Role, Linked_ADAFRI_ACCOUNT} from '../../utils/data'
import { MatSelectionListChange, MatSelectionList, MatListOption } from '@angular/material/list';
import { Router } from '@angular/router';
import { MdePopoverTrigger, MdePopover } from '@material-extended/mde';
import { NotificationsService } from '../services/notifications.service';
import { map, take } from 'rxjs/operators';
import { MessagingService } from '../services/messaging.service';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from '../components/lang.service';

@Component({
  selector: 'adf-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoading = true
  public USER_NAME: string = ""
  public USER_EMAIL: string = ""
  public CURRENT__ACCOUNT_NAME: string = ""
  public CURRENT_ACCOUNT_ID: string = ""
  public USER_PHOTO_PROFIL = ""
  public NOTIFICATIONS_ICON_EMPTY: string = ""
  public LOGO_WHITE: string = "assets/logo/logo-white.png"
  CURRENT_ACCOUNT: Account = null 
  user_access: User_Role = null
  listAccounts: Linked_ADAFRI_ACCOUNT[] = []
  @Input() title: string = ""
  @Input() s_b: boolean = false
  @ViewChild('buttonDash', { static: false }) btnDash: MatButton
  @ViewChild('selection', { static: false }) selection: MatSelectionList
  @ViewChild(MdePopoverTrigger, { static: false }) popover: MdePopoverTrigger;
  @ViewChild(MdePopover, { static: false }) popoverComponent: MdePopover;
  constructor(private langService: LangService, public translate: TranslateService, private auth: AuthService, public storageService: LocalStorageService, private accountsService: AccountsService, private router: Router, private notificationsService: NotificationsService, private messagingService: MessagingService) { 
    this.currentMessage = this.messagingService.currentMessage
    this.langService.language.subscribe(lang=>{
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
    })
   /*  translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    translate.use('en'); */
  }
  @Output() themeSelected: EventEmitter<string> = new EventEmitter<string>()
  themeSelect(theme: string){
    this.themeSelected.emit(theme)
  }

  /* @Output() langSelected: EventEmitter<string> = new EventEmitter<string>()
  langSelect(lang: string){
    this.langSelected.emit(lang)
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  } */
   playAudio() {
    let audio = new Audio();
    audio.src = "assets/notifications/swiftly.mp3";
    audio.load();
    audio.play();
  
  }
  @Input() toolbarFixed: boolean;
  currentMessage: BehaviorSubject<any> = new BehaviorSubject(null);
  hideMessage() {
    this.currentMessage.next(null)
  }
  accounts: Account[] = []
  setRead(notif: Notifications_Accounts_Link) {
    this.notificationsService.getNotifLinkAct(notif.id).update({isRead: true})
  }
  public links_notifications: Notifications_Accounts_Link[] = []
  buttonDisabled: boolean = true
  adf_account_id: string = ""
  uid: string = ""
   onAccountSelect(event: MatSelectionListChange) {
     this.adf_account_id = event.option.value
     this.buttonDisabled = false
    
   }
  
  getNotifications() {
    this.auth.user.subscribe(data => {
      if (data !== null) {
        this.notificationsService.getListNotifications(data.uid).subscribe(notifications => {
          this.links_notifications = notifications
          ////console.log(this.links_notifications)
        })
      }
    })
  }
  

  ngOnInit(): void {
    
     
    
  }



   goToDashBoard() {
    this.storageService.setUserIdAndAccountId(this.uid, this.adf_account_id, this.user_access).then(set_user_and_account => {
      if (set_user_and_account === "ok") {
                  this.popover.closePopover()
                  this.router.navigate(['/overview'], {queryParams: {aacid: this.adf_account_id, auid: this.uid}})
                  
                }
              })
            }

  popoverAccountsOpened(opened: EventEmitter<void>) {
    opened.subscribe(() => {
      setTimeout(() => {
          for (let i = 0; i < this.selection.options.length; i++){
             ////console.log(this.selection.options['_results'][i])
            if (this.CURRENT_ACCOUNT.id === this.selection.options['_results'][i]['_value']) {
              let option: MatListOption = this.selection.options['_results'][i]
              this.selection.selectedOptions.select(option)
              this.adf_account_id = this.CURRENT_ACCOUNT.id
              this.buttonDisabled = false
              
            }
          }
      },500)
    })
  }

  goBack() {
    this.router.navigate(['/campaigns/new/select'], {queryParams: {aacid: this.CURRENT_ACCOUNT.id, auid: this.uid}})
  }
  currentPath: string = ""
  showUserBadge: boolean = false
  ngAfterViewInit(): void {
    this.currentPath = window.location.pathname
    this.currentMessage.subscribe(observer => {
      if(observer!==null){
        this.playAudio()

      }
    })
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
   /*  setTimeout(() => { */
  /*      if (window.location.pathname === "/dashboard") {
    
         document.getElementById('dashboard-button-link').classList.replace('mat-button', 'mat-raised-button')
         
      this.btnDash.color = 'accent'
    } */
     /*  this.USER_NAME = "Nom d'utilisateur"
    this.USER_EMAIL = "user@gmail.com"
    this.USER_PHOTO_PROFIL = "https://s.gravatar.com/avatar/695bd15dcb38cad50059c5ce5ee4f93d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fox.png"
    this.NOTIFICATIONS_ICON_EMPTY = "assets/notifications/jingles_static.png" */
    this.storageService.getUserIdAndAccountId().then(res => {
      //console.log(res)
      if (res !== null) {
        this.user_access= res.role
        this.CURRENT_ACCOUNT = res.account
        this.auth.getUserCredential().then(credentials => {
          if (credentials !== null) {
            this.USER_PHOTO_PROFIL = credentials.photoURL
            this.USER_NAME = credentials.displayName
            this.USER_EMAIL = credentials.email
            this.showUserBadge = true
            this.isLoading = false
            this.getNotifications()
            
          }else{
            this.isLoading = false
            this.showUserBadge = false
          }
        })
   
        
      } else {
        this.isLoading = false
            this.showUserBadge = false
        this.router.navigate(['/select/account'])
     }
    })
  /*   }, 500); */
    
  }

  logout() {

    this.storageService.removeUserIdAndAccountId().then(remove => {
      if (remove==="ok") {
        this.storageService.setPresence('offline')
        this.auth.signOut()
        
      } else {
        this.storageService.setPresence('offline')
        this.auth.signOut()
      }
    })
  }

  @Output() navToggle: EventEmitter<string>= new EventEmitter<string>()
  toggleNav() {
    this.navToggle.emit('toggle')
  }

}
