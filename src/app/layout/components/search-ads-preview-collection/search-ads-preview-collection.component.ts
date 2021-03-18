import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, Output, EventEmitter, NgZone } from "@angular/core";

import { trigger, transition, useAnimation } 
from "@angular/animations";

import {
  AnimationType,
  scaleIn,
  scaleOut,
  fadeIn,
  fadeOut,
  flipIn,
  flipOut,
  jackIn,
  jackOut
} from "../ads-preview-collections/carousel.animations";
import { Ads } from 'src/app/campaigns-management/models/display.models';
import { SERVER } from 'src/environments/environment';
import { NATIVE_ADS_TO_PUBLISH, RESPONSIVE_DISPLAY_ADS, User_Role } from 'src/app/utils/data';
import { LocalStorageService } from '../../services/local-storage.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, timer } from 'rxjs';
import { SearchService } from 'src/app/campaigns-management/services/search.service';
import { ResponsiveSearchAd } from 'src/app/campaigns-management/models/search.models';
declare const Vibrant: any


interface Slide {
  headline?: string;
  src: string;
}

@Component({
  selector: 'adf-search-ads-preview-collection',
  templateUrl: './search-ads-preview-collection.component.html',
  styleUrls: ['./search-ads-preview-collection.component.scss'],
  animations: [
    trigger("slideAnimation", [
      /* scale */
      transition("void => scale", [
        useAnimation(scaleIn, { params: { time: "500ms" } })
      ]),
      transition("scale => void", [
        useAnimation(scaleOut, { params: { time: "500ms" } })
      ]),

      /* fade */
      transition("void => fade", [
        useAnimation(fadeIn, { params: { time: "500ms" } })
      ]),
      transition("fade => void", [
        useAnimation(fadeOut, { params: { time: "500ms" } })
      ]),

      /* flip */
      transition("void => flip", [
        useAnimation(flipIn, { params: { time: "500ms" } })
      ]),
      transition("flip => void", [
        useAnimation(flipOut, { params: { time: "500ms" } })
      ]),

      /* JackInTheBox */
      transition("void => jackInTheBox", [
        useAnimation(jackIn, { params: { time: "700ms" } })
      ]),
      transition("jackInTheBox => void", [
        useAnimation(jackOut, { params: { time: "700ms" } })
      ])
    ])
  ]
})
export class SearchAdsPreviewCollectionComponent implements OnInit {

  isLoading = true
  public slides: ResponsiveSearchAd[] = []
  user_role: User_Role = undefined
  @Input() animationType = AnimationType.Scale;
  defaulClientCustomerId: number  = SERVER.CLIENT_CUSTOMER_ID
  currentSlide = 0;
   @ViewChild(SpinnerComponent, { static: false }) spinner: SpinnerComponent;
   public selectedOptionStats1: string = "clicks"
  public selectedOptionStats3: string = "impressions"
  public selectedOptionStats2: string  ="costs"
  data__PB: NATIVE_ADS_TO_PUBLISH = null
  DEFAULT_PREVIEW_RECT = "assets/images/simple-bg.png"
  DEFAULT_PREVIEW_SQR = "assets/images/simple-bg-1.png"
  preview_illustration: string = "assets/images/simple-bg.png"
  preview_illustration_logo: string = ""
  preview_background_color: any = "white"
  preview_text_color: string = "black"
  preview_box_shadow: string = 'none'
  longHeadlineToDisplay: string = 'Titre long'
  titleToDisplay: string = 'Titre'
  descriptionToDisplay: string = 'Description'
  brandToDisplay: string = "Nom de l'entreprise"
  spinnerLoadingPreview: boolean = false
  videoPreviewUrl: string = ""
  safeUrl(dataBase64: string) {
    
    var srcData: SafeResourceUrl;
    srcData = this.sanitizer.bypassSecurityTrustResourceUrl(dataBase64);
    return srcData
  }
  safeStyle(style){
    return this.sanitizer.bypassSecurityTrustStyle(style)
  }
    statsOptions = [
    { text: 'Clics', value: 'clicks' },
    { text: 'Dépenses', value: 'costs' },
    { text: 'Ctr', value: 'ctr' },
    { text: 'Interactions', value: 'interactions' },
    { text: 'Conversions', value: 'conversions' },
    { text: 'Taux de conversion', value: 'convRate' },
  ]
  obsTimer: Observable<number> = timer(10000, 10000);


   selectHighlightEnter(id: string) {
     if(document.getElementById(id)!==undefined && document.getElementById(id)!==null){
       document.getElementById(id).classList.add('highlight')

     }
  }
  selectHighlightLeave(id: string) {
    if(document.getElementById(id)!==undefined && document.getElementById(id)!==null){
      document.getElementById(id).classList.remove('highlight')

    }
  }
  constructor(private cd: ChangeDetectorRef, private storageService: LocalStorageService, private searchService: SearchService, private zone: NgZone, private sanitizer: DomSanitizer,) {}

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
    //////console.log("previous clicked, new current slide is: ", this.currentSlide);
    this.cd.detectChanges()
  }

  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
    //////console.log("next clicked, new current slide is: ", this.currentSlide);
     this.cd.detectChanges()
  }

  ngOnInit() {
    /* this.preloadImages(); */ // for the demo
  }
  ngAfterViewInit(): void {
    this.storageService.getUserIdAndAccountId().then(response => {
      if (response !== null) {
        this.user_role = response.role
        
      }

    })
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    //////console.log(this.slides)
  }

  detectChanges() {
    this.cd.detectChanges()
  }
  preloadImages() {

    this.cd.detectChanges()
  }
  loaderEdit: boolean = false
  @ViewChild(SnackbarComponent, { static: false }) appSnackbar: SnackbarComponent
   openSnackBar(timeout: number, message: string, action: string, css: string) {
    this.appSnackbar.openSnackBar(timeout, message, action, css)
  }
  @Output() change: EventEmitter<string>= new EventEmitter<string>()
    changeAdStatus(id: string, ad_id: string, status: string, ad_group_id: number) {
   
      this.searchService.changeAdStatus(id, ad_group_id, ad_id, status).then(res_status => {
        if (res_status === "ok") {
          this.openSnackBar(15, "Statut de l'annonce mis à jour !", "ok", "snack-danger")
          /* this.cd.detectChanges() */
          this.change.emit('change')
          this.loaderEdit = false
        
        } else {
          this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
          this.loaderEdit = false
      }
      }).catch((e) => {
        this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
      this.loaderEdit = false
    })
     
   
    
  }

   buttonStatusEnter() {
    document.getElementsByClassName('icon-status-dropdown')[0].classList.remove('text-white')
  }
  buttonStatusLeave() {
        document.getElementsByClassName('icon-status-dropdown')[0].classList.add('text-white')
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
  }

}
