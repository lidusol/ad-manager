import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

import { FB_OBJECTIVE_FORMAT, FB_OBJECTIVE, FB_OBJECTIVES_DATA, AD_CATEGORIES, SPECIAL_AD_CATEGORIES, CAMPAIGN_STATUS, PLACEMENTS, AD_PLACEMENTS, GENDERS_LIST, OPTIMIZATION_GOAL, BILLING_EVENT, User_Role, Account } from 'src/app/utils/data'
import { FacebookService } from 'src/app/campaigns-management/services/facebook.service'
import { Campaign, Adset, Creative, Ad } from 'src/app/campaigns-management/models/facebook.models'
import { LocalStorageService } from '../../services/local-storage.service'
import { reject } from 'lodash'

@Component({
  selector: 'adf-new-fb-campaign-selector',
  templateUrl: './new-fb-campaign-selector.component.html',
  styleUrls: ['./new-fb-campaign-selector.component.scss']
})
export class NewFbCampaignSelectorComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | any
 
  /* Data models definition */
  objectives: FB_OBJECTIVE[] = FB_OBJECTIVES_DATA
  special_ad_categories: AD_CATEGORIES[] = SPECIAL_AD_CATEGORIES
  campaign_status: any  = CAMPAIGN_STATUS
  genders: any[] = GENDERS_LIST
  ad_placements: PLACEMENTS[] = AD_PLACEMENTS
  optimization_goal: any[] = OPTIMIZATION_GOAL
  billing_event: any[] = BILLING_EVENT

  /*  */ 
  currentObjectiveTypeSelected: FB_OBJECTIVE = null
  objective_options: FB_OBJECTIVE_FORMAT[]
  currentOptionSelected: FB_OBJECTIVE_FORMAT = null
  currentPlacementsSelected: PLACEMENTS[] = null
  
  categoriesSelected: any =  []
  minStartDate: Date = null
  minEndDate: Date = null
  options_channel: any = null

  facebook_pages: any[] = null
  instagram_account: any = null
 

  imgData: any = {}
  primaryText: string = ""
  spinnerCreation: boolean = false
  loaderSaving: boolean = false
  loaderError: boolean = false
  isLoading: boolean = false

  frame1: boolean = true 
  frame2: boolean = false
  frame3: boolean = false

  aacid: string = ""
  uid: string = ""

  /* Form control data */
  campaignNameCtr = new FormControl('', [
    Validators.required
  ])

  adCategoryCtr = new FormControl('', [])

  adsetNameCtr = new FormControl('', [
    Validators.required
  ])

  budgetAndDateForm = new FormGroup({
    budgetCtr: new FormControl('', [
      Validators.required,
      Validators.min(1)
    ]),
    startDateCtr: new FormControl('', [
      Validators.required
    ]),
    addEndDateCtr: new FormControl('', ),
    endDateCtr: new FormControl('', )
  })

  audienceForm = new FormGroup({
    minAgeCtr: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]*'),
      Validators.min(13),
      Validators.max(65)
    ]),
    maxAgeCtr: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]*'),
      Validators.min(13),
      Validators.max(65)
    ]),
    genderCtr: new FormControl('', [
      Validators.required
    ])
  })

  optimizationGoalCtr = new FormControl('', [
    Validators.required
  ])

  billingEventCtr = new FormControl('', [
    Validators.required
  ])

  adNameCtr = new FormControl('', [
    Validators.required
  ])

  facebookPageCtr = new FormControl('', [
    Validators.required
  ])

  get budgetCtr() {
    return this.budgetAndDateForm.get('budgetCtr')
  }
  get startDateCtr() {
    return this.budgetAndDateForm.get('startDateCtr')
  }
  get addEndDateCtr() {
    return this.budgetAndDateForm.get('addEndDateCtr')
  }
  get endDateCtr() {
    return this.budgetAndDateForm.get('endDateCtr')
  }
  get minAgeCtr() {
    return this.audienceForm.get('minAgeCtr')
  }
  get maxAgeCtr(){
    return this.audienceForm.get('maxAgeCtr')
  }
  get genderCtr(){
    return this.audienceForm.get('genderCtr')
  }

  /* Campaign data  */
  CAMPAIGN: Campaign = null
  ADSET: Adset = null
  AD: Ad = null

  OBJECTIVE: string = "" 
  CAMPAIGN_NAME: string = ""
  SPECIAL_AD_CATEGORIES: string[] = []

  AD_SET_NAME: string = ""
  DAILY_BUDGET: number = 0
  BID_AMOUNT: number = 100
  START_DATE: string = ""
  END_DATE: string = ""
  LOCATION: any = null
  MIN_AGE: number = 18
  MAX_AGE: number = 65
  GENDER: number[] = []
  PLACEMENTS: any[] = []
  OPTIMIZATION_GOAL: string = ""
  BILLING_EVENT: string = ""

  AD_NAME: string = ""
  FACEBOOK_PAGE_ID: string = ""
  INSTAGRAM_ACTOR_ID: string = ""
  LINK_DATA: any = null
  PLATFORM_CUSTOMIZATION: any = null

  /* Editing mode */
  edit_id: string = ""
  isEditing: boolean = false

  constructor(private _snackBar: MatSnackBar, private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private storageService: LocalStorageService, private facebookService: FacebookService) { }

  ngOnInit(): void { 
    // this.route.queryParams.subscribe(params => {
    //   console.log(params['campaignId'])
    //   this.edit_id = params['campaignId']
    //   if(this.edit_id){
        
    //     this.isEditing = true
    //     this.fetchCampaign().then(campaign => {
    //       this.CAMPAIGN = campaign
    //       this.setCampaignDefaults()
    //     })
    //   }else {
        
    //     this.isEditing = false
    //   }
    // })
  }

  // fetchCampaign(){
  //   return new Promise<Campaign>(resolve => {
  //      this.facebookService.getCampaignById(this.edit_id).subscribe(data => {
  //       resolve(data)
  //     })
  //   })
  // }

  generateName(nameTag: string): string{
    return `New ${this.currentOptionSelected.name} ${nameTag}`
  }

  setCampaignDefaults(){
    // if(this.isEditing){
      // console.log(this.CAMPAIGN)
      // this.currentObjectiveTypeSelected = FB_OBJECTIVES_DATA[0]
      // this.currentOptionSelected = this.currentObjectiveTypeSelected.options[0]
      // this.campaignNameCtr.setValue(this.CAMPAIGN.name)
      // this.currentOptionSelected = campaignData.objective
    // }else {
      let cmpName = this.generateName('campaign')
      this.campaignNameCtr.setValue(cmpName)

      let adsetName = this.generateName('ad set')
      this.adsetNameCtr.setValue(adsetName)

      let adName = this.generateName('ad')
      this.adNameCtr.setValue(adName)

      this.budgetCtr.setValue(5)

      let startDate = new Date()
      this.minStartDate = startDate
      this.startDateCtr.setValue(startDate)
      let endDate = new Date()
      endDate.setDate(endDate.getDate() + 2)
      this.minEndDate = endDate
      this.endDateCtr.setValue(endDate)
      this.minAgeCtr.setValue(18)
      this.maxAgeCtr.setValue(65)
      this.genderCtr.setValue(this.genders[0])
    // }
  }

  openSnackbar(duration: number, content: string, action: string, style: string, horizontalPosition?: MatSnackBarHorizontalPosition, verticalPosition?: MatSnackBarVerticalPosition) {
    this._snackBar.open(content, action, {
          duration: duration * 1000,
          panelClass: [style],
          horizontalPosition: horizontalPosition,
          verticalPosition: verticalPosition}) 
  }

  cancelCampaign(){
    this.router.navigate(['/campaigns/fb-list'])
    this.currentPlacementsSelected = []
  }

  selectType(obj: FB_OBJECTIVE) {
    if (this.currentObjectiveTypeSelected!==null && this.currentObjectiveTypeSelected.type.obj_id === obj.type.obj_id) {
      return
    } else {
      if(this.currentObjectiveTypeSelected!==null){
        document.getElementById(this.currentObjectiveTypeSelected.type.obj_id).classList.remove('active', 'pulse')
      }
      document.getElementById(obj.type.obj_id).classList.add('active', 'pulse')
      
      this.objective_options = this.objectives.filter(data => data.type.obj_id === obj.type.obj_id).flatMap(obj => obj.options)
      this.currentObjectiveTypeSelected = obj
    }
    this.currentOptionSelected = null
  }

  selectObjectiveOption(obj: FB_OBJECTIVE_FORMAT){
    if (this.currentOptionSelected !== null && this.currentOptionSelected.obj_id === obj.obj_id) {
      return
    } else {
      if(this.currentOptionSelected!==null){
        document.getElementById(this.currentOptionSelected.obj_id).classList.remove('active', 'pulse')
      }
      document.getElementById(obj.obj_id).classList.add('active', 'pulse')
      this.currentOptionSelected = obj
      this.options_channel = {
        primary: {...obj}
      }
      this.setCampaignDefaults()
    } 
  }

  getName(name): Promise<string>{
    return new Promise(resolve => {
      if(name.valid){
        resolve('ok')
      }else {
        this.openSnackbar(5, 'Please enter name', 'Ok', 'snack-danger')
        resolve('error')
      }
    })
  }

  getSpecialAdCategory(): Promise<string>{
    return new Promise(resolve => {
      if(this.adCategoryCtr.value.length > 0){
       this.adCategoryCtr.value.forEach(element => this.SPECIAL_AD_CATEGORIES.push(element.apiName))
      }else{
        this.SPECIAL_AD_CATEGORIES = []
      }
      resolve('ok')
    })
  }

  getBudget(): Promise<string> {
    return new Promise(resolve => {
      if(this.budgetCtr.valid){
        // Daily budget is multiplied by 100 to give the exact amount entered after bid is applied
        this.DAILY_BUDGET = this.budgetCtr.value * 100
        resolve('ok')
      }else {
        this.openSnackbar(5, 'Please enter a valid budget', 'Ok', 'snack-danger')
        resolve('error')
      }
    })
  }

  getDates(): Promise<string> {
    return new Promise(resolve => {
      if(this.startDateCtr.valid){
        this.START_DATE = this.startDateCtr.value
        if(this.addEndDateCtr.value && this.endDateCtr.value !== ""){
          this.END_DATE = this.endDateCtr.value
        }
        resolve('ok')
      }else {
        this.openSnackbar(5, 'Please enter a valid start date', 'Ok', 'snack-danger')
        resolve('error')
      }
    })
  }
  
  getAudience(): Promise<string>{
    return new Promise(resolve => {
      if(this.minAgeCtr.valid && this.maxAgeCtr.valid && this.minAgeCtr.value < this.maxAgeCtr.value){
        this.MIN_AGE = this.minAgeCtr.value
        this.MAX_AGE = this.maxAgeCtr.value
        if(this.genderCtr.valid){
          let gender_id = this.genderCtr.value.id
          if(gender_id === 0){
            this.GENDER = []
          }else { 
            this.GENDER.push(gender_id)
          }
          resolve('ok')
        }else{
          this.openSnackbar(3, 'Please select gender', 'OK', 'snack-danger')
          resolve('error')
        }
      }else{
        this.openSnackbar(3, 'Please select valid age range', 'OK', 'snack-danger')
        resolve('error')
      }
    })
  }

  getPlacement(): Promise<string>{
    return new Promise(resolve => {
      if(this.ad_placements.some(placement =>  placement.options.some(option => option.checked))){
        this.currentPlacementsSelected = this.ad_placements
          .map(placement => {
            return {
              ...placement, options: placement.options.filter(option => option.checked)
            }
          })
          .filter(placement => placement.options.length > 0)
          
        this.PLACEMENTS = this.currentPlacementsSelected.flatMap(placement => placement.options.flatMap(option => {
          return {
            tag: option.tag,
            apiName: option.apiName
            }
        }))
        resolve('ok')
      }else{
        resolve('error')
        this.openSnackbar(3, 'Please select atleast one placement', 'Ok', 'snack-danger')
      }
    })
  }

  getOptimizationAndBilling(): Promise<string>{
    return new Promise(resolve => {
      if(this.optimizationGoalCtr.valid){
        this.OPTIMIZATION_GOAL = this.optimizationGoalCtr.value.apiName
        if(this.billingEventCtr.valid){
          this.BILLING_EVENT = this.billingEventCtr.value.apiName
          resolve('ok')
        }else {
          this.openSnackbar(5, 'Please selct billing event', 'Ok', 'snack-danger')
        }
      }else{
        this.openSnackbar(5, 'Please select optimization goal', 'Ok', 'snack-danger')
        resolve('error')
      }
    })
  }

  fetchFacebookPages(){
    this.facebookService.getClientPages().subscribe(
      (obj) => {
        this.facebook_pages = obj.data
      },
      (error) => {
        console.log(error)
      }
    )
  }

  getPageAccessToken(fbPageId: string){
    return new Promise<any>((resolve, reject) => {
      this.facebookService.getPageAccessToken(fbPageId).subscribe(
        (obj) => resolve(obj),
        (error)=> reject(error)
      )
    })
  }

  fetchInstagramAccount(fbPageId: string, accessToken: string){
    return new Promise<any>((resolve, reject) => {
      this.facebookService.getConnectedInstagramAccount(fbPageId, accessToken).subscribe(
        (obj) => { 
          if(obj.data.length !== 0){
            resolve(obj.data[0])
          }else{
            reject(obj)
          }
        },
        (error) => reject(error)
      )
    })
  }

  getConnectedIgAcc(id: string){
    this.isLoading = true
    this.instagram_account = null
    this.getPageAccessToken(id)
          .then(obj => this.fetchInstagramAccount(obj.id, obj.access_token))
          .then(data => {
            this.isLoading = false
            this.instagram_account = data
            this.INSTAGRAM_ACTOR_ID = this.instagram_account.id
          })
          .catch((e) => {
            this.isLoading = false
            console.log(e)
          })
  }

 
  uploadFileEvt(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader()
      reader.onload = (e: any) => {
        let image = new Image()
        image.src = e.target.result
        image.onload = (rs) => {
          let imgBase64Path = e.target.result
          this.imgData['path'] = imgBase64Path
        }
      }
      reader.readAsDataURL(event.target.files[0])
      this.imgData['file'] = event.target.files[0]
      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = ''
    }
  }

  getFacebookPageId(){
    return new Promise<string>((resolve) => {
      if(this.facebookPageCtr.valid){
        this.FACEBOOK_PAGE_ID = this.facebookPageCtr.value
        resolve('ok')
      }else {
        this.openSnackbar(5, 'Please select facebook page', 'Ok', 'snack-danger')
        resolve('error')
      }
    })
  }

  createCampaign(){
    let campaign: Campaign = {
      name: this.CAMPAIGN_NAME,
      status: this.campaign_status.PAUSED.apiName,
      objective: this.OBJECTIVE,
      special_ad_categories: this.SPECIAL_AD_CATEGORIES
    }
    return new Promise<Campaign>((resolve, reject) => {
      this.facebookService.createCampaign(campaign).subscribe(         
        (data) => {
            console.log(data)
            resolve(data)
        },
        (error) => {
          reject(error)
        }
      )
    })
  }

  createAdset(campaign: Campaign){
      let fbPlacementSelected: boolean = false
      let igPlacementSelected: boolean = false
      let publisherPlatforms = []
      let fbPlacements = [] 
      let igPlacements = []

      fbPlacementSelected = this.PLACEMENTS.some(placement => placement.tag === 'fb')
      if(fbPlacementSelected){
        publisherPlatforms.push('facebook')
        fbPlacements = this.PLACEMENTS.filter(placement => placement.tag === 'fb').flatMap(placement => placement.apiName) 
      }

      igPlacementSelected = this.PLACEMENTS.some(placement => placement.tag === 'ig')
      if(igPlacementSelected){
        publisherPlatforms.push('instagram')
        igPlacements = this.PLACEMENTS.filter(placement => placement.tag === 'ig').flatMap(placement => placement.apiName) 
      }

      let adset: Adset = {
        name: this.AD_SET_NAME,
        optimization_goal: this.OPTIMIZATION_GOAL,
        billing_event: this.BILLING_EVENT,
        bid_amount: this.BID_AMOUNT,
        daily_budget: this.DAILY_BUDGET,
        campaign_id: campaign.campaign_id, 
        targeting: {
          geo_locations: {
              countries: [
                  "US"
              ]
          },   
          genders: this.GENDER,
          age_min: this.MIN_AGE,
          age_max: this.MAX_AGE, 
          publisher_platforms: publisherPlatforms,
          ...(fbPlacementSelected)  && { facebook_positions: fbPlacements },
          ...(igPlacementSelected) && { instagram_positions: igPlacements }
      },
        start_time: this.START_DATE,
        ...(this.END_DATE !== null) && { end_time: this.END_DATE },
        status: this.campaign_status.PAUSED.apiName
      }
      
      return new Promise<Adset>((resolve, reject) => {
        this.facebookService.createAdset(adset).subscribe(
          (data) => {
            console.log(data)
            resolve(data)
          },
          (error) => {
            reject(error)
          }
        )
      })
  }

  uploadImgToGraph(){
    return new Promise<string>((resolve, reject) => {
      const formData = new FormData()
      formData.append('image', this.imgData.file)
      this.facebookService.uploadImage(formData).subscribe(
        (data) => {
          let imgHash = data["images"][this.imgData.file.name]["hash"]
          console.log(imgHash)
          resolve(imgHash)
        },
        (error) => {
          console.log(error)
          reject(error)
        }
      )
    })
  }

  createCreative(hash){
    let creative: Creative = {
      name: "New creative",
      ad_format: "INSTAGRAM_STANDARD",
      object_story_spec: {
        instagram_actor_id: this.INSTAGRAM_ACTOR_ID,
        page_id: this.FACEBOOK_PAGE_ID,
        link_data: {
            image_hash: hash,
            link: "",
            message: "",
            caption: "",
            call_to_action: {
                "type": "",
                "value": {
                    "link": ""
                }
            }
        },
        platform_customizations: {
          instagram: {
              image_url: "",
              image_crops: {
                  "100x100": [
                      [
                          0,
                          0
                      ],
                      [
                          800,
                          800
                      ]
                  ]
              }
          }
        }
      }
    }
    return new Promise<Creative>((resolve, reject) => {
      this.facebookService.createCreative(creative).subscribe(
        (data) => resolve(data),
        (error) => reject(error)
      )
    })
  }

  async createAd(adset: Adset){
    let hash: string = ""
    let creative: Creative = null

    hash = await this.uploadImgToGraph()
    creative = await this.createCreative(hash)
      
    let ad: Ad = {
        name: this.AD_NAME,
        adset_id: adset.adset_id,
        creative:{
          creative_id: creative.creative_id
        },
        status: this.campaign_status.PAUSED
      }

    return new Promise((resolve, reject) => {
      this.facebookService.createAd(ad).subscribe(
        (data) => resolve(data),
        (error) => reject(error)
      )
    })
  }

  goFrame1(){
    this.frame1 = true
    this.frame2 = false
    this.frame3 = false
  }

  goFrame2(){
   this.getName(this.campaignNameCtr).then(get_name=>{
      if(get_name==='ok'){
        this.CAMPAIGN_NAME = this.campaignNameCtr.value
        this.getSpecialAdCategory().then(get_SAC=>{
          if(get_SAC==='ok'){
            this.OBJECTIVE = this.currentOptionSelected.apiName
            this.frame2 = true
            this.frame1 = false
            this.frame3 = false
          }else{ this.spinnerCreation = false }
        }).catch(()=>{ this.spinnerCreation = false })
      }else{ this.spinnerCreation = false }
    }).catch(()=>{ this.spinnerCreation = false })
  }

  goFrame3(){
    this.getName(this.adsetNameCtr).then(get_name => {
      if(get_name === 'ok'){
        this.AD_SET_NAME = this.adsetNameCtr.value
        this.getBudget().then(get_budget => {
          if(get_budget === 'ok'){
            this.getDates().then(get_dates => {
              if(get_dates === 'ok'){
                this.getAudience().then(get_audience => {
                  if(get_audience === 'ok'){
                    this.getPlacement().then(get_placement => {
                      if(get_placement === 'ok'){
                        this.getOptimizationAndBilling().then(get_oab => {
                          if(get_oab === 'ok'){
                            this.fetchFacebookPages()
                            this.frame3 = true
                            this.frame1 = false
                            this.frame2 = false
                          }else{ this.spinnerCreation = false }
                        }).catch((e) => this.spinnerCreation = false)
                      }else{ this.spinnerCreation = false }
                    }).catch((e) => this.spinnerCreation = false)
                  }else{ this.spinnerCreation = false }
                }).catch(() => this.spinnerCreation = false)
              }else { this.spinnerCreation = false }
            }).catch(() => this.spinnerCreation = false)
          }else{ this.spinnerCreation = false }
        }).catch((e) => console.log(e))
      }else { this.spinnerCreation = false }
    }).catch(() => this.spinnerCreation = false)
  }

  openDialogPublish(data) {
    const dialogRef = this.dialog.open(DialogPublish, { data })
    dialogRef.afterClosed().subscribe(result => {
      if(result === undefined){
        this.router.navigate(['/campaigns/fb-list'])
      }else if(result === 'publish'){
        this.router.navigate(['/campaigns/fb-list'])
      }
    })
  }

  openCampaignBuilder(){
    this.getName(this.adNameCtr).then(get_name => {
      if(get_name === 'ok'){
        this.AD_NAME = this.adNameCtr.value
        this.getFacebookPageId().then(get_page_id => {
          if(get_page_id === 'ok'){
            this.saveCampaign()
          }else { this.spinnerCreation = false }
        }).catch(() => this.spinnerCreation = false )
      }else { this.spinnerCreation = false }
    }).catch(() => { this.spinnerCreation = false })
  }

  saveCampaign(){
    this.loaderSaving = true
    this.createCampaign()
      .then((campaign: Campaign) => this.createAdset(campaign))
      .then((adset: Adset) => this.createAd(adset))
      .then(() => {
        let data = {
          objective: this.currentOptionSelected.name,
          campaign_name: this.CAMPAIGN_NAME,
          daily_budget: this.DAILY_BUDGET,
          bid_amount: this.BID_AMOUNT,
          start_date: this.startDateCtr.value.toGMTString(),
          age: { min: this.MIN_AGE, max: this.MAX_AGE },
          gender: this.genderCtr.value.name,
          placements: this.PLACEMENTS,
          optimization_goal: this.optimizationGoalCtr.value.name,
          billing_event: this.billingEventCtr.value.name
        }
        this.openDialogPublish(data)
      })
      .catch((e) => {
        console.log(e)
        this.loaderError = true
      })
  }

  log(val) { console.log(val) }
}
     

@Component({
  selector: 'dialog-publish',
  templateUrl: 'dialog-publish.html',
})
export class DialogPublish{
  constructor(
    public dialogRef: MatDialogRef<DialogPublish>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true
    }
    onNoClick(): void {
      this.dialogRef.disableClose = false
      this.dialogRef.close(undefined)
    } 
}
