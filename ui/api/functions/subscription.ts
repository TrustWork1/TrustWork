import { ISubscriptionModel } from '@/typescript/interface/subscription.interfaces';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endpoints';

export const fetchSubscriptionPageData = async () => {
  const res = await axiosInstance.get<ISubscriptionModel['SubscriptionPageResponse']>(
    endpoints.subscription.list
  );
  const data = res?.data?.data;

  return {
    subscriptionPackageList: data?.plans,
    downloadUrls: data?.download_section,
  };
};
export const fetchSubscriptionCmsData = async () => {
  const res = await axiosInstance.get<ISubscriptionModel['SubscriptionCmsResponse']>(
    endpoints.subscription.cms
  );
  const data = res?.data?.data;

  return {
    subscriptionCms: data,
  };
};

export const submitSubscriptionRequestForm = async (
  body: ISubscriptionModel['SubscriptionRequestPayload']
) => {
  const res = await axiosInstance.post<ISubscriptionModel['SubscriptionRequestResponse']>(
    endpoints.subscription.request,
    body
  );
  return res.data;
};
