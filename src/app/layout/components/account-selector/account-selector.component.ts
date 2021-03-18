import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { DEFAULT_LANG } from 'src/environments/environment';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'adf-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.scss']
})
export class AccountSelectorComponent implements OnInit {
  selectedLang: string = '';
  constructor(private auth: AuthService, public translate: TranslateService, private storageService: LocalStorageService) { 
    translate.addLangs(['en', 'fr']);
    /*   translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    translate.use('en'); */
  }

  setLang(lang: string){
    /* this.translate.setDefaultLang(this.selectedLang); */
    this.translate.use(lang);
   
   }
  ngOnInit(): void {
    this.storageService.getLang().then(lang=>{
      if(lang!==undefined && lang!==null && (lang==='fr' || lang==='en')){
        this.selectedLang = lang
        this.setLang(this.selectedLang)
      }else{
        this.selectedLang = DEFAULT_LANG
        this.setLang(this.selectedLang)
      }
    }).catch((e)=>{
      this.selectedLang = DEFAULT_LANG
      this.setLang(this.selectedLang)
    })
  }
  signout(){
    this.auth.signOut()
  }

}
