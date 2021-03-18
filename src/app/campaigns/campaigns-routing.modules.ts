import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { ContentComponent } from '../layout/content/content.component';
import { CampaignsMainLayoutComponent } from '../layout/components/campaigns-main-layout/campaigns-main-layout.component';
import { DisplayReviewComponent } from '../layout/components/display-review/display-review.component';
import { DisplaySettingsComponent } from '../layout/components/display-settings/display-settings.component';
import { NewCampaignSelectorComponent } from '../layout/components/new-campaign-selector/new-campaign-selector.component';
import { DisplayBuilderComponent } from '../layout/components/display-builder/display-builder.component';
import { YoutubeBuilderComponent } from '../layout/components/youtube-builder/youtube-builder.component';
import { YoutubeSettingsComponent } from '../layout/components/youtube-settings/youtube-settings.component';
import { YoutubeReviewComponent } from '../layout/components/youtube-review/youtube-review.component';
import { DisplaySearchBuilderComponent } from '../layout/components/display-search-builder/display-search-builder.component';
import { SearchReviewComponent } from '../layout/components/search-review/search-review.component';
import { SearchSettingsComponent } from '../layout/components/search-settings/search-settings.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'list'
  },
    {
        path: 'list',
        component: CampaignsComponent,
  },
  {
        path: 'review',
        children: [
            {
                path: 'display',
                component: DisplayReviewComponent
            },
            {
                path: 'native',
                component: YoutubeReviewComponent
            },
            {
                path: 'search',
                component: SearchReviewComponent
            }
        ]
  },
  
  {
        path: 'settings',
        children: [
            {
                path: 'display',
                component: DisplaySettingsComponent
            },
            {
                path: 'native',
                component: YoutubeSettingsComponent
            },
            {
                path: 'search',
                component: SearchSettingsComponent
            }
        ]
    },
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
            },
            {
                path: 'search/create',
                component: DisplaySearchBuilderComponent
            }
        ]
       
        
    },
   {path: '**', redirectTo: 'list'}
    
]




@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CampaignsRoutingModule {}