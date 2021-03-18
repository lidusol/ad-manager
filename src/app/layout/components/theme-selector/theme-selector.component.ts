import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { LocalStorageService } from '../../services/local-storage.service';
import { LangService } from '../lang.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'adf-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss']
})
export class ThemeSelectorComponent implements OnInit {
  selectedTheme: string = "default";
  themes: string[] = ['default', 'light'];
  checked: boolean = false
  disabled: boolean = false
  @Output() themeSelect: EventEmitter<string> = new EventEmitter<string>()
  themeChanged(arg: MatSlideToggleChange){
    if(arg.checked){
      this.selectedTheme='default'
      this.themeSelect.emit(this.selectedTheme)
      this.setThemeBody(this.selectedTheme)  
      this.storageService.setTheme(this.selectedTheme).then(()=>{
      
      })

    }else{
      this.selectedTheme='light'
      this.themeSelect.emit(this.selectedTheme)
      this.setThemeBody(this.selectedTheme)  
      this.storageService.setTheme(this.selectedTheme).then(()=>{
      
      })
    }
  }
  constructor(private storageService: LocalStorageService, private langService: LangService, private themeService: ThemeService) { 
   
  }

  setThemeBody(theme: string){
    let body_contain_default = document.getElementById('body').classList.contains('default-theme')
    let body_contain_light = document.getElementById('body').classList.contains('light-theme')
    if(theme==='default'){
      if(!body_contain_default){
        document.getElementById('body').classList.add('default-theme')
      }
      if(body_contain_light){
        document.getElementById('body').classList.remove('light-theme')
      }

    }else if(theme==='light'){
      if(!body_contain_light){
        document.getElementById('body').classList.add('light-theme')
      }
      if(body_contain_default){
        document.getElementById('body').classList.remove('default-theme')
      }
    }
  }

  ngOnInit(): void {
    this.storageService.getTheme().then(theme=>{
      if(theme!==undefined && theme!==null && (theme==='light' || theme==='default')){
        if(theme==='light'){
          this.checked = false
        }else{
          this.checked = true
        }
        this.selectedTheme = theme
        this.themeSelect.emit(this.selectedTheme)
        this.setThemeBody(this.selectedTheme)
        this.storageService.setTheme(this.selectedTheme).then(()=>{
    
        })
      }else{
        this.checked = false
        this.selectedTheme = 'light'
        this.themeSelect.emit(this.selectedTheme)
        this.setThemeBody(this.selectedTheme)
        this.storageService.setTheme(this.selectedTheme).then(()=>{
    
        })
      }
    }).catch((e)=>{
      this.checked = false
      this.selectedTheme = 'light'
        this.themeSelect.emit(this.selectedTheme)
        this.setThemeBody(this.selectedTheme)
        this.storageService.setTheme(this.selectedTheme).then(()=>{
    
        })
    })
  }

}
