import { IHomeModel } from '../interface/home.interface';

export type THomeTypes = {
  appInfo: IHomeModel['AppInfo'];
  featureSection: IHomeModel['FeatureSection'];
  howItWorks: IHomeModel['HowItWorksSection'];
  pricingPlans: IHomeModel['PricingPlanSection'];
  referral: IHomeModel['ReferralSection'];
  download: IHomeModel['DownloadSection'];
};
