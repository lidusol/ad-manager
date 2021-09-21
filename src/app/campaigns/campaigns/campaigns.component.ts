import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectLinkedAccountComponent } from 'src/app/layout/components/select-linked-account/select-linked-account.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { Linked_ADAFRI_ACCOUNT, User_Role } from 'src/app/utils/data';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG } from 'src/environments/environment';

@Component({
  selector: 'adf-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnInit {
  aacid: string = ""
  uid: string = ""
  user_access: User_Role;
  showSpinnerChart: boolean = false
  @ViewChild('selectLinkedAccountComponent', { static: false }) selectLinkedAccountComponent: SelectLinkedAccountComponent



   selected: any;
    invalidDates: moment.Moment[] = [];
    tooltips = [
        { date: moment(), text: 'Today is just unselectable' },
        { date: moment().add(2, 'days'), text: 'Yeeeees!!!' },
    ];
    ranges = {
        "Aujourd'hui": [moment(), moment()],
        'Hier': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        '7 derniers jours': [moment().subtract(6, 'days'), moment()],
        '30 derniers jours': [moment().subtract(29, 'days'), moment()],
        'Ce mois': [moment().startOf('month'), moment().endOf('month')],
      'Mois dernier': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'Personnaliser': [moment(), moment().add(10, 'days')],
        
    };
    form = this.formBuilder.group({
        selected: {
            startDate: moment().subtract(1, 'days').set({ hours: 0, minutes: 0 }),
            endDate: moment().subtract(1, 'days').set({ hours: 23, minutes: 59 }),
        },
        alwaysShowCalendars: true,
        keepCalendarOpeningWithRange: true,
        showRangeLabelOnInput: true,
    });

  isInvalidDate = (m: moment.Moment) => {
        return this.invalidDates.some((d) => d.isSame(m, 'day'));
    };

    isTooltipDate = (m: moment.Moment) => {
        const tooltip = this.tooltips.find((tt) => tt.date.isSame(m, 'day'));
        if (tooltip) {
            return tooltip.text;
        } else {
            return false;
        }
    };
    rangeSelected: string = "Hier"
    rangeClicked(range): void {
      //console.log('[rangeClicked] range is : ', range);
      this.rangeSelected = range.label
    }

    datesUpdated(range): void {
        //console.log('[datesUpdated] range is : ', range);
  }
  
  public query: string = "YESTERDAY"
  startDateFormattedGoogle: string = ""
  endDateFormattedGoogle: string = ""
  change(e): void {
    //console.log(e);
    if (this.rangeSelected === 'Hier') {
      this.query = "YESTERDAY"
      if(this.chart!==undefined){
        this.chart.destroy();

      }
      this.chart = null;
      this.setChartReport()
      
    } else if (this.rangeSelected === "Aujourd'hui") {
      this.query = "TODAY"
      if(this.chart!==undefined){
        this.chart.destroy();

      }
      this.chart = null;
      this.setChartReport()
    } else if (this.rangeSelected === '7 derniers jours') {
      this.query = "LAST_7_DAYS"
      if(this.chart!==undefined){
        this.chart.destroy();

      }
      this.chart = null;
      this.setChartReport()
    } else if (this.rangeSelected === '30 derniers jours') {
      this.query = "LAST_30_DAYS"
      if(this.chart!==undefined){
        this.chart.destroy();

      }
      this.chart = null;
      this.setChartReport()
    } else if (this.rangeSelected === 'Ce mois') {
      this.query = "THIS_MONTH"
      if(this.chart!==undefined){
        this.chart.destroy();

      }
      this.chart = null;
      this.setChartReport()
    } else if (this.rangeSelected === 'Mois dernier') {
      this.query = "LAST_MONTH"
      if(this.chart!==undefined){
        this.chart.destroy();

      }
      this.chart = null;
      this.setChartReport()
    } else if (this.rangeSelected === 'Personnaliser') {
      if (e.endDate._d !== undefined) {
        this.query = ""
        if(this.chart!==undefined){
          this.chart.destroy();

        }
        this.chart = null;
        let startDate = new Date(e.startDate._d)
        let endDate = new Date(e.endDate._d)
        let minDateEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate() + 1)
        this.startDateFormattedGoogle = [startDate.getFullYear(), ('0' + (startDate.getMonth() + 1)).slice(-2), ('0' + (startDate.getDate())).slice(-2),].join('');
        this.endDateFormattedGoogle = [endDate.getFullYear(), ('0' + (endDate.getMonth() + 1)).slice(-2), ('0' + (endDate.getDate())).slice(-2),].join('');
        this.setChartReport()
        
        
      }
     
     
      
    }
    
  }
  
  setChartReport() {
    this.showSpinnerChart=true
   this.getReportSummuryWithQuery(this.query, this.startDateFormattedGoogle, this.endDateFormattedGoogle).then(res_report => {
          if (res_report === "ok") {
             this.getCosts().then(res_impr => {
               if (res_impr === "ok") {
           this.showSpinnerChart=false
           //console.log(this.clicks)
           //console.log(this.costs)
           //console.log(this.impressions)
    
          }
        })
          }
        }) 
  }

  selectAccountForNewCampaign() {
    
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
      }else{
        this.translate.use(DEFAULT_LANG)
      }
    }).catch(e=>{
      this.translate.use(DEFAULT_LANG)
    })
    
    }

  ngAfterViewInit() {
  setTimeout(() => {
		  this.storageService.getUserIdAndAccountId().then(response => {
			  if (response !== null) {
				  this.route.queryParams.subscribe(params => {
				   const adf_account_id: string = params['aacid'];
					  const uid = params['auid'];
					 
					  if (response.aacid === adf_account_id && uid === response.auid && adf_account_id!==undefined && uid!==undefined) {
						  this.aacid = adf_account_id
						  this.uid = response.auid
              this.user_access = response.role
               /* this.getData().then(res_data => {
      if (res_data === "ok") {
       this.getCosts().then(res_impr => {
         if (res_impr === "ok") {
           
            
          }
        })
      }
}) */
						 
					  } else {
						  this.router.navigate(['/campaigns/list'], { queryParams: { aacid: response.aacid, auid: response.auid } })
					  }
			 
				 })
				
			}
      })
    
     
      
  }, 500);
    
  this.interval_refresh = setInterval(()=>{
    this.getLang()
  },500)
    
  }
  

  onSelectAccount(customerId: number) {
    this.selectLinkedAccountComponent.hideDialog()
    this.router.navigate(['campaigns/new/select'], { queryParams: { cid: customerId } })
    
  }
  startFlowCampaignCreation() {
     this.selectLinkedAccountComponent.showDialog()
  }
  constructor(private router: Router, private auth: AuthService, private accountsService: AccountsService, private storageService: LocalStorageService, private route: ActivatedRoute, private displayService: DisplayService, private formBuilder: FormBuilder, private translate: TranslateService) { }

 chart: any;
  allReport = []
 /*  getData(): Promise<string>{
    return new Promise(resolve => {

      this.displayService.getCampaignSummuryReportWithSelectorDate(this.uid, this.aacid, 'YESTERDAY', "", "").then(res => {
        this.allReport = res
        resolve('ok')
      })
    })
  } */
  clicks = []
  costs = []
  impressions = []

  getReportSummuryWithQuery(query: string, startDate: string, endDate: string): Promise<string>{
    return new Promise(resolve => {
      this.allReport = []
      this.displayService.getCampaignSummuryReportWithSelectorDate(this.uid, this.aacid, query, startDate, endDate).then(res => {
        this.allReport = res
        resolve('ok')
      })
    })
  
  }

  getClics(): Promise<string>{
    return new Promise(resolve => {
      for (let i = 0; i < this.allReport.length; i++){
       
      }
      resolve('ok')
    })
  }
   getCosts(): Promise<string>{
     return new Promise(resolve => {
       this.clicks = []
       this.costs = []
       this.impressions = []
       if(this.allReport.length>0){
         for (let i = 0; i < this.allReport.length; i++){
            //console.log(parseFloat((parseFloat(this.allReport[i].costs)/1000000).toFixed(7)))
           if (i === this.allReport.length - 1) {
             this.clicks.push({x: new Date(this.allReport[i].date), y: parseFloat((parseFloat(this.allReport[i].clicks)).toFixed(6)), name: this.allReport[i].campaign})
            this.costs.push({ x: new Date(this.allReport[i].date), y: parseFloat((parseFloat(this.allReport[i].costs)/1000000).toFixed(7)), name: this.allReport[i].campaign})
             this.impressions.push({ x: new Date(this.allReport[i].date), y: parseFloat(this.allReport[i].impressions)/1000, name: this.allReport[i].campaign })
             resolve('ok')
           } else {
             this.clicks.push({x: new Date(this.allReport[i].date), y: parseFloat((parseFloat(this.allReport[i].clicks)).toFixed(6)), name: this.allReport[i].campaign})
            this.costs.push({ x: new Date(this.allReport[i].date), y: parseFloat((parseFloat(this.allReport[i].costs)/1000000).toFixed(7)), name: this.allReport[i].campaign})
             this.impressions.push({ x: new Date(this.allReport[i].date), y: parseFloat(this.allReport[i].impressions)/1000, name: this.allReport[i].campaign })
             continue
           }
         }
         
       } else {
         resolve('ok')
       }
      
    })
  }
   getImpressions(): Promise<string>{
    return new Promise(resolve => {
       for (let i = 0; i < this.allReport.length; i++){
        
      }
      resolve('ok')
    })
  }
  ngOnInit(): void {
   
    
  }
  public toogleDataSeries = (e)=>{
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	} else{
		e.dataSeries.visible = true;
	}
	this.chart.render();
}

  goSelectCampaign() {
    this.router.navigate(['campaigns/new/select'])
    
  }

}
