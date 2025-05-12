import { BaseApiResponse } from '../interface/common.interface';
import { ITermsAndConditions } from '../interface/termCondition.interfaces';

export type TTermAndConditionResponse = {
  data: ITermsAndConditions;
} & BaseApiResponse;

export type TermsAndConditionsProps = {
  data: ITermsAndConditions;
  status: number;
};
