import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { User_Role } from 'src/app/utils/data';
import { UserSettingsComponent } from 'src/app/layout/components/user-settings/user-settings.component';
import { AccountSettingsComponent } from 'src/app/layout/components/account-settings/account-settings.component';
import { ToastAdafriComponent } from 'src/app/layout/components/toast/toast.component';
import { AccountsService } from '../accounts.service';

@Component({
  selector: 'adf-account-setup',
  templateUrl: './account-setup.component.html',
  styleUrls: ['./account-setup.component.scss']
})
export class AccountSetupComponent implements OnInit, AfterViewInit {
  uid: string = ""
  adf_account_id: string = ""
  aacid: string = ""
  showSpinner: boolean = false
  stepInitUser: number = 1
  only: boolean = true
  showSpinnerConfirm: boolean = false
  @ViewChild(UserSettingsComponent, { static: false }) userSettings: UserSettingsComponent 
  @ViewChild(AccountSettingsComponent, {static: false}) accountSettings: AccountSettingsComponent 
	public user_access: User_Role = undefined
  constructor(private route: ActivatedRoute, private auth: AuthService, private storageService: LocalStorageService, private router: Router, private accountsService: AccountsService) { }

  ngOnInit(): void {
   /*  this.auth.user.subscribe(data => {
      if (data !== null && data.profileComplete) {
        this.router.navigate(['/select/account'])
      }
    }) */
  }

  signout(){
    this.auth.signOut()
  }
  resendValidationEmail(){
    this.auth.SendVerificationMail()
  }
  emailVerified: boolean;
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
     setTimeout(() => {
       /* this.storageService.getUserIdAndAccountId().then(response => {
			  if (response !== null) { */
				  this.route.queryParams.subscribe(params => {
            this.aacid =params['aacid']
            this.uid = params['auid']
            this.auth.checkIfEmailVerified().then(verified=>{
              this.emailVerified = verified
              //console.log(this.emailVerified)
              this.auth.user.subscribe(data=>{
                if(data.profileCompleted){
                  this.router.navigate(['/overview'], {queryParams: {aacid: this.aacid, auid: this.uid}})
                }
              })
            })
            /* this.user_access = response.role */
					 
					  /* if (response.aacid === adf_account_id && uid === response.auid) {
						  
					  } else {
						  this.router.navigate(['/accounts/setup'], { queryParams: { aacid: response.aacid, auid: response.auid } }).then(() => {
							  setTimeout(() => {
								 
								  
									   
							  }, 1000);
						  })
					  } */
			 
				 /* })
				
        } */ /* else {
          this.auth.user.subscribe(data => {
            if (data !== null) {
              this.router.navigate(['/accounts/setup'], { queryParams: { aacid: data.ownedAccounts[0].id, auid: data.uid } }).then(() => {
							  setTimeout(() => {
								 
								  
									   
							  }, 1000);
						  })
            }
          })
      } */
		})
      
    }, 500);
  }
    @ViewChild('toast', {
    static: false
  }) ToastAdafriComponent: ToastAdafriComponent;
  validInfo() {
    this.showSpinner = true
    //console.log(this.uid)
    //console.log(this.aacid)
    this.storageService.getInvitationProvider().then(provider=>{
      console.log(provider)
      if(provider===null){
        this.saveData()
      }else{
        this.accountsService.updateAccount(this.aacid, {provider: provider}).then(updated=>{
          if(updated==='ok'){
            this.storageService.removeInvitationProvider().then(removed=>{
              if(removed==='ok'){
                this.saveData()
              }else{
                this.saveData()
              }
            }).catch((err)=>{
              this.saveData()
            })
          }else{
            this.saveData()
          }
        }).catch((err1)=>{
          this.saveData()
        })
      }
    })

   
  }

  saveData(){
    this.userSettings.confirmAll().then(user_confirmed => {
      if (user_confirmed==='ok') {
        this.accountSettings.confirmAll().then(account_confirmed => {
          if (account_confirmed==="ok") {
            this.showSpinner = false
             this.storageService.setUserIdAndAccountId(this.uid, this.aacid, {admin: true, readOnly: false}).then(set_user_and_account => {
                  if (set_user_and_account === "ok") {
                    this.router.navigate(['/overview'], { queryParams: { aacid: this.aacid, auid: this.uid } }).then(() => {
                     /*  window.location.reload() */
                    })
                    
                  }
                })
             
          } else {
            this.ToastAdafriComponent.toast.title = "Info"
        this.ToastAdafriComponent.toast.content = account_confirmed
        this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
        this.ToastAdafriComponent.toast.show()
            this.showSpinner = false
          }
        })
      } else {
        this.ToastAdafriComponent.toast.title = "Info"
        this.ToastAdafriComponent.toast.content = user_confirmed
        this.ToastAdafriComponent.toast.cssClass = "e-toast-danger"
        this.ToastAdafriComponent.toast.show()
        this.showSpinner = false
      }
    })
  }

}
