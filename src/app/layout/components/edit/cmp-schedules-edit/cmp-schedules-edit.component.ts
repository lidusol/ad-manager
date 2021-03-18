import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { SCHEDULE_INTERFACE, SCHEDULE, User_Role } from 'src/app/utils/data';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatTable } from '@angular/material/table';
import { MatRadioGroup, MatRadioChange } from '@angular/material/radio';
import { GridLine, GridComponent } from '@syncfusion/ej2-angular-grids';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import {take} from 'rxjs/operators'
import { SearchService } from 'src/app/campaigns-management/services/search.service';
@Component({
  selector: 'adf-cmp-schedules-edit',
  templateUrl: './cmp-schedules-edit.component.html',
  styleUrls: ['./cmp-schedules-edit.component.scss']
})
export class CmpSchedulesEditComponent implements OnInit {
  @ViewChild('schedulesExpansion', { static: false }) schedulesExpansion: MatExpansionPanel
  @ViewChild('selectDays') selectDays: MatSelect
  @ViewChild('tableSCHEDULE') tableSCHEDULE: MatTable<SCHEDULE_INTERFACE>;
  @ViewChild('schedulesOptions', { static: false }) schedulesOptions: MatRadioGroup;
  @ViewChild('gridSchedules', { static: false }) gridSchedules: GridComponent;
  daySchedule: FormGroup;
  dateFormStart: FormGroup;
  dateFormEnd: FormGroup;
  expanded = true;
  selected = false;
  selectedBid: string = "CPM"
  daysSchedule = []
  currentDaySelectedId = ""
  currentDaySelectedFR = ""
  currentDaySelectedEN = ""
  currentStartHourText = ""
  currentStartHourHour = ""
  currentStartHourMinute = ""
  currentEndHourText = ""
  currentEndHourHour = ""
  currentEndHourMinute = ""
  startHourSelected = []
  endHourSelected = []
  endScheduleTab = []
  SCHEDULE_DATA: SCHEDULE_INTERFACE[] = []
  scheduleValid = false
  SCHEDULE = SCHEDULE
  daysModel = {}
  startHourModel = {}
  endHourModel = {}
   public gridLines: GridLine;
  
    schedulecheck = '';
  showSchedule = false
   adScheduleSelectDayDisabled = true
  adScheduleSelectStartHourDisabled = true
  adScheduleSelectEndHourDisabled = true
  scheduleOptionSelected = "none"
  componentReady: boolean = true
    DAYS = [
     {
       "id": "Mon",
      "fullDayFrench": "Lundi",
      "fullDayEnglish": "monday"
    },
     {
       "id": "Tue",
       "fullDayFrench": "Mardi",
      "fullDayEnglish": "tuesday"
    },
     {
       "id": "Wed",
       "fullDayFrench": "Mercredi",
      "fullDayEnglish": "wednesday"
    },
      {
       "id": "Thu",
        "fullDayFrench": "Jeudi",
      "fullDayEnglish": "thursday"
    },
       {
       "id": "Fri",
         "fullDayFrench": "Vendredi",
      "fullDayEnglish": "friday"
    },
        {
       "id": "Sat",
          "fullDayFrench": "Samedi",
      "fullDayEnglish": "saturday"
    },
         {
       "id": "Sun",
           "fullDayFrench": "Dimanche",
      "fullDayEnglish": "sunday"
    },
   
  ]

  TIME_VALUE = [
    {
      "h": "00h 00"
    }
  ]
  
  private exportTime = {hour: 7, minute: 15, meriden: 'PM', format: 12};

  private exportTime24 = {hour: 7, minute: 15, meriden: 'PM', format: 24};

  DAYS_CAMPAIGN = []


    scheduleChange(event) {
    //console.log(this.schedulecheck)

    if (this.schedulecheck === 'custom') {
      this.scheduleValid = false
      var self = this
      this.showSchedule = true
     
      setTimeout(() => {
         self.daySchedule = self.fb.group({
           day:  ['', Validators.required],
          startHour: ['', Validators.required],
          endHour: ['', Validators.required],
        });
      },500)
    } else {
     this.scheduleValid = true
      this.showSchedule = false

    }
      
      
    }
  setDay(id: string) {
    for (let day of this.DAYS) {
      if (day.id === id) {
        
      }
      }
  }
  
   onDaySelect(event) {
    if (event.isUserInput) {
      this.daysSchedule = []
       this.daysSchedule.push(
          event.source.value
          
      )
      this.currentDaySelectedId = event.source.value.id
      //console.log(this.currentDaySelectedId)
      this.currentDaySelectedFR = event.source.value.fullDayFrench
      //console.log(`current day selected french ${this.currentDaySelectedFR}`)
      this.currentDaySelectedEN = event.source.value.fullDayEnglish
   
      //console.log(`current day selected english ${this.currentDaySelectedFR}`)
      if (this.daysSchedule.length <= 0) {
        this.adScheduleSelectStartHourDisabled = true 
      
      } else {
        this.adScheduleSelectStartHourDisabled = false 
       
      } 
       /* //console.log(this.daysSchedule) */
      
    }
  }
  onStartHourSelect(event) {
    if (event.isUserInput) {
      this.startHourSelected = []
      this.endHourSelected = []
        this.startHourSelected.push(
          event.source.value
        )
      
      if (this.startHourSelected.length <= 0) {
        
        this.adScheduleSelectEndHourDisabled = true  
   /*      this.endScheduleTab=[] */
          this.currentStartHourText = ""
        this.currentStartHourHour = ""
        this.currentStartHourMinute = ""
      } else {
          this.currentStartHourText = event.source.value.id
        this.currentStartHourHour = event.source.value.hour
        this.currentStartHourMinute = event.source.value.minute
  /*        this.endScheduleTab=[] */
        //console.log(this.SCHEDULE)
        //console.log(this.startHourSelected)
        var splitTimeStart = this.startHourSelected[0]['id'].split(":")
        for (var i = 0; i < this.SCHEDULE.length; i++) {
          var splitTimeSchedule = this.SCHEDULE[i]['text'].split(":")
          if (parseInt(splitTimeSchedule[0]) < parseInt(splitTimeStart[0])) {
            this.endScheduleTab.push({
              'text': this.SCHEDULE[i]['text'],
              'hour': this.SCHEDULE[i]['hour'],
              'minute': this.SCHEDULE[i]['minute'],
              'disabled': false
            })

          } else if ((parseInt(splitTimeSchedule[0]) === parseInt(splitTimeStart[0])) && (parseInt(splitTimeSchedule[1]) < parseInt(splitTimeStart[1]))) {
           
               this.endScheduleTab.push({
              'text': this.SCHEDULE[i]['text'],
              'hour': this.SCHEDULE[i]['hour'],
              'minute': this.SCHEDULE[i]['minute'],
              'disabled': false
            })
            } else if((parseInt(splitTimeSchedule[0]) === parseInt(splitTimeStart[0])) && (parseInt(splitTimeSchedule[1]) === parseInt(splitTimeStart[1]))) {
              this.endScheduleTab.push({
              'text': this.SCHEDULE[i]['text'],
              'hour': this.SCHEDULE[i]['hour'],
              'minute': this.SCHEDULE[i]['minute'],
              'disabled': false
            })
            
          } else  {
              this.endScheduleTab.push({
              'text': this.SCHEDULE[i]['text'],
              'hour': this.SCHEDULE[i]['hour'],
              'minute': this.SCHEDULE[i]['minute'],
              'disabled': false
            })
          }
        }
         this.adScheduleSelectEndHourDisabled = false 
      }
       //console.log(this.startHourSelected)
  
    }
  }
  onEndHourSelect(event) {
    if (event.isUserInput) {
        this.endHourSelected = []
        this.endHourSelected.push(
          event.source.value
        )
        this.currentEndHourText = event.source.value.id
        this.currentEndHourHour = event.source.value.hour
        this.currentEndHourMinute = event.source.value.minute
       //console.log(this.endHourSelected)
  
    }
  }
  addSingleSchedule() {
    
    this.SCHEDULE_DATA.push({
      "id": this.currentDaySelectedId,
      "dayFR": this.currentDaySelectedFR,
      "dayEN": this.currentDaySelectedEN.toUpperCase(),
      "start_hour_text": this.currentStartHourText,
      "end_hour_text": this.currentEndHourText,
      "startHour": this.currentStartHourHour,
      "endHour": this.currentEndHourHour,
      "startMinute": this.currentStartHourMinute,
      "endMinute": this.currentEndHourMinute

    })
    this.scheduleValid = true
    //console.log(this.SCHEDULE_DATA)

  
   /*  let data: SCHEDULE_INTERFACE[] = [];
    data = (this.tableSCHEDULE.dataSource as SCHEDULE_INTERFACE[]); */
    /* if (this.tableSCHEDULE.dataSource) {
    } */
   /*  data.push(this.SCHEDULE_DATA[data.length]); */
   /*  this.tableSCHEDULE.dataSource = this.SCHEDULE_DATA */
    /* this.tableSCHEDULE.renderRows(); */
  
    //console.log(this.SCHEDULE_DATA)
    for (var i = 0; i < this.DAYS_CAMPAIGN.length; i++){
      if (this.DAYS_CAMPAIGN[i]['fullDayFrench'] === this.currentDaySelectedFR) {
        this.DAYS_CAMPAIGN.splice(i,1)
      }
    }
    
     this.tableSCHEDULE.renderRows() 
    this.currentDaySelectedFR = ""
     this.currentDaySelectedEN = ""
     this.currentStartHourText = ""
        this.currentStartHourHour = ""
    this.currentStartHourMinute = ""
     this.currentEndHourText = ""
        this.currentEndHourHour = ""
    this.currentEndHourMinute = ""
    this.startHourSelected = []
    this.endHourSelected = []
    this.adScheduleSelectStartHourDisabled = true
    this.adScheduleSelectEndHourDisabled = true

  }

  deleteSCHEDULE(id, dayFR, dayEN) {
    for (var i = 0; i < this.SCHEDULE_DATA.length; i++) {
      if (this.SCHEDULE_DATA[i]['dayFR'] === dayFR) {
        this.SCHEDULE_DATA.splice(i, 1)
      }
    }
    this.DAYS_CAMPAIGN.push({
       "id": id,
            "fullDayFrench": dayFR,
            "fullDayEnglish": dayEN
    })
    this.tableSCHEDULE.renderRows()

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
      this.schedulesExpansion.open(); // Here's the magic
    }else{
      this.schedulesExpansion.close()
    }
  }
 
  skills = new FormArray([]);
 
  formOvered(i: number) {
    if (this.skills.length!==1) {
      document.getElementById('schedule-'+i.toFixed()).classList.remove('d-none')
      
    }
  }
    formLeaved(i: number) {
      document.getElementById('schedule-'+i.toFixed()).classList.add('d-none')
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      if (this.scheduleOptionSelected === "custom") {
        this.addSkill()
      }
      
    }, 1000);
  }

   addSkill() {
    const group = new FormGroup({
      day: new FormControl('', [Validators.required]),
      startHour: new FormControl('', [Validators.required]),
      endHour: new FormControl('', [Validators.required]),
    });

    this.skills.push(group);
   }
  removeSkill(index: number) {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
       
     }
  }

  public getSchedules(): Promise<string> {
    return new Promise(resolve => {
      if (this.scheduleOptionSelected === 'none') {
        resolve('ok')
      } else {
        
        let promise = (status: string) => {
          resolve(status)
        }
        if (this.skills.length > 0) {
          if (this.skills.valid) {
            this.SCHEDULE_DATA = []
            for (let i = 0; i < this.skills.length; i++ ) {
              let form = this.skills.controls[i] as FormGroup
              //console.log(form)
              this.SCHEDULE_DATA.push({
                  "id": form.controls.day.value.id,
                  "dayFR": form.controls.day.value.fullDayFrench,
                  "dayEN": form.controls.day.value.fullDayEnglish.toUpperCase(),
                  "start_hour_text": form.controls.startHour.value.id,
                  "end_hour_text": form.controls.endHour.value.id,
                  "startHour": form.controls.startHour.value.hour,
                  "endHour": form.controls.endHour.value.hour,
                  "startMinute": form.controls.startHour.value.minute,
                  "endMinute": form.controls.endHour.value.minute
      
              })
              //console.log(this.SCHEDULE_DATA)
              if (this.SCHEDULE_DATA.length === this.skills.length) {
                this.componentReady = true
                promise('ok')
              }
              
            }
            
          } else {
            this.componentReady = false
            promise('error')
          }
          
        } else {
          this.componentReady = false
          promise('ok')
        }
      }
      
    })
  }

  register(args: MatRadioChange) {
    if (args.value === 'none') {
      this.componentReady = true
    } else {
      this.addSkill()
      this.componentReady = false
    }
  }
   aacid: string = ""
  cid: string = undefined
  uid: string = undefined;
  campaignId: number = 0
  campaignType: string = ""
  ad_group_id: number = 0
  idA: string = ""
  adf_account_id: string = ""
  uid_action: string= ""
  user_access: User_Role;
  currentLandingPage: string  =""
  constructor(private displayService: DisplayService, private searchService: SearchService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private storageService: LocalStorageService, private youtubeService: YoutubeService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        this.storageService.getUserIdAndAccountId().then(response => {
          if (response !== null) {
            this.aacid = response.aacid
            this.user_access  = response.role
            if (response.fromOwned) {
                this.uid_action = response.auid
               
              
              this.cid = params['cid'];
                   this.uid = response.auid
                    setTimeout(() => {
      this.daysModel = {'id': "00:00", 'hour': '0', 'minute': "ZERO"}
    this.startHourModel = this.SCHEDULE[0]
    this.endHourModel = this.SCHEDULE[1]
    },1000)
       this.getCampaignData()
              
            
                
            } else {
              
              this.uid_action = response.account.owner
       
              
              this.cid = params['cid'];
                 this.uid = response.auid;
                 setTimeout(() => {
      this.daysModel = {'id': "00:00", 'hour': '0', 'minute': "ZERO"}
    this.startHourModel = this.SCHEDULE[0]
    this.endHourModel = this.SCHEDULE[1]
    },1000)
       this.getCampaignData()
              
           
                
              }
           
            
          
          }
          })
    
    })
   
 }
  compareDays(o1: any, o2: any): boolean {
    return o1.fullDayFrench === o2.fullDayFrench && o1.id === o2.id;
  }
  compareStartHours(o1: any, o2: any): boolean {
    //console.log(o1)
    //console.log(o2)
    return o1.id === o2.id && o1.hour === o2.hour && o1.minute === o2.minute;
  }
  compareEndHours(o1: any, o2: any): boolean {
    return o1.id === o2.id && o1.hour === o2.hour && o1.minute === o2.minute;

  }
  
  
  currentSchedules: SCHEDULE_INTERFACE[] = []
  newSchedules: SCHEDULE_INTERFACE[] = []
  getCampaignData() {
    if (window.location.pathname === '/campaigns/settings/display') {
     this.displayService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
            this.campaignId = campaign.id_campagne
            this.campaignType = campaign.type
            this.currentSchedules = campaign.adsSchedules
            if (campaign.adsSchedules.length > 0) {
              if (this.campaignId === 0) {
                  this.scheduleOptionSelected = "custom"
              this.skills.setValue([])
              this.skills.reset()
              
                for (let schedule of campaign.adsSchedules) {
                  let group = new FormGroup({
                    day: new FormControl({ 'id': schedule.id.toString(), 'fullDayFrench': schedule.dayFR, 'fullDayEnglish': schedule.dayEN.toLowerCase() }, [Validators.required]),
                    startHour: new FormControl({ 'id': schedule.start_hour_text,  'hour': schedule.startHour, 'minute': schedule.startMinute }, [Validators.required]),
                    endHour: new FormControl({ 'id': schedule.end_hour_text, 'hour': schedule.endHour, 'minute': schedule.endMinute }, [Validators.required]),
                  });
                
                

               
                  //console.log(group.controls.day.value)
                  group.controls.day.updateValueAndValidity()
                  this.skills.push(group);
              
                }
              } else {
                this.scheduleOptionSelected = "custom"
                
                
              }
            
            } else {
              this.scheduleOptionSelected = 'none'
           }
            }
          })
    } else if (window.location.pathname === '/campaigns/settings/native') {
      this.youtubeService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
              this.campaignId = campaign.id_campagne
            this.currentSchedules = campaign.adsSchedules
            if (campaign.adsSchedules.length > 0) {
              if (this.campaignId === 0) {
                  this.scheduleOptionSelected = "custom"
              this.skills.setValue([])
              this.skills.reset()
              
                for (let schedule of campaign.adsSchedules) {
                  let group = new FormGroup({
                    day: new FormControl({ 'id': schedule.id.toString(), 'fullDayFrench': schedule.dayFR, 'fullDayEnglish': schedule.dayEN.toLowerCase() }, [Validators.required]),
                    startHour: new FormControl({ 'id': schedule.start_hour_text,  'hour': schedule.startHour, 'minute': schedule.startMinute }, [Validators.required]),
                    endHour: new FormControl({ 'id': schedule.end_hour_text, 'hour': schedule.endHour, 'minute': schedule.endMinute }, [Validators.required]),
                  });
                
                

               
                  //console.log(group.controls.day.value)
                  group.controls.day.updateValueAndValidity()
                  this.skills.push(group);
              
                }
              } else {
                this.scheduleOptionSelected = "custom"
                
                
              }
            
            } else {
              this.scheduleOptionSelected = 'none'
           }
            }
          })
    }else if (window.location.pathname === '/campaigns/settings/search') {
      this.searchService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
              this.campaignId = campaign.id_campagne
            this.currentSchedules = campaign.adsSchedules
            if (campaign.adsSchedules.length > 0) {
              if (this.campaignId === 0) {
                  this.scheduleOptionSelected = "custom"
              this.skills.setValue([])
              this.skills.reset()
              
                for (let schedule of campaign.adsSchedules) {
                  let group = new FormGroup({
                    day: new FormControl({ 'id': schedule.id.toString(), 'fullDayFrench': schedule.dayFR, 'fullDayEnglish': schedule.dayEN.toLowerCase() }, [Validators.required]),
                    startHour: new FormControl({ 'id': schedule.start_hour_text,  'hour': schedule.startHour, 'minute': schedule.startMinute }, [Validators.required]),
                    endHour: new FormControl({ 'id': schedule.end_hour_text, 'hour': schedule.endHour, 'minute': schedule.endMinute }, [Validators.required]),
                  });
                
                

               
                  //console.log(group.controls.day.value)
                  group.controls.day.updateValueAndValidity()
                  this.skills.push(group);
              
                }
              } else {
                this.scheduleOptionSelected = "custom"
                
                
              }
            
            } else {
              this.scheduleOptionSelected = 'none'
           }
            }
          })
    } else {
      this.router.navigate(['/campaigns'])
   } 
    
  }
  public checkStartHourDisabledOrNot(h: number, m: number) {
    let selected = this.skills.controls.filter((skill: FormGroup) => skill.controls.day.value.id === this.currentDaySelectedId) as FormGroup[]
    
    if (selected.length > 0) {
      if (selected[selected.length - 2] !== undefined) {
        let dayId = selected[selected.length - 2].controls.day.value.id
        let startHour  = selected[selected.length-2].controls.startHour.value.h
        let endHour = selected[selected.length - 2].controls.endHour.value.h
        let startMinute  = selected[selected.length-2].controls.startHour.value.h
      let endMinute = selected[selected.length - 2].controls.endHour.value.m
        if (dayId === this.currentDaySelectedId) {
          if (startHour !== undefined && endHour !== undefined) {
            if (endHour >= h) {
              if (endHour > h) {
                return true
              } else if (endHour === h) {
                if (endMinute > m) {
                  return true
                } else if (endMinute === m) {
                  return true
                } else if(endMinute < m) {
                  return false
                } else {
                  return true
                }
              }
            } else if (endHour < h) {
              return false
            }else{
              return true
            }
          
            
          } else {
            return false
          }
          
        }
        
      } else {
        return false
      }         

    } else {
      return false
    }
  }


  public spinnerUpdate: boolean = false
  updateSchedules() {
    this.spinnerUpdate = true
     if (window.location.pathname === '/campaigns/settings/display') {
    this.getSchedules().then(res => {
      if (res === "ok") {
      
            if (this.campaignId === 0) {
              this.displayService.updateCampaign(this.cid, { adsSchedules: this.SCHEDULE_DATA }).then(update => {
              if (update === "ok") {
                this.spinnerUpdate = false
                this.togglePanel(event)
                this.getCampaignData()
              } else {
                this.spinnerUpdate = false
              }
            }).catch((e) => {
            this.spinnerUpdate = false
          
        })
              
            } else {
                if (this.scheduleOptionSelected === 'none') {
          if (this.currentSchedules.length > 0) {
            this.displayService.removeAdsSchedules(this.currentSchedules, this.cid, this.campaignId).then(remove => {
      if (remove === "ok") {
         this.displayService.updateCampaign(this.cid, { adsSchedules: [] }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        }).catch((e) => {
            this.spinnerUpdate = false
          
        })
      } else {
        this.gridSchedules.hideSpinner()
      }
    })
          } else {
             this.displayService.updateCampaign(this.cid, { adsSchedules: [] }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
             }).catch((e) => {
            this.spinnerUpdate = false
          
        })
          }
        } else{
          if (this.currentSchedules.length === 0) {
            this.displayService.targetNewSchedules(this.SCHEDULE_DATA, this.cid, this.campaignId, this.currentSchedules).then(res_target_schedules => {
              if (res_target_schedules === "ok") {
                this.spinnerUpdate = false
                for (let i = 0; i < this.skills.length; i++){
                this.skills.removeAt(i)
              }
                this.getCampaignData()
              } else {
                this.spinnerUpdate = false
              }
            }).catch((e) => {
              this.spinnerUpdate = false
            })
          } else {
            this.displayService.targetNewSchedules(this.SCHEDULE_DATA, this.cid, this.campaignId, this.currentSchedules).then(res_target_schedules => {
              if (res_target_schedules === "ok") {
                this.spinnerUpdate = false
                for (let i = 0; i < this.skills.length; i++){
                this.skills.removeAt(i)
              }
                this.getCampaignData()
                this.addSkill()
              } else {
                this.spinnerUpdate = false
              }
            }).catch((e) => {
              this.spinnerUpdate = false
            })
          }
          
        }
            }
      } else {
         this.spinnerUpdate = false
      }
    })
    } else if (window.location.pathname === '/campaigns/settings/native') {
      this.getSchedules().then(res => {
        if (res === "ok") {
        
        if (this.campaignId === 0) {
          this.youtubeService.updateCampaign(this.cid, { adsSchedules: this.SCHEDULE_DATA }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        }).catch((e) => {
            this.spinnerUpdate = false
          
        })
          
        } else {
             if (this.scheduleOptionSelected === 'none') {
          if (this.currentSchedules.length > 0) {
            this.youtubeService.removeAdsSchedules(this.currentSchedules, this.cid, this.campaignId).then(remove => {
      if (remove === "ok") {
         this.youtubeService.updateCampaign(this.cid, { adsSchedules: [] }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        }).catch((e) => {
            this.spinnerUpdate = false
          
        })
      } else {
        this.gridSchedules.hideSpinner()
      }
    })
          } else {
             this.youtubeService.updateCampaign(this.cid, { adsSchedules: [] }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        }).catch((e) => {
            this.spinnerUpdate = false
          
        })
          }
        } else{
          if (this.currentSchedules.length === 0) {
            this.youtubeService.targetNewSchedules(this.SCHEDULE_DATA, this.cid, this.campaignId, this.currentSchedules).then(res_target_schedules => {
              if (res_target_schedules === "ok") {
                this.spinnerUpdate = false
                for (let i = 0; i < this.skills.length; i++){
                this.skills.removeAt(i)
              }
                this.getCampaignData()
              } else {
                this.spinnerUpdate = false
              }
            }).catch((e) => {
              this.spinnerUpdate = false
            })
          } else {
            this.youtubeService.targetNewSchedules(this.SCHEDULE_DATA, this.cid, this.campaignId, this.currentSchedules).then(res_target_schedules => {
              if (res_target_schedules === "ok") {
                this.spinnerUpdate = false
                for (let i = 0; i < this.skills.length; i++){
                this.skills.removeAt(i)
              }
                this.getCampaignData()
                this.addSkill()
              } else {
                this.spinnerUpdate = false
              }
            }).catch((e) => {
              this.spinnerUpdate = false
            })
          }
          
        }
        }
        } else {
           this.spinnerUpdate = false
      }
    })
    }else if (window.location.pathname === '/campaigns/settings/search') {
      this.getSchedules().then(res => {
        if (res === "ok") {
        
        if (this.campaignId === 0) {
          this.searchService.updateCampaign(this.cid, { adsSchedules: this.SCHEDULE_DATA }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        }).catch((e) => {
            this.spinnerUpdate = false
          
        })
          
        } else {
             if (this.scheduleOptionSelected === 'none') {
          if (this.currentSchedules.length > 0) {
            this.searchService.removeAdsSchedules(this.currentSchedules, this.cid, this.campaignId).then(remove => {
      if (remove === "ok") {
         this.searchService.updateCampaign(this.cid, { adsSchedules: [] }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        }).catch((e) => {
            this.spinnerUpdate = false
          
        })
      } else {
        this.gridSchedules.hideSpinner()
      }
    })
          } else {
             this.searchService.updateCampaign(this.cid, { adsSchedules: [] }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        }).catch((e) => {
            this.spinnerUpdate = false
          
        })
          }
        } else{
          if (this.currentSchedules.length === 0) {
            this.searchService.targetNewSchedules(this.SCHEDULE_DATA, this.cid, this.campaignId, this.currentSchedules).then(res_target_schedules => {
              if (res_target_schedules === "ok") {
                this.spinnerUpdate = false
                for (let i = 0; i < this.skills.length; i++){
                this.skills.removeAt(i)
              }
                this.getCampaignData()
              } else {
                this.spinnerUpdate = false
              }
            }).catch((e) => {
              this.spinnerUpdate = false
            })
          } else {
            this.searchService.targetNewSchedules(this.SCHEDULE_DATA, this.cid, this.campaignId, this.currentSchedules).then(res_target_schedules => {
              if (res_target_schedules === "ok") {
                this.spinnerUpdate = false
                for (let i = 0; i < this.skills.length; i++){
                this.skills.removeAt(i)
              }
                this.getCampaignData()
                this.addSkill()
              } else {
                this.spinnerUpdate = false
              }
            }).catch((e) => {
              this.spinnerUpdate = false
            })
          }
          
        }
        }
        } else {
           this.spinnerUpdate = false
      }
    })
    } else {
      this.router.navigate(['/campaigns'])
   }
    
  
  }

  removeScheduleFromGrid(schedule: SCHEDULE_INTERFACE) {
    this.gridSchedules.showSpinner()
    if (this.campaignType === 'Display' || this.campaignType === 'DISPLAY') {
      this.displayService.removeAdsSchedules([schedule], this.cid, this.campaignId).then(remove => {
      if (remove === "ok") {
        this.gridSchedules.hideSpinner()
        
        this.getCampaignData()
      } else {
        this.gridSchedules.hideSpinner()
      }
    })
    } else if (this.campaignType === 'YOUTUBE' || this.campaignType === 'Youtube' || this.campaignType === 'Native' || this.campaignType === 'NATIVE') {
      this.youtubeService.removeAdsSchedules([schedule], this.cid, this.campaignId).then(remove => {
      if (remove === "ok") {
        this.gridSchedules.hideSpinner()
        
        this.getCampaignData()
      } else {
        this.gridSchedules.hideSpinner()
      }
    })
    } else if (this.campaignType === 'Search') {
      this.searchService.removeAdsSchedules([schedule], this.cid, this.campaignId).then(remove => {
      if (remove === "ok") {
        this.gridSchedules.hideSpinner()
        
        this.getCampaignData()
      } else {
        this.gridSchedules.hideSpinner()
      }
    })
    }
    
  }

}
