import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import {YouTubePlayer} from '@angular/youtube-player'

@Component({
  selector: 'adf-video-preview',
  templateUrl: './video-preview.component.html',
  styleUrls: ['./video-preview.component.scss']
})
export class VideoPreviewComponent implements OnInit, OnDestroy {
  @Input() videoId: string = ""
  @Input() width: number = 0
  @Input() height: number = 0
 @ViewChild('target', {static: true}) target: ElementRef;
  // see options: https://github.com/videojs/video.js/blob/mastertutorial-options.html
  @Input() options: {
      fluid: boolean,
      aspectRatio: string,
      autoplay: boolean,
      sources: {
          src: string,
          type: string,
      }[],
    
  };
 

  /* html5: {
      hls: {
        overrideNative: true
      },
       nativeAudioTracks: false,
      nativeVideoTracks: false
    } */
  constructor(
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer
  ) { }
  @ViewChild(YouTubePlayer, {static: false}) playerY : YouTubePlayer
safeUrl(dataBase64: string,) {
    var srcData: SafeResourceUrl;
    srcData = this.sanitizer.bypassSecurityTrustResourceUrl(dataBase64);
    return srcData
  }
  ngOnInit() {
    // instantiate Video.js
    /* this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
    }); */

    // This code loads the IFrame Player API code asynchronously, according to the instructions at
    // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
    const tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    
  
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.playerY.setVolume(0)
      this.playerY.ready.subscribe(observer => {
      //observer.target.mute()
      observer.target.setVolume(0)
    })
    },500)
  }
  onPlayerReady() {
    
  }

  ngOnDestroy() {
    // destroy player
   
  }

}
