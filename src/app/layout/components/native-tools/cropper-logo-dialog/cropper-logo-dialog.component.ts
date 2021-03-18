import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { LyImageCropper, ImgCropperConfig, ImgCropperEvent, ImgCropperErrorEvent } from '@alyle/ui/image-cropper';
import { ThemeVariables, ThemeRef, lyl, StyleRenderer, Platform } from '@alyle/ui';
import { STYLES as SLIDER_STYLES } from '@alyle/ui/slider';
import { LyDialogRef } from '@alyle/ui/dialog';
import { LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { ChangeEventArgs } from '@syncfusion/ej2-angular-buttons';
import { CroppedAsset, Assets } from 'src/app/utils/data';
import { UploadService } from 'src/app/campaigns-management/services/upload.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AssetsService } from 'src/app/campaigns-management/services/assets.service';
const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {
  
  const slider = ref.selectorsOf(SLIDER_STYLES);
  return {
    cropper: lyl `{
      max-width: 500px
      height: 250px
   
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
  selector: 'adf-cropper-logo-dialog',
  templateUrl: './cropper-logo-dialog.component.html',
  styleUrls: ['./cropper-logo-dialog.component.scss']
})
export class CropperLogoDialogComponent implements OnInit {
   @ViewChild('rectangleCropper', { static: true }) cropperRectangle: LyImageCropper;
   @ViewChild('squareCropper', { static: true }) cropperSquare: LyImageCropper;
    configRectangle: ImgCropperConfig = {
    width: 400, // Default `250`
    height: 100, // Default `200`
    type: 'image/png', // Or you can also use `image/jpeg`
    output: {
      width: 1200,
      height: 300
    }
  };
   configSquare: ImgCropperConfig = {
    width: 128, // Default `250`
    height: 128, // Default `200`
    type: 'image/png', // Or you can also use `image/jpeg`
    output: {
      width: 300,
      height: 300
    }
   };
   readonly classes = this.sRenderer.renderSheet(STYLES);
  scaleRectangle: number = 0;
  scaleSquare: number = 0
  public uid: string =""
  public useSquareFormat: boolean = true;
  public useRectangleFormat: boolean = false;
  public disableSaveCropper: boolean = false
  public imageRectangle: ImgCropperEvent[]=[];
  public imageSquare: ImgCropperEvent[]=[];
  public finalData: CroppedAsset[] = [];
  public requiredRectangle: boolean = false
  public requiredSquare: boolean = true
  public scale: number = 0
  constructor(@Inject(LY_DIALOG_DATA) private asset: Assets,
    readonly sRenderer: StyleRenderer,
    public dialogRef: LyDialogRef, public uploadService: UploadService, public auth: AuthService, public assetService: AssetsService) { }

  

    ngAfterViewInit() {
    
    // Load image when dialog animation has finished
    this.dialogRef.afterOpened.subscribe(() => {
       if (Platform.isBrowser) {
      const config = {
        scale: 0,
        position: {
          x: 10,
          y: 400
        }
        
      };
      /* this.cropperRectangle.setImageUrl(
        this.asset.urls,
        () => {
          this.cropperRectangle.setScale(config.scale, true);
           this.cropperRectangle.updatePosition()
          this.cropperRectangle.updatePosition(config.position.x, config.position.y);
          this.cropperRectangle.fit()
        }
      ); */
           this.cropperSquare.setImageUrl(
        this.asset.urls,
        () => {
          this.cropperSquare.setScale(config.scale, true);
          this.cropperSquare.updatePosition()
          this.cropperSquare.fit()
        }
      );
    }
    });
    }

  
    uploadRectangle():Promise<string> {
    return new Promise(resolve => {
      this.uploadService.uploadImage(this.uid, this.asset.name, this.imageRectangle[0].dataURL).then(res_upload_rectangle => {
        if (res_upload_rectangle !== 'error') {
          this.imageRectangle[0].dataURL = res_upload_rectangle
             resolve('ok')
        }
      })
      })
  }
    uploadSquare():Promise<string> {
    return new Promise(resolve => {
      this.uploadService.uploadImage(this.uid, this.asset.name, this.imageSquare[0].dataURL).then(res_upload_square => {
        if (res_upload_square !== 'error') {
              this.imageSquare[0].dataURL = res_upload_square

             resolve('ok')
        
          
        }
      })
      })
  }
  
  public showSpinner: boolean = false
  saveCropped() {
    this.showSpinner=true
    if (this.requiredRectangle) {
      if (this.requiredSquare) {
        this.cropperRectangle.crop()
        this.cropperSquare.crop()
 this.uploadRectangle().then(res_upload_rectangle => {
        if (res_upload_rectangle === 'ok') {
    
              this.uploadSquare().then(res_upload_square => {
                if (res_upload_square === 'ok') {
                  this.assetService.createAsset(this.uid, this.imageRectangle[0].dataURL, false, false, true, this.asset.mediaId).then(rectangle_asset => {
                    if (rectangle_asset) {
                      this.finalData.push({
                        type: 'logo',
                        asset: rectangle_asset
                      })
                      this.assetService.createAsset(this.uid, this.imageSquare[0].dataURL, false, false, true, this.asset.mediaId).then(square_asset => {
                    if (square_asset) {
                  
                      this.finalData.push({
                        type: 'logo',
                        asset: square_asset
                      })
                      this.showSpinner = false
                     this.dialogRef.close(this.finalData)
                    } else {
                      this.showSpinner = false
                   }
                      }).catch((e) => {
                   this.showSpinner = false
                 })
                    } else {
                      this.showSpinner = false
                   }
                  }).catch((e) => {
                   this.showSpinner = false
                 })

          
                } else {
                  this.showSpinner = false
        }
              }).catch((e) => {
        this.showSpinner = false
      })
         
        } else {
          this.showSpinner = false
        }
 }).catch((e) => {
        this.showSpinner = false
      })
          
      } else {
         this.cropperRectangle.crop()
           this.uploadRectangle().then(res_upload_rectangle => {
        if (res_upload_rectangle === 'ok') {
                  this.assetService.createAsset(this.uid, this.imageRectangle[0].dataURL, false, false, true, this.asset.mediaId).then(rectangle_asset => {
                    if (rectangle_asset) {
                       this.finalData.push({
                        type: 'logo',
                        asset: rectangle_asset
                       })
                      this.showSpinner = false
                      this.dialogRef.close(this.finalData)
                    } else {
                      this.showSpinner = false
                   }
                  }).catch((e) => {
                   this.showSpinner = false
                 })

          
       
         
        } else {
          this.showSpinner = false
        }
           }).catch((e) => {
        this.showSpinner = false
      })
      }
      
 
     
      } else {
      if (this.requiredSquare) {
        
         this.cropperSquare.crop()
                  this.uploadSquare().then(res_upload_square => {
                if (res_upload_square === 'ok') {

                      this.assetService.createAsset(this.uid, this.imageSquare[0].dataURL, false, false, true, this.asset.mediaId).then(square_asset => {
                    if (square_asset) {
                      this.finalData.push({
                        type: 'logo',
                        asset: square_asset
                      })
                      this.showSpinner = false
                     this.dialogRef.close(this.finalData)
                    } else {
                      this.showSpinner = false
                   }
                 })
                } else {
                  this.showSpinner = false
        }
                  }).catch((e) => {
        this.showSpinner = false
      })
      } else {
        this.showSpinner = false
        }
      }    
    
  }
  
    squareFormatUsed(args: ChangeEventArgs) {
  
   this.useSquareFormat = args.checked
    //console.log(this.useSquareFormat)
  
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
    //console.log('img loaded', e);
  }
  onErrorRectangle(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
    // Close the dialog if it fails
    this.dialogRef.close();
  }


  onLoadedSquare(e: ImgCropperEvent) {
    //console.log('img loaded', e);
  }
  onErrorSquare(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
    // Close the dialog if it fails
    this.dialogRef.close();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.auth.user.subscribe(data => {
      if (data !== null) {
        this.uid = data.uid
      }
    })
  }

}
