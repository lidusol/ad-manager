import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG } from 'src/environments/environment';
import { LangService } from '../lang.service';

@Component({
  selector: 'adf-langs-selector',
  templateUrl: './langs-selector.component.html',
  styleUrls: ['./langs-selector.component.scss']
})
export class LangsSelectorComponent implements OnInit {
  selectedLang: string = '';
  langs: string[] = ['en', 'fr'];
  @Output() langSelect: EventEmitter<string> = new EventEmitter<string>()
  langChanged(arg: MatRadioChange){
    /* this.langSelect.emit(this.selectedLang) */
    this.selectedLang = arg.value
    this.setLang(this.selectedLang)
/*     this.langService.setLang(this.selectedLang).then(()=>{
    
    }) */
  }
  constructor(public translate: TranslateService, private langService: LangService) {
    translate.addLangs(this.langs);
    translate.setDefaultLang('fr')
    this.langService.language.subscribe(lang=>{
      console.log(lang)
      this.setLang(lang);
    })
  
   }

   setLang(lang: string){
    /* this.translate.setDefaultLang(this.selectedLang); */
    this.selectedLang = lang
    this.translate.use(lang);
    this.langService.setLang(lang)
   }
  ngOnInit(): void {
    /* this.langService.getLang().then(lang=>{
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
    }) */
  }

}
