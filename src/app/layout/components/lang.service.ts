import { BehaviorSubject } from 'rxjs';

export class LangService {
  storatge_prefix = "adafri-"
  constructor() { 
    this.getLang().then((langValue)=>{
      if(langValue===null){
        this.setLang('fr').then(settingLang=>{
          if(settingLang==='ok'){
            this.language.next('fr')

          }else{
            this.language.next('fr')
          }
        }).catch(e=>{
          this.language.next('fr')
        })
        
      }else{
        this.language.next(langValue)
      }
      
    }).catch(e=>{
      this.language.next('fr')
    })
  }
  public language: BehaviorSubject<string> = new BehaviorSubject<string>('fr')
  public setLang(lang: string): Promise<string> {
    return new Promise(resolve => {
      localStorage.setItem(this.storatge_prefix+'_lang', JSON.stringify({lang: lang}))
      resolve('ok')
    })
  }
  public getLang(): Promise<string> {
    return new Promise(resolve => {
      let language = localStorage.getItem(this.storatge_prefix + '_lang')
      if(language!==undefined && language!==null){
        resolve(JSON.parse(language)['lang'])
      }else{
        resolve(null)
      }
    })
    
  }
}
