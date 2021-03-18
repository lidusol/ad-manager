import { Component, ChangeDetectionStrategy, Inject, ViewChild, AfterViewInit, ViewChildren, EventEmitter, Output, ViewEncapsulation, OnDestroy } from '@angular/core';
import { StyleRenderer, WithStyles, lyl, ThemeRef, ThemeVariables, Platform } from '@alyle/ui';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { STYLES as SLIDER_STYLES } from '@alyle/ui/slider';
import {
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent
} from '@alyle/ui/image-cropper';
import { CroppedAsset, Assets, ImageBase64 } from 'src/app/utils/data';
import { AuthService } from 'src/app/auth/auth.service';
import { ChangeEventArgs } from '@syncfusion/ej2-angular-buttons';
import { AssetsService } from 'src/app/campaigns-management/services/assets.service';
import { UploadService } from 'src/app/campaigns-management/services/upload.service';
import { CropperComponent } from 'angular-cropperjs';
import { SERVER } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';



const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {
  
  const slider = ref.selectorsOf(SLIDER_STYLES);
  return {
    cropper: lyl `{
      width: 500px
      height: 280px
      padding: 0px
   
    }`,
    sliderContainer: lyl `{
      position: relative
      ${slider.root} {
        position: absolute
        left: 0
        right: 0
        margin: auto
        top: -32px
      }
    }`,
    slider: lyl `{
      padding: 1em
    }`
  };
};

@Component({
  selector: 'adf-cropper-rectangle-dialog',
  templateUrl: './cropper-rectangle-dialog.component.html',
  styleUrls: ['./cropper-rectangle-dialog.component.scss'],
})
export class CropperRectangleDialogComponent implements WithStyles, AfterViewInit, OnDestroy {
public scale: number = 0
  readonly classes = this.sRenderer.renderSheet(STYLES);
  scaleRectangle: number = 0;
  scaleSquare: number = 0;
  fromImageBase64: boolean = false
  fromAssets: boolean = false
  @ViewChild('rectangleCropper', { static: false }) cropperRectangle: LyImageCropper;
  @ViewChild('squareCropper', { static: false }) cropperSquare: LyImageCropper;
  @ViewChild('angularCropperRect', {static: false}) angularCropperRect: CropperComponent;
  @ViewChild('angularCropperSqr', {static: false})  angularCropperSqr: CropperComponent;
  configRectangle: ImgCropperConfig = {
    width: 480, // Default `250`
    height: 252, // Default `200`
    antiAliased: false,
    type: 'image/png', // Or you can also use `image/jpeg`
    output: {
      width: 1200,
      height: 630
    }
  };
   configSquare: ImgCropperConfig = {
    width: 200, // Default `250`
    height: 200, // Default `200`
    type: 'image/png', // Or you can also use `image/jpeg`
    output: {
      width: 1200,
      height: 1200
    }
   };
  public uid: string =""
  public useSquareFormat: boolean = true;
  public useRectangleFormat: boolean = true;
  public disableSaveCropper: boolean = false
  public imageRectangle: ImgCropperEvent[]=[];
  public imageSquare: ImgCropperEvent[]=[];
  public finalData: CroppedAsset[] = [];
  public requiredRectangle: boolean = true
  public requiredSquare: boolean = true
  public initialUploadRectangleLength: number;
  public initialUploadSquareLength: number;
  public asset: Assets
  public imageBase64: ImageBase64
  public imageUrl: string = ""
  mode: string = ""
  cropperRectIsDisabled: boolean = false
  cropperSqrIsDisabled: boolean = false
  currentCroppedRectString: string = ''
  currentCroppedSqrString: string = ''
  currentCroppedRectCanvas: any = null
  currentCroppedSqrCanvas: any = null
  currentCroppedRectBox: any = null
  currentCroppedSqrBox: any = null
  currentCroppedSqrImageData: any = null
  currentCroppedRectImageData: any = null
  widthImageRect: number = 1200
  heightImageRect: number = 630
  widthImageSqr: number = 1200
  heightImageSqr: number = 1200


  widthLogoRect: number = 1200
  heightLogoRect: number = 1200
  widthLogoSqr: number = 512
  heightLogoSqr: number = 128

  constructor(
    readonly sRenderer: StyleRenderer,
   /*  public dialogRef: LyDialogRef, */ public uploadService: UploadService, public auth: AuthService, public assetService: AssetsService, private http: HttpClient
  ) {

   }

  @Output() selectionStateRect: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() selectionStateSqr: EventEmitter<boolean> = new EventEmitter<boolean>()
  
  
  ngAfterViewInit() {

    /* setTimeout(() => {
      Cropper.noConflict();
    },1500) */
    // Load image when dialog animation has finished
    /* //this.dialogRef.afterOpened.subscribe(() => {
       if (Platform.isBrowser) {
      const config = {
        scale: 0,
        position: {
          x: 10,
          y: 400
        }
        
      };
      this.cropperRectangle.setImageUrl(
        this.asset.urls,
        () => {
          this.cropperRectangle.setScale(config.scale, true);
           this.cropperRectangle.updatePosition()
          this.cropperRectangle.updatePosition(config.position.x, config.position.y);
          this.cropperRectangle.fit()
        }
      );
           this.cropperSquare.setImageUrl(
        this.asset.urls,
        () => {
          this.cropperSquare.setScale(config.scale, true);
          this.cropperSquare.updatePosition()
          this.cropperSquare.fit()
        }
      );
    }
    }); */
    
    
  }
  cropperRectReady: boolean = false
   cropperSqrReady: boolean = false
   cropperRectLogoReady: boolean = false
   cropperSqrLogoReady: boolean = false

  setCropperRectReadyImg(){
    this.angularCropperRect.cropper.setAspectRatio(1.9047619047619047)
    this.angularCropperRect.cropper.setCropBoxData({width: 480, height: 252})
    
    this.cropperRectReady = true
    this.cropperRectDisabled = false
    this.cropperRectIsDisabled = false
    this.cropperRectEnabled = true
    this.selectionStateRect.emit(true)
    //console.log('ready rect 1')
  }

  setCropperRectReadyLg(){
    this.angularCropperRect.cropper.setAspectRatio(1)
    this.angularCropperRect.cropper.setCropBoxData({width: 252, height: 252})
    this.cropperRectLogoReady = true
    this.cropperRectDisabled = false
    this.cropperRectIsDisabled = false
    this.cropperRectEnabled = true
    this.selectionStateRect.emit(true)
    //console.log('ready rect 1')
  }

  setCropperSqrReadyImg(){
    this.angularCropperSqr.cropper.setAspectRatio(1)
    this.angularCropperSqr.cropper.setCropBoxData({width: 252, height: 252})
    this.cropperSqrReady = true
    this.cropperSqrDisabled = false
    this.cropperSqrIsDisabled = false
    this.cropperSqrEnabled = true
    this.selectionStateSqr.emit(true)
    //console.log('ready sqr 1')
  }

  setCropperSqrReadyLg(){
    this.angularCropperSqr.cropper.setAspectRatio(4)
    this.angularCropperSqr.cropper.setCropBoxData({width: 480, height: 120})
    this.cropperSqrLogoReady = true
    this.cropperSqrDisabled = false
    this.cropperSqrIsDisabled = false
    this.cropperSqrEnabled = true
    this.selectionStateSqr.emit(true)
    //console.log('ready sqr 1')
  }
  readyRect() {
    if(this.imageUsageType==='image'){
      if(this.cropperType==='imageRect'){
        this.angularCropperRect.cropper.setCanvasData({width: 480, height: 252})
        this.setCropperRectReadyImg()
      }else{
        this.cropperRectReady = false
      }
    }
  }
  readySqr() {
    if(this.imageUsageType==='image'){
      if(this.cropperType==='imageSqr'){
        this.angularCropperSqr.cropper.setCanvasData({width: 252, height: 252})
        this.setCropperSqrReadyImg()
      }else{
        this.cropperSqrReady = false
      }
    }
  }
  readyRectLogo() {
    if(this.imageUsageType==='logo'){
      if(this.cropperType==='imageRect'){
        this.angularCropperRect.cropper.setCanvasData({width: 252, height: 252})
        this.setCropperRectReadyLg()        
      }else{
        this.cropperRectLogoReady = false
      }
    }
  
  }
  readySqrLogo() {
    if(this.imageUsageType==='logo'){
      if(this.cropperType==='imageSqr'){
        this.angularCropperSqr.cropper.setCanvasData({width: 480, height: 252}) 
        this.setCropperSqrReadyLg()       
      }else{
        this.cropperSqrLogoReady = false
      }
    }
  }
  imgPreview: string = ""
  DOCUMENT = document
configsRect: Array<any> = [{
            viewMode: 1,
            aspectRatio: 1.9047619047619047,
            preview: '#preview-rect-0',
            zoomOnWheel: true,
  autoCropArea: 1,
            autoCrop: true,
  checkOrientation: false,
  checkCrossOrigin: true,
                minCanvasWidth: 480,
                minCanvasHeight: 252,
                minCropBoxWidth: 240,
                minCropBoxHeight: 126,
                minContainerWidth: 480,
                minContainerHeight: 252,
                movable : true,
                scalable: true,
                zoomable: true,
  responsive: true,
  cropBoxResizable: true,
  modal: true,
  center: true,   
}];
  configsSqr: Array<any> = [{
            viewMode: 1,
            aspectRatio: 1/1,
            preview: '#preview-sqr-0',
            zoomOnWheel: true,
    autoCropArea: 1,
    autoCrop: true,
    checkCrossOrigin: true,
    checkOrientation: false,
                minCanvasWidth: 252,
                minCanvasHeight: 252,
                minCropBoxWidth: 252,
                minCropBoxHeight: 252,
                
                minContainerWidth: 480,
                minContainerHeight: 252,
                movable : true,
                scalable: true,
                zoomable: true,
                modal: true,
                responsive: true,
                cropBoxResizable: true,
    center: true,
}];


  configsRectLg: Array<any> = [{
            viewMode: 1,
            aspectRatio: 1/1,
            preview: '#preview-rect-1',
            zoomOnWheel: true,
  autoCropArea: 1,
            autoCrop: true,
  checkOrientation: false,
            checkCrossOrigin: true,
                minCanvasWidth: 480,
                minCanvasHeight: 252,
                minCropBoxWidth: 128,
                minCropBoxHeight: 128,
                minContainerWidth: 480,
                minContainerHeight: 252,
                movable : true,
                scalable: true,
                zoomable: true,
  responsive: true,
  cropBoxResizable: true,
  modal: true,
    center: true,
}];
  configsSqrLg: Array<any> = [{
            viewMode: 1,
            aspectRatio: 4/1,
            preview: '#preview-sqr-1',
            zoomOnWheel: true,
    autoCropArea: 1,
    autoCrop: true,
    checkCrossOrigin: true,
            checkOrientation: false,
                minCanvasWidth: 480,
                minCanvasHeight: 252,
                minCropBoxWidth: 212,
                minCropBoxHeight: 53,
                minContainerWidth: 480,
                minContainerHeight: 252,
                movable : true,
                scalable: true,
    zoomable: true,
                modal: true,
    responsive: true,
    cropBoxResizable: true,
    center: true
}];
  cropperRectDisabled: boolean = true
  cropperSqrDisabled: boolean = true
  imageOption: string[] = ['image', 'logo'];

  
  imageSelectType(event) {
    this.imageUsageType = event.value
    this.cropperRectDisabled = true
    this.cropperSqrDisabled = true
    this.cropperRectReady = false
    this.cropperRectLogoReady = false
    this.cropperSqrReady = false
    this.cropperSqrLogoReady = false
    this.selectionStateRect.emit(false)
    this.selectionStateSqr.emit(false)

    if(this.imageUsageType==='image'){
      if (this.mode === 'standard') {
        if (this.imageBase64.width / this.imageBase64.height=== 1) {
          //console.log('ok')
          this.selectCropperTypeInit('imageSqr')
    
        } else if (parseFloat((this.imageBase64.width / this.imageBase64.height).toFixed(10)) === parseFloat((1200/630).toFixed(10))) {
          this.selectCropperTypeInit('imageRect')
    
        } else {
          this.imageUsageType='image'
          this.selectCropperTypeInit('imageRect')
         
        }
      } else {
        if (this.imageBase64.width / this.imageBase64.height=== 1) {
          //console.log('ok')
          this.selectCropperTypeInit('imageSqr')
    
        } else if (parseFloat((this.imageBase64.width / this.imageBase64.height).toFixed(10)) === parseFloat((1200/630).toFixed(10))) {
          this.selectCropperTypeInit('imageRect')
    
        } else {
          this.imageUsageType='image'
          this.selectCropperTypeInit('imageRect')
         
        }
      }
    }else{
      if (this.mode === 'standard') {
        if (this.imageBase64.width / this.imageBase64.height=== 1) {
          //console.log('ok')
          this.selectCropperType('imageRect')
    
        } else if (parseFloat((this.imageBase64.width / this.imageBase64.height).toFixed(10)) === 4) {
          this.selectCropperType('imageSqr')
    
        } else {
          this.imageUsageType='image'
          this.selectCropperType('imageRect')
         
        }
      } else {
        if (this.imageBase64.width / this.imageBase64.height=== 1) {
          //console.log('ok')
          this.selectCropperType('imageRect')
    
        } else if (parseFloat((this.imageBase64.width / this.imageBase64.height).toFixed(10)) === 4) {
          this.selectCropperType('imageSqr')
    
        } else {
          this.imageUsageType='image'
          this.selectCropperType('imageRect')
         
        }
      }
    }
    
    
    
  }
  spinnerSave: boolean = false
  @Output() saving: EventEmitter<boolean> = new EventEmitter<boolean>()
  saveRectangleImage(): Promise<ImageBase64> {
    return new Promise(resolve => {
      this.saving.emit(true)
      let cropped = undefined
        if (this.fromImageBase64) {
          if (!this.cropperRectDisabled) {
            if (this.angularCropperRect !== undefined && this.angularCropperRect !== null && this.angularCropperRect.cropper !== undefined &&this.angularCropperRect.cropper !== null) {
              if (this.imageUsageType === 'image') {
                this.imageBase64.usage = "image"
                cropped =  this.angularCropperRect.cropper.getCroppedCanvas({
                 imageSmoothingQuality: 'high',
                 width: this.angularCropperRect.cropbox?this.angularCropperRect.cropbox.width*2:600,
                 height: this.angularCropperRect.cropbox?this.angularCropperRect.cropbox.height*2:315,
                 //fillColor: '#fff',
                })
                
                
              } else {
                this.imageBase64.usage = "logo"
                cropped =  this.angularCropperRect.cropper.getCroppedCanvas({
                 imageSmoothingQuality: 'high',
                width: this.angularCropperRect.cropbox?this.angularCropperRect.cropbox.width:300,
                 height: this.angularCropperRect.cropbox?this.angularCropperRect.cropbox.height:300,
                 //fillColor: '#fff',
               })
              }
              
              if (cropped !== undefined && cropped !== null) {
                cropped.toBlob((blob) => {
                  ////console.log(blob)
                  ////console.log(this.angularCropperRect)
                  ////console.log(this.angularCropperRect.cropper)
                  let formData = new FormData();
                  formData.append('croppedImage', blob);
                  this.http.post<{ url: string }>(SERVER.url + '/uploadToCloud', formData).subscribe(
                    response => {
                      formData.delete('croppedImage')
                          this.currentCroppedRectString = response.url
                     ////console.log(this.currentCroppedRectString)
                this.currentCroppedRectCanvas = this.angularCropperRect.cropper.getCanvasData()
                this.currentCroppedRectBox = this.angularCropperRect.cropper.getCropBoxData()
                this.currentCroppedRectImageData = this.angularCropperRect.cropper.getImageData()
                this.imageBase64.images.imageRect.urlString = this.currentCroppedRectString
            this.imageBase64.images.imageRect.canvas = this.currentCroppedRectCanvas
            this.imageBase64.images.imageRect.box = this.currentCroppedRectBox
            this.imageBase64.images.imageRect.imageData = this.currentCroppedRectImageData
            //////console.log(this.currentCroppedRectCanvas)
            this.angularCropperRect.cropper.clear()
                      /* this.angularCropperRect.cropper.destroy() */
                      this.saving.emit(false)
            resolve(this.imageBase64) 
                  },
                    err => {
                      formData.delete('croppedImage')
                      /* this.angularCropperRect.cropper.clear()
                      this.angularCropperRect.cropper.destroy() */
                      this.saving.emit(false)
                    resolve(null)
                  }
                )
                  
                },'image/jpeg')
                
              } else {
                this.saving.emit(false)
                resolve(null)
              }
            
            } else {
              this.saving.emit(false)
              resolve(null)
          }
            
          } else {
            this.saving.emit(false)
            resolve(null)
          }
        } else {
          this.saving.emit(false)
          resolve(null)
        }
      
      
    })
  }

   saveRectangleImageEdit(): Promise<ImageBase64> {
     return new Promise(resolve => {
      this.saving.emit(true)
        if (this.fromImageBase64) {
          if (!this.cropperRectDisabled) {
            //alert(`cropper rect disabled ${this.cropperRectDisabled}`)
            if (this.angularCropperRect !== undefined && this.angularCropperRect !== null && this.angularCropperRect.cropper !== undefined &&this.angularCropperRect.cropper !== null) {
              let cropped = undefined
              if (this.imageUsageType === 'image') {
                this.imageBase64.usage = "image"
                cropped =  this.angularCropperRect.cropper.getCroppedCanvas({
                 imageSmoothingQuality: 'high',
                 width: this.angularCropperRect.cropbox?this.angularCropperRect.cropbox.width*2:600,
                 height: this.angularCropperRect.cropbox?this.angularCropperRect.cropbox.height*2:315,
                 //fillColor: '#fff',
               })
              } else {
                this.imageBase64.usage = "logo"
                cropped =  this.angularCropperRect.cropper.getCroppedCanvas({
                 imageSmoothingQuality: 'high',
                width: this.angularCropperRect.cropbox?this.angularCropperRect.cropbox.width:300,
                 height: this.angularCropperRect.cropbox?this.angularCropperRect.cropbox.height:300,
                 //fillColor: '#fff',
               })
              }
              if (cropped !== undefined && cropped !== null) { 
                cropped.toBlob((blob) => {
                  let formData = new FormData();
                  formData.append('croppedImage', blob);
                  this.http.post<{ url: string }>(SERVER.url + '/uploadToCloud', formData).subscribe(
                    response => {
                      formData.delete('croppedImage')
                          this.currentCroppedRectString = response.url
                     ////console.log(this.currentCroppedRectString)
                this.currentCroppedRectCanvas = this.angularCropperRect.cropper.getCanvasData()
                this.currentCroppedRectBox = this.angularCropperRect.cropper.getCropBoxData()
                this.currentCroppedRectImageData = this.angularCropperRect.cropper.getImageData()
                this.imageBase64.images.imageRect.urlString = this.currentCroppedRectString
            this.imageBase64.images.imageRect.canvas = this.currentCroppedRectCanvas
            this.imageBase64.images.imageRect.box = this.currentCroppedRectBox
                      this.imageBase64.images.imageRect.imageData = this.currentCroppedRectImageData
                      
                      
                      this.imageBase64.images.imageSqr.urlString = ''
                      this.imageBase64.images.imageSqr.canvas = null
                      this.imageBase64.images.imageSqr.box = null
                      this.imageBase64.images.imageSqr.imageData = null
                      this.saving.emit(false)
                      this.angularCropperRect.cropper.clear()
                      /* this.angularCropperRect.cropper.destroy() */
            resolve(this.imageBase64) 
                  },
                    err => {
                      this.saving.emit(false)
                      resolve(null)
                  }
                )
                  
                },'image/jpeg')
              } else {
                this.saving.emit(false)
                resolve(null)
              }
            
            } else {
              this.saving.emit(false)
              resolve(null)
          }
          } else {
           
            //alert(`cropper rect disabled ${this.cropperRectDisabled}`)
            this.saving.emit(false)
            
            resolve(null)
          }
        } else {
          this.saving.emit(false)
          resolve(null)
        }
     
      
    })
  }
   saveRectangleAndSquareImageEdit(): Promise<any> {
    return new Promise(resolve => {
     this.saving.emit(true)
        if (this.fromImageBase64) {
          if (this.angularCropperRect !== undefined && this.angularCropperRect !== null && this.angularCropperSqr !== undefined && this.angularCropperSqr !== null && this.angularCropperSqr.cropper !== undefined &&this.angularCropperSqr.cropper !== null && this.angularCropperRect.cropper !== undefined &&this.angularCropperRect.cropper !== null) {
            let croppedRect = undefined
            let croppedSqr = undefined
            if (this.imageUsageType === 'image') {
                this.imageBase64.usage = "image"
                croppedRect =  this.angularCropperRect.cropper.getCroppedCanvas({
                 imageSmoothingQuality: 'high',
                 width: this.angularCropperRect.cropbox?this.angularCropperRect.cropbox.width*2:600,
                  height: this.angularCropperRect.cropbox ? this.angularCropperRect.cropbox.height*2 : 315,
                })
                croppedSqr =  this.angularCropperSqr.cropper.getCroppedCanvas({
                 imageSmoothingQuality: 'high',
                  width: this.angularCropperSqr.cropbox?this.angularCropperSqr.cropbox.width*2:300,
                  height: this.angularCropperSqr.cropbox?this.angularCropperSqr.cropbox.height*2:300,
                })
                      if (croppedRect !== undefined && croppedRect !== null && croppedSqr !== undefined && croppedSqr !== null) {
                        croppedRect.toBlob((blob) => {
                            let formData = new FormData();
                            formData.append('croppedImage', blob);
                            this.http.post<{ url: string }>(SERVER.url + '/uploadToCloud', formData).subscribe(
                              response => {
                                formData.delete('croppedImage')
                                this.currentCroppedRectString = response.url
                                croppedSqr.toBlob((blobSqr) => {
                            let formDataSqr = new FormData();
                            formDataSqr.append('croppedImage', blobSqr);
                            this.http.post<{ url: string }>(SERVER.url + '/uploadToCloud', formDataSqr).subscribe(
                              responseSqr => {
                                formDataSqr.delete('croppedImage')
                                    this.currentCroppedSqrString = responseSqr.url
                               ////console.log(this.currentCroppedRectString)
                                 this.currentCroppedRectCanvas = this.angularCropperRect.cropper.getCanvasData()
                        this.currentCroppedRectBox = this.angularCropperRect.cropper.getCropBoxData()
                                this.currentCroppedRectImageData = this.angularCropperRect.cropper.getImageData()
                                 
                       this.currentCroppedSqrCanvas = this.angularCropperSqr.cropper.getCanvasData()
                        this.currentCroppedSqrBox = this.angularCropperSqr.cropper.getCropBoxData()
                                this.currentCroppedSqrImageData = this.angularCropperSqr.cropper.getImageData()
                                this.imageBase64.images.imageRect.urlString = this.currentCroppedRectString
                    this.imageBase64.images.imageRect.canvas = this.currentCroppedRectCanvas
                    this.imageBase64.images.imageRect.box = this.currentCroppedRectBox
                    this.imageBase64.images.imageSqr.urlString = this.currentCroppedSqrString
                    this.imageBase64.images.imageSqr.canvas = this.currentCroppedSqrCanvas
                    this.imageBase64.images.imageSqr.box = this.currentCroppedSqrBox
                    this.imageBase64.images.imageRect.imageData = this.currentCroppedRectImageData
                                this.imageBase64.images.imageSqr.imageData = this.currentCroppedSqrImageData
                                this.saving.emit(false)
                                this.angularCropperRect.cropper.clear()
                                /* this.angularCropperRect.cropper.destroy() */
                                this.angularCropperSqr.cropper.clear()
                                /* this.angularCropperSqr.cropper.destroy() */
                      resolve(this.imageBase64) 
                            },
                              err => {
                                formData.delete('croppedImage')
                                formDataSqr.delete('croppedImage')
                                this.saving.emit(false)
                              resolve(null)
                            }
                          )
                            
                          },'image/jpeg')
                               
                     
                            },
                              err => {
                                this.saving.emit(false)
                                 formData.delete('croppedImage')
                              resolve(null)
                            }
                          )
                            
                          },'image/jpeg')
                        
                      }
            } else {
              this.imageBase64.usage = "logo"
                croppedRect =  this.angularCropperRect.cropper.getCroppedCanvas({
                 imageSmoothingQuality: 'high',
                width: this.angularCropperRect.cropbox?this.angularCropperRect.cropbox.width:300,
                 height: this.angularCropperRect.cropbox?this.angularCropperRect.cropbox.height:300,
                })
              croppedSqr =  this.angularCropperSqr.cropper.getCroppedCanvas({
               imageSmoothingQuality: 'high',
                width: 512,
                 height: 128,
              })
              if (croppedRect !== undefined && croppedRect !== null && croppedSqr !== undefined && croppedSqr !== null) {
                croppedRect.toBlob((blob) => {
                    let formData = new FormData();
                    formData.append('croppedImage', blob);
                    this.http.post<{ url: string }>(SERVER.url + '/uploadToCloud', formData).subscribe(
                      response => {
                        formData.delete('croppedImage')
                        croppedSqr.toBlob((blobSqr) => {
                          let formDataSqr = new FormData();
                          formDataSqr.append('croppedImage', blobSqr);
                          this.http.post<{ url: string }>(SERVER.url + '/uploadToCloud', formDataSqr).subscribe(
                            responseSqr => {
                              formDataSqr.delete('croppedImage')
                              this.currentCroppedRectString = response.url
                              this.currentCroppedSqrString = responseSqr.url
                              ////console.log(this.currentCroppedRectString)
                              this.currentCroppedRectCanvas = this.angularCropperRect.cropper.getCanvasData()
                              this.currentCroppedRectBox = this.angularCropperRect.cropper.getCropBoxData()
                              this.currentCroppedRectImageData = this.angularCropperRect.cropper.getImageData()
                              
                              this.currentCroppedSqrCanvas = this.angularCropperSqr.cropper.getCanvasData()
                              this.currentCroppedSqrBox = this.angularCropperSqr.cropper.getCropBoxData()
                              this.currentCroppedSqrImageData = this.angularCropperSqr.cropper.getImageData()
                              this.imageBase64.images.imageRect.urlString = this.currentCroppedRectString
                              this.imageBase64.images.imageSqr.urlString = this.currentCroppedSqrString
                              this.imageBase64.images.imageRect.canvas = this.currentCroppedRectCanvas
                              this.imageBase64.images.imageRect.box = this.currentCroppedRectBox
                              this.imageBase64.images.imageSqr.canvas = this.currentCroppedSqrCanvas
                              this.imageBase64.images.imageSqr.box = this.currentCroppedSqrBox
                              this.imageBase64.images.imageRect.imageData = this.currentCroppedRectImageData
                              this.imageBase64.images.imageSqr.imageData = this.currentCroppedSqrImageData
                              this.saving.emit(false)
                              this.angularCropperRect.cropper.clear()
                              /* this.angularCropperRect.cropper.destroy() */
                              this.angularCropperSqr.cropper.clear()
                       /*  this.angularCropperSqr.cropper.destroy() */
                                resolve(this.imageBase64) 
                    },
                            err => {
                              formData.delete('croppedImage')
                              formDataSqr.delete('croppedImage')
                        this.saving.emit(false)
                      resolve(null)
                    }
                  )
                    
                  }, 'image/jpeg')
                       
             
                    },
                      err => {
                        formData.delete('croppedImage')
                        this.saving.emit(false)
                      resolve(null)
                    }
                  )
                    
                  },'image/jpeg')
                
              } else {
                this.saving.emit(false)
                resolve(null)
              }
              }
           
          } else {
            this.saving.emit(false)
             resolve(null)
          }
         
        } else {
          this.saving.emit(false)
          resolve(null)
        }
      
      
    })
  }
  saveSquareImage(): Promise<any> {
     return new Promise(resolve => {
      this.saving.emit(true)
      let cropped = undefined
        if (this.fromImageBase64) {
          if (!this.cropperSqrDisabled) {
            if (this.angularCropperSqr !== undefined && this.angularCropperSqr.cropper !== undefined &&this.angularCropperSqr.cropper !== null) {
              if (this.imageUsageType === 'image') {
                this.imageBase64.usage = "image"
                cropped =  this.angularCropperSqr.cropper.getCroppedCanvas({
                 imageSmoothingQuality: 'high',
                 width: this.angularCropperSqr.cropbox?this.angularCropperSqr.cropbox.width:300,
                 height: this.angularCropperSqr.cropbox?this.angularCropperSqr.cropbox.height:300,
                 //fillColor: '#fff',
                })
                
                
              } else {
                this.imageBase64.usage = "logo"
                cropped =  this.angularCropperSqr.cropper.getCroppedCanvas({
                 imageSmoothingQuality: 'high',
                width: 512,
                 height: 128,
                 //fillColor: '#fff',
               })
              }
              
              if (cropped !== undefined && cropped !== null) {
                cropped.toBlob((blob) => {
                  ////console.log(blob)
                  ////console.log(this.angularCropperSqr)
                  ////console.log(this.angularCropperSqr.cropper)
                  let formData = new FormData();
                  formData.append('croppedImage', blob);
                  this.http.post<{ url: string }>(SERVER.url + '/uploadToCloud', formData).subscribe(
                    response => {
                      formData.delete('croppedImage')
                          this.currentCroppedSqrString = response.url
                     ////console.log(this.currentCroppedSqrString)
                this.currentCroppedSqrCanvas = this.angularCropperSqr.cropper.getCanvasData()
                this.currentCroppedSqrBox = this.angularCropperSqr.cropper.getCropBoxData()
                this.currentCroppedSqrImageData = this.angularCropperSqr.cropper.getImageData()
                this.imageBase64.images.imageSqr.urlString = this.currentCroppedSqrString
            this.imageBase64.images.imageSqr.canvas = this.currentCroppedSqrCanvas
            this.imageBase64.images.imageSqr.box = this.currentCroppedSqrBox
            this.imageBase64.images.imageSqr.imageData = this.currentCroppedSqrImageData
            //////console.log(this.currentCroppedSqrCanvas)
                      this.saving.emit(false)
                      this.angularCropperSqr.cropper.clear()
                      /* this.angularCropperSqr.cropper.destroy() */
            resolve(this.imageBase64) 
                  },
                    err => {
                    
                      this.angularCropperSqr.cropper.clear()
                      /* this.angularCropperSqr.cropper.destroy() */
                      formData.delete('croppedImage')
                      this.saving.emit(false)
                    resolve(null)
                  }
                )
                  
                }, 'image/jpeg')
                
              } else {
                this.saving.emit(false)
                resolve(null)
              }
            
            } else {
              this.saving.emit(false)
              resolve(null)
          }
            
          } else {
            this.saving.emit(false)
            resolve(null)
          }
        } else {
          this.saving.emit(false)
          resolve(null)
        }
      
      
    })
  }
   saveSquareImageEdit(): Promise<ImageBase64> {
     return new Promise(resolve => {
      this.saving.emit(true)
        if (this.fromImageBase64) {
          if (!this.cropperSqrDisabled) {
            //alert(`cropper sqr disabled ${this.cropperSqrDisabled}`)
            if (this.angularCropperSqr !== undefined && this.angularCropperSqr.cropper !== undefined &&this.angularCropperSqr.cropper !== null) {
              let cropped = undefined
              if (this.imageUsageType === 'image') {
                this.imageBase64.usage = "image"
                cropped =  this.angularCropperSqr.cropper.getCroppedCanvas({
                 imageSmoothingQuality: 'high',
                 width: this.angularCropperSqr.cropbox?this.angularCropperSqr.cropbox.width:300,
                 height: this.angularCropperSqr.cropbox?this.angularCropperSqr.cropbox.height:300,
                 //fillColor: '#fff',
               })
              } else {
                this.imageBase64.usage = "logo"
                cropped =  this.angularCropperSqr.cropper.getCroppedCanvas({
                 imageSmoothingQuality: 'high',
                 width: 512,
                 height: 128,
                 
                 //fillColor: '#fff',
               })
              }
              if (cropped !== undefined && cropped !== null) { 
                cropped.toBlob((blob) => {
                  let formData = new FormData();
                  formData.append('croppedImage', blob);
                  this.http.post<{ url: string }>(SERVER.url + '/uploadToCloud', formData).subscribe(
                    response => {
                      formData.delete('croppedImage')
                          this.currentCroppedSqrString = response.url
                     ////console.log(this.currentCroppedSqrString)
                this.currentCroppedSqrCanvas = this.angularCropperSqr.cropper.getCanvasData()
                this.currentCroppedRectBox = this.angularCropperSqr.cropper.getCropBoxData()
                this.currentCroppedSqrImageData = this.angularCropperSqr.cropper.getImageData()
                this.imageBase64.images.imageSqr.urlString = this.currentCroppedSqrString
            this.imageBase64.images.imageSqr.canvas = this.currentCroppedSqrCanvas
            this.imageBase64.images.imageSqr.box = this.currentCroppedRectBox
            this.imageBase64.images.imageSqr.imageData = this.currentCroppedSqrImageData
            
                      
            this.imageBase64.images.imageRect.urlString = ''
            this.imageBase64.images.imageRect.canvas = null
            this.imageBase64.images.imageRect.box = null
                      this.imageBase64.images.imageRect.imageData = null
                      this.saving.emit(false)
                      this.angularCropperSqr.cropper.clear()
                      /* this.angularCropperSqr.cropper.destroy() */
            resolve(this.imageBase64) 
                  },
                    err => {
                      formData.delete('croppedImage')
                    resolve(null)
                  }
                )
                  
                }, 'image/jpeg')
              } else {
                this.saving.emit(false)
                resolve(null)
              }
            
            } else {
              this.saving.emit(false)
              resolve(null)
          }
          } else {
           
            //alert(`cropper sqr disabled ${this.cropperSqrDisabled}`)
            this.saving.emit(false)
            resolve(null)
            
          
          }
        } else {
          this.saving.emit(false)
          resolve(null)
        }
     
      
    })
  }

  
  cropperRectEnabled: boolean = false
  cropperSqrEnabled: boolean = false
  selectCropperType(blockId: string) {
    setTimeout(() => {
      //console.log(blockId === this.cropperType)
      if (blockId === this.cropperType) {
        if (blockId === 'imageRect') {
          this.enableCropperRect()
          if(!this.cropperRectDisabled){
            this.cropperRectDisabled = false

          }
          this.selectionStateRect.emit(true)
        } else {
          this.enableCropperSqr()
          if(!this.cropperSqrDisabled){
            this.cropperSqrDisabled = false

          }
          this.selectionStateSqr.emit(true)
        }
      } else {
        if (blockId === 'imageRect') {
                document.getElementById(blockId).classList.add('selected')
                              this.cropperType = blockId
                               setTimeout(() => {
                                 if (this.mode === 'standard') {
                                  //console.log('try toggle cropper rect')
                                  //console.log(this.cropperRectEnabled)
                                  //console.log(this.cropperRectDisabled)

                                     //console.log('try toggle')
                                     this.toggleCropperRectangleImage().then(toggle=>{
                                       if(toggle==='ok'){
                                         //console.log(toggle)
                                         if(this.imageUsageType==='image'){
                            
                                            this.setCropperRectReadyImg()
                                          
                                         }else{
                                     
                                            this.setCropperRectReadyLg()
                                          
                                           //logo
                                         }
                                       }
                                     })

                                  
                                    document.getElementById('imageSqr').classList.remove('selected')
                                 } else {
       
                                    this.toggleCropperRectangleImageEdit().then(toggle=>{
                                      //console.log(toggle)
                                       if(toggle==='ok'){
                                        if(this.imageUsageType==='image'){
                                    
                                            this.setCropperRectReadyImg()
                                          
                                         }else{
                                   
                                            this.setCropperRectReadyLg()
                                          
                                           //logo
                                         }
                                       }
                                     })

                                  
                                    document.getElementById('imageSqr').classList.remove('selected')
                                 }
                                    
                                    
                                    
                                  },500)
            
            
          } else if (blockId === 'imageSqr') {
            
         
             document.getElementById(blockId).classList.add('selected')
                  this.cropperType = blockId
                  setTimeout(() => {
                    if (this.mode === 'standard') {
                      //console.log('try toggle cropper sqr ')
                      //console.log(this.cropperSqrEnabled)
                      //console.log(this.cropperSqrDisabled)
                        //console.log('toggle cropper sqr fjkdfkjdkjf ')
                        this.toggleCropperSquareImage().then(toggle=>{
                          //console.log(toggle)
                          //console.log(this.angularCropperSqr)
                          if(toggle==='ok'){
                            if(this.imageUsageType==='image'){

                                this.setCropperSqrReadyImg()
                              
                            }else{

                                this.setCropperSqrReadyLg()
                              
                            }
                          }
                        })

                      
                        document.getElementById('imageRect').classList.remove('selected')
                    } else {

                        this.toggleCropperSquareImageEdit().then(toggle=>{
                          //console.log(toggle)
                          if(toggle==='ok'){
                            if(this.imageUsageType==='image'){
                        
                                this.setCropperSqrReadyImg()
                              
                            }else{
                          
                                this.setCropperSqrReadyLg()
                              
                            }
                          }
                        })

                      
                        document.getElementById('imageRect').classList.remove('selected')
                    }
                       
                        
                      },500)
          
            
          }
        
      }
    
       
      
    },500)
  }


  selectCropperTypeInit(blockId: string) {
    setTimeout(() => {
      //console.log(blockId === this.cropperType)
      if (blockId === this.cropperType) {
        if (blockId === 'imageRect') {
          this.enableCropperRect()
          if(!this.cropperRectDisabled){
            this.cropperRectDisabled = false

          }
          this.selectionStateRect.emit(true)
        } else {
          this.enableCropperSqr()
          if(!this.cropperSqrDisabled){
            this.cropperSqrDisabled = false

          }
          this.selectionStateSqr.emit(true)
        }
      } else {
        if (blockId === 'imageRect') {
                document.getElementById(blockId).classList.add('selected')
                              this.cropperType = blockId
                               setTimeout(() => {
                                 if (this.mode === 'standard') {
                                  //console.log('try toggle cropper rect')
                                  //console.log(this.cropperRectEnabled)
                                  //console.log(this.cropperRectDisabled)
                                   if(this.cropperRectDisabled){
                                     //console.log('try toggle')
                                     this.toggleCropperRectangleImage().then(toggle=>{
                                       if(toggle==='ok'){
                                         //console.log(toggle)
                                       }
                                     })

                                   }
                                    document.getElementById('imageSqr').classList.remove('selected')
                                 } else {
                                  if(this.cropperRectDisabled){
                                    this.toggleCropperRectangleImageEdit().then(toggle=>{
                                      //console.log(toggle)
                                       if(toggle==='ok'){
              
                                       }
                                     })

                                  }
                                    document.getElementById('imageSqr').classList.remove('selected')
                                 }
                                    
                                    
                                    
                                  },500)
            
            
          } else if (blockId === 'imageSqr') {
            
         
             document.getElementById(blockId).classList.add('selected')
                  this.cropperType = blockId
                  setTimeout(() => {
                    if (this.mode === 'standard') {
                      //console.log('try toggle cropper sqr ')
                      //console.log(this.cropperSqrEnabled)
                      //console.log(this.cropperSqrDisabled)
                      if(this.cropperSqrDisabled){
                        //console.log('toggle cropper sqr fjkdfkjdkjf ')
                        this.toggleCropperSquareImage().then(toggle=>{
                          //console.log(toggle)
                          //console.log(this.angularCropperSqr)
                          if(toggle==='ok'){
                        
                          }
                        })

                      }
                        document.getElementById('imageRect').classList.remove('selected')
                    } else {
                      if(this.cropperSqrDisabled){
                        this.toggleCropperSquareImageEdit().then(toggle=>{
                          //console.log(toggle)
                          if(toggle==='ok'){
                     
                          }
                        })

                      }
                        document.getElementById('imageRect').classList.remove('selected')
                    }
                       
                        
                      },500)
          
            
          }
        
      }
    
       
      
    },500)
  }


  disableCropperRect() {
    this.cropperRectIsDisabled = true
    this.cropperRectDisabled = true
    this.cropperRectEnabled = false
    if (this.angularCropperRect !== undefined && this.angularCropperRect !== null) {
      if (this.angularCropperRect.cropper !== undefined && this.angularCropperRect.cropper !== null) {
        this.angularCropperRect.cropper.disable()
        this.selectionStateRect.emit(false)
                   
      } else {
        this.selectionStateRect.emit(false)
      }
      
    }
  }
  disableCropperSqr() {
    this.cropperSqrIsDisabled = true
    this.cropperSqrDisabled = true
    this.cropperSqrEnabled = false
    if (this.angularCropperSqr !== undefined && this.angularCropperSqr !== null) {
      if (this.angularCropperSqr.cropper !== undefined && this.angularCropperSqr.cropper !== null) {
        this.angularCropperSqr.cropper.disable()             
        this.selectionStateSqr.emit(false)
                 }
    }
  }
  enableCropperRect() {
    this.cropperRectDisabled = false
    this.cropperRectEnabled = true
    this.angularCropperRect.cropper.enable()   
    /* setTimeout(() => {
      if (this.mode === 'standard') {
        
      } else {
        this.toggleCropperRectangleImageEdit() 
      }
    },500) */
  }
  enableCropperSqr() {
    this.cropperSqrDisabled = false
    this.cropperSqrEnabled = true
     this.angularCropperSqr.cropper.enable()   
   /*  setTimeout(() => {
      if (this.mode === 'standard') {
        this.toggleCropperSquareImage() 
      } else {
        this.toggleCropperSquareImageEdit() 
      }
           
    },500) */
  }
  public imageUsageType: string = ''

  toggleCropperRectangleImage():Promise<string> {
    return new Promise(resolve=>{
      this.currentCroppedRectString = ''
      this.currentCroppedRectCanvas = null
      this.currentCroppedRectBox = null
      /* if (this.angularCropperRect !== undefined && this.angularCropperRect !== null && this.angularCropperRect.cropper !== undefined && this.angularCropperRect.cropper !== null) {
        this.angularCropperRect.cropper.clear()
        
      } */
  
          if (this.imageBase64.images.imageRect.urlString === '') {
            if (this.angularCropperRect !== undefined && this.angularCropperRect !== null) {
            
              
              //this.angularCropperRect.imageUrl = this.imageBase64.url
  
                  if (this.angularCropperRect.cropper !== undefined && this.angularCropperRect.cropper !== null) { 
                   
                    this.angularCropperRect.cropper.enable()
                    if (this.imageUsageType === 'image') {
                    this.angularCropperRect.cropper.setCropBoxData({width: 480, height: 252})
                       this.imageBase64.usage = 'image'
                       resolve('ok')
                    } else {
                    this.angularCropperRect.cropper.setCropBoxData({width: 252, height: 252})
                      this.imageBase64.usage = 'logo'
                      resolve('ok')
                    }
                    
                  
                }
    
              }
        
            
          } else {
            if (this.angularCropperRect !== undefined && this.angularCropperRect !== null) {
              //this.angularCropperRect.imageUrl = this.imageBase64.url
   
              if (this.angularCropperRect.cropper !== undefined && this.angularCropperRect.cropper !== null) { 
  
                    this.angularCropperRect.cropper.enable()
                    if (this.imageUsageType === 'image') {
                    this.angularCropperRect.cropper.setCropBoxData({width: 480, height: 252})
                      this.imageBase64.usage = 'image'
                      resolve('ok')
                    } else {
                    this.angularCropperRect.cropper.setCropBoxData({width: 252, height: 252})
                      this.imageBase64.usage = 'logo'
                      resolve('ok')
                }
            
  
                
                
                  }
  
                }
           
          }
      
    })
      

  }

    toggleCropperRectangleImageEdit() {
      /* if (this.angularCropperRect !== undefined && this.angularCropperRect !== null && this.angularCropperRect.cropper !== undefined && this.angularCropperRect.cropper !== null) {
      this.angularCropperRect.cropper.clear()
      
    } */
    return new Promise(resolve=>{
      if (this.imageBase64.images.imageRect.urlString === '') {
        if (this.angularCropperRect !== undefined && this.angularCropperRect !== null) {
         
          //this.angularCropperRect.imageUrl = this.imageBase64.url
 
          if (this.angularCropperRect.cropper !== undefined && this.angularCropperRect.cropper !== null) { 
             this.angularCropperRect.cropper.enable()
            if (this.imageUsageType === 'image') {
                this.angularCropperRect.cropper.setCropBoxData({width: 480, height: 252})
                 
                   this.imageBase64.usage = 'image'
                   resolve('ok')
            } else {
    
                this.angularCropperRect.cropper.setCropBoxData({width: 252, height: 252})
                  this.imageBase64.usage = 'logo'
                  resolve('ok')
                }
              
            
         
        }

      }
      } else {
        if (this.angularCropperRect !== undefined && this.angularCropperRect !== null) {
        
          //this.angularCropperRect.imageUrl = this.imageBase64.url

          if (this.angularCropperRect.cropper !== undefined && this.angularCropperRect.cropper !== null) { 

                this.angularCropperRect.cropper.enable()
                if (this.imageUsageType === 'image') {
                this.angularCropperRect.cropper.setCropBoxData({width: 480, height: 252})
                   this.imageBase64.usage = 'image'
                   resolve('ok')
                } else {
                this.angularCropperRect.cropper.setCropBoxData({width: 252, height: 252})
                  this.imageBase64.usage = 'logo'
                  resolve('ok')
                }
         
              
            
              }

            }
      }
      
    })
      


  }

  toggleCropperSquareImage(): Promise<string> {
    return new Promise(resolve=>{

      this.currentCroppedSqrString = ''
       this.currentCroppedSqrCanvas = null
       this.currentCroppedSqrBox = null
       /* if (this.angularCropperSqr !== undefined && this.angularCropperSqr !== null && this.angularCropperSqr.cropper !== undefined && this.angularCropperSqr.cropper !== null) {
         this.angularCropperSqr.cropper.clear()
         
       } */
         if (this.fromImageBase64) {
           if (this.imageBase64.images.imageSqr.urlString === '') {
             if (this.angularCropperSqr !== undefined && this.angularCropperSqr !== null) {
             
               
               //this.angularCropperSqr.imageUrl = this.imageBase64.url
         
                   if (this.angularCropperSqr.cropper !== undefined && this.angularCropperSqr.cropper !== null) { 
                    
                     this.angularCropperSqr.cropper.enable()
                     if (this.imageUsageType === 'image') {
                     this.angularCropperSqr.cropper.setCropBoxData({width: 252, height: 252})
                        this.imageBase64.usage = 'image'
                        resolve('ok')
                     } else {
                     this.angularCropperSqr.cropper.setCropBoxData({width: 480, height: 120})
                       this.imageBase64.usage = 'logo'
                       resolve('ok')
                     }
                     
        
                   
                 }
              
               }
         
             
           } else {
             if (this.angularCropperSqr !== undefined && this.angularCropperSqr !== null) {
               //this.angularCropperSqr.imageUrl = this.imageBase64.url
           
               if (this.angularCropperSqr.cropper !== undefined && this.angularCropperSqr.cropper !== null) { 
   
                     this.angularCropperSqr.cropper.enable()
     
                       if (this.imageUsageType === 'image') {
                     this.angularCropperSqr.cropper.setCropBoxData({width: 252, height: 252})
                        this.imageBase64.usage = 'image'
                        resolve('ok')
                     } else {
                     this.angularCropperSqr.cropper.setCropBoxData({width: 480, height: 120})
                       this.imageBase64.usage = 'logo'
                       resolve('ok')
                     }
   
                 
                 
                   }
        
                 }
            
           }
         }
    })
 
  }

  imageLoaded(loaded: any) {
    ////console.log(`image loaded ${loaded}`)
  }

  imageLoadError(loaded: any) {
    //console.log(`image not loaded ${loaded}`)
  }

   toggleCropperSquareImageEdit():Promise<string> {
   /*  if (this.angularCropperSqr !== undefined && this.angularCropperSqr !== null && this.angularCropperSqr.cropper !== undefined && this.angularCropperSqr.cropper !== null) {
      this.angularCropperSqr.cropper.clear()
      
    } */
    return new Promise(resolve=>{
      if (this.imageBase64.images.imageSqr.urlString === '') {
         if (this.angularCropperSqr !== undefined && this.angularCropperSqr !== null) {
           //this.angularCropperSqr.imageUrl = this.imageBase64.url
           setTimeout(() => {
          if (this.angularCropperSqr.cropper !== undefined && this.angularCropperSqr.cropper !== null) { 
               this.angularCropperSqr.cropper.enable()
            if (this.imageUsageType === 'image') {
                this.angularCropperSqr.cropper.setCropBoxData({width: 252, height: 252})
                   this.imageBase64.usage = 'image'
                   resolve('ok')
            } else {
                this.angularCropperSqr.cropper.setCropBoxData({width: 480, height: 120})
                  this.imageBase64.usage = 'logo'
                  resolve('ok')
                }
  
            
              
            }
          },500)
        }
     
      } else {
        
        setTimeout(()=>{
          if (this.angularCropperSqr !== undefined && this.angularCropperSqr !== null) {
          //this.angularCropperSqr.imageUrl = this.imageBase64.url
             setTimeout(() => {
          if (this.angularCropperSqr.cropper !== undefined && this.angularCropperSqr.cropper !== null) { 
  
               this.angularCropperSqr.cropper.enable()
            if (this.imageUsageType === 'image') {
                this.angularCropperSqr.cropper.setCropBoxData({width: 252, height: 252})
                   this.imageBase64.usage = 'image'
                   resolve('ok')
            } else {
                this.angularCropperSqr.cropper.setCropBoxData({width: 480, height: 120})
                  this.imageBase64.usage = 'logo'
                  resolve('ok')
                }
          
              
  
              
            
            }
          },500)
          }
        },500)
      }
      
    })

      
  }
  toggleInitialElements() {
     this.cropperRectDisabled = true
     this.cropperSqrDisabled = true
     this.cropperRectIsDisabled = true
     this.cropperSqrIsDisabled = true
     this.cropperRectEnabled = true
     this.cropperSqrEnabled = true
     this.cropperRectReady = false
     this.cropperRectLogoReady = false
     this.cropperSqrReady = false
     this.cropperSqrLogoReady = false
     this.selectionStateRect.emit(false)
    this.selectionStateSqr.emit(false)
    //console.log(this.imageBase64.width / this.imageBase64.height)
    if (this.imageBase64.width / this.imageBase64.height=== 1) {
      //console.log('ok')
       this.imageUsageType='image'
      this.selectCropperTypeInit('imageSqr')

    } else if (parseFloat((this.imageBase64.width / this.imageBase64.height).toFixed(10)) === parseFloat((1200/630).toFixed(10))) {
      this.imageUsageType='image'
      this.selectCropperTypeInit('imageRect')

    } else if (this.imageBase64.width / this.imageBase64.height === 4) {
      this.imageUsageType='logo'
      this.selectCropperTypeInit('imageRect')
 
    } else {
      this.imageUsageType='image'
      this.selectCropperTypeInit('imageRect')
     
    }

    
      
     /*  this.toggleCropperSquareImage() */
         /*  setTimeout(() => {
          },1000)  */   
  }

  toggleInitialElementsEdit() {
    this.cropperRectDisabled = true
     this.cropperSqrDisabled = true
     this.cropperRectIsDisabled = true
     this.cropperSqrIsDisabled = true
     this.cropperRectReady = false
     this.cropperRectLogoReady = false
     this.cropperSqrReady = false
     this.cropperSqrLogoReady = false
     this.selectionStateRect.emit(false)
    this.selectionStateSqr.emit(false)
    if (this.imageBase64.usage === 'image') {
      this.imageUsageType='image'
    } else if (this.imageBase64.usage === 'logo') {
      this.imageUsageType='logo'
    }
    ////console.log(this.imageBase64.images)
    if (this.imageBase64.images.imageRect.urlString !== '' && this.imageBase64.images.imageSqr.urlString !== '') {

        this.toggleCropperRectangleImageEdit()
        this.toggleCropperSquareImageEdit()
        this.selectCropperType('imageRect')
      } else {
       if (this.imageBase64.images.imageRect.urlString !== '') {
         this.toggleCropperRectangleImageEdit()
         this.selectCropperType('imageRect')
        }else if (this.imageBase64.images.imageSqr.urlString !== '') {
        this.toggleCropperSquareImageEdit()
         this.selectCropperType('imageSqr')
      } 
    }
    /* setTimeout(() => {
      Cropper.noConflict();
    },1500) */
  
  }

  ngOnDestroy() {
    if (this.angularCropperRect !== undefined && this.angularCropperRect !== null && this.angularCropperRect.cropper !== undefined && this.angularCropperRect.cropper !== null) {
      this.angularCropperRect.cropper.clear()
      this.angularCropperRect.cropper.destroy()
      
    }
    if (this.angularCropperSqr !== undefined && this.angularCropperSqr !== null && this.angularCropperSqr.cropper !== undefined && this.angularCropperSqr.cropper !== null) {
      this.angularCropperSqr.cropper.clear()
      this.angularCropperSqr.cropper.destroy()
      
    }
    this.cropperRectDisabled = true
     this.cropperSqrDisabled = true
     this.cropperRectIsDisabled = true
     this.cropperSqrIsDisabled = true
     this.selectionStateRect.emit(false)
    this.selectionStateSqr.emit(false)
  }
  uploadRectangle():Promise<string> {
    return new Promise(resolve => {
      this.uploadService.uploadImage(this.uid, this.asset.name, this.imageRectangle[0].dataURL).then(res_upload_rectangle => {
        ////////console.log(res_upload_rectangle)
        if (res_upload_rectangle !== 'error') {
          this.imageRectangle[0].dataURL = res_upload_rectangle
             resolve('ok')
        } else {
          resolve('error')
        }
      }).catch((e)=>{
        resolve('error')
      })
      })
  }
    uploadSquare():Promise<string> {
    return new Promise(resolve => {
      this.uploadService.uploadImage(this.uid, this.asset.name, this.imageSquare[0].dataURL).then(res_upload_square => {
        if (res_upload_square !== 'error') {
              this.imageSquare[0].dataURL = res_upload_square

             resolve('ok')
        
          
        } else{
          resolve('error')
        }
      }).catch((e) => {
        resolve('error')
      })
      })
  }

  public showSpinner: boolean = false
  public cropperType: string = ''
  saveCropped():Promise<string>{
    return new Promise(resolve => {
      this.showSpinner = true
    if (this.requiredRectangle) {
      if (this.requiredSquare) {
        this.cropperRectangle.crop()
        this.cropperSquare.crop()
        this.uploadRectangle().then(res_upload_rectangle => {
        if (res_upload_rectangle === 'ok') {
          this.uploadSquare().then(res_upload_square => {
                if (res_upload_square === 'ok') {
                  this.assetService.createAsset(this.uid, this.imageRectangle[0].dataURL, true, false, false, this.asset.mediaId).then(rectangle_asset => {
                    if (rectangle_asset) {
                      this.finalData.push({
                        type: 'rect',
                        asset: rectangle_asset
                      })
                      this.assetService.createAsset(this.uid,this.imageSquare[0].dataURL, false, true, false, this.asset.mediaId).then(square_asset => {
                    if (square_asset) {
                
                      this.finalData.push({
                        type: 'sqr',
                        asset: square_asset
                      })
                      this.showSpinner = false
                      resolve('ok')
                     //this.dialogRef.close(this.finalData)
                    } else {
                      this.showSpinner = false
                      resolve('error-square-save')
                   }
                      }).catch((e) => {
                        this.showSpinner = false
                        resolve('error-square-save')
                 })
                    } else {
                      this.showSpinner = false
                      resolve('error-rectangle-save')
                   }
                  }).catch((e) => {
                    this.showSpinner = false
                    resolve('error-rectangle-save')
                 })

          
        }else{
                  this.showSpinner = false
                  resolve('error-square')
        }
          }).catch((e) => {
            this.showSpinner = false
        resolve('error-square')
      })
         
        }else{
          this.showSpinner = false
          resolve('error-rectangle')
        }
        }).catch((e) => {
          this.showSpinner = false
          resolve('error-rectangle')
      })
          
      } else {
         this.cropperRectangle.crop()
           this.uploadRectangle().then(res_upload_rectangle => {
        if (res_upload_rectangle === 'ok') {
                  this.assetService.createAsset(this.uid,this.imageRectangle[0].dataURL, true, false, false, this.asset.mediaId).then(rectangle_asset => {
                    if (rectangle_asset) {
                       this.finalData.push({
                        type: 'rect',
                        asset: rectangle_asset
                       })
                      resolve('ok')
                      //this.dialogRef.close(this.finalData)
                    } else {
                      this.showSpinner = false
                      resolve('error-rectangle-save')
                   }
                  }).catch((e) => {
                    this.showSpinner = false
                    resolve('error-rectangle-save')
                 })

          
       
         
        }else{
          this.showSpinner = false
          resolve('error-rectangle')
        }
           }).catch((e) => {
             this.showSpinner = false
             resolve('error-rectangle')
      })
      }
      
     /*  this.uploadRectangle().then(res_upload_rectangle => {
        if (res_upload_rectangle === 'ok') {
          if (this.requiredSquare) {
              this.uploadSquare().then(res_upload_square => {
                if (res_upload_square === 'ok') {
                  this.finalData.push({
                    imageRectangle: this.imageRectangle[0],
                    imageSquare: this.imageSquare[0]
          })

          //this.dialogRef.close(this.finalData)
          
        }
      })
          } else {
               this.finalData.push({
                    imageRectangle: this.imageRectangle[0],
                    imageSquare: null
          })
            //this.dialogRef.close(this.finalData)
            
            }
        }
      }) */
      } else {
      if (this.requiredSquare) {
        
         this.cropperSquare.crop()
                  this.uploadSquare().then(res_upload_square => {
                if (res_upload_square === 'ok') {
                      this.assetService.createAsset(this.uid, this.imageSquare[0].dataURL, false, true, false, this.asset.mediaId).then(square_asset => {
                    if (square_asset) {
                      this.finalData.push({
                        type: 'sqr',
                        asset: square_asset
                      })
                      this.showSpinner = false
                      resolve('ok')
                     //this.dialogRef.close(this.finalData)
                    } else {
                      this.showSpinner = false
                      resolve('error-square-save')
                   }
                      }).catch((e) => {
                        this.showSpinner = false
                        resolve('error-square-save')
                 })
                   

          
        }else{
                  this.showSpinner = false
                  resolve('error-square')
        }
                  }).catch((e) => {
                    this.showSpinner = false
                    resolve('error-square')
      })
              /*  this.uploadSquare().then(res_upload_square => {
        if (res_upload_square === 'ok') {
            this.finalData.push({
                    imageRectangle: null,
                    imageSquare: this.imageSquare[0]
          })
          //this.dialogRef.close(this.finalData)
          
        }
      }) */
        }
      }
   /*  if ((parseInt((this.asset.width / this.asset.height).toFixed(1)) === 1.9) && (this.asset.width >= 600 && this.asset.height > 314) && (this.asset.width <= 1200 && this.asset.width <= 630)) {
      this.imageRectangle = this.asset.urls
           this.uploadSquare().then(res_upload_square => {
            if (res_upload_square === 'ok') {
               this.finalData.imageRectangle = { name: this.asset.name, dataURL: this.asset.urls, width: this.asset.width, height: this.asset.height, originalDataURL: this.asset.urls }
              this.finalData.imageSquare = this.imageSquare[0]
              //this.dialogRef.close(this.finalData) 
        }
      })
    } else if(((this.asset.width / this.asset.height) === 1) && (this.asset.width >= 300 && this.asset.height >= 300) && (this.asset.width <= 1200 && this.asset.width <= 1200)) {
      this.imageSquare = this.asset.urls
          this.uploadRectangle().then(res_upload_rectangle => {
            if (res_upload_rectangle === 'ok') {
              this.finalData.imageSquare = { name: this.asset.name, dataURL: this.asset.urls, width: this.asset.width, height: this.asset.height, originalDataURL: this.asset.urls }
              this.finalData.imageRectangle = this.imageRectangle[0]
              //this.dialogRef.close(this.finalData) 
        }
      })
    } else {
      
     
      
      
         
   
    } */
    
    
    })
    
  }

 

  squareFormatUsed(args: ChangeEventArgs) {
  
   this.useSquareFormat = args.checked
    ////////console.log(this.useSquareFormat)
  
      if (this.useRectangleFormat && this.useSquareFormat) {
        this.disableSaveCropper = false
        this.requiredRectangle = true
        this.requiredSquare = true
      } else if(!this.useRectangleFormat && this.useSquareFormat) {
        this.disableSaveCropper = false
        this.requiredRectangle = false
        this.requiredSquare = true
      } else if (this.useRectangleFormat && !this.useSquareFormat) {
        this.disableSaveCropper = false
        this.requiredRectangle = true
        this.requiredSquare = false
      }else if (!this.useRectangleFormat && !this.useSquareFormat) {
        this.disableSaveCropper = true
        this.requiredRectangle = false
        this.requiredSquare = false
      }
  
   
    
  }

  rectangleFormatUsed(args: ChangeEventArgs) {
    this.useRectangleFormat = args.checked
   
    
      if (this.useRectangleFormat && this.useSquareFormat) {
        this.disableSaveCropper = false
        this.requiredRectangle = true
        this.requiredSquare = true
      } else if(!this.useRectangleFormat && this.useSquareFormat) {
        this.disableSaveCropper = false
        this.requiredRectangle = false
        this.requiredSquare = true
      } else if (this.useRectangleFormat && !this.useSquareFormat) {
        this.disableSaveCropper = false
        this.requiredRectangle = true
        this.requiredSquare = false
      }else if (!this.useRectangleFormat && !this.useSquareFormat) {
        this.disableSaveCropper = true
        this.requiredRectangle = false
        this.requiredSquare = false
      }
   
    
  }


  onLoadedRectangle(e: ImgCropperEvent) {
    ////////console.log('img loaded', e);
  }
  onErrorRectangle(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
    // Close the dialog if it fails
    //this.dialogRef.close();
  }

  
  onLoadedSquare(e: ImgCropperEvent) {
    ////////console.log('img loaded', e);
  }
  onErrorSquare(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
    // Close the dialog if it fails
    //this.dialogRef.close();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.selectionStateRect.emit(false)
    this.selectionStateSqr.emit(false)
    this.auth.user.subscribe(data => {
      if (data !== null) {
        this.uid = data.uid
      }
    })
  }


}
