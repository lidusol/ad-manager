import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FormControl } from '@angular/forms';
import { DateAdapter} from '@angular/material/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatDatepicker } from '@angular/material/datepicker';

import * as moment from 'moment'



@Component({
  selector: 'adf-cmp-dates',
  templateUrl: './cmp-dates.component.html',
  styleUrls: ['./cmp-dates.component.scss'],
})
export class CmpDatesComponent implements OnInit {
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
  public endDateFrench: string = "12/30/2037"
  public startDateFormattedGoogle: string = ""
  public endDateFormattedGoogle: string = "20371230"
  public startDateEnglish: string = ""
  public endDateEnglish: string = "30-12-2037"
  componentReady: boolean = false
  public noEndDate: boolean = true
  public numberOfDays: number = 0
  
  

  radioSelectChange(args: MatRadioChange) {
    if (args.value === "1") {
      this.endDate = new Date("30-12-2037").toLocaleString()
      this.endDateFrench = "12/30/2037"
      this.endDateEnglish = "30-12-2037"
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
  constructor(private dateAdapter: DateAdapter<any>) { 
    this.dateStartCtrl.valueChanges.subscribe(x => {
      this.startDate = x._d
      let startDate = new Date(x._d)
      this.minDateEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate() + 1)
      this.dateEndCtrl.setValue('')
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
    }) */
    
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
    this.minDateStart = new Date()
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.dateAdapter.setLocale('fr');
    this.startDate = new Date().toLocaleString()
      let startDate = new Date()
      this.minDateEnd = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1)
      this.dateEndCtrl.setValue('')
      var start = new Date();
   
      this.startDateFrench = [('0' + (start.getDate())).slice(-2), ('0' + (start.getMonth() + 1)).slice(-2), start.getFullYear()].join('/');
      this.startDateFormattedGoogle = [start.getFullYear(),('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2),].join('');
    this.startDateEnglish = [('0' + (start.getMonth() + 1)).slice(-2), ('0' + (start.getDate())).slice(-2), start.getFullYear()].join('-');
     this.endDate = ""
      this.endDateFrench = ""
      this.endDateEnglish = ""
      this.endDateFormattedGoogle = "20371230"
      /* let startDate = new Date()
      this.minDateEnd = new Date(startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate()+1) */
  }

}
