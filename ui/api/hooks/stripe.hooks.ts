import {
  fetchStripePaymentStatus,
  initiateStripeSubscriptionPayment,
} from '@/api/functions/subscription';
import {
  getIsSubscriptionPaymentPaid,
  getIsSubscriptionPaymentPending,
  getSubscriptionPaymentReferenceId,
} from '@/lib/functions/subscriptionPayment.lib';
import { ISubscriptionModel } from '@/typescript/interface/subscription.interfaces';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

type TUseStripeSubscriptionPaymentOptions = {
  planId: number;
  token?: string;
};

export const useStripeSubscriptionPayment = ({
  planId,
  token,
}: TUseStripeSubscriptionPaymentOptions) => {
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [publishableKey, setPublishableKey] = useState('');
  const [hasSubmittedPayment, setHasSubmittedPayment] = useState(false);
  const [stripeError, setStripeError] = useState('');
  const statusQueryKey = useMemo(
    () => ['subscription-stripe-status', paymentIntentId, token],
    [paymentIntentId, token]
  );

  const { mutateAsync: initiatePayment, isPending: isInitiating } = useMutation({
    mutationKey: ['subscription-stripe-initiate', planId],
    mutationFn: initiateStripeSubscriptionPayment,
  });

  const { data: statusResponse, isFetching: isCheckingStatus } = useQuery({
    queryKey: statusQueryKey,
    queryFn: () => fetchStripePaymentStatus(paymentIntentId, token),
    enabled: Boolean(paymentIntentId) && hasSubmittedPayment,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: query => {
      const status = query.state.data?.payment_status;

      return status === 'pending' ? 5000 : false;
    },
    retry: false,
  });

  const paymentState = useMemo(() => {
    const paymentStatus = statusResponse?.payment_status;
    const isPaid = getIsSubscriptionPaymentPaid(statusResponse);
    const isFailed = Boolean(stripeError) || (hasSubmittedPayment && paymentStatus === 'failed');
    const isPendingPayment = getIsSubscriptionPaymentPending({
      hasSubmittedPayment,
      isFailed,
      isPaid,
      referenceId: paymentIntentId,
    });

    return {
      isFailed,
      isPaid,
      isPendingPayment,
    };
  }, [hasSubmittedPayment, paymentIntentId, statusResponse, stripeError]);

  const paymentMessage = useMemo(() => {
    if (stripeError) {
      return stripeError;
    }

    if (statusResponse?.message) {
      return statusResponse.message;
    }

    if (paymentState.isPaid) {
      return 'Your Stripe payment is verified and your subscription has been activated.';
    }

    if (paymentState.isFailed) {
      return 'Please retry with another payment method.';
    }

    return 'Stripe payment is processing. Checking status every 5 seconds...';
  }, [paymentState.isFailed, paymentState.isPaid, statusResponse?.message, stripeError]);

  const initiateStripePayment = async (payload: ISubscriptionModel['StripeInitiatePayload']) => {
    setClientSecret('');
    setStripeError('');
    setPaymentIntentId('');
    setPublishableKey('');
    setHasSubmittedPayment(false);

    try {
      const response = await initiatePayment(payload);
      const nextPaymentIntentId = getSubscriptionPaymentReferenceId(response);

      setClientSecret(response.client_secret || '');
      setPaymentIntentId(nextPaymentIntentId);
      setPublishableKey(response.publishable_key || '');

      if (!nextPaymentIntentId || !response.client_secret || !response.publishable_key) {
        setStripeError(response.message || 'Stripe payment setup details are missing.');
        return undefined;
      }

      return response;
    } catch (error) {
      setStripeError('Stripe payment initiation failed. Please try again.');
      console.error('Stripe payment initiation failed', error);
      return undefined;
    }
  };

  const handleStripePaymentFailed = (message?: string) => {
    setStripeError(message || 'Please retry with another payment method.');
  };

  const handleStripePaymentStarted = () => {
    setStripeError('');
  };

  const handleStripePaymentSubmitted = useCallback(
    (nextPaymentIntentId = paymentIntentId) => {
      setStripeError('');

      if (nextPaymentIntentId) {
        setPaymentIntentId(nextPaymentIntentId);
      }

      setHasSubmittedPayment(true);
    },
    [paymentIntentId]
  );

  return {
    clientSecret,
    handleStripePaymentFailed,
    handleStripePaymentStarted,
    handleStripePaymentSubmitted,
    initiateStripePayment,
    isCheckingStatus,
    isFailed: paymentState.isFailed,
    isInitiating,
    isPaid: paymentState.isPaid,
    isPendingPayment: paymentState.isPendingPayment,
    paymentMessage,
    paymentIntentId,
    publishableKey,
    statusResponse,
    stripeError,
  };
};
