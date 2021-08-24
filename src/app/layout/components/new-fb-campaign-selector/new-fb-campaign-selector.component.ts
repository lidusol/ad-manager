import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { OBJECTIVES, FB_OBJECTIVES_DATA, CHANNEL_FORMAT, FB_CHANNEL_DATA, AD_CATEGORIES, SPECIAL_AD_CATEGORIES, PLACEMENTS, AD_PLACEMENTS, GENDERS_LIST } from 'src/app/utils/data';
import { CmpNameComponent } from '../single/cmp-name/cmp-name.component';
import { CmpLandingPageComponent } from '../single/cmp-landing-page/cmp-landing-page.component';
import { CmpDatesComponent } from '../single/cmp-dates/cmp-dates.component';

import { FacebookService } from 'src/app/campaigns-management/services/facebook.service';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CmpBudgetComponent } from '../single/cmp-budget/cmp-budget.component';

@Component({
  selector: 'adf-new-fb-campaign-selector',
  templateUrl: './new-fb-campaign-selector.component.html',
  styleUrls: ['./new-fb-campaign-selector.component.scss']
})
export class NewFbCampaignSelectorComponent implements OnInit {
  objectives: OBJECTIVES[] = FB_OBJECTIVES_DATA
  ads_channel: CHANNEL_FORMAT[] = FB_CHANNEL_DATA
  active_ads_channel: CHANNEL_FORMAT[]
  public currentObjectiveSelected: OBJECTIVES = null
  public currentChannelSelected: CHANNEL_FORMAT = null
  special_ad_categories: AD_CATEGORIES[] = SPECIAL_AD_CATEGORIES
  ad_placements: PLACEMENTS[] = AD_PLACEMENTS
  genders: any[] = GENDERS_LIST
  genderAll: boolean = true

  frame1: boolean = true ;
  frame2: boolean = false;
  frame3: boolean = false;

  fileAttr: string = 'Choose File';
  @ViewChild('fileInput') fileInput: ElementRef | any;
  @ViewChild(CmpNameComponent, { static: false }) nameComponent: CmpNameComponent
  @ViewChild(CmpLandingPageComponent, { static: false }) landingPageComponent: CmpLandingPageComponent
  @ViewChild(CmpBudgetComponent, { static: false }) budgetComponent: CmpBudgetComponent
  @ViewChild(CmpDatesComponent, { static: false }) datesComponent: CmpDatesComponent

  /* CAMPAIGN DATA */
  NAME: string = ""
  SPECIAL_AD_CATEGORY:string = ""
  OBJECTIVE: OBJECTIVES = null 
  CHANNEL: CHANNEL_FORMAT = null
  DAILY_BUDGET: number = 0
  TOTAL_BUDGET: number = 0
  NUMBER_OF_DAYS: number = 0
  START_DATE: string = ""
  MIN_AGE: number = 13
  MAX_AGE: number = 65
  GENDER: string = ""

  dataimage: any;
  primaryText: string = "";
  spinnerCreation: boolean = false
  loaderSaving: boolean = false
  
  categorySelected = new FormControl('', [
    Validators.required
  ]);

  audienceForm = new FormGroup({
    minAge: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]*'),
      Validators.min(13),
      Validators.max(65)
    ]),
    maxAge: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]*'),
      Validators.min(13),
      Validators.maxLength(2)
    ])
  });

  get minAge() {
    return this.audienceForm.get('minAge');
  }
  get maxAge(){
    return this.audienceForm.get('maxAge');
  }
   
  openSnackbar(duration: number, content: string, action: string, style: string, horizontalPosition?: MatSnackBarHorizontalPosition, verticalPosition?: MatSnackBarVerticalPosition) {
    this._snackBar.open(content, action, {
          duration: duration * 1000,
          panelClass: [style],
          horizontalPosition: horizontalPosition,
          verticalPosition: verticalPosition}); 
  }


  constructor(private _snackBar: MatSnackBar, private dialog: MatDialog, private router: Router, private facebookService: FacebookService) { }

  ngOnInit(): void {
    
  }

  cancelCampaign(){
    this.router.navigate(['/campaigns'])
  }

  selectObjective(obj: OBJECTIVES) {
    if (this.currentObjectiveSelected!==null && this.currentObjectiveSelected.obj_id === obj.obj_id) {
      return;
    } else {
      if(this.currentObjectiveSelected!==null){
        document.getElementById(this.currentObjectiveSelected.obj_id).classList.remove('active', 'pulse')
      }
      
      document.getElementById(obj.obj_id).classList.add('active', 'pulse')
      
      this.active_ads_channel = this.ads_channel.filter((channel) => channel.obj_id === obj.obj_id); 
      this.currentObjectiveSelected = obj;
    }
    this.currentChannelSelected = null
  }

  selectAdFormat(obj: CHANNEL_FORMAT){
    if (this.currentChannelSelected!==null && this.currentChannelSelected.primary.title === obj.primary.title) {
      return;
    } else {
      if(this.currentChannelSelected!==null){
        document.getElementById(this.currentChannelSelected.primary.title).classList.remove('active', 'pulse')
      }
      
      document.getElementById(obj.primary.title).classList.add('active', 'pulse')
      this.currentChannelSelected = obj
    }
    setTimeout(()=>{
          this.nameComponent.generateName(8)
        },500)
  }

  getName(): Promise<string>{
    return new Promise(resolve => {
      this.nameComponent.verifyCampaignName().then(verified => {
        if (verified === 'ok') {
          this.NAME = this.nameComponent.NAME
        resolve('ok')
        } else if(verified==='duplicate') {
          this.openSnackbar(5, 'Nom de campagne déja utilisé !', '', 'snack-danger')
          this.spinnerCreation = false
        resolve('error')
        } else if(verified==='email') {
          this.openSnackbar(5, 'Nom de campagne invalide !', '', 'snack-danger')
           this.spinnerCreation = false
        resolve('error')
        } else {
          this.openSnackbar(5, 'Nom de campagne invalide !', '', 'snack-danger')
           this.spinnerCreation = false
        resolve('error')
        }
      }).catch((e) => {
        this.spinnerCreation = false
        this.openSnackbar(5, 'Une erreur est survenue !', '', 'snack-danger')
         resolve('error')
      })
      
    })
  }

 
  getBudget(): Promise<string> {
    return new Promise(resolve => {
      if (this.budgetComponent.componentReady) {
        this.DAILY_BUDGET = this.budgetComponent.budget
        this.TOTAL_BUDGET = parseInt((this.DAILY_BUDGET * this.NUMBER_OF_DAYS).toFixed())
        resolve('ok')
      } else {
        this.spinnerCreation = false
         this.openSnackbar(5, 'Budget de la campagne invalide !', 'ok', 'snack-danger')
        resolve('error')
      }
    })
  }

  getDates(): Promise<string> {
    return new Promise(resolve => {
      this.START_DATE = this.datesComponent.startDate
      resolve('ok')
    })
  }
  
  getSpecialAdCategory(): Promise<string>{
    return new Promise(resolve => {
      if(this.categorySelected.value !== ""){
        this.SPECIAL_AD_CATEGORY = this.categorySelected.value.name;
        resolve('ok')
      }else{
        this.openSnackbar(5, 'Please select special ad category', '', 'snack-danger')
        resolve('error')
      }
    });
  }

  getAudience(): Promise<string>{
    return new Promise(resolve => {
      if(this.minAge.value !== '' && this.maxAge.value !== '' && this.minAge.value < this.maxAge.value){
        if(this.genders.some(gender => gender.selected === true)){
          this.MIN_AGE = this.minAge.value;
          this.MAX_AGE = this.maxAge.value;
          this.GENDER = this.genders.filter((gender) => gender.selected === true).pop().name;
          resolve('ok')
        }else{
          resolve('error')
        }
      }else{
        this.openSnackbar(3, 'Please select valid age range', '', 'snack-danger')
        resolve('error')
      }
    });
  }

  getPlacement(): Promise<string>{
    return new Promise(resolve => {
      if(this.ad_placements.some(placement =>  placement.options.some(option => option.checked === true))){
        resolve('ok')
      }else{
        resolve('error')
        this.openSnackbar(3, 'Please select atleast one placement', '', 'snack-danger')
      }
    });
  }

  goFrame1(){
    this.frame1 = true
    this.frame2 = false
    this.frame3 = false
  }

  goFrame2(){
   this.getName().then(get_name=>{
      if(get_name==='ok'){
        this.getSpecialAdCategory().then(get_SAC=>{
          if(get_SAC==='ok'){
            this.OBJECTIVE = this.currentObjectiveSelected
            this.CHANNEL = this.currentChannelSelected
            this.frame2 = true
            this.frame1 = false
            this.frame3 = false
          }else{
            this.spinnerCreation = false
          }
        }).catch((e)=>{
          this.spinnerCreation = false
        })
      }else{
        this.spinnerCreation = false
      }
    }).catch((e)=>{
      this.spinnerCreation = false
    })
  }

  goFrame3(){
    this.getName().then(get_name => {
      if(get_name === 'ok'){
        this.getDates().then().catch((e) => console.log(e));
        this.getBudget().then(get_budget => {
          if(get_budget === 'ok'){
            this.getAudience().then(get_audience => {
              if(get_audience === 'ok'){
                this.getPlacement().then(get_placement => {
                  if(get_placement === 'ok'){
                    this.frame3 = true
                    this.frame1 = false
                    this.frame2 = false
                  }else{
                    this.spinnerCreation = false
                  }
                }).catch((e) => this.spinnerCreation = false)
              }else {
                this.spinnerCreation = false
              }
            }).catch((e) => this.spinnerCreation = false)
          }else{
            this.spinnerCreation = false
          }
        }).catch((e) => this.spinnerCreation = false);
      }else {
        this.spinnerCreation = false
      }
    }).catch((e) => this.spinnerCreation = false)
  }

  // log(val) { console.log(val); }

  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.from(imgFile.target.files).forEach((file: any) => {
        this.fileAttr += file.name;
      });

      // HTML5 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          let imgBase64Path = e.target.result;
          this.dataimage = imgBase64Path;
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);

      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = '';
    } else {
      this.fileAttr = 'Choose File';
    }
  }

  saveCampaign(){
    this.getName().then(get_name => {
      if(get_name === 'ok'){
        const dialogRef = this.dialog.open(CampaignSavedSuccessDialog, {
          data: {
            campaign_name: this.NAME,
            special_ad_category: this.SPECIAL_AD_CATEGORY,
            objective: this.OBJECTIVE,
            channel: this.CHANNEL,
            daily_budget: this.DAILY_BUDGET,
            total_budget: this.TOTAL_BUDGET,
            start_date: this.START_DATE,
            age: { min: this.MIN_AGE, max: this.MAX_AGE },
            gender: this.GENDER
          }
        });
        dialogRef.afterClosed().subscribe();
      }else {
        const dialogRef = this.dialog.open(CampaignSavedErrorDialog);
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
      }
    }).catch((e) => {
      console.log(e)
    })
  }
}

@Component({
  selector: 'campaign-save-success-dialog',
  template: ` 
              <h5>Campaign saved</h5>
              <div class="d-flex w-100 justify-content-center align-items-center">
                <div class="success-checkmark">
                  <div class="check-icon">
                    <span class="icon-line line-tip"></span>
                    <span class="icon-line line-long"></span>
                    <div class="icon-circle"></div>
                    <div class="icon-fix"></div>
                  </div>
                </div>
              </div>
              
              <div class="d-flex flex-column justify-content-center align-items-start p-md-4 p-md-2 cmp-type-container">
                <h6 class="mb-3">Name</h6>
                <p>{{ data.campaign_name }}</p>
                <h6 class="mb-3">Special ad category</h6>
                <p>{{ data.special_ad_category }}</p>
                <h6 class="mb-3">Objective</h6>
                <p>{{ data.objective.primary.title }} -> {{data.channel.secondary.title}}</p>
                <h6 class="mb-3">Budget & schedule</h6>
                <p>Daily budget {{data.daily_budget}}</p>
                <p>Start date {{ data.start_date }}</p>
                <h6 class="mb-3">Audience</h6>
                <p>Age group [{{ data.age.min }} - {{data.age.max}}]</p>
                <p>Gender {{data.gender}} </p>
              </div>
            `,
})
export class CampaignSavedSuccessDialog {
   constructor(
    public dialogRef: MatDialogRef<CampaignSavedSuccessDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'campaign-save-error-dialog',
  template: `<div>
              Campaign not saved
            </div>`,
})
export class CampaignSavedErrorDialog {}