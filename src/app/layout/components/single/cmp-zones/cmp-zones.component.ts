import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatMenu } from '@angular/material/menu';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { PositionDataModel } from '@syncfusion/ej2-popups';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { MatRadioGroup, MatRadioChange } from '@angular/material/radio';
import { LOCATION } from 'src/app/utils/data';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { ToolbarItems, ContextMenuItem, GridLine, SelectionSettingsModel, GridComponent } from '@syncfusion/ej2-angular-grids';
import { MdePopover, MdePopoverTrigger } from '@material-extended/mde';
import { FormControl } from '@angular/forms';
import { GoogleMapsComponent } from '../../google-maps/google-maps.component';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from '../../lang.service';

@Component({
  selector: 'adf-cmp-zones',
  templateUrl: './cmp-zones.component.html',
  styleUrls: ['./cmp-zones.component.scss']
})
export class CmpZonesComponent implements OnInit {
  SN_LOCATION: LOCATION = {
    displayType: "Country",
    id: 2686,
    locationName: "Senegal",
    reach: 2060000,
    targetingStatus: "ACTIVE",
    criterionId: 0,
  }
  searchLocation = new FormControl('')
  @ViewChild('dialogSearchZones', { static: false }) dialogSearchZones: DialogComponent;
  @ViewChild(MdePopoverTrigger, { static: false }) popover: MdePopoverTrigger;
  @ViewChild(MdePopover, { static: false }) popoverComponent: MdePopover;
  @ViewChild(GoogleMapsComponent, { static: false }) maps: GoogleMapsComponent;
  @ViewChild('dialogExcludeTargeted', { static: false }) dialogExcludeTargeted: DialogComponent;
   @ViewChild('dialogTargetExcluded', { static: false }) dialogTargetExcluded: DialogComponent;
  @ViewChild('zonesOptions', { static: false }) zonesOptions: MatRadioGroup;
  @ViewChild('matSelectionList', { static: false }) matSelectionList: MatSelectionList;
  @ViewChild('appSnackBar', { static: false }) appSnackBar: SnackbarComponent;
  @ViewChild('gridTargetedZones', { static: false }) gridTargetedZones: GridComponent
   @ViewChild('gridExcludedZones', {static: false}) gridExcludedZones: GridComponent
    public visible: boolean = false
  public isModal: boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  public zoneSelectedToDisplay: string = "Sénégal"
  public LOCATIONS_TO_TARGET: LOCATION[] = []
  public LOCATIONS_TO_EXCLUDE: LOCATION[] = []
  public selectedLocation: LOCATION = null
  public showProgressExcludeTargeted: boolean = false
  public showProgressTargetExcluded: boolean = false

   public toolbarOptions: ToolbarItems[];
  public contextMenuItems: ContextMenuItem[];
  public gridLines: GridLine;
  public selectionOptions: SelectionSettingsModel;
   public data: Object;
    public filter: Object;
    public filterSettings: Object;
    public selectionSettings: Object;  
  public height: string = '240px';

  zonesDataTargetOption: any = [{'id': '1', 'label': 'critere__location_1'}, {'id': '2', 'label': "critere_location_targeted_2"}, {'id': '3', 'label': "critere_location_targeted_3"}
  ];
   zonesDataExcludeOption: any = [{'id': '1', 'label': 'critere_excluded_location_1'}, {'id': '2', 'label': "critere_excluded_location_2"}
  ];
  
  zonesOptionTargetSelected: string = "1"
  zonesOptionExcludeSelected: string = "1"

  expanded = true;
  selected = false;

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
      this.zonesExpansion.open(); // Here's the magic
    }else{
      this.zonesExpansion.close()
    }
  }
  constructor(private displayService: DisplayService, private translate: TranslateService, private lang: LangService) {
    this.lang.language.subscribe(lang=>{
      this.translate.use(lang)
    })
   }

  ngOnInit(): void {
    
    
  }
    public componentReady: boolean = false
  public panelOpenState: boolean = true
 zonesOptionSelected: string = "all";
  zonesData: any = [{'id': 'all', 'label': 'all_targeted_countries'},  {'id': 'custom', 'label': 'choose_territories'}
    ];
 
  @ViewChild('zonesExpansion', {static: false}) zonesExpansion: MatExpansionPanel
 @ViewChild('rootMenu', {static: false}) rootMenu: MatMenu

 public showProgressSearchLocation: boolean = false
  inputClick() {
    this.panelOpenState = true
   
    this.zonesExpansion.toggle()


  }

  @Output() selectedLocations: EventEmitter<any> = new EventEmitter<any>()
  @Output() locationsTargeted: EventEmitter<LOCATION[]> = new EventEmitter<LOCATION[]>()
  @Output() locationsExcluded: EventEmitter<LOCATION[]> = new EventEmitter<LOCATION[]>()

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
   /*  this.selectedLocations.emit({
      "target": this.SN_LOCATION,
      "exclude": []
    }) */

    this.searchLocation.valueChanges.subscribe(value => {
    
       document.getElementById('inputZones').focus()
    /* this.popover.targetOffsetY = 10 */
      this.popover.openPopover()
    if (!this.popover.popoverOpen) {
      this.popover.openPopover()
      this.popoverComponent.closeOnClick = false
      this.popoverComponent.closeDisabled = true
      this.popover.closeOnClick = false
      this.popover.popover.closeOnClick = false
      this.popover.popover.closeDisabled = false
      this.popover.popover.overlapTrigger = false
      this.popoverComponent.focusTrapEnabled = true
      this.popoverComponent.focusTrapAutoCaptureEnabled = true
      this.popover.backdropCloseOnClick = false
      document.getElementById('inputZones').focus()
    }
    /* this.popoverComponent.closeDisabled */
    if (this.lastQuerySearcher !== value) {
      document.getElementById('inputZones').focus()
          this.lastQuerySearcher = value
      this.showProgressSearchLocation = true
      document.getElementById('inputZones').focus()
      this.displayService.getAllLocations(value).then((locations: LOCATION[]) => {
        if (locations !== null) {
          document.getElementById('inputZones').focus()
          if (locations.length > 0) {
            this.mergeLocationWithoutDuplicates(locations)
            document.getElementById('inputZones').focus()
          } else {

            document.getElementById('inputZones').focus()
             this.showProgressSearchLocation = false
          }
        
        
        }
      })
    } 
    })
    // this.LOCATIONS_TO_TARGET = [this.SN_LOCATION]
    // this.locationsTargeted.emit([this.SN_LOCATION])
    this.LOCATIONS_TO_TARGET = []
    this.LOCATIONS_TO_EXCLUDE = []
    if(this.maps!==undefined){
      this.maps.resetMarker()

    }

    this.zoneSelectedToDisplay = "Tous les pays et territoires"
    
    
   
  }

  LIST_LOCATIONS_ALL_READY_GET: LOCATION[] = [] 

   mergeLocationWithoutDuplicates(arrays: LOCATION[]) {
    var ids = new Set(arrays.map(d => d.id));
     this.LIST_LOCATIONS_ALL_READY_GET = [...this.locations, ...arrays.filter(d => !ids.has(d.id))];
       this.showProgressSearchLocation = false
     this.locations = arrays
    
    

    //Some more code here
}
  register(event: MatRadioChange) {  
    if (this.zonesOptionSelected === 'custom') {
      this.maps.resetMarker()
      this.zoneSelectedToDisplay = "Ciblage en fonction des zones à cibler et à exclure" 
      /* document.getElementById('inputZones').focus() */
      this.LOCATIONS_TO_TARGET = []
      this.LOCATIONS_TO_EXCLUDE = []
      } else if (this.zonesOptionSelected === 'default') {
      this.zoneSelectedToDisplay = "Sénégal" 
      this.LOCATIONS_TO_EXCLUDE = []
      this.LOCATIONS_TO_TARGET = []
      let q = "Sénégal"
      this.LOCATIONS_TO_TARGET.push(this.SN_LOCATION)
      this.locationsTargeted.emit([this.SN_LOCATION])
      this.maps.resetMarker()
      this.maps.setMapObject(this.SN_LOCATION, this.SN_LOCATION.locationName)
      this.displayService.getAllLocations(q).then((locations: LOCATION[]) => {
       /*  if (locations !== null) {
          if (locations.length > 0) {
             for (let i = 0; i < locations.length; i++){
              if (locations[i].locationName === q) {
                
                
              }
            }
          } 
        } */
      })     
    } else if (this.zonesOptionSelected === 'all') {
      this.maps.resetMarker()
      this.LOCATIONS_TO_TARGET = []
      this.LOCATIONS_TO_EXCLUDE = []
        this.zoneSelectedToDisplay = "Tous les pays et territoires"
      }
  }

  getZones():Promise<string> {
    return new Promise(resolve => {
         if (this.zonesOptionSelected === 'custom') {
           if (this.LOCATIONS_TO_TARGET.length > 0 || this.LOCATIONS_TO_EXCLUDE.length > 0) {
             this.componentReady = true
             resolve('ok')
           } else {
              let q = "Sénégal"
              this.displayService.getAllLocations(q).then((locations: LOCATION[]) => {
        if (locations !== null) {
          if (locations.length > 0) {
            this.mergeLocationWithoutDuplicates(locations)
            
          } else {
             this.showProgressSearchLocation = false
          }
        
        
        }
      })     
           }
      } else if (this.zonesOptionSelected === 'default') {
      this.zoneSelectedToDisplay = "Sénégal" 
      } else if (this.zonesOptionSelected === 'all') {
        this.zoneSelectedToDisplay = "Tous les pays et territoires"
      }
    })
  }

  closeToolbarTarget() {
    this.selectedLocation = null
    this.matSelectionList.deselectAll()
  }
/*   radioCilck() {
    
   if (this.zonesOptionSelected === 'custom') {
        this.dialogSearchZones.show()
        this.zoneSelectedToDisplay = "Custom" 
         document.getElementById('inputZones').focus()
      } else if (this.zonesOptionSelected === 'default') {
     this.zoneSelectedToDisplay = "Sénégal"
     let q = "Sénégal"
       this.displayService.getAllLocations(q).then((locations: LOCATION[]) => {
        if (locations !== null) {
          if (locations.length > 0) {
             this.mergeLocationWithoutDuplicates(locations)
            for (let i = 0; i < locations.length; i++){
              if (locations[i].locationName === q) {
                this.LOCATIONS_TO_TARGET.push(locations[i])
              }
            }
            
            
          }
        
        }
      })
        
      } else if (this.zonesOptionSelected === 'all') {
        this.zoneSelectedToDisplay = "Tous les pays et territoires"
      } 
  } */
  public lastQuerySearcher: string = ""
  public locations: LOCATION[] = []
  inputChange(value: string) {
   
  }
  selectLocations() {
    
  
}
  onZoneSelect(args: MatSelectionListChange) {
    this.selectedLocation = args.option.value
    //console.log(this.selectedLocation)
  }

  addZonesTarget(location: LOCATION) {
    this.selectedLocation = location
    this.checkIfZoneIsAllReadyTarget(this.selectedLocation.id)
      .then(isTarget => {
        //console.log(isTarget)
        if (isTarget) {
          //console.log('already target')
        } else {
          this.checkIfZoneIsAllReadyExclude(this.selectedLocation.id)
            .then(isExclude => {
              if (isExclude) {
                //console.log('is exclude do you want to target')
                this.dialogTargetExcluded.show()
              } else {
                let location: LOCATION = {
                  id: this.selectedLocation.id,
                  criterionId: 0,
                  locationName: this.selectedLocation.locationName,
                  canonicalName: this.selectedLocation.canonicalName,
                  displayType: this.selectedLocation.displayType,
                  targetingStatus: this.selectedLocation.targetingStatus,
                  reach: this.selectedLocation.reach
                }
                this.LOCATIONS_TO_TARGET.push(location)
                this.locationsTargeted.emit(this.LOCATIONS_TO_TARGET)
                this.successOperationTarget()
                this.maps.setMapObject(location, location.locationName)
              }
            }).catch((e) => {
              console.error(e)
            })
        }
      }).catch((e) => {
        console.error(e)
      })
  }
  excludeZonesTarget(location: LOCATION) {
    this.selectedLocation = location
    this.checkIfZoneIsAllReadyExclude(this.selectedLocation.id)
      .then(isExclude => {
        if (isExclude) {
          //console.log('already exclude')
          
        } else {
          this.checkIfZoneIsAllReadyTarget(this.selectedLocation.id)
            .then(isTarget => {
              if (isTarget) {
                //console.log('is already target do yout want to exclude')
                this.dialogExcludeTargeted.show()
              } else {
                let location: LOCATION = {
                  id: this.selectedLocation.id,
                  criterionId: 0,
                  locationName: this.selectedLocation.locationName,
                  canonicalName: this.selectedLocation.canonicalName,
                  displayType: this.selectedLocation.displayType,
                  targetingStatus: this.selectedLocation.targetingStatus,
                  reach: this.selectedLocation.reach
                }
                this.LOCATIONS_TO_EXCLUDE.push(location)
                this.locationsExcluded.emit(this.LOCATIONS_TO_EXCLUDE)
                this.successOperationExclude()
                this.maps.setMapObjectExclude(location, location.locationName)
             
              }
            }).catch((e) => {
              console.error(e)
            })
        }
      }).catch((e) => {
        console.error(e)
      })
  }

  checkIfZoneIsAllReadyTarget(id: number): Promise<boolean>{
    return new Promise(resolve => {
      var found = this.LOCATIONS_TO_TARGET.some(loc=>loc.id===id);
      resolve(found)

      
    })
  }

   checkIfZoneIsAllReadyExclude(id: number): Promise<boolean>{
    return new Promise(resolve => {
      var found = this.LOCATIONS_TO_EXCLUDE.some(loc=>loc.id===id);
      resolve(found)
    })
   }
  
  removeLocationTargetedFromGrid(location: LOCATION) {
    this.gridTargetedZones.showSpinner()
    this.removeLocationToListOfTargeted(location)
      .then(isRemoved => {
        if (isRemoved) {
           this.maps.removeMarker(location)
          this.gridTargetedZones.refresh()
          this.gridTargetedZones.hideSpinner()
        } else {
          this.gridTargetedZones.hideSpinner()
      }
    })
  }
  removeLocationExcludedFromGrid(location: LOCATION) {
     this.gridExcludedZones.showSpinner()
    this.removeLocationToListOfExclude(location)
      .then(isRemoved => {
        if (isRemoved) {
          this.maps.removeMarkerExclude(location)
          this.gridExcludedZones.refresh()
          this.gridExcludedZones.hideSpinner()
        } else {
          this.gridExcludedZones.hideSpinner()
      }
    })
  }
  removeLocationToListOfTargeted(location: LOCATION):Promise<boolean> {
    return new Promise(resolve => {

      var promise = resolve(true)
      for(let i = 0; i < this.LOCATIONS_TO_TARGET.length; i++) {
          if (this.LOCATIONS_TO_TARGET[i].id === location.id) {
            this.LOCATIONS_TO_TARGET.splice(this.LOCATIONS_TO_TARGET.indexOf(this.LOCATIONS_TO_TARGET[i]), 1)
            this.locationsTargeted.emit(this.LOCATIONS_TO_TARGET)
            promise
              
          }
      }
     
    })
  }

   removeLocationToListOfExclude(location: LOCATION):Promise<boolean> {
    return new Promise(resolve => {
       var promise = resolve(true)
      for(var i = 0; i < this.LOCATIONS_TO_EXCLUDE.length; i++) {
          if (this.LOCATIONS_TO_EXCLUDE[i].id === location.id) {
            this.LOCATIONS_TO_EXCLUDE.splice(this.LOCATIONS_TO_EXCLUDE.indexOf(this.LOCATIONS_TO_EXCLUDE[i]), 1)
            this.locationsExcluded.emit(this.LOCATIONS_TO_EXCLUDE)
            promise
              
          }
      }
    })
   }
  
  addToListOfTarget(location: LOCATION): Promise<boolean> {
    return new Promise(resolve => {
      this.LOCATIONS_TO_TARGET.push(location)
      this.locationsTargeted.emit(this.LOCATIONS_TO_TARGET)
      resolve(true)
      
    })
  }

   addToListOfExclude(location: LOCATION): Promise<boolean> {
    return new Promise(resolve => {
      this.LOCATIONS_TO_EXCLUDE.push(location)
      this.locationsExcluded.emit(this.LOCATIONS_TO_EXCLUDE)
      resolve(true)
      
    })
   }
  
  successOperationTarget() {
    this.appSnackBar.openSnackBar(5, 'Zone ajoutée avec succès !', '', 'snack-success')
    setTimeout(() => {
      /* this.gridTargetedZones.dataSource = this.LOCATIONS_TO_TARGET */
      /* this.gridExcludedZones.dataSource = this.LOCATIONS_TO_EXCLUDE */
      if (this.LOCATIONS_TO_TARGET.length > 0) {
        this.gridTargetedZones.refresh()
        
      }
      if (this.LOCATIONS_TO_EXCLUDE.length > 0) {
        this.gridExcludedZones.refresh()
        
      }
      
    }, 500); 
    

  }
  successOperationExclude() {
    this.appSnackBar.openSnackBar(5, 'Zone exclue avec succès', '', 'snack-success')
    setTimeout(() => {
      /* this.gridTargetedZones.dataSource = this.LOCATIONS_TO_TARGET */
      /* this.gridExcludedZones.dataSource = this.LOCATIONS_TO_EXCLUDE */
      if (this.LOCATIONS_TO_TARGET.length > 0) {
        this.gridTargetedZones.refresh()
        
      }
      if (this.LOCATIONS_TO_EXCLUDE.length > 0) {
        this.gridExcludedZones.refresh()
        
      }
      
    }, 500);
  }

  excludeLocationButtonAction() {
    this.showProgressExcludeTargeted = true
    this.removeLocationToListOfTargeted(this.selectedLocation)
      .then(isRemoved => {
        if (isRemoved) {
          this.addToListOfExclude(this.selectedLocation)
            .then(isAdded => {
              if (isAdded) {
                this.showProgressExcludeTargeted = false
                this.dialogExcludeTargeted.hide()
                this.successOperationExclude()
                this.maps.removeMarker(this.selectedLocation)
                this.maps.setMapObjectExclude(this.selectedLocation, this.selectedLocation.locationName)
                
              } else {
                console.error('erreur')
                this.showProgressExcludeTargeted = false
              }
            }).catch((e) => {
              console.error(e)
              this.showProgressExcludeTargeted = false
            })
        } else {
          console.error('erreur')
          this.showProgressExcludeTargeted = false
        }
      }).catch((e) => {
        console.error(e)
        this.showProgressExcludeTargeted = false
      })
  }

  targetLocationButtonAction() {
      this.showProgressTargetExcluded = true
    this.removeLocationToListOfExclude(this.selectedLocation)
      .then(isRemoved => {
        if (isRemoved) {
          this.addToListOfTarget(this.selectedLocation)
            .then(isAdded => {
              if (isAdded) {
                this.showProgressTargetExcluded = false
                this.dialogTargetExcluded.hide()
                this.successOperationTarget()
                this.maps.setMapObject(this.selectedLocation, this.selectedLocation.locationName)
                this.maps.removeMarkerExclude(this.selectedLocation)
                
              } else {
                console.error('erreur')
                this.showProgressTargetExcluded = false
              }
            }).catch((e) => {
              console.error(e)
              this.showProgressTargetExcluded = false
            })
        } else {
          console.error('erreur')
          this.showProgressTargetExcluded = false
        }
      }).catch((e) => {
        console.error(e)
        this.showProgressTargetExcluded = false
      })
  }

  optionLocationTargeted: string = 'LOCATION_OF_PRESENCE'
  optionLocationExcluded: string = 'DONT_CARE'

  getOptionsTarget(): Promise<string> {
    return new Promise(resolve => {
      if (this.zonesOptionTargetSelected === '1') {
        this.optionLocationTargeted = 'LOCATION_OF_PRESENCE'
        resolve('ok')
      } else if (this.zonesOptionTargetSelected === '2') {
        this.optionLocationTargeted = 'LOCATION_OF_PRESENCE'
        resolve('ok')
      } else if (this.zonesOptionTargetSelected === '3') {
        this.optionLocationTargeted = 'DONT_CARE'
        resolve('ok')
      }
      
    })
  }
   getOptionsExclude(): Promise<string> {
    return new Promise(resolve => {
      if (this.zonesOptionExcludeSelected === '1') {
        this.optionLocationExcluded = 'LOCATION_OF_PRESENCE'
        resolve('ok')
      } else if (this.zonesOptionExcludeSelected === '2') {
        this.optionLocationExcluded = 'DONT_CARE'
        resolve('ok')
      }
      
    })
  }

}
