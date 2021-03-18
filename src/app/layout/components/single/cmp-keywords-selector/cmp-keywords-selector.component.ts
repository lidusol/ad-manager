import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Observable, of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { SearchService } from 'src/app/campaigns-management/services/search.service';
import { audience, KEYWORDS_TARGET, KEYWORD_RESULT, Language, LANGUAGES, User_Role } from 'src/app/utils/data';
import { urlDomainValidator, urlSchemeValidator, urlValidator } from 'src/app/utils/form-validators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { SortType } from '@swimlane/ngx-datatable';
import { KeywordsListPreviewComponent } from '../../keywords-list-preview/keywords-list-preview.component';

@Component({
  selector: 'adf-cmp-keywords-selector',
  templateUrl: './cmp-keywords-selector.component.html',
  styleUrls: ['./cmp-keywords-selector.component.scss']
})
export class CmpKeywordsSelectorComponent implements OnInit {
  active = 'top';
  websiteControl: FormControl = new FormControl('', [urlValidator, urlDomainValidator, urlSchemeValidator])
  keywordsArea: FormControl = new FormControl('', []);
  searchControl: FormControl = new FormControl('', []);
  languageControl: FormControl = new FormControl('', []);
  languageFilterCtrl: FormControl = new FormControl();
  finalKeywordsCtrl: FormControl = new FormControl('');
  keywordsFromWebPage: { keyword: string, volume: number }[] = []
  keywordsFromWords: { keyword: string, volume: number }[] = []
  keywordsFromProdSer: { keyword: string, volume: number }[] = []
  sortedData: { keyword: string, volume: number }[] = [];
  sortedDataP: { keyword: string, volume: number }[] = [];
  sortedDataS: { keyword: string, volume: number }[] = [];
  selectedFromWords = []
  selectedFromWebPage = []
  selectedFromProdSer = []
  public filteredLanguages: ReplaySubject<Language[]> = new ReplaySubject<Language[]>(1);
  languages: Language[] = LANGUAGES.filter(lang=>lang.CriterionID===1002 || lang.CriterionID===1000)
  selectedLanguage: Language = null
  private _onDestroy = new Subject<void>();
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  chipData: { CriterionID: number, Category: string }[] = [];
  languageData: { CriterionID: number, Category: string }[] = [];
  constructor(private searchService: SearchService) { }
  searchResult: { CriterionID: number, Category: string }[] = [];
  AUDIENCE: { CriterionID: number, Category: string }[] = audience
  numberOfResult: number = 10;
  showSaveBlock: boolean = false
  spinnerUpdate: boolean = false
  user_access: User_Role;
  CURRENT_AD_GROUP_KEYWORDS: KEYWORDS_TARGET[] = []
  onSelect(value: { CriterionID: number, Category: string }) {
    let exist = this.chipData.some(data => data.CriterionID === value.CriterionID)
    if (!exist) {
      this.chipData = []
      this.chipData.push(value)
      this.searchControl.reset()
      this.searchControl.setValue('');
    }
  }
  counter(i: number) {
    return new Array(i);
  }

  onSelectFromWebPage({ selected }) {
    //console.log('Select Event', selected, this.selectedFromWebPage);

    this.selectedFromWebPage.splice(0, this.selectedFromWebPage.length);
    this.selectedFromWebPage.push(...selected);
  }

  onActivateFromWebPage(event) {
    //console.log('Activate Event', event);
  }

  onSelectFromWords({ selected }) {
    //console.log('Select Event', selected, this.selectedFromWords);

    this.selectedFromWords.splice(0, this.selectedFromWords.length);
    this.selectedFromWords.push(...selected);
  }

  onActivateFromWords(event) {
    //console.log('Activate Event', event);
  }

  onSelectFromProdSer({ selected }) {
    //console.log('Select Event', selected, this.selectedFromProdSer);

    this.selectedFromProdSer.splice(0, this.selectedFromProdSer.length);
    this.selectedFromProdSer.push(...selected);
  }

  onActivateFromProdSer(event) {
    //console.log('Activate Event', event);
  }

  removeFromWebPage() {
    this.keywordsFromWebPage = this.keywordsFromWebPage.filter((el) => !this.selectedFromWebPage.includes(el));
    this.selectedFromWebPage = []
  }
  removeFromWords() {
    this.keywordsFromWords = this.keywordsFromWords.filter((el) => !this.selectedFromWords.includes(el));
    this.selectedFromWords = []
  }

  removeFromProdSer() {
    this.keywordsFromProdSer = this.keywordsFromProdSer.filter((el) => !this.selectedFromProdSer.includes(el));
    this.selectedFromProdSer = []
  }
  allKeywords: KEYWORD_RESULT[] = []
  addFromWebPage() {
    this.allKeywords = this.mergeKeywordsInUnique([...this.allKeywords, ...this.selectedFromWebPage], 'keyword')
    this.keywordsFromWebPage = []
    this.selectedFromWebPage = []
    this.showselected()
    this.getKeywords().then((res) => {
      if (res === 'ok') {
        this.KEYWORDS_SUBJECT.next(this.KEYWORDS)
      } else {
        this.KEYWORDS_SUBJECT.next([])
      }
    })
  }
  addFromWords() {
    this.allKeywords = this.mergeKeywordsInUnique([...this.allKeywords, ...this.selectedFromWords], 'keyword')
    this.keywordsFromWords = []
    this.selectedFromWords = []
    this.showselected()
    this.getKeywords().then((res) => {
      if (res === 'ok') {
        this.KEYWORDS_SUBJECT.next(this.KEYWORDS)
      } else {
        this.KEYWORDS_SUBJECT.next([])
      }
    })
  }
  addFromProdSer() {
    this.allKeywords = this.mergeKeywordsInUnique([...this.allKeywords, ...this.selectedFromProdSer], 'keyword')
    this.keywordsFromProdSer = []
    this.selectedFromProdSer = []
    this.showselected()
    this.getKeywords().then((res) => {
      if (res === 'ok') {
        this.KEYWORDS_SUBJECT.next(this.KEYWORDS)
      } else {
        this.KEYWORDS_SUBJECT.next([])
      }
    })
  }
  cid: string = '';
  campaignId: number = 0
  ad_group_id: number = 0
  ad_group_id_firebase: string = ""
  CURRENT_KEYWORDS_NOT_PUBLISHED: any = []
  updateKeywords(){
    this.spinnerUpdate = true
    this.getKeywords().then((res)=>{
      if(res==='ok'){
        if(this.campaignId===0){
          //console.log(this.KEYWORDS)
          this.searchService.updateCampaign(this.cid, {keywords: this.KEYWORDS}).then(()=>{
            this.spinnerUpdate = false
          }).catch((e)=>{
            //console.log(e)
            this.spinnerUpdate = false
          })

        }else{
          //console.log(this.KEYWORDS)
          let keywords = this.KEYWORDS.filter(key=>!this.CURRENT_AD_GROUP_KEYWORDS.some(_key=>_key.keyword===key))
          //console.log(keywords)
          this.spinnerUpdate = false
          this.searchService.targetKeywords(keywords, this.ad_group_id, this.ad_group_id_firebase, this.CURRENT_AD_GROUP_KEYWORDS).then((keyRes)=>{
            if(keyRes==='ok'){
              this.spinnerUpdate = false
            }else{
              this.spinnerUpdate = false
            }
          }).catch((e)=>{
            this.spinnerUpdate = false
          })
        }
      }else{
        this.spinnerUpdate = false
      }
    }).catch((e)=>{
      this.spinnerUpdate = false
    })
  }
  @ViewChild(KeywordsListPreviewComponent, {static: false}) keywordsList: KeywordsListPreviewComponent
  presetKeywords(value: any){
    setTimeout(()=>{
     
      if(this.campaignId===0){
        //this.keywordsList.setDataSourceNotPublished(value)
        let result: string;
        let arr = []
        value.forEach((val, idx1) => {
          arr.push(val.toString().replace(/(?:\r\n|\r|\n)/g, ''))
          if (idx1 === value.length - 1) {
            var uniqueKeywords = [];
            $.each(arr, function (i, el) {
              if ($.inArray(el, uniqueKeywords) === -1) uniqueKeywords.push(el);
            });
            result = uniqueKeywords.join(',\n')
            this.inputValue = result
            return result
          }
        })
        this.inputValue = result
        return result
      }else{
        this.keywordsList.campaignId = this.campaignId
        this.keywordsList.cid = this.cid
        this.keywordsList.ad_group_id = this.ad_group_id
        this.keywordsList.ad_group_id_firebase = this.ad_group_id_firebase
        this.keywordsList.setDataSourcePublished(value)
      }

    },500)

  }
  previousValue: string;
  inputValue: string = '';
  keyup() {
    this.showselected()
  }
  showselected(): string {
    let value = this.inputValue ? this.inputValue.toString().split(',') : ''.split(',')
    //console.log(value)
    let result: string;
    let arr = []
    if (this.allKeywords.length === 0) {
      value.forEach((val, idx1) => {
        arr.push(val.toString().replace(/(?:\r\n|\r|\n)/g, ''))
        if (idx1 === value.length - 1) {
          var uniqueKeywords = [];
          $.each(arr, function (i, el) {
            if ($.inArray(el, uniqueKeywords) === -1) uniqueKeywords.push(el);
          });
          result = uniqueKeywords.join(',\n')
          this.inputValue = result
          return result
        }
      })
      this.inputValue = result
      return result
    } else {
      this.allKeywords.forEach((key, idx) => {
        arr.push(key.keyword)
        if (idx === this.allKeywords.length - 1) {
          if (value.length > 1) {

            value.forEach((val, idx1) => {
              arr.push(val.toString().replace(/(?:\r\n|\r|\n)/g, ''))
              if (idx1 === value.length - 1) {
                var uniqueKeywords = [];
                $.each(arr, function (i, el) {
                  if ($.inArray(el, uniqueKeywords) === -1) uniqueKeywords.push(el);
                });
                result = uniqueKeywords.join(',\n')
                this.inputValue = result
                this.allKeywords = []
                return this.inputValue
              }
            })

          } else {
            var uniqueKeywords = [];
            $.each(arr, function (i, el) {
              if ($.inArray(el, uniqueKeywords) === -1) uniqueKeywords.push(el);
            });
            result = uniqueKeywords.join(',\n')
            this.inputValue = result
            this.allKeywords = []
            return this.inputValue
          }

        }
      })
    }
    // if(value!==undefined && value!==null && value!==this.previousValue){
    //   this.previousValue = value
    //   if(value.length===0){
    //     this.allKeywords.forEach((key, idx)=>{
    //       arr.push(key.keyword)
    //       if(idx===this.allKeywords.length-1){
    //         result = arr.join(',\n')
    //         this.allKeywords = []
    //         this.inputValue=result
    //         return result
    //       }
    //     })
    //     this.inputValue=result
    //     return result
    //   }else{
    //     if(this.allKeywords.length===0){
    //       value.forEach((val, idx1)=>{
    //         arr.push(val.toString().replace(/(?:\r\n|\r|\n)/g, ''))
    //         if(idx1===value.length-1){
    //           result = arr.join(',\n')
    //           this.inputValue=result
    //           return result
    //         }
    //       })
    //       this.inputValue=result
    //       return result
    //     }else{
    //       this.allKeywords.forEach((key, idx)=>{
    //         arr.push(key.keyword)
    //         if(idx===this.allKeywords.length-1){
    //           value.forEach((val, idx1)=>{
    //             arr.push(val.toString().replace(/(?:\r\n|\r|\n)/g, ''))
    //             if(idx1===value.length-1){
    //               result = arr.join(',\n')
    //               this.inputValue=result
    //               return result
    //             }
    //           })

    //         }
    //       })
    //       this.inputValue=result
    //       return result
    //     }
    //   }

    // }

    // this is basic string representation of array
  }


  mergeKeywordsInUnique<KEYWORD_RESULT>(array: KEYWORD_RESULT[], property: any): KEYWORD_RESULT[] {

    const newArray = new Map();

    array.forEach((item: KEYWORD_RESULT) => {
      const propertyValue = item[property];
      newArray.has(propertyValue) ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) }) : newArray.set(propertyValue, item);
    });

    return Array.from(newArray.values());
  }


  // add(event: MatChipInputEvent): void {
  //   //console.log(event)
  //   const input = event.input;
  //   const value: {CriterionID: number, Category: string} = JSON.parse(event.value);

  //   // Add our fruit
  //   if ((value.Category || '').trim()) {
  //     this.chipData.push(value);
  //   }

  //   // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }

  //   this.searchControl.setValue(null);
  // }

  remove(data: { CriterionID: number, Category: string }): void {
    const index = this.chipData.indexOf(data);

    if (index >= 0) {
      this.chipData.splice(index, 1);
    }
  }

  KEYWORDS = []

  getKeywords(): Promise<string> {
    return new Promise(resolve => {
      let value = this.inputValue ? this.inputValue.toString().split(',') : ''.split(',')
      //console.log(value)
      if (value.length > 0) {
        //console.log('processing keywords')
        let arr = []
        let self = this
        this.KEYWORDS = []
        value.forEach((key, i) => {
          if (key.toString().replace(/(?:\r\n|\r|\n)/g, '') !== '' || key.toString().replace(/(?:\r\n|\r|\n)/g, '').length > 2) {
            arr.push(key.toString().replace(/(?:\r\n|\r|\n)/g, ''))
            if (i === value.length - 1) {
              $.each(arr, function (i, el) {
                if ($.inArray(el, self.KEYWORDS) === -1) self.KEYWORDS.push(el);
              });
              //console.log(this.KEYWORDS)
              resolve('ok')
            }
          } else {
            if (i === value.length - 1) {
              $.each(arr, function (i, el) {
                if ($.inArray(el, self.KEYWORDS) === -1) self.KEYWORDS.push(el);
              });
              //console.log(this.KEYWORDS)
              resolve('ok')
            }
          }

        })
      } else {
        //console.log('no keywords')
        resolve('no keywords')
      }

    })
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    let selected: { CriterionID: number, Category: string } = JSON.parse(event.option.viewValue)
    this.chipData.push(selected);
    this.searchControl.reset()
    this.searchControl.setValue('');
  }

  onChanges() {
    this.searchControl.valueChanges.pipe(
      filter(data => {
        return data.toString().trim().length > 0
      }),
      debounceTime(500),
      switchMap((id: { CriterionID: number, Category: string }) => {
        //console.log('trim', id)
        return id ? this.searchingValue(id.Category ? id.Category.replace(/[\s]/g, '') : id.toString().replace(/[\s]/g, '')) : of([]);
      })
    ).subscribe(data => {
      ////console.log(data)
      this.searchResult = data;
    })
  }


  searchingValue(value) {
    return of(this.AUDIENCE.filter(user => user.Category.replace(/[\s]/g, '').toLowerCase().includes(value.toLowerCase())));
  }
  spinnerWords: boolean = false
  searchKeyword() {
    if (this.keywordsArea.valid) {
      this.spinnerWords = true
      let value: string = this.keywordsArea.value.toString()
      let split: string[] = value.split(',')
      //console.log(split)
      this.searchService.getKeywordsEstimationFromkeywords(split, this.selectedLanguage, this.numberOfResult).then(estimations => {
        if (estimations !== null) {
          //console.log(estimations)
          this.keywordsFromWords = estimations
          this.sortedDataP = this.keywordsFromWords.slice();
          this.spinnerWords = false
        } else {
          this.keywordsFromWords = []
          this.sortedDataP = this.keywordsFromWords.slice();
          this.spinnerWords = false
        }
      })
    }

  }
  spinnerUrl: boolean = false
  searchKeywordByUrl() {
    if (this.websiteControl.valid) {
      this.spinnerUrl = true
      this.searchService.getKeywordsEstimationFromWebPage([this.websiteControl.value], this.selectedLanguage, this.numberOfResult).then(estimations => {
        if (estimations !== null) {
          //console.log(estimations)
          this.keywordsFromWebPage = estimations
          this.sortedData = this.keywordsFromWebPage.slice();
          this.spinnerUrl = false
        } else {
          this.keywordsFromWebPage = []
          this.sortedData = this.keywordsFromWebPage.slice();
          this.spinnerUrl = false
        }
      })
    }
  }
  spinnerServiceProduct: boolean = false
  searchKeywordFromService() {
    if (this.searchControl.valid) {
      this.spinnerServiceProduct = true
      this.searchService.getKeywordsEstimationFromService(this.chipData, this.selectedLanguage, this.numberOfResult).then(estimations => {
        if (estimations !== null) {
          //console.log(estimations)
          this.keywordsFromProdSer = estimations
          this.sortedDataS = this.keywordsFromProdSer.slice();
          this.spinnerServiceProduct = false
        } else {
          this.keywordsFromProdSer = []
          this.sortedDataS = this.keywordsFromProdSer.slice();
          this.spinnerServiceProduct = false
        }
      })
    }
  }
  KEYWORDS_SUBJECT: Subject<any> = new Subject<any>()
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.setInitialValue();
    this.languageControl.valueChanges.subscribe(lang => {
      this.selectedLanguage = lang
    })
    $('#keywordField').on("keyup", (e) => {
      if (e.keyCode == 188) {
        const sp = this.inputValue.toString().split(',')
        if (sp[sp.length - 2] !== undefined && sp[sp.length - 2] !== null && sp[sp.length - 2] !== '') {
          let arr = []
          let result: string;
          sp.forEach((val, idx1) => {
            arr.push(val.toString().replace(/(?:\r\n|\r|\n)/g, ''))
            if (idx1 === sp.length - 1) {
              var uniqueKeywords = [];
              $.each(arr, function (i, el) {
                if ($.inArray(el, uniqueKeywords) === -1) uniqueKeywords.push(el);
              });
              result = uniqueKeywords.join(',\n')
              this.inputValue = result
              this.getKeywords().then((res) => {
                if (res === 'ok') {
                  this.KEYWORDS_SUBJECT.next(this.KEYWORDS)
                } else {
                  this.KEYWORDS_SUBJECT.next([])
                }
              })
            }
          })
          // this.inputValue =  sp.join(',\n')

        } else {
          this.KEYWORDS_SUBJECT.next(this.KEYWORDS)
        }
        //this.showselected()
      } else {
        this.getKeywords().then((res) => {
          if (res === 'ok') {
            this.KEYWORDS_SUBJECT.next(this.KEYWORDS)
          } else {
            this.KEYWORDS_SUBJECT.next([])
          }
        })
      }
    });
  }
  ngOnInit(): void {

    this.onChanges();
    this.selectedLanguage = this.languages[1]
    this.languageControl.setValue(this.selectedLanguage);

    // load the initial bank list
    this.filteredLanguages.next(this.languages.slice());

    // listen for search field value changes
    this.languageFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterLanguages();
      });

  }
  @ViewChild('singleSelect') singleSelect: MatSelect;

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  private setInitialValue() {
    this.filteredLanguages
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function 
        // triggers initializing the selection according to the initial value of 
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially 
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: Language, b: Language) => a.CriterionID === b.CriterionID;
      });
  }

  private filterLanguages() {
    if (!this.languages) {
      return;
    }
    // get the search keyword
    let search = this.languageFilterCtrl.value;
    if (!search) {
      this.filteredLanguages.next(this.languages.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredLanguages.next(
      this.languages.filter(bank => bank.languageName.toLowerCase().indexOf(search) > -1)
    );
  }


  sortData(sort: Sort) {
    const data = this.keywordsFromWebPage.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'keyword': return this.compare(a.keyword, b.keyword, isAsc);
        case 'volume': return this.compare(a.volume, b.volume, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
