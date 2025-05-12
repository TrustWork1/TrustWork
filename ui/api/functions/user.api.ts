import { IgetSignUpQuery } from '@/typescript/interface/apiresp.interfaces';
import { IFormInput } from '@/typescript/interface/common.interface';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endpoints';

export const signUpMutation = async (body: IFormInput) => {
  const res = await axiosInstance.post<IgetSignUpQuery>(endpoints.auth.signup, body);

  return res;
};
export const loginMutation = async (body: IFormInput) => {
  const res = await axiosInstance.post<IgetSignUpQuery>(endpoints.auth.login, body);

  return res;
};
export const GetProfileDetails = async () => {
  const res = await axiosInstance.get<IgetSignUpQuery>(endpoints.auth.profileDetails);

  return res;
};
export const signUpProfileMutation = async (body: IFormInput) => {
  const res = await axiosInstance.post<IgetSignUpQuery>(endpoints.auth.signUpProfile, body);

  return res;
};
