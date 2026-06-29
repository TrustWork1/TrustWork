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
export const fetchSubscriptionDetails = async (planId: number) => {
  const res = await axiosInstance.get<ISubscriptionModel['TSubscriptionDetailsResponse']>(
    `${endpoints.subscription.planDetails}/${planId}/`
  );
  const data = res?.data?.data;

  return {
    subscriptionDetails: data,
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

export const checkSubscriptionEmail = async (
  body: ISubscriptionModel['SubscriptionCheckEmailPayload']
) => {
  const res = await axiosInstance.post<ISubscriptionModel['SubscriptionCheckEmailResponse']>(
    endpoints.subscription.checkEmail,
    body
  );
  return res.data;
};

export const loginSubscriptionUser = async (
  body: ISubscriptionModel['SubscriptionLoginPayload']
) => {
  const res = await axiosInstance.post<ISubscriptionModel['SubscriptionLoginResponse']>(
    endpoints.auth.login,
    body
  );
  return res.data;
};

export const resendSubscriptionPassword = async (
  body: ISubscriptionModel['SubscriptionResendPasswordPayload']
) => {
  const res = await axiosInstance.post<ISubscriptionModel['SubscriptionResendPasswordResponse']>(
    endpoints.subscription.resendPassword,
    body
  );
  return res.data;
};

export const validateSubscriptionToken = async (
  body: ISubscriptionModel['SubscriptionValidateTokenPayload']
) => {
  const res = await axiosInstance.post<ISubscriptionModel['SubscriptionValidateTokenResponse']>(
    endpoints.subscription.validateToken,
    body,
    {
      headers: {
        Authorization: `Bearer ${body.token}`,
      },
    }
  );
  return res.data;
};

export const initiateMtnSubscriptionPayment = async (
  body: ISubscriptionModel['MobileMoneyPaymentPayload']
) => {
  const res = await axiosInstance.post<ISubscriptionModel['MobileMoneyInitiateResponse']>(
    endpoints.subscription.mtnInitiate,
    body
  );
  return res.data.data ?? res.data;
};

export const fetchMtnPreapprovalStatus = async (referenceId: string) => {
  const res = await axiosInstance.get<ISubscriptionModel['SubscriptionPaymentStatusResponse']>(
    endpoints.subscription.mtnPreapprovalStatus(referenceId)
  );
  return res.data.data ?? res.data;
};

export const initiateOrangeSubscriptionPayment = async (
  body: ISubscriptionModel['MobileMoneyPaymentPayload']
) => {
  const { token, ...payload } = body;

  const res = await axiosInstance.post<ISubscriptionModel['MobileMoneyInitiateResponse']>(
    endpoints.subscription.orangeInitiate,
    payload,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined
  );
  return res.data.data ?? res.data;
};

export const fetchOrangePaymentStatus = async (referenceId: string) => {
  const res = await axiosInstance.get<ISubscriptionModel['SubscriptionPaymentStatusResponse']>(
    endpoints.subscription.orangeStatus(referenceId)
  );
  return res.data.data ?? res.data;
};

export const initiateStripeSubscriptionPayment = async (
  body: ISubscriptionModel['StripeInitiatePayload']
): Promise<ISubscriptionModel['StripeInitiateData']> => {
  const { idempotencyKey, token, ...payload } = body;

  const res = await axiosInstance.post<ISubscriptionModel['StripeInitiateResponse']>(
    endpoints.subscription.stripeInitiate,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-access-token': token,
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
    }
  );
  return res.data.data ?? res.data;
};

export const fetchStripePaymentStatus = async (
  paymentIntentId: string,
  token?: string
): Promise<ISubscriptionModel['SubscriptionPaymentStatusData']> => {
  const res = await axiosInstance.get<ISubscriptionModel['SubscriptionPaymentStatusResponse']>(
    endpoints.subscription.stripeStatus(paymentIntentId),
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-access-token': token,
          },
        }
      : undefined
  );
  return res.data.data ?? res.data;
};
