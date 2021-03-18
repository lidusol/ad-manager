import { Component, OnInit, HostListener, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSelect } from '@angular/material/select';

import { MdePopoverTrigger, MdePopover } from '@material-extended/mde';



import { DisplayService } from 'src/app/campaigns-management/services/display.service';

import * as moment from 'moment';

import { AuthService } from 'src/app/auth/auth.service';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { User_Role, CPRC } from 'src/app/utils/data';

import * as _ from 'lodash';

import { LocalStorageService } from '../../services/local-storage.service';
import { DaterangepickerComponent } from 'ngx-daterangepicker-material';

@Component({
  selector: 'adf-chart-review',
  templateUrl: './chart-review.component.html',
  styleUrls: ['./chart-review.component.scss']
})
export class ChartReviewComponent implements OnInit {
  @Input() campaignId: number;
  isLoading = true
  @ViewChild('select0', { static: false }) select0: MatSelect
  @ViewChild('select1', { static: false }) select1: MatSelect
  @ViewChild('select2', { static: false }) select2: MatSelect
  @ViewChild(MdePopoverTrigger, { static: false }) popover: MdePopoverTrigger;
  @ViewChild(MdePopover, { static: false }) popoverComponent: MdePopover;
  @ViewChild(DaterangepickerComponent, { static: false }) dateRange: DaterangepickerComponent;

  // custom code end
  public title: string = 'Inflation - Consumer Price';
  constructor(private router: Router, private auth: AuthService, private accountsService: AccountsService, private storageService: LocalStorageService, private route: ActivatedRoute, private displayService: DisplayService, private formBuilder: FormBuilder) { }


  ngOnInit(): void {

  }
  public totalSelect0: any = null
  public totalSelect1: any = null
  public totalSelect2: any = null
  public totalSelectClicks: number = 0
  public totalSelectCosts: number = 0
  public totalSelectImpressions: number = 0
  public totalSelectConversions: number = 0
  public totalSelectConversionsRate: string = ''
  public totalSelectInteractions: number = 0
  public totalSelectInteractionsRate: string = ''
  public totalSelectCtr: string = ''
  public selectedOptionStats1: string = "clicks"
  public selectedOptionStats3: string = "impressions"
  public selectedOptionStats2: string = "costs"
  statsOptions = [
    { text: 'Clics', value: 'clicks' },
    { text: 'Impressions', value: 'impressions' },
    { text: 'Coût', value: 'costs' },
    { text: 'Ctr', value: 'ctr' },
    { text: 'Interactions', value: 'interactions' },
    { text: "Taux d'Interactions", value: 'interactionsRate' },
    { text: 'Conversions', value: 'conversions' },
    { text: 'Taux de conversion', value: 'convRate' },
  ]

  @Input() cmp_id: number = 0
  aacid: string = ""
  uid: string = ""
  uid_action: string = ""
  user_access: User_Role;
  showSpinnerChart: boolean = false
  selected: any;
  invalidDates: moment.Moment[] = [];
  tooltips = [
    { date: moment(), text: 'Today is just unselectable' },
    { date: moment().add(2, 'days'), text: 'Yeeeees!!!' },
  ];
  startDate: moment.Moment = moment().startOf('week')
  endDate: moment.Moment = moment().endOf('week')
  ranges = {
    "Aujourd'hui": [moment(), moment()],
    'Hier': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Cette semaine': [moment().startOf('week'), moment().endOf('week')],
    "Semaine dernière": [moment().startOf('week').subtract(1, "week"), moment().startOf('week').subtract(1, "day")],
    '30 derniers jours': [moment().subtract(29, 'days'), moment()],
    'Ce mois': [moment().startOf('month'), moment().endOf('month')],
    'Mois dernier': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Personnaliser': [],

  };
  form = this.formBuilder.group({
    selected: {
      startDate: moment().startOf('week'),
      endDate: moment().endOf('week'),
    },
    alwaysShowCalendars: false,
    keepCalendarOpeningWithRange: false,
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
    ////////////////console.log('[rangeClicked] range is : ', range);
    this.rangeSelected = range.label
  }

  datesUpdated(range): void {
    ////////////////console.log('[datesUpdated] range is : ', range);
  }

  public query: string = ""
  startDateFormattedGoogle: string = ""
  endDateFormattedGoogle: string = ""
  change(e: any): void {
    ////////////console.log(e);
    if (this.rangeSelected === 'Hier') {
      this.query = ""
      let mom: moment.Moment = moment().subtract(1, 'day')

      ////////console.log(moment().toString())
      this.datesBetween = this.getDatesBetweenDates(mom.toDate(), mom.toDate())
      this.startDateFormattedGoogle = [this.setDateTimeZero(mom).getFullYear(), ('0' + (this.setDateTimeZero(mom).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(mom).getDate())).slice(-2),].join('');
      this.endDateFormattedGoogle = [this.setDateTimeZero(mom).getFullYear(), ('0' + (this.setDateTimeZero(mom).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(mom).getDate())).slice(-2),].join('');
      //this.popover.closePopover()
      this.setChartReport()
    } else if (this.rangeSelected === "Aujourd'hui") {
      this.query = ""
      let mom: moment.Moment = moment()
      this.datesBetween = this.getDatesBetweenDates(mom.toDate(), mom.toDate())
      this.startDateFormattedGoogle = [this.setDateTimeZero(mom).getFullYear(), ('0' + (this.setDateTimeZero(mom).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(mom).getDate())).slice(-2),].join('');
      this.endDateFormattedGoogle = [this.setDateTimeZero(mom).getFullYear(), ('0' + (this.setDateTimeZero(mom).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(mom).getDate())).slice(-2),].join('');
      //this.popover.closePopover()
      this.setChartReport()
    } else if (this.rangeSelected === 'Cette semaine') {
      this.query = ""
      let startDate: moment.Moment = moment().startOf('week')
      let endDate: moment.Moment = moment().endOf('week')
      this.datesBetween = this.getDatesBetweenDates(startDate.toDate(), endDate.toDate())
      this.startDateFormattedGoogle = [this.setDateTimeZero(startDate.toDate()).getFullYear(), ('0' + (this.setDateTimeZero(startDate.toDate()).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(startDate.toDate()).getDate())).slice(-2),].join('');
      this.endDateFormattedGoogle = [this.setDateTimeZero(endDate.toDate()).getFullYear(), ('0' + (this.setDateTimeZero(endDate.toDate()).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(endDate.toDate()).getDate())).slice(-2),].join('');
      //this.popover.closePopover()
      this.setChartReport()
    } else if (this.rangeSelected === "Semaine dernière") {
      this.query = ""
      let startDate: moment.Moment = moment().startOf('week').subtract(1, "week")
      let endDate: moment.Moment = moment().startOf('week').subtract(1, "day")
      this.datesBetween = this.getDatesBetweenDates(startDate.toDate(), endDate.toDate())
      this.startDateFormattedGoogle = [this.setDateTimeZero(startDate.toDate()).getFullYear(), ('0' + (this.setDateTimeZero(startDate.toDate()).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(startDate.toDate()).getDate())).slice(-2),].join('');
      this.endDateFormattedGoogle = [this.setDateTimeZero(endDate.toDate()).getFullYear(), ('0' + (this.setDateTimeZero(endDate.toDate()).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(endDate.toDate()).getDate())).slice(-2),].join('');
      //this.popover.closePopover()
      this.setChartReport()
    } else if (this.rangeSelected === '30 derniers jours') {
      this.query = ""

      let startDate: moment.Moment = moment().subtract(29, 'days')
      let endDate: moment.Moment = moment()
      this.datesBetween = this.getDatesBetweenDates(startDate.toDate(), endDate.toDate())
      this.startDateFormattedGoogle = [this.setDateTimeZero(startDate.toDate()).getFullYear(), ('0' + (this.setDateTimeZero(startDate.toDate()).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(startDate.toDate()).getDate())).slice(-2),].join('');
      this.endDateFormattedGoogle = [this.setDateTimeZero(endDate.toDate()).getFullYear(), ('0' + (this.setDateTimeZero(endDate.toDate()).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(endDate.toDate()).getDate())).slice(-2),].join('');
      //this.popover.closePopover()
      this.setChartReport()

    } else if (this.rangeSelected === 'Ce mois') {
      this.query = ""
      let startDate: moment.Moment = moment().startOf('month')
      let endDate: moment.Moment = moment().endOf('month')
      this.datesBetween = this.getDatesBetweenDates(startDate.toDate(), endDate.toDate())
      this.startDateFormattedGoogle = [this.setDateTimeZero(startDate.toDate()).getFullYear(), ('0' + (this.setDateTimeZero(startDate.toDate()).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(startDate.toDate()).getDate())).slice(-2),].join('');
      this.endDateFormattedGoogle = [this.setDateTimeZero(endDate.toDate()).getFullYear(), ('0' + (this.setDateTimeZero(endDate.toDate()).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(endDate.toDate()).getDate())).slice(-2),].join('');
      //this.popover.closePopover()
      this.setChartReport()
    } else if (this.rangeSelected === 'Mois dernier') {
      this.query = ""
      let startDate: moment.Moment = moment().startOf('month').subtract(1, "months").startOf('month')
      let endDate: moment.Moment = moment().startOf('month').subtract(1, "months").endOf('month')
      this.datesBetween = this.getDatesBetweenDates(startDate.toDate(), endDate.toDate())
      this.startDateFormattedGoogle = [this.setDateTimeZero(startDate.toDate()).getFullYear(), ('0' + (this.setDateTimeZero(startDate.toDate()).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(startDate.toDate()).getDate())).slice(-2),].join('');
      this.endDateFormattedGoogle = [this.setDateTimeZero(endDate.toDate()).getFullYear(), ('0' + (this.setDateTimeZero(endDate.toDate()).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(endDate.toDate()).getDate())).slice(-2),].join('');
      //////console.log(this.startDateFormattedGoogle)
      //////console.log(this.endDateFormattedGoogle)
      this.setChartReport()


    } else if (this.rangeSelected === 'Personnaliser') {
      if (e.endDate._d !== undefined) {
        this.query = ""

        let startDate = new Date(e.startDate._d)
        let endDate = new Date(e.endDate._d)
        let minDateEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate() + 1)
        this.startDateFormattedGoogle = [startDate.getFullYear(), ('0' + (startDate.getMonth() + 1)).slice(-2), ('0' + (startDate.getDate())).slice(-2),].join('');
        this.endDateFormattedGoogle = [endDate.getFullYear(), ('0' + (endDate.getMonth() + 1)).slice(-2), ('0' + (endDate.getDate())).slice(-2),].join('');
        this.datesBetween = this.getDatesBetweenDates(e.startDate._d, e.endDate._d)
        //this.popover.closePopover()
        this.setChartReport()

      }



    }

  }


  datesBetween: any = []
  getDatesBetweenDates = (startDate, _endDate_) => {
    let dates = []
    var endDate = this.setDateTimeZero(_endDate_)
    const theDate = new Date(this.setDateTimeZero(startDate))
    if (endDate.toString() === '') {
      dates.push(theDate)
      return dates
    } else {
      while (theDate < endDate) {
        dates = [...dates, new Date(theDate)]
        theDate.setDate(theDate.getDate() + 1)
      }
      return dates

    }
  }
  noChartDataFound: boolean = false
  openedFromSelect0: boolean = false
  openedFromSelect1: boolean = false
  openedFromSelect2: boolean = false
  clicksToggled: boolean = true
  costsToggled: boolean = true
  impressionsToggled: boolean = true
  toggleSeries(index: number, className: string, remove: string) {
    //////////////console.log(this.chart)

    /* setTimeout(() => {
    
          
            if(className==='stat-element-0'){
              this.clicksToggled = false
              let view = new google.visualization.DataView(this.chartData);
              //////console.log(view.getNumberOfColumns())
              //////console.log(view.getViewColumns())
              view.hideColumns([1]); 
              var chart: google.visualization.LineChart  = this.wrapper.getChart()
              chart.draw(view, this.options)
              
            }else if (className==='stat-element-1'){
              this.impressionsToggled = false
              let view = new google.visualization.DataView(this.chartData);
              view.hideColumns([2]); 
              var chart: google.visualization.LineChart  = this.wrapper.getChart()
              chart.draw(view, this.options)
              
            }else if (className==='stat-element-2'){
              this.costsToggled = false
              let view = new google.visualization.DataView(this.chartData);
              view.hideColumns([3]); 
              var chart: google.visualization.LineChart  = this.wrapper.getChart()
              chart.draw(view, this.options)
              
            }
         
            
          
         
        

      

    },800) */
  }
  googleVisualizeData: { fields: any }[] = []
  dataVisualisation = new google.visualization.DataTable()
  lineChart: google.visualization.LineChart;
  wrapper: google.visualization.ChartWrapper;
  chartData: google.visualization.DataTable;
  options: google.visualization.LineChartOptions;
  setChartReport() {
    this.showSpinnerChart = true
    this.getReportSummuryWithQuery(this.query, this.startDateFormattedGoogle, this.endDateFormattedGoogle).then(res_report => {
      ////console.log(res_report)
      if (res_report === "ok") {
        this.getCosts().then(res_impr => {
          ////console.log(res_impr)
          if (res_impr === "ok") {
            this.showSpinnerChart = false
            if (this.clicks.length > 0 && this.costs.length > 0) {
              this.noChartDataFound = false
              let sorted = this.googleVisualizeData.sort((a,b)=>{
                      
                return new Date(a.fields.date).getTime()-new Date(b.fields.date).getTime()})
            //console.log(sorted)
               var i = 0, result = [];
               while(i < sorted.length){
                   result.push([])
                   for(var key in sorted[i].fields){
                       result[result.length-1].push(sorted[i].fields[key])	
                   }
                   i++
               }
               ;

              this.chartData = new google.visualization.DataTable();
              this.chartData.addColumn('date', 'Dates');
              this.chartData.addColumn({ id: 'clicks', label: 'Clics', type: 'number', });
              this.chartData.addColumn({ id: 'costs', label: 'Coût', type: 'number', });
              this.chartData.addColumn({ id: 'impressions', label: 'Impressions', type: 'number', });
              console.log(result)
              this.chartData.addRows(
                result

              );
              //////console.log(this.chartData)
              try {
                const dateFormat = "dd MMM";
                const oneDay = (1000 * 60 * 60 * 24);
                let hAxisTicks = [];
                let dateRange = this.chartData.getColumnRange(0);
                for (var __i__ = dateRange.min.getTime(); __i__ <= dateRange.max.getTime(); __i__ = __i__ + oneDay) {
                  hAxisTicks.push(new Date(__i__));
                }
                let numberOfRows = this.chartData.getNumberOfRows();
                this.options = {
                  legend: { position: 'top', alignment: 'center' },
                  chartArea: { width: '80%', height: '60%' },
                  animation: {
                    duration: 1,
                    startup: true,
                    easing: 'in'
                  },
                  height: 240,
                  series: {
                    0: { targetAxisIndex: 0, lineWidth: 1 },
                    1: { targetAxisIndex: 1, lineWidth: 1 },
                    2: { targetAxisIndex: 0, lineWidth: 1 }
                  },
                  vAxes: {

                    y: {
                      Clicks: { label: 'Clicks' },
                      Impressions: { label: 'Impressions' },

                    }
                  },
                  focusTarget: 'category',
                  crosshair: { trigger: 'both', color: "#ccc", orientation: "vertical" },
                  hAxis: {
                    logScale: false,
                    'baselineColor': 'none',
                    'textStyle': {
                      'color': '#8C8C8C',
                      'fontName': 'Calibri',
                      'fontSize': 12,
                    },
                    maxAlternation: 1,
                    format: dateFormat,
                    ticks: hAxisTicks,
                    gridlines: {
                      color: 'transparent',
                    },
                    minorGridlines: {
                      count: 1,
                    },
                    viewWindowMode: 'pretty',
                  },
                  vAxis: {
                    logScale: false,
                    'baselineColor': 'none',
                    'textStyle': {
                      'color': '#8C8C8C',
                      'fontName': 'Calibri',
                      'fontSize': 12,
                    },
                    minorGridlines: {
                      count: 0,
                    },

                    viewWindow: {
                      min: 0,
                    },
                    gridlines: {
                      count: 3
                    },
                    viewWindowMode: 'pretty',
                  }
                };

                if (numberOfRows === 1) {
                  let hAxis = {
                    hAxis: {
                      viewWindow: {
                        min: this.chartData.getValue(0, 0),
                      }
                    }
                  };
                  this.options = $.extend(true, this.options, hAxis);
                }
                this.wrapper = new google.visualization.ChartWrapper({
                  chartType: "LineChart",
                  dataTable: this.chartData,
                  options: this.options,
                  containerId: 'line_top_x'
                });
                this.wrapper.draw();
              } catch (e) {
                console.log(e.toString());
              }
            } else {
              this.noChartDataFound = true
            }
          }
        })
      }
    })
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.storageService.getUserIdAndAccountId().then(response => {
        if (response !== null) {
          this.route.queryParams.subscribe(params => {
            const adf_account_id: string = params['aacid'];
            const uid = params['auid'];
            if (response.aacid === adf_account_id && uid === response.auid && adf_account_id !== undefined && uid !== undefined) {
              this.aacid = adf_account_id
              this.uid = response.auid
              this.user_access = response.role
              if (response.fromOwned) {
                this.uid_action = response.auid
              } else {
                this.uid_action = response.account.owner
              }
              this.isLoading = false
              let startDate = new Date(moment().startOf('week').toDate())
              let endDate = new Date(moment().endOf('week').toDate())
              let minDateEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate() + 1)
              this.startDateFormattedGoogle = [startDate.getFullYear(), ('0' + (startDate.getMonth() + 1)).slice(-2), ('0' + (startDate.getDate())).slice(-2),].join('');
              this.endDateFormattedGoogle = [endDate.getFullYear(), ('0' + (endDate.getMonth() + 1)).slice(-2), ('0' + (endDate.getDate())).slice(-2),].join('');


              setTimeout(() => {
                this.displayService.getCampaignStartDate(this.campaignId).then(startDate => {
                  if (startDate !== null) {
                    let now = new Date()
                    let endDate = [this.setDateTimeZero(now.getTime()).getFullYear(), ('0' + (this.setDateTimeZero(now.getTime()).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(now.getTime()).getDate())).slice(-2),].join('')
                    ////console.log(startDate)
                    ////console.log(endDate)
                    this.datesBetween = this.getDatesBetweenDates(startDate, endDate)
                    this.startDateFormattedGoogle = startDate
                    this.endDateFormattedGoogle = endDate
                    this.setChartReport()
                  }
                }).catch(e => {
                  ////console.log(e)
                })
                // this.dateRange.clickRange('Ce mois')
              }, 500)
            } else {
              this.router.navigate(['/campaigns/list'], { queryParams: { aacid: response.aacid, auid: response.auid } })
            }
          })

        }
      })
    }, 500);
  }

  allReport:CPRC[] = []

  getData(): Promise<string> {
    return new Promise(resolve => {
      this.displayService.getCampaignSummuryReportWithSelectorDateSingle(this.uid_action, this.aacid, this.campaignId, this.query, "", "").then(res => {
        this.allReport = res
        resolve('ok')
      })
    })
  }
  public clicks = [];
  public costs = [];
  public impressions = []
  public ctr = []
  public interactions = []
  public interactionsRate = []
  public conversions = []
  public convRate = []
  getReportSummuryWithQuery(query: string, startDate: string, endDate: string): Promise<string> {
    return new Promise(resolve => {
      this.allReport = []
      this.displayService.getCampaignSummuryReportWithSelectorDateSingle(this.uid_action, this.aacid, this.campaignId, query, startDate, endDate).then(res => {
        this.allReport = res
        //////console.log(this.allReport)
        resolve('ok')
      })
    })

  }

  getClics(): Promise<string> {
    return new Promise(resolve => {
      for (let i = 0; i < this.allReport.length; i++) {

      }
      resolve('ok')
    })
  }
  setDateTimeZero(date: any): Date {
    let new_date = new Date(date)
    new_date.setHours(0, 0, 0, 0)
    return new_date
  }
  defineAllReport(): Promise<string> {
    return new Promise(resolve => {
      if (this.datesBetween.length === 0) {
        resolve('ok')
      } else {
        this.datesBetween.forEach((el, index) => {
          let exist = this.allReport.some(report => new Date(this.setDateTimeZero(report.date)).getTime() === new Date(this.setDateTimeZero(el)).getTime())
          if (!exist) {
            this.allReport.push({
              date: new Date(this.setDateTimeZero(el)).toString(),
              clicks: '0',
              costs: '0',
              impressions: '0',
              ctr: '0',
              conversions: '0',
              convRate: '0%',
              interactions: '0',
              interactionRate: '0%'
            })
            if (this.datesBetween.length - 1 === index) {
              resolve('ok')
            }
          } else {
            if (this.datesBetween.length - 1 === index) {
              resolve('ok')
            }
          }
        })

      }
    })
  }
  getCosts(): Promise<string> {
    return new Promise(resolve => {
      this.clicks = []
      this.costs = []
      this.impressions = []
      this.ctr = []
      this.conversions = []
      this.convRate = []
      this.interactions = []
      this.interactionsRate = []
      this.totalSelectClicks = 0
      this.totalSelectCosts = 0
      this.totalSelectImpressions = 0
      this.totalSelectCtr = ''
      this.totalSelectInteractions = 0
      this.totalSelectInteractionsRate = ''
      this.totalSelectConversions = 0
      this.totalSelectConversionsRate = ''
      this.googleVisualizeData = []

      if (this.allReport.length > 0) {
        this.allReport.forEach((value, i, collection) => {
          ////console.log(i === this.allReport.length - 1)
          let date = this.setDateTimeZero(this.allReport[i].date)
          let clicks = parseFloat((parseFloat(this.allReport[i].clicks)).toFixed(10))
          let costs = parseFloat(((parseFloat(this.allReport[i].costs) * 2) / 1000000).toFixed(2))
          let impressions = parseFloat(this.allReport[i].impressions)
          let exist = this.googleVisualizeData.some(item => this.setDateTimeZero(item.fields.date.toString()).getTime() === date.getTime())
          if (exist) {
            this.googleVisualizeData.forEach((item, __index__) => {
              if (this.setDateTimeZero(item.fields.date).getTime() === date.getTime()) {
                this.googleVisualizeData[__index__].fields.clicks += clicks
                this.googleVisualizeData[__index__].fields.costs += costs
                this.googleVisualizeData[__index__].fields.impressions += impressions

              }
            })
          } else {
            this.googleVisualizeData.push({
              fields: {
                date: new Date(this.setDateTimeZero(this.allReport[i].date)),
                clicks: clicks,
                costs: costs,
                impressions: impressions
              }
            })
          }
          //////console.log(this.googleVisualizeData)
          //////console.log(i)
          this.totalSelectClicks += clicks
          this.totalSelectCosts += costs
          this.totalSelectImpressions += impressions
          this.totalSelect0 = this.totalSelectClicks
          this.totalSelect1 = this.totalSelectImpressions
          this.totalSelect2 = this.totalSelectCosts
          let existClicks = this.clicks.some(el => {
            return this.setDateTimeZero(el.x).getTime() === date.getTime()
          })
          let existCosts = this.costs.some(el => {
            return this.setDateTimeZero(el.x).getTime() === date.getTime()
          })
          let existImpressions = this.impressions.some(el => {
            return this.setDateTimeZero(el.x).getTime() === date.getTime()
          })
          if (existClicks) {
            this.clicks.forEach((el, index) => {
              if (this.setDateTimeZero(el.x).getTime() === date.getTime()) {
                this.clicks[index]['y'] = parseFloat(el.y) + parseFloat((clicks / 1000).toFixed(20))
                this.clicks[index]['y1'] = parseFloat(el.y1) + parseFloat((clicks / 1000).toFixed(20))
              }
            })
          } else {
            this.clicks.push({ x: this.setDateTimeZero(date), y: parseFloat((clicks / 1000).toFixed(20)),  y1: clicks / 1000 })
          }
          if (existCosts) {
            this.costs.forEach((el, index) => {
              if (this.setDateTimeZero(el.x).getTime() === date.getTime()) {
                this.costs[index]['y'] = parseFloat(el.y) + parseFloat((parseFloat(((parseFloat(this.allReport[i].costs) * 2) / 1000000).toFixed(2)) / 1000).toFixed(5))
                this.costs[index]['y1'] = parseFloat(el.y1) + parseFloat(((parseFloat(this.allReport[i].costs) * 2) / 1000000).toFixed(2))
              }
            })
          } else {
            this.costs.push({ x: this.setDateTimeZero(date), y: parseFloat((parseFloat(((parseFloat(this.allReport[i].costs) * 2) / 1000000).toFixed(2)) / 1000).toFixed(20)),  y1: parseFloat(((parseFloat(this.allReport[i].costs) * 2) / 1000000).toFixed(2)) })
          }
          if (existImpressions) {
            this.impressions.forEach((el, index) => {
              if (this.setDateTimeZero(el.x).getTime() === date.getTime()) {
                this.impressions[index]['y'] = parseFloat(el.y) + parseFloat((impressions / 1000000).toFixed(20))
                this.impressions[index]['y1'] = parseFloat(el.y1) + parseFloat((impressions / 1000).toFixed(10))
              }
            })
          } else {
            this.impressions.push({ x: this.setDateTimeZero(date), y: parseFloat((impressions / 1000000).toFixed(20)),  y1: parseFloat((impressions / 1000).toFixed(10)) })

          }
          if (i === this.allReport.length - 1) {
            ////console.log('resolve statement')
            resolve('ok')
          }
        })

      } else {
        this.clicks = []
        this.costs = []
        this.impressions = []
        this.totalSelect0 = 0
        this.totalSelect1 = 0
        this.totalSelect2 = 0
        for (let i = 0; i < this.datesBetween.length; i++) {
          this.googleVisualizeData.push({
            fields: {
              date: new Date(this.setDateTimeZero(this.datesBetween[i])),
              clicks: 0,
              costs: 0,
              impressions: 0
            }
          })
          if (i === this.datesBetween.length - 1) {

            this.clicks.push({ x: new Date(this.setDateTimeZero(this.datesBetween[i])), y: 0,  y1: 0 })
            this.costs.push({ x: new Date(this.setDateTimeZero(this.datesBetween[i])), y: 0,  y1: 0 })
            this.impressions.push({ x: new Date(this.setDateTimeZero(this.datesBetween[i])), y: 0,  y1: 0 })
            resolve('ok')
          } else {
            this.clicks.push({ x: new Date(this.setDateTimeZero(this.datesBetween[i])), y: 0,  y1: 0 })
            this.costs.push({ x: new Date(this.setDateTimeZero(this.datesBetween[i])), y: 0,  y1: 0 })
            this.impressions.push({ x: new Date(this.setDateTimeZero(this.datesBetween[i])), y: 0,  y1: 0 })
            continue
          }

        }
      }

    })
  }
  getImpressions(): Promise<string> {
    return new Promise(resolve => {
      for (let i = 0; i < this.allReport.length; i++) {

      }
      resolve('ok')
    })
  }

/*   toggleClick() {
    this.chart['data'][0].dataSeries.visible = false;
    if (typeof (this.chart['data'][0]['visible']) === "undefined" || this.chart['data'][0]['visible']) {
      this.chart['data'][0]['visible'] = false;
    } else {
      this.chart['data'][0]['visible'] = true;
    }

  } */

  public toogleDataSeries = (e) => {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    /* 	this.chart.render(); */
  }

}
