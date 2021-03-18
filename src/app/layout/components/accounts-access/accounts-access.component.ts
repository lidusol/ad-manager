import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { Account, Linked_ADAFRI_ACCOUNT, User_Role, Link } from '../../../utils/data'
import * as _ from 'lodash'
import { GridLine } from '@syncfusion/ej2-angular-grids';
import { FormControl, Validators } from '@angular/forms';
import { MessagingService } from '../../services/messaging.service';
import { NotificationsService } from '../../services/notifications.service';
import { DialogComponent, PositionDataModel } from '@syncfusion/ej2-angular-popups';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '../../services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG } from 'src/environments/environment';
@Component({
  selector: 'adf-accounts-access',
  templateUrl: './accounts-access.component.html',
  styleUrls: ['./accounts-access.component.scss']
})
export class AccountsAccessComponent implements OnInit {
  gridLines: GridLine
  
  @ViewChild('confirmRefuseLink', { static: false }) confirmRefuseLink: DialogComponent 
  @ViewChild('confirmAcceptLink', { static: false }) confirmAcceptLink: DialogComponent 
  @ViewChild('inviteNewUserDialog', { static: false }) inviteNewUserDialog: DialogComponent 
  @ViewChild('confirmDeleteUserAccessDialog', { static: false }) confirmDeleteUserAccessDialog: DialogComponent 
  @ViewChild('confirmRevoqueUserAccessDialog', { static: false }) confirmRevoqueUserAccessDialog: DialogComponent 
  @ViewChild('confirmDeleteUserAccessPendingDialog', { static: false }) confirmDeleteUserAccessPendingDialog: DialogComponent 
  public visible: Boolean = false;
  public isModal: Boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  user_access: User_Role;
  aacid: string;
  constructor(private translate: TranslateService,  private auth: AuthService, private accountsService: AccountsService, private msg: MessagingService, private notificationsService: NotificationsService, private route: ActivatedRoute, private storageService: LocalStorageService, private router: Router) { }
  roleOption: string  = "user"
  emailControl: FormControl
  uid: string = ""
  token: string = ""
  email: string =""
  CURRENT_ACCOUNT_TO_LINK: Account;
  invitedAccounts: Linked_ADAFRI_ACCOUNT[] = []
  ownedAccounts: Account[] = []
  inviteNewUser: boolean = false
  pendingAccountsToLink: Link[] = [];
  activeAccountsLink: Link[] = []

  listAccounts: Linked_ADAFRI_ACCOUNT[] = []

  myLinksInvited: Link[] = []

  accountAccess: Link[] = []

  
  ngOnInit(): void {
    this.gridLines = 'Both';
    this.emailControl = new FormControl('', [Validators.required, Validators.email])
   this.getInitialData()
  }

  getLang(){
    this.storageService.getLang().then(lang=>{
      //console.log(lang)
      if(lang!==undefined && lang!==null && (lang==='en' || lang==='fr')){
        this.translate.use(lang);
      }else{
        this.translate.use(DEFAULT_LANG)
      }
    }).catch(e=>{
      this.translate.use(DEFAULT_LANG)
    })
    
    }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
    this.emailControl.valueChanges.subscribe(value => {
      if (this.isErrorMessage) {
        this.isErrorMessage = false
      }
      if (this.emailControl.valid) {
        this.sendInvitationButtonDisabled = false
      }
    })
    this.storageService.getUserIdAndAccountId().then(response => {
      if (response !== null) {
        
        this.route.queryParams.pipe(take(1)).subscribe(params => {
          var url = new URL(window.location.href);
          var code = url.searchParams.get("code");
          //console.log(code)
          if(code===undefined || code===null){
            const adf_account_id: string = params['aacid'];
             const uid = params['auid'];
             if (response.aacid === adf_account_id && uid === response.auid && adf_account_id!==undefined && uid!==undefined) {
               this.aacid = adf_account_id
               this.uid = response.auid
               this.user_access = response.role
        
               
             } else {

             }

          }else{
          this.auth.getAuthFlowCredentials(response.auid, code).then((value)=>{
            //console.log(value)
            if(value!==null){
              window.location.replace('/')
            }else{
              alert('authentication failure !')
            }
          })
          }
     
       })
      
    }
  })
  this.interval_refresh = setInterval(()=>{
    this.getLang()
  },500)
}

ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  if(this.interval_refresh!==undefined && this.interval_refresh!==null){
    clearInterval(this.interval_refresh)

  }
}
interval_refresh: any;

  getInitialData() {
    this.listAccounts = []
    this.pendingAccountsToLink = []
    this.activeAccountsLink = []
    this.accountAccess = []
    this.ownedAccounts = []
    this.myLinksInvited = []
       this.auth.user.subscribe(data => {
      if (data !== null) {
        this.uid = data.uid
        this.email = data.email
        this.invitedAccounts = data.invitedAccounts
        this.token = data.token
        this.accountsService.getListLink(this.uid).pipe(take(1)).subscribe(sendingLinks => {
          this.myLinksInvited = sendingLinks
            this.accountsService.getListAccounts(this.uid).pipe(take(1)).subscribe(accounts => {
          
              this.ownedAccounts = accounts
              this.ownedAccounts.forEach((account) => {
                this.listAccounts.push({ account: account, role: { admin: true, readOnly: false } })
                
              }) 
                this.accountsService.getListPendingLink(this.uid).pipe(take(1)).subscribe(pending_accounts_to_link => {
                  this.pendingAccountsToLink = pending_accounts_to_link
                  this.accountsService.getListOwnedActiveLink(this.uid).pipe(take(1)).subscribe(owned_links => {
                    this.accountAccess = owned_links
                    
                    this.accountsService.getListActiveLink(this.uid).pipe(take(1)).subscribe(active_accounts_linked => {
                        this.activeAccountsLink = active_accounts_linked
                        
                    /*   if (this.activeAccountsLink.length > 0) {
                        for (let link of this.activeAccountsLink) {
                          let account: Linked_ADAFRI_ACCOUNT = link.linked_account
                          
                          this.listAccounts = [...this.listAccounts, ...[account]]
                       
                          }
                      } else {
                        
                        
                        } */
                    })
                  })
              
                })
                
             
            })
        })
          
       
      }
    })
  }
convert(timestamp) {
  var date = new Date(                          // Convert to date
    parseInt(                                   // Convert to integer
      timestamp.split("(")[1]                   // Take only the part right of the "("
    )
  );
  return [
    ("0" + date.getDate()).slice(-2),           // Get day and pad it with zeroes
    ("0" + (date.getMonth()+1)).slice(-2),      // Get month and pad it with zeroes
    date.getFullYear()                          // Get full year
  ].join('/');                                  // Glue the pieces together
}
getAuthUrl(){
  this.auth.user.pipe(take(1)).subscribe(user=>{
    if(user!==null){
      this.auth.getAuthFlowUrl(user.email)

    }

  })
}
  
  showInviteUserPanel(account: Account) {
    this.CURRENT_ACCOUNT_TO_LINK = {id: account.id, name: account.name, status: account.status, creationDateString: account.creationDateString, creationDate: account.creationDate, account_value: account.account_value, totalClics: account.totalClics, totalCosts: account.totalCosts, totalImpressions: account.totalImpressions, owner: account.owner, owner_email: account.owner_email}
    ////console.log(this.CURRENT_ACCOUNT_TO_LINK)
    this.inviteNewUserDialog.show()
  }
  hideInviteUserPanel() {
    this.inviteNewUserDialog.hide()
  }

  isErrorMessage: boolean = false
  sendInvitationButtonDisabled: boolean = true

  activeLinkAlreadyExist(target_uid: string): Promise<boolean>{
    return new Promise(resolve => {
      this.accountsService.getListActiveLink(target_uid).subscribe(active_links => {
        let active_links_already_exist: boolean = active_links.some(active_link => active_link.linked_account.account.id === this.CURRENT_ACCOUNT_TO_LINK.id)
        resolve(active_links_already_exist)
          
        })
    })
  }

  pendingLinkAlreadyExist(target_uid: string): Promise<boolean>{
    return new Promise(resolve => {
      this.accountsService.getListPendingLink(target_uid).subscribe(active_links => {
        let pending_links_already_exist: boolean = active_links.some(active_link => active_link.linked_account.account.id === this.CURRENT_ACCOUNT_TO_LINK.id)
        resolve(pending_links_already_exist)
          
        })
    })
  }
  showSpinnerInvitation: boolean = false
  errorMessage: string = ''
  requestInvitation() {
    this.showSpinnerInvitation = true
    if (this.email !== this.emailControl.value) {
      this.auth.getUserExist(this.emailControl.value).subscribe(data => {
        ////console.log(data)
        if (data.length > 0) {
          ////console.log(this.CURRENT_ACCOUNT_TO_LINK)
          
          let pendingExist = this.myLinksInvited.some((link) => {return link.linked_account.account.id === this.CURRENT_ACCOUNT_TO_LINK.id && link.target_email === this.emailControl.value.toString() && link.status === 'PENDING'})
          let activeExist = this.activeAccountsLink.some(link=>{return link.linked_account.account.id === this.CURRENT_ACCOUNT_TO_LINK.id  && link.target_email === this.emailControl.value.toString() && link.status === 'ACTIVE'})
          ////console.log(this.myLinksInvited)
          ////console.log(this.activeAccountsLink)
          ////console.log(pendingExist)
          ////console.log(activeExist)
          if (pendingExist) {
            this.showSpinnerInvitation = false
            this.emailControl.setValue('')
            this.emailControl.reset()
            this.isErrorMessage = true
            this.errorMessage = 'Une invitation a déjà été envoyé à cet utilisateur'
            this.sendInvitationButtonDisabled = true
          } else {
            if (activeExist) {
              this.showSpinnerInvitation = false
              this.emailControl.setValue('')
              this.emailControl.reset()
              this.isErrorMessage = true
              this.errorMessage = 'Cet utilisateur a déjà accès à ce compte'
              this.sendInvitationButtonDisabled = true
            } else {
                       this.isErrorMessage = false
          let role: string = "user"
          let account_role: User_Role = null
          let linked_account: Linked_ADAFRI_ACCOUNT = null
          if (this.roleOption === "user") {
            role = "Utilisateur"
            account_role = { admin: false, readOnly: true }
            linked_account = {account: this.CURRENT_ACCOUNT_TO_LINK, role: account_role}
          } else {
            role = "Administrateur"
            account_role = { admin: true, readOnly: false }
            linked_account = {account: this.CURRENT_ACCOUNT_TO_LINK, role: account_role}
          }
          ////console.log(data)
         
          let message: string = "Nouvelle invitation d'accès sur le compte "+this.CURRENT_ACCOUNT_TO_LINK.name
          this.accountsService.createAccountLink(this.uid, this.email, data[0].uid, data[0].email, 'PENDING', linked_account).then(new_link => {
            if (new_link !== null) {
              this.notificationsService.createNotificationLink(data[0].uid, message, new_link).then(newNotification => {
                if (newNotification !== null) {
                  
                  this.msg.createMessage(data[0].token, message).then(response => {
                    this.showSpinnerInvitation = false
                    this.isErrorMessage = false
                    this.emailControl.setValue('')
                    this.emailControl.reset()
                    this.inviteNewUserDialog.hide()
                    this.CURRENT_ACCOUNT_TO_LINK = undefined
                    this.sendInvitationButtonDisabled = true
                  })
                } else {
                  this.showSpinnerInvitation = false
                }
                
              }).catch((e) => {
                this.showSpinnerInvitation = false
              })
              
            } else {
              this.showSpinnerInvitation = false
            }
          }).catch((e) => {
            this.isErrorMessage = true
            this.showSpinnerInvitation = false
            this.errorMessage = 'Une erreur est survenue'
         
          })
            }
          }
          
        } else {
          this.isErrorMessage = true
          this.showSpinnerInvitation = false
          this.errorMessage = "Cet utiliateur ne dispose pas d'un compte adafri"
        }
      })
      
    } else {
      this.isErrorMessage = true
      this.showSpinnerInvitation = false
      this.errorMessage = "Adresse email incorrecte"
    }
  }

  CURRENT_LINK_ACTIVE_TO_DELETE: Link = undefined
  CURRENT_LINK_ACTIVE_TO_REVOQUE: Link = undefined
  CURRENT_LINK_PENDING_TO_DELETE: Link = undefined
  CURRENT_LINK_PENDING_TO_ACTIVE: Link = undefined
  CURRENT_LINK_PENDING_TO_REFUSE: Link = undefined
  disableLink(new_link: Link) {
    this.CURRENT_LINK_ACTIVE_TO_DELETE = { id: new_link.id, target: new_link.target, target_email: new_link.target_email, status: new_link.status, owner: new_link.owner, owner_email: new_link.owner_email, linkDate: new_link.linkDate, linkDateString: new_link.linkDateString, linked_account: new_link.linked_account }
    this.confirmDeleteUserAccessDialog.show()
    
  }

  revoqueAccess(new_link: Link) {
     this.CURRENT_LINK_ACTIVE_TO_REVOQUE = { id: new_link.id, target: new_link.target, target_email: new_link.target_email, status: new_link.status, owner: new_link.owner, owner_email: new_link.owner_email, linkDate: new_link.linkDate, linkDateString: new_link.linkDateString, linked_account: new_link.linked_account }
    this.confirmRevoqueUserAccessDialog.show()
  }

  spinnerDeleteLink: boolean = false
  spinnerRevoqueLink: boolean = false
  errorMessageDeletion: string = ''
  confirmDeletion() {
    this.spinnerDeleteLink = true
    this.errorMessageDeletion = ''
    this.accountsService.disableLink(this.CURRENT_LINK_ACTIVE_TO_DELETE.id).then(accept => {
      if (accept === "ok") {
        this.errorMessageDeletion = ''
        this.spinnerDeleteLink = false
        this.confirmDeleteUserAccessDialog.hide()
        this.CURRENT_LINK_ACTIVE_TO_DELETE = undefined
        this.getInitialData()
      } else {
        this.errorMessageDeletion = 'Une erreur est survenue'
        this.spinnerDeleteLink = false
      }
    }).catch((e) => {
      this.errorMessageDeletion = 'Une erreur est survenue'
      this.spinnerDeleteLink = false
    })
  }

  confirmRevoque() {
    this.spinnerRevoqueLink = true
    this.errorMessageDeletion = ''
    this.accountsService.disableLink(this.CURRENT_LINK_ACTIVE_TO_REVOQUE.id).then(accept => {
      if (accept === "ok") {
        this.errorMessageDeletion = ''
        this.spinnerRevoqueLink = false
        this.confirmDeleteUserAccessDialog.hide()
        this.CURRENT_LINK_ACTIVE_TO_REVOQUE = undefined
        this.getInitialData()
      } else {
        this.errorMessageDeletion = 'Une erreur est survenue'
        this.spinnerRevoqueLink = false
      }
    }).catch((e) => {
      this.errorMessageDeletion = 'Une erreur est survenue'
      this.spinnerRevoqueLink = false
    })
  }
  confirmDeletionPending() {
    this.spinnerDeleteLink = true
    this.errorMessageDeletion = ''
    this.accountsService.disableLink(this.CURRENT_LINK_PENDING_TO_DELETE.id).then(accept => {
      if (accept === "ok") {
        this.errorMessageDeletion = ''
        this.spinnerDeleteLink = false
        this.confirmDeleteUserAccessPendingDialog.hide()
        this.CURRENT_LINK_PENDING_TO_DELETE = undefined
        this.getInitialData()
      } else {
        this.errorMessageDeletion = 'Une erreur est survenue'
        this.spinnerDeleteLink = false
      }
    }).catch((e) => {
      this.errorMessageDeletion = 'Une erreur est survenue'
      this.spinnerDeleteLink = false
    })
  }
   disableLinkInvitation(new_link: Link) {
    this.CURRENT_LINK_PENDING_TO_DELETE = { id: new_link.id, target: new_link.target, target_email: new_link.target_email, status: new_link.status, owner: new_link.owner, owner_email: new_link.owner_email, linkDate: new_link.linkDate, linkDateString: new_link.linkDateString, linked_account: new_link.linked_account }
   this.confirmDeleteUserAccessPendingDialog.show()
  }


  refuseLink(new_link: Link) {
    this.CURRENT_LINK_PENDING_TO_REFUSE = { id: new_link.id, target: new_link.target, target_email: new_link.target_email, status: new_link.status, owner: new_link.owner, owner_email: new_link.owner_email, linkDate: new_link.linkDate, linkDateString: new_link.linkDateString, linked_account: new_link.linked_account }
    this.confirmRefuseLink.show()
  }

  confirmRefused() {
     this.spinnerDeleteLink = true
    this.errorMessageDeletion = ''
    this.accountsService.disableLink(this.CURRENT_LINK_PENDING_TO_REFUSE.id).then(accept => {
      if (accept === "ok") {
        this.errorMessageDeletion = ''
        this.spinnerDeleteLink = false
        this.confirmRefuseLink.hide()
        this.CURRENT_LINK_PENDING_TO_REFUSE = undefined
        this.getInitialData()
      } else {
        this.errorMessageDeletion = 'Une erreur est survenue'
        this.spinnerDeleteLink = false
      }
    }).catch((e) => {
      this.errorMessageDeletion = 'Une erreur est survenue'
      this.spinnerDeleteLink = false
    })
  }
  confirmAccept() {
      this.spinnerDeleteLink = true

    this.accountsService.acceptLink(this.CURRENT_LINK_PENDING_TO_ACTIVE.id).then(accept => {
      if (accept === "ok") {
       
                let message: string = ""
        this.auth.getUserExist(this.CURRENT_LINK_PENDING_TO_ACTIVE.owner_email).subscribe(data => { 
          if (data.length > 0) {
            ////console.log(data[0])
                   
            if (this.CURRENT_LINK_PENDING_TO_ACTIVE.linked_account.role.admin) { 
              message= `L'utilisateur ${this.email} a accepté votre demande d'association à votre compte ${this.CURRENT_LINK_PENDING_TO_ACTIVE.linked_account.account.name} et en est désormais administrateur`
            } else{
              message= `L'utilisateur ${this.email} a accepté votre demande d'association à votre compte ${this.CURRENT_LINK_PENDING_TO_ACTIVE.linked_account.account.name} et en est désormais lecteur`
            }

             this.notificationsService.createNotificationLink(this.CURRENT_LINK_PENDING_TO_ACTIVE.owner, message, this.CURRENT_LINK_PENDING_TO_ACTIVE).then(newNotification => {
              if (newNotification !== null) {
                this.msg.createMessage(data[0].token, message).then(response => {
                  this.spinnerDeleteLink = false
                   this.CURRENT_LINK_PENDING_TO_ACTIVE = undefined
                  this.confirmAcceptLink.hide()

                  this.getInitialData()
                  
                }).catch((e) => {
      this.spinnerDeleteLink = false
                  
                })
              } else {
      this.spinnerDeleteLink = false
                
              }
            
             }).catch((e) => {
      this.spinnerDeleteLink = false
              
            })
          } else {
      this.spinnerDeleteLink = false
            
                 }
            
                 

               })
             
        }
      })
  }
  acceptLink(new_link: Link) {
    this.CURRENT_LINK_PENDING_TO_ACTIVE = { id: new_link.id, target: new_link.target, target_email: new_link.target_email, status: new_link.status, owner: new_link.owner, owner_email: new_link.owner_email, linkDate: new_link.linkDate, linkDateString: new_link.linkDateString, linked_account: new_link.linked_account }
    this.confirmAcceptLink.show()
    
  }
}
