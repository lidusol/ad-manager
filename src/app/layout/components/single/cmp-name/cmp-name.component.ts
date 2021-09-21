import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FormControl, Validators } from '@angular/forms';
import { FormValidators} from '../../../../utils/form-validators' 
import { AngularFirestore } from '@angular/fire/firestore';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { SearchService } from 'src/app/campaigns-management/services/search.service';
import { LangService } from '../../lang.service';
import { TranslateService } from '@ngx-translate/core';
import { CHANNEL_FORMAT } from 'src/app/utils/data';
import { take } from 'rxjs/operators';
import validator from 'validator';
import { FacebookService } from 'src/app/campaigns-management/services/facebook.service';
@Component({
  selector: 'adf-cmp-name',
  templateUrl: './cmp-name.component.html',
  styleUrls: ['./cmp-name.component.scss']
})
export class CmpNameComponent implements OnInit {
  public componentReady: boolean = true
  isEditing: boolean = true
  origText: string = ''
  newText: string = ''
  expanded = true;
  selected = false;
  selectedBid: string = "CPM"
  @Input() cmp_1: boolean = false;
  @Input() uid: string = "";
  @Input() ads_channel: CHANNEL_FORMAT = null
  NAME: string = ""

  triggerEdit(){
    this.isEditing = true;
    setTimeout(() => {
      if(this.cmp_1 && this.isEditing){
        this.nameControl.setValue(this.NAME)
      }
    }, 0);
  }
  error: string = ''
  save() {
    if(this.nameControl.valid){
      this.verifyCampaignName(this.nameControl.value).then(response=>{
        if(response==='ok'){
          this.newText = this.nameControl.value
          this.origText = this.newText;
          this.NAME = this.origText;
          this.isEditing = false;
          this.componentReady = true
          this.error = ''
        }else if(response==='duplicate'){
          this.error = 'cmp_duplicate'
          this.componentReady = false
        }else if(response==='email'){
          this.error = 'cmp_email'
          this.componentReady = false
        }else if(response==='error'){
          this.error = 'cmp_error'
          this.componentReady = false
        }else{
          this.error = 'cmp_error'
          this.componentReady = false
        }
      })
    }
 }
 cancel() {
  this.newText = this.NAME;
  this.NAME = this.newText;
  this.isEditing = false;
}
  componentSelected($event) {
    this.selected = !this.selected;
    event.stopPropagation();
  
  }

  buttonClick($event) {
    this.selected = !this.selected;
    event.stopPropagation();
  }

  togglePanel($event) {
    this.expanded = !this.expanded;
    //event.stopPropagation();
  }

  expandPanel(event): void {
    event.stopPropagation(); // Preventing event bubbling

    if (this.expanded) {
      this.nameExpansion.open(); // Here's the magic
    }else{
      this.nameExpansion.close()
    }
  }
  input_name_status: string = "" 
  public name: string = "display-1"
  public nameControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)])
  @ViewChild('nameExpansion', {static: false}) nameExpansion: MatExpansionPanel
  constructor(private translate: TranslateService, private lang: LangService, private afs: AngularFirestore, private displayService: DisplayService, private searchService: SearchService, private youtubeService: YoutubeService, private storageService: LocalStorageService, private facebookService: FacebookService) { 
    this.lang.language.subscribe(lang=>{
      this.translate.use(lang)
    })
  }

  ngOnInit(): void {
    this.nameControl.valueChanges.subscribe(val=>{
      if(this.error.length>0){
        this.error = 'cmp_error'
      }
    })
  }
  generateName(length) {
    //console.log(this.ads_channel.obj_id)
    this.isEditing = true
    setTimeout(() => {
      var result = '';
      if (window.location.pathname === '/campaigns/new/display/create' || (this.ads_channel!==undefined && this.ads_channel!==null && this.ads_channel.obj_id==='display')) {
        this.storageService.getUserIdAndAccountId().then(response=>{
          ////console.log(response)
          if(response!==null && response!==undefined){
            this.displayService.getListCampaign(response.account.owner, response.account.id).subscribe(campaign=>{
              ////console.log(campaign)
              ////console.log(campaign.length)
              let campaign_length: number = campaign.length
              if(campaign_length<=0){
                
                result = 'display-' + 0;
                if(this.isEditing){
                  this.nameControl.setValue(result)
                  this.nameControl.updateValueAndValidity()
                  this.isEditing = false
                }
                this.NAME = result
                this.newText = result
                this.isEditing = false
               return result;
              }else{
                result = 'display-' + (campaign_length+1).toString();
                if(this.isEditing){
                  this.nameControl.setValue(result)
                  this.nameControl.updateValueAndValidity()
                  this.isEditing = false
                }
                this.newText = result
                this.NAME = result
                this.componentReady = true
               return result;
              }
  
            })
          }else{
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            if(this.isEditing){
              this.nameControl.setValue(result)
              this.nameControl.updateValueAndValidity()
              this.isEditing = false
            }
            this.NAME = result
            this.componentReady = true
           return result;
          }
        })
      } else if (window.location.pathname === '/campaigns/new/native/create' || (this.ads_channel!==undefined && this.ads_channel!==null && this.ads_channel.obj_id==='native')) {
        //console.log('is-native')
        this.storageService.getUserIdAndAccountId().then(response=>{
          if(response!==null && response!==undefined){
            this.youtubeService.getListCampaign(response.account.owner, response.account.id).subscribe(campaign=>{
            
              let campaign_length: number = campaign.length
              if(campaign.length<=0){
                
                result = 'native-' + 0;
                if(this.isEditing){
                  this.nameControl.setValue(result)
                  this.nameControl.updateValueAndValidity()
                  this.isEditing = false
                }
                this.NAME = result
                this.newText = this.NAME
                this.componentReady = true
                this.isEditing = false
               return result;
              }else{
                result = 'native-' + (campaign_length+1).toString();
                if(this.isEditing){
                  this.nameControl.setValue(result)
                  this.nameControl.updateValueAndValidity()
                  this.isEditing = false
                }
                this.NAME = result
                this.newText = this.NAME
                this.componentReady = true
                this.isEditing = false
               return result;
              }
  
            })
          }else{
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
          }
          if(this.isEditing){
            this.nameControl.setValue(result)
            this.nameControl.updateValueAndValidity()
            this.isEditing = false
          }
          this.NAME = result
          this.newText = this.NAME
          this.componentReady = true
          this.isEditing = false
         return result;
        })
      }else if (window.location.pathname === '/campaigns/new/search/create' || (this.ads_channel!==undefined && this.ads_channel!==null && this.ads_channel.obj_id==='search')) {
        this.storageService.getUserIdAndAccountId().then(response=>{
          if(response!==null && response!==undefined){
            this.searchService.getListCampaign(response.account.owner, response.account.id).subscribe(campaign=>{
              let campaign_length: number = campaign.length
              if(campaign.length<=0){
                
                result = 'search-' + 0;
                if(this.isEditing){
                  this.nameControl.setValue(result)
                  this.nameControl.updateValueAndValidity()
                  this.isEditing = false
                }
                this.NAME = result
                this.newText = this.NAME
                this.componentReady = true
                this.isEditing = false
               return result;
              }else{
                result = 'search-' + (campaign_length+1).toString();
                if(this.isEditing){
                  this.nameControl.setValue(result)
                  this.nameControl.updateValueAndValidity()
                  this.isEditing = false
                }
                this.NAME = result
                this.newText = this.NAME
                this.componentReady = true
                this.isEditing = false
               return result;
              }
  
            })
          }else{
            var characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
          }
          if(this.isEditing){
            this.nameControl.setValue(result)
            this.nameControl.updateValueAndValidity()
            this.isEditing = false
          }
          this.NAME = result
          this.newText = this.NAME
          this.componentReady = true
          this.isEditing = false
         return result;
        })
      }
    }, 0);
  
   
}


  ngAfterViewInit(): void {
    this.generateName(8)
    this.nameControl.valueChanges.pipe(take(1)).subscribe(value => {
      //this.verifyCampaignName()
    })
   
    
  }
  public nameExist: boolean = false
  public nameNotChange: boolean = false
  verifyCampaignName(val?: string):Promise<string>{
    
    return new Promise(resolve => {
      //console.log(this.nameControl.value)
      if(this.isEditing){
        let name: string = this.nameControl.value
        this.checkName(name).then(res=>{
          resolve(res)
        })
      }else{
        let name: string = this.NAME
        this.checkName(name).then(res=>{
          resolve(res)
        })
      }

     
     
        
      })
    
  }

  checkName(name: string):Promise<string>{
      return new Promise(resolve=>{
        for (let i=0; i<name.length; i++){
          var re: boolean = name[i].toString() === '@' || name[i].toString() === '.'
          //console.log(re+' '+name[i].toString())
          if(re){
            this.NAME = ""
          if (document.getElementsByClassName('name-field')[0]!==undefined && !document.getElementsByClassName('name-field')[0].classList.contains('mat-form-field-invalid')) {
            document.getElementsByClassName('name-field')[0].classList.add('mat-form-field-invalid')
            
          }
            resolve('email')
          }else{
            if(i===name.length-1){
              if (window.location.pathname === '/campaigns/new/display/create' || (this.ads_channel!==undefined && this.ads_channel!==null && this.ads_channel.obj_id==='display')) {
                if (this.NAME.length>3) { 
                  this.displayService.getCampaignName(this.uid, name).subscribe(campaign => {
                  if (campaign.length > 0) {
                    this.NAME = ""
                    this.nameExist = true
                    if (document.getElementsByClassName('name-field')[0]!==undefined && !document.getElementsByClassName('name-field')[0].classList.contains('mat-form-field-invalid')) {
                      document.getElementsByClassName('name-field')[0].classList.add('mat-form-field-invalid')
                      
                    }
                    resolve('duplicate')
                  } else {
                    this.NAME = name
                    this.nameExist = false
                    if (document.getElementsByClassName('name-field')[0]!==undefined && document.getElementsByClassName('name-field')[0].classList.contains('mat-form-field-invalid')) {
                      document.getElementsByClassName('name-field')[0].classList.remove('mat-form-field-invalid')
                    }
                    resolve('ok')
                
                    }
              
                  })
                } else {
                  resolve('error')
                }
              } else if (window.location.pathname === '/campaigns/new/native/create' || (this.ads_channel!==undefined && this.ads_channel!==null && this.ads_channel.obj_id==='native')) {
                 if (this.NAME.length>3) { 
                   this.youtubeService.getCampaignName(this.uid, name).subscribe(campaign => {
                  if (campaign.length > 0) {
                    this.NAME = ""
                    this.nameExist = true
                    if (document.getElementsByClassName('name-field')[0]!==undefined && !document.getElementsByClassName('name-field')[0].classList.contains('mat-form-field-invalid')) {
                      document.getElementsByClassName('name-field')[0].classList.add('mat-form-field-invalid')
                      
                    }
                    resolve('duplicate')
                  } else {
                    this.NAME = name
                    this.nameExist = false
                    if (document.getElementsByClassName('name-field')[0]!==undefined && document.getElementsByClassName('name-field')[0].classList.contains('mat-form-field-invalid')) {
                      document.getElementsByClassName('name-field')[0].classList.remove('mat-form-field-invalid')
                    }
                    resolve('ok')
                    
                    }
              
                  })
                } else {
                  resolve('error')
                }
              } else if (window.location.pathname === '/campaigns/new/search/create' || (this.ads_channel!==undefined && this.ads_channel!==null && this.ads_channel.obj_id==='search')) {
               if (this.NAME.length>3) { 
                 this.searchService.getCampaignName(this.uid, name).subscribe(campaign => {
                if (campaign.length > 0) {
                  this.NAME = ""
                  this.nameExist = true
                  if (document.getElementsByClassName('name-field')[0]!==undefined && !document.getElementsByClassName('name-field')[0].classList.contains('mat-form-field-invalid')) {
                    document.getElementsByClassName('name-field')[0].classList.add('mat-form-field-invalid')
                    
                  }
                  resolve('duplicate')
                } else {
                  this.NAME = name
                  this.nameExist = false
                  if (document.getElementsByClassName('name-field')[0]!==undefined && document.getElementsByClassName('name-field')[0].classList.contains('mat-form-field-invalid')) {
                    document.getElementsByClassName('name-field')[0].classList.remove('mat-form-field-invalid')
                  }
                  resolve('ok')
                  
                  }
            
                })
              } else {
                resolve('error')
              }
            }

            }
  
          }
        }

      })
  }

  checkIfComponentReady() {
    if (this.NAME.length>3) {
      this.componentReady = true
    } else {
      this.componentReady = false
    }
  }
}
