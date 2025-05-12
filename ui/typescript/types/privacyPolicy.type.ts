import { BaseApiResponse } from '../interface/common.interface';
import { ITermsAndConditions } from '../interface/termCondition.interfaces';

export type TPrivacyPolicyResponse = {
  data: ITermsAndConditions;
} & BaseApiResponse;

export type PrivacyPolicyProps = {
  data: ITermsAndConditions;
  status: number;
};
