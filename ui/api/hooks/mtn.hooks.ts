import {
  fetchMtnPreapprovalStatus,
  initiateMtnSubscriptionPayment,
} from '@/api/functions/subscription';
import { useMobileMoneySubscriptionPayment } from './mobileMoney.hooks';

type UseMtnSubscriptionPaymentOptions = {
  planId: number;
};

export const useMtnSubscriptionPayment = ({ planId }: UseMtnSubscriptionPaymentOptions) => {
  const { initiateMobileMoneyPayment, ...paymentState } = useMobileMoneySubscriptionPayment({
    initiateFn: initiateMtnSubscriptionPayment,
    planId,
    queryKey: 'mtn',
    statusFn: fetchMtnPreapprovalStatus,
  });

  return {
    ...paymentState,
    initiateMtnPayment: initiateMobileMoneyPayment,
  };
};
