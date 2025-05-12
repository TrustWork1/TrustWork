import { IHomeModel } from '@/typescript/interface/home.interface';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endpoints';

export const fetchHomePageData = async () => {
  const res = await axiosInstance.get<IHomeModel['HomePageResponse']>(endpoints.cms.homePage);

  const data = res?.data?.data;

  return {
    appInfo: data?.app_info || ({} as IHomeModel['AppInfo']),
    featureSection: data?.feature_section || ({} as IHomeModel['FeatureSection']),
    howItWorks: data?.how_it_works_section || ({} as IHomeModel['HowItWorksSection']),
    pricingPlans: data?.pricing_plan_section || ({} as IHomeModel['PricingPlanSection']),
    referral: data?.referral_section || ({} as IHomeModel['ReferralSection']),
    download: data?.download_section || ({} as IHomeModel['DownloadSection']),
  };
};
