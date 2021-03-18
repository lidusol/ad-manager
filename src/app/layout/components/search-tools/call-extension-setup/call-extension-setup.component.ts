import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatTable } from '@angular/material/table';
import { CountryISO, NgxIntlTelInputComponent, SearchCountryField, TooltipLabel } from 'ngx-intl-tel-input';
import { Country } from 'ngx-intl-tel-input/lib/model/country.model';
import { SearchService } from 'src/app/campaigns-management/services/search.service';
import { PHONE_TYPE, SCHEDULE, SCHEDULE_INTERFACE, User_Role } from 'src/app/utils/data';
import { SnackbarComponent } from '../../snackbar/snackbar.component';

@Component({
  selector: 'adf-call-extension-setup',
  templateUrl: './call-extension-setup.component.html',
  styleUrls: ['./call-extension-setup.component.scss']
})
export class CallExtensionSetupComponent implements OnInit {
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Senegal, CountryISO.CôteDIvoire, CountryISO.Mali];
  selectedCountry: Country;
  selectedCountryISO: CountryISO = CountryISO.Senegal;
  phone: FormControl = new FormControl('', [Validators.required])
  PHONE_DATA: PHONE_TYPE = null;
  PREVIOUS_DATA: PHONE_TYPE = null;
  daySchedule: FormGroup;
  dateFormStart: FormGroup;
  dateFormEnd: FormGroup;
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
  campaignId: number = 0
  cid: string = ''
  showSaveBlock: boolean = false
  spinnerUpdate: boolean = false
  user_access: User_Role;
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
  skills = new FormArray([]);
  formOvered(i: number) {
    if (this.skills.length!==1) {
      document.getElementById(i.toFixed()).classList.remove('d-none')
      
    }
  }
    formLeaved(i: number) {
      document.getElementById(i.toFixed()).classList.add('d-none')
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
  
  @ViewChild('selectDays') selectDays: MatSelect
  @ViewChild('tableSCHEDULE') tableSCHEDULE: MatTable<SCHEDULE_INTERFACE>;
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
  DAYS_CAMPAIGN = []
  getPhone(): Promise<string> {
    return new Promise(resolve => {
      if (this.phone.valid) {
        let country: Country = {
          dialCode: this.phoneComponent.selectedCountry.dialCode?this.phoneComponent.selectedCountry.dialCode:'',
          areaCodes: this.phoneComponent.selectedCountry.areaCodes?this.phoneComponent.selectedCountry.areaCodes:[],
          flagClass: this.phoneComponent.selectedCountry.flagClass?this.phoneComponent.selectedCountry.flagClass:'',
          htmlId: this.phoneComponent.selectedCountry.htmlId?this.phoneComponent.selectedCountry.htmlId:'',
          iso2: this.phoneComponent.selectedCountry.iso2?this.phoneComponent.selectedCountry.iso2:'',
          name: this.phoneComponent.selectedCountry.name?this.phoneComponent.selectedCountry.name:'',
          placeHolder: this.phoneComponent.selectedCountry.placeHolder?this.phoneComponent.selectedCountry.placeHolder:'',
          priority: this.phoneComponent.selectedCountry.priority?this.phoneComponent.selectedCountry.priority:0
        }
        this.PHONE_DATA = {feedId: 0, feedItemId: 0, status: '', feedType: 'CALL' , internationalNumber: this.phone.value.internationalNumber, phoneInfo: this.phone.value, country: country}
        resolve('ok')
        // this.getSchedules().then((res)=>{

        // }).catch((e)=>{
        //   resolve('error')
        // })
      } else {
        this.PHONE_DATA = null
        resolve('error')
     }
    })
     
   }
  @ViewChild(NgxIntlTelInputComponent, {static: false}) phoneComponent: NgxIntlTelInputComponent
  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.phone.valueChanges.subscribe(val=>{
      this.getPhone()
    })
  }

  updateCallExtension(){
    this.spinnerUpdate = true
    this.getPhone().then((res)=>{
      if(res==='ok'){
        if(this.campaignId===0){
          this.searchService.updateCampaign(this.cid, {callExtension: this.PHONE_DATA}).then((updated)=>{
            if(updated==='ok'){
              this.spinnerUpdate = false
              this.openSnackBar(5, 'Numéro de téléphone mis à jour avec succès !', 'ok', '')
            }else{
              this.openSnackBar(5, 'Le numéro de téléphone a été attribué à la campagne mais une erreur est survenue!', 'ok', '')
              this.spinnerUpdate = false
            }
          }).catch((e)=>{
            console.log(e)
            this.openSnackBar(5, 'Une erreur est survenue veuillez rééssayer !', 'ok', '')
            this.spinnerUpdate = false
          })

        }else{
          if(this.PHONE_DATA!==null && this.PHONE_DATA!==this.PREVIOUS_DATA){
      
            this.searchService.removeCallExtension(this.PREVIOUS_DATA, this.campaignId, this.cid).then((removed)=>{
              if(removed==='ok'){
                this.searchService.addCallExtension(this.PHONE_DATA, this.campaignId, this.cid).then((added)=>{
                  if(added==='ok'){
                    this.spinnerUpdate = false
                  }else{
                    this.spinnerUpdate = false
                  }
                }).catch((eAdded)=>{
                  console.log(eAdded)
                  this.spinnerUpdate = false
                })
              }else{

              }
            }).catch((eRm)=>{
              console.log(eRm)
              this.spinnerUpdate = false
            })
          }
        }
      }else{
        this.spinnerUpdate = false
      }
    }).catch((e)=>{

    })
  }
  @ViewChild(SnackbarComponent, { static: false }) appSnackbar: SnackbarComponent;
   openSnackBar(timeout: number, message: string, action: string, css: string) {
    this.appSnackbar.openSnackBar(timeout, message, action, css)
  }

}
