import { Component, OnInit, ViewChild, Input, EventEmitter, Output, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LyTheme2 } from '@alyle/ui';
import { AuthService } from 'src/app/auth/auth.service';
import { AssetsService } from 'src/app/campaigns-management/services/assets.service';
import { FileInfo, RemovingEventArgs, SuccessEventArgs, UploaderComponent, SelectedEventArgs } from '@syncfusion/ej2-angular-inputs';
import { PositionDataModel, OpenEventArgs, hideSpinner, createSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { AssetToUse, Assets, DISPLAY_ADS_ASSETS, NATIVE_ADS, CroppedAsset, NATIVE_ADS_IMAGES, ImageCropped, ImageBase64, CustomValidators, ASSET_TEXT, YOUTUBE_VIDEOS_INTERFACE, IMAGES_UPLOAD_AS_ASSET, NATIVE_ADS_BEFORE_UPLOAD, ASSETS_NATIVE, VIDEO_ASSET, NATIVE_ADS_TO_PUBLISH } from 'src/app/utils/data';
import { ToastAdafriComponent } from '../../toast/toast.component';
import { ChangeEventArgs, ChipListComponent } from '@syncfusion/ej2-angular-buttons';
import { createElement, detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TabComponent, SelectEventArgs, SelectingEventArgs } from '@syncfusion/ej2-angular-navigations';
import _ from 'lodash';
import { CropperRectangleDialogComponent } from '../../native-tools/cropper-rectangle-dialog/cropper-rectangle-dialog.component';
import { LyDialog } from '@alyle/ui/dialog';
import { CropperLogoDialogComponent } from '../../native-tools/cropper-logo-dialog/cropper-logo-dialog.component';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { MdePopoverTrigger, MdePopover } from '@material-extended/mde';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import  isURL from 'is-url'
import urlParser from "js-video-url-parser";
import { Subscription, Observable, Subject, timer } from 'rxjs';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { MatSelectionListChange } from '@angular/material/list';
import { takeUntil } from 'rxjs/operators';
import { ResponsiveDisplayPreviewSimulationComponent } from '../../native-tools/responsive-display-preview-simulation/responsive-display-preview-simulation.component';
import { MatMenuTrigger } from '@angular/material/menu';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { fromEvent } from 'rxjs';

const styles = ({
  carousel: {
    margin: 'auto',
    // responsive
    maxWidth: '210px',
    height: '110px',
    minHeight: '110px',
    maxHeight: '110px',
     marginLeft: '100px',
    marginTop:' 110px',
  },
   carouselRectangleFinal: {
     height: '110px',

  },
  carouselSquare: {
    margin: 'auto',
    // responsive
    maxWidth: '210px',
    height: '210px',
    minHeight: '210px',
    maxHeight: '210px',
     marginLeft: '100px',
    marginTop:' 110px',
  },
  carouselItem: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    flexDirection: 'column',
    padding: '1em 1em 48px',
    boxSizing: 'border-box',
    color: '#fff',
    '&:nth-child(3)': {
      color: '#2b2b2b'
    }
  }
});
@Component({
  selector: 'adf-cmp-native-ads-creator',
  templateUrl: './cmp-native-ads-creator.component.html',
  styleUrls: ['./cmp-native-ads-creator.component.scss']
})
export class CmpNativeAdsCreatorComponent implements OnInit, OnDestroy  {
  uid: string = ""
  items = [
    {
      title: 'Ordinateur',
      img: 'https://firebasestorage.googleapis.com/v0/b/alyle-ui.appspot.com/o/img%2F' +
      'Mountains-Blue.jpg?alt=media&token=d04f0279-79c6-4752-8b5a-cccd73720243'
    },
    {
      title: 'Ordinateur',
      img: 'assets/images/PCDevice.png'
    }
  ];
   @ViewChild('previewupload', { static: false }) uploadObj: UploaderComponent;
  @ViewChild('responiveDisplayAdDialog', { static: false }) responiveDisplayAdDialog: DialogComponent
  @ViewChild('selectVideosAdDialog', { static: false }) selectVideosAdDialog: DialogComponent
  @ViewChild(ResponsiveDisplayPreviewSimulationComponent, {static: false}) rdsSimulation: ResponsiveDisplayPreviewSimulationComponent
  @ViewChild('adConfirmDelete', { static: false }) adConfirmDelete: DialogComponent
  @ViewChild('titleChip', { static: false }) titleChip: ChipListComponent
  @ViewChild('descriptionChip', { static: false }) descriptionChip: ChipListComponent
  @ViewChild('tab', { static: false }) tabComponent: TabComponent
  @ViewChild('tabVideo', {static: false}) tabVideoComponent: TabComponent
  selected = 'option2';
  public brand : string = ""
  public dataFormatSelection: { [key: string]: Object }[] = [
        { Text: 'Image', img: 'assets/images/imageicon.svg' },
        { Text: 'Logo', img: 'assets/images/logo.svg' },
  ];
  public dataFormatSelectionYoutube: { [key: string]: Object }[] = [
        { Text: 'Image', img: 'assets/images/imageicon.svg' },
        
        ];
    // map the icon column to iconCSS field.
  public fields: Object = { text: 'Text', value: 'Text', img: 'img' };
    //set the placeholder to DropDownList input
  public text: string = 'Utiliser comme';
 @Input() adType: string = 'native-ads-cropper';
  public cropped?: string;
  public dropElement: HTMLElement;
  public filesName: string[] = [];
  public filesDetails : FileInfo[] = [];
  public filesList: HTMLElement[] = [];
  public uploadWrapper: HTMLElement;
  public parentElement: HTMLElement;
  public errorsUpload: any = []
  public adFormat:any[] = []
  public widthDisplay: number = 0
  public heightDisplay: number = 0
  public width: string = '50%';
  public isModal: boolean = true
  public target: HTMLElement = document.getElementById('body');
  public NUMBER_RECTANGLE_IMAGES: number = 0
  public NUMBER_SQUARE_IMAGES: number = 0
  public NUMBER_LOGO_RECTANGLE_IMAGES: number = 0
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  public NUMBER_LOGO_SQUARE_IMAGES: number = 0
  public desktopFormat: boolean = true
  public mobileFormat: boolean = false
  public allowExtensions: string = '.png, .jpg, .jpeg';
  public currentSelectedBlock = []
  public currentIconDeleteAssets = []

  public croppedRectangle?: string;
  public assetsFromCropper: AssetToUse[] = [];
  public assetsToUse: AssetToUse[] = [];
  public rectangleAssetChooseFromParent: Assets = {}
  public squareAssetChooseFromParent: Assets = {}
  public logoRectangleAssetChooseFromParent: Assets = {}
  public logoSquareAssetChooseFromParent: Assets = {}
  public imageForDesktopSelected: boolean = false
  public imageForMobileSelected: boolean = false
  public imageForLogoRectangleSelected: boolean = false
  public imageForLogoSquareSelected: boolean = false
  public disableButtonUseAssets: boolean = false
  public showSpinner: boolean = false
  public headerText: Object[] = [];
  public headerTextVideo: Object[] = [];
  public editMode: boolean = false
  public fromImage: boolean = false
  public fromImageWebsite: boolean = false
  DEFAULT_PREVIEW_RECT = "assets/images/simple-bg.png"
  DEFAULT_PREVIEW_SQR = "assets/images/simple-bg-1.png"
  preview_illustration: string = ""
  preview_illustration_logo: string = ""
  preview_background_color: any = ""
  preview_text_color: string = ""
  preview_160x600: string = ""
  @ViewChild('selectImageFromParent', {static: false}) dialogSelectImageFromParent: DialogComponent;
  @ViewChild('selectLogoFromParent', { static: false }) dialogSelectLogoFromParent: DialogComponent;
  @ViewChild(CropperRectangleDialogComponent, { static: false }) cropperImage: CropperRectangleDialogComponent;
  @ViewChild(CropperLogoDialogComponent, {static: false}) cropperLogo: CropperLogoDialogComponent;
  @ViewChild('selectYoutubeImageFromParent', { static: false }) dialogSelectYoutubeImageFromParent: DialogComponent;
  @ViewChild('toast', { static: true }) toast: ToastAdafriComponent;
  @ViewChild("popoverToggler", { static: false }) popover: MdePopoverTrigger;
  @ViewChild(MdePopover, { static: false }) popoverComponent: MdePopover;
  @ViewChild('dialogLoader', {static: false}) dialogLoader: DialogComponent;
  secondFormGroup: FormGroup
  constructor(private _formBuilder: FormBuilder, private http: HttpClient, private theme: LyTheme2, private authService: AuthService, private assetService: AssetsService,  private _dialog: LyDialog, private storageService: LocalStorageService, private sanitizer: DomSanitizer, private youtubeService: YoutubeService,) { }

  isSaving: boolean = false
  saving(saving: boolean){
    this.isSaving = saving
  }
  DOCUMENT = document
  imageList: ImageBase64[] = []
   async onFileChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      for(var i = 0; i < event.target.files.length; i++){
        try {
          let contentBuffer = await this.readFileAsync(event.target.files[i]);
        /*     var img = document.createElement("img");
          img.id = "image" + (i + 1);
          var self = this
            var reader = new FileReader();
             reader.onloadend =  function (){
              img.src = reader.result.toString();
                self.imageList.push({
                urls: img.src,
                width: img.width,
                height: img.height
              })
          }; */
           /*  reader.readAsDataURL(event.target.files[i]); */
            /* $("#image"+i).after(img);
       
          await this.changeCropperFile(0) */
        } catch(err) {
          //console.log(err);
        }
      }
    } else {
      //console.log('Selected at least one file');
    }
  }

  readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      let img = new Image()
      reader.readAsDataURL(file);
      reader.onload = () => {
        img.src = reader.result.toString();
        this.imageList.push({
                id: (new Date().getTime()+Math.floor(Math.random() * 1000000) + 1000).toString(),
                url: img.src,
                width: img.width,
                height: img.height,
                images: {
                  imageRect: {
                    urlString: '',
                    canvas: null,
                    box: null,
                    imageData: null
                  },
                  imageSqr: {
                     urlString: '',
                    canvas: null,
                    box: null,
                    imageData: null
                  }
                },
                usage: ''     
        })
        resolve(reader.result);
      };
       
              
      reader.onerror = reject;
    })
  }

  selectImageBase64Usage(item: ImageBase64, width: number, height: number) {
    this.editMode = false
    this.fromImage = true
    this.fromImageWebsite = false
    this.useAsImageBase64(item, width, height)
  }



  editImageBase64Usage(item: ImageBase64, width: number, height: number) {
    this.editMode = true
    this.fromImage = true
    this.fromImageWebsite = false
    this.editAsImageBase64(item, width, height)
  }
    editImageUsage(item: Assets, width: number, height: number) {
      this.editMode = true
      this.fromImage = false
      this.fromImageWebsite = false
    this.editAsImage(item, width, height)
  }
  

   selectImageUsage(item: Assets, width: number, height: number) {
     this.editMode = false
     this.fromImage = false
     this.fromImageWebsite = false
    this.useAsImage(item, width, height)
   }
  
   selectImageUsageFromWebsite(item: ImageBase64, width: number, height: number) {
     this.editMode = false
     this.fromImage = false
     this.fromImageWebsite = true
    this.useAsImageFromWebsite(item, width, height)
   }
  
  editImageUsageFromWebsite(item: ImageBase64, width: number, height: number) {
    this.editMode = true
    this.fromImage = false
    this.fromImageWebsite = true
    this.editAsImageFromWebsite(item, width, height)
  }

  

  saveCroppedOnRectangleDialog() {
    this.cropperImage.saveCropped().then(res_saved => {
      if (res_saved === 'ok') {
        
      }
    })
  }
  saveCroppedOnLogoDialog() {
    this.cropperLogo.saveCropped()
  }
  public currentLogoAsset: ASSETS_NATIVE = {}
  public generalBlock: boolean = true
  public cropperImageBlock: boolean = false
  public cropperLogoBlock: boolean = false
  public cropRect: boolean = true
  public cropSqr: boolean = true

  allProgressPercentage: number = 0

  allImagesLength() {
    let croppedImage_ImageRectLength = this.croppedImageList.filter(im => im.usage === 'image' && im.images.imageRect.urlString !== '').length
    let croppedImage_ImageSqrLength = this.croppedImageList.filter(im => im.usage === 'image' && im.images.imageSqr.urlString !== '').length
    let croppedImage_LogoRectLength = this.croppedImageList.filter(im => im.usage === 'logo' && im.images.imageRect.urlString !== '').length
    let croppedImage_LogoSqrLength = this.croppedImageList.filter(im => im.usage === 'logo' && im.images.imageSqr.urlString !== '').length
  
   
    let croppedImageFW_ImageRectLength = this.croppedImageFromWebsiteList.filter(im => im.usage === 'image' && im.images.imageRect.urlString !== '').length
    let croppedImageFW_ImageSqrLength = this.croppedImageFromWebsiteList.filter(im => im.usage === 'image' && im.images.imageSqr.urlString !== '').length
    let croppedImageFW_LogoRectLength = this.croppedImageFromWebsiteList.filter(im => im.usage === 'logo' && im.images.imageRect.urlString !== '').length
    let croppedImageFW_LogoSqrLength = this.croppedImageFromWebsiteList.filter(im => im.usage === 'logo' && im.images.imageSqr.urlString !== '').length

     let croppedImageAS_ImageRectLength = this.croppedAssetList.filter(im => im.usage === 'image' && im.images.imageRect.urlString !== '').length
    let croppedImageAS_ImageSqrLength = this.croppedAssetList.filter(im => im.usage === 'image' && im.images.imageSqr.urlString !== '').length
    let croppedImageAS_LogoRectLength = this.croppedAssetList.filter(im => im.usage === 'logo' && im.images.imageRect.urlString !== '').length
    let croppedImageAS_LogoSqrLength = this.croppedAssetList.filter(im => im.usage === 'logo' && im.images.imageSqr.urlString !== '').length

    
    return croppedImage_ImageRectLength + croppedImage_ImageSqrLength + croppedImage_LogoRectLength + croppedImage_LogoSqrLength + croppedImageFW_ImageRectLength + croppedImageFW_ImageSqrLength + croppedImageFW_LogoRectLength + croppedImageFW_LogoSqrLength +
    croppedImageAS_ImageRectLength + croppedImageAS_ImageSqrLength + croppedImageAS_LogoRectLength + croppedImageAS_LogoSqrLength
  }

   onlyImagesLength() {
    let croppedImage_ImageRectLength = this.croppedImageList.filter(im => im.usage === 'image' && im.images.imageRect.urlString !== '').length
     let croppedImage_ImageSqrLength = this.croppedImageList.filter(im => im.usage === 'image' && im.images.imageSqr.urlString !== '').length
     
    let croppedImageFW_ImageRectLength = this.croppedImageFromWebsiteList.filter(im => im.usage === 'image' && im.images.imageRect.urlString !== '').length
    let croppedImageFW_ImageSqrLength = this.croppedImageFromWebsiteList.filter(im => im.usage === 'image' && im.images.imageSqr.urlString !== '').length
   

     let croppedImageAS_ImageRectLength = this.croppedAssetList.filter(im => im.usage === 'image' && im.images.imageRect.urlString !== '').length
    let croppedImageAS_ImageSqrLength = this.croppedAssetList.filter(im => im.usage === 'image' && im.images.imageSqr.urlString !== '').length

    
     return croppedImage_ImageRectLength + croppedImage_ImageSqrLength + croppedImageFW_ImageRectLength + croppedImageFW_ImageSqrLength + croppedImageAS_ImageRectLength + croppedImageAS_ImageSqrLength
  }
   onlyLogosLength() {
    let croppedImage_LogoRectLength = this.croppedImageList.filter(im => im.usage === 'logo' && im.images.imageRect.urlString !== '').length
     let croppedImage_LogoSqrLength = this.croppedImageList.filter(im => im.usage === 'logo' && im.images.imageSqr.urlString !== '').length
    
    let croppedImageFW_LogoRectLength = this.croppedImageFromWebsiteList.filter(im => im.usage === 'logo' && im.images.imageRect.urlString !== '').length
    let croppedImageFW_LogoSqrLength = this.croppedImageFromWebsiteList.filter(im => im.usage === 'logo' && im.images.imageSqr.urlString !== '').length


    let croppedImageAS_LogoRectLength = this.croppedAssetList.filter(im => im.usage === 'logo' && im.images.imageRect.urlString !== '').length
     let croppedImageAS_LogoSqrLength = this.croppedAssetList.filter(im => im.usage === 'logo' && im.images.imageSqr.urlString !== '').length
     return croppedImage_LogoRectLength + croppedImage_LogoSqrLength +  croppedImageFW_LogoRectLength + croppedImageFW_LogoSqrLength + croppedImageAS_LogoRectLength + croppedImageAS_LogoSqrLength
  }
  saveRectangleImage() {
    if (this.editMode) {
      this.cropperImage.saveRectangleImageEdit().then(saved => {
         //console.log(saved)
      if (saved !== undefined && saved !==null) {
        //console.log(saved)
        if (this.fromImage) {
          this.croppedImageList.forEach((image, index, arr) => {
          if (image.id === saved.id) {
            this.croppedImageList.splice(index,1)
          }
        })
        this.croppedImageList.push(saved)
        }else if (this.fromImageWebsite) {
          this.croppedImageFromWebsiteList.forEach((image, index, arr) => {
          if (image.id === saved.id) {
            this.croppedImageFromWebsiteList.splice(index,1)
          }
        })
        this.croppedImageFromWebsiteList.push(saved)
        } else {
          this.croppedAssetList.forEach((image, index, arr) => {
          if (image.id === saved.id) {
            this.croppedAssetList.splice(index,1)
          }
        })
        this.croppedAssetList.push(saved)
        }
        this.cropRect = true
        this.cropSqr = false
        this.allElements = this.onlyImagesLength() + this.onlyLogosLength()  
        this.headerText = [
        { 'text': 'IMPORTER' },
        { 'text': 'FICHIERS RECENTS' },
        { 'text': 'RECHERCHER DEPUIS VOTRE SITE WEB' },
  
         { 'text': 'VOS ELEMENTS (' +this.allElements +')' },
       /*  { 'text': 'Rechercher sur un site' }, */
        ];
        this.headerTextVideo = [
        { 'text': 'RECHERCHER SUR YOUTUBE' },
        { 'text': 'FICHIERS RECENTS' },
         { 'text': 'Vos éléments (' +this.allElementsVideo +')' },
       /*  { 'text': 'Rechercher sur un site' }, */
      ];
        
         this.toggleGeneralBlock()
      } else {
       
      }
    })
    } else {
       this.cropperImage.saveRectangleImage().then(saved => {
      if (saved !==undefined && saved !== null) {
        //console.log(saved)
        if (this.fromImage) {
          this.croppedImageList.push(saved)
         this.toggleGeneralBlock()
        }else if (this.fromImageWebsite) {
          this.croppedImageFromWebsiteList.push(saved)
         this.toggleGeneralBlock()
        } else {
          this.croppedAssetList.push(saved)
         this.toggleGeneralBlock()
        }
        this.cropRect = true
        this.cropSqr = false
         this.allElements = this.onlyImagesLength() + this.onlyLogosLength()  
        this.headerText = [
        { 'text': 'Importer' },
        { 'text': 'Fichiers récents' },
        { 'text': 'Rechercher depuis votre site' },
 
         { 'text': 'Vos éléments (' +this.allElements +')' },
       /*  { 'text': 'Rechercher sur un site' }, */
      ];
        
      } else {
        //console.log('no image')
      }
    })
    }
   
  }

  croppedImageList: ImageBase64[] = []
  croppedImageFromWebsiteList: ImageBase64[] = []
  croppedAssetList: ImageBase64[] = []

  finalCroppedImageList: ImageBase64[] = []
  finalCroppedImageFromWebsiteList: ImageBase64[] = []
  finalCroppedAssetList: ImageBase64[] = []

  saveSquareImage() {
    
     if (this.editMode) {
       this.cropperImage.saveSquareImageEdit().then(saved => {
      if (saved !== undefined && saved !==null) {
        //console.log(saved)
        if (this.fromImage) {
          this.croppedImageList.forEach((image, index, arr) => {
          if (image.id === saved.id) {
            this.croppedImageList.splice(index,1)
          }
        })
          this.croppedImageList.push(saved)
          this.toggleGeneralBlock()
        }else if (this.fromImageWebsite) {
          this.croppedImageFromWebsiteList.forEach((image, index, arr) => {
          if (image.id === saved.id) {
            this.croppedImageFromWebsiteList.splice(index,1)
          }
        })
        this.croppedImageFromWebsiteList.push(saved)
        this.toggleGeneralBlock()
        } else {
          this.croppedAssetList.forEach((image, index, arr) => {
          if (image.id === saved.id) {
            this.croppedAssetList.splice(index,1)
          }
        })
          this.croppedAssetList.push(saved)
          this.toggleGeneralBlock()
        }
         this.allElements = this.onlyImagesLength() + this.onlyLogosLength()  
        this.headerText = [
        { 'text': 'Importer' },
        { 'text': 'Fichiers récents' },
        { 'text': 'Rechercher depuis votre site' },
        
         { 'text': 'Vos éléments (' +this.allElements +')' },
       /*  { 'text': 'Rechercher sur un site' }, */
      ];
      } else {
     
      }
    })
    } else {
       this.cropperImage.saveSquareImage().then(saved => {
      if (saved !==null && saved !== undefined) {
        //console.log(saved)
        if (this.fromImage) {
          this.croppedImageList.push(saved)
          this.toggleGeneralBlock()
         
          
        }else if (this.fromImageWebsite) {
          this.croppedImageFromWebsiteList.push(saved)
          this.toggleGeneralBlock()
          
        } else {
          this.croppedAssetList.push(saved)
          this.toggleGeneralBlock()
        }
        this.cropRect = true
        this.cropSqr = false
         this.allElements = this.onlyImagesLength() + this.onlyLogosLength()  
        this.headerText = [
        { 'text': 'Importer' },
        { 'text': 'Fichiers récents' },
        { 'text': 'Rechercher depuis votre site' },
        
         { 'text': 'Vos éléments (' +this.allElements +')' },
       /*  { 'text': 'Rechercher sur un site' }, */
      ];
      } else {
        //console.log('no image')
      }
    })
    }
   
  }

  saveRectangleAndSquareImage() {
     if (this.editMode) {
       this.cropperImage.saveRectangleAndSquareImageEdit().then(saved => {
      if (saved !== undefined && saved!==null) {
        //console.log(saved)
if (this.fromImage) {
          this.croppedImageList.forEach((image, index, arr) => {
          if (image.id === saved.id) {
            this.croppedImageList.splice(index, 1)
            this.toggleGeneralBlock()
          }
        })
        this.croppedImageList.push(saved)
        }else if (this.fromImageWebsite) {
          this.croppedImageFromWebsiteList.forEach((image, index, arr) => {
          if (image.id === saved.id) {
            this.croppedImageFromWebsiteList.splice(index, 1)
            this.toggleGeneralBlock()
          }
        })
        this.croppedImageFromWebsiteList.push(saved)
        } else {
          this.croppedAssetList.forEach((image, index, arr) => {
          if (image.id === saved.id) {
            this.croppedAssetList.splice(index,1)
            this.toggleGeneralBlock()
          }
        })
        this.croppedAssetList.push(saved)
        }
          this.cropRect = true
        this.cropSqr = false
         this.allElements = this.onlyImagesLength() + this.onlyLogosLength()  
        this.headerText = [
        { 'text': 'Importer' },
        { 'text': 'Fichiers récents' },
        { 'text': 'Rechercher depuis votre site' },
        
         { 'text': 'Vos éléments (' +this.allElements +')' },
       /*  { 'text': 'Rechercher sur un site' }, */
      ];
        
      
      } else {
        
      }
    })
    } else {
      this.cropperImage.saveRectangleImage().then(savedRect => {
      if (savedRect !== undefined && savedRect !== null) {
        //console.log(savedRect)
        this.cropperImage.saveSquareImage().then(saved => {
      if (saved !== undefined && saved !== null) {
        //console.log(saved)
        if (this.fromImage) {
          this.croppedImageList.push(saved)
           this.toggleGeneralBlock()
          
        }else if (this.fromImageWebsite) {
          this.croppedImageFromWebsiteList.push(saved)
           this.toggleGeneralBlock()
          
        }else{
          this.croppedAssetList.push(saved)
           this.toggleGeneralBlock()
        }
        this.cropRect = true
        this.cropSqr = false
         this.allElements = this.onlyImagesLength() + this.onlyLogosLength()  
        this.headerText = [
        { 'text': 'Importer' },
        { 'text': 'Fichiers récents' },
        { 'text': 'Rechercher depuis votre site' },
        
         { 'text': 'Vos éléments (' +this.allElements +')' },
       /*  { 'text': 'Rechercher sur un site' }, */
      ];
       
      } else {
        //console.log('no image Square')
      }
    })
      } else {
        //console.log('no image')
      }
    }) 
    }
   
  }

  safeUrl(dataBase64: string) {
    var srcData: SafeResourceUrl;
    srcData = this.sanitizer.bypassSecurityTrustResourceUrl(dataBase64);
    return srcData
  }
  selectionStateRect(selected: boolean) {
    this.cropRect = selected
  }
  selectionStateSqr(selected: boolean) {
    this.cropSqr = selected
  }

  getAverageRGB(id: string) {
    var imgEl: any = document.getElementById(id)
    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;
        
    if (!context) {
      return { background: defaultRGB, text: 'black' };
    }
    
    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
    
    context.drawImage(imgEl, 0, 0);
    
    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */;
        return { background: defaultRGB, text: 'black' };
    }
    
    length = data.data.length;
    
    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }
    
    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);
      var o = Math.round(((rgb.r * 299) + (rgb.g* 587) + (rgb.b * 114)) /1000);
    if (o > 125) {
      return {background: `rgba(${rgb.r},${rgb.g},${rgb.b},1)`, text: 'black'}
    }else{ 
       return {background: `rgba(${rgb.r},${rgb.g},${rgb.b},1)`, text: 'white'}
    }    
  }
  
   getAverageRGBVideo(src: string) {
     var imgEl: any = new Image()
     imgEl.src= src
    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;
        
    if (!context) {
      return { background: defaultRGB, text: 'black' };
    }
    
    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
    
    context.drawImage(imgEl, 0, 0);
    
    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */;
        return { background: defaultRGB, text: 'black' };
    }
    
    length = data.data.length;
    
    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }
    
    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);
      var o = Math.round(((rgb.r * 299) + (rgb.g* 587) + (rgb.b * 114)) /1000);
    if (o > 125) {
      return {background: `rgba(${rgb.r},${rgb.g},${rgb.b},1)`, text: 'black'}
    }else{ 
       return {background: `rgba(${rgb.r},${rgb.g},${rgb.b},1)`, text: 'white'}
    }    
}
  toggleCropperImageBlock(asset: ASSETS_NATIVE, width: number, height: number){
    this.generalBlock = false
    this.cropperLogoBlock = false
    this.cropperImageBlock = true
    setTimeout(() => {
      let imageBase64: ImageBase64 = {
        id: asset.id,
        url: asset.imageUrl,
        width: asset.width,
        height: asset.height,
        images: {
         imageRect: {
          urlString: '',
          canvas: null,
            box: null,
          imageData: null
          },
          imageSqr: {
          urlString: '',
          canvas: null,
            box: null,
          imageData: null
        }
        },
        usage: '',
        
      }
      this.cropperImage.fromAssets = false
      this.cropperImage.fromImageBase64 = true
      this.cropperImage.imageBase64 = imageBase64
      this.cropperImage.mode = "standard"
      this.cropperImage.toggleInitialElements()
    },1000)
  }

  toggleCropperImageFromWebsiteBlock(asset: ImageBase64, width: number, height: number){
    this.generalBlock = false
    this.cropperLogoBlock = false
    this.cropperImageBlock = true
    setTimeout(() => {
      let imageBase64: ImageBase64 = {
        id: asset.id,
        url: asset.url,
        width: width,
        height: height,
        images: {
         imageRect: {
          urlString: '',
          canvas: null,
            box: null,
           imageData: null
          },
          imageSqr: {
          urlString: '',
          canvas: null,
            box: null,
          imageData: null
        }
        },
        usage: '',
        
      }
      this.cropperImage.fromAssets = false
      this.cropperImage.fromImageBase64 = true
      this.cropperImage.imageBase64 = imageBase64
      this.cropperImage.mode = "standard"
      this.cropperImage.toggleInitialElements()
    },1000)
  }

  toggleCropperImageBase64Block(item: ImageBase64, width: number, height: number) {
    item.width = width
    item.height = height
    this.generalBlock = false
    this.cropperLogoBlock = false
    this.cropperImageBlock = true
    setTimeout(() => {
      this.cropperImage.fromAssets = false
      this.cropperImage.fromImageBase64 = true
      this.cropperImage.imageBase64 = item
      this.cropperImage.mode = "standard"
      this.cropperImage.toggleInitialElements()
    },1000)
  }

  toggleCropperImageBase64BlocEdit(item: ImageBase64, width: number, height: number) {
    let image64: ImageBase64 = this.croppedImageList.find(image=>image.id===item.id) 
    item.width = width
    item.height = height
    this.generalBlock = false
    this.cropperLogoBlock = false
    this.cropperImageBlock = true
    setTimeout(() => {
      this.cropperImage.fromAssets = false
      this.cropperImage.fromImageBase64 = true
      this.cropperImage.imageBase64 = image64
      this.cropperImage.mode = "edit"
      this.cropperImage.toggleInitialElementsEdit()
    },1000)
  }

  toggleCropperImageBlocEdit(asset: ASSETS_NATIVE, width: number, height: number) {
    //console.log(asset)
    
    let image64: ImageBase64 = this.croppedAssetList.find(image=>image.id===asset.id)
     let imageBase64: ImageBase64 = {
        id: asset.id,
        url: image64.url,
        width: asset.width,
        height: asset.height,
        images: image64.images,
        usage: image64.usage,
        
      }
    this.generalBlock = false
    this.cropperLogoBlock = false
    this.cropperImageBlock = true
    setTimeout(() => {
      this.cropperImage.fromAssets = false
      this.cropperImage.fromImageBase64 = true
      this.cropperImage.imageBase64 = imageBase64
      this.cropperImage.mode = "edit"
      this.cropperImage.toggleInitialElementsEdit()
    },1000)
  }

  toggleCropperImageFromWebsiteBlocEdit(asset: ImageBase64, width: number, height: number) {
    let image64: ImageBase64 = this.croppedImageFromWebsiteList.find(image=>image.id===asset.id) 
     let imageBase64: ImageBase64 = {
        id: asset.id,
        url: asset.url,
        width: image64.width,
        height: image64.height,
        images: image64.images,
        usage: image64.usage,
        
      }
    this.generalBlock = false
    this.cropperLogoBlock = false
    this.cropperImageBlock = true
    setTimeout(() => {
      this.cropperImage.fromAssets = false
      this.cropperImage.fromImageBase64 = true
      this.cropperImage.imageBase64 = imageBase64
      this.cropperImage.mode = "edit"
      this.cropperImage.toggleInitialElementsEdit()
    },1000)
  }
  toggleCropperLogoBlock(asset: ASSETS_NATIVE){
    this.generalBlock = false
    this.cropperImageBlock = false
    this.cropperLogoBlock = true
  }
  toggleGeneralBlock(){
    this.cropperLogoBlock = false
    this.cropperImageBlock = false
    this.generalBlock = true
  }

 
  checkTextToDisplay(id) {
    let exist = this.croppedImageList.some(image => image.id === id && image.usage === 'image')
    let existLogo = this.croppedImageList.some(image => image.id === id && image.usage==='logo')
    if (exist) {
      let imageRectSelect = this.croppedImageList.some(image => image.id === id && image.images.imageRect.urlString !== '' && image.usage==='image')
      let imageSqrSelect = this.croppedImageList.some(image => image.id === id && image.images.imageSqr.urlString !== '' && image.usage==='image')
      if (imageRectSelect && imageSqrSelect) {
        return 'Image (2 formats sélectionnés)';
      }else if (imageRectSelect && !imageSqrSelect) {
        return 'Image (1 format sélectionné)';
      }else if (!imageRectSelect && imageSqrSelect) {
        return 'Image (1 format sélectionné)';
      }if (!imageRectSelect && !imageSqrSelect) {
        return 'Image (Aucun format sélectionné)';
      }
    } else {
      if (existLogo) {
      let imageRectSelect = this.croppedImageList.some(image => image.id === id && image.images.imageRect.urlString !== '' && image.usage==='logo')
      let imageSqrSelect = this.croppedImageList.some(image => image.id === id && image.images.imageSqr.urlString !== '' && image.usage==='logo')
      if (imageRectSelect && imageSqrSelect) {
        return 'Logo (2 formats sélectionnés)';
      }else if (imageRectSelect && !imageSqrSelect) {
        return 'Logo (1 format sélectionné)';
      }else if (!imageRectSelect && imageSqrSelect) {
        return 'Logo (1 format sélectionné)';
      }if (!imageRectSelect && !imageSqrSelect) {
        return 'Logo (Aucun format sélectionné)';
      }
    } else {
      return "Utiliser l'image";
      
    }
      
    }
  }

  checkTextAssetToDisplay(id) {
    let exist = this.croppedAssetList.some(image => image.id === id && image.usage==='image')
    let existLogo = this.croppedAssetList.some(image => image.id === id && image.usage==='logo')
    if (exist) {
      let imageRectSelect = this.croppedAssetList.some(image => image.id === id && image.images.imageRect.urlString !== '' && image.usage==='image')
      let imageSqrSelect = this.croppedAssetList.some(image => image.id === id && image.images.imageSqr.urlString !== '' && image.usage==='image')
      if (imageRectSelect && imageSqrSelect) {
        return 'Image (2 formats sélectionnés)';
      }else if (imageRectSelect && !imageSqrSelect) {
        return 'Image (1 format sélectionné)';
      }else if (!imageRectSelect && imageSqrSelect) {
        return 'Image (1 format sélectionné)';
      }if (!imageRectSelect && !imageSqrSelect) {
        return 'Image (Aucun format sélectionné)';
      }
    } else {
      if (existLogo) {
      let imageRectSelect = this.croppedAssetList.some(image => image.id === id && image.images.imageRect.urlString !== '' && image.usage==='logo')
      let imageSqrSelect = this.croppedAssetList.some(image => image.id === id && image.images.imageSqr.urlString !== '' && image.usage==='logo')
      if (imageRectSelect && imageSqrSelect) {
        return 'Logo (2 formats sélectionnés)';
      }else if (imageRectSelect && !imageSqrSelect) {
        return 'Logo (1 format sélectionné)';
      }else if (!imageRectSelect && imageSqrSelect) {
        return 'Logo (1 format sélectionné)';
      }if (!imageRectSelect && !imageSqrSelect) {
        return 'Logo (Aucun format sélectionné)';
      }
    } else {
      return "Utiliser l'image";
      
    }
      
    }
  }

  checkTextToDisplayFromWebsite(id) {
    let exist = this.croppedImageFromWebsiteList.some(image => image.id === id && image.usage==='image')
    let existLogo = this.croppedImageFromWebsiteList.some(image => image.id === id && image.usage === 'logo')
    if (exist) {
      let imageRectSelect = this.croppedImageFromWebsiteList.some(image => image.id === id && image.images.imageRect.urlString !== '' && image.usage==='image')
      let imageSqrSelect = this.croppedImageFromWebsiteList.some(image => image.id === id && image.images.imageSqr.urlString !== '' && image.usage==='image')
      if (imageRectSelect && imageSqrSelect) {
        return 'Image (2 formats sélectionnés)';
      } else if (imageRectSelect && !imageSqrSelect) {
        return 'Image (1 format sélectionné)';
      } else if (!imageRectSelect && imageSqrSelect) {
        return 'Image (1 format sélectionné)';
      } if (!imageRectSelect && !imageSqrSelect) {
        return 'Image (Aucun format sélectionné)';
      }
    } else {
      if (existLogo) {
      let imageRectSelect = this.croppedImageFromWebsiteList.some(image => image.id === id && image.images.imageRect.urlString !== '' && image.usage==='logo')
      let imageSqrSelect = this.croppedImageFromWebsiteList.some(image => image.id === id && image.images.imageSqr.urlString !== '' && image.usage==='logo')
      if (imageRectSelect && imageSqrSelect) {
        return 'Logo (2 formats sélectionnés)';
      } else if (imageRectSelect && !imageSqrSelect) {
        return 'Logo (1 format sélectionné)';
      } else if (!imageRectSelect && imageSqrSelect) {
        return 'Logo (1 format sélectionné)';
      } if (!imageRectSelect && !imageSqrSelect) {
        return 'Logo (Aucun format sélectionné)';
      }
    } else {
      return "Utiliser l'image";
      
    }
      
    }
  }

  checkExistVideoFromSearch(videoId) {
    
    let exist = this.videosSelectedFromSearch.some(video => video.videoId === videoId)
    return exist
  }

  checkExistVideoFromRecent(videoId) {
    
    let exist = this.videosSelectedFromRecent.some(video => video.videoId === videoId)
    return exist
  }
   checkExist(id) {
    let exist = this.croppedImageList.some(image => image.id === id)
    return exist
   }
  checkExistAsset(id) {
    let exist = this.croppedAssetList.some(image => image.id === id)
    return exist
     }
     checkExistFromWebsite(id) {
    let exist = this.croppedImageFromWebsiteList.some(image => image.id === id)
    return exist
  }
  
  public currentNativeAd: NATIVE_ADS_IMAGES[] = [];

  

  detectAssetAdded(asset: ASSETS_NATIVE) {
    document.getElementById(asset.assetId.toString()).classList.add('outline', 'selected')
        this.currentSelectedBlock.push(asset.assetId.toString())
        let icon = createElement('i', { className: 'fas fa-times-circle position-absolute' })
        this.currentIconDeleteAssets.push({
          id: asset.id.toString(),
          icon: icon
        })
        icon.style.right = '5px'
        icon.style.top = '5px'
        icon.style.cursor = 'pointer'
        icon.onclick = () => {
        this.assetsFromCropper.some((_asset, index, array) => {
          if (_asset.id === asset.assetId && _asset.data.usedForRectangle) {

              this.assetsFromCropper.splice(index, 1)
              this.assetsToUse = this.assetsFromCropper
              this.currentSelectedBlock.splice(this.currentSelectedBlock.indexOf(asset.assetId.toString()), 1)
              this.currentIconDeleteAssets.splice(this.currentIconDeleteAssets.indexOf(asset.id.toString()),1)
              document.getElementById(asset.assetId.toString()).classList.remove('outline', 'selected')
            document.getElementById(asset.id.toString()).removeChild(icon)
            if (this.adType === 'native-ads-cropper') {
              this.checkIfImageNotRequired()
              
            } else {
              if (!document.querySelector('.gallery-container').classList.contains('error-image')) {
          document.querySelector('.gallery-container').classList.add('error-image')
         this.errorImageRectangle = 'Aucune image' 
        }
            }
          } 
        })
          this.assetsFromCropper.some((_asset, index, array) => {
          if (_asset.id === asset.assetId && _asset.data.usedForSquare) {

              this.assetsFromCropper.splice(index, 1)
              this.assetsToUse = this.assetsFromCropper
              this.currentSelectedBlock.splice(this.currentSelectedBlock.indexOf(asset.assetId.toString()), 1)
              this.currentIconDeleteAssets.splice(this.currentIconDeleteAssets.indexOf(asset.id.toString()),1)
              document.getElementById(asset.assetId.toString()).classList.remove('outline', 'selected')
              document.getElementById(asset.id.toString()).removeChild(icon)
              if (this.adType === 'native-ads-cropper') {
              this.checkIfImageNotRequired()
              
            } else {
              if (!document.querySelector('.gallery-container').classList.contains('error-image')) {
          document.querySelector('.gallery-container').classList.add('error-image')
         this.errorImageRectangle = 'Aucune image' 
        }
            }
          } 
          })
          this.assetsFromCropper.some((_asset, index, array) => {
          if (_asset.id === asset.assetId && _asset.data.usedForLogo) {

              this.assetsFromCropper.splice(index, 1)
              this.assetsToUse = this.assetsFromCropper
              this.currentSelectedBlock.splice(this.currentSelectedBlock.indexOf(asset.assetId.toString()), 1)
              this.currentIconDeleteAssets.splice(this.currentIconDeleteAssets.indexOf(asset.id.toString()),1)
              document.getElementById(asset.assetId.toString()).classList.remove('outline', 'selected')
              document.getElementById(asset.id.toString()).removeChild(icon)
               if (this.adType === 'native-ads-cropper') {
              this.checkIfImageNotRequired()
              
            } else {
              if (!document.querySelector('.gallery-container').classList.contains('error-image')) {
          document.querySelector('.gallery-container').classList.add('error-image')
         this.errorImageRectangle = 'Aucune image' 
        }
            }
          } 
          })
    }
    if (this.adType === 'native-ad-cropper') {
      this.getAssets()
    } else if(this.adType==='youtube-ad-cropper'){
      this.getAssetsYoutube()
    }
      document.getElementById(asset.id.toString()).appendChild(icon)
  }

  detectUploadSuccess(mediaIdList: any) {
    this.tabComponent.select(1)
      this.getAssets()

  }
    public tabSelected(e: SelectEventArgs): void {
   this.tabComponent.selecting
        if (e.isSwiped) {
            e.cancel = true;
        }
    }
  
  selecting(e: SelectingEventArgs) {
      ////console.log(e)
  
    if (e.selectedIndex === 1) {
   
    this.getAssets()
      setTimeout(() => {
 
    var lazyloadImages = document.querySelectorAll("img");    
  var lazyloadThrottleTimeout;
  
  var lazyload = ()=> {
    if(lazyloadThrottleTimeout) {
      clearTimeout(lazyloadThrottleTimeout);
    }    
    
    lazyloadThrottleTimeout = setTimeout(function() {
      var scrollTop = window.pageYOffset;
      //console.log(lazyloadImages)
        lazyloadImages.forEach(function(img) {
            /* if(img.offsetTop < (window.innerHeight + scrollTop)) { */
              img.src = img.dataset.src;
              /* img.classList.remove('lazy'); */
            /* } */
        });
        if(lazyloadImages.length == 0) { 
          document.removeEventListener("scroll", lazyload);
          window.removeEventListener("resize", lazyload);
          window.removeEventListener("orientationChange", lazyload);
        }
    }, 20);
  }
  
  document.addEventListener("scroll", lazyload);
  window.addEventListener("resize", lazyload);
  window.addEventListener("orientationChange", lazyload);


    },500)
     
     
         /*  this.getAssetsYoutube() */
    }
  }
  useAsImageBase64(item: ImageBase64, width: number, height: number) {
    this.toggleCropperImageBase64Block(item, width, height)
  }
  editAsImageBase64(item: ImageBase64, width: number, height: number) {
    this.toggleCropperImageBase64BlocEdit(item, width, height)
  }
  editAsImage(item: Assets, width: number, height: number) {
    this.toggleCropperImageBlocEdit(item, width, height)
  }
  useAsImage(asset: ASSETS_NATIVE, width: number, height: number) {
   this.toggleCropperImageBlock(asset, width, height)
  }

  useAsImageFromWebsite(asset: ImageBase64, width: number, height: number) {
   this.toggleCropperImageFromWebsiteBlock(asset, width, height)
  }

  editAsImageFromWebsite(item: ImageBase64, width: number, height: number) {
    this.toggleCropperImageFromWebsiteBlocEdit(item, width, height)
  }

    reponsiveDiplayOpen(args: OpenEventArgs) {
    
  setTimeout(() => {
    /* this.uploadObj.buttons.browse = 'Sélectionner les fichiers à importer'
        
    this.dropElement = document.getElementsByClassName('control-section-1')[0] as HTMLElement;
    if (Browser.isDevice) { document.getElementById('dropimage').style.padding = '0px 10%'; } */
  }, 1000)
    }
  public visible: boolean  = false
  public allElements: number = 0
  public allElementsVideo: number = 0
  uid_action: string = ''
  aacid: string = ''
  subscriptionPreview: Subscription;
  ngOnInit(){
   
    
     this.secondFormGroup = this._formBuilder.group({
      title: ["", Validators.nullValidator],
      description: ["", Validators.nullValidator],
      brand: ["", Validators.required],
     });
      this.headerText = [
        { 'text': 'Importer' },
        { 'text': 'Fichiers récents' },
        { 'text': 'Rechercher depuis votre site' },
       
         { 'text': 'Vos éléments (' +this.allElements +')' },
       /*  { 'text': 'Rechercher sur un site' }, */
    ];
    this.headerTextVideo = [
        { 'text': 'RECHERCHER SUR YOUTUBE' },
        { 'text': 'FICHIERS RECENTS' },
         { 'text': 'Vos éléments (' +this.allElementsVideo +')' },
       /*  { 'text': 'Rechercher sur un site' }, */
      ];
    this.storageService.getUserIdAndAccountId().then(response => {
      if (response !== null) { 
        this.uid = response.account.owner
        this.aacid = response.account.id
        this.getAssets()
        this.getRecentVideosAssets()
        /*this.subscriptionPreview =  this.everyFiveSecondsRefreshPreviewModel.subscribe(number => {
          console.log(number) */
          
        /* }) */
        
      }})
  }

  

  

  toggleFormatDesktop() {
    this.desktopFormat = true
    this.mobileFormat = false
  }
    toggleFormatMobile() {
    this.desktopFormat = false
    this.mobileFormat = true
  }
 
  triggerImageForDesktop(event: ChangeEventArgs) {
    this.imageForDesktopSelected = event.checked
    if (this.imageForDesktopSelected) {
      this.disableButtonUseAssets = false
    } else {
      if (!this.imageForMobileSelected) {
        this.disableButtonUseAssets = true
        
      } else {
        this.disableButtonUseAssets = false
      }
    }
  }
   triggerImageForMobile(event: ChangeEventArgs) {
    this.imageForMobileSelected = event.checked
    if (this.imageForMobileSelected) {
      this.disableButtonUseAssets = false
    } else {
      if (!this.imageForDesktopSelected) {
        this.disableButtonUseAssets = true
        
      } else {
        this.disableButtonUseAssets = false
      }
    }
  }

  triggerImageForLogoRectangle(event: ChangeEventArgs) {
    this.imageForLogoRectangleSelected = event.checked
    if (this.imageForLogoRectangleSelected) {
      this.disableButtonUseAssets = false
    } else {
      if (!this.imageForLogoSquareSelected) {
        this.disableButtonUseAssets = true
        
      } else {
        this.disableButtonUseAssets = false
      }
    }
  }

    triggerImageForLogoSquareRectangle(event: ChangeEventArgs) {
    this.imageForLogoRectangleSelected = event.checked
    if (this.imageForLogoRectangleSelected) {
      this.disableButtonUseAssets = false
    } else {
      if (!this.imageForLogoSquareSelected) {
        this.disableButtonUseAssets = true
        
      } else {
        this.disableButtonUseAssets = false
      }
    }
  }

  public currentAsset: ASSETS_NATIVE;
 


  
 
  
  public getAssetsRectangle(asset: ASSETS_NATIVE): Promise<Assets>{
    return new Promise(resolve => {
      this.assetService.getAssetsRectangleWithParentId(this.uid, asset.assetId).then(myAssetRectangle => {
        if (myAssetRectangle.length > 0) {
          resolve(myAssetRectangle[0])
          
        } else {
          resolve(null)
        }
      
    })
    })
  }
   public getAssetsSquare(asset: ASSETS_NATIVE): Promise<Assets>{
    return new Promise(resolve => {
      this.assetService.getAssetsSquareWithParentId(this.uid, asset.assetId).then(myAssetSquare => {
        if (myAssetSquare.length > 0) {
          resolve(myAssetSquare[0])
          
        } else {
          resolve(null)
        }
      
    })
    })
  }

    public getAssetsRectangleYoutube(asset: ASSETS_NATIVE): Promise<Assets>{
    return new Promise(resolve => {
      this.assetService.getAssetsYoutubeRectangleWithParentId(this.uid, asset.assetId).then(myAssetRectangle => {
        if (myAssetRectangle.length > 0) {
          resolve(myAssetRectangle[0])
          
        } else {
          resolve(null)
        }
      
    })
    })
  }
   public getAssetsSquareYoutube(asset: ASSETS_NATIVE): Promise<Assets>{
    return new Promise(resolve => {
      this.assetService.getAssetsYoutubeSquareWithParentId(this.uid, asset.assetId).then(myAssetSquare => {
        if (myAssetSquare.length > 0) {
          resolve(myAssetSquare[0])
          
        } else {
          resolve(null)
        }
      
    })
    })
  }
   public getAssetsLogoRectangle(asset: ASSETS_NATIVE): Promise<Assets>{
    return new Promise(resolve => {
      this.assetService.getAssetsLogoWithParentId(this.uid, asset.assetId).then(myAssetLogo => {
        if (myAssetLogo.length > 0) {
          for (let logo of myAssetLogo) {
            //////console.log(logo)
            if (logo.width / logo.height === 4) {

              resolve(myAssetLogo[0])
              
            }
          }
          
        } else {
          resolve(null)
        }
      
    })
    })
  }

     public getAssetsLogoSquare(asset: ASSETS_NATIVE): Promise<Assets>{
    return new Promise(resolve => {
      this.assetService.getAssetsLogoWithParentId(this.uid, asset.assetId).then(myAssetLogo => {
        if (myAssetLogo.length > 0) {
          for (let logo of myAssetLogo) {
            if (logo.width / logo.height === 1) {
              resolve(myAssetLogo[0])
              
            }
          }
          
        } else {
          resolve(null)
        }
      
    })
    })
  }
 
  public selectedYoutubeAds: AssetToUse[] = []
  useSelectedImagesForYoutube() {
    if (this.assetsFromCropper.length > 0) {
      this.errorImageRectangle = ""
      this.assetsToUse = this.assetsFromCropper
       this.assetToAdd.emit(this.assetsFromCropper)
      if (document.querySelector('.gallery-container').classList.contains('error-image')) {
        document.querySelector('.gallery-container').classList.remove('error-image')
      }
    } else {
      this.errorImageRectangle = "Aucune image séléctionnée"
      if (!document.querySelector('.gallery-container').classList.contains('error-image')) {
        document.querySelector('.gallery-container').classList.add('error-image')
      }
    }
  }

  @Output() assetToAdd: EventEmitter<AssetToUse[]> = new EventEmitter()
   saveSelectedImagesForAddedYoutube() {
    if (this.assetsFromCropper.length > 0) {
      this.errorImageRectangle = ""
      this.assetsToUse = this.assetsFromCropper
      this.assetToAdd.emit(this.assetsFromCropper)
      if (document.querySelector('.gallery-container').classList.contains('error-image')) {
        document.querySelector('.gallery-container').classList.remove('error-image')
      }
    } else {
      this.errorImageRectangle = "Aucune image séléctionnée"
      if (!document.querySelector('.gallery-container').classList.contains('error-image')) {
        document.querySelector('.gallery-container').classList.add('error-image')
      }
    }
  }


  
  checkIfTitleIsSet():Promise<boolean> {
    return new Promise(resolve => {
      this.titles = []
      if (this.titleChip.chips.length > 0) {
        _.forEach(this.titleChip.chips, (chip) => {
          this.titles.push(chip.toString())
          if (this.titles.length === this.titleChip.chips.length) {
            resolve(true)
            
          }
          })
      } else {
          this.toast.toast.title = 'Avertissement'
        this.toast.toast.content = 'Titre obligatoire'
        this.toast.toast.timeOut = 5000
        this.toast.toast.cssClass = 'e-toast-info'
        this.toast.toast.show()
        resolve(false)
      }
    })
  }
  checkIfDescriptionIsSet():Promise<boolean> {
    return new Promise(resolve => {
      this.descriptions = []
      if (this.descriptionChip.chips.length > 0) {
        _.forEach(this.descriptionChip.chips, (chip) => {
          this.descriptions.push(chip.toString())
          if (this.descriptionsAssets.length === this.descriptionChip.chips.length) {
            resolve(true)
            
          }
          })
      } else {
          this.toast.toast.title = 'Avertissement'
        this.toast.toast.content = 'Description obligatoire'
        this.toast.toast.timeOut = 5000
        this.toast.toast.cssClass = 'e-toast-info'
        this.toast.toast.show()
        resolve(false)
      }
    })
  }
  checkIfBrandNameIsSet():Promise<boolean> {
    return new Promise(resolve => {
      if (this.secondFormGroup.controls.brand.value!=='') {
        resolve(true)
      } else {
          this.toast.toast.title = 'Avertissement'
        this.toast.toast.content = 'Nom de la marque obligatoire'
        this.toast.toast.timeOut = 5000
        this.toast.toast.cssClass = 'e-toast-info'
        this.toast.toast.show()
        resolve(false)
      }
    })
  }

  public nativesBeforeUploadedAsset:  NATIVE_ADS[] = []
  public rectangleImagesBeforeUpload: Assets[] = []
  public squareImagesBeforeUpload: Assets[] = []
  public logoImagesBeforeUpload: Assets []= []
  getRectangleBeforeUpload(): Promise<boolean> {
    return new Promise(resolve => {
      for (let asset of this.assetsFromCropper) {
        if (asset.type === 'rect') {
         this.rectangleImagesBeforeUpload.push(asset.data)
       }
      }
      resolve(true)
    })
  }
   getSquareBeforeUpload(): Promise<boolean> {
    return new Promise(resolve => {
       for (let asset of this.assetsFromCropper) {
        if (asset.type === 'sqr') {
         this.squareImagesBeforeUpload.push(asset.data)
       }
      }
      resolve(true)
    })
  }

  getLogoBeforeUpload(): Promise<boolean> {
    return new Promise(resolve => {
      for (let asset of this.assetsFromCropper) {
        if (asset.type === 'logo') {
         this.logoImagesBeforeUpload.push(asset.data)
       }
      }
      resolve(true)
    })
  }

  deleteNotCreatedNativeAd(id: string) {
    for (let i = 0; i<=this.nativesBeforeUploadedAsset.length; i++) {
      if (this.nativesBeforeUploadedAsset[i].id === id) {
        this.nativesBeforeUploadedAsset.splice(i,1)
      }
    }
  }

  removeSelectedBlock(): Promise<boolean> {
    return new Promise(resolve => {
      for (let id of this.currentSelectedBlock) {
        document.getElementById(id).classList.remove('outline', 'selected')
      }
      resolve(true)
      
    })

  }
  
  removeSelectedIcons(): Promise<boolean> {
    return new Promise(resolve => {
      for (let item of this.currentIconDeleteAssets) {
       document.getElementById(item.id).removeChild(item.icon)
      }
      resolve(true)
      
    })
  
  }

   public value_replace: string = ""
  public metadata: any;
  public extension: string = ""

  getValueReplace(src: string): Promise<string> {
    return new Promise(resolve => {

     
      if (src.includes('data:image/png;base64,')) {
        this.value_replace = "data:image/png;base64,"
        this.metadata = {
          contentType: 'image/png',
        };
        this.extension = "png"
        resolve('ok')
      } else if (src.includes('data:image/jpeg;base64')) {
        ////console.log(true)
        this.value_replace = "data:image/jpeg;base64,"
        this.metadata = {
          contentType: 'image/jpeg',
        };
        this.extension = "jpg"
        resolve("ok")
     
      } else if (src.includes('data:image/gif;base64')) {
        this.value_replace = "data:image/gif;base64,"
        this.metadata = {
          contentType: 'image/gif',
        };
        this.extension = "gif"
        resolve("ok")
      }
    })
  }

  @Output() adsDataChange: EventEmitter<NATIVE_ADS_TO_PUBLISH[]> = new EventEmitter()
  getAssetsNativeForCampaign(): Promise<NATIVE_ADS_TO_PUBLISH[]>{
    return new Promise(resolve => {
      let result: NATIVE_ADS_TO_PUBLISH[] = []
      if (this.native_before_upload.length > 0) {
        let marketingImages: ASSETS_NATIVE[] = []
        let squareMarketingImages: ASSETS_NATIVE[] = []
        let logoImages: ASSETS_NATIVE[] = []
        let landscapeLogoImages: ASSETS_NATIVE[] = []
        this.native_before_upload.forEach((el, el_index) => {
          el.uploadedAssets.forEach((asset, asset_index) => {
            if (asset.usage === 'image' && asset.useFor === 'rect') {
              marketingImages.push({
                id: asset.id,
                assetId: asset.assetId,
                width: asset.width,
                height: asset.height,
                imageUrl: asset.imageUrl,
                imageFileSize: asset.imageFileSize,
                imageMimeType: asset.imageMimeType,
                usage: asset.usage,
                useFor: asset.useFor,
                owner: asset.owner,
                aacid: asset.aacid
               })
            }else if (asset.usage === 'image' && asset.useFor === 'sqr') {
              squareMarketingImages.push({
                id: asset.id,
                assetId: asset.assetId,
                width: asset.width,
                height: asset.height,
                imageUrl: asset.imageUrl,
                imageFileSize: asset.imageFileSize,
                imageMimeType: asset.imageMimeType,
                usage: asset.usage,
                useFor: asset.useFor,
                owner: asset.owner,
                aacid: asset.aacid
               })
            }else if (asset.usage === 'logo' && asset.useFor === 'rect') {
              logoImages.push({
                id: asset.id,
                assetId: asset.assetId,
                width: asset.width,
                height: asset.height,
                imageUrl: asset.imageUrl,
                imageFileSize: asset.imageFileSize,
                imageMimeType: asset.imageMimeType,
                usage: asset.usage,
                useFor: asset.useFor,
                owner: asset.owner,
                aacid: asset.aacid
               })
            }else if (asset.usage === 'logo' && asset.useFor === 'sqr') {
              landscapeLogoImages.push({
                id: asset.id,
                assetId: asset.assetId,
                width: asset.width,
                height: asset.height,
                imageUrl: asset.imageUrl,
                imageFileSize: asset.imageFileSize,
                imageMimeType: asset.imageMimeType,
                usage: asset.usage,
                useFor: asset.useFor,
                owner: asset.owner,
                aacid: asset.aacid
               })
            }
            if (asset_index === el.uploadedAssets.length - 1) {
                  result.push({
                  id: el.id,
                  titles: el.titles,
                  descriptions: el.descriptions,
                  longHeadline: el.longHeadline,
                  brand: el.brand,
                  videosAssets: el.videosAssets,
                  marketingImages: marketingImages,
                  squareMarketingImages: squareMarketingImages,
                  logoImages: logoImages,
                  landscapeLogoImages: landscapeLogoImages
                  
              })
              if (result.length === this.native_before_upload.length) {
                this.adsDataChange.emit(result)
                resolve(result)
              }
            }
           
          })
          
        })
      } else {
        resolve(null)
      }
    })
  }

  uploadAsset(): Promise<ASSETS_NATIVE[]> {
    return new Promise(resolve => {
      let images: IMAGES_UPLOAD_AS_ASSET[] = []
      this.allCombinedAssets.forEach((el, index, arr) => {
        if (el.images.imageRect.urlString !== '' && el.images.imageSqr.urlString !== '') {
          images.push({
            data: el.images.imageRect.urlString,
            usage: el.usage,
            useFor: 'rect',
            originalImageInfo: el,
            owner: this.uid,
            aacid: this.aacid,
          })
           images.push({
            data: el.images.imageSqr.urlString,
            usage: el.usage,
            useFor: 'sqr',
            originalImageInfo: el,
            owner: this.uid,
            aacid: this.aacid
          })
        }else if (el.images.imageRect.urlString !== '' && el.images.imageSqr.urlString === '') {
           images.push({
            data: el.images.imageRect.urlString,
            usage: el.usage,
             useFor: 'rect',
             originalImageInfo: el,
             owner: this.uid,
            aacid: this.aacid
          })
        }else if (el.images.imageRect.urlString === '' && el.images.imageSqr.urlString !== '') {
           images.push({
            data: el.images.imageSqr.urlString,
            usage: el.usage,
             useFor: 'sqr',
             originalImageInfo: el,
            owner: this.uid,
            aacid: this.aacid
          })
        }
      })
  
      this.assetService.uploadImageAsset(images).then(response=>{
        //console.log(response)
        if (response !== null) {
          resolve(response)
        } else {
          resolve(response)
        }
      }).catch((e) => {
        //console.log(e)
        resolve(null)
      })
    })
    
  }
  
  currentEditingId: string = ""
  editNativeBeforeUpload(item: NATIVE_ADS_BEFORE_UPLOAD) {
    if (!this.isNewAd) {
      this.adPanel = true
      this.isEditAd = true
      this.isNewAd = false
      this.currentEditingId = item.id
      this.allCombinedVideos = item.videosAssets
      this.videosSelectedFromRecent = item.videosAssets
      this.finalVideosSelectedFromRecent = item.videosAssets
      setTimeout(() => {
        
        item.uploadedAssets.forEach(el => {
          let imageBase64: ImageBase64 = null
          if (el.useFor === 'rect') {
              imageBase64= {
            id: el.id,
            url: el.imageUrl,
            width: el.width,
            height: el.height,
            images: {
             imageRect: el.originalImageInfo.images.imageRect,
              imageSqr: {
              urlString: '',
              canvas: null,
                box: null,
              imageData: null
            }
            },
            usage: el.usage,
            
          }
          } else if (el.useFor === 'sqr') {
            imageBase64= {
            id: el.id,
            url: el.imageUrl,
            width: el.width,
            height: el.height,
            images: {
             imageRect: {
              urlString: '',
              canvas: null,
                box: null,
              imageData: null
            },
              imageSqr: el.originalImageInfo.images.imageSqr
            },
            usage: el.usage,
            
          }
          }
          
          this.croppedAssetList.push(imageBase64)
          this.finalCroppedAssetList.push(imageBase64)
          this.allCombinedAssets.push(imageBase64)
    
        })
        document.getElementById('creator-main-container').scrollIntoView();
 
          this.presetTitles(item.titles)          
        
  
         this.presetDescriptions(item.descriptions)            
         
        this.longHeadline = new FormControl(item.longHeadline, [Validators.required])
        this.longHeadline.updateValueAndValidity()
        this.brandItem = new FormControl(item.brand.assetText, [Validators.required])
        this.brandItem.updateValueAndValidity()
        let images_length: number = this.onlyImagesLength()
        let logos_length: number = this.onlyLogosLength()
        let total: number = images_length + logos_length
        this.tabComponent.items[3].header.text = 'VOS ELEMENTS ('+total+')'
        this.tabVideoComponent.items[2].header.text =  'VOS ELEMENTS ('+item.videosAssets.length+')'
        
      },500)
      
    }
  }

  toggleDuplicateNativeBeforeUpload(item: NATIVE_ADS_TO_PUBLISH) {
    let new_ad: NATIVE_ADS_BEFORE_UPLOAD = {
       id: item.id,
        titles: item.titles,
      descriptions: item.descriptions,
      longHeadline: item.longHeadline,
        brand: item.brand,
        images: [],
        videosAssets: item.videosAssets,
      uploadedAssets: []
    }
    item.marketingImages.forEach(el => {
      let imageBase64: ImageBase64 = {
            id: el.id,
            url: el.imageUrl,
            width: el.width,
            height: el.height,
            images: {
             imageRect: {
              urlString: el.imageUrl,
              canvas: null,
                box: null,
              imageData: null
            },
              imageSqr: {
              urlString: '',
              canvas: null,
                box: null,
              imageData: null
            }
            },
            usage: el.usage,
            
        }
        new_ad.images.push(imageBase64)
        new_ad.uploadedAssets.push({
          id: el.id,
          assetId: el.assetId,
          width: el.width,
          height: el.height,
          imageUrl: el.imageUrl,
          imageFileSize: el.imageFileSize,
          imageMimeType: el.imageMimeType,
          originalImageInfo: imageBase64,
          usage: el.usage, 
          useFor: el.useFor, 
          owner: el.owner,
          aacid: el.aacid
        })
        
    })
    item.squareMarketingImages.forEach(el => {
      let imageBase64: ImageBase64 = {
            id: el.id,
            url: el.imageUrl,
            width: el.width,
            height: el.height,
            images: {
             imageRect: {
              urlString: '',
              canvas: null,
                box: null,
              imageData: null
            },
              imageSqr: {
              urlString: el.imageUrl,
              canvas: null,
                box: null,
              imageData: null
            }
            },
            usage: el.usage,
            
        }
        new_ad.images.push(imageBase64)
        new_ad.uploadedAssets.push({
          id: el.id,
          assetId: el.assetId,
          width: el.width,
          height: el.height,
          imageUrl: el.imageUrl,
          imageFileSize: el.imageFileSize,
          imageMimeType: el.imageMimeType,
          originalImageInfo: imageBase64,
          usage: el.usage, 
          useFor: el.useFor, 
          owner: el.owner,
          aacid: el.aacid
        })
        
    })
    
        item.logoImages.forEach(el => {
      let imageBase64: ImageBase64 = {
            id: el.id,
            url: el.imageUrl,
            width: el.width,
            height: el.height,
            images: {
             imageRect: {
              urlString: el.imageUrl,
              canvas: null,
                box: null,
              imageData: null
            },
              imageSqr: {
              urlString: '',
              canvas: null,
                box: null,
              imageData: null
            }
            },
            usage: el.usage,
            
        }
        new_ad.images.push(imageBase64)
        new_ad.uploadedAssets.push({
          id: el.id,
          assetId: el.assetId,
          width: el.width,
          height: el.height,
          imageUrl: el.imageUrl,
          imageFileSize: el.imageFileSize,
          imageMimeType: el.imageMimeType,
          originalImageInfo: imageBase64,
          usage: el.usage, 
          useFor: el.useFor, 
          owner: el.owner,
          aacid: el.aacid
        })
        
        })
     item.landscapeLogoImages.forEach(el => {
      let imageBase64: ImageBase64 = {
            id: el.id,
            url: el.imageUrl,
            width: el.width,
            height: el.height,
            images: {
             imageRect: {
              urlString: '',
              canvas: null,
                box: null,
              imageData: null
            },
              imageSqr: {
              urlString: el.imageUrl,
              canvas: null,
                box: null,
              imageData: null
            }
            },
            usage: el.usage,
            
        }
        new_ad.images.push(imageBase64)
        new_ad.uploadedAssets.push({
          id: el.id,
          assetId: el.assetId,
          width: el.width,
          height: el.height,
          imageUrl: el.imageUrl,
          imageFileSize: el.imageFileSize,
          imageMimeType: el.imageMimeType,
          originalImageInfo: imageBase64,
          usage: el.usage, 
          useFor: el.useFor, 
          owner: el.owner,
          aacid: el.aacid
        })
        
      })
      this.native_before_upload.push(new_ad)
      this.editNativeBeforeUpload(new_ad)
  }
  adPanel: boolean = false
  isNewAd: boolean = false
  isEditAd: boolean = false
  fmEfficacity: any;
  efficacityPercent: number = 0
  toggleAdNewAdPanel() {
    if (!this.isNewAd) {
      this.adPanel = true
    this.isEditAd = false
    this.isNewAd = true
    this.currentEditingId = ''
      this.titlesAssets = []
      this.addTitles()
   this.addDescriptions() 
      
                          this.descriptionsAssets = []
                          this.brandAssets = { assetText: '' }
                          this.allCombinedAssets = []
                          this.croppedImageList = []
                          this.finalCroppedImageList = []
                          this.croppedImageFromWebsiteList = []
                          this.finalCroppedImageFromWebsiteList = []
                          this.croppedAssetList = []
                          this.finalCroppedAssetList = []
                          this.allCombinedVideos = []
                          this.finalVideosSelectedFromSearch = []
                          this.videosSelectedFromSearch = []
                          this.clearFormArray(this.titlesItem)
                          this.clearFormArray(this.descriptionsItem)
                          this.longHeadline.setValue('')
                          this.brandItem.setValue('')
                          this.titlesItem.reset()
                          this.descriptionsItem.reset()
                          this.longHeadline.reset()
                          this.brandItem.reset()
                          this.cropRect = false
      this.cropSqr = false
      /* this.rectangleExist = true
      this.squareExist = true */
    this.currentEditingId = ''
    /* setTimeout(() => {
     document.getElementById('creator-main-container').scrollIntoView();
     this.init({
      this.fmEfficacity = new FluidMeter();
      targetContainer: document.getElementById("efficacity-indicator"),
      fillPercentage: 0,
      options: {
        fontFamily: "Raleway",
        fontSize: '14px',
        drawPercentageSign: true,
        drawBubbles: true,
        size: 150,
        borderWidth: 19,
        backgroundColor: "#e2e2e2",
        foregroundColor: "#fafafa",
        foregroundFluidLayer: {
          fillStyle: "#3f51b5",
          angularSpeed: 100,
          maxAmplitude: 12,
          frequency: 30,
          horizontalSpeed: -75
        },
        backgroundFluidLayer: {
          fillStyle: "#2196f3",
          angularSpeed: 100,
          maxAmplitude: 9,
          frequency: 30,
          horizontalSpeed: 75
        }
      }
    });
    },500) */
    }
    
  }

  adToDelete:  NATIVE_ADS_BEFORE_UPLOAD = null
  showDeleteAd(ad:NATIVE_ADS_BEFORE_UPLOAD) {
    this.adToDelete = ad
    this.adConfirmDelete.show()
    
   }

   duplicateAd(ad:NATIVE_ADS_BEFORE_UPLOAD) {
    
     let new_ad: NATIVE_ADS_BEFORE_UPLOAD = {
       id: 'duplicated-'+new Date().getTime().toString(),
        titles: ad.titles,
      descriptions: ad.descriptions,
      longHeadline: ad.longHeadline,
        brand: ad.brand,
        images: ad.images,
        videosAssets: ad.videosAssets,
      uploadedAssets: ad.uploadedAssets
     }
      this.native_before_upload.push(new_ad)
    this.editNativeBeforeUpload(new_ad)
    
   }
  deletionConfirmed(){
    this.native_before_upload.forEach((value, index, arr) => {
      if (value.id === this.adToDelete.id) {
        this.native_before_upload.splice(index, 1)
        this.adConfirmDelete.hide()
       }
     })
  }
  deletionAborted() {
    this.adToDelete = null
    this.adConfirmDelete.hide()
    this.abortOperation()
  }
  abortOperation() {
      
           this.titlesAssets = []
                            this.descriptionsAssets = []
                            this.brandAssets = { assetText: '' }
                            this.allCombinedAssets = []
                            this.croppedImageList = []
                            this.finalCroppedImageList = []
                            this.croppedImageFromWebsiteList = []
                            this.finalCroppedImageFromWebsiteList = []
                            this.croppedAssetList = []
                            this.finalCroppedAssetList = []
                            this.allCombinedVideos = []
                            this.videosFinds = []
                            this.videosSelectedFromSearch = []
                            this.finalVideosSelectedFromSearch = []
                            this.videosSelectedFromRecent = []
                            this.finalVideosSelectedFromRecent = []
                            this.imageList = []
                            this.clearFormArray(this.titlesItem)
                            this.clearFormArray(this.descriptionsItem)
                            this.longHeadline.setValue('')
                            this.brandItem.setValue('')
                            this.titlesItem.reset()
                            this.descriptionsItem.reset()
                            this.longHeadline.reset()
                            this.brandItem.reset()
                            this.cropRect = false
                            this.cropSqr = false
                            this.currentEditingId = ''
                            this.adPanel = false
                            this.isNewAd = false
                            this.isEditAd = false
                            this.spinnerSaveNative = false
                            this.tabComponent.items[3].header.text =  'VOS ELEMENTS (0)'
                                      this.tabVideoComponent.items[2].header.text = 'VOS ELEMENTS (0)'
                                      this.tabComponent.refresh()
                                      this.tabVideoComponent.refresh()
  }
  classes = this.theme.addStyleSheet(styles)
  @Output() nativesAds: EventEmitter<NATIVE_ADS> = new EventEmitter()
showSaveButton: boolean = true;
  NATIVE_ADS_LIST: NATIVE_ADS[] = []
  native_before_upload: NATIVE_ADS_BEFORE_UPLOAD[] = []
  spinnerSaveNative: boolean = false
  saveNativeAd(): Promise<string> {
    return new Promise(resolve => {
    /* this.allCombinedAssets.length */
      
      let  imagesLength = this.allCombinedAssets.filter(el => el.usage === 'image').length
      let logoLength = this.allCombinedAssets.filter(el => el.usage === 'logo').length
      if (this.rectangleExist && this.squareExist) {
        if (imagesLength <= 15 && logoLength <= 5) {
          this.spinnerSaveNative = true
          this.getTitles().then(title => {
            if (title==='ok') {
              this.getDescriptions().then(description => {
                if (description==='ok') {
                  this.getLongHeadline().then(longHeadline => {
                    if (longHeadline==='ok') {
                      this.getBrand().then(brand => {
                        //////console.log(notRequired)
                       
                        if (brand === 'ok') {
                          this.getVideos().then(videos => {
                            this.uploadAsset().then(uploaded=>{
                              //console.log(uploaded)
                              if (uploaded !== null && uploaded.length>0) {
                                if (this.currentEditingId !== '') {
                                  this.native_before_upload.forEach((item, index, arr) => {
                                    if (item.id === this.currentEditingId) {
                                      this.native_before_upload.splice(index, 1)
                                      let ad: NATIVE_ADS_BEFORE_UPLOAD = {
                                  id: new Date().getTime().toString(),
                                  titles: this.titlesAssets,
                                  descriptions: this.descriptionsAssets,
                                   brand: this.brandAssets,
                                  longHeadline: this.longHeadline.value,
                                  images: this.allCombinedAssets,
                                  videosAssets: videos,
                                  uploadedAssets: uploaded
                                 }
                                      this.native_before_upload.push(ad)
                            this.titlesAssets = []
                            this.descriptionsAssets = []
                            this.brandAssets = { assetText: '' }
                            this.allCombinedAssets = []
                            this.croppedImageList = []
                            this.finalCroppedImageList = []
                            this.croppedImageFromWebsiteList = []
                            this.finalCroppedImageFromWebsiteList = []
                            this.croppedAssetList = []
                            this.finalCroppedAssetList = []
                            this.allCombinedVideos = []
                            this.videosFinds = []
                            this.videosSelectedFromSearch = []
                            this.finalVideosSelectedFromSearch = []
                            this.videosSelectedFromRecent = []
                            this.finalVideosSelectedFromRecent = []
                            this.imageList = []
                            this.clearFormArray(this.titlesItem)
                            this.clearFormArray(this.descriptionsItem)
                            this.longHeadline.setValue('')
                            this.brandItem.setValue('')
                            this.titlesItem.reset()
                            this.descriptionsItem.reset()
                            this.longHeadline.reset()
                            this.brandItem.reset()
                            this.cropRect = false
                            this.cropSqr = false
                            this.currentEditingId = ''
                            this.adPanel = false
                            this.isNewAd = false
                            this.isEditAd = false
                                      this.spinnerSaveNative = false
                                      this.getAssetsNativeForCampaign()
                                      
                                      /* this.adsDataChange.emit(ad) */
                            this.tabComponent.items[3].header.text =  'VOS ELEMENTS (0)'
                                      this.tabVideoComponent.items[2].header.text = 'VOS ELEMENTS (0)'
                                      this.tabComponent.refresh()
                                      this.tabVideoComponent.refresh()
                                    }
                                  })
                                } else {
                                  let ad: NATIVE_ADS_BEFORE_UPLOAD = {
                                  id: new Date().getTime().toString(),
                                  titles: this.titlesAssets,
                                  descriptions: this.descriptionsAssets,
                                   brand: this.brandAssets,
                                  longHeadline: this.longHeadline.value,
                                  images: this.allCombinedAssets,
                                  videosAssets: videos,
                                  uploadedAssets: uploaded
                                 }
                                      this.native_before_upload.push(ad)
                                  
                                 this.titlesAssets = []
                            this.descriptionsAssets = []
                            this.brandAssets = { assetText: '' }
                            this.allCombinedAssets = []
                            this.croppedImageList = []
                            this.finalCroppedImageList = []
                            this.croppedImageFromWebsiteList = []
                            this.finalCroppedImageFromWebsiteList = []
                            this.croppedAssetList = []
                            this.finalCroppedAssetList = []
                            this.allCombinedVideos = []
                            this.finalVideosSelectedFromSearch = []
                            this.videosSelectedFromSearch = []
                             this.videosSelectedFromRecent = []
                                  this.finalVideosSelectedFromRecent = []
                                  this.imageList = []
                            this.clearFormArray(this.titlesItem)
                            this.clearFormArray(this.descriptionsItem)
                            this.longHeadline.setValue('')
                            this.brandItem.setValue('')
                            this.titlesItem.reset()
                            this.descriptionsItem.reset()
                            this.longHeadline.reset()
                            this.brandItem.reset()
                            this.cropRect = false
                            this.cropSqr = false
                            this.currentEditingId = ''
                            this.adPanel = false
                            this.isNewAd = false
                            this.isEditAd = false
                                  this.spinnerSaveNative = false
                                  this.getAssetsNativeForCampaign()
                                    /*  this.adsDataChange.emit(ad) */
                            this.tabComponent.items[3].header.text =  'VOS ELEMENTS (0)'
                            this.tabVideoComponent.items[2].header.text =  'VOS ELEMENTS (0)'
                                }
                                this.tabComponent.refresh()
                                      this.tabVideoComponent.refresh()
                                 
                              }else{
                                alert('Une erreur est survenue veuillez rééssayer')
                                this.spinnerSaveNative = false
                              }
                            }).catch((e) => {
                              //console.log(e)
                              alert('Une erreur est survenue veuillez rééssayer encore')
                              this.spinnerSaveNative = false
                            })
                            
                          }).catch((e) => {
                              resolve('error')
            this.spinnerSaveNative = false
                          })
                         
                         

                          /*  */
                         /*  this.NATIVE_ADS_LIST.push({
                           id: 
                         }) */
                        } else {
                           this.toast.toast.title = 'Avertissement'
              this.toast.toast.content = 'Annonce icomplètes, veuillez choisir vos images'
              this.toast.toast.timeOut = 5000
              this.toast.toast.cssClass = 'e-toast-info'
                          this.toast.toast.show()
                          resolve('error')
                          this.spinnerSaveNative = false
                        }
                      }).catch((e) => {
                        resolve('error')
                        this.spinnerSaveNative = false
                      })
                    } else {
                      resolve('error')
                      this.spinnerSaveNative = false
                    }
                  }).catch((e) => {
                    resolve('error')
                    this.spinnerSaveNative = false
                  })
                } else {
                  resolve('error')
                  this.spinnerSaveNative = false
                }
              }).catch((e) => {
                resolve('error')
                this.spinnerSaveNative = false
              })
            } else {
              resolve('error')
              this.spinnerSaveNative = false
            }
          }).catch((e) => {
            resolve('error')
            this.spinnerSaveNative = false
          })
          
        }
      }
      
    })
  }

  clearFormArray (formArray: FormArray){
  formArray = this._formBuilder.array([]);
}

  /* editNativeAdBeforeUpload(ad: NATIVE_ADS_BEFORE_UPLOAD) {
    this.titlesAssets = ad.titles
    this.descriptionsAssets = ad.descriptions
    for (let title of ad.titles) {
      this.titlesItem.push(new FormControl(title, [Validators.required]));
                  
    }
    for (let description of ad.descriptions) {
      this.descriptionsItem.push(new FormControl(description, [Validators.required]));
                  
    }
    this.brandItem.setValue(ad.brand.assetText)
    this.longHeadline.setValue(ad.longHeadline.assetText)
    this.croppedAssetList = ad.uploadedAssets
  } */
    saveNewNativeAd(): Promise<NATIVE_ADS[]> {
    return new Promise(resolve => {
      this.checkIfTitleIsSet().then(title => {
          //////console.log(title)
        if (title) {
          this.checkIfDescriptionIsSet().then(description => {
            if (description) {
              this.checkIfBrandNameIsSet().then(brand => {
                if (brand) {
                  this.checkIfImageNotRequired().then(notRequired => {
                    //////console.log(notRequired)
                    if (notRequired) {
                      this.getRectangleBeforeUpload().then(rectangle => {
                        if (rectangle) {
                          this.getSquareBeforeUpload().then(square => {
                            if (square) {
                              this.getLogoImage().then(logo => {
                                if (logo) {
                                 
                              //////console.log(this.nativesBeforeUploadedAsset)
                              this.assetsToUse = []
                              this.assetsFromCropper = []
                              this.titles = []
                              this.descriptions = []
                              this.rectangleImagesBeforeUpload = []
                              this.squareImagesBeforeUpload = []
                              this.removeSelectedBlock().then(block => {
                                if (block) {
                                  this.removeSelectedIcons().then(icons => {
                                    if (icons) {
                                      this.currentSelectedBlock = []
                                      this.currentIconDeleteAssets = []
                                      resolve(this.nativesBeforeUploadedAsset)
                                    }
                                  }).catch((e) => {
                                    resolve(this.nativesBeforeUploadedAsset)
                                  })
                                  
                                } else {
                                  resolve(this.nativesBeforeUploadedAsset)
                                }
                              }).catch((e) => {
                                resolve(this.nativesBeforeUploadedAsset)
                              })
                              return;
                                } else {
                                  resolve(null)
                                }
                              }).catch((e) => {
                                resolve(null)
                              })
                            } else {
                              resolve(null)
                            }
                          }).catch((e) => {
                            resolve(null)
                          })
                        } else{
                          resolve(null)
                        }
                      }).catch((e) => {
                        resolve(null)
                      })
                     
                    } else {
                       this.toast.toast.title = 'Avertissement'
          this.toast.toast.content = 'Annonce icomplètes, veuillez choisir vos images'
          this.toast.toast.timeOut = 5000
          this.toast.toast.cssClass = 'e-toast-info'
                      this.toast.toast.show()
                      resolve(null)
                    }
                  }).catch((e) => {
                    resolve(null)
                  })
                } else {
                  resolve(null)
                }
              }).catch((e) => {
                resolve(null)
              })
            } else {
              resolve(null)
            }
          }).catch((e) => {
            resolve(null)
          })
        } else {
          resolve(null)
        }
      }).catch((e) => {
        resolve(null)
      })
      
    })
    }
  
    public rectangleImageValid: boolean = false
    public squareImageValid: boolean = false
    public logoImageValid: boolean = false
  public ImageValid: boolean = false
   public image: string = "assets/images/web-native-dummy-main-image.png"
    public imageRectangle: string = "assets/images/web-native-dummy-main-image.png"
  public imageSquare: string = "assets/images/web-native-dummy-main-image.png"
  public imageLogo: string = "assets/images/web-native-dummy-main-image.png"
   getRectangleImage(): Promise<string>{
        return new Promise(resolve => {
            if (this.rectangleImageValid) {
                 if (this.imageRectangle !== "assets/images/web-native-dummy-main-image.png") {
                    resolve('ok')
                    
                } else {
                     this.toast.toast.title = "Service image"
                     this.toast.toast.content = "Image format large requis."
                     this.toast.toast.cssClass = "e-toast-danger"
                     this.toast.toast.show()
                }
            } else {
                    this.toast.toast.title = "Service image"
                     this.toast.toast.content = "Image format large requis."
                     this.toast.toast.cssClass = "e-toast-danger"
                     this.toast.toast.show()
            }
        })
    }
      getSquareImage(): Promise<string>{
        return new Promise(resolve => {
            if (this.squareImageValid) {
                if (this.imageSquare !== "assets/images/web-native-dummy-main-image.png") {
                    resolve('ok')
                    
                } else {
                         this.toast.toast.title = "Service image"
                     this.toast.toast.content = "Image petit format requis."
                     this.toast.toast.cssClass = "e-toast-danger"
                     this.toast.toast.show()
                }
            } else {
                     this.toast.toast.title = "Service image"
                     this.toast.toast.content = "Image format large requis."
                     this.toast.toast.cssClass = "e-toast-danger"
                     this.toast.toast.show()
            }
        })
    }
      getLogoImage(): Promise<string>{
        return new Promise(resolve => {
            if (this.logoImageValid) {
                if (this.imageLogo !== "assets/images/web-native-dummy-main-image.png") {
                    resolve('ok')
                    
                } else {
                    
                    resolve('error')
                }
            } else {
                resolve('error')
            }
        })
    }
  public errorImageRectangle: string = ""
  public errorImageSquare: string = ""
  public imageListToUse: ImageBase64[] = []
  public imageSearchFromWebsite: ImageBase64[] = []
  public imageSearchFromApi: ImageBase64[] = []
  searchUrl: FormControl = new FormControl() 
  searchWord: FormControl = new FormControl()
  scannerBar: boolean = false
  searchedFromWebsiteFound: { url: string, content: ImageBase64[] }[] =[];
  urlPromote: Observable<string>;
  websiteNotScannable: boolean = false
  searchFromWebsite() {
    this.websiteNotScannable = false
    this.scannerBar = true
 
    if (this.searchUrl.value.length>2) {
      let is_url = isURL(this.searchUrl.value)
      if(is_url){
        let check_if_already_searched = this.searchedFromWebsiteFound.some(item => item.url === this.searchUrl.value.toString())
        if (check_if_already_searched) {
          this.searchedFromWebsiteFound.some(item => {
            if (item.url === this.searchUrl.value.toString()){
              this.imageSearchFromWebsite = item.content
              this.scannerBar = false

            }
          })
        } else {
          this.assetService.getImagesFromWebsite(this.searchUrl.value, is_url).then(response => {
        //console.log(response)
        if (response !== '' && response !== null && response.length>0) {
          this.imageSearchFromWebsite = response
              this.searchedFromWebsiteFound.push({
                url: this.searchUrl.value,
                content: response
              })
        } else {
          this.websiteNotScannable = true
            }
        this.scannerBar = false
      }).catch((e)=>{
        this.websiteNotScannable = true
         this.scannerBar = false
      })
        }
      } else {
         this.assetService.getImagesFromWebsite(this.searchUrl.value, is_url).then(response => {
        //console.log(response)
        if (response !== '' && response !== null && response.length>0) {
          this.imageSearchFromWebsite = response
              this.searchedFromWebsiteFound.push({
                url: this.searchUrl.value,
                content: response
              })
        } else {
          this.websiteNotScannable = true
            }
        this.scannerBar = false
      }).catch((e)=>{
        this.websiteNotScannable = true
         this.scannerBar = false
      })
      }
     
      
    }
  }
  searchQuery() {
    if(this.searchWord.valid){
      this.assetService.searchImageApi(this.searchWord.value).then(response => {
        //console.log(response)
        this.imageSearchFromApi = response
      })
    }
  }
  mergeImageBase64InUnique<ImageBase64>(array:  ImageBase64[], property: any):  ImageBase64[] {

  const newArray = new Map();

  array.forEach((item:  ImageBase64) => {
    const propertyValue = item[property];
    newArray.has(propertyValue) ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) }) : newArray.set(propertyValue, item);
  });

  return Array.from(newArray.values());
  }

  spinnerLoadingPreview: boolean = false
  videoPreviewUrl: string = ""
  videoIllustration: boolean = false
  format_160x600: any = ""

  setPreviewIllustration(index: number) {
    
      
      let total: number = 2
      let random: number = Math.floor(Math.random() * total);
  
      if (random === 1) {
         this.videoPreviewUrl = ""
        if (this.allCombinedAssets[index]!==undefined && this.allCombinedAssets[index].images.imageRect.urlString !== '') {
        if (this.allCombinedAssets[index].usage === 'image') {
          this.preview_illustration = this.allCombinedAssets[index].images.imageRect.urlString
          this.spinnerLoadingPreview = false
          setTimeout(() => {
            var prev = this.getAverageRGB('image-1')
            this.preview_background_color = prev.background
            this.preview_text_color = prev.text
            
          },500)
          
        }
      }
      } else {
      let totalVideos: number = this.allCombinedVideos.length
      let randomVideos: number = Math.floor(Math.random() * totalVideos);
        if (this.allCombinedVideos[randomVideos]!==undefined && this.allCombinedVideos[randomVideos].previewUrl !== '') {
          this.videoPreviewUrl = this.allCombinedVideos[randomVideos].videoId
          this.spinnerLoadingPreview = false
          setTimeout(() => {
            
            var prev = this.getAverageRGB("video-preview-"+this.allCombinedVideos[randomVideos].videoId)
            this.preview_background_color = prev.background
            this.preview_text_color = prev.text
            
          },500)
          
       
      }
      }
      
  
  }
  currentLogoPreview: string = ""
  setPreviewIllustrationLogo() {

      let logoImages: ImageBase64[] = this.allCombinedAssets.filter(image => image.usage === 'logo')
      this.preview_illustration_logo = ""
      let total: number = logoImages.length
      let random: number = Math.floor(Math.random() * total);
      if (logoImages[random]!==undefined && logoImages[random].images.imageRect.urlString !== '') {
        if (logoImages[random].id === this.currentLogoPreview) {
          let random2: number = Math.floor(Math.random() * total)
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
            this.preview_background_color = prev.background
            this.preview_text_color = prev.text
            
          },500)
             }
          }
        } else {
          this.currentLogoPreview=logoImages[random].id
          this.preview_illustration_logo = logoImages[random].images.imageRect.urlString
          this.spinnerLoadingPreview = false
          setTimeout(() => {
            var prev = this.getAverageRGB('image-1')
            this.preview_background_color = prev.background
            this.preview_text_color = prev.text
            
          },500)
          
        }
      }
  
    
  }
  setPreviewTitle(index: number) {
  
      this.refreshPreviewIllustration()
      if (this.titlesAssets[index]!==undefined && this.titlesAssets[index].assetText !== this.titleToDisplay && this.titlesAssets[index].assetText!=='') {
        this.titleToDisplay = this.titlesAssets[index].assetText
      } else {
         let total: number = this.titlesAssets.length
        let random: number = Math.floor(Math.random() * total);
        this.titleToDisplay = this.titlesAssets[random].assetText
      }
    
   
  }
  setPreviewDescription(index: number) {
      this.refreshPreviewIllustration()
      if (this.descriptionsAssets[index]!==undefined && this.descriptionsAssets[index].assetText !== this.descriptionToDisplay && this.descriptionsAssets[index].assetText !== '') {
        this.descriptionToDisplay = this.descriptionsAssets[index].assetText
      } else {
         let total: number = this.descriptionsAssets.length
        let random: number = Math.floor(Math.random() * total);
        this.descriptionToDisplay = this.descriptionsAssets[random].assetText
      }
      
    
   
  }

  longHeadlineToDisplay: string = 'Titre long'
  titleToDisplay: string = 'Titre'
  descriptionToDisplay: string = 'Description'
  brandToDisplay: string = "Nom de l'entreprise"
  refreshPreviewIllustration() {
    this.rdsSimulation.allCombinedAssets = this.allCombinedAssets
    this.rdsSimulation.allCombinedVideos = this.allCombinedVideos
    this.rdsSimulation.titlesAssets = this.titlesAssets
    this.rdsSimulation.descriptionsAssets = this.descriptionsAssets
    this.rdsSimulation.longHeadlineAssets = this.longHeadlineAssets
    this.rdsSimulation.brandAssets = this.brandAssets
    this.rdsSimulation.triggerSimulationCreation()
    var self = this
    this.spinnerLoadingPreview = true
    this.preview_background_color = "rgba(204,204,204,1)"
    this.preview_text_color = "black"
      
    /* this.getLongHeadline().then(getting_headline => {
       this.getTitles().then(getting_titles => {
         this.getDescriptions().then(getting_descriptions => {
           this.getBrand().then(getting_brand => {
             if (self.allCombinedAssets.length > 0) {
        let total: number = self.allCombinedAssets.length
        let random: number = Math.floor(Math.random() * total);
               self.setPreviewIllustration(random)
               
        
      }else{
        this.preview_illustration = this.DEFAULT_PREVIEW_RECT
        this.spinnerLoadingPreview = false
    }
      if (this.longHeadlineAssets.assetText !== '') {
      this.longHeadlineToDisplay = this.longHeadlineAssets.assetText
    } else {
      this.longHeadlineToDisplay = 'Titre long'
    }

             if (this.titlesAssets.length > 0) {
       let total: number = this.titlesAssets.length
        let random: number = Math.floor(Math.random() * total);
        self.setPreviewTitle(random)
    } else {
      this.titleToDisplay = 'Titre'
    }

    if (this.descriptionsAssets.length > 0) {
       let total: number = this.descriptionsAssets.length
        let random: number = Math.floor(Math.random() * total);
        self.setPreviewDescription(random)
    } else {
      this.descriptionToDisplay = 'Description'
    }

    if (this.brandItem.value === '') {
      this.brandToDisplay="Nom de l'entreprise"
    } else {
      this.brandToDisplay=this.brandItem.value
             }
             
             let mobileNumber: number = Math.floor(Math.random() * 3) 
             this.adMobileDisplay = mobileNumber.toString()
             this.setPreviewIllustrationLogo()
    })
    })
    })
    }) */
    
    
  }

  toggleDesktopFormat() {
    this.desktopFormat = true
    this.mobileFormat = false
  }
  toggleMobileFormat() {
    this.mobileFormat = true
    this.desktopFormat = false
  }
  adMobileDisplay: string = "1"
  mobileIllustrationComponentStyle: { width: string, height: string } = { 'width': '160px', 'height': '600px' }
  mobileIllustrationComponentStyleWidth: [{ 'width': '160' }]
  mobileIllustrationMaxWidth = "100%"
  allCombinedAssets: ImageBase64[] = []
  allCombinedVideos: VIDEO_ASSET[] = []
  titlesItem = new FormArray([]);
  longHeadline: FormControl = new FormControl('', [Validators.required, Validators.maxLength(90)])
  descriptionsItem = new FormArray([]);
  brandItem: FormControl = new FormControl('', [Validators.maxLength(25)])
  titlesAssets: ASSET_TEXT[] = []
  descriptionsAssets: ASSET_TEXT[] = []
  brandAssets: ASSET_TEXT = { assetText: '' }
  longHeadlineAssets: ASSET_TEXT = {assetText: ''}
  titlesValid: boolean = false
  longHeadlineValid: boolean = false
  descriptionsValid: boolean = false
  imagesValid: boolean = false

  getTitles(index?: number): Promise<string>{
    return new Promise(resolve => {
      this.titlesAssets = []
      if (this.titlesItem.length > 0) {
          if (this.titlesItem.valid) {
            for (let i = 0; i < this.titlesItem.length; i++ ) {
              let form = this.titlesItem.controls[i] as FormControl
              if (form.valid) {
                this.titlesAssets.push({
                    assetText: form.value.title
                  })
                if (this.titlesItem.length === this.titlesAssets.length) {
                  this.titlesValid = true
                  this.setEvolutionIndicator()
                  this.rdsSimulation.titlesAssets = this.titlesAssets
                  this.rdsSimulation.titleToDisplay = form.value.title
                  /* this.rdsSimulation.setPreviewTitleCreation(this.titlesAssets.length -1) */
                  resolve('ok')
  
                } else {
                   this.setEvolutionIndicator()
                }
                
              } else {
                this.titlesValid = false
                this.setEvolutionIndicator()
              resolve('error')
              }
              
            }
            
          } else {
              this.titlesValid = false
              this.setEvolutionIndicator()
              resolve('error')
          }
          
      } else {
            this.titlesValid = false
            this.setEvolutionIndicator()
            resolve('error')

        }
    })
  }

    getDescriptions(index?: number): Promise<string>{
      return new Promise(resolve => {
        this.descriptionsAssets = []
      if (this.descriptionsItem.length > 0) {
          if (this.descriptionsItem.valid) {
            for (let i = 0; i < this.descriptionsItem.length; i++) {
              let form = this.descriptionsItem.controls[i] as FormControl
              if (form.valid) {
                 this.descriptionsAssets.push({
                  assetText: form.value.description
                })
              if (this.descriptionsItem.length === this.descriptionsAssets.length) {
                this.descriptionsValid = true
                this.setEvolutionIndicator()
                this.rdsSimulation.descriptionsAssets = this.descriptionsAssets
                this.rdsSimulation.descriptionToDisplay = form.value.description
                /* this.rdsSimulation.setPreviewDescriptionCreation(this.descriptionsAssets.length-1) */
                resolve('ok')

              } else {
                 this.setEvolutionIndicator()
              }
              } else {
                 this.descriptionsValid = false
                 this.setEvolutionIndicator()
              resolve('error')
              }
             
              
            }
            
          } else {
            this.descriptionsValid = false
            this.setEvolutionIndicator()
              resolve('error')
          }
          
      } else {
        this.descriptionsValid = false
        this.setEvolutionIndicator()
            resolve('error')

        }
    })
  }

  getLongHeadline(): Promise<string>{
    return new Promise(resolve => {
      if (this.longHeadline.valid) {
        this.longHeadlineAssets.assetText = this.longHeadline.value
        this.longHeadlineValid = true
        this.rdsSimulation.longHeadlineToDisplay = this.longHeadline.value
        this.setEvolutionIndicator()
        resolve('ok')
      } else {
        this.longHeadlineValid = false
        this.longHeadlineAssets.assetText = ''
        this.setEvolutionIndicator()
        resolve('error')
        }
    })
  }

   getBrand(): Promise<string>{
    return new Promise(resolve => {
      this.brandAssets.assetText = this.brandItem.value
      this.rdsSimulation.brandToDisplay = this.brandItem.value
      this.setEvolutionIndicator()
      resolve('ok')
    })
  }

  getVideos(): Promise<VIDEO_ASSET[]>{
    return new Promise(resolve => {
      if (this.allCombinedVideos.length > 0) {
        this.youtubeService.addVideosAssets(this.allCombinedVideos).then(videos => {
          this.setEvolutionIndicator()
          resolve(videos)
          
        }).catch((e) => {
          resolve([])
        })
      } else {
        resolve([])
      }
    })
  }
  

  addTitles() {
    const group = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    });
    this.titlesItem.push(group)
    this.titlesItem.setValidators([CustomValidators.uniqueBy('title')]);
    this.titlesItem.updateValueAndValidity()
  }

  presetTitles(titles: ASSET_TEXT[]) {
    
    titles.forEach(title => {
      let group = new FormGroup({
        title: new FormControl(title.assetText, [Validators.required, Validators.maxLength(30)]),
      });
      this.titlesItem.push(group)
      if (this.titlesItem.length === titles.length) {
        this.titlesItem.setValidators([CustomValidators.uniqueBy('title')]);
        this.titlesItem.updateValueAndValidity()
      }
      
    })
  }
   removeTitles(index: number) {
    if (this.titlesItem.length > 1) {
      this.titlesItem.removeAt(index);
       
     }
  }

  titleHasError() {
    let required = this.titlesItem.controls.some((item: FormGroup)=> {return !item.controls.title.valid})
    return required
  }
  addDescriptions() {
    const group = new FormGroup({
      description: new FormControl('', [Validators.required, Validators.maxLength(90)], ),
    });
    this.descriptionsItem.push(group)
    this.descriptionsItem.setValidators([CustomValidators.uniqueBy('description')]);
    this.descriptionsItem.updateValueAndValidity()
  }
  presetDescriptions(descriptions: ASSET_TEXT[]) {
    descriptions.forEach(description => {
      let group = new FormGroup({
        description: new FormControl(description.assetText, [Validators.required, Validators.maxLength(90)], ),
      });
      this.descriptionsItem.push(group)
      if (this.descriptionsItem.length === descriptions.length) {
        
        this.descriptionsItem.setValidators([CustomValidators.uniqueBy('description')]);
        this.descriptionsItem.updateValueAndValidity()
      }
    })
  }
   removeDescriptions(index: number) {
    if (this.descriptionsItem.length > 1) {
      this.descriptionsItem.removeAt(index);
       
     }
  }

  descriptionHasError() {
    let required = this.descriptionsItem.controls.some((item: FormGroup)=> {return !item.controls.description.valid})
    return required
  }

  formOveredTitle(id: string) {
    if (this.titlesItem.length!==1) {
      document.getElementById(id).classList.remove('d-none')
      
    }
  }
  formOveredDescription(id: string) {
    if (this.descriptionsItem.length!==1) {
      document.getElementById(id).classList.remove('d-none')
      
    }
  }
    formLeaved(id: string) {
      document.getElementById(id).classList.add('d-none')
  }

 
  rectangleExist: boolean = false
  squareExist: boolean = false
  logoExist: boolean = false
  textStatusEfficacity: string = "Incomplète"
  saveAddBeforeCreateAsset() {
    this.finalCroppedAssetList = this.mergeImageBase64InUnique([...this.finalCroppedAssetList, ...this.croppedAssetList], 'id') 
    this.finalCroppedImageFromWebsiteList = this.mergeImageBase64InUnique([...this.finalCroppedImageFromWebsiteList, ...this.croppedImageFromWebsiteList], 'id') 
    this.finalCroppedImageList = this.mergeImageBase64InUnique([...this.finalCroppedImageList, ...this.croppedImageList], 'id') 
    this.allCombinedAssets = this.mergeImageBase64InUnique([...this.finalCroppedImageList, ...this.finalCroppedImageFromWebsiteList, ...this.finalCroppedAssetList], 'id')
    this.responiveDisplayAdDialog.hide()
    /* this.refreshPreviewIllustration() */
    /* this.setPreviewIllustration(this.allCombinedAssets.length - 1) */
 
    this.rdsSimulation.allCombinedAssets = this.allCombinedAssets
    this.rdsSimulation.allCombinedVideos = this.allCombinedVideos
    this.rdsSimulation.titlesAssets = this.titlesAssets
    this.rdsSimulation.descriptionsAssets = this.descriptionsAssets
    this.rdsSimulation.longHeadlineAssets = this.longHeadlineAssets
    this.rdsSimulation.brandAssets = this.brandAssets
    this.rdsSimulation.setPreviewIllustrationCreation()
    this.setEvolutionIndicator() 
   
  }

  guidIndex: number = 0
  itemsGuide: { text: string}[] = [{ "text": "Ajoutez quelques images et des logos pour que votre annonce se démarque" }, { "text": "Pour que votre annonce puisse s'intégrer partout, ajoutez au moins une image au format paysage." }, { "text": "Pour que votre annonce puisse s'intégrer partout, ajoutez au moins une image au format carrée." }, { "text": "Associez étroitement votre marque à votre annonce en ajoutant un logo au format 1:1" }, { "text": "Ajoutez quelques titres" }, { "text": "Ajoutez un titre long" }, { "text": "Votre titre long est un peu court. Il devrait comporter au moins 30 caractères." }, { "text":"Ajoutez quelques descriptions"}, {"text":"Ajoutez un nom d'entreprise pour garantir que les internautes vous identifient."}, {"text":"Ajoutez d'autres titres pour augmenter vos chances d'améliorer vos performances"}, {"text":"Ajoutez d'autres descriptions pour augmenter vos chances d'améliorer vos performances"}, {"text":"Créez la meilleure qualité d'annonce possible en ajoutant au moins cinq images, cinq titres et cinq descriptions"}]

  nextGuideItem() {
    //console.log(this.guidIndex)
   this.guidIndex = this.guidIndex + 1
   //console.log(this.guidIndex)
    //console.log(this.itemsGuide[this.guidIndex])
  }

  previousGuideItem() { 
    this.guidIndex = this.guidIndex - 1
  }
  getOnlyImageEvolution() {
  this.rectangleExist = this.allCombinedAssets.some(img => img.usage === 'image' && img.images.imageRect.urlString !== '')
    this.squareExist = this.allCombinedAssets.some(img => img.usage === 'image' && img.images.imageSqr.urlString !== '')
    let logoSqrExist = this.allCombinedAssets.some(img => img.usage === 'logo' && img.images.imageSqr.urlString !== '')
    let logoRectExist = this.allCombinedAssets.some(img => img.usage === 'logo' && img.images.imageRect.urlString !== '')

    let rectangleImageLength: number = this.allCombinedAssets.filter(img => img.usage === 'image' && img.images.imageRect.urlString !== '').length
    let squareImageLength: number = this.allCombinedAssets.filter(img => img.usage === 'image' && img.images.imageSqr.urlString !== '').length

    let rectangleLogoLength: number = this.allCombinedAssets.filter(img => img.usage === 'logo' && img.images.imageRect.urlString !== '').length
    let squareLogoLength: number = this.allCombinedAssets.filter(img => img.usage === 'logo' && img.images.imageSqr.urlString !== '').length
    if (this.rectangleExist && this.squareExist) {
      if ((rectangleImageLength + squareImageLength) >= 5) {
        return 100
      } else {
        return 50
      }
    } else {
      return 0
    }
}
percent: number = 0
setPercentage(percent: number){
this.percent = percent
}
  setEvolutionIndicator() {
    setTimeout(() => {
      this.squareExist = this.allCombinedAssets.some(img => img.usage === 'image' && img.images.imageSqr.urlString !== '')
      let logoSqrExist = this.allCombinedAssets.some(img => img.usage === 'logo' && img.images.imageSqr.urlString !== '')
      let logoRectExist = this.allCombinedAssets.some(img => img.usage === 'logo' && img.images.imageRect.urlString !== '')
  
      let rectangleImageLength: number = this.allCombinedAssets.filter(img => img.usage === 'image' && img.images.imageRect.urlString !== '').length
      let squareImageLength: number = this.allCombinedAssets.filter(img => img.usage === 'image' && img.images.imageSqr.urlString !== '').length
  
      let rectangleLogoLength: number = this.allCombinedAssets.filter(img => img.usage === 'logo' && img.images.imageRect.urlString !== '').length
      let squareLogoLength: number = this.allCombinedAssets.filter(img => img.usage === 'logo' && img.images.imageSqr.urlString !== '').length
      if (this.rectangleExist && this.squareExist && this.longHeadline.valid) {
        if ((rectangleImageLength + squareImageLength) >= 5) {
           if (logoRectExist || logoSqrExist) {
          if (this.titlesAssets.length >= 2 && this.descriptionsAssets.length >= 2) {
             this.textStatusEfficacity = "Excellente"
             this.setPercentage(100);
            if (this.fmEfficacity !== undefined) {
             }
          } else if ((this.titlesAssets.length === 1 || this.descriptionsAssets.length === 1) && (this.titlesAssets.length > 0 || this.descriptionsAssets.length > 0)) {
            this.textStatusEfficacity = "Moyenne"
            this.setPercentage(80);
             if(this.fmEfficacity!==undefined){
             }
          }else if (this.titlesAssets.length === 0 || this.descriptionsAssets.length === 0) {
            this.textStatusEfficacity = "Incomplète"
            this.setPercentage(0);
             if(this.fmEfficacity!==undefined){
             }
          }
        } else {
           if (this.titlesAssets.length >= 2 && this.descriptionsAssets.length >= 2) {
             this.textStatusEfficacity = "Moyenne"
             this.setPercentage(80);
              if(this.fmEfficacity!==undefined){
              }
          } else if ((this.titlesAssets.length === 1 || this.descriptionsAssets.length === 1) && (this.titlesAssets.length > 0 || this.descriptionsAssets.length > 0)) {
             this.textStatusEfficacity = "Moyenne"
             this.setPercentage(60);
              if(this.fmEfficacity!==undefined){
              }
          }else if (this.titlesAssets.length === 0 || this.descriptionsAssets.length === 0) {
             this.textStatusEfficacity = "Incomplète"
             this.setPercentage(0);
              if(this.fmEfficacity!==undefined){
              }
          }
        }
        } else {
           if (logoRectExist || logoSqrExist) {
          if (this.titlesAssets.length >= 2 && this.descriptionsAssets.length >= 2) {
            this.textStatusEfficacity = "Bonne"
            this.setPercentage(90);
            if (this.fmEfficacity !== undefined) {
             }
          } else if ((this.titlesAssets.length === 1 || this.descriptionsAssets.length === 1) && (this.titlesAssets.length > 0 || this.descriptionsAssets.length > 0)) {
            this.textStatusEfficacity = "Moyenne"
            this.setPercentage(70);
             if(this.fmEfficacity!==undefined){
             }
          }else if (this.titlesAssets.length === 0 || this.descriptionsAssets.length === 0) {
            this.textStatusEfficacity = "Incomplète"
            this.setPercentage(0);
             if(this.fmEfficacity!==undefined){
             }
          }
        } else {
           if (this.titlesAssets.length >= 2 && this.descriptionsAssets.length >= 2) {
             this.textStatusEfficacity = "Moyenne"
             this.setPercentage(80);
              if(this.fmEfficacity!==undefined){
              }
          } else if ((this.titlesAssets.length === 1 || this.descriptionsAssets.length === 1) && (this.titlesAssets.length > 0 || this.descriptionsAssets.length > 0)) {
             this.textStatusEfficacity = "Moyenne"
             this.setPercentage(60);
              if(this.fmEfficacity!==undefined){
              }
          }else if (this.titlesAssets.length === 0 || this.descriptionsAssets.length === 0) {
             this.textStatusEfficacity = "Incomplète"
             this.setPercentage(0);
              if(this.fmEfficacity!==undefined){
              }
          }
        }
        }
       
      } else {
        this.textStatusEfficacity = "Incomplète"
  
        this.setPercentage(0);
         if(this.fmEfficacity!==undefined){
         }
      }
       this.rectangleExist = this.allCombinedAssets.some(img => img.usage === 'image' && img.images.imageRect.urlString !== '')
      
    }, 350);
  }

  
  

  checkIfImageLengthFull() {
    
  }
  checkIfImageNotRequired(): Promise<boolean> {
    return new Promise(resolve => {
  
      let findOneImageRectangle = this.assetsFromCropper.find(asset => asset.type !== 'rect')
      let findOneImageSquare = this.assetsFromCropper.find(asset => asset.type !== 'sqr')
      let findOneImageRectangleB64 = this.imageList.some(asset => asset.images.imageRect.urlString !== '')
      let findOneImageSquareB64 = this.imageList.find(asset => asset.images.imageSqr.urlString !== '')
      //////console.log(findOneImageRectangle)
      //////console.log(findOneImageSquare)
      if ((findOneImageRectangle !== undefined && findOneImageSquare !== undefined) || (findOneImageRectangleB64 && findOneImageSquareB64)) {
        this.errorImageRectangle = ""
        this.errorImageSquare = ""
        resolve(true)
         if (document.querySelector('.gallery-container').classList.contains('error-image')) {
          document.querySelector('.gallery-container').classList.remove('error-image')
          
        }
        
      } else if ((findOneImageRectangle !== undefined && findOneImageSquare === undefined) || (findOneImageRectangleB64 && !findOneImageSquareB64)) {
        this.errorImageRectangle = ""
        this.errorImageSquare = "Vous devez ajouter au moins une image en mode carrée"
        resolve(false)
        if (!document.querySelector('.gallery-container').classList.contains('error-image')) {
          document.querySelector('.gallery-container').classList.add('error-image')
          
        }
      
      } else if ((findOneImageRectangle === undefined && findOneImageSquare !== undefined) || (!findOneImageRectangleB64 && findOneImageSquareB64)) {
        this.errorImageRectangle = "Vous devez ajouter au moins une image en mode paysage"
        this.errorImageSquare = ""
        resolve(false)
         if (!document.querySelector('.gallery-container').classList.contains('error-image')) {
          document.querySelector('.gallery-container').classList.add('error-image')
          
        }

      } else if ((findOneImageRectangle === undefined && findOneImageSquare === undefined) || (!findOneImageRectangleB64 && !findOneImageSquareB64)) {
        this.errorImageRectangle = "Vous devez ajouter au moins une image en mode paysage"
        this.errorImageSquare = "Vous devez ajouter au moins une image en mode carrée"
        resolve(false)
        if (!document.querySelector('.gallery-container').classList.contains('error-image')) {
          document.querySelector('.gallery-container').classList.add('error-image')
          
        }
      }
    })
      
  }

     openCropperDialog(asset: DISPLAY_ADS_ASSETS) {
    
  }
  cardSelectionEnter(referenceId: number) {
      document.getElementById(referenceId.toString()).getElementsByClassName('e-card-content')[0].classList.remove('d-none')
  }
  cardSelectionLeave(referenceId: number) {
    setTimeout(() => {
      document.getElementById(referenceId.toString()).getElementsByClassName('e-card-content')[0].classList.add('d-none')
      
    },500)
  }

  brandTyping() {
    this.brand = this.secondFormGroup.controls.brand.value
  }

  titleTyping() {
    this.errorTitle = ''
     if (document.getElementById('titleInput').classList.contains('e-error')) {
             document.getElementById('titleInput').classList.remove('e-error')
         }
  }
  public titles = []
  public descriptions = []
  public errorTitle: string = '' 
  public titleShow: string = ""
  public totalSeconds = 0;
  showTitle() {
   /*  this.totalSeconds = 0
    this.zone.runOutsideAngular(() => {
      setInterval(() => {
       if (this.totalSeconds < this.titleChip.chips.length - 1) {
          this.pad(this.titleChip.chips[this.totalSeconds].toString())
          ++this.totalSeconds;
          
       } else if (this.totalSeconds < this.titleChip.chips.length - 1) {
         this.totalSeconds = 0
        } 
      },4000)

    }) */
    
    
  
  }

  pad(val) {
    this.titleShow = val
}
  addTitle() {
    let title = this.secondFormGroup.controls.title.value
    if (this.titleChip.chips.length < 6) {
       if (title !== '') {
         this.titleChip.add(title)
         
         
      this.secondFormGroup.controls.title.reset()
       if (document.getElementById('titleInput').classList.contains('e-error')) {
             document.getElementById('titleInput').classList.remove('e-error')
         }
         this.errorTitle = ''
         this.showTitle()
         
    } else {
       if (!document.getElementById('titleInput').classList.contains('e-error')) {
             document.getElementById('titleInput').classList.add('e-error')
         } 
         this.errorTitle = 'Remplir le champ.'
    }
    } else {
     this.errorTitle = 'Vous ne pouvez pas combiner plus de 5 titres sur une annonce.'
    }
   
  }

    descriptionTyping() {
    this.errorDescription = ''
     if (document.getElementById('descriptionInput').classList.contains('e-error')) {
             document.getElementById('descriptionInput').classList.remove('e-error')
      }
      
  }

  public errorDescription: string = '' 
  addDescription() {
    let description = this.secondFormGroup.controls.description.value
    if (this.descriptionChip.chips.length < 6) {
      if (description !== '') {
        this.descriptionChip.add(description)
         
        this.secondFormGroup.controls.description.reset()
        if (document.getElementById('descriptionInput').classList.contains('e-error')) {
          document.getElementById('descriptionInput').classList.remove('e-error')
        }
        this.errorDescription = ''
      } else {
        if (!document.getElementById('descriptionInput').classList.contains('e-error')) {
          document.getElementById('descriptionInput').classList.add('e-error')
        }
        this.errorDescription = 'Remplir le champ.'
      }
    } else {
      this.errorDescription = 'Vous ne pouvez pas combiner plus de 5 descriptions sur une annonce.'
    }
   
  }

  public focusIn(target: HTMLElement): void {
        target.parentElement.classList.add('e-input-focus');
    }

    public focusOut(target: HTMLElement): void {
      target.parentElement.classList.remove('e-input-focus');
      
    }
    

   
  
  hideDialogAssetsRDAds() {
    this.responiveDisplayAdDialog.hide()
  }

    public currentTemporaryIdNativeAd: string = ''

   showDialogAssetsRDAds() {
    if (this.currentTemporaryIdNativeAd === '') {
      this.currentTemporaryIdNativeAd = new Date().getTime().toString()
      this.responiveDisplayAdDialog.show()
    } else {
       this.responiveDisplayAdDialog.show()
      /* if(this.currentNativeAd[0]) */
    }

  }

   deleteSelectedImage(item: AssetToUse) {
    this.assetsFromCropper.splice(this.assetsFromCropper.indexOf(item), 1)
    this.assetsToUse = this.assetsFromCropper
    if (this.adType === 'native-ads-cropper') {
      this.checkIfImageNotRequired()
      this.getAssets()
      
    } else {
      if (this.assetsToUse.length === 0) {
        if (!document.querySelector('.gallery-container').classList.contains('error-image')) {
          document.querySelector('.gallery-container').classList.add('error-image')
          this.errorImageRectangle = "Aucune image"
          this.getAssetsYoutube()
          
        }
      }
    }
   }

  loadCanvas(url: string, id: string) {
    var img = new Image
    var src = url
    var cvs: any = document.getElementById(id),
    ctx = cvs.getContext('2d');


img.crossOrigin = "Anonymous";


img.onload = function() {
  ctx.drawImage( img, 100, 100 );
  var imgTag: any = document.getElementById('image-'+id);
  var dataURL = cvs.toDataURL();
  imgTag.src = dataURL;
}
    // check if //domain.com or http://domain.com is a different origin
if (/^([\w]+\:)?\/\//.test(src) && src.indexOf(location.host) === -1) {
  /* img.crossOrigin = "anonymous"; */ // or "use-credentials"
}
img.src = src;

return img
}

  setOffsetOnScroll(className: string) {
  var header: any = document.getElementsByClassName(className)[0];
  var second: any = document.querySelector(`.${className}+div`)
// Get the offset position of the navbar
    var sticky = header.offsetTop;
    var sticky2 = second.offsetTop;
    var dx = header.offsetLeft - second.offsetLeft;
    var dy = sticky - sticky2;
    var distance = Math.sqrt(dx * dx + dy * dy);
    //console.log(`dx ${dx} dy ${dy} distance ${distance}`)

  if (distance > 0) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}  
  
  removeSelectedImageBase64(image: ImageBase64) {
     this.croppedImageList.forEach((item, index, arr) => {
      if (item.id === image.id) {
        this.croppedImageList.splice(index, 1)
        
        this.allElements = this.onlyImagesLength() + this.onlyLogosLength()  
        this.tabComponent.items[3].header.text = 'Vos éléments (' + this.allElements + ')'
        let existOnFinal = this.finalCroppedImageList.some(item => item.id === image.id)
        if (existOnFinal) {
          this.finalCroppedImageList.forEach((item, index, arr) => {
            if (item.id === image.id) {
              this.finalCroppedImageList.splice(index, 1)
            }
          })
        }
        let existOnCombined = this.allCombinedAssets.some(item => item.id === image.id)
        if (existOnCombined) {
          this.allCombinedAssets.forEach((item, index, arr) => {
            if (item.id === image.id) {
              this.allCombinedAssets.splice(index, 1)
            }
          })
        }
        this.tabComponent.refresh()
        
      }
    })
  }

  getImagesLength() {
    return this.croppedAssetList.filter(el=>el.usage==='image').length + this.croppedImageList.filter(el=>el.usage==='image').length + this.croppedImageFromWebsiteList.filter(el=>el.usage==='image').length
    
  }
  getLogosLength() {
    return this.croppedAssetList.filter(el=>el.usage==='logo').length + this.croppedImageList.filter(el=>el.usage==='logo').length + this.croppedImageFromWebsiteList.filter(el=>el.usage==='logo').length
    
  }
  selectVideo(video: VIDEO_ASSET) {
    let allready_selected = this.videosSelectedFromSearch.some(item => item.videoId === video.videoId)
    if (this.videosSelectedFromSearch.length <= 14) {
      if (!allready_selected) {
        this.videosSelectedFromSearch.push(video)
        this.tabVideoComponent.items[2].header.text =  'Vos éléments (' +this.videosSelectedFromSearch.length + this.videosSelectedFromRecent.length +')'
        this.tabVideoComponent.refresh()
      }
      
    }
  }

  selectVideoFromRecent(video: VIDEO_ASSET) {
    let exist = this.videosSelectedFromRecent.some(item=>item.videoId===video.videoId)
    if (!exist) {
      this.videosSelectedFromRecent.push(video)
      this.tabVideoComponent.items[2].header.text =  'Vos éléments (' +(this.videosSelectedFromSearch.length + this.videosSelectedFromRecent.length) +')'
        this.tabVideoComponent.refresh()
      
    }
  }

    removeSelectedVideosFromRecent(video: VIDEO_ASSET) {
    this.videosSelectedFromRecent.forEach((item, index, arr)=>{
      if (item.videoId === video.videoId) {
        this.videosSelectedFromRecent.splice(index, 1)
        this.tabVideoComponent.items[2].header.text =
          'Vos éléments (' +( this.videosSelectedFromSearch.length + this.videosSelectedFromRecent.length) + ')'
        this.tabVideoComponent.refresh()
        let existOnFinal = this.finalVideosSelectedFromRecent.some(item => item.videoId === video.videoId)
        if (existOnFinal) {
          this.finalVideosSelectedFromRecent.forEach((item, index, arr) => {
            if (item.videoId === video.videoId) {
              this.finalVideosSelectedFromRecent.splice(index, 1)
            }
          })
        }
        let existOnCombined = this.allCombinedVideos.some(item => item.videoId === video.videoId)
        if (existOnCombined) {
          this.allCombinedVideos.forEach((item, index, arr) => {
            if (video.videoId === video.videoId) {
              this.allCombinedVideos.splice(index, 1)
            }
          })
        }
      }
    })
  }


  removeSelectedVideos(video: VIDEO_ASSET) {
    this.videosSelectedFromSearch.forEach((item, index, arr)=>{
      if (item.videoId === video.videoId) {
        this.videosSelectedFromSearch.splice(index, 1)
        this.tabVideoComponent.items[2].header.text =  'Vos éléments (' +(this.videosSelectedFromSearch.length +this.videosSelectedFromRecent.length) +')'
        this.tabVideoComponent.refresh()
        let existOnFinal = this.finalVideosSelectedFromSearch.some(item => item.videoId === video.videoId)
        if (existOnFinal) {
          this.finalVideosSelectedFromSearch.forEach((item, index, arr) => {
            if (item.videoId === video.videoId) {
              this.finalVideosSelectedFromSearch.splice(index, 1)
            }
          })
        }
        let existOnCombined = this.allCombinedVideos.some(item => item.videoId === video.videoId)
        if (existOnCombined) {
          this.allCombinedVideos.forEach((item, index, arr) => {
            if (video.videoId === video.videoId) {
              this.allCombinedVideos.splice(index, 1)
            }
          })
        }
      }
    })
  }

  removeSelectedAsset(asset: ASSETS_NATIVE) {
    this.croppedAssetList.forEach((item, index, arr) => {
      if (item.id === asset.id) {
        this.croppedAssetList.splice(index, 1)
        this.allElements = this.onlyImagesLength() + this.onlyLogosLength() 
        this.tabComponent.items[3].header.text =  'Vos éléments (' +this.allElements +')'
        let existOnFinal = this.finalCroppedAssetList.some(item => item.id === asset.id)
        if (existOnFinal) {
          this.finalCroppedAssetList.forEach((item, index, arr) => {
            if (item.id === asset.id) {
              this.finalCroppedAssetList.splice(index, 1)
            }
          })
        }
        let existOnCombined = this.allCombinedAssets.some(item => item.id === asset.id)
        if (existOnCombined) {
          this.allCombinedAssets.forEach((item, index, arr) => {
            if (item.id === asset.id) {
              this.allCombinedAssets.splice(index, 1)
            }
          })
        }
        this.tabComponent.refresh()
      }
    })
  }
  removeSelectedFromWebsite(asset: ImageBase64) {
    /* this.searchedFromWebsiteFound */
    this.croppedImageFromWebsiteList.forEach((item, index, arr) => {
      if (item.id === asset.id) {
        this.croppedImageFromWebsiteList.splice(index, 1)
        this.allElements = this.onlyImagesLength() + this.onlyLogosLength() 
         this.tabComponent.items[3].header.text =  'Vos éléments (' +this.allElements +')' 
        let existOnFinal = this.finalCroppedImageFromWebsiteList.some(item => item.id === asset.id)
        if (existOnFinal) {
          this.finalCroppedImageFromWebsiteList.forEach((item, index, arr) => {
            if (item.id === asset.id) {
              this.finalCroppedImageFromWebsiteList.splice(index, 1)
            }
          })
        }
        let existOnCombined = this.allCombinedAssets.some(item => item.id === asset.id)
        if (existOnCombined) {
          this.allCombinedAssets.forEach((item, index, arr) => {
            if (item.id === asset.id) {
              this.allCombinedAssets.splice(index, 1)
            }
          })
        }
        this.tabComponent.refresh()
      }
    })
  }
  private onDestroy$: Subject<void> = new Subject<void>();
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    
}
   public assets: ASSETS_NATIVE[] = [];
  public assetsYoutube: Assets[] = [];
  public spinnerSearchAsset: boolean = false
  getAssets():Promise<string> {
    return new Promise(resolve => {
      this.spinnerSearchAsset = true
      this.assetService.getListAssetsNative(this.aacid).pipe(takeUntil(this.onDestroy$)).subscribe(assets => {
         if (assets !== null) {
           this.assets = assets
           this.spinnerSearchAsset = false
        
         } else {
           this.spinnerSearchAsset = false
      }
      })
    })
  
    
  }

   getAssetsYoutube() {
     this.assetService.getAssetYoutube(this.uid).then(assets => {
      
      this.assetsYoutube = assets
      //////console.log(assets)
     })
  
  
    
  }

  setLogoPreview(url: string) {
    this.rdsSimulation.preview_illustration_logo = url
    this.rdsSimulation.getAverageRGB('image-1')
  }
  setImagePreview(url: string) {
    this.rdsSimulation.preview_illustration = url
    this.rdsSimulation.videoPreviewUrl = ""
    this.rdsSimulation.getAverageRGB('image-1')
  }

  setVideoPreview(videoId: string) {
    this.rdsSimulation.videoPreviewUrl = videoId
    this.rdsSimulation.preview_illustration = ""
    this.rdsSimulation.getAverageRGB('image-1')
  }
  


  intervalExecuteRefresh: any;
  ngAfterViewInit(): void {
     this.searchUrl.valueChanges.pipe(

      // get value
      map((event: any) => {
        return event;
      })
      // if character length greater then 2
      , filter(res => res.toString().length > 2)

      // Time in milliseconds between key events
      , debounceTime(1500)

      // If previous query is diffent from current   
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {

     this.searchFromWebsite()

    })
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    /*  this.urlPromote.subscribe(url=>{
       this.searchUrl.setValue(url)
     }) */
    /* setTimeout(() => {
          if (this.allCombinedAssets.length > 0) {
            setInterval(() => {
              this.refreshPreviewIllustration()
            },10000)
          }
          


      
    }, 500); */
     /* try {
       
       this.intervalExecuteRefresh = setInterval(() => {
              this.refreshPreviewIllustration()
              
            },10000)
     } finally {
       clearInterval(this.intervalExecuteRefresh)
     } */
   }
  
  /* @HostListener('scroll', ['$event']) 
  scrollHandler(event) {

          if (this.tabComponent.selectedItem === 0) {
          this.setOffsetOnScroll('header-upload')
        }else if (this.tabComponent.selectedItem === 1) {
           this.setOffsetOnScroll('gallery-selection-header')
        } else if (this.tabComponent.selectedItem === 2) {
          this.setOffsetOnScroll('search-selection-header')
        }if (this.tabComponent.selectedItem === 3) {
          
        }if (this.tabComponent.selectedItem === 4) {
           this.setOffsetOnScroll('element-selection-header')
        }
        } */

  public _image_to_upload_length: number = 0
   public getImages():Promise<string> {
      return new Promise(resolve => {
        ////console.log(this.filesDetails)
    
        var image_list = document.getElementById('dropArea').getElementsByTagName('ejs-uploader')[0].getElementsByClassName("e-upload")[0].getElementsByTagName('ul')[0].getElementsByTagName("li")
        this._image_to_upload_length = image_list.length
        resolve('ok')
        
      
   })
  }
    
  public onSelect(args: SelectedEventArgs): void {
    
        if (!this.dropElement.querySelector('li')) { this.filesDetails = []; }
        if (isNullOrUndefined(document.getElementById('dropArea').querySelector('.e-upload-files'))) {
            this.parentElement = createElement('ul', { className: 'e-upload-files' });
          document.getElementsByClassName('e-upload')[0].appendChild(this.parentElement);
          
        }
       let validFiles: FileInfo[] = this.validateFiles(args, this.filesDetails);
       
        if (validFiles.length === 0) {
            args.cancel = true;
            return;
        }
        for (let i : number = 0; i < validFiles.length; i++) {
            this.formSelectedData(validFiles[i], this);
        }
       this.filesDetails = this.filesDetails.concat(validFiles);
       /* args.cancel = true */
      
  }

     public validateFiles(args: any, viewedFiles: FileInfo[]): FileInfo[] {
    
    let modifiedFiles: FileInfo[] = [];
    let validFiles: FileInfo[] = [];
    let isModified: boolean = false;
    let allImages: string[] = ['png', 'jpg', 'jpeg', 'gif', 'mp4'];
    if (args.event.type === 'drop') {
      isModified = true;
      let files: FileInfo[] = args.filesData;
      
      for (let file of files) {
       
        if (allImages.indexOf(file.type) !== -1) {
            modifiedFiles.push(file);
        
        
        }
      }
      
    }
    let files: FileInfo[] = modifiedFiles.length > 0 || isModified ? modifiedFiles : args.filesData;
    if (this.filesName.length > 0) {
      for (let file of files) {
          if (allImages.indexOf(file.type) !== -1) {
            if (file.statusCode !== '0') {
              this.filesName.push(file.name);
              validFiles.push(file);
          
            } else {
                this.errorsUpload.push({
                    'name': `${file.name}`,
                    'size': `${file.size}`,
                    'invalid': false
                    
                })

        }
        
          } else {
                this.errorsUpload.push({
                    'name': `${file.name}`,
                    'size': `${file.size}`,
                    'invalid': true,
                    
                })
       
        }
      }
    } else {
      for (let file of files) {
          if (allImages.indexOf(file.type) !== -1) {
            if (file.statusCode !== '0') {
              this.filesName.push(file.name);
              validFiles.push(file);
          
            } else {
                this.errorsUpload.push({
                    'name': `${file.name}`,
                    'size': `${file.size}`,
                    'invalid': false
                    
                })
          
        }
        
          } else {
               this.errorsUpload.push({
                    'name': `${file.name}`,
                    'size': `${file.size}`,
                    'invalid': false
                    
                })
            
        }
      }
    }
    return validFiles;
  }

  public templateDataContent: any = []
  public formSelectedData(file: FileInfo, proxy: any): void {
      let id = new Date().getTime().toString()
        let liEle: HTMLElement = createElement('li', { className: 'e-upload-file-list col-md-4 mr-2', attrs: { 'data-file-name': file.name } });
      liEle.id = id 
      liEle.style.border = 'none'
        liEle.classList.add('pt-3')
        let imageTag: HTMLImageElement = <HTMLImageElement>createElement('IMG', { className: 'upload-image img-fluid', attrs: { 'alt': 'Image' } });
      imageTag.style.maxWidth = '215px'
      imageTag.style.maxHeight = '150px'
        imageTag.style.cursor = 'pointer'
     
      let wrapper: HTMLElement = createElement('span', { className: 'wrapper' });
      wrapper.style.width = '215px'
      wrapper.style.height = '150px'
      wrapper.style.display = 'flex'
      wrapper.style.justifyContent = 'center'
      wrapper.style.alignItems = 'center'
      wrapper.style.backgroundColor = '#ccc'
      wrapper.appendChild(imageTag);


      liEle.appendChild(wrapper);
      liEle.onmouseover = () => {
        
        wrapper.classList.add('selected-shadow')
      }
      liEle.onmouseleave = () => {
        
        wrapper.classList.remove('selected-shadow')
      }
      let imageInfoContainer = createElement('div')
      imageInfoContainer.style.textAlign = 'left'
      imageInfoContainer.style.padding = '20px'
      imageInfoContainer.style.height = '60px'
      imageInfoContainer.style.backgroundColor = '#efefef'
      imageInfoContainer.style.marginBottom = '2rem'
      imageInfoContainer.style.width = '215px'
      let imageInfoSubContainer = createElement('div', { className: 'row' })
      imageInfoSubContainer.style.padding = '8px 0 4px 0'
      let name = createElement('div', { className: 'col-md-12', innerHTML: file.name })
      let size: HTMLElement;

      
        
        size = createElement('div', { className: 'col-md-12', innerHTML: proxy.uploadObj.bytesToSize(file.size) })
      
       
      
      name.style.color = ''
      name.style.fontSize = '13px'
      name.style.fontWeight = '400'
      name.style.color = '#5f6368'
      name.style.fontFamily = 'inherit'
      name.style.margin = '0'
      name.style.overflow = 'hidden'
      name.style.textOverflow = 'ellipsis'
      name.style.whiteSpace = 'nowrap'
      size.style.color = "#999"
      size.style.lineHeight = "22px"
      size.style.fontSize = '11px'
      imageInfoSubContainer.appendChild(name)
      imageInfoSubContainer.appendChild(size)
      
      imageInfoContainer.appendChild(imageInfoSubContainer)
      liEle.appendChild(imageInfoContainer)
      
       /*  liEle.appendChild(createElement('div', {className: 'name file-name', innerHTML: file.name, attrs: {'title': file.name}}));
        liEle.appendChild(createElement('div', {className: 'file-size', innerHTML: proxy.uploadObj.bytesToSize(file.size) })); */
     /*  let clearbtn: HTMLElement;
        let uploadbtn: HTMLElement;
        clearbtn = createElement('span', {id: 'removeIcon', className: 'e-icons e-file-remove-btn', attrs: {'title': 'Remove'}});
        EventHandler.add(clearbtn, 'click', this.removeFiles, proxy);
        liEle.setAttribute('title', 'Ready to Upload');
        uploadbtn = createElement('span', {className: 'e-upload-icon e-icons e-file-remove-btn', attrs: {'title': 'Upload'}});
        uploadbtn.setAttribute('id', 'iconUpload'); EventHandler.add(uploadbtn, 'click', this.uploadFile, proxy); */
        let progressbarContainer: HTMLElement;
    progressbarContainer = createElement('progress', { className: 'progressbar', id: 'progressBar', attrs: { value: '0', max: '100' } });
    progressbarContainer.style.marginTop='4.2rem'
       
        liEle.appendChild(progressbarContainer);
        this.readURL(liEle, file).then(res => {
            if (res === "ok") {
          document.querySelector('.e-upload-files').classList.add('row', 'w-100')
          document.querySelector('.e-upload-files').appendChild(liEle);
          proxy.filesList.push(liEle);
                /* document.querySelector('.e-upload-files').appendChild(liEle);
                proxy.filesList.push(liEle);
                 liEle.querySelector("#"+id).textContent =  */this.widthDisplay.toString() +'x'+this.heightDisplay.toString()
      } else {
                /* this.ToastAdafriComponent.toast.title = "Avertissement !"
            this.ToastAdafriComponent.toast.content = "Image " + file.name + " invalide"
            this.ToastAdafriComponent.toast.cssClass = "e-toast-warning"
            this.ToastAdafriComponent.toast.timeOut = 5000
            this.ToastAdafriComponent.toast.showCloseButton = true
            this.ToastAdafriComponent.toast.show() */
      }
        });
  }
  @ViewChild('cropperNativeDialogImage', {static: false}) dialogCropper: DialogComponent
  public openModalCropper() {
    this.dialogCropper.show()
  }

@Output() imageCropped: EventEmitter<ImageCropped> = new EventEmitter()
  
   
  
 
  
  public uploadFile(args: any): void {
    let name = [this.filesDetails[this.filesList.indexOf(args.currentTarget.parentElement)]][0].name
    let image = document.getElementById('dropArea').querySelector('[data-file-name="' + name + '"]').getElementsByClassName('wrapper')[0].getElementsByTagName('img')[0]
    if (image.id === null || image.id === '' || image.id===undefined) {
      this.uploadObj.upload([this.filesDetails[this.filesList.indexOf(args.currentTarget.parentElement)]], true);
        
    } else {
    
      
      this.assetService.getAssetsWithMediaId(this.uid, parseInt(image.id)).then(asset => {
       /*  this.openCropperDialog(asset) */
          
        })
      }
    }
    public removeFiles(args: any): void {
        let removeFile: FileInfo = this.filesDetails[this.filesList.indexOf(args.currentTarget.parentElement)];
        let statusCode: string = removeFile.statusCode;
        if (statusCode === '2' || statusCode === '1') {
            this.uploadObj.remove(removeFile, true);
            this.uploadObj.element.value = '';
        }
        let index: number = this.filesList.indexOf(args.currentTarget.parentElement);
        this.filesList.splice(index, 1);
        this.filesDetails.splice(index, 1);
        this.filesName.splice(this.filesName.indexOf(removeFile.name), 1);
        if (statusCode !== '2') { detach(args.currentTarget.parentElement); }
    }
  public onFileUpload(args: any): void {
    
    this.getImages().then(res_get_images => {
      if (res_get_images === 'ok') {
      
       /*  this.dialogLoader.show() */
          let li : Element = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
       /*  let iconEle: HTMLElement = li.querySelector('#iconUpload') as HTMLElement; */
 /*        iconEle.style.cursor = 'not-allowed'; */
      /*   iconEle.classList.add('e-uploaded'); */
        /* EventHandler.remove(li.querySelector('#iconUpload'), 'click', this.uploadFile); */
        let progressValue : number = Math.round((args.e.loaded / args.e.total) * 100);
        if (!isNaN(progressValue) && li.querySelector('.progressbar')) {
            li.getElementsByTagName('progress')[0].value = progressValue;
        }
        }
      })
        
  }
  
  public savedMediaId = []
  @Output() assetsIdList: EventEmitter<any> = new EventEmitter()
 
  async onUploadSuccess(args: SuccessEventArgs) {
    
    var result: Assets[] = JSON.parse(args.e['srcElement'].response)
    result[0].owner = this.uid

    await this.assetService.addAsset(result[0]).then(add => {
      if (add) {
        this.savedMediaId.push(result[0].mediaId)

          if (this.savedMediaId.length === this._image_to_upload_length) {
            this.assetsIdList.emit(this.savedMediaId)
            this.assetsIdList.complete()
           /*  this.dialogLoader.hide() */
            this.savedMediaId = []
             if (!this.dropElement.querySelector('ul')) { return; }
              detach(this.dropElement.querySelector('ul'));
              this.filesList = [];
              this.filesDetails = [];
              this.filesName = [];
              if (this.dropElement.querySelector('#dropArea').classList.contains('e-spinner-pane')) {
                  hideSpinner(this.dropElement.querySelector('#dropArea'));
                  detach(this.dropElement.querySelector('.e-spinner-pane'));
              }
          
          }
     /*       let name = args.file.name
      let image = document.getElementById('dropArea').querySelector('[data-file-name="' + name + '"]').getElementsByClassName('wrapper')[0].getElementsByTagName('img')[0]
     
          let spinnerElement: HTMLElement = document.getElementById('dropArea');
      let li: HTMLElement = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
      ////console.log(li.getElementsByClassName('wrapper')[0].getElementsByTagName('img'))
      ////console.log(li.getElementsByClassName('wrapper')[0].getElementsByTagName('img')[0])
      
      li.getElementsByClassName('wrapper')[0].getElementsByTagName('img')[0].id = result[0].mediaId.toString()
  
          if (li && !isNullOrUndefined(li.querySelector('.progressbar'))) {
              (li.querySelector('.progressbar') as HTMLElement).style.visibility = 'hidden';
          }
          if (args.operation === 'upload') {
             
              li.setAttribute('title', args.e['currentTarget'].statusText);
         
            
            
              (li.querySelector('.e-icons') as HTMLElement).onclick = () => {
              
                 let asset: NATIVE_ADS = {mediaId: result[0].mediaId, referenceId: result[0].referenceId,name: result[0].mediaId, width: result[0].width, height: result[0].height, urls: result[0].urls , imagesRectangle: result[0].imagesRectangle, imagesSquare: result[0].imagesSquare, imagesLogo: result[0].imagesLogo}
        this.openCropperDialog(asset)
              };
             ////console.log(args)
         
          } else { 
              
          } */
          
        }
      })

   
    }
    public generateSpinner(targetElement: HTMLElement): void {
        createSpinner({ target: targetElement, width: '25px' });
        showSpinner(targetElement);
    }
  public onUploadFailed(args: any): void {
    --this._image_to_upload_length
    this.dialogLoader.hide()
      /*   let li : Element = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
        (li.querySelector('.file-name') as HTMLElement).style.color = 'red';
        li.setAttribute('title', args.e.currentTarget.statusText)
        if (args.operation === 'upload') {
            EventHandler.remove(li.querySelector('#iconUpload'), 'click', this.uploadFile);
            (li.querySelector('.progressbar') as HTMLElement).style.visibility = 'hidden';
        } */
    }
    public readURL(li: HTMLElement, args: any): Promise<string>{
    return new Promise(resolved => {
      let preview: HTMLImageElement = li.querySelector('.upload-image');
    let file: File = args.rawFile;
      let reader: FileReader = new FileReader();
      
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
     const img = new Image();
      img.src = reader.result as string;
      var height = 0;
          var width = 0
      img.onload = () => {
        height = img.naturalHeight;
          width = img.naturalWidth; 
          this.widthDisplay = img.naturalWidth
        this.heightDisplay = img.naturalHeight
         preview.src = img.src
              
            resolved('ok')
           
     
      /*   for (var i = 0; i < this.listFormat.length; i++){
          if (parseInt(this.listFormat[i].dimensions.split(' ')[0]) === width && parseInt(this.listFormat[i].dimensions.split(' ')[1]) === height) {
             
          } 
        } */
      };
       /*  img.onloadend = () => {
           
        } */
       if (file) {
              reader.readAsDataURL(file)
            }
    }, false);
   })
  }

    public onFileRemove(args: RemovingEventArgs): void {
        args.postRawFile = false;
    }

  
  panelEfficacityOpenState: boolean = true
  spinnerEfficacityValue: number = 50
  efficacityMessage: string = "Excellent"
  searchYoutubeControl: FormControl = new FormControl('')
  spinnerSearchVideos: boolean = false
  videosFinds: VIDEO_ASSET[] = []
  videosFindsFromSearch: VIDEO_ASSET[] = []
  videosSelectedFromSearch: VIDEO_ASSET[] = []
  finalVideosSelectedFromSearch: VIDEO_ASSET[] = []
  recentVideosAssets: VIDEO_ASSET[] = []
  videosSelectedFromRecent: VIDEO_ASSET[] = []
  finalVideosSelectedFromRecent: VIDEO_ASSET[] = []

  getRecentVideosAssets(){
    this.youtubeService.getVideosAssets(this.aacid).pipe(takeUntil(this.onDestroy$)).subscribe(videos => {
      this.recentVideosAssets = videos
    })
  }
  @ViewChild(MatMenuTrigger) triggerVideosMenu: MatMenuTrigger;
  searchYoutubeVideo() {
    this.spinnerSearchVideos = true
    this.triggerVideosMenu.openMenu()
    var is_url: boolean = isURL(this.searchYoutubeControl.value.toString().replace(/\s*$/,""))
    if (is_url) {
       var parse = urlParser.parse(this.searchYoutubeControl.value)
      ////console.log(parse)
      if (parse['provider'].toString() === 'youtube') {
       
        if (parse['mediaType'].toString() === 'channel') {
          //youtube channel
     /*       if (parse['id'] === undefined) {
           alert("L'url ne contient pas l'id de la chaine")
        } else {
          this.youtubeService.searchChannelByID(parse['id']).then(channels => {
            if (channels !== null) {
            this.spinnerSearchVideos = false
              this.channelsFind = this.mergeChannelsInUnique([...this.channelsFind, ...channels], 'channelId')
              this.channels = this.mergeChannelsInUnique([...this.channels, ...channels], 'channelId')
             
          } else {
            this.spinnerSearchVideos = false
          }
          this.spinnerSearchVideos = false
        }).catch((e) => {
          this.spinnerSearchVideos = false
          return;
        })
          
        } */
        } else if (parse['mediaType'].toString() === 'video') {
          if (parse['id'] === undefined) {
            alert("L'url ne contient pas l'id de la video")
          } else {
            this.youtubeService.searchVideoAsset(parse['id'], this.searchYoutubeControl.value.toString().replace(/\s*$/,""), this.aacid).then(videos => {
              if (videos !== null) {
                this.spinnerSearchVideos = false
                this.videosFinds = this.mergeVideosInUnique([...this.videosFinds, ...videos], 'videoId')
                this.triggerVideosMenu.openMenu()
               /*  this.videos = this.mergeVideosInUnique([...this.videos, ...videos], 'videoId')
               this.toggleVideosPanel() */
            } else {
              this.spinnerSearchVideos = false
            }
            this.spinnerSearchVideos = false
          }).catch((e) => {
            this.spinnerSearchVideos = false
            return;
          })
          }
          //youtube video
        }
      } else {
        alert('Veuillez saisir une url youtube valide')
      }
    }
  }

  onVideoSelect(video: VIDEO_ASSET) {
    let alreadySelected = this.videosFindsFromSearch.some(el => el.videoId === video.videoId)
    if (!alreadySelected) {
      this.videosFindsFromSearch.push(video)
      this.videosSelectedFromSearch.push(video)
      this.tabVideoComponent.items[2].header.text =  'Vos éléments (' +this.videosSelectedFromSearch.length +')'
      this.tabVideoComponent.refresh()
    }
    /* let selected = this.matSelectionListVideos.selectedOptions.selected
    let videos: VIDEO_ASSET[] = []
    selected.forEach(video => {
      videos.push(video.value)
      this.videosFindsFromsSearch.push(video)
      this.videosSelectedFromSearch.push(video)
      return videos
    }) */
    
  
  }

  saveFinalVideos() {
    this.finalVideosSelectedFromSearch = this.mergeVideosInUnique([...this.finalVideosSelectedFromSearch, ...this.videosSelectedFromSearch], 'videoId')
    this.finalVideosSelectedFromRecent = this.mergeVideosInUnique([...this.finalVideosSelectedFromRecent, ...this.videosSelectedFromRecent], 'videoId')
    this.allCombinedVideos = this.mergeVideosInUnique([...this.finalVideosSelectedFromSearch, ...this.finalVideosSelectedFromRecent], 'videoId')
    this.selectVideosAdDialog.hide()
     this.rdsSimulation.allCombinedAssets = this.allCombinedAssets
    this.rdsSimulation.allCombinedVideos = this.allCombinedVideos
    this.rdsSimulation.titlesAssets = this.titlesAssets
    this.rdsSimulation.descriptionsAssets = this.descriptionsAssets
    this.rdsSimulation.longHeadlineAssets = this.longHeadlineAssets
    this.rdsSimulation.brandAssets = this.brandAssets
    this.rdsSimulation.setPreviewIllustrationCreation()
  }
  
  mergeChannelsInUnique<YOUTUBE_CHANNELS_INTERFACE>(array: YOUTUBE_CHANNELS_INTERFACE[], property: any): YOUTUBE_CHANNELS_INTERFACE[] {

  const newArray = new Map();

  array.forEach((item: YOUTUBE_CHANNELS_INTERFACE) => {
    const propertyValue = item[property];
    newArray.has(propertyValue) ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) }) : newArray.set(propertyValue, item);
  });

  return Array.from(newArray.values());
  }
  
  mergeVideosInUnique<VIDEO_ASSET>(array: VIDEO_ASSET[], property: any): VIDEO_ASSET[] {

  const newArray = new Map();

  array.forEach((item: VIDEO_ASSET) => {
    const propertyValue = item[property];
    newArray.has(propertyValue) ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) }) : newArray.set(propertyValue, item);
  });

  return Array.from(newArray.values());
}


}
