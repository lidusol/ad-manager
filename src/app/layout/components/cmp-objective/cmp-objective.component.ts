import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OBJECTIVES, OBJECTIVES_DATA, CHANNEL_FORMAT, CHANNEL_DATA } from 'src/app/utils/data';
import { SERVER } from 'src/environments/environment';

@Component({
  selector: 'adf-cmp-objective',
  templateUrl: './cmp-objective.component.html',
  styleUrls: ['./cmp-objective.component.scss']
})
export class CmpObjectiveComponent implements OnInit {
  objectives: OBJECTIVES[] = OBJECTIVES_DATA
  ads_channel: CHANNEL_FORMAT[] = CHANNEL_DATA
  current_objective: OBJECTIVES = null
  current_ad_channel: CHANNEL_FORMAT = null
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let obj: string = params['obj']
      let ocid: string = params['ocid']
      if(obj!==undefined && obj!==null && ocid!==undefined && ocid!==null){
        this.current_objective = OBJECTIVES_DATA.find(obj_=>obj_.obj_id===obj)
        this.current_ad_channel = CHANNEL_DATA.find(ch=>ch.obj_id===ocid)
        if (window.location.pathname === '/campaigns/new/display/create') {
          
        }else if (window.location.pathname === '/campaigns/new/native/create') {
    
        }else if (window.location.pathname === '/campaigns/new/search/create') {
    
        }

      }else{
        window.location.href = SERVER.url_redirect+`/campaigns/new/select`
      }

    })
  }

}
