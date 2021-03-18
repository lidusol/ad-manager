
import { LOCATION, KEYWORDS_TARGET, DISPLAY_ADS, SCHEDULE_INTERFACE, PLACEMENT_TYPE, SEARCH_ADS_BEFORE_UPLOAD, PHONE_TYPE, OBJECTIVES, CHANNEL_FORMAT, DEVICE_INTERFACE } from 'src/app/utils/data';

export interface Search {
    id?: string;
    id_campagne?: number;
    name?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    targetedLocations?: LOCATION[];
    excludedLocations?: LOCATION[];
    numberOfDays?: number;
    budgetId?: number;
    dailyBudget?: number;
    realBudget?: number;
    realDailyBudget?: number;
    budget?: number;
    startDateFrench?: string;
    endDateFrench?: string;
    startDateFormattedGoogle?: string;
    endDateFormattedGoogle?: string;
    startDateEnglish?: string;
    endDateEnglish?: string;
    urlPromote?: string;
    strategie?: string;
    bid?: number;
    keywords?: any;
    devices?: any;
    adsSchedules?: SCHEDULE_INTERFACE[];
    devicesTargeted?: DEVICE_INTERFACE[]
    devicesExcluded?: DEVICE_INTERFACE[];
  impressions?: number;
  totalImpressions?: number;
  totalClics?: number;
    clicks?: number;
  costs?: number;
  ctr?: number;
    textAds?: any[];
    callExtension?: PHONE_TYPE;
    servingStatus?: string;
    dueDate?: any;
    createdAt?: any;
    createdBy?: any;
    adsSchedulesCriterion?: any;
    ad_group_id?: number;
    ad_group_id_firebase?: any;
    owner?: string;
    last_check_date?: string;
    last_check_time?: number;
    last_daily_cost?: number;
    text_ads?: SEARCH_ADS_BEFORE_UPLOAD[]
    type?: string;
    isPayed?: boolean;
    isEdited?: boolean;
    isEnded?: boolean;
    isArchived?: boolean;
    isUsedPack?: boolean;
    packType?: string;
    isComplete?: boolean;
    format?: any;
    isUsePromoteCode?: boolean;
    budgetEnded?: boolean;
    isExpress?: boolean;
    accountId?: string;
    ActiveViewImpressions?: any;
    ActiveViewMeasurability?: any;
    ActiveViewMeasurableCost?: any;
    ActiveViewMeasurableImpressions?: any;
    PercentNewVisitors?: any;
    Interactions?: any;
    InteractionTypes?: any
    NumOfflineImpressions?: any;
    NumOfflineInteractions?: any
    Conversions?: any;
    ConversionRate?: any;
    ConversionValue?: any;
  Ctr?: any;
  areaTargetedOption?: string;
  areaExcludedOption?: string;
  objective?: OBJECTIVES,
  adChannel?: CHANNEL_FORMAT,

}




export interface AdGroupSearch {
  campaign_id?: number;
  ad_group_id?: number;
  name?: string;
  status?: any;
  devices?: any;
  keywords?: KEYWORDS_TARGET[];
  devicesTargeted?: DEVICE_INTERFACE[]
  devicesExcluded?: DEVICE_INTERFACE[];
  createdAt?: any;
  createdBy?: any;
  owner?: any;
  accountId?: string;
}


export interface Ads {
  id?: any;
  ad_id?: any;
  ad_group_id?: any;
  ad_name?: any;
  status?: any;
  url_image?: any;
  displayUrl?: any;
  finalUrls?: any;
  finalMobileUrls?: any;
  finalAppUrls?: any;
  automated?: any;
  referenceId?: any;
  createdAt?: any;
  createdBy?: any;
  owner?: any;
  accountId?: string;
  
 
 
}

export interface ResponsiveSearchAd {
    id?: any;
    ad_id?: any;
    titles?: {assetText: string, assetId: number}[];
    descriptions?: {assetText: string, assetId: number}[];
    ad_group_id?: any;
    status?: any;
    finalUrl?: any;
    createdAt?: any;
    createdBy?: any;
    combinedApprovalStatus?: any;
    policy?:any;
    owner?: any;
    accountId?: string;
    path1?: string;
    path2?: string;
    
   
   
  }
export interface AdsResponse{
  ad_id: number;
name?: any;
status?: string;
displayUrl?: any;
finalUrls?: any;
finalMobileUrls?: any;
finalAppUrls?: any;
automated?: any;
referenceId?: number;
url_image?: string;  
}

export interface AdsReport{
  ad_id?: string;
    ad_group_id?: string;
  combinedApprovalStatus?: any;
  policySummary?: any;
    campaignName?: string;
    campaignId?: string;
    adGroupName?: string;
    imageAdUrl?: string;
    clicks?: string;
    costs?: string;
    impressions?: string;
    interactions?: any;
    interactionTypes?: any;
    conversions?: any;
    ctr?: any;
    convRate?: any;
    percentNewVisitors?: any;
    activeViewViewability?: any;
    activeViewMeasurableImpressions?: string;
    activeViewImpressions?: string;
    activeViewMeasurableCost?: string;

}


/* export interface PlacementReport{
    ad_id?: string;
    ad_group_id?: string;
    campaignName?: string;
    campaignId?: string;
    adGroupName?: string;
    criteria?: string;
    criteriaDestinationUrl?: string;
    displayName?: string;
    criterionId?: number;
    finalUrl: any;
    finalMobileUrls?: any;
    finalAppUrls?: any;
    status?: string;
    clicks?: string;
    costs?: string;
    impressions?: string;
    interactions?: any;
    interactionTypes?: any;
    conversions?: any;
    ctr?: any;
    convRate?: any;
    percentNewVisitors?: any;
    activeViewViewability?: any;
    activeViewMeasurableImpressions?: string;
    activeViewImpressions?: string;
    activeViewMeasurableCost?: string;

} */

export interface PlacementReport{
    ad_id?: string;
    ad_group_id?: string;
    campaignName?: string;
    campaignId?: string;
    adGroupName?: string;
    criteriaParams?: string;
    url?: string;
    displayName?: string;
    clicks?: string;
    costs?: string;
    impressions?: string;
    interactions?: any;
    interactionTypes?: any;
    conversions?: any;
    ctr?: any;
    convRate?: any;
    percentNewVisitors?: any;
    activeViewViewability?: any;
    activeViewMeasurableImpressions?: string;
    activeViewImpressions?: string;
    activeViewMeasurableCost?: string;

}


export interface CAMPAIGN_PERFORMANCE_REPORT_MODEL_1{
  campaign_id?: string;
  clicks?: string;
  costs?: string;
  impressions?: string;
  campaignName?: string
  interactions?: any;
  interactionTypes?: any;
  conversions?: any;
  ctr?: any;
  convRate?: any;
  percentNewVisitors?: any;
  activeViewViewability?: any;
  activeViewMeasurableImpressions?: string;
  activeViewImpressions?: string;
  activeViewMeasurableCost?: string;

}