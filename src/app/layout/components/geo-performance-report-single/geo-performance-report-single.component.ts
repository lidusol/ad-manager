import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartType, Row } from 'angular-google-charts';
import * as moment from 'moment';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { GEO_REPORT_SAMPLE, GEO_TARGET_MODEL_COLLECTION_FOR_REPORT, GEO_TARGET_RESPONSE, LOCATION, User_Role } from 'src/app/utils/data';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'adf-geo-performance-report-single',
  templateUrl: './geo-performance-report-single.component.html',
  styleUrls: ['./geo-performance-report-single.component.scss']
})
export class GeoPerformanceReportSingleComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService, private accountsService: AccountsService, private storageService: LocalStorageService, private route: ActivatedRoute, private displayService: DisplayService, private formBuilder: FormBuilder) { }
  aacid: string = ""
  uid: string = ""
  uid_action: string =""
  user_access: User_Role;
  loadingData: boolean = true
  public palette: string[];
  public pieData: Object[];
  public startAngle: number;
  public endAngle: number;
  public center: Object ;
  public centerCosts: Object ;
  public centerImpressions: Object ;
  public explode: boolean ;
  public enableAnimation: boolean ;
  public title: string ;
  public radius: string ;
  showSpinnerChart: boolean = false
  selected: any;
  geoTargetReport: GEO_TARGET_RESPONSE[] = []
  startDate: Date = null 
  endDate: Date = moment().toDate()
  setDateTimeZero(date: any): Date{
    let new_date = new Date(date)
    new_date.setHours(0,0,0,0)
    return new_date
  }
  tooltip = {enable: true, textStyle: {fontFamily: 'ProductSans', textAlignment: 'Center', color: "#5f6368"},
  enableAnimation: true,
  fill: "#fff"};
  filtered_geo_report: GEO_TARGET_RESPONSE[] = []
  report: any;
  options = {
    
  
   
  };
  listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = list[i];
        }

        matrix.push(list[i]);
    }

    return matrix;
}
@Input() campaignId: number;
wrapper:  google.visualization.ChartWrapper;
getGeoPerformanceReportData(): Promise<GEO_TARGET_RESPONSE[]>{
  return new Promise(resolve => {
    try{
      this.displayService.checkGeoTargetReportSingle(this.campaignId).then(report=>{
        if(report===null){
          this.loadingData = false
          let startDateFormattedGoogle = [this.setDateTimeZero(this.auth.getCreationAccountTime()).getFullYear(), ('0' + (this.setDateTimeZero(moment().subtract(7, 'days')).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(moment().subtract(7, 'days')).getDate())).slice(-2),].join('');
        let endDateFormattedGoogle = [this.setDateTimeZero(this.endDate).getFullYear(), ('0' + (this.setDateTimeZero(this.endDate).getMonth() + 1)).slice(-2), ('0' + (this.setDateTimeZero(this.endDate).getDate())).slice(-2),].join('');
        this.displayService.getGeoLocationsPerformanceReportSingle(this.campaignId, startDateFormattedGoogle, endDateFormattedGoogle).then(res => {
          if(res.length>1){
            this.groupGeoPerformanceReportByCountryID(res).then(groupByCountryID=>{
              //console.log(groupByCountryID)
              let i = 0, result:Row[] = [];
              let _result_ = []
                while(i < groupByCountryID.reportField.length){
                    result.push([])
                    for(let key in groupByCountryID.reportField[i].fields){
                      
                      result[result.length-1].push(groupByCountryID.reportField[i].fields[key])	
                    }
                    i++
                }
                
                result.forEach((value, __index)=>{
                  value.splice(1,1)
                  _result_.push(value)
                  if(__index===result.length-1){
                    var data = new google.visualization.DataTable()
                    data.addColumn('string', 'Pays');
                    data.addColumn('number', 'Coût');
                    data.addColumn('number', 'Impressions');
                    data.addRows(_result_)
                    let options = {};
                    ////console.log(this.wrapper)
                    this.wrapper = new google.visualization.ChartWrapper({
                      chartType: "GeoChart",
                      dataTable: data,
                      options: {defaultColor: '#f5f5f5',  datalessRegionColor: '#ccc', colorAxis: {colors: ['#81d4fa','#29b6f6','#1a237e']}},
                      containerId: 'regions_div'
                    });
                    this.wrapper.draw();
                  }
                })
              
            }).catch(errGroupByCountry=>{
              ////console.log(errGroupByCountry)
            })
  
          }else{
            var data = new google.visualization.DataTable()
                data.addColumn('string', 'Pays');
                data.addColumn('number', 'Impressions');
                data.addColumn('number', 'Coût');
                data.addRows([
                  ['Germany', 0, 0],
                  ['United States', 0, 0],
                  ['Brazil', 0, 0],
                  ['Canada', 0, 0],
                  ['France', 0, 0],
                  ['RU', 0, 0],
                  ['Senegal', 0, 0],
                  ['Mali', 0, 0],
                  ['Togo', 0, 0],
                  ['Guinea', 0, 0]
                ])
                ////console.log(_result_)
                let options = {};
                ////console.log(this.wrapper)
                setTimeout(() => {
                  try{
                    this.wrapper = new google.visualization.ChartWrapper({
                      chartType: "GeoChart",
                      dataTable: data,
                      options: {defaultColor: '#f5f5f5',  datalessRegionColor: '#ccc', colorAxis: {colors: ['#f5f5f5','#f5f5f5','#f5f5f5']}},
                      containerId: 'regions_div'
                    });
               
                    this.wrapper.draw();

                  }catch(e){

                  }
                  ////console.log(this.wrapper)
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
            
            ////console.log(result)
            result.forEach((value, __index)=>{
              value.shift()
              _result_.push(value.reverse())
              if(__index===result.length-1){
                var data = new google.visualization.DataTable()
                data.addColumn('string', 'Pays');
                data.addColumn('number', 'Impressions');
                data.addColumn('number', 'Coût');
                data.addRows(_result_)
                ////console.log(_result_)
                let options = {};
                ////console.log(this.wrapper)
                setTimeout(() => {
                  this.wrapper = new google.visualization.ChartWrapper({
                    chartType: "GeoChart",
                    dataTable: data,
                    options: {defaultColor: '#f5f5f5',  datalessRegionColor: '#ccc', colorAxis: {colors: ['#81d4fa','#29b6f6','#1a237e']}},
                    containerId: 'regions_div'
                  });
                  try{
                    
                    this.wrapper.draw();
                  }catch(e){
  
                  }
                  ////console.log(this.wrapper)
                }, 500);
  
              }
  
              
            })
        }
  
      }).catch(error=>{
        
       console.log(error)
      })

    }catch(e){
      console.log(e)
    }
    
  })
}

  googleVisualizeData: GEO_REPORT_SAMPLE[] = []
  clicks: Object[] = []
  costs: Object[] = []
  impressions: Object[] = []
  public enableSmartLabels: boolean = true
  public datalabel = { visible: true, name: 'text', position: 'Outside', template: '<div>${point.x}</div><div>${point.y}</div>'};
  groupGeoPerformanceReportByCountryID(geoTargetData: GEO_TARGET_RESPONSE[]):Promise<GEO_TARGET_MODEL_COLLECTION_FOR_REPORT>{
    return new Promise(resolve=>{
      let locations: LOCATION[] = []
      geoTargetData.forEach((geoP: GEO_TARGET_RESPONSE, index: number, arr: GEO_TARGET_RESPONSE[])=>{
        let exist_zones: boolean = this.geoTargetReport.some(el=>el.countryID===geoP.countryID)
        if(exist_zones){
          this.geoTargetReport.forEach((geoEL: GEO_TARGET_RESPONSE, i, _arr_)=>{
              if(geoEL.countryID===geoP.countryID){
                geoEL.clicks = (parseFloat(geoEL.clicks) + parseFloat(geoP.clicks)).toFixed(10)
                geoEL.impressions = (parseFloat(geoEL.impressions) + parseFloat(geoP.impressions)).toFixed(10)
                geoEL.costs = (parseFloat(geoEL.costs) + parseFloat(geoP.costs)).toFixed(12)
              } 
          })
        }else{
          ////////console.log(geoP)
          if(!geoP.campaignName.includes('--')){
            this.geoTargetReport.push(geoP)

          }
        }
        if(index===geoTargetData.length-1){
          ////////console.log(this.geoTargetReport)
          this.geoTargetReport.forEach((item, y)=>{
            let locToUse: LOCATION = null
            if(!item.countryID.includes('--')){
              this.displayService.getLocationFirestore(item.countryID.toString()).then((country)=>{
                /* ////console.log(country) */
                if(country!==null){
                      item.locationName = country.locationName 
                      this.clicks.push({x: item.locationName, y: parseFloat(item.clicks), text: item.locationName})
                      this.costs.push({x: item.locationName, y: parseFloat(parseFloat((parseFloat(item.costs)/1000000).toFixed(20)).toFixed(2)), text: item.locationName})
                      this.impressions.push({x: item.locationName, y: parseFloat(parseFloat((parseFloat(item.impressions).toFixed(20))).toFixed(2)), text: item.locationName})
                      this.googleVisualizeData.push({
                        'fields':{
                          pays: item.locationName,
                          clicks: parseFloat(item.clicks),
                          costs: parseFloat(parseFloat((parseFloat(item.costs)/1000000).toFixed(20)).toFixed(2)),
                          impressions: parseFloat(parseFloat((parseFloat(item.impressions).toFixed(20))).toFixed(2))
    
                        },
                      })
                    
                    if(this.geoTargetReport.length-1===y){
                      /* ////console.log('geoTarget data ended') */
                      this.displayService.saveGeoTargetReportSingle(this.campaignId, this.clicks, this.costs, this.impressions, this.geoTargetReport, this.googleVisualizeData).then(rep=>{
                        /* ////console.log(rep) */
                        if(rep!==null && rep.registeredTime!==undefined){
                          /* ////console.log(locations.length) */
                          if(locations.length>0){
                            this.displayService.saveLocation(locations).then((saved)=>{
                              /* ////console.log(saved) */
                              resolve(rep)
      
                            }).catch((errSaved)=>{
                              ////console.log(errSaved)
                              resolve(rep)
                            })

                          }else{
                            resolve(rep)
                          }
    
                        }else{
                          resolve(rep)
                        }
                      })
      
                    }
                  
                }else{
                  this.displayService.getAllLocationWithId(item.countryID).then(locName=>{
                    if(locName!==null && locName!==undefined && locName.locationName!==undefined){
                      locations.push(locName)
                      item.locationName = locName.locationName 
                      this.clicks.push({x: item.locationName, y: parseFloat(item.clicks), text: item.locationName})
                      this.costs.push({x: item.locationName, y: parseFloat(parseFloat((parseFloat(item.costs)/1000000).toFixed(20)).toFixed(2)), text: item.locationName})
                      this.impressions.push({x: item.locationName, y: parseFloat(parseFloat((parseFloat(item.impressions).toFixed(20))).toFixed(2)), text: item.locationName})
                      this.googleVisualizeData.push({
                        'fields':{
                          pays: item.locationName,
                          clicks: parseFloat(item.clicks),
                          costs: parseFloat(parseFloat((parseFloat(item.costs)/1000000).toFixed(20)).toFixed(2)),
                          impressions: parseFloat(parseFloat((parseFloat(item.impressions).toFixed(20))).toFixed(2))
    
                        },
                      })
                      if(this.geoTargetReport.length-1===y){
                        this.displayService.saveGeoTargetReportSingle(this.campaignId, this.clicks, this.costs, this.impressions, this.geoTargetReport, this.googleVisualizeData).then(rep=>{
                          if(rep!==null && rep.registeredTime!==undefined){
                            if(locations.length>0){
                              this.displayService.saveLocation(locations).then((saved)=>{
                                ////////console.log(this.geoTargetReport)
                                resolve(rep)
        
                              }).catch((errSaved)=>{
                                ////console.log(errSaved)
                                resolve(rep)
                              })
                            }else{
                              resolve(rep)
                            }
                            
      
                          }
                        })
        
                      }
                    }
                  }).catch(e=>{
                    ////console.log(e)
                    /* ////console.log('error while gettion location') */
                  })
                  
                }
              })
              
            }

          })
        }
      })
    })
  }
  myType = ChartType.GeoChart
  myData: Row[] = [
    ['Country',  'impressions'],
    ['Germany', 200],
    ['United States', 300],
    ['Brazil', 400],
    ['Canada', 500],
    ['France', 600],
    ['RU', 700]
  ]

  ngOnInit(): void {
    
this.startAngle = 0;
this.endAngle = 360;
this.radius = 'r';
this.enableAnimation = true;
this.center = {x: '50%', y: '30%'};
this.centerCosts = {x: '50%', y: '30%'};
this.centerImpressions = {x: '50%', y: '30%'};
this.explode = true;
this.title = 'Mobile Browser Statistics';

this.palette = ["#E94649", "#F6B53F", "#6FAAB0", "#FF33F3","#228B22","#3399FF"]
  }

  
  ngAfterViewInit(): void {
   setTimeout(()=>{
    google.charts.load('current', {
      'packages':['geochart'],
      'mapsApiKey': 'AIzaSyDWWL2sAz2tVIUPlyl5sXXt3veuHRgBA64'
    });
    /* this.getGeoPerformanceReportData() */
   },500)

  }

}
