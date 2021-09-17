export interface Campaign {
    name: string;
    status: string;
    objective: string;
    special_ad_categories: string[];
    campaign_id?: string,
    adsets?: any[]
}

export interface Adset {
    name: string;
    optimization_goal: string;
    billing_event: string;
    bid_amount: number
    daily_budget: number
    campaign_id?: string;
    targeting: any;
    start_time: string;
    status: string;
    adset_id?: string;
    instagram_actor_id?: string;
}

export interface Creative {
    name: string;
    ad_format: string;
    object_story_spec: any;
    creative_id?: string
}

export interface Ad {
    name: string;
    adset_id: string;
    creative: any;
    status: string;
    ad_id?: string;
}