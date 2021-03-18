import { Component, OnInit, ViewChild } from '@angular/core';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSelectionList, MatSelectionListChange, MatListOption } from '@angular/material/list';
import { ages, genders, AGES_TYPE, GENDERS_TYPE, User_Role } from 'src/app/utils/data';
import * as _ from 'lodash'
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import {take} from 'rxjs/operators'

@Component({
  selector: 'adf-cmp-demographic-target-edit',
  templateUrl: './cmp-demographic-target-edit.component.html',
  styleUrls: ['./cmp-demographic-target-edit.component.scss']
})
export class CmpDemographicTargetEditComponent implements OnInit {

  currentLandingPage: string = ""
  expanded = true;
  selected = false;
   aacid: string = ""
  cid: string = undefined
  uid: string = undefined;
  campaignId: number = 0
  ad_group_id: number = 0
  idA: string = ""
  adf_account_id: string = ""
  uid_action: string= ""
  user_access: User_Role;
  @ViewChild('demographicExpansion', { static: false }) demographicExpansion: MatExpansionPanel
  @ViewChild('matSelectionListAges', { static: false }) matSelectionListAges: MatSelectionList;
  @ViewChild('matSelectionListGenders', { static: false }) matSelectionListGenders: MatSelectionList;
  ages = ages()
  genders = genders()
  AGES: AGES_TYPE[] = []
  GENDERS: GENDERS_TYPE[] = []
  NEW_TARGETED_AGES: AGES_TYPE[] = []
  NEW_EXCLUDED_AGES: AGES_TYPE[] = []
  NEW_TARGETED_GENDERS: GENDERS_TYPE[] = []
  NEW_EXCLUDED_GENDERS: GENDERS_TYPE[] = []
  CURRENT_TARGETED_AGES: AGES_TYPE[] = []
  CURRENT_EXCLUDED_AGES: AGES_TYPE[] = []
  CURRENT_TARGETED_GENDERS: GENDERS_TYPE[] = []
  CURRENT_EXCLUDED_GENDERS: GENDERS_TYPE[] = []

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
      this.demographicExpansion.open(); // Here's the magic
    }else{
      this.demographicExpansion.close()
    }
  }
 


  onAgeSelect(args: MatSelectionListChange) {
    //console.log(this.CURRENT_TARGETED_AGES)
    //console.log(this.CURRENT_EXCLUDED_AGES)
     let isTargeted = this.CURRENT_TARGETED_AGES.some(age => age.criterionId === args.option.value.id)
      let isExcluded = this.CURRENT_EXCLUDED_AGES.some(age => age.criterionId === args.option.value.id)
    if (args.option.selected) {
     
      if (this.campaignId === 0) {
        this.AGES.push({
          text: args.option.value.name,
          ageRangeType: '',
          criterionId: args.option.value.id,
          citerionType: '',
          type: ''
        })
        //console.log(this.AGES)
        
      } else {
        this.AGES.push({
          text: args.option.value.name,
          ageRangeType: '',
          criterionId: args.option.value.id,
          citerionType: '',
          type: ''
        })
        //console.log(this.AGES)
        /* if (isTargeted || isExcluded) {
          if (isTargeted) {
            return;
          } else if (isExcluded) {
            let isNewTargeted = this.NEW_TARGETED_AGES.some(age =>age.criterionId === args.option.value.id)
            let isNewExcluded = this.NEW_EXCLUDED_AGES.some(age => age.criterionId === args.option.value.id)
            if (isNewTargeted || isNewExcluded) {
              if (isNewTargeted) {
                return;
              } else if (isNewExcluded) {
                for (var i = 0; i < this.NEW_EXCLUDED_AGES.length; i++){
                  if (this.NEW_EXCLUDED_AGES[i].criterionId === args.option.value.id) {
                    this.NEW_EXCLUDED_AGES.splice(this.NEW_EXCLUDED_AGES.indexOf(this.NEW_EXCLUDED_AGES[i]), 1)
                    this.NEW_TARGETED_AGES.push({
          text: args.option.value.name,
          ageRangeType: '',
          criterionId: args.option.value.id,
          citerionType: '',
          type: ''
        })
                  }
                }
              } else {
                this.NEW_TARGETED_AGES.push({
          text: args.option.value.name,
          ageRangeType: '',
          criterionId: args.option.value.id,
          citerionType: '',
          type: ''
        })
              }
            }
            
          } else {
            alert('can target this')
          }
        } */
      }
    } else {
      if (this.campaignId === 0) {
        for (let i = 0; i < this.AGES.length; i++){
          if (this.AGES[i].criterionId === args.option.value.id) {
            this.AGES.splice(this.AGES.indexOf(this.AGES[i]), 1)
            //console.log(this.AGES)
          }
        }
        
      } else {
        for (let i = 0; i < this.AGES.length; i++){
          if (this.AGES[i].criterionId === args.option.value.id) {
            this.AGES.splice(this.AGES.indexOf(this.AGES[i]), 1)
            //console.log(this.AGES)
          }
        }
        
       /*  if (isTargeted || isExcluded) {
          if (isTargeted) {
             let isNewTargeted = this.NEW_TARGETED_AGES.some(age =>age.criterionId === args.option.value.id)
            let isNewExcluded = this.NEW_EXCLUDED_AGES.some(age => age.criterionId === args.option.value.id)
            if (isNewTargeted || isNewExcluded) {
              if (isNewTargeted) {
                 for (var i = 0; i < this.NEW_TARGETED_AGES.length; i++){
                  if (this.NEW_TARGETED_AGES[i].criterionId === args.option.value.id) {
                    this.NEW_TARGETED_AGES.splice(this.NEW_TARGETED_AGES.indexOf(this.NEW_TARGETED_AGES[i]), 1)
                    this.NEW_EXCLUDED_AGES.push({
          text: args.option.value.name,
          ageRangeType: '',
          criterionId: args.option.value.id,
          citerionType: '',
          type: ''
        })
                  }
                }
              } else if (isNewExcluded) {
                return;
              } else {
                this.NEW_TARGETED_GENDERS.push({
          text: args.option.value.name,
          gendersRangeType: '',
          criterionId: args.option.value.id,
          citerionType: '',
          type: ''
        })
              }
            }
            this.NEW_EXCLUDED_AGES.push({
          text: args.option.value.name,
          ageRangeType: '',
          criterionId: args.option.value.id,
          citerionType: '',
          type: ''
        })
          } else if (isExcluded) {
            return;
          } else {
            alert('can exclude this')
          }
        } */
      }
    }
  }
  onGenderSelect(args: MatSelectionListChange) {
      //console.log(this.CURRENT_TARGETED_GENDERS)
    //console.log(this.CURRENT_EXCLUDED_GENDERS)
     let isTargeted = this.CURRENT_TARGETED_GENDERS.some(gender =>gender.criterionId === args.option.value.id)
      let isExcluded = this.CURRENT_EXCLUDED_GENDERS.some(gender => gender.criterionId === args.option.value.id)
    if (args.option.selected) {
      if (this.campaignId === 0) { 
        this.GENDERS.push({
         text: args.option.value.name,
         gendersRangeType: '',
         criterionId: args.option.value.id,
         citerionType: '',
         type: ''
   })

      } else {
        this.GENDERS.push({
         text: args.option.value.name,
         gendersRangeType: '',
         criterionId: args.option.value.id,
         citerionType: '',
         type: ''
   })
        /* if (isTargeted || isExcluded) {
          if (isTargeted) {

            return;
          } else if (isExcluded) {
            let isNewTargeted = this.NEW_TARGETED_GENDERS.some(gender =>gender.criterionId === args.option.value.id)
            let isNewExcluded = this.NEW_EXCLUDED_GENDERS.some(gender => gender.criterionId === args.option.value.id)
            if (isNewTargeted || isNewExcluded) {
              if (isNewTargeted) {
                return;
              } else if (isNewExcluded) {
                for (var i = 0; i < this.NEW_EXCLUDED_GENDERS.length; i++){
                  if (this.NEW_EXCLUDED_GENDERS[i].criterionId === args.option.value.id) {
                    this.NEW_EXCLUDED_GENDERS.splice(this.NEW_EXCLUDED_GENDERS.indexOf(this.NEW_EXCLUDED_GENDERS[i]), 1)
                    this.NEW_TARGETED_GENDERS.push({
          text: args.option.value.name,
          gendersRangeType: '',
          criterionId: args.option.value.id,
          citerionType: '',
          type: ''
        })
                  }
                }
              } else {
                this.NEW_TARGETED_GENDERS.push({
          text: args.option.value.name,
          gendersRangeType: '',
          criterionId: args.option.value.id,
          citerionType: '',
          type: ''
        })
              }
            }
            
          } else {
            alert('can target this')
          }
        } */
      }
          
    } else {
      if (this.campaignId === 0) {
        for (let i = 0; i < this.GENDERS.length; i++){
          if (this.GENDERS[i].criterionId === args.option.value.id) {
            this.GENDERS.splice(this.GENDERS.indexOf(this.GENDERS[i]), 1)
          }
        }
        
      } else {
        for (let i = 0; i < this.GENDERS.length; i++){
          if (this.GENDERS[i].criterionId === args.option.value.id) {
            this.GENDERS.splice(this.GENDERS.indexOf(this.GENDERS[i]), 1)
          }
        }
        /* if (isTargeted || isExcluded) {
          if (isTargeted) {
             let isNewTargeted = this.NEW_TARGETED_GENDERS.some(gender =>gender.criterionId === args.option.value.id)
            let isNewExcluded = this.NEW_EXCLUDED_GENDERS.some(gender => gender.criterionId === args.option.value.id)
            if (isNewTargeted || isNewExcluded) {
              if (isNewTargeted) {
                 for (var i = 0; i < this.NEW_TARGETED_GENDERS.length; i++){
                  if (this.NEW_TARGETED_GENDERS[i].criterionId === args.option.value.id) {
                    this.NEW_TARGETED_GENDERS.splice(this.NEW_TARGETED_GENDERS.indexOf(this.NEW_TARGETED_GENDERS[i]), 1)
                    this.NEW_EXCLUDED_GENDERS.push({
          text: args.option.value.name,
          gendersRangeType: '',
          criterionId: args.option.value.id,
          citerionType: '',
          type: ''
        })
                  }
                }
              } else if (isNewExcluded) {
                return;
              } else {
                this.NEW_TARGETED_GENDERS.push({
          text: args.option.value.name,
          gendersRangeType: '',
          criterionId: args.option.value.id,
          citerionType: '',
          type: ''
        })
              }
            }
            
          } else if (isExcluded) {
            return;
          } else {
            alert('can exclude this')
          }
        } */
      }
    }
   }
  ngAfterViewInit(): void {
  
    for (let age of this.ages) {
                 
                  this.CURRENT_EXCLUDED_AGES.push({
                    text: age.name,
                    ageRangeType: '',
                    criterionId: age.id,
                    citerionType: '',
                    type: ''
                    })
    }
    
    for (let gender of this.genders) {
                 
                  this.CURRENT_EXCLUDED_GENDERS.push({
                    text: gender.name,
                    gendersRangeType: '',
                    criterionId: gender.id,
                    citerionType: '',
                    type: ''
                    })
              }

  }

  constructor(private displayService: DisplayService, private router: Router, private route: ActivatedRoute, private storageService: LocalStorageService, private youtubeService: YoutubeService) { }

 ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
        this.storageService.getUserIdAndAccountId().then(response => {
          if (response !== null) {
            this.aacid = response.aacid
            this.user_access  = response.role
            if (response.fromOwned) {
                this.uid_action = response.auid
               
              
              this.cid = params['cid'];
                   this.uid = response.auid
           
       this.getCampaignData()
              
            
                
            } else {
              
              this.uid_action = response.account.owner
       
              
              this.cid = params['cid'];
                 this.uid = response.auid;
      
       this.getCampaignData()
              
           
                
              }
           
            
          
          }
          })
    
    })
 }
  
  getCampaignData() {
   
    if (window.location.pathname === '/campaigns/settings/display') {
     this.displayService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
             this.campaignId = campaign.id_campagne
         this.idA = campaign.ad_group_id_firebase
         this.ad_group_id = campaign.ad_group_id
         if (campaign.ages.length === 7) {
           this.matSelectionListAges.selectAll()
           this.AGES = []
           for (let age of campaign.ages) {
             this.AGES.push({
               text: age.text,
               ageRangeType: '',
               criterionId: age.criterionId,
               citerionType: '',
               type: ''
             })
             /* this.CURRENT_TARGETED_AGES.push({
               text: age.text,
               ageRangeType: '',
               criterionId: age.criterionId,
               citerionType: '',
               type: ''
             }) */
           }
         
         } else if (campaign.ages.length > 0 && campaign.ages.length < 7) {
           this.AGES = []
             
           for (let age of campaign.ages) {
             this.AGES.push({
               text: age.text,
               ageRangeType: '',
               criterionId: age.criterionId,
               citerionType: '',
               type: ''
             })
             for (let i = 0; i < this.matSelectionListAges.options['_results'].length; i++) {
               if (age.criterionId === this.matSelectionListAges.options['_results'][i]['_value']['id']) {
                 let option: MatListOption = this.matSelectionListAges.options['_results'][i]
                 this.matSelectionListAges.selectedOptions.select(option)
                 /* this.CURRENT_TARGETED_AGES.push(age)
                 this.CURRENT_EXCLUDED_AGES.splice(this.CURRENT_EXCLUDED_AGES.indexOf(age), 1) */
                    
               } else {
                 /* this.CURRENT_EXCLUDED_AGES.push(age) */
               }
             }
           }
         } else if (campaign.ages.length === 0) {
           this.matSelectionListAges.selectAll()
           for (let age of this.ages) {
             this.AGES.push({
               text: age.name,
               ageRangeType: '',
               criterionId: age.id,
               citerionType: '',
               type: ''
             })
             /* this.CURRENT_TARGETED_AGES.push({
               text: age.name,
               ageRangeType: '',
               criterionId: age.id,
               citerionType: '',
               type: ''
             }) */
           }
         }
            
         if (campaign.genders.length === 3) {
           this.CURRENT_TARGETED_GENDERS = []
           this.CURRENT_EXCLUDED_GENDERS = []
           this.matSelectionListGenders.selectAll()
           this.GENDERS = []
           for (let gender of campaign.genders) {
              
             this.GENDERS.push({
               text: gender.text,
               gendersRangeType: '',
               criterionId: gender.criterionId,
               citerionType: '',
               type: ''
             })
           }
         } else if (campaign.genders.length > 0 && campaign.genders.length < 3) {
           this.GENDERS = []
           for (let gender of campaign.genders) {
                
             this.GENDERS.push({
               text: gender.text,
               gendersRangeType: '',
               criterionId: gender.criterionId,
               citerionType: '',
               type: ''
             })
             for (let i = 0; i < this.matSelectionListGenders.options['_results'].length; i++) {
               if (gender.criterionId === this.matSelectionListGenders.options['_results'][i]['_value']['id']) {
                 let option: MatListOption = this.matSelectionListGenders.options['_results'][i]
                 this.matSelectionListGenders.selectedOptions.select(option)
                 /* this.CURRENT_TARGETED_GENDERS.push(gender)
                this.CURRENT_EXCLUDED_GENDERS.splice(this.CURRENT_EXCLUDED_GENDERS.indexOf(gender),1) */
                     
               } else {
                    
               }
             }
           }
         } else if (campaign.genders.length === 0) {
           this.matSelectionListGenders.selectAll()
           for (let gender of this.genders) {
             this.GENDERS.push({
               text: gender.name,
               gendersRangeType: '',
               criterionId: gender.id,
               citerionType: '',
               type: ''
             })
           }
             
         }
            }
          })
    } else if (window.location.pathname === '/campaigns/settings/native') {
      this.youtubeService.getCampaign(this.cid).valueChanges().pipe(take(1)).subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
             this.campaignId = campaign.id_campagne
         this.idA = campaign.ad_group_id_firebase
         this.ad_group_id = campaign.ad_group_id
         if (campaign.ages.length === 7) {
           this.matSelectionListAges.selectAll()
           this.AGES = []
           for (let age of campaign.ages) {
             this.AGES.push({
               text: age.text,
               ageRangeType: '',
               criterionId: age.criterionId,
               citerionType: '',
               type: ''
             })
             /* this.CURRENT_TARGETED_AGES.push({
               text: age.text,
               ageRangeType: '',
               criterionId: age.criterionId,
               citerionType: '',
               type: ''
             }) */
           }
         
         } else if (campaign.ages.length > 0 && campaign.ages.length < 7) {
           this.AGES = []
             
           for (let age of campaign.ages) {
             this.AGES.push({
               text: age.text,
               ageRangeType: '',
               criterionId: age.criterionId,
               citerionType: '',
               type: ''
             })
             for (let i = 0; i < this.matSelectionListAges.options['_results'].length; i++) {
               if (age.criterionId === this.matSelectionListAges.options['_results'][i]['_value']['id']) {
                 let option: MatListOption = this.matSelectionListAges.options['_results'][i]
                 this.matSelectionListAges.selectedOptions.select(option)
                 /* this.CURRENT_TARGETED_AGES.push(age)
                 this.CURRENT_EXCLUDED_AGES.splice(this.CURRENT_EXCLUDED_AGES.indexOf(age), 1) */
                    
               } else {
                 /* this.CURRENT_EXCLUDED_AGES.push(age) */
               }
             }
           }
         } else if (campaign.ages.length === 0) {
           this.matSelectionListAges.selectAll()
           for (let age of this.ages) {
             this.AGES.push({
               text: age.name,
               ageRangeType: '',
               criterionId: age.id,
               citerionType: '',
               type: ''
             })
             /* this.CURRENT_TARGETED_AGES.push({
               text: age.name,
               ageRangeType: '',
               criterionId: age.id,
               citerionType: '',
               type: ''
             }) */
           }
         }
            
         if (campaign.genders.length === 3) {
           this.CURRENT_TARGETED_GENDERS = []
           this.CURRENT_EXCLUDED_GENDERS = []
           this.matSelectionListGenders.selectAll()
           this.GENDERS = []
           for (let gender of campaign.genders) {
              
             this.GENDERS.push({
               text: gender.text,
               gendersRangeType: '',
               criterionId: gender.criterionId,
               citerionType: '',
               type: ''
             })
           }
         } else if (campaign.genders.length > 0 && campaign.genders.length < 3) {
           this.GENDERS = []
           for (let gender of campaign.genders) {
                
             this.GENDERS.push({
               text: gender.text,
               gendersRangeType: '',
               criterionId: gender.criterionId,
               citerionType: '',
               type: ''
             })
             for (let i = 0; i < this.matSelectionListGenders.options['_results'].length; i++) {
               if (gender.criterionId === this.matSelectionListGenders.options['_results'][i]['_value']['id']) {
                 let option: MatListOption = this.matSelectionListGenders.options['_results'][i]
                 this.matSelectionListGenders.selectedOptions.select(option)
                 /* this.CURRENT_TARGETED_GENDERS.push(gender)
                this.CURRENT_EXCLUDED_GENDERS.splice(this.CURRENT_EXCLUDED_GENDERS.indexOf(gender),1) */
                     
               } else {
                    
               }
             }
           }
         } else if (campaign.genders.length === 0) {
           this.matSelectionListGenders.selectAll()
           for (let gender of this.genders) {
             this.GENDERS.push({
               text: gender.name,
               gendersRangeType: '',
               criterionId: gender.id,
               citerionType: '',
               type: ''
             })
           }
             
         }
            }
          })
    } else {
      this.router.navigate(['/campaigns'])
   }
    
  }

  public spinnerUpdate: boolean = false
  updateDemographicTarget() {
    this.spinnerUpdate = true
    if (window.location.pathname === '/campaigns/settings/display') {
       if (this.campaignId === 0) {
      this.displayService.updateCampaign(this.cid, { ages: this.AGES, genders: this.GENDERS}).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
      
    } else {
        this.displayService.targetNewAge(this.AGES, this.cid, this.campaignId, this.idA, this.ad_group_id).then(response => {
          if (response === "ok") {
           this.displayService.targetNewGender(this.GENDERS, this.cid, this.campaignId, this.idA, this.ad_group_id).then(response => {
          if (response === "ok") {
            
            this.spinnerUpdate = false
          } else {
            this.spinnerUpdate = false
            alert("une erreur s'est produite")
          }
        })
          } else {
            this.spinnerUpdate = false
            alert("une erreur s'est produite")
          }
        })
      
    }
    } else if (window.location.pathname === '/campaigns/settings/native') {
        if (this.campaignId === 0) {
      this.youtubeService.updateCampaign(this.cid, { ages: this.AGES, genders: this.GENDERS}).then(update => {
          if (update === "ok") {
            this.spinnerUpdate = false
            this.togglePanel(event)
            this.getCampaignData()
          } else {
            this.spinnerUpdate = false
          }
        })
      
    } else {
        this.youtubeService.targetNewAge(this.AGES, this.cid, this.campaignId, this.idA, this.ad_group_id).then(response => {
          if (response === "ok") {
           this.youtubeService.targetNewGender(this.GENDERS, this.cid, this.campaignId, this.idA, this.ad_group_id).then(response => {
          if (response === "ok") {
            
            this.spinnerUpdate = false
          } else {
            this.spinnerUpdate = false
            alert("une erreur s'est produite")
          }
        })
          } else {
            this.spinnerUpdate = false
            alert("une erreur s'est produite")
          }
        })
      
    }
    } else {
      this.router.navigate(['/campaigns'])
   }
  
  }

  getDiffAgesBetweenCurrentTargetedAgesAndNewExcludedAges(): Promise<AGES_TYPE[]>{
    return new Promise(resolve => {
      let new_ages: AGES_TYPE[] = []
      for (let i = 0; i < this.NEW_EXCLUDED_AGES.length; i++){
        for (let j = 0; j < this.CURRENT_TARGETED_AGES.length; j++) { 
          if (this.NEW_EXCLUDED_AGES[i].criterionId === this.CURRENT_TARGETED_AGES[j].criterionId) {
            this.CURRENT_TARGETED_AGES.splice(this.CURRENT_TARGETED_AGES.indexOf(this.CURRENT_TARGETED_AGES[j]),1)
          }

        }
      }
      resolve(this.CURRENT_TARGETED_AGES)
    })
  }

  getFinalyNewAges(): Promise<AGES_TYPE[]>{
    return new Promise(resolve => {
      this.getDiffAgesBetweenCurrentTargetedAgesAndNewExcludedAges().then(ages_response => {
        if (ages_response.length > 0) {
          let new_ages: AGES_TYPE[] = _.uniqBy([...this.NEW_TARGETED_AGES, ...ages_response], 'criterionId')
          resolve(new_ages)
        } else {
         let new_ages: AGES_TYPE[] = _.uniqBy([...this.NEW_TARGETED_AGES, ...this.CURRENT_TARGETED_AGES], 'criterionId')
          resolve(new_ages)
        }
      })
    })
  }

}
