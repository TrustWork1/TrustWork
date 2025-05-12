import { BaseApiResponse } from './common.interface';

export interface IHomeModel {
  AppInfo: {
    id: number;
    tagline: string;
    title: string;
    description: string;
    playstore_link: string;
    appstore_link: string;
    image: string;
  };

  FeatureSection: {
    id: number;
    header: string;
    description: string;
    features: {
      id: number;
      title: string;
      description: string;
      icon: string;
    }[];
  };

  HowItWorksSection: {
    id: number;
    header: string;
    description: string;
    image: string;
    steps: {
      id: number;
      title: string;
      description: string;
      icon: string;
    }[];
  };

  PricingPlanSection: {
    id: number;
    header: string;
    description: string;
    pricing_plans: {
      id: number;
      plan_name: string;
      description: string;
      billing_cycle: string;
      price: string;
      features: {
        id: number;
        features: string;
        is_active: string;
      }[];
    }[];
  };

  ReferralSection: {
    id: number;
    title: string;
    description: string;
    button_title: string;
    button_link: string;
    image: string;
  };

  DownloadSection: {
    id: number;
    title: string;
    description: string;
    playstore_link: string;
    appstore_link: string;
    image: string;
  };

  HomePageResponse: {
    data: {
      app_info: IHomeModel['AppInfo'];
      feature_section: IHomeModel['FeatureSection'];
      how_it_works_section: IHomeModel['HowItWorksSection'];
      pricing_plan_section: IHomeModel['PricingPlanSection'];
      referral_section: IHomeModel['ReferralSection'];
      download_section: IHomeModel['DownloadSection'];
    };
  } & BaseApiResponse;
}
