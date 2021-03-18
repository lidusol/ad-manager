import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { DaterangepickerDirective, LocaleService, NgxDaterangepickerMd, DaterangepickerComponent } from 'ngx-daterangepicker-material';
@Component({
  selector: 'adf-periode-selector',
  templateUrl: './periode-selector.component.html',
  styleUrls: ['./periode-selector.component.scss']
})
export class PeriodeSelectorComponent implements OnInit {

  @ViewChild(DaterangepickerDirective, { static: false })
  daterangepicker: DaterangepickerDirective;
   @ViewChild(DaterangepickerComponent, { static: false })
    daterangepickerComponent: DaterangepickerComponent;
  selected: any;
    invalidDates: moment.Moment[] = [];
    tooltips = [
        /* { date: moment(), text: 'Today is just unselectable' },
        { date: moment().add(2, 'days'), text: 'Yeeeees!!!' }, */
    ];
    ranges = {
       
       
        'Tout le mois': [moment().startOf('month'), moment().endOf('month')],
        
    };
     /* ranges = {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'Last 3 Month': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    }; */
    form = this.formBuilder.group({
        selected: {
            startDate: moment().subtract(1, 'days').set({ hours: 0, minutes: 0 }),
            endDate: moment().add(1, 'days').set({ hours: 23, minutes: 59 }),
        },
        alwaysShowCalendars: true,
        keepCalendarOpeningWithRange: true,
        showRangeLabelOnInput: true,
    });

    constructor(private formBuilder: FormBuilder) {}

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
  
  

    rangeClicked(range): void {
        console.log('[rangeClicked] range is : ', range);
    }

    datesUpdated(range): void {
        console.log('[datesUpdated] range is : ', range);
    }
  open() {
    this.daterangepicker.open()
  }
  ngOnInit() {
    
  }

}
