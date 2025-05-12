import { TTermAndConditionResponse } from '@/typescript/types/termCondition.type';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endpoints';

export const fetchTermAndConditionfn = async (): Promise<{
  data: TTermAndConditionResponse['data'];
  status: number;
}> => {
  const response = await axiosInstance.get<TTermAndConditionResponse>(endpoints.cms.termCondition);
  return {
    data: response.data.data,
    status: response.status,
  };
};
