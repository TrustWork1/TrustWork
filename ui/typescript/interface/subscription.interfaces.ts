import { BaseApiResponse } from './common.interface';

export interface ISubscriptionModel {
  PricingPlanSection: {
    id: number;
    plan_name: string;
    description: string;
    billing_cycle: string;
    price: string;
    is_popular: boolean;
    features: {
      id: number;
      features: string;
    }[];
  }[];

  SubscriptionCmsSection: {
    id: number;
    header: string;
    description: string;
    created_at: string;
    updated_at: string;
  };

  DownloadSection: {
    playstore_link: string;
    appstore_link: string;
  };

  SubscriptionRequestPayload: {
    amount: string;
    phone_number: string;
    email: string;
    subscription_frequency: string;
  };

  SubscriptionRequestResponse: {
    data: {
      message: string;
    };
  } & BaseApiResponse;

  SubscriptionPageResponse: {
    data: {
      plans: ISubscriptionModel['PricingPlanSection'];
      download_section: ISubscriptionModel['DownloadSection'];
    };
  } & BaseApiResponse;
  SubscriptionCmsResponse: {
    data: ISubscriptionModel['SubscriptionCmsSection'];
  } & BaseApiResponse;
}
