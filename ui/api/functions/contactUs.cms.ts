import { IContactModel, IContactModelData } from '@/typescript/interface/contactUs.interface';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endpoints';
import { TContactFormSubmitResponse } from '@/typescript/types/contactUs.type';

export const fetchContactUsPageInfo = async (): Promise<{ contactUsInfo: IContactModelData }> => {
  const res = await axiosInstance.get<IContactModel>(endpoints.cms.contactUs);
  return {
    contactUsInfo: res?.data?.data || ({} as IContactModelData),
  };
};

export const submitContactForm = async (body: FormData) => {
  const res = await axiosInstance.post<TContactFormSubmitResponse>(
    endpoints.cms.contactUsFormSubmit,
    body
  );
  return res.data;
};
