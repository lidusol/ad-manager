import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Material Modules */
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import moment from 'moment';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import { registerLocaleData } from '@angular/common';
import 'moment/locale/fr';
/* import * as localization from 'moment/locale/fr'; */
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
registerLocaleData(localeFr, 'fr-FR', localeFrExtra);
moment.locale('fr');
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTreeModule } from '@angular/material/tree';
import { MatRadioModule } from '@angular/material/radio';
import {MatBadgeModule} from '@angular/material/badge';
import { MdePopoverModule } from '@material-extended/mde';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
/* ENd Material Modules */
import { GoogleChartsModule } from 'angular-google-charts';
/* Syncfusion Modules */
import { LySkeletonModule } from '@alyle/ui/skeleton';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { DialogModule, TooltipAllModule } from '@syncfusion/ej2-angular-popups';
import { UploaderModule} from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule, MultiSelectAllModule, CheckBoxSelectionService, ListBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DateRangePickerAllModule, DateTimePickerAllModule, TimePickerAllModule, DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { ButtonModule, CheckBoxModule, ChipListAllModule, RadioButtonAllModule } from '@syncfusion/ej2-angular-buttons';
import { GridAllModule, ToolbarService,  ForeignKeyService, SelectionService, EditService, DetailRowService, RowDDService, CommandColumnService, SortService, SearchService, ColumnMenuService, ColumnChooserService, AggregateService } from '@syncfusion/ej2-angular-grids';
import { enableRipple } from '@syncfusion/ej2-base';
import { DropDownButtonModule, ProgressButtonAllModule, SplitButtonAllModule } from '@syncfusion/ej2-angular-splitbuttons';
import { NgNumberFormatterModule } from 'ng-number-formatter';
import { ShortNumberPipe } from './short-number.pipe';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';
/* import { PieSeriesService, AccumulationLegendService, AccumulationTooltipService, AccumulationAnnotationService,
AccumulationDataLabelService } from '@syncfusion/ej2-angular-charts';
  import { AccumulationChartModule } from '@syncfusion/ej2-angular-charts'; */
/* import { MDBBootstrapModule, ButtonsModule, NavbarModule, TooltipModule, TableModule, InputsModule, InputUtilitiesModule, ModalModule, WavesModule, CheckboxModule, DropdownModule, IconsModule } from 'angular-bootstrap-md'; */
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import { TabAllModule, ToolbarAllModule } from '@syncfusion/ej2-angular-navigations';
/* import { ChartAllModule, LineSeriesService, DataLabelService, CategoryService, LegendService, TooltipService, DateTimeService, DateTimeCategoryService, ColumnSeriesService, ScatterSeriesService, TrendlinesService, BarSeriesService, StackingColumnSeriesService, AreaSeriesService } from '@syncfusion/ej2-angular-charts'; */
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
/* End yncfusion Modules */
import {AgmCoreModule} from '@agm/core'
import {YouTubePlayerModule} from '@angular/youtube-player';

import {NgxIntlTelInputModule} from 'ngx-intl-tel-input'
import { TooltipModule as B_Tooltip }  from 'ngx-bootstrap/tooltip';
import { BsDropdownModule} from 'ngx-bootstrap/dropdown';
import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {
  HAMMER_GESTURE_CONFIG,
  HammerModule
} from '@angular/platform-browser';


import {
  LyTheme2,
  StyleRenderer,
  LY_THEME,
  LY_THEME_NAME,
  LyHammerGestureConfig,
  LyCommonModule
} from '@alyle/ui';
import { ShareButtonsPopupModule } from 'ngx-sharebuttons/popup';
import {  ShareIconsModule } from 'ngx-sharebuttons/icons'; 
import { NgxPayPalModule } from 'ngx-paypal';
import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LyCarouselModule } from '@alyle/ui/carousel';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyIconModule } from '@alyle/ui/icon';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { LySliderModule } from '@alyle/ui/slider';
import { LyDialogModule } from '@alyle/ui/dialog';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { MatDialogModule } from '@angular/material/dialog';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {BidiModule} from '@angular/cdk/bidi';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { IShareButtons } from 'ngx-sharebuttons';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const icons = [
  // ... other icons
  faFacebookSquare,
  faShare,

  
];

const shareProp: IShareButtons = {
  facebook: {
    icon: ['fab', 'facebook-square']
  },
};
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


const ALYLE_MODULES = [
/*   LyImageCropperModule, */
  LyCarouselModule,
  LySkeletonModule,
  LyCommonModule,
   LyTypographyModule,
  LyButtonModule,
  LyIconModule,
  LyToolbarModule,
  LySliderModule,
  HammerModule,
   LyDialogModule
  
]

const ALYLE_PROVIDER = [
  [ LyTheme2 ],
    [ StyleRenderer ],
    // Theme that will be applied to this module
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name: `minima-dark`
    // Gestures
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }
]


enableRipple(true)
const ANGULAR_MATERIAL_MODULES = [
  FontAwesomeModule,
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  MatInputModule,
  A11yModule,
  CdkStepperModule,
  CdkTableModule,
  CdkTreeModule,
  BidiModule,
  OverlayModule,
  MatBadgeModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatStepperModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  ShareIconsModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatAutocompleteModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  OverlayModule,
  PortalModule,
  ScrollingModule,
  NgxDaterangepickerMd,
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatListModule,
  MatProgressBarModule,
  MatMenuModule,
  FlexLayoutModule,
  GoogleChartsModule,
 MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatRippleModule,
    MatStepperModule,
    MatExpansionModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSliderModule,
    MatDatepickerModule,
  MatNativeDateModule,
  MatProgressBarModule,
    MatBadgeModule,
  MatTreeModule,
  MatRadioModule,
  MdePopoverModule,
  /* MDBBootstrapModule, ButtonsModule, NavbarModule, TooltipModule, TableModule, InputsModule, InputUtilitiesModule, ModalModule, WavesModule, CheckboxModule, DropdownModule, IconsModule, */
  MatButtonToggleModule
    
   
]

const SYNCFUSION_MODULES = [
  GridAllModule,
  UploaderModule,
  DropDownListAllModule,
  MultiSelectAllModule,
  DropDownButtonModule,
  ProgressButtonAllModule,
  SplitButtonAllModule,
  DialogModule,
  ListBoxAllModule,
  DateRangePickerAllModule,
  DateTimePickerAllModule,
  TimePickerAllModule,
  DatePickerAllModule,
  ButtonModule,
  CheckBoxModule,
  ChipListAllModule,
  RadioButtonAllModule,
  ToastModule,
  TabAllModule,
  TooltipAllModule,
/*   ChartAllModule, */
  ToolbarAllModule,
/*   AccumulationChartModule */
]



const SYNCFUSION_PROVIDERS = [
  ToolbarService, ForeignKeyService, SelectionService, EditService, DetailRowService, RowDDService, CommandColumnService, SortService, SearchService, ColumnMenuService, ColumnChooserService, AggregateService, CheckBoxSelectionService, /* CategoryService, LegendService, TooltipService, DataLabelService, LineSeriesService, DateTimeService, DateTimeCategoryService, ColumnSeriesService,
  ScatterSeriesService,TrendlinesService,BarSeriesService, StackingColumnSeriesService, AreaSeriesService, PieSeriesService, AccumulationLegendService, AccumulationTooltipService, AccumulationDataLabelService,
  AccumulationAnnotationService */
]

@NgModule({
  imports: [
    ...ANGULAR_MATERIAL_MODULES,
    ...SYNCFUSION_MODULES,
    ...ALYLE_MODULES,
    CommonModule,
    NgxPayPalModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ShareButtonsModule.withConfig({ prop: shareProp }),
    ShareButtonsPopupModule.withConfig({ prop: shareProp, title: 'Adafri', image: 'https://app.adafri.com/assets/images/Login-min.png' }),
    NgxDatatableModule.forRoot({messages: {
      emptyMessage: 'Aucun élément',
      selectedMessage: 'Sélectionner',
      totalMessage: 'Éléments'
    }}),
    NgxDropzoneModule,
     NgNumberFormatterModule,
     NgxEmojiPickerModule,
    FormsModule,
     YouTubePlayerModule,
    AngularCropperjsModule,
    NgxIntlTelInputModule,
    /* GoogleChartsModule.forRoot({ version: 'current', mapsApiKey: "AIzaSyDWWL2sAz2tVIUPlyl5sXXt3veuHRgBA64" }), */
    B_Tooltip.forRoot(),
    BsDropdownModule.forRoot(),
    NgxDaterangepickerMd.forRoot({
         
            separator: ' - ',
       applyLabel: 'Appliquer', 
         cancelLabel: 'Annuler', // detault is 'Cancel'
  // detault is 'Apply'
    clearLabel: 'Effacer', // detault is 'Clear'
      customRangeLabel: '',
  
    }),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDWWL2sAz2tVIUPlyl5sXXt3veuHRgBA64",
       libraries: ['places']
    }),
    ReactiveFormsModule,
  
      FlexLayoutModule,
    NgbModule,
  ],
  declarations: [
    
  ShortNumberPipe],
  exports: [
    ...ANGULAR_MATERIAL_MODULES,
    ...SYNCFUSION_MODULES,
    ...ALYLE_MODULES,
    HttpClientModule,
    NgxPayPalModule,
    NgxDaterangepickerMd,
    NgxDropzoneModule,
     B_Tooltip,
     NgxDatatableModule,
     NgxEmojiPickerModule,
    BsDropdownModule,
    NgxIntlTelInputModule,
    CommonModule,
    FormsModule,
    ShareButtonsModule,
    ShareButtonsPopupModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AgmCoreModule,
    NgbModule,
     YouTubePlayerModule,
    NgNumberFormatterModule,
    ShortNumberPipe,
    AngularCropperjsModule,
    GoogleChartsModule,
    TranslateModule
  ],
  providers: [...SYNCFUSION_PROVIDERS, ...ALYLE_PROVIDER, {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},]
})
export class SharedModule {
  constructor(iconLibrary: FaIconLibrary) {
    iconLibrary.addIcons(...icons);
  }
}
