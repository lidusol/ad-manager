import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import { MatRadioChange } from '@angular/material/radio';
import { MatDatepicker } from '@angular/material/datepicker';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User_Role, DATE_OPTIONS_WITH_FULL_TIME } from 'src/app/utils/data';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { take } from 'rxjs/operators';
import { SearchService } from 'src/app/campaigns-management/services/search.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'adf-cmp-dates-edit',
  templateUrl: './cmp-dates-edit.component.html',
  styleUrls: ['./cmp-dates-edit.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class CmpDatesEditComponent implements OnInit {
  @ViewChild('dateExpansion', { static: false }) dateExpansion: MatExpansionPanel
  @ViewChild('pickerEnd', { static: false }) pickerEndCmp: MatDatepicker<any>
  
  endDateType: string = "1"
  expanded = true;
  selected = false;
  selectedBid: string = "CPM"
  minDateStart: Date;
  minDateEnd: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
  public startDate: string = ""
  public endDate: string = ""
  public startDateFrench: string = ""
  public endDateFrench: string = ""
  public startDateFormattedGoogle: string = ""
  public endDateFormattedGoogle: string = "20371230"
  public startDateEnglish: string = ""
  public endDateEnglish: string = ""
  componentReady: boolean = false
  public noEndDate: boolean = true
  public numberOfDays: number = 0
  
  

  radioSelectChange(args: MatRadioChange) {
    if (args.value === "1") {
      this.endDate = ""
      this.endDateFrench = ""
      this.endDateEnglish = ""
      this.endDateFormattedGoogle = "20371230"
      this.noEndDate = true
    } else {
      this.noEndDate = false
    }
  }

  componentSelected($event) {
    this.selected = !this.selected;
    event.stopPropagation();
  
  }

  buttonClick($event) {
    this.selected = !this.selected;
    event.stopPropagation();
  }

  togglePanel($event) {
    this.expanded = !this.expanded;
    //event.stopPropagation();
  }

  expandPanel(event): void {
    event.stopPropagation(); // Preventing event bubbling

    if (this.expanded) {
      this.dateExpansion.open(); // Here's the magic
    }else{
      this.dateExpansion.close()
    }
  }
  dateStartCtrl = new FormControl((new Date()).toISOString());
  dateEndCtrl = new FormControl();
    aacid: string = ""
  cid: string = undefined
  uid: string = undefined;
  campaignId: number = 0
  ad_group_id: number = 0
  idA: string = ""
  adf_account_id: string = ""
  uid_action: string= ""
  user_access: User_Role;
  currentLandingPage: string  =""
  constructor(private displayService: DisplayService, private searchService: SearchService, private router: Router, private route: ActivatedRoute, private dateAdapter: DateAdapter<any>, private storageService: LocalStorageService, private youtubeService: YoutubeService) { 
     this.dateStartCtrl.valueChanges.subscribe(x => {
      this.startDate = x._d
      let startDate = new Date(x._d)
      //this.minDateEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate() + 1)
      //this.dateEndCtrl.setValue('')
      var start = new Date(x._d);
   
      this.startDateFrench = [('0' + (start.getDate())).slice(-2), ('0' + (start.getMonth() + 1)).slice(-2), start.getFullYear()].join('/');
      this.startDateFormattedGoogle = [start.getFullYear(),('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2),].join('');
      this.startDateEnglish = [('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2), start.getFullYear()].join('-');
   
      
    })
    /* this.dateEndCtrl.valueChanges.subscribe(x => {
      if (this.endDateType === '1') {
        this.endDateType="2"
      }
      this.endDate = x._d
      console.log(this.endDate)
      var end = new Date(x._d);
       this.endDateFrench = [('0' + (end.getDate())).slice(-2), ('0' + (end.getMonth() + 1)).slice(-2), end.getFullYear()].join('/');
      this.endDateFormattedGoogle = [end.getFullYear(), ('0' + (end.getMonth() + 1)).slice(-2), ('0' + (end.getDate())).slice(-2)].join('');
      this.endDateEnglish = [('0' + (end.getMonth() + 1)).slice(-2), ('0' + (end.getDate())).slice(-2), end.getFullYear()].join('-');
      var debut = new Date(this.dateStartCtrl.value); 
      this.numberOfDays = parseInt((((end.getTime() - debut.getTime()) / (1000 * 3600 * 24)) + 1).toFixed(0));
    })
     */
  }

  getDates():Promise<string> {
    return new Promise(resolve => {
      if (this.endDateType === "2") {
        if (this.endDateFrench !== '') {
          this.componentReady = true
          resolve('ok')
        } else {
          this.componentReady = true
          resolve('ok')
        } 
      } else {
        this.componentReady = true
        resolve('ok')
      }
    })
  }

 ngOnInit(): void {
       this.route.queryParams.subscribe(params => {
        this.storageService.getUserIdAndAccountId().then(response => {
          if (response !== null) {
            this.aacid = response.aacid
            this.user_access = response.role
            if (response.fromOwned) {
                this.uid_action = response.auid
               
              
              this.cid = params['cid'];
                   this.uid = response.auid
       
       this.getCampaignData()
              
            
                
            } else {
              
              this.uid_action = response.account.owner
       
              
              this.cid = params['cid'];
                 this.uid = response.auid;
         
       this.getCampaignData()
              
           
                
              }
           
            
          
          }
          })
    
    })
 }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
      /* let startDate = new Date()
      this.minDateEnd = new Date(startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate()+1) */
  }

  
  showDateModifiedMessage: boolean = false
  getCampaignData() {
   if (window.location.pathname === '/campaigns/settings/display') {
     this.displayService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
           this.dateAdapter.setLocale('fr');
      
            let startDate = new Date(campaign.startDateEnglish)
            startDate.setHours(0, 0, 0, 0)
            let today = new Date()
            today.setHours(0, 0, 0, 0)
            
            if (today.getTime() > startDate.getTime()) {
              //startDate = new Date()
             this.showDateModifiedMessage = true
              console.log(this.startDate)
              var start = new Date();
              this.dateStartCtrl.setValue(new Date())
               this.startDate = new Date().toLocaleString('fr-FR', DATE_OPTIONS_WITH_FULL_TIME)
           
              this.startDateFrench = [('0' + (start.getDate())).slice(-2), ('0' + (start.getMonth() + 1)).slice(-2), start.getFullYear()].join('/');
      this.startDateFormattedGoogle = [start.getFullYear(),('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2),].join('');
      this.startDateEnglish = [('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2), start.getFullYear()].join('-');
            } else {
              this.showDateModifiedMessage = false
               this.startDate = new Date(campaign.startDateEnglish).toLocaleString()
              var start = new Date(campaign.startDateEnglish);
              this.dateStartCtrl.setValue(start)
              this.startDateFrench = [('0' + (start.getDate())).slice(-2), ('0' + (start.getMonth() + 1)).slice(-2), start.getFullYear()].join('/');
      this.startDateFormattedGoogle = [start.getFullYear(),('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2),].join('');
      this.startDateEnglish = [('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2), start.getFullYear()].join('-');
            } 

            }
          })
    } else if (window.location.pathname === '/campaigns/settings/native') {
      this.youtubeService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
           this.dateAdapter.setLocale('fr');
      
     
            let startDate = new Date(campaign.startDateEnglish)
            startDate.setHours(0, 0, 0, 0)
            let today = new Date()
            today.setHours(0, 0, 0, 0)
            
            if (today.getTime() > startDate.getTime()) {
              //startDate = new Date()
             this.showDateModifiedMessage = true
              console.log(this.startDate)
              var start = new Date();
              this.dateStartCtrl.setValue(new Date())
               this.startDate = new Date().toLocaleString('fr-FR', DATE_OPTIONS_WITH_FULL_TIME)
           
              this.startDateFrench = [('0' + (start.getDate())).slice(-2), ('0' + (start.getMonth() + 1)).slice(-2), start.getFullYear()].join('/');
      this.startDateFormattedGoogle = [start.getFullYear(),('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2),].join('');
      this.startDateEnglish = [('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2), start.getFullYear()].join('-');
            } else {
              this.showDateModifiedMessage = false
               this.startDate = new Date(campaign.startDateEnglish).toLocaleString()
              var start = new Date(campaign.startDateEnglish);
              this.dateStartCtrl.setValue(start)
              this.startDateFrench = [('0' + (start.getDate())).slice(-2), ('0' + (start.getMonth() + 1)).slice(-2), start.getFullYear()].join('/');
      this.startDateFormattedGoogle = [start.getFullYear(),('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2),].join('');
      this.startDateEnglish = [('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2), start.getFullYear()].join('-');
            } 
      /* this.minDateEnd = new Date(new Date().getFullYear(), startDate.getMonth(), startDate.getDate() + 1)
      this.dateEndCtrl.setValue('') */
            }
          })
    }else if (window.location.pathname === '/campaigns/settings/search') {
      this.searchService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
           this.dateAdapter.setLocale('fr');
      
     
            let startDate = new Date(campaign.startDateEnglish)
            startDate.setHours(0, 0, 0, 0)
            let today = new Date()
            today.setHours(0, 0, 0, 0)
            
            if (today.getTime() > startDate.getTime()) {
              //startDate = new Date()
             this.showDateModifiedMessage = true
              console.log(this.startDate)
              var start = new Date();
              this.dateStartCtrl.setValue(new Date())
               this.startDate = new Date().toLocaleString('fr-FR', DATE_OPTIONS_WITH_FULL_TIME)
           
              this.startDateFrench = [('0' + (start.getDate())).slice(-2), ('0' + (start.getMonth() + 1)).slice(-2), start.getFullYear()].join('/');
      this.startDateFormattedGoogle = [start.getFullYear(),('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2),].join('');
      this.startDateEnglish = [('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2), start.getFullYear()].join('-');
            } else {
              this.showDateModifiedMessage = false
               this.startDate = new Date(campaign.startDateEnglish).toLocaleString()
              var start = new Date(campaign.startDateEnglish);
              this.dateStartCtrl.setValue(start)
              this.startDateFrench = [('0' + (start.getDate())).slice(-2), ('0' + (start.getMonth() + 1)).slice(-2), start.getFullYear()].join('/');
      this.startDateFormattedGoogle = [start.getFullYear(),('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2),].join('');
      this.startDateEnglish = [('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2), start.getFullYear()].join('-');
            } 
      /* this.minDateEnd = new Date(new Date().getFullYear(), startDate.getMonth(), startDate.getDate() + 1)
      this.dateEndCtrl.setValue('') */
            }
          })
    } else {
      this.router.navigate(['/campaigns'])
   }
    
  }

  public spinnerUpdate: boolean = false
  updateDates() {
    this.spinnerUpdate = true
    if (window.location.pathname === '/campaigns/settings/display') {
    this.displayService.updateCampaign(this.cid, { startDate: this.startDate, startDateFrench: this.startDateFrench, startDateFormattedGoogle: this.startDateFormattedGoogle, startDateEnglish: this.startDateEnglish }).then(update => {
        if (update === "ok") {
          this.spinnerUpdate = false
          this.showDateModifiedMessage = false
          this.togglePanel(event)
          this.getCampaignData()
        } else {
          this.spinnerUpdate = false
        }
     }).catch((e) => {
        this.spinnerUpdate = false
      })
    } else if (window.location.pathname === '/campaigns/settings/native') {
      this.youtubeService.updateCampaign(this.cid, { startDate: this.startDate, startDateFrench: this.startDateFrench, startDateFormattedGoogle: this.startDateFormattedGoogle, startDateEnglish: this.startDateEnglish }).then(update => {
        if (update === "ok") {
          this.spinnerUpdate = false
          this.showDateModifiedMessage = false
          this.togglePanel(event)
          this.getCampaignData()
        } else {
          this.spinnerUpdate = false
        }
     }).catch((e) => {
        this.spinnerUpdate = false
      })
    }else if (window.location.pathname === '/campaigns/settings/search') {
      this.searchService.updateCampaign(this.cid, { startDate: this.startDate, startDateFrench: this.startDateFrench, startDateFormattedGoogle: this.startDateFormattedGoogle, startDateEnglish: this.startDateEnglish }).then(update => {
        if (update === "ok") {
          this.spinnerUpdate = false
          this.showDateModifiedMessage = false
          this.togglePanel(event)
          this.getCampaignData()
        } else {
          this.spinnerUpdate = false
        }
     }).catch((e) => {
        this.spinnerUpdate = false
      })
    } else {
      this.router.navigate(['/campaigns'])
   }
     
  }

}
