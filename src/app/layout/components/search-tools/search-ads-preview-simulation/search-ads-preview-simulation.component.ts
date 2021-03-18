import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ASSET_TEXT } from 'src/app/utils/data';

@Component({
  selector: 'adf-search-ads-preview-simulation',
  templateUrl: './search-ads-preview-simulation.component.html',
  styleUrls: ['./search-ads-preview-simulation.component.scss']
})
export class SearchAdsPreviewSimulationComponent implements OnInit, AfterViewInit {
  public desktopFormat: boolean = false
  public mobileFormat: boolean = true
  title1ToDisplay: string = 'Titre 1'
  title2ToDisplay: string = 'Titre 1'
  title3ToDisplay: string = 'Titre 3'
  description1ToDisplay: string = 'Description 1'
  description2ToDisplay: string = 'Description 2'
  description3ToDisplay: string = 'Description 3'
  titlesAssets: ASSET_TEXT[] = []
  descriptionsAssets: ASSET_TEXT[] = []
  @Input() url_promote: string;
  PATH_1: string = ''
  PATH_2: string = ''
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
randomNumber: number = 2


ngAfterViewInit(){
  setInterval(()=>{
    this.randomNumber = this.getRandomInt(1,2)
    this.setPreviewIllustrationTitles()
    this.setPreviewIllustrationDescriptions()
  },3000)
}
getItemToShow(number1: number, number2: number): number{
  let value: number
  setTimeout(()=>{
    value = this.getRandomInt(number1, number2)
    if(number1===1 && number2===2){
      return value
    }else if(number1===1 && number2===3){
      if(value===2){
        value = 3
        return value
      }else{
        return value
      }
    }else if(number1===2 && number2===3){
      return value
    }
  },2000)
  return value
}
  setPreviewIllustrationTitles(){
    
    //console.log(this.titlesAssets.length)
    if(this.titlesAssets.length===1){
      this.title1ToDisplay = this.titlesAssets[0].assetText
      this.title2ToDisplay = 'Titre 2'
      this.title3ToDisplay = 'Titre 3'
    }else if(this.titlesAssets.length===2){
      let random1 = this.getRandomInt(0,1)
      let random2 = 0
      if(random1===0){
        random2=1
      }
      this.title1ToDisplay = this.titlesAssets[random1].assetText
      this.title2ToDisplay = this.titlesAssets[random2].assetText
      this.title3ToDisplay = 'Titre 3'
    }else if(this.titlesAssets.length===3){
      let random1 = this.getRandomInt(0,1)
      let random2 = 0
      let random3 = 2
      if(random1===0){
        random2=1
      }else if(random1===2){
        random3=1
      }
      

      this.title1ToDisplay = this.titlesAssets[random1].assetText
      this.title2ToDisplay = this.titlesAssets[random2].assetText
      this.title3ToDisplay = this.titlesAssets[random3].assetText
    }else if(this.titlesAssets.length>0){
      let random1 = this.getRandomInt(0, this.titlesAssets.length>0?this.titlesAssets.length-1:0)
      let random2 = this.getRandomInt(0, this.titlesAssets.length>0?this.titlesAssets.length-1:0)
      let random3 = this.getRandomInt(0, this.titlesAssets.length>0?this.titlesAssets.length-1:0)
      if(random1===random2 && random2!==random3){
        let new_rand = this.getRandomInt(0, this.titlesAssets.length>0?this.titlesAssets.length-1:0)
        if(new_rand===random2 || new_rand===random3){
          let other_rand = this.getRandomInt(0, this.titlesAssets.length>0?this.titlesAssets.length-1:0)
          random2=other_rand
        }else{
          random2=new_rand
        }
      }else if(random1===random3 && random3!==random2){
        let new_rand = this.getRandomInt(0, this.titlesAssets.length>0?this.titlesAssets.length-1:0)
        if(new_rand===random2 || new_rand===random3){
          let other_rand = this.getRandomInt(0, this.titlesAssets.length>0?this.titlesAssets.length-1:0)
          random3=other_rand
        }else{
          random3=new_rand
        }
      }
      let text1 = this.titlesAssets[random1].assetText
      let text2 = this.titlesAssets[random2].assetText
      let text3 = this.titlesAssets[random3].assetText
      this.title1ToDisplay = text1
      this.title2ToDisplay = text2
      this.title3ToDisplay = text3
    } 
    //this.cd.detectChanges()
    //console.log(this.title1ToDisplay)
    //console.log(this.title2ToDisplay)
    //console.log(this.title3ToDisplay)
  }
  setPreviewIllustrationDescriptions(){
    let random = this.getRandomInt(1,3)
if(this.descriptionsAssets.length===1){
  if(random===1){
    this.description1ToDisplay = this.descriptionsAssets[0].assetText
    this.description2ToDisplay = 'Description 2'
    this.description3ToDisplay = 'Description 3'
  }else if(random===2){
    this.description2ToDisplay = this.descriptionsAssets[0].assetText
    this.description1ToDisplay = 'Description 1'
    this.description3ToDisplay = 'Description 3'
  }else if(random===3){
    this.description3ToDisplay = this.descriptionsAssets[0].assetText
    this.description1ToDisplay = 'Description 1'
    this.description2ToDisplay = 'Description 2'
  }
}else if(this.descriptionsAssets.length===2){
  if(random===1){
    this.description1ToDisplay = this.descriptionsAssets[0].assetText
    this.description2ToDisplay = this.descriptionsAssets[1].assetText
    this.description3ToDisplay = 'TDescription 3'
  }else if(random===2){
    this.description1ToDisplay = this.descriptionsAssets[0].assetText
    this.description2ToDisplay = this.descriptionsAssets[1].assetText
    this.description3ToDisplay = 'Description 3'
  }else if(random===3){
    this.description1ToDisplay = this.descriptionsAssets[0].assetText
    this.description2ToDisplay = 'Description 2'
    this.description3ToDisplay = this.descriptionsAssets[1].assetText
  }
}else if(this.descriptionsAssets.length===3){
  if(random===1){
    this.description1ToDisplay = this.descriptionsAssets[0].assetText
    this.description2ToDisplay = this.descriptionsAssets[1].assetText
    this.description3ToDisplay = 'Description 3'
  }else if(random===2){
    this.description1ToDisplay = this.descriptionsAssets[0].assetText
    this.description2ToDisplay = this.descriptionsAssets[1].assetText
    this.description3ToDisplay = 'Description 3'
  }else if(random===3){
    this.description1ToDisplay = this.descriptionsAssets[0].assetText
    this.description2ToDisplay = this.descriptionsAssets[1].assetText
    this.description3ToDisplay = this.descriptionsAssets[2].assetText
  }
}else if(this.descriptionsAssets.length>0){
  let random1 = this.getRandomInt(0, this.descriptionsAssets.length>0?this.descriptionsAssets.length-1:0)
  let random2 = this.getRandomInt(0, this.descriptionsAssets.length>0?this.descriptionsAssets.length-1:0)
  let random3 = this.getRandomInt(0, this.descriptionsAssets.length>0?this.descriptionsAssets.length-1:0)
  let text1 = this.descriptionsAssets[random1].assetText
  let text2 = this.descriptionsAssets[random2].assetText
  let text3 = this.descriptionsAssets[random3].assetText
  this.description1ToDisplay = text1
  this.description2ToDisplay = text2
  this.description3ToDisplay = text3
} 
//console.log(this.description1ToDisplay)
//console.log(this.description2ToDisplay)
//console.log(this.description3ToDisplay)
//this.cd.detectChanges()
  }
 
   toggleDesktopFormat() {
    this.desktopFormat = true
     this.mobileFormat = false

  }
  toggleMobileFormat() {
    this.mobileFormat = true
    this.desktopFormat = false

  }
  adMobileDisplay: string = "1"
  constructor() { }

  ngOnInit(): void {
  }

}
