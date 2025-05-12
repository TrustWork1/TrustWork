import { BaseApiResponse } from '../interface/common.interface';
import { IContactFormModel, IContactModel } from '../interface/contactUs.interface';

export type TContactPageResponse = {
  data: IContactModel;
} & BaseApiResponse;

export type TContactFormSubmitResponse = {
  data: IContactFormModel;
} & BaseApiResponse;
