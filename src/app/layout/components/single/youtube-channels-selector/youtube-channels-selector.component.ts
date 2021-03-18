import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatRadioGroup } from '@angular/material/radio';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { YOUTUBE_CHANNELS_INTERFACE, YOUTUBE_VIDEOS_INTERFACE, YOUTUBE_SEARCH_INTERFACE, WEBSITE, URL_PARSER } from 'src/app/utils/data';
import { MdePopoverTrigger, MdePopover } from '@material-extended/mde';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import urlParser from "js-video-url-parser";
import isURL from 'is-url';
declare var require: any;
@Component({
  selector: 'adf-youtube-channels-selector',
  templateUrl: './youtube-channels-selector.component.html',
  styleUrls: ['./youtube-channels-selector.component.scss']
})
export class YoutubeChannelsSelectorComponent implements OnInit {
  DEFAULT_CHANNELS: YOUTUBE_CHANNELS_INTERFACE[] = 
[{'channelId': 'UC539kSEDgQGvYmdOSDuIaHw', 'name': 'Maro', 'snippet': 'Releasing original music asapppp. Instagram: @rememberthedayz Twitter: @rememberthedayz Snapchat: marwanbizzle Marwan Daou.', 'thumbnails': 'https://yt3.ggpht.com/-ibSrOQXjmwo/AAAAAAAAAAI/AAAAAAAAAAA/fy_bqg_2gBM/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'}, {'channelId': 'UCpQz6XjLaqj_d5ykS5o7L2w', 'name': 'MARO', 'snippet': "Literally you're my favorite singer in the world THANK YOU MARO” - Lennon Stella, Instagram, January 31, 2020 It wasn't until she was 19 that MARO realized ...", 'thumbnails': 'https://yt3.ggpht.com/-D0GmcoAE17I/AAAAAAAAAAI/AAAAAAAAAAA/KyZEF7UGUxE/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'}, {'channelId': 'UC7BLRPxLTk6iCusz2BIusyQ', 'name': 'MaroWeltShow', 'snippet': 'Hallo/Salut/Salam/Hello :) Mein Name ist Maro, schön das du hier bist :) -------- Kontaktadresse/Business Inquiries: marowelt(at)yahoo.de Ich wohne zwischen ...', 'thumbnails': 'https://yt3.ggpht.com/-VUJY0XkCOJM/AAAAAAAAAAI/AAAAAAAAAAA/9kpzDEvKM8E/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'}, {'channelId': 'UCPZkdkj_rUi_3YQ3rFTbXlw', 'name': 'Maro', 'snippet': 'チャンネル登録よろしくお願いします🤲', 'thumbnails': 'https://yt3.ggpht.com/-vw09sm21U3w/AAAAAAAAAAI/AAAAAAAAAAA/TkpgH1fXieQ/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'},{'channelId': 'UCk-9HZxQqKJLkj_GtFV3XbA', 'name': 'Mar ♥', 'snippet': "Hi! I'm Mar, I was born in Venezuela but live in Los Angeles, CA. I want to share some tips and tricks with you! CONTACT: makeuplocalypse@gmail.com.", 'thumbnails': 'https://yt3.ggpht.com/-R5keFFMFelA/AAAAAAAAAAI/AAAAAAAAAAA/1meZ30mftog/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'},{'channelId': 'UCqe0sSESmaQbLFdTExctQLA', 'name': 'Marodi TV Sénégal', 'snippet': 'Marodi.TV est désireux de rendre accessible au grand public via sa plateforme internet www.marodi.tv tout type de contenu multimédia (sport, musiques, ...', 'thumbnails': 'https://yt3.ggpht.com/-hASdnF05uDM/AAAAAAAAAAI/AAAAAAAAAAA/S4MImpl0imA/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'}, {'channelId': 'UCqZYTJFmvPXrtC39Lh9CAxg', 'name': 'Seneg Senegal', 'snippet': '', 'thumbnails': 'https://yt3.ggpht.com/-s1zD7c8bSNM/AAAAAAAAAAI/AAAAAAAAAAA/b5eMrjVpi8s/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'}, {'channelId': 'UCsEluBDMLj6xW_51cW99Lvw', 'name': 'Seneg', 'snippet': '', 'thumbnails': 'https://yt3.ggpht.com/-Ylb-84raFJg/AAAAAAAAAAI/AAAAAAAAAAA/U1OrOneHNic/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'}, {'channelId': 'UCYE5yKQi92PblN9NDKC0vCQ', 'name': 'Seneg - Topic', 'snippet': '', 'thumbnails': 'https://yt3.ggpht.com/-Dq7E5zlyYX8/AAAAAAAAAAI/AAAAAAAAAAA/38mQmvLK-zU/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'}, {'channelId': 'UCkhjftd3D116NJ1hVBBGFww', 'name': 'SLIME SAM SAPECA', 'snippet': 'Você já viu um Slime que pode falar? Aqui esta ele - Slime Sam Sapeca! Ele é de cor rosa, é muito divertido, adora doces e balas, e nunca te deixará entediado ...', 'thumbnails': 'https://yt3.ggpht.com/-7KJQXwzq56I/AAAAAAAAAAI/AAAAAAAAAAA/R-fOz_z7F1w/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'}]
 @ViewChild('channelsExpansion', { static: false }) channelsExpansion: MatExpansionPanel
  @ViewChild('channelsOptions', { static: false }) channelsOptions: MatRadioGroup;
  @ViewChild('matSelectionListVideos', { static: false }) matSelectionListVideos: MatSelectionList;
  @ViewChild('matSelectionListChannels', { static: false }) matSelectionListChannels: MatSelectionList;
  @ViewChild('matSelectionListWebsites', { static: false }) matSelectionListWebsites: MatSelectionList;
  expanded = true;
  selected = false;
  selectedBid: string = "CPM"
  searchChannels: FormControl = new FormControl('')
  /* PLACEMENTS: PLACEMENT_TYPE[] = [] */
  placementOptionSelected: string = "none"
  public componentReady: boolean = true
  @ViewChild(MdePopoverTrigger, { static: false }) popover: MdePopoverTrigger;
  @ViewChild(MdePopover, { static: false }) popoverComponent: MdePopover;
  videosPanel: boolean = false
  channelsPanel: boolean = false
  generalPanel: boolean = true
  websitesPanel: boolean = false
  videos: YOUTUBE_VIDEOS_INTERFACE[] = []
  channels: YOUTUBE_CHANNELS_INTERFACE[] = []
  websites: WEBSITE[] = [];
  websitesFind: WEBSITE[] = [];

  channelsFind: YOUTUBE_CHANNELS_INTERFACE[] = []
  videosFind: YOUTUBE_VIDEOS_INTERFACE[] = []
  showProgressSearchChannels: boolean = false
   selectedChannels: YOUTUBE_CHANNELS_INTERFACE[] = []
    selectedElements: any[] = []
  constructor(private youtubeService: YoutubeService, private cd: ChangeDetectorRef) { }
  ngAfterViewInit() {
    
  }
   ngOnInit(): void {
    /* this.addSkill() */
  }

  exctractVideoIdFromUrl(url: string) {
    var video_id = url.split('v=')[1];
var ampersandPosition = video_id.indexOf('&');
if(ampersandPosition != -1) {
  video_id = video_id.substring(0, ampersandPosition);
}
  }
 
   onWebsiteSelect(args) {
    let selected = this.matSelectionListWebsites.selectedOptions.selected
  let websites: { id?: string; url?: string}[] = []
    selected.forEach(site => {
      websites.push(site.value)
      return websites
    })
    this.websites = websites
    this.selectedElements = [...this.selectedElements, ...[...this.channels, ...this.videos, ...this.websites]]

  
  }
  onVideoSelect(args) {
    let selected = this.matSelectionListVideos.selectedOptions.selected
     let videos: YOUTUBE_VIDEOS_INTERFACE[] = []
    selected.forEach(video => {
      videos.push(video.value)
      return videos
    })
    this.videos = videos
    this.selectedElements = [...this.selectedElements, ...[...this.channels, ...this.videos, ...this.websites]]
  
  }
  onChannelSelect(args) {
    let selected: MatListOption[] = this.matSelectionListChannels.selectedOptions.selected
    let channels: YOUTUBE_CHANNELS_INTERFACE[] = []
    selected.forEach(channel => {
      channels.push(channel.value)
      return channels
    })
    this.channels = channels
    this.selectedElements = [...this.selectedElements, ...[...this.channels, ...this.videos]]
  }
  toggleChannelsPanel() {
    this.channelsPanel = true
    this.videosPanel = false
    this.websitesPanel = false
    this.generalPanel = false 
  setTimeout(() => {
      if (this.channels.length > 0) {
      this.channels.forEach(channel => {
        this.matSelectionListChannels.options.forEach(element => {
        if (element.value.channelId.toString() === channel.channelId) {
          if (!element.selected) {
            element.toggle()
          }
        }
      })
        
      })
    }
   },500)
  }
  toggleVideosPanel() {
    this.videosPanel = true
    this.channelsPanel = false
    this.websitesPanel = false
    this.generalPanel = false 
    setTimeout(() => {
      if (this.videos.length > 0) {
        this.videos.forEach(video => {
        this.matSelectionListVideos.options.forEach(element => {
        if (element.value.videoId.toString() === video.videoId) {
          if (!element.selected) {
            element.toggle()
          }
        }
      })
        
      })
    }
    },500)
  }

toggleWebsitesPanel() {
    this.websitesPanel = true
    this.videosPanel = false
    this.channelsPanel = false
    this.generalPanel = false 
    setTimeout(() => {
      if (this.websites.length > 0) {
        this.websites.forEach(site => {
        this.matSelectionListWebsites.options.forEach(element => {
        if (element.value.id.toString() === site.id) {
          if (!element.selected) {
            element.toggle()
          }
        }
      })
        
      })
    }
    },500)
  }

  toggleGeneralPanel() {
    this.generalPanel = true 
    this.channelsPanel = false
  this.videosPanel = false
  this.websitesPanel = false
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
      this.channelsExpansion.open(); // Here's the magic
    }else{
      this.channelsExpansion.close()
    }
  }
  removeChannel(channel: YOUTUBE_CHANNELS_INTERFACE) {
    this.selectedChannels.forEach((item, index, arr) => {
      if (item.channelId === channel.channelId) {
        this.selectedChannels.splice(index, 1)
      }
    })
  }
  removeSelectedChannel(channel: YOUTUBE_CHANNELS_INTERFACE) {
    this.channels.forEach((item, index, arr) => {
      if (item.channelId === channel.channelId) {
        this.channels.splice(index, 1)
      }
    })
    this.matSelectionListChannels.selectedOptions.selected.forEach(element => {
      if (element.value.channelId.toString() === channel.channelId) {
        if (element.selected) {
          element.toggle()
        }
      }
    })
  }

  removeSelectedVideo(video: YOUTUBE_VIDEOS_INTERFACE) {
    this.videos.forEach((item, index, arr) => {
      if (item.videoId === video.videoId) {
        this.videos.splice(index, 1)
      }
    })
    this.matSelectionListVideos.selectedOptions.selected.forEach(element => {
      if (element.value.videoId.toString() === video.videoId) {
        if (element.selected) {
          element.toggle()
        }
      }
    })
  }
  removeSelectedWebsite(site: WEBSITE) {
    this.websites.forEach((item, index, arr) => {
      if (item.id === site.id) {
        this.websites.splice(index, 1)
      }
    })
    this.matSelectionListWebsites.selectedOptions.selected.forEach(element => {
      if (element.value.id.toString() === site.id) {
        if (element.selected) {
          element.toggle()
        }
      }
    })
  }
  selectChannel(channel: YOUTUBE_CHANNELS_INTERFACE) {
    let channelExist = this.selectedChannels.some(item => item.channelId === channel.channelId)
    if (!channelExist) {
      this.selectedChannels.push(channel)
      this.searchChannels.setValue('')
      
    }
  }
 
  resetSearch() {
    this.searchChannels.reset()
    document.getElementById('search').focus()
  }

  search() {
    this.showProgressSearchChannels = true
    setTimeout(() => {
      var is_url: boolean = isURL(this.searchChannels.value.toString().replace(/\s*$/,""))
    if (is_url) {
       var parse = urlParser.parse(this.searchChannels.value)
      console.log(parse)
      if (parse !== undefined) {
        
        if (parse['provider'].toString() === 'youtube') {
         
          if (parse['mediaType'].toString() === 'channel') {
            //youtube channel
             if (parse['id'] === undefined) {
             alert("L'url ne contient pas l'id de la chaine")
          } else {
            this.youtubeService.searchChannelByID(parse['id']).then(channels => {
              if (channels !== null) {
              this.showProgressSearchChannels = false
                this.channelsFind = this.mergeChannelsInUnique([...this.channelsFind, ...channels], 'channelId')
                this.channels = this.mergeChannelsInUnique([...this.channels, ...channels], 'channelId')
                this.toggleChannelsPanel()
              /* this.cd.detectChanges() */
            } else {
              this.showProgressSearchChannels = false
            }
            this.showProgressSearchChannels = false
          }).catch((e) => {
            this.showProgressSearchChannels = false
            return;
          })
            
          }
          } else if (parse['mediaType'].toString() === 'video') {
            if (parse['id'] === undefined) {
              alert("L'url ne contient pas l'id de la video")
            } else {
              this.youtubeService.searchVideoByID(parse['id']).then(videos => {
                if (videos !== null) {
                  this.showProgressSearchChannels = false
                  this.videosFind = this.mergeVideosInUnique([...this.videosFind, ...videos], 'videoId')
                  this.videos = this.mergeVideosInUnique([...this.videos, ...videos], 'videoId')
                 this.toggleVideosPanel()
              } else {
                this.showProgressSearchChannels = false
              }
              this.showProgressSearchChannels = false
            }).catch((e) => {
              this.showProgressSearchChannels = false
              return;
            })
            }
            //youtube video
          }
        } else {
          let web_url: string = this.searchChannels.value.toString().replace(/\s*$/,"")
          let already_exist: boolean = this.websitesFind.some(item=>item.url===web_url)
          let parse = require('url-parse');
          let url_parsed: URL_PARSER = parse(web_url, true);
          if (!already_exist) {
            let website: WEBSITE = {id:  (new Date().getTime()+Math.floor(Math.random() * 1000000) + 1000).toString(), url: web_url, ...url_parsed}
            this.websitesFind = this.mergeWebsitesInUnique([...this.websitesFind, ...[website]], 'id')
            this.websites = this.mergeWebsitesInUnique([...this.websites, ...[website]], 'id')
            this.showProgressSearchChannels = false
            
          } else{
            this.showProgressSearchChannels = false
          }
        }
      } else {
           let web_url: string = this.searchChannels.value.toString().replace(/\s*$/,"")
          let already_exist: boolean = this.websitesFind.some(item=>item.url===web_url)
          let parse = require('url-parse');
          let url_parsed: URL_PARSER = parse(web_url, true);
          if (!already_exist) {
            let website: WEBSITE = {id:  (new Date().getTime()+Math.floor(Math.random() * 1000000) + 1000).toString(), url: web_url, ...url_parsed}
            this.websitesFind = this.mergeWebsitesInUnique([...this.websitesFind, ...[website]], 'id')
            this.websites = this.mergeWebsitesInUnique([...this.websites, ...[website]], 'id')
            this.showProgressSearchChannels = false
            
          } else{
            this.showProgressSearchChannels = false
          }
      }
    } else {
      this.showProgressSearchChannels = false
    }
    },1000)
   

  }

  mergeWebsitesInUnique<WEBSITES>(array: WEBSITES[], property: any): WEBSITES[] {

  const newArray = new Map();

  array.forEach((item: WEBSITES) => {
    const propertyValue = item[property];
    newArray.has(propertyValue) ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) }) : newArray.set(propertyValue, item);
  });

  return Array.from(newArray.values());
}

  mergeChannelsInUnique<YOUTUBE_CHANNELS_INTERFACE>(array: YOUTUBE_CHANNELS_INTERFACE[], property: any): YOUTUBE_CHANNELS_INTERFACE[] {

  const newArray = new Map();

  array.forEach((item: YOUTUBE_CHANNELS_INTERFACE) => {
    const propertyValue = item[property];
    newArray.has(propertyValue) ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) }) : newArray.set(propertyValue, item);
  });

  return Array.from(newArray.values());
  }
  
  mergeVideosInUnique<YOUTUBE_VIDEOS_INTERFACE>(array: YOUTUBE_VIDEOS_INTERFACE[], property: any): YOUTUBE_VIDEOS_INTERFACE[] {

  const newArray = new Map();

  array.forEach((item: YOUTUBE_VIDEOS_INTERFACE) => {
    const propertyValue = item[property];
    newArray.has(propertyValue) ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) }) : newArray.set(propertyValue, item);
  });

  return Array.from(newArray.values());
}
 

  skills = new FormArray([]);

  formOvered(i: number) {
    if (this.skills.length!==1) {
      document.getElementById(i.toFixed()).classList.remove('d-none')
      
    }
  }
    formLeaved(i: number) {
      document.getElementById(i.toFixed()).classList.add('d-none')
  }
  removeSkill(index: number) {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
       
     }
  }

  getChannels():Promise<string> {
    return new Promise(resolve => {
      if (this.channels.length > 0 || this.videos.length>0 || this.websites.length>0) {
          resolve('ok')
      } else {
        resolve('error')
        }
      })
  }
}
