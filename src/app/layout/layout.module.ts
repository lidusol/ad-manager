import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarFilterComponent } from './components/toolbar-filter/toolbar-filter.component';
import { CampaignsDataTableComponent } from './components/campaigns-data-table/campaigns-data-table.component';
import { PeriodeSelectorComponent } from './components/periode-selector/periode-selector.component';
import { AccountsDataTableComponent } from './components/accounts-data-table/accounts-data-table.component';
import { LoginComponent } from './components/login/login.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { SelectLinkedAccountComponent } from './components/select-linked-account/select-linked-account.component';
import { DialogBuilderProcess, DialogPublish, DialogPublishProcess, NewCampaignSelectorComponent } from './components/new-campaign-selector/new-campaign-selector.component';
import { DisplayBuilderComponent } from './components/display-builder/display-builder.component';
import { CmpNameComponent } from './components/single/cmp-name/cmp-name.component';
import { CmpStatusComponent } from './components/single/cmp-status/cmp-status.component';
import { CmpLandingPageComponent } from './components/single/cmp-landing-page/cmp-landing-page.component';
import { CmpBudgetComponent } from './components/single/cmp-budget/cmp-budget.component';
import { CmpZonesComponent } from './components/single/cmp-zones/cmp-zones.component';
import { DisplayService } from '../campaigns-management/services/display.service';
import { CampaignsMainLayoutComponent } from './components/campaigns-main-layout/campaigns-main-layout.component';
import { AccountsMainLayoutComponent } from './components/accounts-main-layout/accounts-main-layout.component';
import { CampaignsSelectorTypeLayoutComponent } from './components/campaigns-selector-type-layout/campaigns-selector-type-layout.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { CmpDemographicTargetComponent } from './components/single/cmp-demographic-target/cmp-demographic-target.component';
import { CmpPlacementTargetComponent } from './components/single/cmp-placement-target/cmp-placement-target.component';
import { CmpBidsComponent } from './components/single/cmp-bids/cmp-bids.component';
import { CmpDatesComponent } from './components/single/cmp-dates/cmp-dates.component';
import { CmpAdsUploaderComponent } from './components/single/cmp-ads-uploader/cmp-ads-uploader.component';
import { CmpSchedulesComponent } from './components/single/cmp-schedules/cmp-schedules.component';
import { CmpPackChooserComponent } from './components/single/cmp-pack-chooser/cmp-pack-chooser.component';
import { CmpChannelsComponent } from './components/single/cmp-channels/cmp-channels.component';
import { PreviewCreatedDisplayComponent } from './components/preview-created-display/preview-created-display.component';
import { CmpDisplayRecapComponent } from './components/single/cmp-display-recap/cmp-display-recap.component';
import { DisplayReviewComponent } from './components/display-review/display-review.component';
import { CmpBudgetEditPopupComponent } from './components/edit/cmp-budget-edit-popup/cmp-budget-edit-popup.component';
import { DisplaySettingsComponent } from './components/display-settings/display-settings.component';
import { CmpNameEditComponent } from './components/edit/cmp-name-edit/cmp-name-edit.component';
import { CmpLandingPageEditComponent } from './components/edit/cmp-landing-page-edit/cmp-landing-page-edit.component';
import { CmpZonesEditComponent } from './components/edit/cmp-zones-edit/cmp-zones-edit.component';
import { CmpDatesEditComponent } from './components/edit/cmp-dates-edit/cmp-dates-edit.component';
import { CmpDemographicTargetEditComponent } from './components/edit/cmp-demographic-target-edit/cmp-demographic-target-edit.component';
import { CmpBidsEditComponent } from './components/edit/cmp-bids-edit/cmp-bids-edit.component';
import { CmpBudgetEditComponent } from './components/edit/cmp-budget-edit/cmp-budget-edit.component';
import { CmpPlacementsEditComponent } from './components/edit/cmp-placements-edit/cmp-placements-edit.component';
import { CmpSchedulesEditComponent } from './components/edit/cmp-schedules-edit/cmp-schedules-edit.component';
import { CmpPackChooserEditComponent } from './components/edit/cmp-pack-chooser-edit/cmp-pack-chooser-edit.component';
import { PublishCampaignComponent } from './components/publish-campaign/publish-campaign.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ToastAdafriComponent } from './components/toast/toast.component';
import { LayoutService } from './layout.service';
import { SideMenuItemComponent } from './components/single/side-menu-item/side-menu-item.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { PaymentService } from './services/payment.service';
import { NotificationsService } from './services/notifications.service';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { AccountsService } from '../accounts/accounts.service';
import { AccountsAccessComponent } from './components/accounts-access/accounts-access.component';
import { SeoService } from '../seo.service';
import { LocalStorageService } from './services/local-storage.service'
import { CampaignsOverviewRecapComponent } from './components/campaigns-overview-recap/campaigns-overview-recap.component';
import { SelectAccountComponent } from './components/select-account/select-account.component';
import { MessagingService } from './services/messaging.service';
import { AdOverviewRecapComponent } from './components/ad-overview-recap/ad-overview-recap.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import {  DateAgoPipe, CampaignNameFromAdGroupId, GetAdsSummuryReport, GetCampaignsSummuryReport, GetPlacementsSummuryReport, CampaignStatusFromAdGroupId, GetUser} from './pipes/date-ago.pipe';
import { CmpAdsUploaderEditComponent } from './components/edit/cmp-ads-uploader-edit/cmp-ads-uploader-edit.component';
import { ListAllDisplayAdsComponent } from './components/list-all-display-ads/list-all-display-ads.component';
import { AdsPreviewCollectionsComponent } from './components/ads-preview-collections/ads-preview-collections.component';
import { MainChartViewComponent } from './components/main-chart-view/main-chart-view.component';
import { CreateDisplayAdComponent } from './create-display-ad/create-display-ad.component';
import { SpeedDialFabComponent } from './speed-dial-fab/speed-dial-fab.component';
import { PlacementsOverviewRecapComponent } from './components/placements-overview-recap/placements-overview-recap.component'
import { ColumnChooserService, ColumnMenuService } from '@syncfusion/ej2-angular-grids';
import { GoogleMapsComponent } from './components/google-maps/google-maps.component';
import { AssetsCropperComponent } from './components/assets-cropper/assets-cropper.component';
import { AssetsDisplayBuilderComponent } from './components/assets-display-builder/assets-display-builder.component';
import { AssetsService } from '../campaigns-management/services/assets.service';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from '../services/loader.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from '../loader.interceptor';
import { ImagesGalleryComponent } from './components/images-gallery/images-gallery.component';
import { YoutubeBuilderComponent } from './components/youtube-builder/youtube-builder.component';
import { YoutubeChannelsSelectorComponent } from './components/single/youtube-channels-selector/youtube-channels-selector.component';
import { YoutubeService } from '../campaigns-management/services/youtube.service';
import { CmpAdsUploaderYoutubeComponent } from './components/single/cmp-ads-uploader-youtube/cmp-ads-uploader-youtube.component';
import { YoutubeReviewComponent } from './components/youtube-review/youtube-review.component';
import { CmpYoutubeRecapComponent } from './components/single/cmp-youtube-recap/cmp-youtube-recap.component';
import { PreviewCreatedYoutubeComponent } from './components/preview-created-youtube/preview-created-youtube.component';
import { YoutubeSettingsComponent } from './components/youtube-settings/youtube-settings.component';
import { CmpAdsUploaderYoutubeEditComponent } from './components/edit/cmp-ads-uploader-youtube-edit/cmp-ads-uploader-youtube-edit.component';
import { YoutubeChannelsSelectorEditComponent } from './components/edit/youtube-channels-selector-edit/youtube-channels-selector-edit.component';
import { CampaignsDataTableYoutubeComponent } from './components/campaigns-data-table-youtube/campaigns-data-table-youtube.component';
import {NgxImageCompressService} from '../image-compressor/ngx-image-compress.service';
import { DialogPreviewDesign, ImageCompressorComponent } from './components/image-compressor/image-compressor.component';
import {ImageCompressorService} from '../image-compressor/image-compressor.service';
import { ChannelsOverviewRecapComponent } from './components/channels-overview-recap/channels-overview-recap.component';
import { BrowserInfoAlertComponent } from './components/browser-info-alert/browser-info-alert.component';
import { CmpNativeAdsCreatorComponent } from './components/single/cmp-native-ads-creator/cmp-native-ads-creator.component';
import { CmpNativeUploaderToolComponent } from './components/native-tools/cmp-native-uploader-tool/cmp-native-uploader-tool.component';
import { CropperRectangleDialogComponent } from './components/native-tools/cropper-rectangle-dialog/cropper-rectangle-dialog.component';
import { CropperLogoDialogComponent } from './components/native-tools/cropper-logo-dialog/cropper-logo-dialog.component';
import { UploadService } from '../campaigns-management/services/upload.service';
import { VideoPreviewComponent } from './components/video-preview/video-preview.component';
import { ResponsiveDisplayPreviewSimulationComponent } from './components/native-tools/responsive-display-preview-simulation/responsive-display-preview-simulation.component';
import { SignupComponent } from './components/signup/signup.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetPasswordRequestComponent } from './components/reset-password-request/reset-password-request.component';
import { AuthActionSettingsComponent } from './components/auth-action-settings/auth-action-settings.component';
import { EmailVerifiedComponent } from './components/email-verified/email-verified.component';
import { AccountSelectorComponent } from './components/account-selector/account-selector.component';
import { GeoPerformanceTargetComponent } from './components/geo-performance-target/geo-performance-target.component';
import { CampaignNativeOverviewRecapComponent } from './components/campaign-native-overview-recap/campaign-native-overview-recap.component';
import { NativeAdsPreviewCollectionsComponent } from './components/native-ads-preview-collections/native-ads-preview-collections.component';
import { NativeAdsOverviewRecapComponent } from './components/native-ads-overview-recap/native-ads-overview-recap.component';
import { GeoPerformanceReportSingleComponent } from './components/geo-performance-report-single/geo-performance-report-single.component';
import { ChartReviewComponent } from './components/chart-review/chart-review.component';
import { AgePerformanceReportComponent } from './components/age-performance-report/age-performance-report.component';
import { GenderPerformanceReportComponent } from './components/gender-performance-report/gender-performance-report.component';
import { GenderPerformanceReportSingleComponent } from './components/gender-performance-report-single/gender-performance-report-single.component';
import { AgePerformanceReportSingleComponent } from './components/age-performance-report-single/age-performance-report-single.component';
import { PresenceService } from './presence.service';
import { DialogConfirmDeleteMessage, LiveChatComponent } from './components/live-chat/live-chat.component';
import { ChatService } from './services/chat.service';
import { DisplaySearchBuilderComponent } from './components/display-search-builder/display-search-builder.component';
import { SearchService } from '../campaigns-management/services/search.service';
import { CmpKeywordsSelectorComponent } from './components/single/cmp-keywords-selector/cmp-keywords-selector.component';
import { MatSelectSearchComponent } from './components/mat-select-search/mat-select-search.component';
import { SortableHeader } from './directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { CmpSearchAdsCreatorComponent } from './components/single/cmp-search-ads-creator/cmp-search-ads-creator.component';
import { SearchAdsPreviewSimulationComponent } from './components/search-tools/search-ads-preview-simulation/search-ads-preview-simulation.component';
import { AdPreviewMonoComponent } from './components/search-tools/ad-preview-mono/ad-preview-mono.component';
import { CallExtensionSetupComponent } from './components/search-tools/call-extension-setup/call-extension-setup.component';
import { PreviewCreatedSearchComponent } from './components/preview-created-search/preview-created-search.component';
import { CmpSearchRecapComponent } from './components/single/cmp-search-recap/cmp-search-recap.component';
import { SearchReviewComponent } from './components/search-review/search-review.component';
import { SearchSettingsComponent } from './components/search-settings/search-settings.component';
import { CampaignsDataTableSearchComponent } from './components/campaigns-data-table-search/campaigns-data-table-search.component';
import { KeywordsListPreviewComponent } from './components/keywords-list-preview/keywords-list-preview.component';
import { CampaignSearchOverviewRecapComponent } from './components/campaign-search-overview-recap/campaign-search-overview-recap.component';
import { SearchAdsOverviewRecapComponent } from './components/search-ads-overview-recap/search-ads-overview-recap.component';
import { SearchAdsPreviewCollectionComponent } from './components/search-ads-preview-collection/search-ads-preview-collection.component';
import { CmpObjectiveComponent } from './components/cmp-objective/cmp-objective.component';
import { AdsErrorViewComponent } from './components/ads-error-view/ads-error-view.component';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { TranslatorComponent } from './components/translator/translator.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { LangsSelectorComponent } from './components/langs-selector/langs-selector.component';
import { OverviewSummaryAccountComponent } from './components/overview-summary-account/overview-summary-account.component';
import { ThemeService } from './components/theme.service';
import { LangService } from './components/lang.service';
import { ActAutocompleteSelectComponent } from './components/act-autocomplete-select/act-autocomplete-select.component';
import { CmpUserInterestComponent } from './components/cmp-user-interest/cmp-user-interest.component';
import { CmpDeviceTargetComponent } from './components/cmp-device-target/cmp-device-target.component';
import { SizeDetectorComponent } from './components/size-detector/size-detector.component';
import { ResizeService } from './components/size-detector/resize.service';
import { NewFbCampaignSelectorComponent } from './components/new-fb-campaign-selector/new-fb-campaign-selector.component';
import { FbAdPreviewComponent } from './components/fb-ad-preview/fb-ad-preview.component';
import { FbAdPlacementsComponent } from './components/fb-ad-placements/fb-ad-placements.component';
import { FbAdPreviewSelectorComponent } from './components/fb-ad-preview-selector/fb-ad-preview-selector.component';
import { ConvertToSpacePipe } from './pipes/convert-to-space.pipe';

const components = [
  HeaderComponent,
  ContentComponent,
  SidebarComponent,
  ToolbarFilterComponent,
  PeriodeSelectorComponent,
  CampaignsDataTableComponent,
  AccountsDataTableComponent,
  LoginComponent,
  SnackbarComponent,
  SelectLinkedAccountComponent,
  NewCampaignSelectorComponent,
  NewFbCampaignSelectorComponent,
  ConvertToSpacePipe,
  FbAdPreviewComponent, 
  FbAdPlacementsComponent, 
  FbAdPreviewSelectorComponent,
  DisplayBuilderComponent,
  CmpNameComponent,
  CmpStatusComponent,
  CmpLandingPageComponent,
  CmpBudgetComponent,
  CmpZonesComponent,
  CampaignsMainLayoutComponent,
  AccountsMainLayoutComponent,
  CampaignsSelectorTypeLayoutComponent,
  MainLayoutComponent,
  CmpDemographicTargetComponent,
  CmpPlacementTargetComponent,
  CmpBidsComponent,
  CmpDatesComponent,
  CmpAdsUploaderComponent,
  CmpSchedulesComponent,
  CmpPackChooserComponent,
  CmpChannelsComponent,
  PreviewCreatedDisplayComponent,
  CmpDisplayRecapComponent,
  DisplayReviewComponent,
  CmpBudgetEditPopupComponent,
  DisplaySettingsComponent,
  CmpNameEditComponent,
  CmpLandingPageEditComponent,
  CmpZonesEditComponent,
  CmpDatesEditComponent,
  CmpDemographicTargetEditComponent,
  CmpBidsEditComponent,
  CmpBudgetEditComponent,
  CmpPlacementsEditComponent,
  CmpSchedulesEditComponent,
  CmpPackChooserEditComponent,
  PublishCampaignComponent,
  SpinnerComponent,
  ToastAdafriComponent,
  SideMenuItemComponent,
  PaymentsComponent,
  TransactionsComponent,
  AccountsAccessComponent,
  CampaignsOverviewRecapComponent,
  SelectAccountComponent,
  AdOverviewRecapComponent,
  UserProfileComponent,
  UserSettingsComponent,
  AccountSettingsComponent,
  DateAgoPipe,
  GetUser,
  CmpAdsUploaderEditComponent,
  ListAllDisplayAdsComponent,
  CampaignNameFromAdGroupId,
  CampaignStatusFromAdGroupId,
  GetAdsSummuryReport,
  GetCampaignsSummuryReport,
  AdsPreviewCollectionsComponent,
  MainChartViewComponent,
  CreateDisplayAdComponent,
  SpeedDialFabComponent,
  PlacementsOverviewRecapComponent,
  GetPlacementsSummuryReport,
  GoogleMapsComponent,
  AssetsCropperComponent,
  AssetsDisplayBuilderComponent,
  LoaderComponent,
  ImagesGalleryComponent,
  YoutubeBuilderComponent,
  YoutubeChannelsSelectorComponent,
  CmpAdsUploaderYoutubeComponent,
  YoutubeReviewComponent, CmpYoutubeRecapComponent, PreviewCreatedYoutubeComponent, YoutubeSettingsComponent,
  CmpAdsUploaderYoutubeEditComponent, YoutubeChannelsSelectorEditComponent,
   CampaignsDataTableYoutubeComponent,ImageCompressorComponent, ChannelsOverviewRecapComponent,BrowserInfoAlertComponent, CmpNativeAdsCreatorComponent, CmpNativeUploaderToolComponent, CropperRectangleDialogComponent, CropperLogoDialogComponent,
   VideoPreviewComponent, ResponsiveDisplayPreviewSimulationComponent, SignupComponent, ResetPasswordComponent, ResetPasswordRequestComponent, AuthActionSettingsComponent, EmailVerifiedComponent,  AccountSelectorComponent, GeoPerformanceTargetComponent,CampaignNativeOverviewRecapComponent,
   NativeAdsPreviewCollectionsComponent, NativeAdsOverviewRecapComponent,GeoPerformanceReportSingleComponent, ChartReviewComponent, AgePerformanceReportComponent, GenderPerformanceReportComponent,
   GenderPerformanceReportSingleComponent, AgePerformanceReportSingleComponent, LiveChatComponent, DialogConfirmDeleteMessage, DisplaySearchBuilderComponent,CmpKeywordsSelectorComponent, MatSelectSearchComponent, SortableHeader,CmpSearchAdsCreatorComponent,SearchAdsPreviewSimulationComponent, AdPreviewMonoComponent, CallExtensionSetupComponent, PreviewCreatedSearchComponent, CmpSearchRecapComponent, SearchReviewComponent, SearchSettingsComponent, CampaignsDataTableSearchComponent,
   KeywordsListPreviewComponent, CampaignSearchOverviewRecapComponent, SearchAdsOverviewRecapComponent, CmpObjectiveComponent, SearchAdsPreviewCollectionComponent, AdsErrorViewComponent, ThemeSelectorComponent , NotificationsComponent, TranslatorComponent,DateRangePickerComponent,LangsSelectorComponent, OverviewSummaryAccountComponent, DialogBuilderProcess,DialogPublish,DialogPublishProcess, ActAutocompleteSelectComponent, CmpUserInterestComponent, CmpDeviceTargetComponent,DialogPreviewDesign
   
  ]


@NgModule({
  declarations: [...components, SizeDetectorComponent],
  imports: [
    RouterModule,
    SharedModule,
 
  ],
  entryComponents: [
    DialogBuilderProcess,
    DialogPublish,
    DialogPublishProcess,
    DialogPreviewDesign
     /* CropperRectangleDialogComponent,
    CropperLogoDialogComponent, */
  ],
  exports: [...components, SharedModule],
  providers: [ResizeService, ChatService, DecimalPipe, PresenceService, SearchService, DisplayService, YoutubeService, LayoutService, PaymentService, NotificationsService, AccountsService, SeoService, LocalStorageService, MessagingService, ThemeService, LangService, CampaignNameFromAdGroupId, ColumnChooserService, ColumnMenuService, AssetsService, LoaderService, { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }, NgxImageCompressService, NgxImageCompressService, ImageCompressorService, UploadService ]
})
export class LayoutModule { }
