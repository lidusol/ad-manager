import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { UploaderComponent, FileInfo, RemovingEventArgs, SelectedEventArgs, SuccessEventArgs } from '@syncfusion/ej2-angular-inputs';
import { createElement, Browser, detach, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { SERVER } from 'src/environments/environment';
import { hideSpinner, createSpinner, showSpinner } from '@syncfusion/ej2-popups/src/spinner/spinner';
import { DISPLAY_ADS, VALID_AD_FORMAT_YOUTUBE, Assets, AD_FORMAT, DISPLAY_ADS_ASSETS } from 'src/app/utils/data';
import { PositionDataModel } from '@syncfusion/ej2-popups';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { AssetsService } from 'src/app/campaigns-management/services/assets.service';
import { ImagesGalleryComponent } from '../../images-gallery/images-gallery.component';
import { SnackbarComponent } from '../../snackbar/snackbar.component';

@Component({
  selector: 'adf-cmp-ads-uploader-youtube',
  templateUrl: './cmp-ads-uploader-youtube.component.html',
  styleUrls: ['./cmp-ads-uploader-youtube.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CmpAdsUploaderYoutubeComponent implements OnInit {
  @ViewChild('previewupload', { static: false }) uploadObj: UploaderComponent;
  @Input() only: boolean = undefined;
  @ViewChild(ImagesGalleryComponent, { static: false }) imageGallery: ImagesGalleryComponent
  @ViewChild(SnackbarComponent, { static: false }) appSnackbar: SnackbarComponent;
  @ViewChild('dialogGalleryImages', { static: false }) dialogGalleryImages: DialogComponent
     public dropElement: HTMLElement;
    public filesName: string[] = [];
  public filesDetails: FileInfo[] = [];
  public filesDetailsPreload : FileInfo[] = [];
    public filesList: HTMLElement[] = [];
    public uploadWrapper: HTMLElement;
    public parentElement: HTMLElement;
  public errorsUploadSize: any = []
  public errorsUploadFormat: any = []
  
  public adFormat: AD_FORMAT[] = VALID_AD_FORMAT_YOUTUBE
  public allowExtensions: string = '.png, .jpg, .jpeg';
    public listFormat = []
    public widthDisplay: number = 0
  public heightDisplay: number = 0
  public width: string = '50%';
   btn: HTMLButtonElement = document.querySelector('idid')
  public uploadBtn: HTMLElement = createElement('button', { className: 'home-button', innerHTML: 'Charger une image' });
         public path: Object = {
       saveUrl: SERVER.url+'/uploadCreatives',
         removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
        
         };
  public imagesDisplay: DISPLAY_ADS[] = []
    public visible: Boolean = false;
  public isModal: Boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  public aacid: string = ""
  showCropper: boolean = false
  toggleCropper() {
    this.showCropper = !this.showCropper
  }
  @ViewChild('dialogResizeImages', {static: false}) dialogResizeImages: DialogComponent
  constructor(private cd: ChangeDetectorRef, private assetsService: AssetsService) { }

  ngOnInit(): void {
    for (let format of this.adFormat) {
        this.listFormat.push(format)
      }
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
           this.dropElement = document.getElementsByClassName('control-section')[0] as HTMLElement;
      setTimeout(() => {
        this.uploadObj.buttons.browse = 'Sélectionner les images à importer'
     var btn = document.querySelector('#previewfileupload > div > div > button')
     /*  btn.setAttribute('nbButton', '') */
   if (btn !== undefined && btn !== null) {
      btn.classList.remove("e-btn")
    btn.classList.remove('e-css')
    btn.classList.add('mat-raised-button','mat-button-base', 'mat-accent', 'btn-upload-images')
   }
      }, 500);
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

 /*    this.validFiles.forEach(async(file, i,)) */

        for (let i : number = 0; i < validFiles.length; i++) {
            this.formSelectedData(validFiles[i], this);
        }
    this.filesDetails = this.filesDetails.concat(validFiles);
    this.filesDetailsPreload = this.filesDetails.concat(validFiles);
       args.cancel = true
      
  }

 
  
 
   public validateFiles(args: any, viewedFiles: FileInfo[]): FileInfo[] {
    
    let modifiedFiles: FileInfo[] = [];
    let validFiles: FileInfo[] = [];
    let isModified: boolean = false;
    let allImages: string[] = ['png', 'jpg', 'jpeg', 'gif'];
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
                this.errorsUploadSize.push({
                    'name': `${file.name}`,
                    'size': `${file.size}`,
                    'invalid': false
                    
                })

        }
        
          } else {
                this.errorsUploadSize.push({
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
                this.errorsUploadSize.push({
                    'name': `${file.name}`,
                    'size': `${file.size}`,
                    'invalid': false
                    
                })
          
        }
        
          } else {
               this.errorsUploadSize.push({
                    'name': `${file.name}`,
                    'size': `${file.size}`,
                    'invalid': false
                    
                })
            
        }
      }
    }
    return validFiles;
  }

 
    public formSelectedData (file : FileInfo, proxy: any): void {
      var array = ["Image","Logo"];

//Create and append select list

      let liEle: HTMLElement = createElement('li', { className: 'e-upload-file-list col-md-4', attrs: { 'data-file-name': file.name } });
      let id = new Date().getTime().toString()
      liEle.id = id 
      liEle.style.border = 'none'
      liEle.style.maxHeight="260px"
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
      let clearbtn: HTMLElement;
      clearbtn = createElement('span', {id: 'removeIcon', className: 'e-icons e-file-remove-btn', attrs: {'title': 'Remove'}});
      EventHandler.add(clearbtn, 'click', this.removeFiles, proxy);
      liEle.appendChild(clearbtn)
      liEle.onmouseover = () => {
        wrapper.classList.add('adf-mat-shadow')
      }
      liEle.onmouseleave = () => {
        wrapper.classList.remove('adf-mat-shadow')
      }
      let imageInfoContainer = createElement('div')
      imageInfoContainer.style.textAlign = 'left'
      imageInfoContainer.style.padding = '20px'
      imageInfoContainer.style.height = '70px'
      imageInfoContainer.style.backgroundColor = '#efefef'
      imageInfoContainer.style.marginBottom = '2rem'
      imageInfoContainer.style.width = '215px'
      let imageInfoSubContainer = createElement('div', { className: 'row' })
      imageInfoSubContainer.style.padding = '8px 0 4px 0'
      let progressbarContainer: HTMLElement;
      progressbarContainer = createElement('progress', { className: 'progressbar', id: 'progressBar', attrs: { value: '0', max: '100' } });
      progressbarContainer.style.marginTop='4.2rem'
      let name = createElement('div', { className: 'col-md-12', innerHTML: file.name })
      let size: HTMLElement
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
        liEle.appendChild(progressbarContainer);
        this.readURL(liEle, file).then(res => {
          if (res === "ok") {
            
              //this.cd.detectChanges()
          document.querySelector('.e-upload-files').classList.add('row','w-100')
          document.querySelector('.e-upload-files').appendChild(liEle);
          proxy.filesList.push(liEle);
          
              liEle.querySelector('div > div > div:nth-child(2)').textContent = this.widthDisplay.toString() + 'x' + this.heightDisplay.toString()
              liEle.querySelector('div > div > div:nth-child(2)').classList.add('pb-3')
            } else {
            console.log('image invalid')
            //this.cd.detectChanges()
              return;
          }
        });
  }
  
   
  public uploadFile(args: any): void {
        this.uploadObj.upload([this.filesDetails[this.filesList.indexOf(args.currentTarget.parentElement)]], true);
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
    public onFileUpload(args : any) : void {
        let li : Element = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
       /*  let iconEle: HTMLElement = li.querySelector('#iconUpload') as HTMLElement;
        iconEle.style.cursor = 'not-allowed';
        iconEle.classList.add('e-uploaded');
        EventHandler.remove(li.querySelector('#iconUpload'), 'click', this.uploadFile); */
        let progressValue : number = Math.round((args.e.loaded / args.e.total) * 100);
        if (!isNaN(progressValue) && li.querySelector('.progressbar')) {
            li.getElementsByTagName('progress')[0].value = progressValue;
        }
  }


    public generateSpinner(targetElement: HTMLElement): void {
        createSpinner({ target: targetElement, width: '25px' });
        showSpinner(targetElement);
  }
  
   clearUploader() {
    
           if (!this.dropElement.querySelector('ul')) { return; }
            detach(this.dropElement.querySelector('ul'));
            this.filesList = [];
            this.filesDetails = [];
     this.filesName = [];
     this.imagesDisplay = []
     this._image_to_upload_length = 0
            if (this.dropElement.querySelector('#dropArea').classList.contains('e-spinner-pane')) {
                hideSpinner(this.dropElement.querySelector('#dropArea'));
                detach(this.dropElement.querySelector('.e-spinner-pane'));
     }
     //this.cd.detectChanges()
  }
  public onUploadFailed(args: any): void {
    try{
      let li : HTMLElement = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
    console.log(args)    
    setTimeout(() => {
      if (this.filesDetails.length > 0) {
        if (this.filesDetails.length === 1) {
          console.log(this.imagesDisplay.length)
          if (this.imagesDisplay.length > 0) {
            
            this.uploadFinish.emit(true)
            this.clearUploader()
               
          } else {
            this.uploadFinish.emit(true)
            this.clearUploader()
            /* this.loaderEdit = false
             this.openSnackBar(55, "Aucunes de vos images n'a été sauvegardé vérifier qu'elles sont valides et que vous disposer d'une connexion puis réessayer.", 'fermer', 'snack-warn')
                  this.clearUploader() */
             }
        } else {
          console.log(this._image_to_upload_length)
    
          let li: Element = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
          li.remove()
          this.filesDetails.splice(this.filesDetails.indexOf(args.file), 1)
          //this.cd.detectChanges()
          this.uploadObj.upload(this.filesDetails, true)
        }
      }
      
    }, 500);
    } catch (err) {
      this.uploadFinish.emit(true)
      this.clearUploader()
    }
        
    }
      public readURL(li: HTMLElement, args: any): Promise<string>{
        return new Promise(resolved => {
      var _URL = window.URL || window.webkitURL;
      let preview: HTMLImageElement = li.querySelector('.upload-image');
    let file: File = args.rawFile;
      let reader: FileReader = new FileReader();
      
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
     const img = new Image();
      img.src = reader.result as string;
      var self = this
      img.onload = function () {
        let height = img.naturalHeight;
        let width = img.naturalWidth;
        self.widthDisplay = img.naturalWidth
        self.heightDisplay = img.naturalHeight
        let formatIsValid = self.adFormat.some(ad => ad.width === width && ad.height === height)
        console.log(formatIsValid)
        if (formatIsValid) {
          preview.src = _URL.createObjectURL(file);
          formatIsValid = false
          resolved('ok')
        } else {
          
          self.errorsUploadFormat.push({
                    'name': `${file.name}`,
                    'width': width,
                    'height': height,            
          })
          resolved('error')
        };
      }
        img.onerror = function () {
          console.log("not a valid file: " + file.type);
          resolved('error')
        };
    
    }, true);
   })
  }

    public onFileRemove(args: RemovingEventArgs): void {
        args.postRawFile = false;
    }
  
    public _image_to_upload_length: number;  
  public getImages():Promise<string> {
      return new Promise(resolve => {
        ////console.log(this.filesDetails)
    
      if (document.getElementById('dropArea').getElementsByTagName('ejs-uploader')[0].getElementsByClassName("e-upload")[0].getElementsByTagName('ul')[0] !== undefined) {
          var image_list = document.getElementById('dropArea').getElementsByTagName('ejs-uploader')[0].getElementsByClassName("e-upload")[0].getElementsByTagName('ul')[0].getElementsByTagName("li")
          this._image_to_upload_length = image_list.length
          if (this._image_to_upload_length > 0) {
            resolve('ok')
          } else {
            resolve('error')
          }
          
        } else {
          resolve('error')
        }
     /*  for (var i = 0; i < image_list.length; i++){
          var image = image_list[i].getElementsByClassName('wrapper')[0].getElementsByTagName('img')[0]
          
      this.IMAGE_LIST.push({ "data": image.src, "name": image_list[i].getElementsByClassName('name')[0].getAttribute('title'), "width": image.naturalWidth, "height": image.naturalHeight})
          
    } */
      
   })
  }
  
  imageGalleryOpened(args: any) {
    if (this.selectedImagesFromGallery.length > 0) {
      this.imageGallery.getListAssetsDisplay(this.aacid).then(response => {
        if (response === 'ok') {
          setTimeout(() => {
            this.imageGallery.preselectImage(this.selectedImagesFromGallery)
      
            
          },500)
            
          }
       })
     } else {
       this.imageGallery.getListAssetsDisplay(this.aacid)
       
         }
  }
  selectedImagesFromGallery: DISPLAY_ADS[]= []
  saveDisplayFromGallery() {
    if (this.imageGallery.selectedAssetsDisplay.length > 0) {
      this.selectedImagesFromGallery = this.imageGallery.selectedAssetsDisplay
      this.dialogGalleryImages.hide()
    } else {
      this.selectedImagesFromGallery = []
      this.dialogGalleryImages.hide()
       this.openSnackBar(15, 'Aucune image sélectionnée !', 'fermer', 'snack-warn')
    }
  }

   openSnackBar(timeout: number, message: string, action: string, css: string) {
    this.appSnackbar.openSnackBar(timeout, message, action, css)
  }
  @Output() uploadedImages: EventEmitter<DISPLAY_ADS[]> =new EventEmitter() 
  @Output() uploadFinish: EventEmitter<boolean> = new EventEmitter()
    public onUploadSuccess(args: SuccessEventArgs): void {
        var result: DISPLAY_ADS[] = JSON.parse(args.e['srcElement'].response)
      this.imagesDisplay.push(result[0])
      let asset_display: DISPLAY_ADS_ASSETS = {accountId: this.aacid, ...result[0]}
      this.assetsService.addDisplayAd(asset_display).then(() => {
        //this.cd.detectChanges()
      if (this.imagesDisplay.length === this.filesDetails.length) {
        this.uploadFinish.emit(true)
        this.uploadedImages.emit(this.imagesDisplay)
        this.uploadedImages.complete()
        this.uploadFinish.complete()
      }
      }).catch((e) => {
        //this.cd.detectChanges()
      if (this.imagesDisplay.length === this.filesDetails.length) {
        this.uploadFinish.emit(true)
        this.uploadedImages.emit(this.imagesDisplay)
        this.uploadedImages.complete()
        this.uploadFinish.complete()
      }
      })
    }
  
   uploadDisplayImages(): Promise<string> {
     return new Promise(resolve => {
       this.getImages().then(res_get_images => {
         if (res_get_images === "ok") {
           this.uploadObj.upload(this.filesDetails, true)
           resolve('ok')  
         } else {
           resolve('error')
        }
      })
    }
    
    )
  }

}
