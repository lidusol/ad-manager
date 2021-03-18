import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatMenu } from '@angular/material/menu';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { PositionDataModel } from '@syncfusion/ej2-popups';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { MatRadioGroup, MatRadioChange } from '@angular/material/radio';
import { LOCATION, User_Role } from 'src/app/utils/data';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { ToolbarItems, ContextMenuItem, GridLine, SelectionSettingsModel, GridComponent } from '@syncfusion/ej2-angular-grids';
import { MdePopover, MdePopoverTrigger } from '@material-extended/mde';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { FormControl } from '@angular/forms';
import { GoogleMapsComponent } from '../../google-maps/google-maps.component';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import {take} from 'rxjs/operators'
import { SearchService } from 'src/app/campaigns-management/services/search.service';

@Component({
  selector: 'adf-cmp-zones-edit',
  templateUrl: './cmp-zones-edit.component.html',
  styleUrls: ['./cmp-zones-edit.component.scss']
})
export class CmpZonesEditComponent implements OnInit {
   searchLocation = new FormControl('')
    aacid: string = ""
  cid: string = undefined
  uid: string = undefined;
  campaignId: number = 0
  ad_group_id: number = 0
  idA: string = ""
  adf_account_id: string = ""
  uid_action: string= ""
  user_access: User_Role;
    SN_LOCATION: LOCATION = {
    displayType: "Country",
    id: 2686,
    locationName: "Senegal",
    reach: 2060000,
    targetingStatus: "ACTIVE",
    criterionId: 0,
  }
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
  @ViewChild('gridExcludedZones', { static: false }) gridExcludedZones: GridComponent
   @ViewChild('gridEditTargetedZones', { static: false }) gridEditTargetedZones: GridComponent
   @ViewChild('gridEditExcludedZones', {static: false}) gridEditExcludedZones: GridComponent
    public visible: boolean = false
  public isModal: boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  public zoneSelectedToDisplay: string = "Sénégal"
  public LOCATIONS_TO_TARGET: LOCATION[] = []
  public LOCATIONS_TO_EXCLUDE: LOCATION[] = []
  public NEW_LOCATIONS_TO_TARGET: LOCATION[] = []
  public NEW_LOCATIONS_TO_EXCLUDE: LOCATION[] = []
  public NEW_EDIT_LOCATIONS_TO_TARGET: LOCATION[] = []
  public NEW_EDIT_LOCATIONS_TO_EXCLUDE: LOCATION[] = []
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
  
  constructor(private displayService: DisplayService, private searchService: SearchService, private router: Router, private route: ActivatedRoute, private storageService: LocalStorageService, private youtubeService: YoutubeService) { }

 ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.storageService.getUserIdAndAccountId().then(response => {
          if (response !== null) {
            this.aacid = response.aacid
            this.user_access  = response.role
            if (response.fromOwned) {
                this.uid_action = response.auid
               
              
              this.cid = params['cid'];
                   this.uid = response.auid
                   this.getCampaignData()
              
            
                
            } else {
              
              this.uid_action = response.account.owner
       
              
              this.cid = params['cid'];
                 this.uid = response.auid;
                 this.getCampaignData()
              
           
                
              }
           
            
          
          }
          })
    
    })
  }
  /*  if (window.location.pathname === '/campaigns/settings/display') {
     this.displayService.getCampaign(this.cid).valueChanges().subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
           
            }
          })
    } else if (window.location.pathname === '/campaigns/settings/native') {
      this.displayService.getCampaign(this.cid).valueChanges().subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
           
            }
          })
    } else {
      this.router.navigate(['/campaigns'])
   } */
  getCampaignData() {
   if (window.location.pathname === '/campaigns/settings/display') {
     this.displayService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
                this.campaignId=campaign.id_campagne
                //console.log(campaign)
            if (campaign.targetedLocations.length > 0) {
              if (campaign.targetedLocations.length === 1) {
                if (campaign.targetedLocations[0].id === this.SN_LOCATION.id) {
                 
                  this.zonesOptionSelected = 'default'
                  this.zoneSelectedToDisplay = this.SN_LOCATION.locationName
                  this.LOCATIONS_TO_TARGET = campaign.targetedLocations
                  this.NEW_LOCATIONS_TO_TARGET = this.LOCATIONS_TO_TARGET
                   this.maps.setMapObject(this.SN_LOCATION, this.SN_LOCATION.locationName)
                  ////console.log(this.LOCATIONS_TO_TARGET)
                } else {
                  this.zonesOptionSelected ="custom"
                  this.LOCATIONS_TO_TARGET = campaign.targetedLocations
                  this.NEW_LOCATIONS_TO_TARGET = this.LOCATIONS_TO_TARGET
                  this.zoneSelectedToDisplay = campaign.targetedLocations[0].locationName
                  this.NEW_LOCATIONS_TO_TARGET.forEach(location => {
                     this.maps.setMapObject(location, location.locationName)
                   })
                  ////console.log(this.LOCATIONS_TO_TARGET)
                }
                
              } else {
                this.zonesOptionSelected ="custom"
                  this.LOCATIONS_TO_TARGET = campaign.targetedLocations
                  this.NEW_LOCATIONS_TO_TARGET = this.LOCATIONS_TO_TARGET
                  this.zoneSelectedToDisplay = campaign.targetedLocations[0].locationName+ `et ${campaign.targetedLocations.length} autres`
                  this.NEW_LOCATIONS_TO_TARGET.forEach(location => {
                     this.maps.setMapObject(location, location.locationName)
                  })
                
              }
            }
            if (campaign.excludedLocations.length > 0) {
              this.LOCATIONS_TO_EXCLUDE = campaign.excludedLocations
              ////console.log(this.LOCATIONS_TO_EXCLUDE)
              this.NEW_LOCATIONS_TO_EXCLUDE = this.LOCATIONS_TO_EXCLUDE
              this.zonesOptionSelected = "custom"
              this.NEW_LOCATIONS_TO_EXCLUDE.forEach(location => {
                     this.maps.setMapObjectExclude(location, location.locationName)
                  })
            }
            if (campaign.targetedLocations.length === 0 && campaign.excludedLocations.length === 0) {
              this.zonesOptionSelected = "all"
              this.zoneSelectedToDisplay = "Tous les pays et territoires"
            }

            if (campaign.areaTargetedOption !== undefined) {
              if (campaign.areaTargetedOption === 'AREA_OF_INTEREST') {
                this.zonesOptionTargetSelected = "1"
                this.optionLocationTargeted = campaign.areaTargetedOption
                
              } else if (campaign.areaTargetedOption === 'LOCATION_OF_PRESENCE') {
                this.zonesOptionTargetSelected = "2"
                this.optionLocationTargeted = campaign.areaTargetedOption
              } else if (campaign.areaTargetedOption === 'DONT_CARE') {
                this.zonesOptionTargetSelected = "3"
                this.optionLocationTargeted = campaign.areaTargetedOption
              }
            }
            if (campaign.areaExcludedOption !== undefined) {
              if (this.zonesOptionExcludeSelected === 'LOCATION_OF_PRESENCE') {
                this.zonesOptionExcludeSelected = "1"
                this.optionLocationExcluded = campaign.areaExcludedOption


      } else if (this.zonesOptionExcludeSelected === 'DONT_CARE') {
        this.optionLocationTargeted = 'DONT_CARE'
                this.zonesOptionExcludeSelected = "2"
                this.optionLocationExcluded = campaign.areaExcludedOption
        
      }
            }
             setTimeout(() => {
      if (this.LOCATIONS_TO_TARGET.length > 0) {
        this.gridTargetedZones.refresh()
        
      }
      if (this.LOCATIONS_TO_EXCLUDE.length > 0) {
        this.gridExcludedZones.refresh()
        
      }
      
    }, 500);
            }
          })
    } else if (window.location.pathname === '/campaigns/settings/native') {
      this.youtubeService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
                this.campaignId=campaign.id_campagne
            if (campaign.targetedLocations.length > 0) {
           ////console.log(campaign)
              if (campaign.targetedLocations.length === 1) {
                if (campaign.targetedLocations[0].id === this.SN_LOCATION.id) {
                 
                  this.zonesOptionSelected = 'default'
                  this.zoneSelectedToDisplay = this.SN_LOCATION.locationName
                  this.LOCATIONS_TO_TARGET = campaign.targetedLocations
                  this.NEW_LOCATIONS_TO_TARGET = this.LOCATIONS_TO_TARGET
                   this.maps.setMapObject(this.SN_LOCATION, this.SN_LOCATION.locationName)
                  ////console.log(this.LOCATIONS_TO_TARGET)
                } else {
                  this.zonesOptionSelected ="custom"
                  this.LOCATIONS_TO_TARGET = campaign.targetedLocations
                  this.NEW_LOCATIONS_TO_TARGET = this.LOCATIONS_TO_TARGET
                  this.zoneSelectedToDisplay = campaign.targetedLocations[0].locationName
                  this.NEW_LOCATIONS_TO_TARGET.forEach(location => {
                     this.maps.setMapObject(location, location.locationName)
                   })
                  ////console.log(this.LOCATIONS_TO_TARGET)
                }
                
              } else {
                this.zonesOptionSelected ="custom"
                  this.LOCATIONS_TO_TARGET = campaign.targetedLocations
                  this.NEW_LOCATIONS_TO_TARGET = this.LOCATIONS_TO_TARGET
                  this.zoneSelectedToDisplay = campaign.targetedLocations[0].locationName+ `et ${campaign.targetedLocations.length} autres`
                  this.NEW_LOCATIONS_TO_TARGET.forEach(location => {
                     this.maps.setMapObject(location, location.locationName)
                  })
                
              }
            }
            if (campaign.excludedLocations.length > 0) {
              this.LOCATIONS_TO_EXCLUDE = campaign.excludedLocations
              ////console.log(this.LOCATIONS_TO_EXCLUDE)
              this.NEW_LOCATIONS_TO_EXCLUDE = this.LOCATIONS_TO_EXCLUDE
              this.zonesOptionSelected = "custom"
              this.NEW_LOCATIONS_TO_EXCLUDE.forEach(location => {
                     this.maps.setMapObjectExclude(location, location.locationName)
                  })
            }
            if (campaign.targetedLocations.length === 0 && campaign.excludedLocations.length === 0) {
              this.zonesOptionSelected = "all"
              this.zoneSelectedToDisplay = "Tous les pays et territoires"
            }

            if (campaign.areaTargetedOption !== undefined) {
              if (campaign.areaTargetedOption === 'AREA_OF_INTEREST') {
                this.zonesOptionTargetSelected = "1"
                this.optionLocationTargeted = campaign.areaTargetedOption
                
              } else if (campaign.areaTargetedOption === 'LOCATION_OF_PRESENCE') {
                this.zonesOptionTargetSelected = "2"
                this.optionLocationTargeted = campaign.areaTargetedOption
              } else if (campaign.areaTargetedOption === 'DONT_CARE') {
                this.zonesOptionTargetSelected = "3"
                this.optionLocationTargeted = campaign.areaTargetedOption
              }
            }
            if (campaign.areaExcludedOption !== undefined) {
              if (this.zonesOptionExcludeSelected === 'LOCATION_OF_PRESENCE') {
                this.zonesOptionExcludeSelected = "1"
                this.optionLocationExcluded = campaign.areaExcludedOption


      } else if (this.zonesOptionExcludeSelected === 'DONT_CARE') {
        this.optionLocationTargeted = 'DONT_CARE'
                this.zonesOptionExcludeSelected = "2"
                this.optionLocationExcluded = campaign.areaExcludedOption
        
      }
            }
             setTimeout(() => {
      if (this.LOCATIONS_TO_TARGET.length > 0) {
        if (this.gridTargetedZones!== undefined) {
          this.gridTargetedZones.refresh()
          
        }
        
      }
               if (this.LOCATIONS_TO_EXCLUDE.length > 0) {
                 if (this.gridExcludedZones !== undefined) {
          
                   this.gridExcludedZones.refresh()
        }
        
      }
      
    }, 500);
            }
          })
    }else if (window.location.pathname === '/campaigns/settings/search') {
      this.searchService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
                this.campaignId=campaign.id_campagne
            if (campaign.targetedLocations.length > 0) {
           ////console.log(campaign)
              if (campaign.targetedLocations.length === 1) {
                if (campaign.targetedLocations[0].id === this.SN_LOCATION.id) {
                 
                  this.zonesOptionSelected = 'default'
                  this.zoneSelectedToDisplay = this.SN_LOCATION.locationName
                  this.LOCATIONS_TO_TARGET = campaign.targetedLocations
                  this.NEW_LOCATIONS_TO_TARGET = this.LOCATIONS_TO_TARGET
                   this.maps.setMapObject(this.SN_LOCATION, this.SN_LOCATION.locationName)
                  ////console.log(this.LOCATIONS_TO_TARGET)
                } else {
                  this.zonesOptionSelected ="custom"
                  this.LOCATIONS_TO_TARGET = campaign.targetedLocations
                  this.NEW_LOCATIONS_TO_TARGET = this.LOCATIONS_TO_TARGET
                  this.zoneSelectedToDisplay = campaign.targetedLocations[0].locationName
                  this.NEW_LOCATIONS_TO_TARGET.forEach(location => {
                     this.maps.setMapObject(location, location.locationName)
                   })
                  ////console.log(this.LOCATIONS_TO_TARGET)
                }
                
              } else {
                this.zonesOptionSelected ="custom"
                  this.LOCATIONS_TO_TARGET = campaign.targetedLocations
                  this.NEW_LOCATIONS_TO_TARGET = this.LOCATIONS_TO_TARGET
                  this.zoneSelectedToDisplay = campaign.targetedLocations[0].locationName+ `et ${campaign.targetedLocations.length} autres`
                  this.NEW_LOCATIONS_TO_TARGET.forEach(location => {
                     this.maps.setMapObject(location, location.locationName)
                  })
                
              }
            }
            if (campaign.excludedLocations.length > 0) {
              this.LOCATIONS_TO_EXCLUDE = campaign.excludedLocations
              ////console.log(this.LOCATIONS_TO_EXCLUDE)
              this.NEW_LOCATIONS_TO_EXCLUDE = this.LOCATIONS_TO_EXCLUDE
              this.zonesOptionSelected = "custom"
              this.NEW_LOCATIONS_TO_EXCLUDE.forEach(location => {
                     this.maps.setMapObjectExclude(location, location.locationName)
                  })
            }
            if (campaign.targetedLocations.length === 0 && campaign.excludedLocations.length === 0) {
              this.zonesOptionSelected = "all"
              this.zoneSelectedToDisplay = "Tous les pays et territoires"
            }

            if (campaign.areaTargetedOption !== undefined) {
              if (campaign.areaTargetedOption === 'AREA_OF_INTEREST') {
                this.zonesOptionTargetSelected = "1"
                this.optionLocationTargeted = campaign.areaTargetedOption
                
              } else if (campaign.areaTargetedOption === 'LOCATION_OF_PRESENCE') {
                this.zonesOptionTargetSelected = "2"
                this.optionLocationTargeted = campaign.areaTargetedOption
              } else if (campaign.areaTargetedOption === 'DONT_CARE') {
                this.zonesOptionTargetSelected = "3"
                this.optionLocationTargeted = campaign.areaTargetedOption
              }
            }
            if (campaign.areaExcludedOption !== undefined) {
              if (this.zonesOptionExcludeSelected === 'LOCATION_OF_PRESENCE') {
                this.zonesOptionExcludeSelected = "1"
                this.optionLocationExcluded = campaign.areaExcludedOption


      } else if (this.zonesOptionExcludeSelected === 'DONT_CARE') {
        this.optionLocationTargeted = 'DONT_CARE'
                this.zonesOptionExcludeSelected = "2"
                this.optionLocationExcluded = campaign.areaExcludedOption
        
      }
            }
             setTimeout(() => {
      if (this.LOCATIONS_TO_TARGET.length > 0) {
        if (this.gridTargetedZones!== undefined) {
          this.gridTargetedZones.refresh()
          
        }
        
      }
               if (this.LOCATIONS_TO_EXCLUDE.length > 0) {
                 if (this.gridExcludedZones !== undefined) {
          
                   this.gridExcludedZones.refresh()
        }
        
      }
      
    }, 500);
            }
          })
    } else {
      this.router.navigate(['/campaigns'])
   }
     
  }

  public componentReady: boolean = false
  public panelOpenState: boolean = true
  public name: string = "display-1"
 zonesOptionSelected: string = "";
  zonesData: any = [{'id': 'all', 'label': 'Tous les pays et territoires'}, {'id': 'default', 'label': 'Sénégal'}, {'id': 'custom', 'label': 'Saisir une autre zone géographique'}
  ];
  
   zonesDataTargetOption: any = [{'id': '1', 'label': 'Personnes situées dans les zones que vous ciblez ou intéressées par celles-ci (recommandé)'}, {'id': '2', 'label': "Personnes situées dans vos zones ciblées ou qui s'y rendent régulièrement"}, {'id': '3', 'label': "Personnes intéressées par les zones que vous ciblez"}
  ];
   zonesDataExcludeOption: any = [{'id': '1', 'label': 'Personnes situées dans les zones que vous excluez (recommandé)'}, {'id': '2', 'label': "Personnes situées dans les zones que vous excluez ou intéressées par celles-ci"}
  ];
  
  zonesOptionTargetSelected: string = "1"
  zonesOptionExcludeSelected: string = "1"
 
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
    this.locationsTargeted.emit([this.SN_LOCATION])
    
    
   
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
      this.zoneSelectedToDisplay = "Ciblage en fonction des zones à cibler et à exclure" 
      this.maps.resetMarker()
      document.getElementById('inputZones').focus()
      } else if (this.zonesOptionSelected === 'default') {
      this.zoneSelectedToDisplay = "Sénégal" 
      let q = "Sénégal"
      this.locationsTargeted.emit([this.SN_LOCATION])
      this.maps.resetMarker()
      this.maps.setMapObject(this.SN_LOCATION, this.SN_LOCATION.locationName)
      this.displayService.getAllLocations(q).then((locations: LOCATION[]) => {
        if (locations !== null) {
          if (locations.length > 0) {
             for (let i = 0; i < locations.length; i++){
              if (locations[i].locationName === q) {
                /* this.LOCATIONS_TO_TARGET.push(locations[i]) */
                this.locationsTargeted.emit(locations)
                /* this.selectedLocations.emit({
                  "target": this.loca,
                  "exclude": []
                }) */
              }
            }
          } 
        }
      })     
    } else if (this.zonesOptionSelected === 'all') {
      this.zoneSelectedToDisplay = "Tous les pays et territoires"
      this.maps.resetMarker()
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
    document.getElementById('inputZones').focus()
    /* if (!this.popover.popoverOpen) {
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
    } */
    /* this.popoverComponent.closeDisabled */
    if (this.lastQuerySearcher !== value) {
          this.lastQuerySearcher = value
       this.showProgressSearchLocation = true
      this.displayService.getAllLocations(value).then((locations: LOCATION[]) => {
        if (locations !== null) {
          if (locations.length > 0) {
            this.mergeLocationWithoutDuplicates(locations)
            
          } else {
             this.showProgressSearchLocation = false
          }
        
        
        }
      })
    } 
  }
  selectLocations() {
    
  
}
  onZoneSelect(args: MatSelectionListChange) {
    this.selectedLocation = args.option.value
    ////console.log(this.selectedLocation)
  }

  addZonesTarget(location: LOCATION) {
    this.selectedLocation = location
    this.checkIfZoneIsAllReadyTarget(this.selectedLocation.id)
      .then(isTarget => {
        ////console.log(isTarget)
        if (isTarget) {
          ////console.log('already target')
        } else {
          this.checkIfZoneIsAllReadyExclude(this.selectedLocation.id)
            .then(isExclude => {
              if (isExclude) {
                ////console.log('is exclude do you want to target')
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
                this.maps.setMapObject(location, this.selectedLocation.locationName)
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
          ////console.log('already exclude')
          
        } else {
          this.checkIfZoneIsAllReadyTarget(this.selectedLocation.id)
            .then(isTarget => {
              if (isTarget) {
                ////console.log('is already target do yout want to exclude')
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
    if (window.location.pathname === '/campaigns/settings/display') {
      if (this.campaignId === 0) {
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
      
    } else {
      this.displayService.removeTargetedLocation([location], this.cid, this.campaignId).then(remove => {
        if (remove === "ok") {
          this.successOperationTargetedRemove()
          this.maps.removeMarker(location)
          this.gridTargetedZones.hideSpinner()
        
        } else {
          this.gridTargetedZones.hideSpinner()
        }
      })
    }
    } else if (window.location.pathname === '/campaigns/settings/native') {
       if (this.campaignId === 0) {
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
      
    } else {
      this.youtubeService.removeTargetedLocation([location], this.cid, this.campaignId).then(remove => {
        if (remove === "ok") {
          this.successOperationTargetedRemove()
          this.maps.removeMarker(location)
          this.gridTargetedZones.hideSpinner()
        
        } else {
          this.gridTargetedZones.hideSpinner()
        }
      })
    }
    }else if (window.location.pathname === '/campaigns/settings/search') {
      if (this.campaignId === 0) {
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
     
   } else {
     this.searchService.removeTargetedLocation([location], this.cid, this.campaignId).then(remove => {
       if (remove === "ok") {
         this.successOperationTargetedRemove()
         this.maps.removeMarker(location)
         this.gridTargetedZones.hideSpinner()
       
       } else {
         this.gridTargetedZones.hideSpinner()
       }
     })
   }
   } else {
      this.router.navigate(['/campaigns'])
   }
   
  }
/*   removeLocationEditTargetedFromGrid(location: LOCATION) {
    this.gridTargetedZones.showSpinner()
    this.removeLocationToListOfTargetedEdit(location)
        .then(isRemoved => {
          if (isRemoved) {
            this.gridEditTargetedZones.refresh()
            this.maps.removeMarker(location)
            this.gridEditTargetedZones.hideSpinner()
          } else {
            this.gridEditTargetedZones.hideSpinner()
        }
      })
  } */
  removeLocationExcludedFromGrid(location: LOCATION) {
    this.gridExcludedZones.showSpinner()
    if (window.location.pathname === '/campaigns/settings/display') {
      if (this.campaignId === 0) {
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
      
    } else {
       this.displayService.removeExcludedLocation([location], this.cid, this.campaignId).then(remove => {
        if (remove === "ok") {
          this.successOperationTargetedRemove()
          this.maps.removeMarkerExclude(location)
          this.gridTargetedZones.hideSpinner()
          
        
        } else {
          this.gridTargetedZones.hideSpinner()
        }
      })
    }
    } else if (window.location.pathname === '/campaigns/settings/native') {
       if (this.campaignId === 0) {
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
      
    } else {
       this.youtubeService.removeExcludedLocation([location], this.cid, this.campaignId).then(remove => {
        if (remove === "ok") {
          this.successOperationTargetedRemove()
          this.maps.removeMarkerExclude(location)
          this.gridTargetedZones.hideSpinner()
          
        
        } else {
          this.gridTargetedZones.hideSpinner()
        }
      })
    }
    }else if (window.location.pathname === '/campaigns/settings/search') {
      if (this.campaignId === 0) {
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
     
   } else {
      this.searchService.removeExcludedLocation([location], this.cid, this.campaignId).then(remove => {
       if (remove === "ok") {
         this.successOperationTargetedRemove()
         this.maps.removeMarkerExclude(location)
         this.gridTargetedZones.hideSpinner()
         
       
       } else {
         this.gridTargetedZones.hideSpinner()
       }
     })
   }
   } else {
      this.router.navigate(['/campaigns'])
   }
   
  }

   /* removeLocationEditExcludedFromGrid(location: LOCATION) {
    this.gridExcludedZones.showSpinner()
    this.removeLocationToListOfExcludeEdit(location)
        .then(isRemoved => {
          if (isRemoved) {
            this.maps.removeMarkerExclude(location)
            this.gridExcludedZones.refresh()
            this.gridExcludedZones.hideSpinner()
          } else {
            this.gridExcludedZones.hideSpinner()
        }
      })
  } */
  removeLocationToListOfTargeted(location: LOCATION):Promise<boolean> {
    return new Promise(resolve => {

      var promise = resolve(true)
      for(let i = 0; i < this.LOCATIONS_TO_TARGET.length; i++) {
        if (this.LOCATIONS_TO_TARGET[i].id === location.id) {
            ////console.log('find')
          this.LOCATIONS_TO_TARGET.splice(this.LOCATIONS_TO_TARGET.indexOf(this.LOCATIONS_TO_TARGET[i]), 1)
          this.NEW_LOCATIONS_TO_TARGET = this.LOCATIONS_TO_TARGET
    
            
            promise
              
          }
      }
     
    })
  }
  removeLocationToListOfTargetedEdit(location: LOCATION):Promise<boolean> {
    return new Promise(resolve => {

      var promise = resolve(true)
      for(let i = 0; i < this.NEW_EDIT_LOCATIONS_TO_TARGET.length; i++) {
        if (this.NEW_EDIT_LOCATIONS_TO_TARGET[i].id === location.id) {
            ////console.log('find')
          this.NEW_EDIT_LOCATIONS_TO_TARGET.splice(this.NEW_EDIT_LOCATIONS_TO_TARGET.indexOf(this.NEW_EDIT_LOCATIONS_TO_TARGET[i]), 1)
      
            
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
             ////console.log('find')
            this.LOCATIONS_TO_EXCLUDE.splice(this.LOCATIONS_TO_EXCLUDE.indexOf(this.LOCATIONS_TO_EXCLUDE[i]), 1)
            this.NEW_LOCATIONS_TO_EXCLUDE = this.LOCATIONS_TO_EXCLUDE
            promise
              
          }
      }
    })
   }
  
  removeLocationToListOfExcludeEdit(location: LOCATION):Promise<boolean> {
    return new Promise(resolve => {
       var promise = resolve(true)
      for(var i = 0; i < this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.length; i++) {
        if (this.NEW_EDIT_LOCATIONS_TO_EXCLUDE[i].id === location.id) {
             ////console.log('find')
            this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.splice(this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.indexOf(this.NEW_EDIT_LOCATIONS_TO_EXCLUDE[i]), 1)
            promise
              
          }
      }
    })
   }
  
  addToListOfTarget(location: LOCATION): Promise<boolean> {
    return new Promise(resolve => {
      this.LOCATIONS_TO_TARGET.push(location)
      this.NEW_LOCATIONS_TO_TARGET = this.LOCATIONS_TO_TARGET
      this.locationsTargeted.emit(this.LOCATIONS_TO_TARGET)
      resolve(true)
      
    })
  }

   addToListOfExclude(location: LOCATION): Promise<boolean> {
    return new Promise(resolve => {
      this.LOCATIONS_TO_EXCLUDE.push(location)
      this.NEW_LOCATIONS_TO_EXCLUDE = this.LOCATIONS_TO_EXCLUDE
      this.locationsExcluded.emit(this.LOCATIONS_TO_EXCLUDE)
      resolve(true)
      
    })
   }
  
  successOperationTargetedRemove() {
    this.appSnackBar.openSnackBar(5, 'Ciblage de zones mis à jour avec succès !', '', 'snack-success')
    this.getCampaignData()
    

  }
  
  successOperationTarget() {
    this.appSnackBar.openSnackBar(5, 'Zone ajoutée avec succès !', '', 'snack-success')
    setTimeout(() => {
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
    if (this.campaignId === 0) {
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
      
    } else {
      
      if (window.location.pathname === '/campaigns/settings/display') {
      this.displayService.removeTargetedLocation([this.selectedLocation], this.cid, this.campaignId).then(excluded_remove => {
            if (excluded_remove === "ok") {
              this.displayService.excludeNewLocation([this.selectedLocation], this.cid, this.campaignId).then(targeted=> {
                    if (targeted === 'ok') {
                       this.showProgressExcludeTargeted = false
                  this.dialogExcludeTargeted.hide()
                      this.successOperationExclude()
                      this.maps.removeMarker(this.selectedLocation)
                      this.maps.setMapObjectExclude(this.selectedLocation, this.selectedLocation.locationName)
                      this.getCampaignData()
                     
                    } else {
                      console.error('erreur')
                  this.showProgressExcludeTargeted = false
                    }
          })
            } else {
              console.error('erreur')
                  this.showProgressExcludeTargeted = false
              }
          })
    } else if (window.location.pathname === '/campaigns/settings/native') {
       this.youtubeService.removeTargetedLocation([this.selectedLocation], this.cid, this.campaignId).then(excluded_remove => {
            if (excluded_remove === "ok") {
              this.displayService.excludeNewLocation([this.selectedLocation], this.cid, this.campaignId).then(targeted=> {
                    if (targeted === 'ok') {
                       this.showProgressExcludeTargeted = false
                  this.dialogExcludeTargeted.hide()
                      this.successOperationExclude()
                      this.maps.removeMarker(this.selectedLocation)
                      this.maps.setMapObjectExclude(this.selectedLocation, this.selectedLocation.locationName)
                      this.getCampaignData()
                     
                    } else {
                      console.error('erreur')
                  this.showProgressExcludeTargeted = false
                    }
          })
            } else {
              console.error('erreur')
                  this.showProgressExcludeTargeted = false
              }
          })
    }else if (window.location.pathname === '/campaigns/settings/search') {
      this.searchService.removeTargetedLocation([this.selectedLocation], this.cid, this.campaignId).then(excluded_remove => {
           if (excluded_remove === "ok") {
             this.displayService.excludeNewLocation([this.selectedLocation], this.cid, this.campaignId).then(targeted=> {
                   if (targeted === 'ok') {
                      this.showProgressExcludeTargeted = false
                 this.dialogExcludeTargeted.hide()
                     this.successOperationExclude()
                     this.maps.removeMarker(this.selectedLocation)
                     this.maps.setMapObjectExclude(this.selectedLocation, this.selectedLocation.locationName)
                     this.getCampaignData()
                    
                   } else {
                     console.error('erreur')
                 this.showProgressExcludeTargeted = false
                   }
         })
           } else {
             console.error('erreur')
                 this.showProgressExcludeTargeted = false
             }
         })
   } else {
      this.router.navigate(['/campaigns'])
   }
          
         
    }
  }

  targetLocationButtonAction() {
    this.showProgressTargetExcluded = true
    if (this.campaignId === 0) {
      this.removeLocationToListOfExclude(this.selectedLocation)
        .then(isRemoved => {
          if (isRemoved) {
            this.addToListOfTarget(this.selectedLocation)
              .then(isAdded => {
                if (isAdded) {
                  this.showProgressTargetExcluded = false
                  this.dialogTargetExcluded.hide()
                  this.successOperationTarget()
                  this.maps.removeMarkerExclude(this.selectedLocation)
                  this.maps.setMapObject(this.selectedLocation, this.selectedLocation.locationName)
                  
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
      
    } else {

      if (window.location.pathname === '/campaigns/settings/display') {
    this.displayService.removeExcludedLocation([this.selectedLocation], this.cid, this.campaignId).then(excluded_remove => {
            if (excluded_remove === "ok") {
              this.displayService.targetNewLocation([this.selectedLocation], this.cid, this.campaignId).then(targeted=> {
                    if (targeted === 'ok') {
                       this.showProgressTargetExcluded = false
                  this.dialogTargetExcluded.hide()
                      this.successOperationTarget()
                      this.maps.removeMarkerExclude(this.selectedLocation)
                       this.maps.setMapObject(this.selectedLocation, this.selectedLocation.locationName)
                      this.getCampaignData()
                     
                    } else {
                      console.error('erreur')
                  this.showProgressTargetExcluded = false
                    }
          })
            } else {
              console.error('erreur')
                  this.showProgressTargetExcluded = false
              }
          })
    } else if (window.location.pathname === '/campaigns/settings/native') {
      this.youtubeService.removeExcludedLocation([this.selectedLocation], this.cid, this.campaignId).then(excluded_remove => {
            if (excluded_remove === "ok") {
              this.displayService.targetNewLocation([this.selectedLocation], this.cid, this.campaignId).then(targeted=> {
                    if (targeted === 'ok') {
                       this.showProgressTargetExcluded = false
                  this.dialogTargetExcluded.hide()
                      this.successOperationTarget()
                      this.maps.removeMarkerExclude(this.selectedLocation)
                       this.maps.setMapObject(this.selectedLocation, this.selectedLocation.locationName)
                      this.getCampaignData()
                     
                    } else {
                      console.error('erreur')
                  this.showProgressTargetExcluded = false
                    }
          })
            } else {
              console.error('erreur')
                  this.showProgressTargetExcluded = false
              }
          })
    }else if (window.location.pathname === '/campaigns/settings/search') {
      this.searchService.removeExcludedLocation([this.selectedLocation], this.cid, this.campaignId).then(excluded_remove => {
            if (excluded_remove === "ok") {
              this.searchService.targetNewLocation([this.selectedLocation], this.cid, this.campaignId).then(targeted=> {
                    if (targeted === 'ok') {
                       this.showProgressTargetExcluded = false
                  this.dialogTargetExcluded.hide()
                      this.successOperationTarget()
                      this.maps.removeMarkerExclude(this.selectedLocation)
                       this.maps.setMapObject(this.selectedLocation, this.selectedLocation.locationName)
                      this.getCampaignData()
                     
                    } else {
                      console.error('erreur')
                  this.showProgressTargetExcluded = false
                    }
          })
            } else {
              console.error('erreur')
                  this.showProgressTargetExcluded = false
              }
          })
    } else {
      this.router.navigate(['/campaigns'])
   }
       
    }
  }

  public spinnerUpdate: boolean = false
  public landingPageNotChange: boolean = true
  updateZones() {

    if (window.location.pathname === '/campaigns/settings/display') {
    this.getOptionsTarget().then(option_target => {
      if (option_target === "ok") {
         this.getOptionsExclude().then(option_exclude => {
      if (option_exclude === "ok") {
         if (this.campaignId === 0) {
      if (this.zonesOptionSelected === "default") {
        this.spinnerUpdate = true
        this.displayService.updateCampaign(this.cid, { targetedLocations: [this.SN_LOCATION] }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
      } else if (this.zonesOptionSelected === "all") {
        this.spinnerUpdate = true
        this.displayService.updateCampaign(this.cid, { targetedLocations: [], excludedLocations: [], areaTargetedOption: 'DONT_CARE', areaExcludedOption: 'DONT_CARE' }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
      } else if (this.zonesOptionSelected === "custom") {
        this.spinnerUpdate = true
         this.displayService.updateCampaign(this.cid, { targetedLocations: this.NEW_LOCATIONS_TO_TARGET,excludedLocations: this.NEW_LOCATIONS_TO_EXCLUDE, areaTargetedOption: this.optionLocationTargeted, areaExcludedOption: this.optionLocationExcluded }).then(update => {
            if (update === "ok") {
              this.spinnerUpdate = false
              this.togglePanel(event)
              this.getCampaignData()
            } else {
              this.spinnerUpdate = false
            }
          })
  
      }
      
    } else {
      if (this.zonesOptionSelected === "default") {
        this.spinnerUpdate = true
        this.targetDefault().then(targeted => {
          if (targeted === "ok") {
            this.spinnerUpdate = false
            this.successOperationTargetedRemove()
            this.LOCATIONS_TO_TARGET = [this.SN_LOCATION]
            this.LOCATIONS_TO_EXCLUDE = []
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
      } else if (this.zonesOptionSelected === "all") {
        this.targetAll().then(targeted => {
         this.spinnerUpdate = true
         if (targeted === "ok") {
            this.spinnerUpdate = false
           this.successOperationTargetedRemove()
           this.LOCATIONS_TO_TARGET = []
           this.LOCATIONS_TO_EXCLUDE = []
           this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
      } else if (this.zonesOptionSelected === "custom") {
        this.spinnerUpdate = true
        this.targetCustom().then(targeted => {
          if (targeted === "ok") {
            this.spinnerUpdate = false
            this.successOperationTargetedRemove()
            this.NEW_EDIT_LOCATIONS_TO_TARGET = []
            this.NEW_EDIT_LOCATIONS_TO_EXCLUDE = []
          } else {
            this.spinnerUpdate = false
          }
        })
         
  
      }
    }
 
      }
    })
      }
    })
    } else if (window.location.pathname === '/campaigns/settings/native') {
     this.getOptionsTarget().then(option_target => {
      if (option_target === "ok") {
         this.getOptionsExclude().then(option_exclude => {
      if (option_exclude === "ok") {
         if (this.campaignId === 0) {
      if (this.zonesOptionSelected === "default") {
        this.spinnerUpdate = true
        this.youtubeService.updateCampaign(this.cid, { targetedLocations: [this.SN_LOCATION] }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
      } else if (this.zonesOptionSelected === "all") {
        this.spinnerUpdate = true
        this.youtubeService.updateCampaign(this.cid, { targetedLocations: [], excludedLocations: [], areaTargetedOption: 'DONT_CARE', areaExcludedOption: 'DONT_CARE' }).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
      } else if (this.zonesOptionSelected === "custom") {
        this.spinnerUpdate = true
         this.youtubeService.updateCampaign(this.cid, { targetedLocations: this.NEW_LOCATIONS_TO_TARGET,excludedLocations: this.NEW_LOCATIONS_TO_EXCLUDE, areaTargetedOption: this.optionLocationTargeted, areaExcludedOption: this.optionLocationExcluded }).then(update => {
            if (update === "ok") {
              this.spinnerUpdate = false
              this.togglePanel(event)
              this.getCampaignData()
            } else {
              this.spinnerUpdate = false
            }
          })
  
      }
      
    } else {
      if (this.zonesOptionSelected === "default") {
        this.spinnerUpdate = true
        this.targetDefault().then(targeted => {
          if (targeted === "ok") {
            this.spinnerUpdate = false
            this.successOperationTargetedRemove()
            this.LOCATIONS_TO_TARGET = [this.SN_LOCATION]
            this.LOCATIONS_TO_EXCLUDE = []
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
      } else if (this.zonesOptionSelected === "all") {
        this.targetAll().then(targeted => {
         this.spinnerUpdate = true
         if (targeted === "ok") {
            this.spinnerUpdate = false
           this.successOperationTargetedRemove()
           this.LOCATIONS_TO_TARGET = []
           this.LOCATIONS_TO_EXCLUDE = []
           this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
      } else if (this.zonesOptionSelected === "custom") {
        this.spinnerUpdate = true
        this.targetCustom().then(targeted => {
          if (targeted === "ok") {
            this.spinnerUpdate = false
            this.successOperationTargetedRemove()
            this.NEW_EDIT_LOCATIONS_TO_TARGET = []
            this.NEW_EDIT_LOCATIONS_TO_EXCLUDE = []
          } else {
            this.spinnerUpdate = false
          }
        })
         
  
      }
    }
 
      }
    })
      }
    })
    }else if (window.location.pathname === '/campaigns/settings/search') {
      this.getOptionsTarget().then(option_target => {
       if (option_target === "ok") {
          this.getOptionsExclude().then(option_exclude => {
       if (option_exclude === "ok") {
          if (this.campaignId === 0) {
       if (this.zonesOptionSelected === "default") {
         this.spinnerUpdate = true
         this.searchService.updateCampaign(this.cid, { targetedLocations: [this.SN_LOCATION] }).then(update => {
           if (update === "ok") {
             this.spinnerUpdate = false
             this.togglePanel(event)
             this.getCampaignData()
           } else {
             this.spinnerUpdate = false
           }
         })
       } else if (this.zonesOptionSelected === "all") {
         this.spinnerUpdate = true
         this.searchService.updateCampaign(this.cid, { targetedLocations: [], excludedLocations: [], areaTargetedOption: 'DONT_CARE', areaExcludedOption: 'DONT_CARE' }).then(update => {
           if (update === "ok") {
             this.spinnerUpdate = false
             this.togglePanel(event)
             this.getCampaignData()
           } else {
             this.spinnerUpdate = false
           }
         })
       } else if (this.zonesOptionSelected === "custom") {
         this.spinnerUpdate = true
          this.searchService.updateCampaign(this.cid, { targetedLocations: this.NEW_LOCATIONS_TO_TARGET,excludedLocations: this.NEW_LOCATIONS_TO_EXCLUDE, areaTargetedOption: this.optionLocationTargeted, areaExcludedOption: this.optionLocationExcluded }).then(update => {
             if (update === "ok") {
               this.spinnerUpdate = false
               this.togglePanel(event)
               this.getCampaignData()
             } else {
               this.spinnerUpdate = false
             }
           })
   
       }
       
     } else {
       if (this.zonesOptionSelected === "default") {
         this.spinnerUpdate = true
         this.targetDefault().then(targeted => {
           if (targeted === "ok") {
             this.spinnerUpdate = false
             this.successOperationTargetedRemove()
             this.LOCATIONS_TO_TARGET = [this.SN_LOCATION]
             this.LOCATIONS_TO_EXCLUDE = []
             this.getCampaignData()
           } else {
             this.spinnerUpdate = false
           }
         })
       } else if (this.zonesOptionSelected === "all") {
         this.targetAll().then(targeted => {
          this.spinnerUpdate = true
          if (targeted === "ok") {
             this.spinnerUpdate = false
            this.successOperationTargetedRemove()
            this.LOCATIONS_TO_TARGET = []
            this.LOCATIONS_TO_EXCLUDE = []
            this.getCampaignData()
           } else {
             this.spinnerUpdate = false
           }
         })
       } else if (this.zonesOptionSelected === "custom") {
         this.spinnerUpdate = true
         this.targetCustom().then(targeted => {
           if (targeted === "ok") {
             this.spinnerUpdate = false
             this.successOperationTargetedRemove()
             this.NEW_EDIT_LOCATIONS_TO_TARGET = []
             this.NEW_EDIT_LOCATIONS_TO_EXCLUDE = []
           } else {
             this.spinnerUpdate = false
           }
         })
          
   
       }
     }
  
       }
     })
       }
     })
     } else {
      this.router.navigate(['/campaigns'])
   }
    
   
   
  }

  targetDefault(): Promise<string>{
    return new Promise(resolve => {
      if (window.location.pathname === '/campaigns/settings/display') {
      if (this.LOCATIONS_TO_TARGET.length > 0 && this.LOCATIONS_TO_EXCLUDE.length > 0) {
        this.displayService.removeTargetedLocation(this.LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted_remove => {
          if (targeted_remove === "ok") {
              this.displayService.removeExcludedLocation(this.LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded_remove => {
                if (excluded_remove === "ok") {
                  this.displayService.targetNewLocation([this.SN_LOCATION], this.cid, this.campaignId).then(targeted=> {
                    if (targeted === 'ok') {
                      
                      resolve('ok')
                    } else {
                      resolve('error')
                    }
          })
                } else {
                  resolve('error')
                }
              })
          } else {
            resolve('error')
            }
          })
        } else if (this.LOCATIONS_TO_TARGET.length > 0 && this.LOCATIONS_TO_EXCLUDE.length === 0) {
          this.displayService.removeTargetedLocation(this.LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted_remove => {
            if (targeted_remove === "ok") {
                     this.displayService.targetNewLocation([this.SN_LOCATION], this.cid, this.campaignId).then(targeted=> {
                    if (targeted === 'ok') {
                      
                      resolve('ok')
                    } else {
                      resolve('error')
                    }
          })
            } else {
              resolve('error')
            }
          })
        } else if (this.LOCATIONS_TO_TARGET.length === 0 && this.LOCATIONS_TO_EXCLUDE.length > 0) {
          this.displayService.removeExcludedLocation(this.LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded_remove => {
            if (excluded_remove === "ok") {
              this.displayService.targetNewLocation([this.SN_LOCATION], this.cid, this.campaignId).then(targeted=> {
                    if (targeted === 'ok') {
                      
                      resolve('ok')
                    } else {
                      resolve('error')
                    }
          })
            } else {
              resolve('error')
              }
          })
      } else if (this.LOCATIONS_TO_TARGET.length === 0 && this.LOCATIONS_TO_EXCLUDE.length === 0) {
        this.displayService.targetNewLocation([this.SN_LOCATION], this.cid, this.campaignId).then(targeted=> {
                    if (targeted === 'ok') {
                      
                      resolve('ok')
                    } else {
                      resolve('error')
                    }
          })
        }
    } else if (window.location.pathname === '/campaigns/settings/native') {
       if (this.LOCATIONS_TO_TARGET.length > 0 && this.LOCATIONS_TO_EXCLUDE.length > 0) {
        this.youtubeService.removeTargetedLocation(this.LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted_remove => {
          if (targeted_remove === "ok") {
              this.youtubeService.removeExcludedLocation(this.LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded_remove => {
                if (excluded_remove === "ok") {
                  this.youtubeService.targetNewLocation([this.SN_LOCATION], this.cid, this.campaignId).then(targeted=> {
                    if (targeted === 'ok') {
                      
                      resolve('ok')
                    } else {
                      resolve('error')
                    }
          })
                } else {
                  resolve('error')
                }
              })
          } else {
            resolve('error')
            }
          })
        } else if (this.LOCATIONS_TO_TARGET.length > 0 && this.LOCATIONS_TO_EXCLUDE.length === 0) {
          this.youtubeService.removeTargetedLocation(this.LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted_remove => {
            if (targeted_remove === "ok") {
                     this.youtubeService.targetNewLocation([this.SN_LOCATION], this.cid, this.campaignId).then(targeted=> {
                    if (targeted === 'ok') {
                      
                      resolve('ok')
                    } else {
                      resolve('error')
                    }
          })
            } else {
              resolve('error')
            }
          })
        } else if (this.LOCATIONS_TO_TARGET.length === 0 && this.LOCATIONS_TO_EXCLUDE.length > 0) {
          this.youtubeService.removeExcludedLocation(this.LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded_remove => {
            if (excluded_remove === "ok") {
              this.youtubeService.targetNewLocation([this.SN_LOCATION], this.cid, this.campaignId).then(targeted=> {
                    if (targeted === 'ok') {
                      
                      resolve('ok')
                    } else {
                      resolve('error')
                    }
          })
            } else {
              resolve('error')
              }
          })
      } else if (this.LOCATIONS_TO_TARGET.length === 0 && this.LOCATIONS_TO_EXCLUDE.length === 0) {
        this.youtubeService.targetNewLocation([this.SN_LOCATION], this.cid, this.campaignId).then(targeted=> {
                    if (targeted === 'ok') {
                      
                      resolve('ok')
                    } else {
                      resolve('error')
                    }
          })
        }
    }else if (window.location.pathname === '/campaigns/settings/search') {
      if (this.LOCATIONS_TO_TARGET.length > 0 && this.LOCATIONS_TO_EXCLUDE.length > 0) {
       this.searchService.removeTargetedLocation(this.LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted_remove => {
         if (targeted_remove === "ok") {
             this.searchService.removeExcludedLocation(this.LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded_remove => {
               if (excluded_remove === "ok") {
                 this.searchService.targetNewLocation([this.SN_LOCATION], this.cid, this.campaignId).then(targeted=> {
                   if (targeted === 'ok') {
                     
                     resolve('ok')
                   } else {
                     resolve('error')
                   }
         })
               } else {
                 resolve('error')
               }
             })
         } else {
           resolve('error')
           }
         })
       } else if (this.LOCATIONS_TO_TARGET.length > 0 && this.LOCATIONS_TO_EXCLUDE.length === 0) {
         this.searchService.removeTargetedLocation(this.LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted_remove => {
           if (targeted_remove === "ok") {
                    this.searchService.targetNewLocation([this.SN_LOCATION], this.cid, this.campaignId).then(targeted=> {
                   if (targeted === 'ok') {
                     
                     resolve('ok')
                   } else {
                     resolve('error')
                   }
         })
           } else {
             resolve('error')
           }
         })
       } else if (this.LOCATIONS_TO_TARGET.length === 0 && this.LOCATIONS_TO_EXCLUDE.length > 0) {
         this.searchService.removeExcludedLocation(this.LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded_remove => {
           if (excluded_remove === "ok") {
             this.searchService.targetNewLocation([this.SN_LOCATION], this.cid, this.campaignId).then(targeted=> {
                   if (targeted === 'ok') {
                     
                     resolve('ok')
                   } else {
                     resolve('error')
                   }
         })
           } else {
             resolve('error')
             }
         })
     } else if (this.LOCATIONS_TO_TARGET.length === 0 && this.LOCATIONS_TO_EXCLUDE.length === 0) {
       this.searchService.targetNewLocation([this.SN_LOCATION], this.cid, this.campaignId).then(targeted=> {
                   if (targeted === 'ok') {
                     
                     resolve('ok')
                   } else {
                     resolve('error')
                   }
         })
       }
   } else {
      this.router.navigate(['/campaigns'])
   }
     
    })
  }

    targetAll(): Promise<string>{
      return new Promise(resolve => {
      if (window.location.pathname === '/campaigns/settings/display') {
     if (this.LOCATIONS_TO_TARGET.length > 0 && this.LOCATIONS_TO_EXCLUDE.length > 0) {
        this.displayService.removeTargetedLocation(this.LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted_remove => {
          if (targeted_remove === "ok") {
              this.displayService.removeExcludedLocation(this.LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded_remove => {
                if (excluded_remove === "ok") {
                  resolve('ok')
                } else {
                  resolve('error')
                }
              })
          } else {
            resolve('error')
            }
          })
        } else if (this.LOCATIONS_TO_TARGET.length > 0 && this.LOCATIONS_TO_EXCLUDE.length === 0) {
          this.displayService.removeTargetedLocation(this.LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted_remove => {
            if (targeted_remove === "ok") {
              resolve('ok')
            } else {
              resolve('error')
            }
          })
        } else if (this.LOCATIONS_TO_TARGET.length === 0 && this.LOCATIONS_TO_EXCLUDE.length > 0) {
          this.displayService.removeExcludedLocation(this.LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded_remove => {
            if (excluded_remove === "ok") {
              resolve('ok')
            } else {
              resolve('error')
              }
          })
      } else if (this.LOCATIONS_TO_TARGET.length === 0 && this.LOCATIONS_TO_EXCLUDE.length === 0) {
        resolve('ok')
        }
    } else if (window.location.pathname === '/campaigns/settings/native') {
       if (this.LOCATIONS_TO_TARGET.length > 0 && this.LOCATIONS_TO_EXCLUDE.length > 0) {
        this.youtubeService.removeTargetedLocation(this.LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted_remove => {
          if (targeted_remove === "ok") {
              this.youtubeService.removeExcludedLocation(this.LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded_remove => {
                if (excluded_remove === "ok") {
                  resolve('ok')
                } else {
                  resolve('error')
                }
              })
          } else {
            resolve('error')
            }
          })
        } else if (this.LOCATIONS_TO_TARGET.length > 0 && this.LOCATIONS_TO_EXCLUDE.length === 0) {
          this.youtubeService.removeTargetedLocation(this.LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted_remove => {
            if (targeted_remove === "ok") {
              resolve('ok')
            } else {
              resolve('error')
            }
          })
        } else if (this.LOCATIONS_TO_TARGET.length === 0 && this.LOCATIONS_TO_EXCLUDE.length > 0) {
          this.youtubeService.removeExcludedLocation(this.LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded_remove => {
            if (excluded_remove === "ok") {
              resolve('ok')
            } else {
              resolve('error')
              }
          })
      } else if (this.LOCATIONS_TO_TARGET.length === 0 && this.LOCATIONS_TO_EXCLUDE.length === 0) {
        resolve('ok')
        }
    } else if (window.location.pathname === '/campaigns/settings/search') {
      if (this.LOCATIONS_TO_TARGET.length > 0 && this.LOCATIONS_TO_EXCLUDE.length > 0) {
       this.searchService.removeTargetedLocation(this.LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted_remove => {
         if (targeted_remove === "ok") {
             this.searchService.removeExcludedLocation(this.LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded_remove => {
               if (excluded_remove === "ok") {
                 resolve('ok')
               } else {
                 resolve('error')
               }
             })
         } else {
           resolve('error')
           }
         })
       } else if (this.LOCATIONS_TO_TARGET.length > 0 && this.LOCATIONS_TO_EXCLUDE.length === 0) {
         this.searchService.removeTargetedLocation(this.LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted_remove => {
           if (targeted_remove === "ok") {
             resolve('ok')
           } else {
             resolve('error')
           }
         })
       } else if (this.LOCATIONS_TO_TARGET.length === 0 && this.LOCATIONS_TO_EXCLUDE.length > 0) {
         this.searchService.removeExcludedLocation(this.LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded_remove => {
           if (excluded_remove === "ok") {
             resolve('ok')
           } else {
             resolve('error')
             }
         })
     } else if (this.LOCATIONS_TO_TARGET.length === 0 && this.LOCATIONS_TO_EXCLUDE.length === 0) {
       resolve('ok')
       }
   } else {
      this.router.navigate(['/campaigns'])
   }
     
    })
    }
  
  targetCustom(): Promise<string>{

    return new Promise(resolve => {
          if (window.location.pathname === '/campaigns/settings/display') {
       if (this.NEW_EDIT_LOCATIONS_TO_TARGET.length > 0 && this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.length > 0) {
        this.displayService.targetNewLocation(this.NEW_EDIT_LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted => {
          if (targeted === "ok") {
              this.displayService.excludeNewLocation(this.NEW_EDIT_LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded => {
          if (excluded === "ok") {
              resolve('ok')
          } else {
            resolve('error')
            }
              }).catch((e) => {
            resolve('error')
          })
          } else {
            resolve('error')
            }
        }).catch((e) => {
            resolve('error')
          })
      } else if (this.NEW_EDIT_LOCATIONS_TO_TARGET.length > 0 && this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.length===0) {
        this.displayService.targetNewLocation(this.NEW_EDIT_LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted => {
          if (targeted === "ok") {
              resolve('ok')
          } else {
            resolve('error')
            }
        }).catch((e) => {
            resolve('error')
          })
      } else if (this.NEW_EDIT_LOCATIONS_TO_TARGET.length === 0 && this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.length > 0) {
        this.displayService.excludeNewLocation(this.NEW_EDIT_LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded => {
          if (excluded === "ok") {
              resolve('ok')
          } else {
            resolve('error')
            }
        }).catch((e) => {
            resolve('error')
          })
      } else if (this.NEW_EDIT_LOCATIONS_TO_TARGET.length === 0 && this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.length === 0) {
        resolve('ok')
        }
    } else if (window.location.pathname === '/campaigns/settings/native') {
         if (this.NEW_EDIT_LOCATIONS_TO_TARGET.length > 0 && this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.length > 0) {
        this.youtubeService.targetNewLocation(this.NEW_EDIT_LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted => {
          if (targeted === "ok") {
              this.youtubeService.excludeNewLocation(this.NEW_EDIT_LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded => {
          if (excluded === "ok") {
              resolve('ok')
          } else {
            resolve('error')
            }
              }).catch((e) => {
            resolve('error')
          })
          } else {
            resolve('error')
            }
        }).catch((e) => {
            resolve('error')
          })
      } else if (this.NEW_EDIT_LOCATIONS_TO_TARGET.length > 0 && this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.length===0) {
        this.youtubeService.targetNewLocation(this.NEW_EDIT_LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted => {
          if (targeted === "ok") {
              resolve('ok')
          } else {
            resolve('error')
            }
        }).catch((e) => {
            resolve('error')
          })
      } else if (this.NEW_EDIT_LOCATIONS_TO_TARGET.length === 0 && this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.length > 0) {
        this.youtubeService.excludeNewLocation(this.NEW_EDIT_LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded => {
          if (excluded === "ok") {
              resolve('ok')
          } else {
            resolve('error')
            }
        }).catch((e) => {
            resolve('error')
          })
      } else if (this.NEW_EDIT_LOCATIONS_TO_TARGET.length === 0 && this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.length === 0) {
        resolve('ok')
        }
    }else if (window.location.pathname === '/campaigns/settings/search') {
      if (this.NEW_EDIT_LOCATIONS_TO_TARGET.length > 0 && this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.length > 0) {
     this.searchService.targetNewLocation(this.NEW_EDIT_LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted => {
       if (targeted === "ok") {
           this.searchService.excludeNewLocation(this.NEW_EDIT_LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded => {
       if (excluded === "ok") {
           resolve('ok')
       } else {
         resolve('error')
         }
           }).catch((e) => {
         resolve('error')
       })
       } else {
         resolve('error')
         }
     }).catch((e) => {
         resolve('error')
       })
   } else if (this.NEW_EDIT_LOCATIONS_TO_TARGET.length > 0 && this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.length===0) {
     this.searchService.targetNewLocation(this.NEW_EDIT_LOCATIONS_TO_TARGET, this.cid, this.campaignId).then(targeted => {
       if (targeted === "ok") {
           resolve('ok')
       } else {
         resolve('error')
         }
     }).catch((e) => {
         resolve('error')
       })
   } else if (this.NEW_EDIT_LOCATIONS_TO_TARGET.length === 0 && this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.length > 0) {
     this.searchService.excludeNewLocation(this.NEW_EDIT_LOCATIONS_TO_EXCLUDE, this.cid, this.campaignId).then(excluded => {
       if (excluded === "ok") {
           resolve('ok')
       } else {
         resolve('error')
         }
     }).catch((e) => {
         resolve('error')
       })
   } else if (this.NEW_EDIT_LOCATIONS_TO_TARGET.length === 0 && this.NEW_EDIT_LOCATIONS_TO_EXCLUDE.length === 0) {
     resolve('ok')
     }
 } else {
      this.router.navigate(['/campaigns'])
   }
   
    })
  }

optionLocationTargeted: string = 'AREA_OF_INTEREST'
  optionLocationExcluded: string = 'DONT_CARE'

  getOptionsTarget(): Promise<string> {
    return new Promise(resolve => {
      if (this.zonesOptionTargetSelected === '1') {
        this.optionLocationTargeted = 'AREA_OF_INTEREST'
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
        this.optionLocationTargeted = 'LOCATION_OF_PRESENCE'
        resolve('ok')
      } else if (this.zonesOptionExcludeSelected === '2') {
        this.optionLocationTargeted = 'DONT_CARE'
        resolve('ok')
      }
      
    })
  }

}
