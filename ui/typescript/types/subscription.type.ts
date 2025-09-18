import { ISubscriptionModel } from '../interface/subscription.interfaces';

export type TSubscriptionTypes = {
  subscriptionPackageList: ISubscriptionModel['PricingPlanSection'];
  download: ISubscriptionModel['DownloadSection'];
};

export type ISubscriptionCardProps = {
  planName: string;
  planSubTitle: string;
  price: number;
  features: string[];
  isPopular?: boolean;
};
