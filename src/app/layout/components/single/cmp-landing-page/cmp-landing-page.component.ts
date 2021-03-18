import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { TranslateService } from '@ngx-translate/core';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { urlSchemeValidator, urlDomainValidator, urlValidator } from 'src/app/utils/form-validators';
import { LangService } from '../../lang.service';

@Component({
  selector: 'adf-cmp-landing-page',
  templateUrl: './cmp-landing-page.component.html',
  styleUrls: ['./cmp-landing-page.component.scss']
})
export class CmpLandingPageComponent implements OnInit {

  public componentReady: boolean = false
  URL_TO_PROMOTE: string = ""

  public urlControl = new FormControl('', [Validators.required, urlValidator, urlDomainValidator, urlSchemeValidator])
  @ViewChild('urlExpansion', {static: false}) urlExpansion: MatExpansionPanel
  constructor(private translate: TranslateService, private lang: LangService, private displayService: DisplayService) { 
    this.lang.language.subscribe(lang=>{
      this.translate.use(lang)
    })
  }

  ngOnInit(): void {
  }
  showSpinner: boolean = false
  @Output() data_url: EventEmitter<string> = new EventEmitter<string>()
  ngAfterViewInit(): void {
    this.urlControl.valueChanges.subscribe(value => {
      if (this.urlControl.valid) {
        this.URL_TO_PROMOTE=this.urlControl.value
        this.data_url.emit(this.URL_TO_PROMOTE)
        this.componentReady = true
      } else {
        this.URL_TO_PROMOTE = ""
        this.componentReady = false
      }
    })
   
    
  }

}
