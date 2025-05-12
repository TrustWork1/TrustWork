import { TTermAndConditionResponse } from '@/typescript/types/termCondition.type';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endpoints';

export const fetchPrivacyPolicyfn = async (): Promise<{
  data: TTermAndConditionResponse['data'];
  status: number;
}> => {
  const response = await axiosInstance.get<TTermAndConditionResponse>(endpoints.cms.privacyPolicy);
  return {
    data: response.data.data,
    status: response.status,
  };
};
