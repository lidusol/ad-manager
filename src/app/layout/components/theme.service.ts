import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export class ThemeService {
  constructor() {
    this.getTheme().then((themeValue)=>{
      this.theme.next(themeValue)
    })
   }
  theme: Subject<string> = new Subject<string>()
  storatge_prefix = "adafri-"
  public setTheme(theme: string): Promise<string> {
    return new Promise(resolve => {
      localStorage.setItem(this.storatge_prefix+'_theme', JSON.stringify({theme: theme}))
      this.theme.next(theme)
      resolve('ok')
    })
  }


  public getTheme(): Promise<string> {
    return new Promise(resolve => {
      let theme = localStorage.getItem(this.storatge_prefix + '_theme')
      if(theme!==undefined && theme!==null){
        resolve(JSON.parse(theme)['theme'])
      }else{
        resolve(null)
      }
    })
    
  }
}
