import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UploaderComponent, FileInfo, RemovingEventArgs, SelectedEventArgs, SuccessEventArgs } from '@syncfusion/ej2-angular-inputs';
import { createElement, Browser, detach, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { hideSpinner, createSpinner, showSpinner } from '@syncfusion/ej2-popups/src/spinner/spinner';
import { PageSettingsModel, RowSelectEventArgs, GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogComponent, PositionDataModel } from '@syncfusion/ej2-angular-popups';

import { SERVER } from 'src/environments/environment';
import { DISPLAY_ADS, VALID_AD_FORMAT_DISPLAY, Assets, User_Role, AdToDelete, AD_FORMAT, DISPLAY_ADS_ASSETS, adDispalyError } from 'src/app/utils/data';
import { Ads, Display } from 'src/app/campaigns-management/models/display.models';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';

import { take } from 'rxjs/operators';

import { AssetsService } from 'src/app/campaigns-management/services/assets.service';

import * as _ from 'lodash';

import { ImagesGalleryComponent } from '../../images-gallery/images-gallery.component';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { SpinnerComponent } from '../../spinner/spinner.component';


@Component({
  selector: 'adf-cmp-ads-uploader-edit',
  templateUrl: './cmp-ads-uploader-edit.component.html',
  styleUrls: ['./cmp-ads-uploader-edit.component.scss']
})
export class CmpAdsUploaderEditComponent implements OnInit {
  defaulClientCustomerId = SERVER.CLIENT_CUSTOMER_ID
  @ViewChild('previewupload', { static: false }) uploadObj: UploaderComponent;
  @ViewChild('gridAds', { static: false }) gridAds: GridComponent;
   @ViewChild('confirmDeleteDialog', { static: false }) confirmDeleteDialog: DialogComponent;
  @ViewChild(SpinnerComponent, { static: false }) spinner: SpinnerComponent;
  @ViewChild(SnackbarComponent, { static: false }) appSnackbar: SnackbarComponent;
  @ViewChild('dialogResizeImages', { static: false }) dialogResizeImages: DialogComponent
  @ViewChild('dialogGalleryImages', { static: false }) dialogGalleryImages: DialogComponent
  @ViewChild(ImagesGalleryComponent, {static: false}) imageGallery: ImagesGalleryComponent
  showCropper: boolean = false
  @Input() only: boolean;
     public dropElement: HTMLElement = undefined;
  public filesName: string[] = [];
  public filesDetailsPreload : FileInfo[] = [];
    public filesDetails : FileInfo[] = [];
    public filesList: HTMLElement[] = [];
    public uploadWrapper: HTMLElement;
    public parentElement: HTMLElement;
    public errorsUploadSize: any = []
  public errorsUploadFormat: any = []
  public adFormat: AD_FORMAT[] = VALID_AD_FORMAT_DISPLAY
  public allowExtensions: string = '.png, .jpg, .jpeg, .jfif, .gif';
    public listFormat = []
    public widthDisplay: number = 0
  public heightDisplay: number = 0
  public width: string = '50%';
  public currentFinalUrl: string = ""
    public visible: Boolean = false;
  public isModal: Boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
   btn: HTMLButtonElement = document.querySelector('idid')
  public uploadBtn: HTMLElement = createElement('button', { className: 'home-button', innerHTML: 'Charger une image' });
         public path: Object = {
       saveUrl: SERVER.url+'/uploadCreatives',
         removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
        
         };
  public imagesDisplay: DISPLAY_ADS[] = []
  public currentImagesDisplay: DISPLAY_ADS[] = []
  ads: Ads[] = []
  aacid: string = ""
  cid: string = undefined
  uid: string = undefined;
  campaignId: number = 0
  ad_group_id: number = 0
  idA: string = ""
  adf_account_id: string = ""
  uid_action: string= ""
  user_access: User_Role;
  panelOpenState = true;
  public initialPage: PageSettingsModel= { pageSize: 5 };
  constructor(private storageService: LocalStorageService, private displayService: DisplayService, private route: ActivatedRoute, private router: Router, private cd: ChangeDetectorRef, private assetsService: AssetsService ) { }

 
  toggleCropper() {
    this.showCropper = !this.showCropper
  }
  ngOnInit(): void {
    for (let format of this.adFormat) {
        this.listFormat.push(format)
    }
    
    this.route.queryParams.subscribe(params => {
        this.storageService.getUserIdAndAccountId().then(response => {
          if (response !== null) {
            this.aacid = response.account.id
            this.user_access  = response.role
            this.uid_action = response.account.owner
            if (response.fromOwned) {
                 if (this.only === undefined) {
              
              this.cid = params['cid'];
                   this.uid = params['auid'];
                   this.getCampaignData()
              
            } else {
              this.cid = params['fidc']
                   this.uid = params['auid']
                   this.getCampaignData()
            }
                
            } else {
              
        
               if (this.only === undefined) {
              
              this.cid = params['cid'];
                 this.uid = params['uid'];
                 this.getCampaignData()
              
            } else {
              this.cid = params['fidc']
                 this.uid = params['auid']
                 this.getCampaignData()
            }
                
              }
           
            
          
          }
          })
    
    })
  }

  adsNotPublishedToDelete: DISPLAY_ADS[] = []
  adsPublishedToDelete: AdToDelete[] = []
  rowSelected(args: RowSelectEventArgs) {
    if(this.campaignId===0){
      const selectedrecords: DISPLAY_ADS[] =  this.gridAds.getSelectedRecords()
      //console.log(selectedrecords)
      this.adsNotPublishedToDelete = Object.entries(selectedrecords).map(([type, value]) => {
          return ({
          ...value
  
        })});
    
      }else{
        const selectedrecords: Object[] =  this.gridAds.getSelectedRecords()
        this.adsPublishedToDelete = Object.entries(selectedrecords).map(([type, value]) => {
          return ({
            id: value['id'],
            ad_id: value['ad_id'],
            ad_group_id: value['ad_group_id']
    
          })});
      
      }
        
    }

 
    loaderEdit: boolean = false
    changeAdStatus(id: string, ad_id: string, status: string, ad_group_id: number) {
    //this.loaderEdit = true
    setTimeout(() => {
      //this.spinner.message = "Traiement en cours..."
      this.displayService.changeAdStatus(id, ad_group_id, ad_id, status).then(res_status => {
        if (res_status === "ok") {
          //this.spinner.message = "Status mis é jour avec succés !"
          //this.loaderEdit = false
        
      }
    })
     
    }, 500);
    
    
  }

  openSnackBar(timeout: number, message: string, action: string, css: string) {
    this.appSnackbar.openSnackBar(timeout, message, action, css)
  }

   /*  removeAd(id: string, ad_id: string, ad_group_id: number) {
    //this.loaderEdit = true
    setTimeout(() => {
      //this.spinner.message = "Suppression en cours..."
       this.displayService.removeAd(id, ad_id, ad_group_id).then(res_remove => {
        if (res_remove === "ok") {
          //this.spinner.message = "Visuel supprimé avec succés"
          //this.loaderEdit = false
        
      }
    })
     
    }, 500);
    
    
  } */

   deleted: boolean = false
  deleteImage(data: DISPLAY_ADS) {
    let mediaId = data.mediaId
    for (let i = 0; i < this.currentImagesDisplay.length; i++) {
      if (this.currentImagesDisplay[i].mediaId === mediaId) {
        this.currentImagesDisplay.splice(this.currentImagesDisplay.indexOf(this.currentImagesDisplay[i]), 1)
        if (!this.deleted) {
          this.deleted=true
          
        }
        }
      }
  }

  deleteAds() {
    
  }
  confirmDelete() {
    
    if (this.campaignId === 0) {
      //console.log(this.adsNotPublishedToDelete)
     let new_images: DISPLAY_ADS[] = this.currentImagesDisplay.filter(ad=>this.adsNotPublishedToDelete.some(nad=>nad.mediaId!==ad.mediaId)) 
     //_.difference(this.currentImagesDisplay, this.adsNotPublishedToDelete)
      
      //this.loaderEdit = true
      setTimeout(() => {
        //this.spinner.message = 'Suppression des éléments en cours'
            this.displayService.updateCampaign(this.cid, { images: new_images }).then(res => {
              if (res === "ok") {
                this.adsNotPublishedToDelete = []
                this.currentImagesDisplay = []
                this.confirmDeleteDialog.hide()
                this.getAdsData()
                this.gridAds.refresh()
                //this.loaderEdit = false
             
        this.getCampaignData()
      }
    })
      }, 500);
    } else {
      let new_image_deleted = _.differenceBy(this.ads, this.adsPublishedToDelete, 'ad_id')
      ////console.log(new_image_deleted)
      let remove: Ads[] = []
      if (new_image_deleted.length === 0) {
        remove = this.ads
      } else {
        remove = new_image_deleted
      }
      ////console.log(remove)
      this.confirmDeleteDialog.hide()
      //this.loaderEdit = true
    setTimeout(() => {
      //this.spinner.message = "Suppression en cours..."
      this.displayService.removeAd(this.adsPublishedToDelete).then(res_remove => {
           ////console.log(res_remove)
          if (res_remove === "ok") {
            //this.spinner.message = "Visuel supprimé avec succés"
            //this.loaderEdit = false
            this.confirmDeleteDialog.hide()
            this.getAdsData()
            this.gridAds.refresh()
            this.openSnackBar(15, 'Suppression éffectuée avec succès', 'ok', 'snack-success')
            
         
          } else {
            //this.loaderEdit = false
           this.openSnackBar(15, 'Une erreur est survenue', 'fermer', 'snack-warn')
       }

         }).catch((e) => {
           //this.loaderEdit = false
           this.openSnackBar(15, 'Une erreur est survenue', 'fermer', 'snack-warn')
      });
    
    }, 500);
    }
  
  }
   triggerDeletion() {
    this.confirmDeleteDialog.show()
  }
  getCampaignData() {
     
   
     this.displayService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
       if (campaign === undefined) {
         this.router.navigate(['/campaigns'])
       } else {
         if (campaign.id_campagne === 0) {
           this.currentImagesDisplay = campaign.images
           /* ////console.log(this.currentImagesDisplay) */
         } else {
           
           this.campaignId = campaign.id_campagne
           this.idA = campaign.ad_group_id_firebase
           this.ad_group_id = campaign.ad_group_id
           this.currentFinalUrl = campaign.urlPromote
           this.getAdsData().then(res => {
             if (res === "ok") {
              /*  let ads = this.ads.some(ad => ad.combinedApprovalStatus === '' || ad.combinedApprovalStatus === "À L'ÉTUDE")
               if (ads) {
                 this.displayService.getAdsPolicy(this.ad_group_id).then(res => {
                    if (res != "error") {
                      var promesse = ""
                      var combined = ""
                      var policy = ""
                      var ad_id = 0
                      for (var i = 0; i < res.length; i++) {
                          combined = res[i]['combinedApprovalStatus']
                          policy = res[i]['policy']
                          ad_id = res[i]['ad_id']
                          this.promiseUpdateSingleAd(this.ad_group_id, ad_id, { combinedApprovalStatus: combined, policy: policy }).then(response => {
                              promesse = response
                          })
                          if (promesse == "ok") {
                            continue
                          }
                      }
                    }
                  })
                 
               } */
             }
           })
         }
       
       }
          })
  }

     promiseReturnAdIsOk(ad_id, data): Promise<any> {
    return new Promise(resolve => {
      this.displayService.updateAd(ad_id, data).then(result => {
        if (result == "ok") {
          resolve("ok")
        }
      })
    })
  }

    promiseUpdateSingleAd(ad_group_id: number, ad_id: number, data): Promise<any> {
      return new Promise(resolve => {
        ////////////console.log(ad_group_id)
        ////////////console.log(ad_id)
        
      this.displayService.getSingleAd(ad_group_id, ad_id).then(ad => {
        ////////////console.log(ad)
        if (ad !== undefined) {
        ////////////console.log(ad)
          
          this.promiseReturnAdIsOk(ad['id'], data).then(response => {
            if (response == "ok") {
              resolve("ok")
            }
          })
        }
      })
    })
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.dropElement = document.getElementsByClassName('control-section')[0] as HTMLElement;
    this.cd.detectChanges()
     setTimeout(() => {
        this.uploadObj.buttons.browse = 'Sélectionner les fichiers à importer'
     var btn = document.querySelector('#previewfileupload > div > div > button')
     /*  btn.setAttribute('nbButton', '') */
       if (btn !== undefined && btn !== null) {
      btn.classList.remove("e-btn")
    btn.classList.remove('e-css')
    btn.classList.add('mat-raised-button','mat-button-base', 'mat-primary', 'btn-upload-images')
   }

  
    
     }, 1000);
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
     this.cd.detectChanges()
  }

    getAdsData():Promise<string>{
      return new Promise(resolve => {
      this.displayService.getListDisplayAdsFormACampaign(this.aacid, this.ad_group_id).subscribe(data => {
        this.ads = data
        this.cd.detectChanges()
          resolve('ok')

          
          /* this.gridCampaign.refresh() */
          /* this.accountsService.getListAccounts(this.uid).subscribe(accounts => {
            this.accounts = accounts
          }) */
       })
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
       args.cancel = true
      
  }

 
  
 
   public validateFiles(args: any, viewedFiles: FileInfo[]): FileInfo[] {
    
    let modifiedFiles: FileInfo[] = [];
    let validFiles: FileInfo[] = [];
    let isModified: boolean = false;
    let allImages: string[] = ['png', 'jpg', 'jpeg', 'gif', 'jfif'];
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

      let liEle: HTMLElement = createElement('li', { className: 'e-upload-file-list col-md-4', attrs: { 'data-file-name': file.name }, id: file.name });
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
              this.cd.detectChanges()
          document.querySelector('.e-upload-files').classList.add('row','w-100')
          document.querySelector('.e-upload-files').appendChild(liEle);
          proxy.filesList.push(liEle);
          
              liEle.querySelector('div > div > div:nth-child(2)').textContent = this.widthDisplay.toString() + 'x' + this.heightDisplay.toString()
              liEle.querySelector('div > div > div:nth-child(2)').classList.add('pb-3')
          } else {
            this.cd.detectChanges()
              return;
          }
        });
  }
  
   
  public uploadFile(args: any): void {
        this.uploadObj.upload([this.filesDetails[this.filesList.indexOf(args.currentTarget.parentElement)]], true);
    }
    public removeFiles(args: any): void {
        let removeFile: FileInfo = this.filesDetails[this.filesList.indexOf(args.currentTarget.parentElement)];
        let statusCode: string = removeFile?removeFile.statusCode:'1';
      if (statusCode === '2' || statusCode === '1') {
         this.uploadObj.remove(removeFile, true);
            this.uploadObj.element.value = '';
        }
        let index: number = this.filesList.indexOf(args.currentTarget.parentElement);
        this.filesList.splice(index, 1);
        this.filesDetails.splice(index, 1);
        removeFile?this.filesName.splice(this.filesName.indexOf(removeFile.name), 1):console.log('removed');
        if (statusCode !== '2') { detach(args.currentTarget.parentElement); }
  }
  public removeFilesData(args: any): void {
        let removeFile: FileInfo = this.filesDetails[this.filesList.indexOf(args)];
        let statusCode: string = removeFile.statusCode;
      if (statusCode === '2' || statusCode === '1') {
         this.uploadObj.remove(removeFile, true);
            this.uploadObj.element.value = '';
        }
        let index: number = this.filesList.indexOf(args);
        this.filesList.splice(index, 1);
        this.filesDetails.splice(index, 1);
        this.filesName.splice(this.filesName.indexOf(removeFile.name), 1);
        if (statusCode !== '2') { detach(args); }
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
        //console.log(formatIsValid)
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
          //console.log("not a valid file: " + file.type);
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
        ////////console.log(this.filesDetails)
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
      
   })
  }
  

  isLastElement: boolean = false

  onUploadFailed(args: any) {
    //console.log(args)
    let li : HTMLElement = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
    setTimeout(() => {
      if (this.filesDetails.length > 0) {
        if (this.filesDetails.length === 1) {
          if (this.imagesDisplay.length > 0) {
            if (this.campaignId === 0) {
              let new_ads: DISPLAY_ADS[] = [...this.currentImagesDisplay, ...this.imagesDisplay]
              this.displayService.updateCampaign(this.cid, { images: new_ads }).then(res_update_campaign => {
                if (res_update_campaign === "ok") {
                  if (this.spinner !== undefined) {
                    
                  }
                  this.openSnackBar(55, "Il y'a eu quelques petits soucis avec certaines de vos images et nous n'avons pas pu les créer nous vous prions de réessayer", 'fermer', 'snack-warning')
                  this.clearUploader()
                } else {
                  this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
                  this.clearUploader()
                }
              })
              
    
            } else {
              this.displayService.addNewAd(this.uid_action, this.aacid, this.ad_group_id, this.currentFinalUrl, "DISPLAY", this.imagesDisplay).then(response => {
                if (response.status === "ok") {
                  this.openSnackBar(5, 'Images enregistrées avec succés', 'ok', 'snack-success')
                  this.clearUploader()
                } else {
                  this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
                  this.clearUploader()
                }
              })
            }
               
          } else {
             this.openSnackBar(55, "Aucunes de vos images n'a été sauvegardé vérifier qu'elles sont valides et que vous disposer d'une connexion puis réessayer.", 'fermer', 'snack-warn')
                  this.clearUploader()
             }
        } else {
          let li: Element = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
          li.remove()
          this.filesDetails.splice(this.filesDetails.indexOf(args.file), 1)
          this.uploadObj.upload(this.filesDetails, true)
        }
      }
      
    }, 500);
    
  
      
    
  }
  
  @Output() uploadedImages: EventEmitter<DISPLAY_ADS[]> =new EventEmitter() 
  @Output() uploadFinish: EventEmitter<boolean> = new EventEmitter()
    public onUploadSuccess(args: SuccessEventArgs): void {
      //console.log(args)
      var result: DISPLAY_ADS[] = JSON.parse(args.e['srcElement'].response)
      var type: string = result[0].type.toString()
      console.log(result)
        //console.log(type)
        if(result[0].name.length===0){
          //console.log(this.filesDetails)
          let name = createElement('div', { className: 'col-md-12 red-color', innerHTML: result[0].type})
          name.style.color = 'red'
          name.style.fontSize = '12px'
          name.style.fontWeight = '400'
          name.style.color = '#5f6368'
          name.style.fontFamily = 'inherit'
          name.style.margin = '0'
          name.style.overflow = 'visible'
          name.style.wordBreak = 'break-word'
          let li = document.querySelectorAll(`[data-file-name="${result[0]['filename']}"`)[0]
          li.querySelector('.progressbar').remove()
          li.querySelector('div > div').appendChild(name)
          this.filesDetails.forEach((_file_, idx)=>{
            if(_file_.name===args.file.name){
              this.filesDetails.splice(idx,1)

              this.cd.detectChanges()
              //console.log(this.filesDetails)
              //this.openSnackBar(60, type, 'ok', 'sanck-error')
              if (this.imagesDisplay.length === this.filesDetails.length) {
                if(this.imagesDisplay.length===0){
                  this.openSnackBar(500, "Veuillez corriger le erreurs", 'ok', '')
                }else{
                  if (this.campaignId === 0) {
                    let new_ads: DISPLAY_ADS[] = [...this.currentImagesDisplay, ...this.imagesDisplay, ...this.selectedImagesFromGallery]
                    this.displayService.updateCampaign(this.cid, { images: new_ads }).then(res_update_campaign => {
                     
                      if (res_update_campaign === "ok") {
                          this.selectedImagesFromGallery = []
                          this.getAdsData()
                          
                          window.location.reload()
                        //this.loaderEdit = false
                        this.openSnackBar(5, 'Images enregistrées avec succés', 'ok', 'snack-success')
                        this.clearUploader()
                        this.cd.detectChanges()
                      } else {
                       //this.spinner.message = "Erreur de traitement"
                        //this.loaderEdit = false
                        this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
                        this.clearUploader()
                        this.cd.detectChanges()
                        
                      }
                    })
                    
          
                  } else {
                    //console.log(this.uid_action)
                      //console.log(this.adf_account_id)
                      //console.log(this.ad_group_id)
                      //console.log(this.currentFinalUrl)
                      //console.log( [...this.imagesDisplay, ...this.selectedImagesFromGallery])
                    this.displayService.addNewAd(this.uid_action, this.aacid, this.ad_group_id, this.currentFinalUrl, "DISPLAY", [...this.imagesDisplay, ...this.selectedImagesFromGallery]).then(response => {
                      this.errorAds = response.partialErrors
                      if (response.status === "ok") {
                        //this.spinner.message = 'Opération réussi avec succés !'
                        //this.loaderEdit = false
                        this.selectedImagesFromGallery = []
                        this.getAdsData()
                        this.openSnackBar(5, 'Images enregistrées avec succés', 'ok', 'snack-success')
                        this.clearUploader()
                      } else {
                        //this.loaderEdit = false
                        this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
                        this.clearUploader()
                      }
                    })
                  }
                }
              }
              
            }
          })
        }else{
          let asset_display: DISPLAY_ADS_ASSETS = {accountId: this.aacid, ...result[0]}
         this.assetsService.addDisplayAd(asset_display).then(() => { 
           this.imagesDisplay.push(result[0])
           this.cd.detectChanges()
           
           if (this.imagesDisplay.length === this.filesDetails.length) {
             if (this.campaignId === 0) {
               let new_ads: DISPLAY_ADS[] = [...this.currentImagesDisplay, ...this.imagesDisplay, ...this.selectedImagesFromGallery]
               this.displayService.updateCampaign(this.cid, { images: new_ads }).then(res_update_campaign => {
                 if (res_update_campaign === "ok") {
                     this.selectedImagesFromGallery = []
                     this.getAdsData()
                     
                 
                   //this.loaderEdit = false
                   this.openSnackBar(5, 'Images enregistrées avec succés', 'ok', 'snack-success')
                   this.clearUploader()
                 } else {
                  //this.spinner.message = "Erreur de traitement"
                   //this.loaderEdit = false
                   this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
                   this.clearUploader()
                 }
               })
               
     
             } else {
               //console.log(this.uid_action)
                 //console.log(this.adf_account_id)
                 //console.log(this.ad_group_id)
                 //console.log(this.currentFinalUrl)
                 //console.log( [...this.imagesDisplay, ...this.selectedImagesFromGallery])
               this.displayService.addNewAd(this.uid_action, this.aacid, this.ad_group_id, this.currentFinalUrl, "DISPLAY", [...this.imagesDisplay, ...this.selectedImagesFromGallery]).then(response => {
                this.errorAds = response.partialErrors 
                if (response.status === "ok") {
                   //this.spinner.message = 'Opération réussi avec succés !'
                   //this.loaderEdit = false
                   this.selectedImagesFromGallery = []
                   this.getAdsData()
                   this.openSnackBar(15, 'Images enregistrées avec succés', 'ok', 'snack-success')
                   this.clearUploader()
                     response.partialErrors.forEach((err)=>{
                       this.openSnackBar(500, "Quelques annones n'ont pas été sauvegardés erreur: "+err.policyDescription, 'ok', '')

                     })
                   
                 } else {
                   //this.loaderEdit = false
                   this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
                   this.clearUploader()
                  
                 }
               })
             }
           }
   
         })

        }

    }
  errorAds: adDispalyError[]= []
   uploadDisplayImages() {

     if (this.selectedImagesFromGallery.length > 0) {
       this.getImages().then(res_get_images => {
     if (res_get_images === "ok") {
    
             //this.spinner.message = "Création des annonces en cours"
             this.uploadObj.upload(this.filesDetails, true)
            
         } else if(res_get_images==='length'){
          this.openSnackBar(8, 'Vous ne pouvez pas importer plus de 8 visules', 'ok', '')
         } else{
       if (this.campaignId === 0) {
         this.displayService.updateCampaign(this.cid, { images: [...this.selectedImagesFromGallery, ...this.currentImagesDisplay] }).then(res_update_campaign => {
           if (res_update_campaign === "ok") {
             this.selectedImagesFromGallery = []
         this.getAdsData()
        this.selectedImagesFromGallery = []
        this.gridAds.refresh()
        //this.loaderEdit = false
        this.openSnackBar(5, 'Images enregistrées avec succés', 'ok', 'snack-success')
        this.clearUploader()
        this.getAdsData()
      } else {
       //this.spinner.message = "Erreur de traitement"
        //this.loaderEdit = false
        this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
        this.clearUploader()
      }
         }).catch((e) => {
       this.openSnackBar(15, "Une erreur est survenue", "ok", "snack-error")
    })
             
       } else {
        //console.log(this.uid_action)
        //console.log(this.aacid)
        //console.log(this.ad_group_id)
        //console.log(this.currentFinalUrl)
        //console.log(this.selectedImagesFromGallery)
             this.displayService.addNewAd(this.uid_action, this.aacid, this.ad_group_id, this.currentFinalUrl, "DISPLAY", this.selectedImagesFromGallery).then(response => {
            console.log(response)
            this.errorAds = response.partialErrors
              if (response.status === "ok") {
              //this.spinner.message = 'Opération réussi avec succés !'
              //this.loaderEdit = false
              this.selectedImagesFromGallery = []
              this.openSnackBar(5, 'Images enregistrées avec succés', 'ok', 'snack-success')
              this.clearUploader()
              this.getAdsData()
              this.gridAds.refresh()
            
            } else {
              //this.loaderEdit = false
              this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
              this.clearUploader()
     
            }
             }).catch((e) => {
               console.log(e)
             this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
             
          })
           }
        }
    
       }).catch((e) => {
           if (this.campaignId === 0) {
         this.displayService.updateCampaign(this.cid, { images: [...this.selectedImagesFromGallery, ...this.currentImagesDisplay] }).then(res_update_campaign => {
      if (res_update_campaign === "ok") {
        
        //this.loaderEdit = false
        this.openSnackBar(5, 'Images enregistrées avec succés', 'ok', 'snack-success')
        this.clearUploader()
         this.getAdsData()
        this.selectedImagesFromGallery = []
        this.gridAds.refresh()
      } else {
       //this.spinner.message = "Erreur de traitement"
        //this.loaderEdit = false
        this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
        this.clearUploader()
      }
         }).catch((e) => {

       this.openSnackBar(15, "Une erreur est survenue", "ok", "snack-error")
    })
             
       } else {
             this.displayService.addNewAd(this.uid_action, this.aacid, this.ad_group_id, this.currentFinalUrl, "DISPLAY", this.selectedImagesFromGallery).then(response => {
              this.errorAds = response.partialErrors
              if (response.status === "ok") {
              //this.spinner.message = 'Opération réussi avec succés !'
              //this.loaderEdit = false
              this.openSnackBar(5, 'Images enregistrées avec succés', 'ok', 'snack-success')
              this.clearUploader()
               this.getAdsData()
        this.selectedImagesFromGallery = []
        this.gridAds.refresh()
       
            } else {
              //this.loaderEdit = false
              this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
              this.clearUploader()
              this.errorAds = response.partialErrors
            }
             }).catch((e) => {
               console.log(e)
             this.openSnackBar(15, "Une erreur est survenue !", "ok", "snack-error")
          })
           }
        })
    } else {
       this.getImages().then(res_get_images => {
     if (res_get_images === "ok") {
        
             this.uploadObj.upload(this.filesDetails, true)
            
  
         } else {
           this.uploadFinish.emit(false)
        }
    
    }).catch((e)=>{
      this.uploadFinish.emit(false)
    })
    }
  }
  saveNewAds() {
    if (this.selectedImagesFromGallery.length > 0) {
       this.getImages().then(res_get_images => {
     if (res_get_images === "ok") {
           //this.loaderEdit = true
           setTimeout(() => {
             //this.spinner.message = "Création des annonces en cours"
             this.uploadObj.upload(this.filesDetails, true)
            
             
           }, 500);
         } else {
       if (this.campaignId === 0) {
         this.displayService.updateCampaign(this.cid, { images: this.selectedImagesFromGallery }).then(res_update_campaign => {
      if (res_update_campaign === "ok") {
        this.getAdsData()
        this.selectedImagesFromGallery = []
        this.gridAds.refresh()
        //this.loaderEdit = false
        this.openSnackBar(5, 'Images enregistrées avec succés', 'ok', 'snack-success')
        this.clearUploader()
      } else {
       //this.spinner.message = "Erreur de traitement"
        //this.loaderEdit = false
        this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
        this.clearUploader()
      }
    })
             
       } else {
             this.displayService.addNewAd(this.uid_action, this.aacid, this.ad_group_id, this.currentFinalUrl, "DISPLAY", this.selectedImagesFromGallery).then(response => {
              this.errorAds = response.partialErrors
              if (response.status === "ok") {
              //this.spinner.message = 'Opération réussi avec succés !'
              //this.loaderEdit = false
              this.openSnackBar(5, 'Images enregistrées avec succés', 'ok', 'snack-success')
              this.clearUploader()
        

            } else {
              //this.loaderEdit = false
              this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
              this.clearUploader()
     
            }
          })
           }
        }
    
       }).catch((e) => {
           if (this.campaignId === 0) {
         this.displayService.updateCampaign(this.cid, { images: this.selectedImagesFromGallery }).then(res_update_campaign => {
      if (res_update_campaign === "ok") {
        if (this.spinner !== undefined) {
          //this.spinner.message = "Opération terminée"
          
        }
        //this.loaderEdit = false
        this.openSnackBar(5, 'Images enregistrées avec succés', 'ok', 'snack-success')
        this.clearUploader()
      } else {
       //this.spinner.message = "Erreur de traitement"
        //this.loaderEdit = false
        this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
        this.clearUploader()
      }
    })
             
       } else {
             this.displayService.addNewAd(this.uid_action, this.aacid, this.ad_group_id, this.currentFinalUrl, "DISPLAY", this.selectedImagesFromGallery).then(response => {
              this.errorAds = response.partialErrors
              if (response.status === "ok") {
              //this.spinner.message = 'Opération réussi avec succés !'
              //this.loaderEdit = false
              this.openSnackBar(5, 'Images enregistrées avec succés', 'ok', 'snack-success')
              this.clearUploader()
            } else {
              //this.loaderEdit = false
              this.openSnackBar(5, 'Une erreur est survenue veuillez réessayer', 'ok', 'snack-error')
              this.clearUploader()
            }
          })
           }
        })
    } else {
       this.getImages().then(res_get_images => {
     if (res_get_images === "ok") {
           //this.loaderEdit = true
           setTimeout(() => {
             //this.spinner.message = "Création des annonces en cours"
             this.uploadObj.upload(this.filesDetails, true)
            
             
           }, 500);
         } else {
           this.uploadFinish.emit(false)
        }
    
    }).catch((e)=>{
      this.uploadFinish.emit(false)
    })
    }
   
  }

}
