import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../layout/layout.module';
import { CampaignsManagementRoutingModule } from './camapaigns-management-routing.modules';
import { DisplayService } from './services/display.service';
import { LoaderService } from '../services/loader.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from '../loader.interceptor';




@NgModule({
  declarations: [],
  imports: [
    LayoutModule,
    CampaignsManagementRoutingModule
  ],
  providers: [DisplayService, LoaderService, { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }]
})
export class CampaignsManagementModule { }
