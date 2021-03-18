import { Component, Input, OnInit } from '@angular/core';
import { ResponsiveSearchAd } from 'src/app/campaigns-management/models/search.models';
import { SEARCH_ADS_BEFORE_UPLOAD, URL_PARSER } from 'src/app/utils/data';
declare const require: any;
@Component({
  selector: 'adf-ad-preview-mono',
  templateUrl: './ad-preview-mono.component.html',
  styleUrls: ['./ad-preview-mono.component.scss']
})
export class AdPreviewMonoComponent implements OnInit {

  constructor() { }
  @Input() format1: SEARCH_ADS_BEFORE_UPLOAD = null
  @Input() format2: ResponsiveSearchAd = null
  ngOnInit(): void {
  }
visibleUrl: string = "www.exemple.com"
  getVisibleUrl(value: string, path1: string, path2: string): string{
    var parse = require('url-parse')
        , url: URL_PARSER = parse(value, true);
      let path1_: string = path1===null?'':path1
      let path2_: string = path1_===''?path2===null?'':path2:'/'+path2===null?'':path2
      return  'www.' + url.hostname + "/"+path1_+path2_
  }

}
