import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { DEFAULT_LANG } from 'src/environments/environment';
import { Account } from '../../../utils/data'
import { LocalStorageService } from '../../services/local-storage.service';
import { LangService } from '../lang.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'adf-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private themeService: ThemeService, private langService: LangService, private auth: AuthService, private router: Router, private accountsService: AccountsService, private storageService: LocalStorageService, public translate: TranslateService) { 
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

  setLang(lang: string){
    /* this.translate.setDefaultLang(this.selectedLang); */
    this.translate.use(lang);
   
   }
  selectedLang: string = '';
  theme: string = ''
  lang: string = ''

  showSpinner: boolean = false
  checked: boolean = false

  ngOnInit(): void {
  }
  firstName: FormControl = new FormControl('', [Validators.required])
  lastName: FormControl = new FormControl('', [Validators.required])
  email: FormControl = new FormControl('', [Validators.required, Validators.email])
  password: FormControl = new FormControl('', [Validators.required])
  confirmPassword: FormControl = new FormControl('', [Validators.required])
  signupSuccess: string = ""
  checkIfUserExist(): Promise<{message: string}>{
    return new Promise(resolve=>{
      this.auth.getUserEmail(this.email.value).then(response=>{
        console.log(response)
        resolve(response)
      }).catch(err=>{
        console.log(err)
        resolve({message: "Une erreur est survenue"})
      })
    })
  }
  userAlreadyExist: boolean = false
  showSpinnerSignUp: boolean = false
  emailSignUp() {
    console.log(this.checked)
    this.signupSuccess = ""
    this.showSpinnerSignUp = true
    if(this.checked && this.email.valid && this.password.valid && this.confirmPassword.valid && this.firstName.valid && this.lastName.valid){
      if(this.password.value===this.confirmPassword.value){
        console.log('password are indenticals')
        this.showSpinner = true
        this.checkIfUserExist().then(ifExist=>{
          if(ifExist.message==='ok'){
            this.signupError = ""
            this.auth.emailSignUp(this.email.value, this.password.value, this.firstName.value, this.lastName.value).then(response => {
              if (response !== null && response!==undefined && response?.user!==undefined) {
                if (response.additionalUserInfo.isNewUser) {
                  /* this.router.navigate(['/overview'], {queryParams: {aacid: response.user.aacid, auid: response.uid}}) */
                  this.accountsService.createAccount(response.user.uid, response.user.providerData[0].email).then(account => {
                    if (account !== null) {
                      this.storageService.setUserIdAndAccountId(response.user.uid, account.id, {admin: true, readOnly: false}).then(set_user_and_account => {
                        if (set_user_and_account === "ok") {    
                              /* this.router.navigate(['/accounts/setup'], { queryParams: { aacid: account.id, auid: response.user.uid } }) */
                              this.signupSuccess = `Inscriptions effectué avec succès, un lien de validation a été envoyé à l'adresse ${response.user.email}.`
                              this.email.reset()
                              this.password.reset()
                              this.confirmPassword.reset()
                              this.firstName.reset()
                              this.lastName.reset()
                              /* this.auth.signOutWithoutReload() */
                              this.showSpinner = false
                              this.showSpinnerSignUp = false
                              this.router.navigate(['/accounts/setup'], { queryParams: { aacid: account.id, auid: response.user.uid } })
                        } else {
                          this.signupSuccess = `Inscriptions effectué avec succès, un lien de validation a été envoyé à l'adresse ${response.user.email}.`
                          this.email.reset()
                          this.password.reset()
                          this.confirmPassword.reset()
                          this.firstName.reset()
                          this.lastName.reset()
                          this.showSpinner = false
                          this.showSpinnerSignUp = false
                          this.signupError = ""
                          this.router.navigate(['/accounts/setup'], { queryParams: { aacid: account.id, auid: response.user.uid } })
                          /* this.auth.signOutWithoutReload() */
                        }
                      }).catch((e) => {
                        this.showSpinner = false
                        this.showSpinnerSignUp = false
                        this.signupError = ""
                        this.signupSuccess = ""
                      })
                    } else {
                      this.showSpinner = false
                      this.showSpinnerSignUp = false
                      this.signupError = ""
                      this.signupSuccess = ""
                    }
                  })
                } else {
                  this.auth.signOut()
                }
              } else {
                console.log(response)
                this.signupError = response
                this.showSpinner = false
                this.showSpinnerSignUp = false
                }
            }).catch((e) => {
              console.log(e)
              this.signupError = e
                this.showSpinner = false
                this.showSpinnerSignUp = false
              })
          }else if(ifExist.message==='not ok'){
            this.showSpinner = false
            this.showSpinnerSignUp = false
            this.signupError = "Cet utilisateur existe déjà."
          }else{
            this.showSpinner = false
            this.showSpinnerSignUp = false
            this.signupError = "Une erreur est survenue veuillez réessayer."
          }
        }).catch(exception=>{
          this.showSpinner = false
          this.showSpinnerSignUp = false
          this.signupError = "Une erreur est survenue veuillez réessayer."
        })

      }else{
        this.signupError = "Les mots de passes ne sont pas identiques."
        this.showSpinner = false
        this.showSpinnerSignUp = false
      }
     

    }else{
      if(this.firstName.valid && this.lastName.valid){
        if(this.email.valid && this.password.valid){
          if(this.confirmPassword.valid){
            if(this.confirmPassword.value===this.password.value){
              if(!this.checked){
                this.signupError = "Veuillez cocher la case ci-dessous."
                this.showSpinner = false
                this.showSpinnerSignUp = false
              }else{
                this.signupError = "Oups ... !." 
                this.showSpinner = false
                this.showSpinnerSignUp = false
              }
            }else{
                this.signupError = "Les mots de passes ne sont pas identiques." 
                this.showSpinner = false
                this.showSpinnerSignUp = false
            }
          }else{
            this.signupError = "Veuillez confirmer votre mot de passe."
            this.showSpinner = false
            this.showSpinnerSignUp = false
          }
        }else{
          this.signupError = "Identifiants incorrects"
          this.showSpinner = false
          this.showSpinnerSignUp = false
        }
      }else{
        this.signupError = "Nom et Prénom obligatoires."
        this.showSpinner = false
        this.showSpinnerSignUp = false
      }
      
    }
  }

  signupError: string = ""
  googleSignUp() {
    this.signupError = ""
    if(this.checked){
      this.showSpinner = true
          this.auth.googleSignUp().then(response => {
            if (response !== null && response!==undefined && response.user!==undefined) {
              if (response.additionalUserInfo.isNewUser) {
                this.accountsService.createAccount(response.user.uid, response.user.providerData[0].email).then(account => {
                  if (account !== null) {
                    this.storageService.setUserIdAndAccountId(response.user.uid, account.id, {admin: true, readOnly: false}).then(set_user_and_account => {
                      if (set_user_and_account === "ok") {    
                        this.showSpinner = false
                        this.showSpinnerSignUp = false
                        this.router.navigate(['/accounts/setup'], { queryParams: { aacid: account.id, auid: response.user.uid } })
                      } else {
                        this.showSpinner = false
                        this.showSpinnerSignUp = false
                      }
                    }).catch((e) => {
                      this.showSpinner = false
                      this.showSpinnerSignUp = false
                    })
                  } else {
                    this.showSpinner = false
                    this.showSpinnerSignUp = false
                  }
                })
              } else {
                this.auth.signOut()
              }
            } else {
             if(response.message!==undefined){
              this.signupError = response.message
              this.showSpinner = false
              this.showSpinnerSignUp = false
             }else{
               this.showSpinner = false
               this.showSpinnerSignUp = false

             }
              }
          }).catch((e) => {
              this.showSpinner = false
              this.showSpinnerSignUp = false
            })
        

    }else{
      this.signupError = "Veuillez cocher la case ci-dessous."
      this.showSpinner = false
      this.showSpinnerSignUp = false
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

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.email.valueChanges.subscribe(value=>{
      if(this.signupError !==""){
        this.signupError = ""
        this.signupSuccess = ""

      }
    })
    this.password.valueChanges.subscribe(value=>{
      if(this.signupError !==""){
        this.signupError = ""
        this.signupSuccess = ""

      }
    })
    this.firstName.valueChanges.subscribe(value=>{
      if(this.signupError !==""){
        this.signupError = ""
        this.signupSuccess = ""

      }
    })
    this.lastName.valueChanges.subscribe(value=>{
      if(this.signupError !==""){
        this.signupError = ""
        this.signupSuccess = ""

      }
    })
    this.confirmPassword.valueChanges.subscribe(value=>{
      if(this.signupError !==""){
        this.signupError = ""
        this.signupSuccess = ""

      }
    })
  }
  

}
