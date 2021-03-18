/* import { Component, OnInit } from '@angular/core';
import { NgxImageCompressService } from '../../../image-compressor/ngx-image-compress.service'; */
import { ImageCompressorService , FileResult } from '../../../image-compressor/image-compressor.service';
import { Component, OnInit, ViewChildren, QueryList, ChangeDetectorRef, Renderer2, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'src/app/image-compressor/ngx-image-compress.service';
import { AD_FORMAT, VALID_AD_FORMAT_DISPLAY, VALID_AD_FORMAT_YOUTUBE } from 'src/app/utils/data';
import { MatSelectChange } from '@angular/material/select';
import { take } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { CropperComponent } from 'angular-cropperjs';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DESIGN_BOLD_ENDPOINT } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
export class File {
  file: string;
}
export interface cropperResize{
  id?: number;
  name?: string;
  width?: number;
  height?: number
}

@Component({
  selector: 'adf-image-compressor',
  templateUrl: './image-compressor.component.html',
  styleUrls: ['./image-compressor.component.scss'],
})
export class ImageCompressorComponent implements OnInit {
  @ViewChildren('angularCropper') public angularCropper: QueryList<CropperComponent>;
  form = new FormArray([]);
  files = new FormArray([]);
  configs: Array<any> = [];
  cropperClass = new Subject<Array<string>>();
  filesGenerated: Array<any> = [];
  generating: boolean = false;


  async onFileChange(event) {
      
      /* this.form.setControl('files', this.formBuilder.array([])); */
    if (event.target.files && event.target.files.length > 0) {
      for(var i = 0; i < event.target.files.length; i++){
        try {
          let contentBuffer = await this.readFileAsync(event.target.files[i]);
          this.configs.push({
            viewMode: 1,
            aspectRatio: 1,
            preview: this.files.controls.length>0?'#img-preview' + this.files.controls.length: '#img-preview' +i,
            zoomOnWheel: true,
  autoCropArea: 1,
            autoCrop: true,
  checkOrientation: false,
  checkCrossOrigin: true,
                minCanvasWidth: 250,
                minCanvasHeight: 250,
                minCropBoxWidth: 250,
            minCropBoxHeight: 250,
            minContainerWidth: 480,
                minContainerHeight: 252,
                
                movable : true,
                scalable: true,
                zoomable: true,
  responsive: true,
  cropBoxResizable: false,
  modal: true,
  center: true,
          });
          this.addFile({ 'file': contentBuffer.toString() });
          this.changeCropperFile(this.files.controls.length > 0 ? this.files.controls.length : i);
          this.currentIndex = this.files.controls.length > 0 ? this.files.controls.length - 1 : i
          this.resizeTable.push({ id: this.currentIndex, width: 250, height: 250, name: '' })
          //this.cd.detectChanges()
         /*  setTimeout(() => {
            this.angularCropper.toArray().forEach((cropper, _i) => {
              if(_i)
            })
          }, 500); */
           
        } catch(err) {
          console.log(err);
        }
      }
    } else {
      console.log('Selected at least one file');
    }
  }

  async readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    })
  }

  addFile(file) {
    const group = new FormGroup({
      data: new FormControl(file)
    });
    this.files.push(group);
    console.log(this.files)
  }

  createFile(file): FormGroup {
    return this.formBuilder.group({
      data: file
    });
  }

  currentIndex: number = 0
  async changeCropperFile(index) {
    
    this.angularCropper.toArray().forEach((cropper, i) => {
      if (index === i) {
        this.currentIndex = index
       this.configs[i] = {
            viewMode: 1,
            aspectRatio: this.selectedFormat!==null?this.selectedFormat.width/this.selectedFormat.height:NaN,
            preview: this.files.controls.length>0?'#img-preview' + this.files.controls.length: '#img-preview' +i,
            zoomOnWheel: true,
  autoCropArea: 1,
            autoCrop: true,
  checkOrientation: false,
  checkCrossOrigin: true,
        
                minCanvasWidth: this.selectedFormat!==null?this.selectedFormat.width/2:252,
                minCanvasHeight: this.selectedFormat!==null?this.selectedFormat.height/2:252,
                minCropBoxWidth: this.selectedFormat!==null?this.selectedFormat.width/2:252,
                minCropBoxHeight: this.selectedFormat!==null?this.selectedFormat.height/2:252,
                 minContainerWidth: 480,
                minContainerHeight: 252,
                movable : true,
                scalable: true,
                zoomable: true,
  responsive: true,
  cropBoxResizable: false,
  modal: true,
  center: true,
          }
        this.cropperClass[i] = 'show';
        cropper.cropperOptions['cropBoxResizable']=false
       
      } else {
        this.cropperClass[i] = 'hide';
      }
    })
  }

  getCropperClassObservable(index){
    return this.cropperClass.asObservable().source[index];
  }

  removeFile(index: number){
    this.files.removeAt(index)
    this.configs.splice(index,1)
    this.resizeTable.forEach((item, i, arr) => {
      if (i === index) {
        this.resizeTable.splice(i,1)
      }
    })
  }

  
  async generate(index?:number){
    this.generating = true;
    this.filesGenerated = [];
    // Generate base64 from all files
    if (index !== undefined) {
          await this.angularCropper.toArray().forEach((cropper, i) => {
        if (i === index) {
          this.filesGenerated.push({ file: cropper.cropper.getCroppedCanvas({width: this.resizeTable[i].width, height: this.resizeTable[i].height}).toDataURL('image/jpeg',  0.85),  name: 'adafri_resized_'+this.resizeTable[i].width+'x'+this.resizeTable[i].height, width: this.resizeTable[i].width, height: this.resizeTable[i].height });
          return;
        }
      
    })
    } else {
       await this.angularCropper.toArray().forEach((cropper, i) => {
     this.filesGenerated.push({ file: cropper.cropper.getCroppedCanvas({width: this.resizeTable[i].width, height: this.resizeTable[i].height}).toDataURL('image/jpeg', 0.85) , name: 'adafri_resized_'+this.resizeTable[i].width+'x'+this.resizeTable[i].height, width: this.resizeTable[i].width, height: this.resizeTable[i].height});
    })
    }

    this.generating = false;
  }

  ngOnInit() {
    
  }
  
  deleteCompressed(index: number) {
    this.filesGenerated.forEach((el, _index, arr) => {
        if (index === _index) {
          this.filesGenerated.splice(index, 1)
          
        }
        
      })
  }
  isSelected(format: AD_FORMAT){
    if(this.selectedFormat===null) return false;
    return this.selectedFormat.width===format.width && this.selectedFormat.height===format.height
  }
  width: number = 0
  height: number = 0
  currentWidth: number = 0
  currentHeight: number = 0
  loader: boolean = false
  selectFormat(format: AD_FORMAT){
    //this.loader= true
    this.selectedFormat = format
    this.width = format.width
    this.height = format.height
    this.addDesignBold(format.name, format.width, format.height)
    //this.cd.detectChanges()
    setTimeout(() => {
      console.log(this.width)
      console.log(this.height)
      if(document.getElementById('resizeContainer').getElementsByTagName('a')[0]!==undefined && document.getElementById('resizeContainer').getElementsByTagName('a')[0]!==null){
        document.getElementById('resizeContainer').getElementsByTagName('a')[0].click();
        this.loader = false
      }else{
        setTimeout(() => {
          console.log(this.width)
          console.log(this.height)
          if(document.getElementById('resizeContainer').getElementsByTagName('a')[0]!==undefined && document.getElementById('resizeContainer').getElementsByTagName('a')[0]!==null){
            document.getElementById('resizeContainer').getElementsByTagName('a')[0].click();
            this.loader = false
          }else{
    
          }
        }, 1000);
      }
    }, 1000);
  }
  resizeTable: cropperResize[] = []
  selectionChange(args: MatSelectChange) { 
    this.selectedFormat = args.value
    console.log(this.currentIndex)
    this.angularCropper.toArray().forEach((cropper, i) => {
      if (this.currentIndex === i) {
        
        let resizeExist = this.resizeTable.some(resize => resize.id === i)
        if (!resizeExist) {
          this.resizeTable.push({ id: i, width: this.selectedFormat.width, height: this.selectedFormat.height, name: this.selectedFormat.name })
          console.log(this.resizeTable)
        } else {
          this.resizeTable[i].width = this.selectedFormat.width
          this.resizeTable[i].height = this.selectedFormat.height
          this.resizeTable[i].name = this.selectedFormat.name
          console.log(this.resizeTable)
        }
        this.configs[i] ={
            viewMode: 1,
            aspectRatio: this.selectedFormat.width/this.selectedFormat.height,
            preview: '#img-preview' +i,
            zoomOnWheel: true,
  autoCropArea: 1,
            autoCrop: true,
  checkOrientation: false,
  checkCrossOrigin: true,
                 minCanvasWidth: this.selectedFormat!==null?this.selectedFormat.width/2:252,
                minCanvasHeight: this.selectedFormat!==null?this.selectedFormat.height/2:252,
                minCropBoxWidth: this.selectedFormat!==null?this.selectedFormat.width/2:252,
                minCropBoxHeight: this.selectedFormat!==null?this.selectedFormat.height/2:252,
                 minContainerWidth: 480,
                minContainerHeight: 252,
                movable : true,
                scalable: true,
                zoomable: true,
  responsive: true,
  cropBoxResizable: false,
  modal: true,
  center: true,
        }
        cropper.cropperOptions['cropBoxResizable']=false
        cropper.cropper.setCropBoxData({width: this.selectedFormat.width/2, height: this.selectedFormat.height/2})
        cropper.cropper.setAspectRatio(this.selectedFormat.width/this.selectedFormat.height)
      }
    })
     /* this.configs[this.currentIndex] = { viewMode: 1,
            aspectRatio: this.selectedFormat.width/this.selectedFormat.height,
            preview: '#img-preview' + this.currentIndex,
            zoomOnWheel: true,
  autoCropArea: 1,
            autoCrop: true,
  checkOrientation: false,
  checkCrossOrigin: true,
                
                
                movable : true,
                scalable: true,
                zoomable: true,
  responsive: true,
  cropBoxResizable: false,
  modal: true,
  center: true,} */
  }
  selectedFormat: AD_FORMAT = null;
  FORMAT: AD_FORMAT[] = VALID_AD_FORMAT_DISPLAY
  compressedImages: FileResult[];
  email: string = ''
  name: string = ''
  constructor(@Inject(DOCUMENT) private _document: Document, public dialog: MatDialog,  private _renderer2: Renderer2, private ics: ImageCompressorService ,private sanitizer : DomSanitizer,  private formBuilder: FormBuilder, private auth: AuthService) {
     this.ics.getCompressedFiles().subscribe(compressed => {
      this.compressedImages = compressed
     });
     this.auth.user.subscribe(user=>{
       if(user!==null){
         this.email = user.email
         this.name = user.first_name
       }
     })
    /* this.form = this.formBuilder.group({
      files: this.formBuilder.array([])
    }) */
   
  }

  configsRect: Array<any> = [];
  compareFormat(o1: AD_FORMAT, o2: AD_FORMAT): boolean {
    if (o1 !== null && o2 !== null && o1 !== undefined && o2 !== undefined) {
      return o1.id === o2.id && o1.width === o2.width && o1.height === o2.height && o1.name === o2.name && o1.img === o2.img;
       
     }
  }
  change(files) {
    console.log(files);
    
    this.ics.compress(files,`adafr-resized-${this.selectedFormat.width}x${this.selectedFormat.height}`, this.selectedFormat.width , this.selectedFormat.height , 'image/jpeg', 0.8);
  }

  sanitize(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  onload(arg, img: HTMLImageElement) {
    alert('loaded')
    img.onload = () => {}
    return;
  }
  currentDesignBoldScript: string = null
  
  loadDesignBold(remove?: boolean) {
    let ref= document.getElementById('resizeContainer').getElementsByTagName('a')
    console.log(ref)
    if(ref[0]!==undefined && ref[0]!==null){
      if(remove===undefined){
        ref[0].remove()
        document.getElementById('db-js-sdk').remove()
        setTimeout(() => {
          let script = this._renderer2.createElement('script');
          script.type = `text/javascript`;
          script.src = DESIGN_BOLD_ENDPOINT
          script.id = "db-js-sdk"
          this._renderer2.appendChild(this._document.body, script);
          window['DBSDK_Cfg'] = {
            export_mode: ['download'],
            export_file_type: 'png',
            export_callback: (resultUrl, documentId, exportTarget)=> {
              this.openDialogDownload(resultUrl)
            },
            auth: {
              //quick sign up config, fill partner user email & user display name
                name : 'Connectez-vous pour commencer',
                email : this.email
            }
            };
        }, 500);
      }
    }else{
      let script = this._renderer2.createElement('script');
      script.type = `text/javascript`;
      script.src = DESIGN_BOLD_ENDPOINT
      script.id = "db-js-sdk"
      this._renderer2.appendChild(this._document.body, script);
      window['DBSDK_Cfg'] = {
        export_mode: ['download'],
        export_file_type: 'png',
        export_callback: (resultUrl, documentId, exportTarget) =>{
          this.openDialogDownload(resultUrl)
        },
        auth: {
          //quick sign up config, fill partner user email & user display name
          name : 'Connectez-vous pour commencer',
          email : this.email
        }
        };
    }
//     var self = this;
//   (function (d, s, id) {
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) return;
//     js = d.createElement(s); js.id = id;
//     js.src ="https://sdk.designbold.com/button.js#app_id=d46eb0dd68";
// fjs.parentNode.insertBefore(js, fjs);

// }(document, 'script', 'db-js-sdk'));




  }

  addDesignBold(name: string, width: number, height: number){
    //let ref= document.getElementById('resizeContainer').getElementsByTagName('a')
    let parent = document.getElementById('resizeContainer')
    parent.style.visibility = "hidden"
    parent.style.height="10px"
    parent.style.overflow="hidden"
    let div = document.createElement('div')
    //div.id = 'btn-resize'
    div.classList.add('db-btn-design-me')
    //div.style.visibility = 'hidden'
    div.setAttribute('data-db-width', width.toString())
    div.setAttribute('data-db-height', height.toString())
    div.setAttribute('data-db-title', name)
    div.setAttribute('data-db-unit', 'px')
    //console.log(ref)
    if(this.currentWidth===0 || this.currentHeight!==width || this.currentHeight!==height){
      div.setAttribute('data-db-action', 'create')
      this.currentWidth=width
      this.currentHeight = height
      parent.appendChild(div)
    this.loadDesignBold()
    }else{
      if(this.currentHeight===width && this.currentHeight===height){
        div.setAttribute('data-db-action', 'edit')
      this.currentWidth=width
      this.currentHeight = height
    this.loadDesignBold(true)
      }else{
        div.setAttribute('data-db-action', 'create')
      this.currentWidth=width
      this.currentHeight = height
      parent.appendChild(div)
    this.loadDesignBold()
      }
    }
    // if(ref[0]!==undefined && ref[0]!==null){
    //   div.setAttribute('data-db-action', 'edit')
    // }else{
    // }
    
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
  }
  openDialogDownload(url: string) {
    const dialogRef = this.dialog.open(DialogPreviewDesign, {
      data: {url: url}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result===undefined){
        return;
      }else{

      }
    });
    //this.cd.detectChanges()
  }
}


@Component({
  selector: 'dialog-preview-design',
  templateUrl: 'dialog-preview-design.html',
})
export class DialogPreviewDesign{
  constructor(
    public dialogRef: MatDialogRef<DialogPreviewDesign>,
    @Inject(MAT_DIALOG_DATA) public data: {url: string}) {
      dialogRef.afterOpened().subscribe(()=>{
        setTimeout(() => {
          console.log('opened')
            document.getElementById('previewImg')['src'] = data.url
        }, 200);
        //this.cd.detectChanges()
      })
    }
    spinnePublication: boolean = false
    
    onNoClick(): void {
      //this.dialogRef.disableClose = true
      this.dialogRef.close(undefined);
    }
  
}