import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
import { FormControl } from '@angular/forms';
import { MapMarker, LOCATION } from 'src/app/utils/data';

@Component({
  selector: 'adf-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit, AfterViewInit {

  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

  locationName: string = ""
  @ViewChild('search')
  public searchElementRef: ElementRef;
   @ViewChild('map')
  public mapRef: ElementRef;
  @ViewChild(AgmMap, {static: false}) map: AgmMap



  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private cd: ChangeDetectorRef
  ) { }

  placeComplete: google.maps.places.PlacesService;
  ngOnInit() {
    //load Places Autocomplete
    
     this.mapsAPILoader.load().then(() => {
      /* this.setCurrentLocation(); */
      this.geoCoder = new google.maps.Geocoder;
      this.infowindow = new google.maps.InfoWindow();
      this.placeComplete = new google.maps.places.PlacesService(this.searchElementRef.nativeElement)
    });
    
  }
 /*  createMarker(place) {
    var marker = new google.maps.Marker({
      map: this.mapRef.nativeElement,
      position: place.geometry.location
    });

    var self = this
    google.maps.event.addListener(marker, "click", function () {
    
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  } */
  ngAfterViewInit() {
    // setTimeout(() => {
    //   let SN_LOCATION: LOCATION = {
    // displayType: "Country",
    // id: 2686,
    // locationName: "Senegal",
    // reach: 2060000,
    // targetingStatus: "ACTIVE",
    // criterionId: 0,
    //   }
    
    //   this.setMapObject(SN_LOCATION, "Senegal")
    // }, 1000);
    /* this.searchInput.valueChanges.subscribe(value => {
   }) */
  }
  markers: MapMarker[] = []
  markersExclude: MapMarker[] = []
  infowindow: any;
  setMapObject(location:LOCATION, place: string) {
    this.map
       var request = {
    query: place.toLowerCase(),
    fields: ["name", "geometry"]
       };
    var self = this
    if (this.placeComplete !== undefined) {
         
      this.placeComplete.findPlaceFromQuery(request, (results, status)=> {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        self.addMarker(location, results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0] )
        /* for (var i = 0; i < results.length; i++) {
        } */
        self.latitude = results[0].geometry.location.lat()
        self.longitude = results[0].geometry.location.lng()
         self.zoom = 1;
        self.cd.detectChanges()
    
    
      }
      })
       }
    
  }

  setMapObjectExclude(location:LOCATION, place: string) {
    
       var request = {
    query: place.toLowerCase(),
    fields: ["name", "geometry"]
       };
    var self = this

    this.placeComplete.findPlaceFromQuery(request, (results, status)=> {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      self.addMarkerExclude(location, results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0] )
      /* for (var i = 0; i < results.length; i++) {
      } */
      self.latitude = results[0].geometry.location.lat()
      self.longitude = results[0].geometry.location.lng()
       self.zoom = 1;
      self.cd.detectChanges()
  
  
    }
    })
    
  }

  addMarker(location: LOCATION, lat: number, lng: number, mapObject: any) {
    let markerExist = this.markers.some(marker => marker.location.id === location.id && marker.lat === lat && marker.lng === lng)
    if (!markerExist) {
      this.markers.push({
          location: location,
          lat: lat,
        lng: lng,
          iconUrl: 'assets/images/pin.png'
      })
      
    }
  }
  addMarkerExclude(location: LOCATION, lat: number, lng: number, mapObject: any) {
    let markerExist = this.markersExclude.some(marker => marker.location.id === location.id && marker.lat === lat && marker.lng === lng)
    if (!markerExist) {
      this.markersExclude.push({
          location: location,
          lat: lat,
        lng: lng,
          iconUrl: 'assets/images/map-off.png'
      })
      
    }
  }

  resetMarker() {
    this.markers = []
    this.cd.detectChanges()
  }
  resetMarkerExclude() {
    this.markersExclude = []
    this.cd.detectChanges()
  }
  removeMarker(location: LOCATION) {
     
    this.markers.filter((marker, index, arr) => {
      if (marker.location.id === location.id) {
        this.markers.splice(index, 1)
      }
    })
    this.cd.detectChanges()

  }
   removeMarkerExclude(location: LOCATION) {
     
    this.markersExclude.filter((marker, index, arr) => {
      if (marker.location.id === location.id) {
        this.markersExclude.splice(index, 1)
      }
    })
    this.cd.detectChanges()

  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }


  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

}
