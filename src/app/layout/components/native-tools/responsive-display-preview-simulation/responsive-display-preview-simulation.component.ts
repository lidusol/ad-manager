import { Component, OnInit, NgZone, OnDestroy, AfterViewInit} from '@angular/core';
import { NATIVE_ADS_TO_PUBLISH, VIDEO_ASSET, ImageBase64, ASSET_TEXT } from 'src/app/utils/data';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';
declare const Vibrant: any;
@Component({
  selector: 'adf-responsive-display-preview-simulation',
  templateUrl: './responsive-display-preview-simulation.component.html',
  styleUrls: ['./responsive-display-preview-simulation.component.scss'],
})
export class ResponsiveDisplayPreviewSimulationComponent implements OnInit, OnDestroy, AfterViewInit {

   allCombinedAssets: ImageBase64[] = []
  allCombinedVideos: VIDEO_ASSET[] = []
  titlesAssets: ASSET_TEXT[] = []
  descriptionsAssets: ASSET_TEXT[] = []
  brandAssets: ASSET_TEXT = { assetText: '' }
  longHeadlineAssets: ASSET_TEXT = { assetText: '' }
  everyFiveSecondsRefreshPreviewModel: Observable<number> = timer(0, 8000);
  subscriptionPreview: Subscription;
  constructor(private zone: NgZone, private sanitizer: DomSanitizer,) { 
    /* this.ref.detach(); */
    /* this.everyFiveSecondsRefreshPreviewModel.subscribe(number => {
      //console.log(number)
      this.triggerSimulationCreation()

    }) */
    this.subscriptionPreview = this.everyFiveSecondsRefreshPreviewModel.pipe(
        take(1)).subscribe(number => {
        this.triggerSimulationCreationMain()
      })
  }

  ngOnInit(): void {
  }

  safeStyle(style){
    return this.sanitizer.bypassSecurityTrustStyle(style)
  }
  public ngOnDestroy(): void {
  
    /*  if (this.subscriptionPreview !== undefined && this.subscriptionPreview !== null) {
      this.subscriptionPreview.unsubscribe();
       
     } */
}
  data__PB: NATIVE_ADS_TO_PUBLISH = null
  DEFAULT_PREVIEW_RECT = "assets/images/simple-bg.png"
  DEFAULT_PREVIEW_SQR = "assets/images/simple-bg-1.png"
  preview_illustration: string = "assets/images/simple-bg.png"
  preview_illustration_logo: string = "assets/images/simple-bg.png"
  preview_background_color: any = "white"
  preview_text_color: string = "black"
  preview_box_shadow: string = ""
  longHeadlineToDisplay: string = 'Titre long'
  titleToDisplay: string = 'Titre'
  descriptionToDisplay: string = 'Description'
  brandToDisplay: string = "Nom de l'entreprise"
  spinnerLoadingPreview: boolean = false
  videoPreviewUrl: string = ""
  public desktopFormat: boolean = false
  public mobileFormat: boolean = true
  safeUrl(dataBase64: string) {
    var srcData: SafeResourceUrl;
    srcData = this.sanitizer.bypassSecurityTrustResourceUrl(dataBase64);
    return srcData
  }
   toggleDesktopFormat() {
    this.desktopFormat = true
     this.mobileFormat = false
     if (this.data__PB !== null) {
       this.setPreviewIllustration()
        this.setPreviewIllustrationLogo()
     } else {
       this.setPreviewIllustrationCreation()
        this.setPreviewIllustrationLogoCreation()
     }
  }
  toggleMobileFormat() {
    this.mobileFormat = true
    this.desktopFormat = false
    if (this.data__PB !== null) {
       this.setPreviewIllustration()
        this.setPreviewIllustrationLogo()
     } else {
       this.setPreviewIllustrationCreation()
        this.setPreviewIllustrationLogoCreation()
     }
  }
  adMobileDisplay: string = "1"

  triggerSimulation() {
    this.spinnerLoadingPreview = true
        
        setInterval(() => {
          let mobileNumber: number =  this.getRandomInt(0, 3)
             this.adMobileDisplay = mobileNumber.toString()
          this.setPreviewIllustration()
        this.setPreviewIllustrationLogo()
        this.setPreviewTitle()
        this.setPreviewDescription()
          this.spinnerLoadingPreview = false
    
         
       },5000)
      
  
  }

  triggerSimulationCreation() {
    setInterval(()=>{
      this.triggerSimulationCreationMain()
      this.getAverageRGB('image-1')

    },5000)
      // this.subscriptionPreview = this.everyFiveSecondsRefreshPreviewModel.pipe(
      //   take(1)).subscribe(number => {
      // })
 
    
  }

  triggerSimulationCreationMain() {
    this.spinnerLoadingPreview = true
    
      
        
          let mobileNumber: number =  this.getRandomInt(0, 3) 
             this.adMobileDisplay = mobileNumber.toString()
        this.setPreviewIllustrationCreation()
        this.setPreviewIllustrationLogoCreation()
        this.setPreviewTitleCreation(this.titlesAssets.length-1)
        this.setPreviewDescriptionCreation(this.descriptionsAssets.length -1)
        this.spinnerLoadingPreview = false
       
    
   
  }

  setPreviewIllustration() {
 let mobileNumber: number =  this.getRandomInt(0, 3) 
  this.adMobileDisplay = mobileNumber.toString()
    let randomInit: number =  this.getRandomInt(0, 2)
    if (randomInit === 1) {
      this.videoPreviewUrl = ""
      if(this.data__PB!==undefined && this.data__PB!==null){

        let total: number = this.data__PB.marketingImages.length-1
        let random: number =  this.getRandomInt(0, total)
          this.preview_illustration = this.data__PB.marketingImages[random].imageUrl
              this.spinnerLoadingPreview = false
              setTimeout(() => {
                var prev = this.getAverageRGB('image-1')
                //this.preview_background_color = prev.background
                //this.preview_text_color = prev.text
                let mobileNumber: number =  this.getRandomInt(0, 3)
                 this.adMobileDisplay = mobileNumber.toString()
              },500)
      }
             
            
    }else{
      this.preview_illustration = ""
      if(this.data__PB!==undefined && this.data__PB!==null){
        let total: number = this.data__PB.videosAssets.length-1
        let random: number =  this.getRandomInt(0, total)
        if (this.data__PB!== null) {
          if(this.data__PB.videosAssets[random]!==undefined && this.data__PB.videosAssets[random]!==null){
            this.videoPreviewUrl = this.data__PB.videosAssets[random].videoId
            this.spinnerLoadingPreview = false
            //this.cd.detectChanges()
            
          }
              
           
         
          
        }

      }
    }
  }
  currentLogoPreview: string = ""
  setPreviewIllustrationLogo() {
     let mobileNumber: number =  this.getRandomInt(0, 3)
             this.adMobileDisplay = mobileNumber.toString()
    if (this.data__PB !== null) {
       
      this.preview_illustration_logo = ""
      let total: number = this.data__PB.logoImages.length-1
      let random: number =  this.getRandomInt(0, total)
        if (this.data__PB.logoImages[random]!==undefined && this.data__PB.logoImages[random].id === this.currentLogoPreview) {
          let random2: number =  this.getRandomInt(0, total)
          if (this.data__PB.logoImages[random2].imageUrl !== '') { 
            if(this.data__PB.logoImages[random2].id === this.currentLogoPreview) {
              this.currentLogoPreview=''
            this.preview_illustration_logo = ''
            this.spinnerLoadingPreview = false
            } else {
              
              this.currentLogoPreview=this.data__PB.logoImages[random2].id
            this.preview_illustration_logo = this.data__PB.logoImages[random2].imageUrl
              this.spinnerLoadingPreview = false
              setTimeout(() => {
            var prev = this.getAverageRGB('image-1')
            //this.preview_background_color = prev.background
                //this.preview_text_color = prev.text
               
            
          },500)
             }
          }
        } else {
          if(this.data__PB!==null && this.data__PB.logoImages[random]!==undefined){

            this.currentLogoPreview=this.data__PB.logoImages[random].id
            this.preview_illustration_logo = this.data__PB.logoImages[random].imageUrl
            this.spinnerLoadingPreview = false
            setTimeout(() => {
              var prev = this.getAverageRGB('image-1')
              //this.preview_background_color = prev.background
              //this.preview_text_color = prev.text
              
              
            },500)
          }
          
        }
     }
 
    
  }
  setPreviewTitle() {
     let mobileNumber: number =  this.getRandomInt(0, 3)
             this.adMobileDisplay = mobileNumber.toString()
    if (this.data__PB !== null) {
      
      let total: number = this.data__PB.titles.length-1
      let random: number =  this.getRandomInt(0, total)
      if (this.data__PB.titles[random]!==undefined && this.data__PB.titles[random].assetText !== this.titleToDisplay && this.data__PB.titles[random].assetText!=='') {
        this.titleToDisplay = this.data__PB.titles[random].assetText
      } else {
         let total: number = this.data__PB.titles.length-1
        let random: number =  this.getRandomInt(0, total)
        this.titleToDisplay = this.data__PB.titles[random].assetText
      }
    }
   
  }
  setPreviewDescription() {
     let mobileNumber: number =  this.getRandomInt(0, 3)
             this.adMobileDisplay = mobileNumber.toString()
    if (this.data__PB !== null) {
      let total: number = this.data__PB.descriptions.length-1
      let random: number =  this.getRandomInt(0, total)
      if (this.data__PB.descriptions[random]!==undefined && this.data__PB.descriptions[random].assetText !== this.descriptionToDisplay && this.data__PB.descriptions[random].assetText !== '') {
        this.descriptionToDisplay = this.data__PB.descriptions[random].assetText
      } else {
         let total: number = this.data__PB.descriptions.length-1
        let random: number =  this.getRandomInt(0, total)
        this.descriptionToDisplay = this.data__PB.descriptions[random].assetText
      }
      
    }
   
  }

  
  getAverageRGB(id: string) {
    let colors = []
    if( this.preview_illustration!==""){
      setTimeout(()=>{
       var imgEl: any = document.getElementById(id)
       ////console.log(imgEl)
       if(imgEl!==undefined && imgEl!==null){
         var img = document.createElement('img');
         img.setAttribute('src', imgEl.src)
         img.crossOrigin = "anonymous";
         var self = this
img.addEventListener('load', function() {
   var vibrant = new Vibrant(img);
   var swatches = vibrant.swatches()
   ////console.log(swatches)

 if(swatches['Vibrant']!==undefined && swatches['Vibrant']!==null && swatches['DarkVibrant']!==undefined && swatches['DarkVibrant']!==null){
        self.preview_background_color = swatches['DarkVibrant'].getHex()
        self.preview_text_color = swatches['Vibrant'].getHex()
        self.preview_box_shadow = `0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12), 0 1px 5px 0 rgba(0,0,0,.2)`

      }
   //self.cd.detectChanges()
   // //console.log(swatches['DarkVibrant'].getHex())
   // //console.log(swatches['LightVibrant'].getHex())
   //self.cd.detectChanges()
   // for (var swatch in swatches){
   //   if (swatches.hasOwnProperty(swatch) && swatches[swatch]){
   //     //console.log(swatch, swatches[swatch].getHex())
   //   }

   // }
         
 });
       }else{
         this.preview_background_color = `rgba(${255},${255},${255})`
   this.preview_text_color = `black`
   this.preview_box_shadow = `none`
   //this.cd.detectChanges()
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
  

   setPreviewIllustrationCreation() {
     let mobileNumber: number =  this.getRandomInt(0, 3)
             this.adMobileDisplay = mobileNumber.toString()
      
      let total: number = 2
      let random: number =  this.getRandomInt(0, total)
    let index: number =  this.getRandomInt(0, this.allCombinedAssets.length-1)
      if (random === 1) {
         this.videoPreviewUrl = ""
        if (this.allCombinedAssets[index]!==undefined && this.allCombinedAssets[index].images.imageRect.urlString !== '') {
        if (this.allCombinedAssets[index].usage === 'image') {
          this.preview_illustration = this.allCombinedAssets[index].images.imageRect.urlString
          this.spinnerLoadingPreview = false
          setTimeout(() => {
            var prev = this.getAverageRGB('image-1')
            //this.preview_background_color = prev.background
            //this.preview_text_color = prev.text
            let mobileNumber: number =  this.getRandomInt(0, 3)
             this.adMobileDisplay = mobileNumber.toString()
          },500)
          
        }
      }
      } else {
      let totalVideos: number = this.allCombinedVideos.length-1
      let randomVideos: number =  this.getRandomInt(0, totalVideos)
        if (this.allCombinedVideos[randomVideos]!==undefined && this.allCombinedVideos[randomVideos].previewUrl !== '') {
          this.videoPreviewUrl = this.allCombinedVideos[randomVideos].videoId
          this.spinnerLoadingPreview = false
          setTimeout(() => {
            
            var prev = this.getAverageRGB("video-preview-"+this.allCombinedVideos[randomVideos].videoId)
            //this.preview_background_color = prev.background
            //this.preview_text_color = prev.text
            let mobileNumber: number =  this.getRandomInt(0, 3)
             this.adMobileDisplay = mobileNumber.toString()
          },500)
          
       
      }
      }
      
  
  }

  setPreviewIllustrationLogoCreation() {
 let mobileNumber: number =  this.getRandomInt(0, 3)
             this.adMobileDisplay = mobileNumber.toString()
      let logoImages: ImageBase64[] = this.allCombinedAssets.filter(image => image.usage === 'logo')
      this.preview_illustration_logo = ""
      let total: number = logoImages.length-1
      let random: number =  this.getRandomInt(0, total)
      if (logoImages[random]!==undefined && logoImages[random].images.imageRect.urlString !== '') {
        if (logoImages[random].id === this.currentLogoPreview) {
          let random2: number =  this.getRandomInt(0, total)
          if (logoImages[random2].images.imageRect.urlString !== '') { 
            if(logoImages[random2].id === this.currentLogoPreview) {
              this.currentLogoPreview=''
            this.preview_illustration_logo = ''
            this.spinnerLoadingPreview = false
            } else {
              
              this.currentLogoPreview=logoImages[random2].id
            this.preview_illustration_logo = logoImages[random2].images.imageRect.urlString
              this.spinnerLoadingPreview = false
              setTimeout(() => {
            var prev = this.getAverageRGB('image-1')
            //this.preview_background_color = prev.background
                //this.preview_text_color = prev.text
                let mobileNumber: number =  this.getRandomInt(0, 3)
             this.adMobileDisplay = mobileNumber.toString()
            
          },500)
             }
          }
        } else {
          this.currentLogoPreview=logoImages[random].id
          this.preview_illustration_logo = logoImages[random].images.imageRect.urlString
          this.spinnerLoadingPreview = false
          setTimeout(() => {
            var prev = this.getAverageRGB('image-1')
            //this.preview_background_color = prev.background
            //this.preview_text_color = prev.text
            let mobileNumber: number =  this.getRandomInt(0, 3)
             this.adMobileDisplay = mobileNumber.toString()
            
          },500)
          
        }
      }
  
    
  }

  setPreviewTitleCreation(index?: number) {
  
      
      if (this.titlesAssets[index]!==undefined && this.titlesAssets[index].assetText !== this.titleToDisplay && this.titlesAssets[index].assetText!=='') {
        this.titleToDisplay = this.titlesAssets[index].assetText
      } else {
         let total: number = this.titlesAssets.length-1
        let random: number =  this.getRandomInt(0, total)
        if (this.titlesAssets[random] !== undefined) {
          
          this.titleToDisplay = this.titlesAssets[random].assetText
        }
      }
    
   
  }
  setPreviewDescriptionCreation(index?: number) {
    
      if (this.descriptionsAssets[index]!==undefined && this.descriptionsAssets[index].assetText !== this.descriptionToDisplay && this.descriptionsAssets[index].assetText !== '') {
        this.descriptionToDisplay = this.descriptionsAssets[index].assetText
      } else {
         let total: number = this.descriptionsAssets.length-1
        let random: number =  this.getRandomInt(0, total)
        if (this.descriptionsAssets[random] !== undefined) {
          this.descriptionToDisplay = this.descriptionsAssets[random].assetText
          
        }
      }
      
    
   
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setInterval(()=>{
      let mobileNumber: number =  this.getRandomInt(0, 3)
             this.adMobileDisplay = mobileNumber.toString()
      
      let total: number = 2
      let random: number =  this.getRandomInt(0, total)
    let index: number = this.getRandomInt(0, this.allCombinedAssets.length-1)
    //console.log(index)
    //console.log(this.allCombinedAssets[index])
      if (random === 1) {
         this.videoPreviewUrl = ""
        if (this.allCombinedAssets[index]!==undefined && this.allCombinedAssets[index].images.imageRect.urlString !== '') {
        if (this.allCombinedAssets[index].usage === 'image') {
          this.preview_illustration = this.allCombinedAssets[index].images.imageRect.urlString
          this.spinnerLoadingPreview = false
          setTimeout(() => {
            var prev = this.getAverageRGB('image-1')
            //this.preview_background_color = prev.background
            //this.preview_text_color = prev.text
            let mobileNumber: number =  this.getRandomInt(0, 3)
             this.adMobileDisplay = mobileNumber.toString()
          },500)
          
        }
      }
      } else {
      let totalVideos: number =  this.allCombinedVideos.length-1
      let randomVideos: number =  this.getRandomInt(0, totalVideos)
        if (this.allCombinedVideos[randomVideos]!==undefined && this.allCombinedVideos[randomVideos].previewUrl !== '') {
          this.videoPreviewUrl = this.allCombinedVideos[randomVideos].videoId
          this.spinnerLoadingPreview = false
          setTimeout(() => {
            
            var prev = this.getAverageRGB("video-preview-"+this.allCombinedVideos[randomVideos].videoId)
            //this.preview_background_color = prev.background
            //this.preview_text_color = prev.text
            let mobileNumber: number =  this.getRandomInt(0, 3)
             this.adMobileDisplay = mobileNumber.toString()
          },500)
          
       
      }
      }

      this.setPreviewIllustrationLogoCreation()
      this.setPreviewTitleCreation()
      this.setPreviewDescriptionCreation()
      this.setPreviewIllustration()
      this.setPreviewIllustrationLogo()
      this.setPreviewTitle()
      this.setPreviewDescription()
      this.getAverageRGB('image-1')
     }, 8000)
     
      
  }
}
