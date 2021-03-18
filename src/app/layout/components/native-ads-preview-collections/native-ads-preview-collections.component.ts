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
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, timer } from 'rxjs';
declare const Vibrant: any


interface Slide {
  headline?: string;
  src: string;
}
@Component({
  selector: 'adf-native-ads-preview-collections',
  templateUrl: './native-ads-preview-collections.component.html',
  styleUrls: ['./native-ads-preview-collections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class NativeAdsPreviewCollectionsComponent implements OnInit {

  isLoading = true
  public slides: RESPONSIVE_DISPLAY_ADS[] = []
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

  triggerSimulation(data__PB: NATIVE_ADS_TO_PUBLISH): string {
    this.data__PB = data__PB
    this.spinnerLoadingPreview = true
    this.preview_illustration = data__PB.marketingImages[0].imageUrl
    this.brandToDisplay = data__PB.brand.assetText
    this.longHeadlineToDisplay = data__PB.longHeadline.assetText
    this.titleToDisplay = data__PB.titles[0].assetText
    this.descriptionToDisplay = data__PB.descriptions[0].assetText

    // this.obsTimer.subscribe(currTime => {

  
    // });
      
        
     
    return "ok"
  }
  setPreviewIllustration() {
    if(this.data__PB!==undefined && this.data__PB!==null){
      let randomInit: number = Math.floor(Math.random() * 2);
      if (randomInit === 1) {
        this.videoPreviewUrl = ""
        let total: number = this.data__PB.marketingImages.length
        let random: number = Math.floor(Math.random() * total);
          this.preview_illustration = this.data__PB.marketingImages[random].imageUrl
              this.spinnerLoadingPreview = false
                //var prev = this.getAverageRGB('image-1')
             //this.cd.detectChanges()
                
               //console.log(prev)
               // if(prev!==undefined){
               //   // this.preview_background_color = prev.background
               //   // this.preview_text_color = prev.text
               // }
               
              
      }else{
        this.preview_illustration = ""
        let total: number = this.data__PB.videosAssets.length
        let random: number = Math.floor(Math.random() * total);
        if (this.data__PB!== null) {
          if(this.data__PB.videosAssets[random]!==undefined && this.data__PB.videosAssets[random]!==null){
            this.videoPreviewUrl = this.data__PB.videosAssets[random].videoId
            this.spinnerLoadingPreview = false
            this.cd.detectChanges()
            
          }
              
           
         
          
        }
      }

    }
     }
     currentLogoPreview: string = ""
     setPreviewIllustrationLogo() {      
       if (this.data__PB !== null) {
          
         this.preview_illustration_logo = ""
         let total: number = this.data__PB.logoImages.length
         let random: number = Math.floor(Math.random() * total);
          if(total>0){
            if (this.data__PB.logoImages[random].id === this.currentLogoPreview) {
              let random2: number = Math.floor(Math.random() * total)
              if (this.data__PB.logoImages[random2].imageUrl !== '') { 
                if(this.data__PB.logoImages[random2].id === this.currentLogoPreview) {
                  this.currentLogoPreview=''
                this.preview_illustration_logo = ''
                this.spinnerLoadingPreview = false
                this.cd.detectChanges()
                } else {
                  
                  this.currentLogoPreview=this.data__PB.logoImages[random2].id
                this.preview_illustration_logo = this.data__PB.logoImages[random2].imageUrl
                  this.spinnerLoadingPreview = false

                  setTimeout(() => {
                //var prev = this.getAverageRGB('image-1')
                this.cd.detectChanges()
                // this.preview_background_color = prev.background
                //     this.preview_text_color = prev.text
                   
                
              },500)
                 }
              }
            } else {
              this.currentLogoPreview=this.data__PB.logoImages[random].id
              this.preview_illustration_logo = this.data__PB.logoImages[random].imageUrl
              this.spinnerLoadingPreview = false
              setTimeout(() => {
                //var prev = this.getAverageRGB('image-1')
                this.cd.detectChanges()
                // this.preview_background_color = prev.background
                // this.preview_text_color = prev.text
                
                
              },500)
              
            }

          }
        }
    
       
     }
     setPreviewTitle() {
       if (this.data__PB !== null) {
         
         let total: number = this.data__PB.titles.length
         let random: number = Math.floor(Math.random() * total);
         if (this.data__PB.titles[random]!==undefined && this.data__PB.titles[random].assetText !== this.titleToDisplay && this.data__PB.titles[random].assetText!=='') {
           this.titleToDisplay = this.data__PB.titles[random].assetText
           this.cd.detectChanges()
         } else {
            let total: number = this.data__PB.titles.length
           let random: number = Math.floor(Math.random() * total);
           this.titleToDisplay = this.data__PB.titles[random].assetText
           this.cd.detectChanges()
         }
       }
      
     }
     setPreviewDescription() {
       if (this.data__PB !== null) {
         let total: number = this.data__PB.descriptions.length
         let random: number = Math.floor(Math.random() * total);
         if (this.data__PB.descriptions[random]!==undefined && this.data__PB.descriptions[random].assetText !== this.descriptionToDisplay && this.data__PB.descriptions[random].assetText !== '') {
           this.descriptionToDisplay = this.data__PB.descriptions[random].assetText
           this.cd.detectChanges()
         } else {
            let total: number = this.data__PB.descriptions.length
           let random: number = Math.floor(Math.random() * total);
           this.descriptionToDisplay = this.data__PB.descriptions[random].assetText
           this.cd.detectChanges()
         }
         
       }
      
     }
   
   
     getAverageRGB(id: string) {
       let colors = []
       if( this.preview_illustration!==""){
         setTimeout(()=>{
          var imgEl: any = document.getElementById(id)
          //console.log(imgEl)
          if(imgEl!==undefined && imgEl!==null){
            var img = document.createElement('img');
            img.setAttribute('src', imgEl.src)
            img.crossOrigin = "anonymous";
            var self = this
  img.addEventListener('load', function() {
      var vibrant = new Vibrant(img);
      var swatches = vibrant.swatches()
      //console.log(swatches)
      if(swatches['Vibrant']!==undefined && swatches['Vibrant']!==null && swatches['DarkVibrant']!==undefined && swatches['DarkVibrant']!==null){
        self.preview_background_color = swatches['DarkVibrant'].getHex()
        self.preview_text_color = swatches['Vibrant'].getHex()
        self.preview_box_shadow = `0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12), 0 1px 5px 0 rgba(0,0,0,.2)`

      }
      self.cd.detectChanges()
      // console.log(swatches['DarkVibrant'].getHex())
      // console.log(swatches['LightVibrant'].getHex())
      //self.cd.detectChanges()
      // for (var swatch in swatches){
      //   if (swatches.hasOwnProperty(swatch) && swatches[swatch]){
      //     console.log(swatch, swatches[swatch].getHex())
      //   }
  
      // }
            
    });
          }else{
            this.preview_background_color = `rgba(${255},${255},${255})`
      this.preview_text_color = `black`
      this.preview_box_shadow = `none`
      this.cd.detectChanges()
          }

    /*
     * Results into:
     * Vibrant #7a4426
     * Muted #7b9eae
     * DarkVibrant #348945
     * DarkMuted #141414
     * LightVibrant #f3ccb4
     */
         
          
          // ~~ used to floor values
        },1000)   

       }else{
        this.preview_background_color = `rgba(${255},${255},${255})`
        this.preview_text_color = `black`
        this.preview_box_shadow = `none`
        ///this.cd.detectChanges()
       }
     }
     getBackgroundImg(c, b) {
      // replace the path to your image here
      const style = `color: ${c}; background: ${b};`
      // this is to bypass this warning 'WARNING: sanitizing unsafe style value background-image: url(assets/img/wall.png) (see http://g.co/ng/security#xss)'
      return this.sanitizer.bypassSecurityTrustStyle(style);
  }
  getstyleShadow(c, b, s) {
    // replace the path to your image here
    const style = `color: ${c}; background: ${b}; box-shadow: ${s}`
    // this is to bypass this warning 'WARNING: sanitizing unsafe style value background-image: url(assets/img/wall.png) (see http://g.co/ng/security#xss)'
    return this.sanitizer.bypassSecurityTrustStyle(style);
}
  getColor(c) {
    // replace the path to your image here
    const style = `color: ${c}`
    // this is to bypass this warning 'WARNING: sanitizing unsafe style value background-image: url(assets/img/wall.png) (see http://g.co/ng/security#xss)'
    return this.sanitizer.bypassSecurityTrustStyle(style);
}
   selectHighlightEnter(id: string) {
    document.getElementById(id).classList.add('highlight')
  }
  selectHighlightLeave(id: string) {
     document.getElementById(id).classList.remove('highlight')
  }
  constructor(private cd: ChangeDetectorRef, private storageService: LocalStorageService, private youtubeService: YoutubeService, private zone: NgZone, private sanitizer: DomSanitizer,) {}

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
        setInterval(()=>{
          this.setPreviewIllustration()
          this.setPreviewIllustrationLogo()
          this.setPreviewTitle()
          this.setPreviewDescription()
          this.getAverageRGB('image-1')
          this.spinnerLoadingPreview = false
        },10000)
      }

    })
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    //////console.log(this.slides)
  }

  detectChanges() {
    setTimeout(()=>{
      this.cd.detectChanges()

    },0)
  }
  preloadImages() {
    for (const slide of this.slides) {
      new Image().src = slide.adData.marketingImages[0].imageUrl;
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
   
      this.youtubeService.changeAdStatus(id, ad_group_id, ad_id, status).then(res_status => {
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
