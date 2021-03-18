import { Component, OnInit, Input } from '@angular/core';
import { Display } from 'src/app/campaigns-management/models/display.models';
import * as moment from 'moment'
import 'moment/locale/fr';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';


 
@Component({
  selector: 'adf-cmp-display-recap',
  templateUrl: './cmp-display-recap.component.html',
    styleUrls: ['./cmp-display-recap.component.scss'],
  
})
export class CmpDisplayRecapComponent implements OnInit {
    @Input() data: Display[] = [];
    isLoading = true
  constructor( public translate: TranslateService, private storageService: LocalStorageService) { 
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
  }
  @Input() shadowed: boolean = true
 public moment = moment
    ngOnInit(): void {
      
    //console.log(this.data)
  }

  ngAfterViewInit(){
    this.interval_refresh = setInterval(()=>{
        this.getLang()
    },500)
  }

   interval_refresh: any;
  ngOnDestroy(): void {
	//Called once, before the instance is destroyed.
	//Add 'implements OnDestroy' to the class.
	if(this.interval_refresh!==undefined && this.interval_refresh!==null){
	  clearInterval(this.interval_refresh)
  
	}
  }
  getLang(){
	this.storageService.getLang().then(lang=>{
		//console.log(lang)
		if(lang!==undefined && lang!==null && (lang==='en' || lang==='fr')){
            this.translate.use(lang);
            if(lang==='fr'){
                moment.updateLocale('fr', {
                    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
                    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
                    monthsParseExact : true,
                    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
                    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
                    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
                    weekdaysParseExact : true,
                    longDateFormat : {
                        LT : 'HH:mm',
                        LTS : 'HH:mm:ss',
                        L : 'DD/MM/YYYY',
                        LL : 'D MMMM YYYY',
                        LLL : 'D MMMM YYYY HH:mm',
                        LLLL : 'dddd D MMMM YYYY HH:mm'
                    },
                    calendar : {
                        sameDay : '[Aujourd’hui à] LT',
                        nextDay : '[Demain à] LT',
                        nextWeek : 'dddd [à] LT',
                        lastDay : '[Hier à] LT',
                        lastWeek : 'dddd [dernier à] LT',
                        sameElse : 'L'
                    },
                    relativeTime : {
                        future : 'dans %s',
                        past : 'il y a %s',
                        s : 'quelques secondes',
                        m : 'une minute',
                        mm : '%d minutes',
                        h : 'une heure',
                        hh : '%d heures',
                        d : 'un jour',
                        dd : '%d jours',
                        M : 'un mois',
                        MM : '%d mois',
                        y : 'un an',
                        yy : '%d ans'
                    },
                    dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
                    ordinal : function (number) {
                        return number + (number === 1 ? 'er' : 'e');
                    },
                    meridiemParse : /PD|MD/,
                    isPM : function (input) {
                        return input.charAt(0) === 'M';
                    },
                    // In case the meridiem units are not separated around 12, then implement
                    // this function (look at locale/id.js for an example).
                    // meridiemHour : function (hour, meridiem) {
                    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
                    // },
                    meridiem : function (hours, minutes, isLower) {
                        return hours < 12 ? 'PD' : 'MD';
                    },
                    week : {
                        dow : 1, // Monday is the first day of the week.
                        doy : 4  // Used to determine first week of the year.
                    }
                });
            }else{
                moment.locale('en')
            }
		}else{
			this.translate.use(DEFAULT_LANG)
		}
	}).catch(e=>{
		this.translate.use(DEFAULT_LANG)
	})
	
  }

}
