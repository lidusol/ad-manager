import { LyTheme2 } from '@alyle/ui';
import { LyDialog } from '@alyle/ui/dialog';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogComponent, PositionDataModel } from '@syncfusion/ej2-angular-popups';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AssetsService } from 'src/app/campaigns-management/services/assets.service';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { ASSET_TEXT, CustomValidators, SEARCH_ADS, SEARCH_ADS_BEFORE_UPLOAD, URL_PARSER } from 'src/app/utils/data';
import { SearchAdsPreviewSimulationComponent } from '../../search-tools/search-ads-preview-simulation/search-ads-preview-simulation.component';
import { ToastAdafriComponent } from '../../toast/toast.component';
declare const require: any;
@Component({
  selector: 'adf-cmp-search-ads-creator',
  templateUrl: './cmp-search-ads-creator.component.html',
  styleUrls: ['./cmp-search-ads-creator.component.scss']
})
export class CmpSearchAdsCreatorComponent implements OnInit {
  public visible: boolean = false
  adPanel: boolean = false
  isNewAd: boolean = false
  isEditAd: boolean = false
  fmEfficacity: any;
  efficacityPercent: number = 0
  showSaveButton: boolean = true;
  SEARCH_ADS_LIST: SEARCH_ADS[] = []
  search_before_upload: SEARCH_ADS_BEFORE_UPLOAD[] = []
  spinnerSaveSearch: boolean = false
  titlesItem = new FormArray([]);
  descriptionsItem = new FormArray([]);
  titlesAssets: ASSET_TEXT[] = []
  descriptionsAssets: ASSET_TEXT[] = []
  brandAssets: ASSET_TEXT = { assetText: '' }
  longHeadlineAssets: ASSET_TEXT = { assetText: '' }
  titlesValid: boolean = false
  longHeadlineValid: boolean = false
  descriptionsValid: boolean = false
  secondFormGroup: FormGroup
  path1: FormControl = new FormControl('', [Validators.maxLength(15)])
  path2: FormControl = new FormControl('', [Validators.maxLength(15)])
  public width: string = '50%';
  public isModal: boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  guidIndex: number = 0
  itemsGuide: { text: string }[] = [{ "text": "Ajoutez au minimum 5 titres." }, { "text": "Ajoutez au minimum 2 descriptions." }, { "text": "Utilisez des mots clés dans vos titres et descriptions." }]
  @ViewChild(SearchAdsPreviewSimulationComponent, { static: false }) searchAdsSimulation: SearchAdsPreviewSimulationComponent;
  panelEfficacityOpenState: boolean = true
  spinnerEfficacityValue: number = 50
  efficacityMessage: string = "Excellent"
  nextGuideItem() {
    //console.log(this.guidIndex)
    this.guidIndex = this.guidIndex + 1
    //console.log(this.guidIndex)
    //console.log(this.itemsGuide[this.guidIndex])
  }
  @Output() askKeywords: EventEmitter<boolean> = new EventEmitter<boolean>()
  previousGuideItem() {
    this.guidIndex = this.guidIndex - 1
  }
  KEYWORDS = []
  PATH_1: string = ''
  PATH_2: string = ''
  ngAfterViewInit() {
    setTimeout(() => {
      this.toggleAdNewAdPanel()
      setTimeout(() => {
        this.askKeywords.emit(true)

      })
    }, 500)
    this.path1.valueChanges.subscribe(value => {
      if (this.path1.valid) {
        this.PATH_1 = value
        if(this.searchAdsSimulation!==undefined){
          this.searchAdsSimulation.PATH_1 = this.PATH_1
        }
      } else {
        this.PATH_1 = ''
        if(this.searchAdsSimulation!==undefined){
          this.searchAdsSimulation.PATH_1 = this.PATH_1
        }
      }
    })
    this.path2.valueChanges.subscribe(value => {
      if (this.path2.valid) {
        this.PATH_2 = value
        if(this.searchAdsSimulation!==undefined){
          this.searchAdsSimulation.PATH_2 = this.PATH_2
        }
      } else {
        this.PATH_2 = ''
        if(this.searchAdsSimulation!==undefined){
          this.searchAdsSimulation.PATH_2 = this.PATH_2
        }
      }
    })
  }
  presetKeywords() {
    if (this.KEYWORDS.length > 0) {

      let assetText: ASSET_TEXT[] = []
      this.KEYWORDS.forEach((value, idx) => {
        if (value.keyword?value.keyword.length:value.length <= 30 && value.keyword?value.keyword.length:value.length >= 5) {
          assetText.push({ assetText: value.keyword?value.keyword:value })
          if (assetText.length === 15) {
            this.presetTitles(assetText)
          } else if (idx === this.KEYWORDS.length - 1) {
            this.presetTitles(assetText)

          }
        }
      })
    }
  }
  removeAd(){
    this.adConfirmDelete.show()
  }
  @ViewChild('adConfirmDelete', { static: false }) adConfirmDelete: DialogComponent
  getTitles(index?: number): Promise<string> {
    return new Promise(resolve => {
      this.titlesAssets = []
      if (this.titlesItem.length > 0) {
        for (let i = 0; i < this.titlesItem.length; i++) {
          let form = this.titlesItem.controls[i] as FormControl
          if (form.value.toString().length>0 && form.valid) {
            this.titlesAssets.push({
              assetText: form.value.title
            })
            if (this.titlesItem.length - 1 === i) {
              this.titlesValid = true
              this.titlesItem.updateValueAndValidity()
              this.searchAdsSimulation.titlesAssets = this.titlesAssets
              this.searchAdsSimulation.setPreviewIllustrationTitles()
              this.setEvolutionIndicator()
              // this.rdsSimulation.titleToDisplay = form.value.title
              // this.rdsSimulation.titlesAssets = this.titlesAssets
              /* this.rdsSimulation.setPreviewTitleCreation(this.titlesAssets.length -1) */
              resolve('ok')

            } else {
              this.setEvolutionIndicator()
              if (this.titlesItem.length - 1 === i) {
                if (this.titlesAssets.length > 0) {
                  resolve('ok')

                } else {
                  resolve('error')
                }

              }
            }

          } else {
            if (form.value.title === undefined || form.value.title === null || form.value.title.toString().trim().length === 0) {
              this.removeTitles(i)
              this.titlesItem.updateValueAndValidity()
              if (this.titlesItem.length - 1 === i) {
                if (this.titlesAssets.length > 0) {
                  resolve('ok')

                } else {
                  resolve('error')
                }

              }

            } else {
              this.titlesValid = false
              this.setEvolutionIndicator()
              this.titlesItem.updateValueAndValidity()
              if (this.titlesItem.length - 1 === i) {
                if (this.titlesAssets.length > 0) {
                  resolve('ok')

                } else {
                  resolve('error')
                  
                }

              }
            }
          }

        }



      } else {
        this.titlesValid = false
        this.titlesItem.updateValueAndValidity()
        this.setEvolutionIndicator()
        resolve('error')

      }
    })
  }

  getDescriptions(index?: number): Promise<string> {
    return new Promise(resolve => {
      this.descriptionsAssets = []
      if (this.descriptionsItem.length > 0) {
        for (let i = 0; i < this.descriptionsItem.length; i++) {
          let form = this.descriptionsItem.controls[i] as FormControl
          if (form.valid) {
            this.descriptionsAssets.push({
              assetText: form.value.description
            })
            if (this.descriptionsItem.length - 1 === i) {
              this.descriptionsValid = true
              this.descriptionsItem.updateValueAndValidity()
              this.searchAdsSimulation.descriptionsAssets = this.descriptionsAssets
              this.searchAdsSimulation.setPreviewIllustrationDescriptions()
              this.setEvolutionIndicator()
              // this.rdsSimulation.descriptionToDisplay = form.value.description
              // this.rdsSimulation.descriptionsAssets = this.descriptionsAssets
              /* this.rdsSimulation.setPreviewdescriptionCreation(this.descriptionsAssets.length -1) */
              resolve('ok')

            } else {
              this.setEvolutionIndicator()
              if (this.descriptionsItem.length - 1 === i) {
                if (this.descriptionsAssets.length > 0) {
                  resolve('ok')

                } else {
                  resolve('error')
                }

              }
            }

          } else {
            if (form.value.description === undefined || form.value.description === null || form.value.description.toString().trim().length === 0) {
              this.removeDescriptions(i)
              this.descriptionsItem.updateValueAndValidity()
              if (this.descriptionsItem.length - 1 === i) {
                if (this.descriptionsAssets.length > 0) {
                  resolve('ok')

                } else {
                  resolve('error')
                }

              }

            } else {
              this.descriptionsValid = false
              this.setEvolutionIndicator()
              this.descriptionsItem.updateValueAndValidity()
              if (this.descriptionsItem.length - 1 === i) {
                if (this.descriptionsAssets.length > 0) {
                  resolve('ok')

                } else {
                  resolve('error')
                }

              }
            }
          }

        }



      } else {
        this.descriptionsValid = false
        this.descriptionsItem.updateValueAndValidity()
        this.setEvolutionIndicator()
        resolve('error')

      }
    })
  }

  uid_action: string = ''
  aacid: string = ''
  uid: string = ""
  url_promote_subject: Subject<string> = new Subject<string>()
  visibleUrl: string = ''
  finalURL: string = ''
  visibleUrlDomain: string = ''
  initialVisibleUrl: string = ''
  initialFinalURL: string = ''
  initialVisibleUrlDomain: string = ''

  constructor(private _formBuilder: FormBuilder, private http: HttpClient, private theme: LyTheme2, private authService: AuthService, private assetService: AssetsService, private _dialog: LyDialog, private storageService: LocalStorageService, private sanitizer: DomSanitizer) {
    this.url_promote_subject.subscribe(data => {
      this.finalURL = data
      this.initialFinalURL = data
      var parse = require('url-parse')
        , url: URL_PARSER = parse(data, true);
      this.visibleUrl = 'www.' + url.hostname + "/"
      this.visibleUrlDomain = url.hostname
      this.initialVisibleUrl = 'www.' + url.hostname + "/"
      this.initialVisibleUrlDomain = url.hostname
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.url_promote_subject !== undefined && this.url_promote_subject !== null) {
      this.url_promote_subject.unsubscribe()
    }
  }
  ngOnInit(): void {

    this.secondFormGroup = this._formBuilder.group({
      title: ["", Validators.nullValidator],
      description: ["", Validators.nullValidator],
      brand: ["", Validators.required],
    });
    this.storageService.getUserIdAndAccountId().then(response => {
      if (response !== null) {
        this.uid = response.account.owner
        this.aacid = response.account.id
        /*this.subscriptionPreview =  this.everyFiveSecondsRefreshPreviewModel.subscribe(number => {
          console.log(number) */

        /* }) */

      }
    })
  }

  currentEditingId: string = ""
  editingIndex: number = null
  editSearchBeforeUpload(item: SEARCH_ADS_BEFORE_UPLOAD, index: number) {
    console.log(item)
    if (!this.isNewAd) {
      this.adPanel = true
      this.isEditAd = true
      this.isNewAd = false
      this.editingIndex = index
      this.currentEditingId = item.id
      this.visibleUrl = item.visibleUrl
      this.finalURL = item.finalURL
      this.visibleUrlDomain = item.visibleUrlDomain
      this.PATH_1 = item.path1
      this.PATH_2 = item.path2
      this.path1.setValue(this.PATH_1)
      this.path1.setValue(this.PATH_2)
      this.removeTitles(0)
      this.removeTitles(0)
      this.removeDescriptions(0)
      this.removeDescriptions(0)
      setTimeout(()=>{
        this.presetTitles(item.titles)
        this.presetDescriptions(item.descriptions)
        document.getElementById('creator-main-container').scrollIntoView();
        this.searchAdsSimulation.PATH_1 = this.PATH_1
        this.searchAdsSimulation.PATH_2 = this.PATH_2
        setTimeout(()=>{
          // this.setEvolutionIndicator()

        },1000)

      },500)

    }
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
    this.getTitles().then(title => {
      if (this.titlesItem.length < 15) {
        titles.forEach((title, idx) => {
          let group = new FormGroup({
            title: new FormControl(title.assetText, [Validators.required, Validators.maxLength(30)]),
          });
          if (this.titlesItem.length < 15) {
            let exist = this.titlesAssets.some(ctrl => ctrl.assetText === title.assetText)
            if (!exist && title.assetText!=='') {
              this.titlesItem.push(group)
              this.titlesAssets.push({
                assetText: title.assetText
              })

            }
            if (idx === titles.length - 1) {
              this.titlesItem.setValidators([CustomValidators.uniqueBy('title')]);
              this.titlesItem.updateValueAndValidity()
              //this.getTitles()
              this.removeTitles(0)
              this.setEvolutionIndicator()
            }
          } else {
            this.titlesItem.setValidators([CustomValidators.uniqueBy('title')]);
            this.titlesItem.updateValueAndValidity()
            //this.getTitles()
            this.removeTitles(0)
            this.setEvolutionIndicator()
          }


        })

      }


    })
  }
  removeTitles(index: number) {
    if (this.titlesItem.length > 1) {
      this.titlesItem.removeAt(index);
      this.getTitles()

    }
  }

  titleHasError() {
    let required = this.titlesItem.controls.some((item: FormGroup) => { return !item.controls.title.valid })
    return required
  }
  addDescriptions() {
    const group = new FormGroup({
      description: new FormControl('', [Validators.required, Validators.maxLength(90)],),
    });
    this.descriptionsItem.push(group)
    this.descriptionsItem.setValidators([CustomValidators.uniqueBy('description')]);
    this.descriptionsItem.updateValueAndValidity()
  }
  presetDescriptions(descriptions: ASSET_TEXT[]) {
    this.getDescriptions().then(description => {
      if (this.descriptionsItem.length < 15) {
        descriptions.forEach((description, idx) => {
          let group = new FormGroup({
            description: new FormControl(description.assetText, [Validators.required, Validators.maxLength(90)]),
          });
          if (this.descriptionsItem.length < 4) {
            let exist = this.descriptionsAssets.some(ctrl => ctrl.assetText === description.assetText)
            if (!exist && description.assetText!=='') {
              this.descriptionsItem.push(group)
              this.descriptionsAssets.push({
                assetText: description.assetText
              })

            }
            if (idx === descriptions.length - 1) {
              this.descriptionsItem.setValidators([CustomValidators.uniqueBy('description')]);
              this.descriptionsItem.updateValueAndValidity()
              //this.getDescriptions()
              this.removeDescriptions(0)
              this.setEvolutionIndicator()
            }
          } else {
            this.descriptionsItem.setValidators([CustomValidators.uniqueBy('description')]);
            this.descriptionsItem.updateValueAndValidity()
            this.removeDescriptions(0)
            //this.getDescriptions()
            this.setEvolutionIndicator()
          }


        })

      }


    })
  }
  removeDescriptions(index: number) {
    if (this.descriptionsItem.length > 1) {
      this.descriptionsItem.removeAt(index);
      this.getDescriptions()

    }
  }

  descriptionHasError() {
    let required = this.descriptionsItem.controls.some((item: FormGroup) => { return !item.controls.description.valid })
    return required
  }

  formOveredTitle(id: string) {
    if (this.titlesItem.length !== 1) {
      document.getElementById(id).classList.remove('d-none')

    }
  }
  formOveredDescription(id: string) {
    if (this.descriptionsItem.length !== 1) {
      document.getElementById(id).classList.remove('d-none')

    }
  }
  formLeaved(id: string) {
    document.getElementById(id).classList.add('d-none')
  }

  percent: number = 0
  setPercentage(percent: number) {
    console.log(percent)
    this.percent = percent
  }
  textStatusEfficacity: string = "Insuffisant"
  setEvolutionIndicator() {
    if (this.titlesAssets.length >= 10 && this.descriptionsAssets.length >= 2) {
      this.textStatusEfficacity = "Excellente"
    } else if ((this.titlesAssets.length < 10 && this.titlesAssets.length >= 5) && (this.descriptionsAssets.length > 2)) {
      this.textStatusEfficacity = "Moyenne"
      //this.setPercentage(80);
    } else {
      this.textStatusEfficacity = "Insuffisant"
      //this.setPercentage(0);

    }
    this.setPercentage(parseInt((((this.titlesAssets.length + this.descriptionsAssets.length) / 19)*100).toFixed(0)));
  }

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
      this.clearFormArray(this.titlesItem)
      this.clearFormArray(this.descriptionsItem)
      this.titlesItem.reset()
      this.descriptionsItem.reset()

      this.currentEditingId = ''
    }



  }

  clearFormArray(formArray: FormArray) {
    formArray = this._formBuilder.array([]);
  }

  adToDelete: SEARCH_ADS_BEFORE_UPLOAD = null
  showDeleteAd(ad: SEARCH_ADS_BEFORE_UPLOAD) {
    this.adToDelete = ad
    this.adConfirmDelete.show()

  }

  duplicateAd(ad: SEARCH_ADS_BEFORE_UPLOAD, index: number) {

    let new_ad: SEARCH_ADS_BEFORE_UPLOAD = {
      id: 'duplicated-' + new Date().getTime().toString(),
      titles: ad.titles,
      descriptions: ad.descriptions,
      finalURL: ad.finalURL,
      visibleUrl: ad.visibleUrl,
      visibleUrlDomain: ad.visibleUrlDomain
    }
    this.search_before_upload.push(new_ad)
    this.editSearchBeforeUpload(new_ad, index)

  }
  deletionConfirmed() {
    this.search_before_upload.forEach((value, index, arr) => {
      if (value.id === this.adToDelete.id) {
        this.search_before_upload.splice(index, 1)
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
    this.clearFormArray(this.titlesItem)
    this.clearFormArray(this.descriptionsItem)
    this.titlesItem.reset()
    this.descriptionsItem.reset()
    this.PATH_1 = ''
    this.PATH_2 = ''
    this.path1.reset()
    this.path2.reset()
    this.visibleUrl = this.initialVisibleUrl 
    this.finalURL = this.initialFinalURL
    this.visibleUrlDomain = this.initialVisibleUrlDomain
    this.currentEditingId = ''
    this.adPanel = false
    this.isNewAd = false
    this.isEditAd = false
    this.spinnerSaveSearch = false
  }

  resetComponent(){
    this.search_before_upload = []
    this.abortOperation()
  }
  getInt(str: string): number{
    return parseInt(str)
  }
  @Output() onSave: EventEmitter<{type: string, ad: SEARCH_ADS_BEFORE_UPLOAD, editing_id: string}> = new EventEmitter<{type: string, ad: SEARCH_ADS_BEFORE_UPLOAD, editing_id: string}>()
  @ViewChild('toast', { static: true }) toast: ToastAdafriComponent;
  saveSearchAd(): Promise<string> {
    return new Promise(resolve => {
      if(this.visibleUrl!==''){
        this.getTitles().then(title => {
          if (title === 'ok') {
            this.getDescriptions().then(description => {
              if (description === 'ok') {
                this.spinnerSaveSearch = true
                if (this.titlesAssets.length >= 5) {
                  if (this.descriptionsAssets.length >= 2) {
                    let ad: SEARCH_ADS_BEFORE_UPLOAD = {
                      id: new Date().getTime().toString(),
                      titles: this.titlesAssets,
                      descriptions: this.descriptionsAssets,
                      finalURL: this.finalURL,
                      visibleUrl: this.visibleUrl,
                      visibleUrlDomain: this.visibleUrlDomain,
                      path1: this.PATH_1.trim().toLowerCase(),
                      path2: this.PATH_2.trim().toLowerCase()

                    }
                    console.log(this.currentEditingId)
                    if(this.editingIndex===null){
                      this.search_before_upload.push(ad)
                      this.titlesAssets = []
                      this.descriptionsAssets = []
                      this.PATH_1 = ''
                      this.PATH_2 = ''
                      this.clearFormArray(this.titlesItem)
                      this.clearFormArray(this.descriptionsItem)
                      this.titlesItem.reset()
                      this.descriptionsItem.reset()
                      this.path1.reset()
                      this.path2.reset()
                      this.visibleUrl = this.initialVisibleUrl 
                      this.finalURL = this.initialFinalURL
                      this.visibleUrlDomain = this.initialVisibleUrlDomain
                      this.currentEditingId = ''
                      this.adPanel = false
                      this.isNewAd = false
                      this.isEditAd = false
                      this.spinnerSaveSearch = false
                      this.onSave.emit({
                        type: 'creation',
                       ad: ad,
                       editing_id: ''
                      })
                    }else{
                          let editing_id = this.currentEditingId
                          this.search_before_upload.splice(this.editingIndex, 1)
                          this.search_before_upload.push(ad)
                          this.titlesAssets = []
                          this.descriptionsAssets = []
                          this.PATH_1 = ''
                          this.PATH_2 = ''
                          this.clearFormArray(this.titlesItem)
                          this.clearFormArray(this.descriptionsItem)
                          this.titlesItem.reset()
                          this.descriptionsItem.reset()
                          this.path1.reset()
                          this.path2.reset()
                          this.visibleUrl = this.initialVisibleUrl 
                          this.finalURL = this.initialFinalURL
                          this.visibleUrlDomain = this.initialVisibleUrlDomain
                          this.currentEditingId = ''
                          this.editingIndex = null
                          this.adPanel = false
                          this.isNewAd = false
                          this.isEditAd = false
                          this.spinnerSaveSearch = false
                          this.onSave.emit({
                            type: 'edition',
                           ad: ad,
                           editing_id: editing_id
                          })
                       
  
                    }
                  } else {
                    this.toast.toast.title = 'Info'
                    this.toast.toast.content = 'Veuillez saisir au moins 2 descriptions pour votre annonce'
                    this.toast.toast.timeOut = 10000
                    this.toast.toast.cssClass = 'e-toast-info'
                    this.toast.toast.show()
                    this.spinnerSaveSearch = false
                  }
                } else {
                  this.toast.toast.title = 'Info'
                  this.toast.toast.content = 'Veuillez saisir au moins 5 titres pour votre annonce'
                  this.toast.toast.timeOut = 10000
                  this.toast.toast.cssClass = 'e-toast-info'
                  this.toast.toast.show()
                  this.spinnerSaveSearch = false
                }
  
              } else {
                this.toast.toast.title = 'Info'
                this.toast.toast.content = 'Veuillez vérifier la liste de vos descriptions'
                this.toast.toast.timeOut = 10000
                this.toast.toast.cssClass = 'e-toast-info'
                this.toast.toast.show()
                resolve('error')
                this.spinnerSaveSearch = false
              }
            }).catch((e) => {
              this.toast.toast.title = 'Info'
              this.toast.toast.content = 'Veuillez vérifier la liste de vos descriptions'
              this.toast.toast.timeOut = 10000
              this.toast.toast.cssClass = 'e-toast-info'
              this.toast.toast.show()
              resolve('error')
              this.spinnerSaveSearch = false
            })
          } else {
            this.toast.toast.title = 'Info'
            this.toast.toast.content = 'Veuillez vérifier la liste de vos titres'
            this.toast.toast.timeOut = 10000
            this.toast.toast.cssClass = 'e-toast-info'
            this.toast.toast.show()
            resolve('error')
            this.spinnerSaveSearch = false
          }
        }).catch((e) => {
          this.toast.toast.title = 'Info'
          this.toast.toast.content = 'Veuillez vérifier la liste de vos titres'
          this.toast.toast.timeOut = 10000
          this.toast.toast.cssClass = 'e-toast-info'
          this.toast.toast.show()
          resolve('error')
          this.spinnerSaveSearch = false
        })

      }else{
        this.toast.toast.title = 'Info'
        this.toast.toast.content = "Veuillez saisir l'url de la page de destination dans la section Landing page"
        this.toast.toast.timeOut = 10000
        this.toast.toast.cssClass = 'e-toast-info'
        this.toast.toast.show()
      }



    })
  }

}
