import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker/date-range-picker';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { NgxDaterangepickerMd, DaterangepickerComponent } from 'ngx-daterangepicker-material';
import { rangesSelectorEn, Range_En_Values, Range_Fr_Values, Range_Selector_Type, Selected_Date_Range } from 'src/app/utils/data';
import { DEFAULT_LANG } from 'src/environments/environment';
import { LocalStorageService } from '../../services/local-storage.service';


@Component({
  selector: 'adf-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  @Input() iconBtn: boolean = false 
  currentLang: string = ''
  backDropClass: string = 'range-picker-backdrop'
  panelClass: string = 'range-picker-cdk-overlay'
  cdkConnectedOverlayFlexibleDimensions: boolean = true
  cdkConnectedOverlayViewportMargin: number = 5
  startDate: Moment =  moment().startOf('week')
  endDate: Moment =  moment().endOf('week')
  selectedId: number = null
  selectedDates: Selected_Date_Range = null
  selectedRange: Range_Selector_Type = null
  @ViewChild(CdkOverlayOrigin, {static: false}) overlayTrigger: CdkOverlayOrigin 
  @ViewChild(CdkConnectedOverlay, {static: false}) connectedOverlay: CdkConnectedOverlay
  @ViewChild(DaterangepickerComponent, {static: false}) dateRangeComponent: DaterangepickerComponent
  @ViewChild(MatSelectionList, {static: false}) rangesListComponent: MatSelectionList
  ranges: Range_Selector_Type[] = []
  overlayOpened: boolean = false
  backdropClick(arg: MouseEvent){
    
    this.overlayOpened = false
  }
  overlayOutsideClick(arg: MouseEvent){
    this.overlayOpened = false
  }
  constructor(private storageService: LocalStorageService, private translate: TranslateService) {
   
    this.getLang() 
    
  }

  setDefaultRange(){
    this.setDates(this.ranges[2].id, this.ranges[2].rangeValue[0], this.ranges[2].rangeValue[1])
    this.getDataValue()
  }
  ngAfterViewInit(): void {
    this.storageService.getLastRangeSelectedValue().then(rangeSelected=>{
      if(rangeSelected!==undefined && rangeSelected!==null){
        //console.log(rangeSelected)
        this.setDates(rangeSelected.rangeId, moment(rangeSelected.startDate), moment(rangeSelected.endDate))
          this.defineDates(moment(rangeSelected.startDate), moment(rangeSelected.endDate), true)
        
      }else{
       this.setDefaultRange()
      }
    }).catch((e)=>{
      this.setDefaultRange()
    });
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
   
  }

  setDates(id: number, startDate: Moment, endDate: Moment){
    this.selectedId = id
    this.startDate = startDate
    this.endDate = endDate
    if(this.selectedId===10){
      this.isCustomRange = true
    }else{
      this.isCustomRange = false
    }
    let findDate = this.ranges.filter(date=>date.id===id)[0]
    if(this.dateRangeComponent!==undefined && startDate!==null){
      this.dateRangeComponent.setStartDate(this.startDate.toDate())
      this.dateRangeComponent.setEndDate(this.endDate.toDate())
      this.dateRangeComponent.updateCalendars()

    }
    if(startDate!==null){

      let _startDate_ = new Date(this.startDate.toDate().getTime())
      let _endDate_ = new Date(this.endDate.toDate().getTime())
      let startDateFormattedGoogle = [_startDate_.getFullYear(), ('0' + (_startDate_.getMonth() + 1)).slice(-2), ('0' + (_startDate_.getDate())).slice(-2),].join('');
      let endDateFormattedGoogle = [_endDate_.getFullYear(), ('0' + (_endDate_.getMonth() + 1)).slice(-2), ('0' + (_endDate_.getDate())).slice(-2),].join('');
      let dateRangeText: string = ''
  
      if(this.selectedId===10){
        dateRangeText = _startDate_.toLocaleDateString(this.currentLang==='en'?'en-US':'fr-FR') + '-'+_endDate_.toLocaleDateString(this.currentLang==='en'?'en-US':'fr-FR')
      }else{
        dateRangeText = findDate.rangeText
      }
      this.selectedDates = {
        rangeId: this.selectedId,
        startDate: this.startDate,
        endDate: this.endDate,
        startDateFormattedGoogle: startDateFormattedGoogle,
        endDateFormattedGoogle: endDateFormattedGoogle,
        dateRangeText: dateRangeText
      }
      if(this.selectedId!==null){
        if(findDate!==undefined && findDate!==null){
          if(this.rangesListComponent!==undefined){
            this.rangesListComponent.options.forEach(opt=>{
              if(opt.value.id===findDate.id){
                opt.selected = true
              }
            })
  
          }
        }
      }else{
        return;
      }
    }else{
   
      if(this.selectedId!==null){
        if(findDate!==undefined && findDate!==null){
          if(this.rangesListComponent!==undefined){
            this.rangesListComponent.options.forEach(opt=>{
              if(opt.value.id===findDate.id){
                opt.selected = true
              }
            })
  
          }
        }
      }else{
        return;
      }
    }
    
    
  }
  maxDate = moment().add(1,  'day');
  minDate = moment().subtract(1, 'year');
  invalidDates: moment.Moment[] = [];
  isInvalidDate = (m: moment.Moment) => {
  
    return this.invalidDates.some((d) => d.isSame(m, 'day'));
};




  private defineDates(start: Moment, end: Moment, emit: boolean){
    this.startDate = start
    this.endDate = end
    let _startDate_ = new Date(start.toDate().getTime())
    let _endDate_ = new Date(end.toDate().getTime())
    let startDateFormattedGoogle = [_startDate_.getFullYear(), ('0' + (_startDate_.getMonth() + 1)).slice(-2), ('0' + (_startDate_.getDate())).slice(-2),].join('');
    let endDateFormattedGoogle = [_endDate_.getFullYear(), ('0' + (_endDate_.getMonth() + 1)).slice(-2), ('0' + (_endDate_.getDate())).slice(-2),].join('');
    let dateRangeText: string = _startDate_.toLocaleDateString(this.currentLang==='en'?'en-US':'fr-FR') + '-'+_endDate_.toLocaleDateString(this.currentLang==='en'?'en-US':'fr-FR')
    let customValue: Selected_Date_Range = {
      rangeId: 10,
      dateRangeText: dateRangeText,
      startDate: start,
      endDate: end,
      startDateFormattedGoogle: startDateFormattedGoogle,
      endDateFormattedGoogle: endDateFormattedGoogle

    }
    //console.log(customValue)
    this.selectedDates = customValue
    this.storageService.setLastRangeSelectedValue(customValue)
    //console.log(emit)
    if(emit){
      this.selected.emit(customValue)

    }
    if(this.dateRangeComponent!==undefined){
      this.dateRangeComponent.setStartDate(this.startDate.toDate())
      this.dateRangeComponent.setEndDate(this.endDate.toDate())
      this.dateRangeComponent.updateCalendars()

    }
  }
  togglePicker(){
    if(this.overlayOpened){
      this.overlayOpened = false
    }else{
      this.overlayOpened = true
      this.storageService.getLastRangeSelectedValue().then(rangeSelected=>{
        if(rangeSelected!==undefined && rangeSelected!==null){
          setTimeout(() => {
           /*  if(rangeSelected.rangeId===10){
              this.defineDates(moment(rangeSelected.startDate), moment(rangeSelected.endDate), false)
            }else{
              
            } */
            this.setDates(rangeSelected.rangeId, moment(rangeSelected.startDate), moment(rangeSelected.endDate))
            
          }, 500);
        }else{
          if(this.selectedId===null){
          setTimeout(() => {
            this.setDates(this.ranges[2].id, this.ranges[2].rangeValue[0], this.ranges[2].rangeValue[1])
          }, 500);
          }else{
            setTimeout(() => {
              this.setDates(this.selectedId, moment(this.startDate), moment(this.endDate))
            }, 500);
          }

        }
      })
    }
  }

  getLang(){
    this.storageService.getLang().then(lang=>{
      if(lang!==undefined && lang!==null && (lang==='en' || lang==='fr')){
        this.translate.use(lang);
        this.currentLang = lang
        if(lang==='en'){
          this.ranges = Range_En_Values
        }else if(lang==='fr'){
          this.ranges = Range_Fr_Values
        }
      }else{
        this.translate.use(DEFAULT_LANG)
        this.currentLang = DEFAULT_LANG
        this.ranges = Range_Fr_Values
      }
    }).catch(e=>{
      this.translate.use(DEFAULT_LANG)
      this.currentLang = DEFAULT_LANG
      this.ranges = Range_Fr_Values
    })
    
    }

    getDataValue(){
      if(this.isCustomRange){
        let _startDate_ = new Date(this.dateRangeComponent.startDate.toDate().getTime())
        let _endDate_ = new Date(this.dateRangeComponent.endDate.toDate().getTime())
        let startDateFormattedGoogle = [_startDate_.getFullYear(), ('0' + (_startDate_.getMonth() + 1)).slice(-2), ('0' + (_startDate_.getDate())).slice(-2),].join('');
        let endDateFormattedGoogle = [_endDate_.getFullYear(), ('0' + (_endDate_.getMonth() + 1)).slice(-2), ('0' + (_endDate_.getDate())).slice(-2),].join('');
        let dateRangeText: string = _startDate_.toLocaleDateString(this.currentLang==='en'?'en-US':'fr-FR') + '-'+_endDate_.toLocaleDateString(this.currentLang==='en'?'en-US':'fr-FR')
        let customValue: Selected_Date_Range = {
          rangeId: 10,
          dateRangeText: dateRangeText,
          startDate: this.dateRangeComponent.startDate,
          endDate: this.dateRangeComponent.endDate,
          startDateFormattedGoogle: startDateFormattedGoogle,
          endDateFormattedGoogle: endDateFormattedGoogle

        }
        //console.log(customValue)
        this.selectedDates = customValue
        this.storageService.setLastRangeSelectedValue(customValue)
        this.selected.emit(customValue)
        if(this.overlayOpened){
          this.overlayOpened = false
        }
      }else{
        this.storageService.setLastRangeSelectedValue(this.selectedDates)
        this.selected.emit(this.selectedDates)
        if(this.overlayOpened){
          this.overlayOpened = false
        }
      }
      
    }
  
  ngOnInit(): void {
  
  }

  @Output() selected: EventEmitter<Selected_Date_Range> = new EventEmitter<Selected_Date_Range>()
  isCustomRange: boolean = false
  selectRange(range: Range_Selector_Type){
    if(range.id===10){
      this.isCustomRange = true
      /* this.setDates(range.id, null, null) */
    }else{
      this.isCustomRange = false
    }
    this.setDates(range.id, range.rangeValue[0], range.rangeValue[1])
    
    
  }

}
