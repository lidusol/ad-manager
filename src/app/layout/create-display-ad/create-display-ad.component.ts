import { Component, OnInit } from '@angular/core';
import { User_Role } from 'src/app/utils/data';
import { LocalStorageService } from '../services/local-storage.service';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'adf-create-display-ad',
  templateUrl: './create-display-ad.component.html',
  styleUrls: ['./create-display-ad.component.scss']
})
export class CreateDisplayAdComponent implements OnInit {
  aacid: string = ""
  uid: string = ""
  uid_action: string= ""
  user_access: User_Role;
  idc: string = ""
  campaignId: number = null
  ad_group_id: number = null
  ad_group_id_firebase: string = ""
  only: boolean = true
  campaign_name: string = ""
  campaign_type: string = ""
  constructor(private storageService: LocalStorageService, private displayService: DisplayService, private auth: AuthService, private router: Router, private route: ActivatedRoute) { 

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
     this.storageService.getUserIdAndAccountId().then(response => {
			  if (response !== null) {
				  this.route.queryParams.subscribe(params => {
				   const aacid: string = params['aacid'];
            const uid = params['auid'];
            const fidc = params['fidc']
            const aidc = params['aidc']
            const agidf = params['agidf']
            const agid = params['agid']
            const name = params['name']
            const campaign_type =params['type']
					 
					  if (response.aacid === aacid && uid === response.auid && aacid!==undefined && uid!==undefined && fidc!==undefined && aidc!==undefined && agidf!==undefined && agid!==undefined && name!==undefined && campaign_type!==undefined) {
						  this.aacid = aacid
              this.user_access = response.role
              this.campaignId = aidc
              this.idc = fidc
              this.ad_group_id = agid
              this.ad_group_id_firebase = agidf
              this.uid = response.auid
              this.campaign_name = name
              this.campaign_type = campaign_type
              
              if (response.fromOwned) {
                this.uid_action = response.auid
                
                
              } else {
                this.uid_action = response.account.owner
                
              }
						 
					  } else {
						  this.router.navigate(['/ads/list'], { queryParams: {auid: response.auid, aacid: response.aacid } })
					  }
			 
				 })
				
			}
		})
  }

}
