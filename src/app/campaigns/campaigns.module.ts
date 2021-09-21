import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutModule } from '../layout/layout.module';
import { CampaignsRoutingModule } from './campaigns-routing.modules';
import { AccountsService } from '../accounts/accounts.service';
import { RouterModule } from '@angular/router';
import { LayoutService } from '../layout/layout.service';
import { FbCampaignsComponent } from './fb-campaigns/fb-campaigns.component';



@NgModule({
  declarations: [CampaignsComponent, FbCampaignsComponent],
  imports: [
    RouterModule,
    LayoutModule,
    CampaignsRoutingModule,
  ],
  providers: [AccountsService, LayoutService]
})
export class CampaignsModule { }
