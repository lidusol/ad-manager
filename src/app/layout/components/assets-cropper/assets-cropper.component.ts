import { ChangeDetectionStrategy, Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { LyImageCropper, ImgCropperConfig, ImgCropperEvent,  } from '@alyle/ui/image-cropper';
import { LyTheme2 } from '@alyle/ui';
import { AD_FORMAT, VALID_AD_FORMAT_DISPLAY } from 'src/app/utils/data';
import {MatSelectChange} from '@angular/material/select'



@Component({
  selector: 'adf-assets-cropper',
  templateUrl: './assets-cropper.component.html',
  styleUrls: ['./assets-cropper.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetsCropperComponent implements OnInit {
  styles = {
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cropping: {
    maxWidth: '1000px',
    height: '700px',

    },
  sliderContainer: {
    textAlign: 'center',
    maxWidth: '400px',
    margin: '14px',
  },
  flex: {
    flex: 1
  }
  };
  scale: number;
  selectedFormat: AD_FORMAT = null;
  FORMAT: AD_FORMAT[] = VALID_AD_FORMAT_DISPLAY
  classes = this.theme.addStyleSheet(this.styles);
  croppedImage?: string;
  @ViewChild(LyImageCropper) cropper: LyImageCropper;
  result: string;
  myConfig: ImgCropperConfig = {
    width: 300, // Default `250`
    height: 250, // Default `200`,
    output: {
      width: 300,
      height: 250
    }
  };

  selectionChange(args: MatSelectChange) {
    //console.log(this.selectedFormat)
   
    this.styles = {
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
      },
      sliderContainer: {
    textAlign: 'center',
    maxWidth: '400px',
    margin: '14px',
  },
   cropping: {
    maxWidth: '1000px',
    height: '700px',

    },
  flex: {
    flex: 1
  }
};
 this.myConfig = {
    width: this.selectedFormat.width, // Default `250`
    height: this.selectedFormat.height, // Default `200`,
    output: {
       width: this.selectedFormat.width, // Default `250`
    height: this.selectedFormat.height,
    }
  };
    /* this.styles.cropping.maxWidth = this.selectedFormat.width.toString() + 'px'
    this.styles.cropping.height = this.selectedFormat.height.toString() + 'px'
    this.myConfig.width = this.selectedFormat.width
    this.myConfig.height = this.selectedFormat.height
    this.myConfig.output['width'] = this.selectedFormat.width
    this.myConfig.output['height'] = this.selectedFormat.height */
    
    this.classes = this.theme.addStyleSheet(this.styles);
    this.cd.detectChanges()
    /* this.cropper.clean() */
  }
   compareFormat(o1: AD_FORMAT, o2: AD_FORMAT): boolean {
    return o1.id === o2.id && o1.width === o2.width && o1.height === o2.height && o1.name === o2.name && o1.img === o2.img;
  }
  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
    //console.log(e);
    
  }
  showCardCropped: boolean = false
  crop() {
    this.cropper.crop()
    this.showCardCropped = true
    /* setTimeout(() => {
      let c = document.createElement("canvas");
    let ctx = c.getContext('2d');
    //THIS WON"T WORK!!

      let img1 = new Image();
      let self = this
    img1.onload = function () {
      c.width = self.selectedFormat.width;
      c.height = self.selectedFormat.height;
      ctx.drawImage(img1, 0, 0);
    }
    img1.src = this.croppedImage;
//continue canvas processing
  },500) */
  }
  hideCard() {
    this.showCardCropped = false
    this.cd.detectChanges()
  }
  urlDownload:string = "" 
  downloadImage() {
    var url = this.urlDownload.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
    window.open(url);
  }

  load(e: ImgCropperEvent) {
    //console.log(e)
    this.cropper.setScale(0)
    if (e.size < 150000) {
       /* let config = {
        scale: 0.745864772531767,
        position: {
          x: e.width,
          y: e.height
        }
       };
      this.cropper.setScale(config.scale, true);
          this.cropper.updatePosition(config.position.x, config.position.y); */
      
    } else {
      /* et config = {
        scale: 0.745864772531767,
        position: {
          x: e.width,
          y: e.height
        }
       };
      this.cropper.setScale(config.scale, true);
          this.cropper.updatePosition(config.position.x, config.position.y); */
      
      
          
    }this.cd.detectChanges()

  }

  ngOnInit() {
    
  }
  constructor(
    private theme: LyTheme2,
    private cd: ChangeDetectorRef
  ) { }



}
