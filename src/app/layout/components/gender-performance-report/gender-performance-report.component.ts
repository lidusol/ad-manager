import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Row } from 'angular-google-charts';
import * as moment from 'moment';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { GENDERS_MODEL_COLLECTION_FOR_REPORT, GENDERS_REPORT, User_Role, GENDERS_REPORT_SAMPLE } from 'src/app/utils/data';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'adf-gender-performance-report',
  templateUrl: './gender-performance-report.component.html',
  styleUrls: ['./gender-performance-report.component.scss']
})
export class GenderPerformanceReportComponent implements OnInit {
  loadingData: boolean = true
  aacid: string = ""
  uid: string = ""
  uid_action: string =""
  user_access: User_Role;
  startDate: Date = null 
  endDate: Date = moment().toDate()
 
  setDateTimeZero(date: any): Date{
    let new_date = new Date(date)
    new_date.setHours(0,0,0,0)
    return new_date
  }
  constructor(private router: Router, private auth: AuthService, private accountsService: AccountsService, private storageService: LocalStorageService, private route: ActivatedRoute, private displayService: DisplayService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }
  getGendersPerformanceReportData(): Promise<GENDERS_REPORT[]>{
    return new Promise(resolve => {
      try{
        var wrapper:  google.visualization.ChartWrapper;
        var options: google.visualization.BarChartOptions = {
          theme: 'pretty',
          legend: { position: 'none', maxLines: 3 },
          colors: ['#64b5f6', '#2196f3', '#0d47a1'],
          isStacked: true,
          animation: {
            duration: 1,
            startup: true,
            easing: 'in'
          },
          bar: { groupWidth: '75%' },
          chartArea: {width: '50%', height: '50%'},
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
          logScale: false,
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
            auraColor: '#00b0ff',
            // The transparency of the text.
            opacity: 0.8
              }
          }
        };
        this.displayService.checkGendersReport(this.aacid).then(report=>{
          if(report===null){
            this.loadingData = false
            let startDateFormattedGoogle = [this.setDateTimeZero(this.auth.getCreationAccountTime()).getFullYear(), ('0' + (this.setDateTimeZero(moment().subtract(7, 'days')).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(moment().subtract(7, 'days')).getDate())).slice(-2),].join('');
          let endDateFormattedGoogle = [this.setDateTimeZero(this.endDate).getFullYear(), ('0' + (this.setDateTimeZero(this.endDate).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(this.endDate).getDate())).slice(-2),].join('');
          this.displayService.getGendersPerformanceReport(this.uid, this.aacid, startDateFormattedGoogle, endDateFormattedGoogle).then(res => {
            if(res.length>1){
              this.groupGendersPerformanceReportByCriteria(res).then(groupByCriteria=>{
                let i = 0, result:Row[] = [];
                let _result_ = []
                  while(i < groupByCriteria.reportField.length){
                      result.push([])
                      for(let key in groupByCriteria.reportField[i].fields){
                        
                        result[result.length-1].push(groupByCriteria.reportField[i].fields[key])	
                      }
                      i++
                  }
                  //console.log(result)
                  result.forEach((value, __index)=>{
                    /* value.splice(1,1) */
                    if(value[0].toString()==='Male'){
                      _result_.push(["Homme", value[1], value[2], value[3]])
                    }else if(value[0].toString()==='Female'){
                      _result_.push(["Femme", value[1], value[2], value[3]])
                    }else if(value[0].toString()==='Undetermined'){
                      _result_.push(["Inconnu", value[1], value[2], value[3]])
                    }
                    
                    if(__index===result.length-1){
                      var data = new google.visualization.DataTable()
                      data.addColumn('string', 'Genre');
                      data.addColumn('number', 'Clics');
                      data.addColumn('number', 'Coût');
                      data.addColumn('number', 'Impressions');
                     
                      data.addRows(_result_)
                      //console.log(_result_)
                      let options = {};
                      
                      ////console.log(wrapper)
                      wrapper = new google.visualization.ChartWrapper({
                      
                        chartType: "BarChart",
                        dataTable: data,
                        options: options,
                        containerId: 'genders_report_div'
                      });
                      wrapper.draw();
                    }
                  })
                
              }).catch(errGroupByCountry=>{
                ////console.log(errGroupByCountry)
              })
  
            }else{
              var data = new google.visualization.DataTable()
              data.addColumn('string', 'Genre');
                data.addColumn('number', 'Clics');
                data.addColumn('number', 'Coût');
                data.addColumn('number', 'Impressions');
              data.addRows([
                ["Homme", 0,0,0],
                ["Femme", 0,0,0],
                ["Inconnu", 0,0,0],
              ])
              //////console.log(_result_)
              ////////console.log(_result_)
              let options = {};
              ////////console.log(wrapper)
              setTimeout(() => {
                wrapper = new google.visualization.ChartWrapper({
                  chartType: "BarChart",
                  dataTable: data,
                  options: options,
                  containerId: 'genders_report_div'
                })
           
                wrapper.draw();
                ////////console.log(wrapper)
              }, 500);
            }
          })
          }else{
            this.loadingData = false
            ////console.log(report)
            let i = 0, result:Row[] = [];
            let _result_ = []
  
              while(i < report.reportField.length){
                  result.push([])
                  for(let key in report.reportField[i].fields){
                      result[result.length-1].push(report.reportField[i].fields[key])	
                  }
                  i++
              }
              //console.log(result)
              //console.log(result.length)
              result.forEach((value, __index)=>{
                //console.log(value)
                //console.log(__index)
                //console.log(`${value[2]},${value[0]}, ${value[1]}, ${value[3]}`)
                /* value.shift() */
                if(value[2].toString()==='Male'){
                  _result_.push(["Homme",value[0], value[1], value[3]])
                }else if(value[2].toString()==='Female'){
                  _result_.push(["Femme",value[0], value[1], value[3]])
                }else if(value[2].toString()==='Undetermined'){
                  _result_.push(["Inconnu",value[0], value[1], value[3]])
                }
                
                //console.log(_result_)
                if(__index===result.length-1){
                  var data = new google.visualization.DataTable()
                  data.addColumn('string', 'Genre');
                    data.addColumn('number', 'Clics');
                    data.addColumn('number', 'Coût');
                    data.addColumn('number', 'Impressions');
                  data.addRows(_result_)
                  //console.log(_result_)
                  ////console.log(_result_)
                  let options = {};
                  ////console.log(wrapper)
                  setTimeout(() => {
                    wrapper = new google.visualization.ChartWrapper({
                      chartType: "BarChart",
                      dataTable: data,
                      options: options,
                      containerId: 'genders_report_div'
                    })
               
                    wrapper.draw();
                    ////console.log(wrapper)
                  }, 500);
  
                }
  
                
              })
          }
  
        }).catch(error=>{
          
          ////console.log(error)
        })
      }catch(e){
        console.log(e)
      }
    })
  }

  googleVisualizeData: GENDERS_REPORT_SAMPLE[] = []
  gendersReport: GENDERS_REPORT[] = []
  clicks: Object[] = []
  costs: Object[] = []
  impressions: Object[] = []
  public enableSmartLabels: boolean = true
  public datalabel = { visible: true, name: 'text', position: 'Outside', template: '<div>${point.x}</div><div>${point.y}</div>'};
  groupGendersPerformanceReportByCriteria(gendersData: GENDERS_REPORT[]):Promise<GENDERS_MODEL_COLLECTION_FOR_REPORT>{
    return new Promise(resolve=>{
      gendersData.forEach((genR: GENDERS_REPORT, index: number, arr: GENDERS_REPORT[])=>{
        let exist_age: boolean = this.gendersReport.some(el=>el.criteria===genR.criteria)
        if(exist_age){
          this.gendersReport.forEach((genEL: GENDERS_REPORT, i, _arr_)=>{
              if(genEL.criteria===genR.criteria){
                genEL.clicks = (parseFloat(genEL.clicks) + parseFloat(genR.clicks)).toFixed(10)
                genEL.impressions = (parseFloat(genEL.impressions) + parseFloat(genR.impressions)).toFixed(10)
                genEL.costs = (parseFloat(genEL.costs) + parseFloat(genR.costs)).toFixed(12)
              } 
          })
        }else{
          ////////console.log(genR)
          if(!genR.campaignName.includes('--')){
            this.gendersReport.push(genR)

          }
        }
        if(index===gendersData.length-1){
          ////////console.log(this.geoTargetReport)
          this.gendersReport.forEach((item, y)=>{
            this.googleVisualizeData.push({
              'fields':{
                criteria: item.criteria,
                clicks: parseFloat(item.clicks),
                costs: parseFloat(parseFloat((parseFloat(item.costs)/1000000).toFixed(20)).toFixed(2)),
                impressions: parseFloat(parseFloat((parseFloat(item.impressions).toFixed(20))).toFixed(2))

              },
            })
            if(this.gendersReport.length-1===y){
              /* ////console.log('geoTarget data ended') */
              this.displayService.saveGendersReport(this.aacid, this.clicks, this.costs, this.impressions, this.gendersReport, this.googleVisualizeData).then(rep=>{
                /* ////console.log(rep) */
                if(rep!==null && rep.registeredTime!==undefined){
                  /* ////console.log(locations.length) */
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
