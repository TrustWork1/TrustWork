import {
  getHasMobileMoneyInitiateFailure,
  getIsSubscriptionPaymentPaid,
  getIsSubscriptionPaymentPending,
  getSubscriptionPaymentReferenceId,
  normalizeCameroonMobileMoneyPhone,
} from '@/lib/functions/subscriptionPayment.lib';
import { ISubscriptionModel } from '@/typescript/interface/subscription.interfaces';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useCallback, useMemo, useState } from 'react';

interface MobileMoneyInitiateErrorResponse {
  status?: string;
  message?: string;
  type?: string;
  data?: {
    status?: string;
    type?: string;
    code?: string;
    message?: string;
  };
}

type UseMobileMoneySubscriptionPaymentOptions = {
  initiateFn: (
    body: ISubscriptionModel['MobileMoneyPaymentPayload']
  ) => Promise<ISubscriptionModel['MobileMoneyInitiateData']>;
  planId: number;
  queryKey: string;
  statusFn: (referenceId: string) => Promise<ISubscriptionModel['SubscriptionPaymentStatusData']>;
  token?: string;
};

export const useMobileMoneySubscriptionPayment = ({
  initiateFn,
  planId,
  queryKey,
  statusFn,
  token,
}: UseMobileMoneySubscriptionPaymentOptions) => {
  const queryClient = useQueryClient();
  const [referenceId, setReferenceId] = useState('');
  const statusQueryKey = useMemo(
    () => [`subscription-${queryKey}-status`, referenceId],
    [queryKey, referenceId]
  );

  const {
    mutate: initiatePayment,
    data: initiateResponse,
    isError: isInitiateError,
    isPending: isInitiating,
    reset: resetInitiatePayment,
    error: initiateError,
  } = useMutation<
    ISubscriptionModel['MobileMoneyInitiateData'],
    AxiosError<MobileMoneyInitiateErrorResponse>,
    ISubscriptionModel['MobileMoneyPaymentPayload']
  >({
    mutationKey: [`subscription-${queryKey}-initiate`, planId],
    mutationFn: initiateFn,
    onSuccess: response => {
      const nextReferenceId = getSubscriptionPaymentReferenceId(response);

      setReferenceId(nextReferenceId);

      if (nextReferenceId) {
        void queryClient.fetchQuery({
          queryKey: [`subscription-${queryKey}-status`, nextReferenceId],
          queryFn: () => statusFn(nextReferenceId),
        });
      }
    },
  });

  const { data: statusResponse, isFetching: isCheckingStatus } = useQuery({
    queryKey: statusQueryKey,
    queryFn: () => statusFn(referenceId),
    enabled: Boolean(referenceId),
    refetchInterval: query => {
      const status = query.state.data?.payment_status;

      return status === 'pending' ? 10000 : false;
    },
  });

  const paymentState = useMemo(() => {
    const paymentStatus = statusResponse?.payment_status;
    const isPaid = getIsSubscriptionPaymentPaid(statusResponse);
    const isFailed =
      getHasMobileMoneyInitiateFailure({
        initiateResponse,
        isInitiateError,
      }) || paymentStatus === 'failed';
    const isPendingPayment = getIsSubscriptionPaymentPending({
      isFailed,
      isPaid,
      referenceId,
    });

    return {
      isFailed,
      isPaid,
      isPendingPayment,
    };
  }, [initiateResponse, isInitiateError, referenceId, statusResponse]);

  const errorMessage = useMemo(() => {
    if (initiateError) {
      const responseData = initiateError.response?.data;
      const errorType =
        responseData?.type ||
        responseData?.status ||
        responseData?.data?.type ||
        responseData?.data?.status ||
        responseData?.data?.code ||
        responseData?.message ||
        responseData?.data?.message;

      if (errorType === 'active_subscription_exists') {
        return 'You already have an active subscription.';
      }

      if (errorType === 'subscription_payment_pending') {
        return 'A payment request is already pending. Please complete it or wait before trying again.';
      }

      return (
        responseData?.message ||
        responseData?.data?.message ||
        'Please check your number and try again.'
      );
    }
    if (statusResponse?.payment_status === 'failed') {
      return statusResponse?.message || 'Payment verification failed.';
    }
    return '';
  }, [initiateError, statusResponse]);

  const nextActionMessage = useMemo(
    () => initiateResponse?.next_action?.message || initiateResponse?.message || '',
    [initiateResponse]
  );

  const initiateMobileMoneyPayment = useCallback(
    (phone: string) => {
      resetInitiatePayment();
      setReferenceId('');

      initiatePayment({
        phone_number: normalizeCameroonMobileMoneyPhone(phone),
        pricing_plan_id: Number(planId) || 2,
        token,
      });
    },
    [initiatePayment, planId, resetInitiatePayment, token]
  );

  return useMemo(
    () => ({
      initiateMobileMoneyPayment,
      isCheckingStatus,
      isFailed: paymentState.isFailed,
      isInitiating,
      isPaid: paymentState.isPaid,
      isPendingPayment: paymentState.isPendingPayment,
      referenceId,
      errorMessage,
      nextActionMessage,
    }),
    [
      initiateMobileMoneyPayment,
      isCheckingStatus,
      isInitiating,
      paymentState,
      referenceId,
      errorMessage,
      nextActionMessage,
    ]
  );
};
