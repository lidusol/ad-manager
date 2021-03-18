import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'adf-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.scss']
})
export class TranslatorComponent implements OnInit {

  constructor(public translate: TranslateService) {
  /*   translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    translate.use('en'); */
    /* const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en'); */
  }

  ngOnInit(): void {
  }

}
