import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/utils/data';
import { AuthService } from 'src/app/auth/auth.service';
import { urlValidator, urlDomainValidator, urlSchemeValidator } from 'src/app/utils/form-validators';
import { SearchCountryField, TooltipLabel, CountryISO, NgxIntlTelInputComponent } from 'ngx-intl-tel-input';
import {take} from 'rxjs/operators'
import { Country } from 'ngx-intl-tel-input/lib/model/country.model';
import { ChangeData } from 'ngx-intl-tel-input/lib/interfaces/change-data';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG } from 'src/environments/environment';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'adf-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  confirmed: boolean = false
  email: FormControl = new FormControl('', [Validators.required, Validators.email])
  nom: FormControl = new FormControl('', [Validators.required])
  prenom: FormControl = new FormControl('', [Validators.required])
  businessName: FormControl = new FormControl('', [Validators.required])
  businessUrl: FormControl = new FormControl('', [urlValidator, urlDomainValidator, urlSchemeValidator])
  adresse: FormControl = new FormControl('', [Validators.required])
  phone: FormControl = new FormControl('', [Validators.required])
  user: User;
  uid: string =""
  businessType: string="";
  business: string[] = ['Entreprise', 'Particulier'];
  pathName: string = ''
  only: boolean = undefined
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Senegal, CountryISO.CôteDIvoire, CountryISO.Mali];
  @ViewChild(NgxIntlTelInputComponent, {static: false}) phoneComponent: NgxIntlTelInputComponent
  constructor(private auth: AuthService, private fb: FormBuilder, private translate: TranslateService, private storageService: LocalStorageService) { 
    
  }
  changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}
  @Input() step = 1;

  setStep(index: number) {
    setTimeout(() => {
      this.step = index;
    }, 500);
  }

  nextStep() {
    this.step++;
    ////console.log(this.step)
  }

  prevStep() {
    this.step--;
  }
  showPhoneMessage: boolean = true
  selectedCountry: Country;
  selectedCountryISO: any;
  ngOnInit(): void {
   this.auth.user.pipe(take(1)).subscribe(data => {
     if (data !== null) {
        this.pathName=window.location.pathname
        this.user = data
        this.uid = data.uid
        this.email.setValue(data.email)
        this.email.disable()
        this.nom.setValue(this.user.first_name)
        this.prenom.setValue(this.user.last_name)
        this.businessName.setValue(this.user.entrepriseName)
        if (this.user.isCorporate && this.user.isCorporate!==undefined) {
            this.businessType = "Entreprise"
        } else if(this.user.isParticular && this.user.isCorporate!==undefined) {
          this.businessType = "Particulier"
        }
        
        if (this.user.entrepriseUrl !== undefined) {
          this.businessUrl.setValue(this.user.entrepriseUrl)
          this.businessUrl = new FormControl(this.user.entrepriseUrl, [Validators.required, urlValidator, urlDomainValidator, urlSchemeValidator])
        } else {
          this.businessUrl.setValue('')
       }
       
       this.adresse.setValue(this.user.addresse)
       
       
       if (this.user.phoneInfo === undefined) {
         this.showPhoneMessage = true
         this.selectedCountryISO = null
         this.phoneValid = false
         this.phone_state.emit(false)
       } else {
         this.showPhoneMessage = false
         this.phoneValid = true
         this.selectedCountryISO = this.user.phoneInfo.countryCode.toLowerCase() 
         this.phoneComponent.selectedCountry = this.user.country
         this.phone_state.emit(true)
         /* this.selectedCountry = this.user.country */
       }
       this.phone.setValue(this.user.telephone)
      
      }
    })
  }
  phoneValid: boolean = true
  interval_refresh: any;
  @Output() phone_state: EventEmitter<boolean> = new EventEmitter<boolean>() 
  ngOnDestroy(): void {
	//Called once, before the instance is destroyed.
	//Add 'implements OnDestroy' to the class.
	if(this.interval_refresh!==undefined && this.interval_refresh!==null){
	  clearInterval(this.interval_refresh)
  
	}
  }

  getLang(){
    this.storageService.getLang().then(lang=>{
      ////console.log(lang)
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
    this.interval_refresh = setInterval(()=>{
      this.getLang()
      this.checkPhone()
    },500)
    
  }

  checkPhone(){
    if(this.phoneComponent.phoneValidation){
      //console.log('phone valid')
    }else{
      //console.log('phone invalid')
    }
  }
  showSpinnerName: boolean = false
  showSpinnerBusinessType: boolean = false
  showSpinnerBusinessName: boolean = false
  showSpinnerBusinessUrl: boolean = false
  showSpinnerAdresse: boolean = false
  showSpinnerPhone: boolean = false

  saveNameFirstName(): Promise<string> {
    return new Promise(resolve => {
      if (this.nom.value !== '' && this.prenom.value !== '') {
      this.showSpinnerName = true
      this.auth.updateUser(this.uid, { first_name: this.nom.value, last_name: this.prenom.value }).then(res_update => {
        if (res_update === "ok") {
          this.showSpinnerName = false
        /* this.nextStep() */
          this.step = 2
          resolve('ok')
        } else {
          this.step = 1
          this.showSpinnerName = false
          resolve('error')
        }
      }).catch((e) => {
        this.step = 1
        resolve('error')
      })
      
      } else {
        this.step = 1
        resolve('error')
    }
    })
    
  }

  saveBusiness(): Promise<string> {
    return new Promise(resolve => {
      this.showSpinnerBusinessType = true
    if (this.businessType === 'Entreprise') {
      this.auth.updateUser(this.uid, { isCorporate: true, isParticular: false }).then(res_update => {
      if (res_update === "ok") {
        this.showSpinnerBusinessType = false
      /* this.nextStep() */
        this.step = 3
        resolve('ok')
      } else {
        this.step =2 
        this.showSpinnerBusinessType = false
        resolve('error')
      }
      }).catch((e) => {
        this.step = 2
        this.showSpinnerBusinessType = false
        resolve('error')
    }) 
    } else if (this.businessType === 'Particulier') {
      this.auth.updateUser(this.uid, { isCorporate: false, isParticular: true }).then(res_update => {
      if (res_update === "ok") {
        this.showSpinnerBusinessType = false
      /* this.nextStep() */
        this.step = 3
        resolve('ok')
      } else {
        this.step = 2
        this.showSpinnerBusinessType = false
        resolve('error')
      }
      }).catch((e) => {
        this.step = 2
        this.showSpinnerBusinessType = false
        resolve('error')
    }) 
    } else {
       this.showSpinnerBusinessType = false
      resolve('error')
    }
    })
    
    
  }

  saveBusinessName():Promise<string> {
     return new Promise(resolve => {
      if (this.businessName.value !== '') {
      this.showSpinnerBusinessName = true
       this.auth.updateUser(this.uid, { entrepriseName: this.businessName.value}).then(res_update => {
         if (res_update === "ok") {
           this.showSpinnerBusinessName = false
         /* this.nextStep() */
           this.step = 4
           resolve('ok')
         } else {
           this.step = 3
           this.showSpinnerBusinessName = false
           resolve('error')
         }
       }).catch((e) => {
         this.step = 3
         resolve('error')
       })
       
      } else {
        this.step = 3
        resolve('error')
     }
    })
     
   }
  
  saveBusinessUrl(): Promise<string> {
    return new Promise(resolve => {
      if (this.businessUrl.valid) {
      this.showSpinnerBusinessUrl = true
       this.auth.updateUser(this.uid, { entrepriseUrl: this.businessUrl.value}).then(res_update => {
         if (res_update === "ok") {
           this.showSpinnerBusinessUrl = false
         /*  this.nextStep() */
           this.step = 5
           resolve('ok')
         } else {
           this.step = 4
           this.showSpinnerBusinessUrl = false
           resolve('error')
         }
       }).catch((e) => {
         this.step = 4
         resolve('error')
       })
       
      } else {
        this.step = 4
        resolve('error')
     }
    })
     
  }

  saveBusinessAdresse(): Promise<string> {
    return new Promise(resolve => {
      if (this.adresse.value !== '') {
      this.showSpinnerAdresse = true
       this.auth.updateUser(this.uid, { addresse: this.adresse.value}).then(res_update => {
         if (res_update === "ok") {
           this.showSpinnerAdresse = false
         /* this.nextStep() */
           this.step = 6
           resolve('ok')
         } else {
           this.step = 5
           this.showSpinnerAdresse = false
           resolve('error')
         }
       }).catch((e) => {
         this.step = 5
         resolve('error')
       })
      
      } else {
        this.step = 5
        resolve('error')  
      } 
    })
     
  }
  
  saveBusinessPhone(): Promise<string> {
    return new Promise(resolve => {
      if (this.phone.valid) {
      this.showSpinnerPhone = true
        let country: Country = {
          dialCode: this.phoneComponent.selectedCountry.dialCode?this.phoneComponent.selectedCountry.dialCode:'',
          areaCodes: this.phoneComponent.selectedCountry.areaCodes?this.phoneComponent.selectedCountry.areaCodes:[],
          flagClass: this.phoneComponent.selectedCountry.flagClass?this.phoneComponent.selectedCountry.flagClass:'',
          htmlId: this.phoneComponent.selectedCountry.htmlId?this.phoneComponent.selectedCountry.htmlId:'',
          iso2: this.phoneComponent.selectedCountry.iso2?this.phoneComponent.selectedCountry.iso2:'',
          name: this.phoneComponent.selectedCountry.name?this.phoneComponent.selectedCountry.name:'',
          placeHolder: this.phoneComponent.selectedCountry.placeHolder?this.phoneComponent.selectedCountry.placeHolder:'',
          priority: this.phoneComponent.selectedCountry.priority?this.phoneComponent.selectedCountry.priority:0
        }
        ////console.log(this.phoneComponent.getSelectedCountry())
        ////console.log(country)
        let iso2 = this.phoneComponent.selectedCountry.iso2 ? this.phoneComponent.selectedCountry.iso2 : ''
        ////console.log(iso2)
  
      
       this.auth.updateUser(this.uid, { telephone: this.phone.value.internationalNumber, phoneInfo: this.phone.value, country: country}).then(res_update => {
         if (res_update === "ok") {
           this.showSpinnerPhone = false
           this.phoneValid = true
           this.phone_state.emit(true)
           resolve('ok')
         } else {
           this.step=6
           this.showSpinnerPhone = false
           resolve('error')
         }
       }).catch((e) => {
         ////console.log(e)
         this.showSpinnerPhone = false
         this.step = 6
         resolve('error')
       })
       
      } else {
        this.step = 6
        this.showSpinnerPhone = false
        resolve('error')
     }
    })
     
   }

  showSpinner: boolean = false
  public confirmAll(): Promise<string> {
    return new Promise(resolve => {
      this.showSpinner = true
      this.saveNameFirstName().then(res_save_name_first_name => {
        if (res_save_name_first_name === "ok") {
          this.saveBusiness().then(res_save_business => {
            if (res_save_business === "ok") {
              this.saveBusinessName().then(res_save_business_name => {
                if (res_save_business_name === "ok") {
                   this.saveBusinessPhone().then(res_save_buiness_phone => {
                            if (res_save_buiness_phone === "ok") {
                              this.auth.updateUser(this.uid, { profileCompleted: true }).then(res_update_user => {
                                if (res_update_user === "ok") {
                                  this.showSpinner = false
                                  resolve("ok")
                                } else {
                                  this.showSpinner = false
                                  resolve("Une erreur est survenue vérifiez votre connextion internet puis réessayer")
                                }
                              }).catch((e) => {
                                this.showSpinner = false
                                resolve("Une erreur est survenue vérifiez votre connextion internet puis réessayer")
                              })
                            } else {
                              this.showSpinner = false
                              resolve("Saisissez votre numéro de téléphone.")
                            }
                          }).catch((e) => {
                            this.showSpinner = false
                            resolve("Saisissez votre numéro de téléphone.")
                          })
                } else {
                  this.showSpinner = false
                  resolve("Saisissez le nom de votre marque ou de votre société.")
                }
              }).catch((e) => {
                this.showSpinner = false
                resolve("Saisissez le nom de votre marque ou de votre société.")
              })
            } else {
              this.showSpinner = false
              resolve("Cochez l'une des cases (entreprise ou particulier")
            }
          }).catch((e) => {
            this.showSpinner = false
            resolve("Cochez l'une des cases (entreprise ou particulier")
          })
        } else{
          this.showSpinner = false
          resolve("Nom et prénom incorrects")
        }
      }).catch((e) => {
        this.showSpinner = false
        resolve("Nom et prénom incorrects")
      })
      
    })
  }

}
