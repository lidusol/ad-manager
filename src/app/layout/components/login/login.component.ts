import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Account } from '../../../utils/data'
import { FormControl, Validators } from '@angular/forms';
import { DEFAULT_LANG, SERVER } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../theme.service';
import { LangService } from '../lang.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'adf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  selectedLang: string = '';
  theme: string = ''
  lang: string = ''

  constructor(private route: ActivatedRoute, private themeService: ThemeService, private langService: LangService, private auth: AuthService, private router: Router, private accountsService: AccountsService, private storageService: LocalStorageService, public translate: TranslateService) { 
    this.langService.language.subscribe(lang=>{
      if(lang!==undefined && lang!==null && (lang==='fr' || lang==='en')){
        this.selectedLang = lang
        this.setLang(this.selectedLang)
      }else{
        this.selectedLang = DEFAULT_LANG
        this.setLang(this.selectedLang)
      }
    })
    this.themeService.theme.subscribe(theme=>{
      
      })
  }

  showSpinner: boolean = false
  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe(route=>{
      let source: string = route['utm_source']
      let content: string = route['utm_c']
      if(source!==undefined && source!==null && content!==undefined && content!==null){
          let utm: {iv: string, content: string} = {iv: source, content: content}
          this.storageService.setInvitationProvider(utm).then(fullySet=>{
            if(fullySet!==null){

            }else{
              
            }
          })

      }
    })
  }
  setLang(lang: string){
   /* this.translate.setDefaultLang(this.selectedLang); */
   this.translate.use(lang);
  
  }
  printUser(event) {
    //console.log(event);
  }
  printError(event) {
    //console.error(event);
  }

  email: FormControl = new FormControl('', [Validators.required, Validators.email])
  password: FormControl = new FormControl('', [Validators.required])
  loginErrorMessage: string = ""

  googleLogin() {
    this.loginErrorMessage = ""
    this.showSpinner = true
    this.auth.googleLogin().then(response => {
      if (response !== null && response!==undefined) {
        if (response.additionalUserInfo.isNewUser) {
          this.accountsService.createAccount(response.user.uid, response.user.providerData[0].email).then(account => {
            if (account !== null) {
              this.storageService.setUserIdAndAccountId(response.user.uid, account.id, {admin: true, readOnly: false}).then(set_user_and_account => {
                if (set_user_and_account === "ok") {
                  this.showSpinner = false
                  window.location.replace(SERVER.url_redirect+'/accounts/setup?aacid='+account.id+'&uid='+response.user.id)     
                } else {
                  this.showSpinner = false
                }
              }).catch((e) => {
                this.showSpinner = false
              })
            } else {
              this.showSpinner = false
            }
          })
        } else {


          this.auth.user.subscribe(user => {
            if (user !== null && user.profileCompleted===true) {
              this.getAccountInfo(user.uid).then(account => {
                if (account !== null && account !== undefined) {
                  window.location.replace(SERVER.url_redirect+'/accounts/setup?aacid='+account.id+'&auid='+user.uid)  
                  this.storageService.setUserIdAndAccountId(response.user.uid, account.id, {admin: true, readOnly: false}).then(set_user_and_account => {
                    if (set_user_and_account === "ok") {
                      window.location.replace(SERVER.url_redirect+'/select/account')  

                    }
                    })

                }
              })
            } else {

              this.getAccountInfo(user.uid).then(account => {
                if (account !== null && account !== undefined) {
                  window.location.replace(SERVER.url_redirect+'/accounts/setup?aacid='+account.id+'&auid='+user.uid)  

                }
              })
            }
          })
        }


      } else {
        this.showSpinner = false

      }
    }).catch((e) => {
      this.showSpinner = false
    })
  }
  showSpinnerEmailPass: boolean = false
  emailLogin(){
    this.showSpinnerEmailPass = true
    if(this.email.valid && this.password.valid){
      this.auth.emailLogin(this.email.value, this.password.value).then(signin=>{
        if(signin!==null && signin!==undefined && signin.user!==undefined){
          this.loginErrorMessage= "" 
          this.auth.user.subscribe(user => {
            if (user !== null && user.profileCompleted===true) {
              this.showSpinnerEmailPass = false
              this.router.navigate(['/select/account'])

            } else {

              this.getAccountInfo(user.uid).then(account => {
                if (account !== null && account !== undefined) {
                  this.showSpinnerEmailPass = false
                  this.router.navigate(['/accounts/setup'], {queryParams: {aacid: account.id, auid: user.uid}})

                }
              })
            }
          })
        }else{
          this.loginErrorMessage = signin
          this.showSpinnerEmailPass = false
        }
      }).catch(err=>{
        this.loginErrorMessage = "Une erreur est survenue"
        this.showSpinnerEmailPass = false
      })
    }else{
      this.showSpinnerEmailPass = false
      this.loginErrorMessage = "Identifiants incorrects"
    }
  }
  getAccountInfo(uid: string): Promise<Account>{
    return new Promise(resolve => {
      this.accountsService.getListAccounts(uid).subscribe(account => {
        if (account.length > 0) {
          resolve(account[0])

        }
      })
    })
  }

  interval_refresh: any;
  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.email.valueChanges.subscribe(value=>{
      if(this.loginErrorMessage !==""){
        this.loginErrorMessage = ""

      }
    })
    this.password.valueChanges.subscribe(value=>{
      if(this.loginErrorMessage !==""){
        this.loginErrorMessage = ""

      }
    })

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    /* if(this.interval_refresh!==undefined && this.interval_refresh!==null){
      clearInterval(this.interval_refresh)
    
    } */
    }

}
