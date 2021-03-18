import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AssetsService } from 'src/app/campaigns-management/services/assets.service';
import { Subject, Subscription } from 'rxjs';
import { DISPLAY_ADS_ASSETS, DISPLAY_ADS, AD_FORMAT, VALID_AD_FORMAT_YOUTUBE } from 'src/app/utils/data';

@Component({
  selector: 'adf-images-gallery',
  templateUrl: './images-gallery.component.html',
  styleUrls: ['./images-gallery.component.scss']
})
export class ImagesGalleryComponent implements OnInit, OnDestroy {

  constructor(private assetsService: AssetsService) { }

  ngOnInit(): void {
  }
  @Input() galleryFor: string = ''
  ngOnDestroy() {
    if (this.subscription !== undefined) {
      /* this.subscription.unsubscribe() */
      
    }
    this.assetsDisplay = []
  }
  youtubeFormat: AD_FORMAT[] = VALID_AD_FORMAT_YOUTUBE
  subscription: Subscription;
  assetsDisplay: DISPLAY_ADS_ASSETS[] = []
  showSpinnerSearch: boolean = true
  accountId: string = ""
  getListAssetsDisplay(accountId: string): Promise<string> {
    return new Promise(resolve => {
      this.showSpinnerSearch = true
      let account_Id: string = accountId
      if (this.galleryFor === 'DISPLAY') {
        this.assetsDisplay = []
        this.assetsService.getListImagesDisplay(account_Id).subscribe(image => {
          this.assetsDisplay =image
          this.showSpinnerSearch = false
          resolve('ok')
        })
        
      } else if (this.galleryFor === 'YOUTUBE') {
        this.assetsService.getListImagesDisplay(account_Id).subscribe(image => {
          let validImages: DISPLAY_ADS_ASSETS[] = []
          this.assetsDisplay = []
          image.filter((img, index, arr) => {
            VALID_AD_FORMAT_YOUTUBE.forEach((valid, i, array) => {
          
                if (img.width === valid.width && img.height === valid.height) {
                    this.assetsDisplay.push(img)
                }
                
              
            })
          })
    
          this.showSpinnerSearch = false
          resolve('ok')
        })
      }
      
    })
  }

  public currentTypeSelected: string = ""
  public selectedAssetsDisplay: DISPLAY_ADS[] = []
  deleteImage(asset: DISPLAY_ADS_ASSETS) {
    /* let displayAd: DISPLAY_ADS = { mediaId: asset.mediaId, mimeType: asset.mimeType, name: asset.name, referenceId: asset.referenceId, type: asset.type, urls: asset.urls, width: asset.width, height: asset.height } */
    this.assetsService.removeAsset(asset).then(deleting => {
      if (deleting === 'ok') {
        
      } else {
        alert('une erreur est survenue')
      }
    })
  }
  selectImage(asset: DISPLAY_ADS_ASSETS) {
    let displayAd: DISPLAY_ADS = { mediaId: asset.mediaId, mimeType: asset.mimeType, name: asset.name, referenceId: asset.referenceId, type: asset.type, urls: asset.urls, width: asset.width, height: asset.height }
    let assetsExist = this.selectedAssetsDisplay.some(data => data.name === asset.name)
    if (assetsExist) {
      this.selectedAssetsDisplay.forEach((result: DISPLAY_ADS_ASSETS, index, obj) => {
        if (result.name === asset.name) {
          this.selectedAssetsDisplay.splice(index, 1)
           document.getElementById(asset.name).classList.remove('active', 'pulse')
        }
      })
    } else {
      this.selectedAssetsDisplay.push(displayAd)
      document.getElementById(asset.name).classList.add('active', 'pulse')
    }

    
  }
  preselectImage(assets: DISPLAY_ADS[]) {
    this.selectedAssetsDisplay = []
    assets.forEach(asset => {
      let displayAd: DISPLAY_ADS = asset
      this.selectedAssetsDisplay.push(displayAd)
      document.getElementById(asset.name).classList.add('active', 'pulse')
    })

    
  }

}
