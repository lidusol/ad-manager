import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutModule } from '../layout/layout.module';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    LayoutModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
