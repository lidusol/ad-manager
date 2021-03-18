import { Component, OnInit } from '@angular/core';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'adf-cmp-bids-edit',
  templateUrl: './cmp-bids-edit.component.html',
  styleUrls: ['./cmp-bids-edit.component.scss']
})
export class CmpBidsEditComponent implements OnInit {

   uid: string = undefined;
  cid: string = undefined
  currentLandingPage: string  =""
  constructor(private displayService: DisplayService, private router: Router, private route: ActivatedRoute) { }

 ngOnInit(): void {
     this.route.queryParams.subscribe(params => {
      this.cid = params['cid'];
      this.uid = params['uid'];
      if (this.cid !== undefined  && this.uid!== undefined) {
       this.getCampaignData()
      }
    
    })
 }
  
  getCampaignData() {
   
     this.displayService.getCampaign(this.cid).valueChanges().subscribe(campaign => {
          if (campaign === undefined) {
              this.router.navigate(['/campaigns'])
          } else {
           
             
            }
          })
  }

}
