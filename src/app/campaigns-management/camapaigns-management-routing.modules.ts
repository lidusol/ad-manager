import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NewCampaignSelectorComponent } from '../layout/components/new-campaign-selector/new-campaign-selector.component';
import { DisplayBuilderComponent } from '../layout/components/display-builder/display-builder.component';
import { CampaignsSelectorTypeLayoutComponent } from '../layout/components/campaigns-selector-type-layout/campaigns-selector-type-layout.component';
import { DisplayReviewComponent } from '../layout/components/display-review/display-review.component';
import { MainLayoutComponent } from '../layout/components/main-layout/main-layout.component';
import { YoutubeBuilderComponent } from '../layout/components/youtube-builder/youtube-builder.component';


const routes: Routes = [
    {
        path: 'new',
        children: [
            {
                path: 'select',
                component: NewCampaignSelectorComponent
            },
            {
                path: 'display/create',
                component: DisplayBuilderComponent
            },
            {
                path: 'native/create',
                component: YoutubeBuilderComponent
            }
        ]
       
        
    },
    
     {
        path: '',
        redirectTo: 'new',
        
    },
    
]




@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CampaignsManagementRoutingModule {}