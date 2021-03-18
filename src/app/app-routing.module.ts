import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth-guards';
import { NewCampaignSelectorComponent } from './layout/components/new-campaign-selector/new-campaign-selector.component';
import { AccountSelectorComponent } from './layout/components/account-selector/account-selector.component';
import { ListAllDisplayAdsComponent } from './layout/components/list-all-display-ads/list-all-display-ads.component';
import { CreateDisplayAdComponent } from './layout/create-display-ad/create-display-ad.component';
import { AssetsDisplayBuilderComponent } from './layout/components/assets-display-builder/assets-display-builder.component';


const routes: Routes = [

  {
    path: 'overview',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  
  {
    path: 'campaigns',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./campaigns/campaigns.module').then(m => m.CampaignsModule)
  },
  {
    
    path: 'campaigns-management',

    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./campaigns-management/campaigns-management.module').then(m => m.CampaignsManagementModule)
  },
  {
    path: 'accounts',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./accounts/accounts.module').then(m => m.AccountsModule)
  },
   {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },
   {
     path: '',
     pathMatch: 'full',
    redirectTo: 'overview'
  },
  {
    path: 'select/account',
    canActivate: [AuthGuard],
    component: AccountSelectorComponent
  },
   {
        path: 'ads/list',
        component: ListAllDisplayAdsComponent
  },
  {
    path: 'ads/create',
    component: CreateDisplayAdComponent
  },
  {
    path: 'ads/build',
    component: AssetsDisplayBuilderComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
