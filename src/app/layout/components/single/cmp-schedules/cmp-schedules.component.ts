import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { SCHEDULE_INTERFACE, SCHEDULE } from 'src/app/utils/data';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatTable } from '@angular/material/table';
import { MatRadioGroup, MatRadioChange } from '@angular/material/radio';



@Component({
  selector: 'adf-cmp-schedules',
  templateUrl: './cmp-schedules.component.html',
  styleUrls: ['./cmp-schedules.component.scss']
})
export class CmpSchedulesComponent implements OnInit {
  @ViewChild('schedulesExpansion', { static: false }) schedulesExpansion: MatExpansionPanel
  @ViewChild('selectDays') selectDays: MatSelect
  @ViewChild('tableSCHEDULE') tableSCHEDULE: MatTable<SCHEDULE_INTERFACE>;
  @ViewChild('schedulesOptions', { static: false }) schedulesOptions: MatRadioGroup;
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
  
    schedulecheck = '';
  showSchedule = false
   adScheduleSelectDayDisabled = true
  adScheduleSelectStartHourDisabled = true
  adScheduleSelectEndHourDisabled = true
  scheduleOptionSelected = "custom"
  componentReady: boolean = true
    DAYS = [
     {
       "id": "Mon",
      "fullDayFrench": "Lundi",
      "fullDayEnglish": "Monday"
    },
     {
       "id": "Tue",
       "fullDayFrench": "Mardi",
      "fullDayEnglish": "Tuesday"
    },
     {
       "id": "Wed",
       "fullDayFrench": "Mercredi",
      "fullDayEnglish": "Wednesday"
    },
      {
       "id": "Thu",
        "fullDayFrench": "Jeudi",
      "fullDayEnglish": "Thursday"
    },
       {
       "id": "Fri",
         "fullDayFrench": "Vendredi",
      "fullDayEnglish": "Friday"
    },
        {
       "id": "Sat",
          "fullDayFrench": "Samedi",
      "fullDayEnglish": "Saturday"
    },
         {
       "id": "Sun",
           "fullDayFrench": "Dimanche",
      "fullDayEnglish": "Sunday"
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
           this.currentDaySelectedFR = event.source.value.fullDayFrench
      //console.log(`current day selected english ${this.currentDaySelectedFR}`)
      this.currentDaySelectedEN = event.source.value.fullDayEnglish
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
  constructor(private fb: FormBuilder) { }
  skills = new FormArray([]);
  ngOnInit(): void {
   /*  this.daySchedule = this.fb.group({
  
           day:  [this.DAYS[0], Validators.required],
          startHour: [this.SCHEDULE[0], Validators.required],
          endHour: ['', Validators.required],
}); */
    this.addSkill()
    setTimeout(() => {
      this.daysModel = {'id': "00:00", 'hour': '0', 'minute': "ZERO"}
    this.startHourModel = this.SCHEDULE[0]
    this.endHourModel = this.SCHEDULE[1]
    },1000)
  } 
  formOvered(i: number) {
    if (this.skills.length!==1) {
      document.getElementById(i.toFixed()).classList.remove('d-none')
      
    }
  }
    formLeaved(i: number) {
      document.getElementById(i.toFixed()).classList.add('d-none')
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
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
      this.componentReady = false
    }
  }

}
