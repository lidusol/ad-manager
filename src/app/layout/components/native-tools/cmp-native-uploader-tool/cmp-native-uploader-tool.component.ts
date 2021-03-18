import { Component, ViewChild, ViewEncapsulation, OnInit, Inject, ChangeDetectorRef, EventEmitter, Output, ViewChildren, QueryList } from '@angular/core';

import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { CropperComponent } from 'angular-cropperjs';
import { Subject } from 'rxjs'
import { UploaderComponent, SelectedEventArgs, FileInfo, RemovingEventArgs, SuccessEventArgs, UploadingEventArgs, BeforeUploadEventArgs, UploadChangeEventArgs } from '@syncfusion/ej2-angular-inputs';
import { createSpinner, showSpinner, hideSpinner, PositionDataModel } from '@syncfusion/ej2-popups';
import { EmitType, detach, Browser, createElement, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { LyDialog } from '@alyle/ui/dialog';
import { ImgCropperEvent } from '@alyle/ui/image-cropper/image-cropper';
import * as _ from 'lodash'
import { SERVER } from 'src/environments/environment';
import { NATIVE_ADS, ImageCropped, Assets, AD_FORMAT, VALID_AD_FORMAT_DISPLAY } from 'src/app/utils/data';
import { AssetsService } from 'src/app/campaigns-management/services/assets.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CropperRectangleDialogComponent } from '../cropper-rectangle-dialog/cropper-rectangle-dialog.component';
import * as $ from 'jquery'
@Component({
  selector: 'adf-cmp-native-uploader-tool',
  templateUrl: './cmp-native-uploader-tool.component.html',
  styleUrls: ['./cmp-native-uploader-tool.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CmpNativeUploaderToolComponent implements OnInit {


  @ViewChildren('angularCropper') public angularCropper: QueryList<CropperComponent>;
  form: FormGroup;
  files: FormArray;
  configs: Array<any> = [];
  cropperClass = new Subject<Array<string>>();
  filesGenerated: Array<any> = [];
  generating: boolean = false;


  @ViewChild('previewupload', { static: false }) uploadObj: UploaderComponent;
   
  @ViewChild('dialogLoader', { static: false }) dialogLoader: DialogComponent
   public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  public visible: boolean = false

    public path: Object = {
        saveUrl: SERVER.url+'/uploadCreatives',
         removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    };
  public cropped?: string;
    public allowExtensions: string = '.png, .jpg, .jpeg, .gif';

    public dropElement: HTMLElement;
    public filesName: string[] = [];
    public filesDetails : FileInfo[] = [];
    public filesList: HTMLElement[] = [];
    public uploadWrapper: HTMLElement;
    public parentElement: HTMLElement;
    public adFormat: AD_FORMAT[] = VALID_AD_FORMAT_DISPLAY
    public listFormat = []
    public widthDisplay: number = 0
    public heightDisplay: number = 0
  public errorsUpload: any = []
  public uid: string = ""


  public urlToCrop: string = ""
  @ViewChild('cropperNativeDialogImage', {static: false}) dialogCropper: DialogComponent

    ngOnInit(): void {
        this.dropElement = document.getElementsByClassName('control-section')[0] as HTMLElement;
        if (Browser.isDevice) { document.getElementById('dropimage').style.padding = '0px 10%'; }
       
      for (let format of this.adFormat) {
        this.listFormat.push(format)
      }
    }
  
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
        this.uploadObj.buttons.browse = 'Importer les images à redimensionner'
           var btn = document.querySelector('#previewfileupload > div > div > button')
     /*  btn.setAttribute('nbButton', '') */
      btn.classList.add("e-primary")
    }, 500);
  }

  public _image_to_upload_length: number = 0
   public getImages():Promise<string> {
      return new Promise(resolve => {
        //console.log(this.filesDetails)
    
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
  public openModalCropper() {
    this.dialogCropper.show()
  }

@Output() imageCropped: EventEmitter<ImageCropped> = new EventEmitter()
  
     openCropperDialog(asset: NATIVE_ADS) {
    this.cropped = null!;
    this._dialog.open<CropperRectangleDialogComponent, NATIVE_ADS>(CropperRectangleDialogComponent, {
      data: asset,
      width: 1000,
      disableClose: false,
    }).afterClosed.subscribe((result) => {
      this.imageCropped.emit(result)
      document.getElementsByClassName('y-overlay-e')[0].classList.add('d-none')
      
     
    });
     }
  
 
  
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
  
       if (file) {
              reader.readAsDataURL(file)
            }
    }, false);
   })
  }

    public onFileRemove(args: RemovingEventArgs): void {
        args.postRawFile = false;
    }
  constructor(  private _dialog: LyDialog,
    private _cd: ChangeDetectorRef, public assetService: AssetsService, private auth: AuthService,  private formBuilder: FormBuilder) {
    this.auth.user.subscribe(data => {
      if (data !== null) {
        this.uid = data.uid
        
      }
      this.form = this.formBuilder.group({
      files: this.formBuilder.array([])
    })
    })
  }
  removeSelectedAsset(asset) {
    
  }
  DOCUMENT = document
  imageList: any = []
   async onFileChange(event) {
    this.form.setControl('files', this.formBuilder.array([]));
    this.configs = [];
    if (event.target.files && event.target.files.length > 0) {
      for(var i = 0; i < event.target.files.length; i++){
        try {
          let contentBuffer = await this.readFileAsync(event.target.files[i]);
          await this.addFile({ 'file': contentBuffer.toString() });
          await this.configs.push({
            viewMode: 1,
            aspectRatio: NaN,
            preview: '#img-preview' + i,
            zoomOnWheel: true,
            autoCropArea: 1,
            zoomable: true,
            checkOrientation: false,
          });
         

            var img = document.createElement("img");
          img.id = "image" + (i + 1);
          var self = this
            var reader = new FileReader();
             reader.onload =  function (){
              img.src = reader.result.toString();
                self.imageList.push({
                urls: img.src,
                width: img.width,
                height: img.height
              })
          };
            reader.readAsDataURL(event.target.files[i]);
            /* $("#image"+i).after(img);
       
          await this.changeCropperFile(0) */
        } catch(err) {
          console.log(err);
        }
      }
    } else {
      console.log('Selected at least one file');
    }
  }

  readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    })
  }

  addFile(file){
    this.files = this.form.get('files') as FormArray;
    this.files.push(this.createFile(file));
  }

  createFile(file): FormGroup {
    return this.formBuilder.group({
      data: file
    });
  }

  async changeCropperFile(index){
    this.angularCropper.toArray().forEach((cropper, i) => {
      if(index === i){
        this.cropperClass[i] = 'show';
      } else {
        this.cropperClass[i] = 'hide';
      }
    })
  }

  getCropperClassObservable(index){
    return this.cropperClass.asObservable().source[index];
  }

  async generate(){
    this.generating = true;
    this.filesGenerated = [];
    // Generate base64 from all files
    await this.angularCropper.toArray().forEach((cropper, i) => {
      this.filesGenerated.push({ file: cropper.cropper.getCroppedCanvas().toDataURL() });
    })
    this.generating = false;
  }
  

}
