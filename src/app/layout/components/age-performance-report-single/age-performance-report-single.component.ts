import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Row } from 'angular-google-charts';
import * as moment from 'moment';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { AGE_RANGE_MODEL_COLLECTION_FOR_REPORT, AGE_RANGE_REPORT, AGE_REPORT_SAMPLE, User_Role } from 'src/app/utils/data';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'adf-age-performance-report-single',
  templateUrl: './age-performance-report-single.component.html',
  styleUrls: ['./age-performance-report-single.component.scss']
})
export class AgePerformanceReportSingleComponent implements OnInit {
  @Input() campaignId: number;
  loadingData: boolean = true
  aacid: string = ""
  uid: string = ""
  uid_action: string =""
  user_access: User_Role;
  startDate: Date = null 
  endDate: Date = moment().toDate()
  wrapper:  google.visualization.ChartWrapper;
  options: google.visualization.BarChartOptions = {
    theme: 'pretty',
    legend: { position: 'none', maxLines: 3 },
    colors: ['#64b5f6', '#2196f3', '#0d47a1'],
    isStacked: true,
    bar: { groupWidth: '75%', },
    chartArea: {width: '50%', height: '50%'},
    animation: {
      duration: 3,
      startup: true,
      easing: 'in'
    },
    hAxis: {
                      
      maxAlternation: 2,
      minValue: 0, 
      format: 'short',
      gridlines: {
        color: 'transparent', 
    },
    minorGridlines: {
      count: 1,
    },
    viewWindowMode: 'pretty',
    viewWindow: {min: 0}
    },
    vAxis: {
      format: 'short',
    logScale: true,
      minorGridlines:{
        count: 0,
      },
       
      viewWindow: {
        min: 0,
      },
       gridlines: {
           count: 3
         },
         viewWindowMode: 'pretty',
         
    },
    focusTarget: 'category',
    annotations: {
        highContrast: false,
        
        textStyle: {
      fontSize: 18,
      bold: true,
      italic: true,
      // The color of the text.
      color: '#fff',
      // The color of the text outline.
      auraColor: '#1e88e5',
      // The transparency of the text.
      opacity: 0.8
        }
    }
  };
  setDateTimeZero(date: any): Date{
    let new_date = new Date(date)
    new_date.setHours(0,0,0,0)
    return new_date
  }
  constructor(private router: Router, private auth: AuthService, private accountsService: AccountsService, private storageService: LocalStorageService, private route: ActivatedRoute, private displayService: DisplayService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }
  getAgePerformanceReportData(): Promise<AGE_RANGE_REPORT[]>{
    return new Promise(resolve => {
      this.displayService.checkAgeRangeReportSingle(this.campaignId).then(report=>{
        if(report===null){
          this.loadingData = false
          let startDateFormattedGoogle = [this.setDateTimeZero(this.auth.getCreationAccountTime()).getFullYear(), ('0' + (this.setDateTimeZero(moment().subtract(7, 'days')).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(moment().subtract(7, 'days')).getDate())).slice(-2),].join('');
        let endDateFormattedGoogle = [this.setDateTimeZero(this.endDate).getFullYear(), ('0' + (this.setDateTimeZero(this.endDate).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(this.endDate).getDate())).slice(-2),].join('');
        this.displayService.getAgeRangePerformanceReportSingle(this.campaignId, startDateFormattedGoogle, endDateFormattedGoogle).then(res => {
          if(res.length>1){
            this.groupAgeRangePerformanceReportByCriteria(res).then(groupByCriteria=>{
              let i = 0, result:Row[] = [];
              let _result_ = []
                while(i < groupByCriteria.reportField.length){
                    result.push([])
                    for(let key in groupByCriteria.reportField[i].fields){
                      
                      result[result.length-1].push(groupByCriteria.reportField[i].fields[key])	
                    }
                    i++
                }
                ////console.log(result)
                result.forEach((value, __index)=>{
                  ////console.log(value)
                  /* value.splice(1,1) */
                  _result_.push(value)
                  if(__index===result.length-1){
                    var data = new google.visualization.DataTable()
                    data.addColumn('string', 'Tranche');
                    data.addColumn('number', 'Clics');
                    data.addColumn('number', 'Coût');
                    data.addColumn('number', 'Impressions');
                    
                   
                    data.addRows(_result_)
                    //////console.log(_result_)
                    let options = {};
                    
                    ////////console.log(this.wrapper)
                    this.wrapper = new google.visualization.ChartWrapper({
                      chartType: "BarChart",
                      dataTable: data,
                      options: this.options,
                      containerId: 'age_range_div'
                    });
                    this.wrapper.draw();
                  }
                })
              
            }).catch(errGroupByCountry=>{
              ////////console.log(errGroupByCountry)
            })

          }else{
            //////console.log(_result_)
            var data = new google.visualization.DataTable()
            data.addColumn('string', 'Tranche');
              data.addColumn('number', 'Clics');
              data.addColumn('number', 'Coût');
              data.addColumn('number', 'Impressions');
            data.addRows([
              ["18-24", 0,0,0],
              ["25-34", 0,0,0],
              ["35-44", 0,0,0],
              ["45-54", 0,0,0],
              ["55-64", 0,0,0],
              ["65 and more", 0,0,0],
              ["Undetermined", 0,0,0]
            ])
            ////////console.log(_result_)
            let options = {};
            ////////console.log(this.wrapper)
            setTimeout(() => {
              this.wrapper = new google.visualization.ChartWrapper({
                chartType: "BarChart",
                dataTable: data,
                options: this.options,
                containerId: 'age_range_div'
              })
         
              this.wrapper.draw();
              ////////console.log(this.wrapper)
            }, 500);
          }
        })
        }else{
          ////////console.log(report)
          this.loadingData = false
          let i = 0, result:Row[] = [];
          let _result_ = []

            while(i < report.reportField.length){
                result.push([])
                for(let key in report.reportField[i].fields){
                    result[result.length-1].push(report.reportField[i].fields[key])	
                }
                i++
            }
            //////console.log(result)
            //////console.log(result.length)
            result.forEach((value, __index)=>{
              //////console.log(value)
              //////console.log(__index)
              //////console.log(`${value[2]},${value[0]}, ${value[1]}, ${value[3]}`)
              /* value.shift() */
              _result_.push([value[2],value[0], value[1], value[3]])
              //////console.log(_result_)
              if(__index===result.length-1){
                var data = new google.visualization.DataTable()
                data.addColumn('string', 'Tranche');
                  data.addColumn('number', 'Clics');
                  data.addColumn('number', 'Coût');
                  data.addColumn('number', 'Impressions');
                data.addRows(_result_)
                //////console.log(_result_)
                ////////console.log(_result_)
                let options = {};
                ////////console.log(this.wrapper)
                setTimeout(() => {
                  this.wrapper = new google.visualization.ChartWrapper({
                    chartType: "BarChart",
                    dataTable: data,
                    options: this.options,
                    containerId: 'age_range_div'
                  })
                  try{
                    this.wrapper.draw();

                  }catch(e){

                  }
                  ////////console.log(this.wrapper)
                }, 500);

              }

              
            })
        }

      }).catch(error=>{
        
        ////////console.log(error)
      })
    })
  }

  googleVisualizeData: AGE_REPORT_SAMPLE[] = []
  ageRangeReport: AGE_RANGE_REPORT[] = []
  clicks: Object[] = []
  costs: Object[] = []
  impressions: Object[] = []
  public enableSmartLabels: boolean = true
  public datalabel = { visible: true, name: 'text', position: 'Outside', template: '<div>${point.x}</div><div>${point.y}</div>'};
  groupAgeRangePerformanceReportByCriteria(geoTargetData: AGE_RANGE_REPORT[]):Promise<AGE_RANGE_MODEL_COLLECTION_FOR_REPORT>{
    return new Promise(resolve=>{
      geoTargetData.forEach((ageR: AGE_RANGE_REPORT, index: number, arr: AGE_RANGE_REPORT[])=>{
        let exist_age: boolean = this.ageRangeReport.some(el=>el.criteria===ageR.criteria)
        if(exist_age){
          this.ageRangeReport.forEach((ageEL: AGE_RANGE_REPORT, i, _arr_)=>{
              if(ageEL.criteria===ageR.criteria){
                ageEL.clicks = (parseFloat(ageEL.clicks) + parseFloat(ageR.clicks)).toFixed(10)
                ageEL.impressions = (parseFloat(ageEL.impressions) + parseFloat(ageR.impressions)).toFixed(10)
                ageEL.costs = (parseFloat(ageEL.costs) + parseFloat(ageR.costs)).toFixed(12)
              } 
          })
        }else{
          ////////////console.log(ageR)
          if(!ageR.campaignName.includes('--')){
            this.ageRangeReport.push(ageR)

          }
        }
        if(index===geoTargetData.length-1){
          ////console.log(this.ageRangeReport)
          this.ageRangeReport.forEach((item, y)=>{
            this.googleVisualizeData.push({
              'fields':{
                criteria: item.criteria,
                clicks: parseFloat(item.clicks),
                costs: parseFloat(parseFloat((parseFloat(item.costs)/1000000).toFixed(20)).toFixed(2)),
                impressions: parseFloat(parseFloat((parseFloat(item.impressions).toFixed(20))).toFixed(2))

              },
            })
            if(this.ageRangeReport.length-1===y){
              /* ////////console.log('geoTarget data ended') */
              this.displayService.saveAgeRangeReportSingle(this.campaignId, this.clicks, this.costs, this.impressions, this.ageRangeReport, this.googleVisualizeData).then(rep=>{
                /* ////////console.log(rep) */
                ////console.log(rep)
                if(rep!==null && rep.registeredTime!==undefined){
                  /* ////////console.log(locations.length) */
                  resolve(rep)

                }else{
                  resolve(rep)
                }
              })

            }
  

          })
        }
      })
    })
  }

}
