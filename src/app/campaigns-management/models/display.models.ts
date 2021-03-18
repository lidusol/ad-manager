
import { LOCATION, AGES_TYPE, GENDERS_TYPE, DISPLAY_ADS, SCHEDULE_INTERFACE, PLACEMENT_TYPE, OBJECTIVES, CHANNEL_FORMAT, USER_INTEREST, DEVICE_INTERFACE } from 'src/app/utils/data';

export interface Display {
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
    targetedPlacements?: PLACEMENT_TYPE[];
    excludedPlacements?: PLACEMENT_TYPE[];
    urlPromote?: string;
    strategie?: string;
    bid?: number;
    ages?: AGES_TYPE[];
    genders?: GENDERS_TYPE[];
    adsSchedules?: SCHEDULE_INTERFACE[];
    devicesTargeted?: DEVICE_INTERFACE[]
    devicesExcluded?: DEVICE_INTERFACE[];
  impressions?: number;
  totalImpressions?: number;
  totalClics?: number;
    clicks?: number;
  costs?: number;
  ctr?: number;
    images?: DISPLAY_ADS[];
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
    devices?: any;
  Ctr?: any;
  areaTargetedOption?: string;
  areaExcludedOption?: string;
  objective?: OBJECTIVES,
  adChannel?: CHANNEL_FORMAT,
  user_interest?: USER_INTEREST[],
  


}




export interface AdGroup {
  campaign_id?: number;
  ad_group_id?: number;
  name?: string;
  status?: any;
  ages?: AGES_TYPE[];
  genders?: GENDERS_TYPE[];
  devices?: any;
  targetedPlacements?: PLACEMENT_TYPE[];
  excludedPlacements?: PLACEMENT_TYPE[];
  devicesTargeted?: DEVICE_INTERFACE[]
    devicesExcluded?: DEVICE_INTERFACE[];
  createdAt?: any;
  createdBy?: any;
  owner?: any;
  accountId?: string;
  user_interest?: USER_INTEREST[];
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