import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, Output, EventEmitter } from "@angular/core";

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
} from "./carousel.animations";
import { Ads } from 'src/app/campaigns-management/models/display.models';
import { SERVER } from 'src/environments/environment';
import { User_Role } from 'src/app/utils/data';
import { LocalStorageService } from '../../services/local-storage.service';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';


interface Slide {
  headline?: string;
  src: string;
}
@Component({
  selector: 'adf-ads-preview-collections',
  templateUrl: './ads-preview-collections.component.html',
  styleUrls: ['./ads-preview-collections.component.scss'],
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
export class AdsPreviewCollectionsComponent implements OnInit {
  isLoading = true
  public slides: Ads[] = []
  user_role: User_Role = undefined
  @Input() animationType = AnimationType.Scale;
  defaulClientCustomerId: number  = SERVER.CLIENT_CUSTOMER_ID
  currentSlide = 0;
   @ViewChild(SpinnerComponent, { static: false }) spinner: SpinnerComponent;
   public selectedOptionStats1: string = "clicks"
  public selectedOptionStats3: string = "impressions"
  public selectedOptionStats2: string  ="costs"
    statsOptions = [
    { text: 'Clics', value: 'clicks' },
    { text: 'Dépenses', value: 'costs' },
    { text: 'Ctr', value: 'ctr' },
    { text: 'Interactions', value: 'interactions' },
    { text: 'Conversions', value: 'conversions' },
    { text: 'Taux de conversion', value: 'convRate' },
  ]

   selectHighlightEnter(id: string) {
    document.getElementById(id).classList.add('highlight')
  }
  selectHighlightLeave(id: string) {
     document.getElementById(id).classList.remove('highlight')
  }
  constructor(private cd: ChangeDetectorRef, private storageService: LocalStorageService, private displayService: DisplayService) {}

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
    ////console.log("previous clicked, new current slide is: ", this.currentSlide);
    setTimeout(()=>{
      this.cd.detectChanges()

    },0)
  }

  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
    ////console.log("next clicked, new current slide is: ", this.currentSlide);
    setTimeout(()=>{
      this.cd.detectChanges()

    },0)
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
    ////console.log(this.slides)
  }

  detectChanges() {
    setTimeout(()=>{
      this.cd.detectChanges()

    },0)
  }
  preloadImages() {
    for (const slide of this.slides) {
      new Image().src = slide.url_image;
    }
    this.isLoading = false
    setTimeout(()=>{
      this.cd.detectChanges()

    },0)
  }
  loaderEdit: boolean = false
  @ViewChild(SnackbarComponent, { static: false }) appSnackbar: SnackbarComponent
   openSnackBar(timeout: number, message: string, action: string, css: string) {
    this.appSnackbar.openSnackBar(timeout, message, action, css)
  }
  @Output() change: EventEmitter<string>= new EventEmitter<string>()
    changeAdStatus(id: string, ad_id: string, status: string, ad_group_id: number) {
   
      this.displayService.changeAdStatus(id, ad_group_id, ad_id, status).then(res_status => {
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

}
