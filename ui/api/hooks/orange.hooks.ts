import {
  fetchOrangePaymentStatus,
  initiateOrangeSubscriptionPayment,
} from '@/api/functions/subscription';
import { useMobileMoneySubscriptionPayment } from './mobileMoney.hooks';

type TUseOrangeSubscriptionPaymentOptions = {
  planId: number;
  token: string;
};

export const useOrangeSubscriptionPayment = ({
  planId,
  token,
}: TUseOrangeSubscriptionPaymentOptions) => {
  const { initiateMobileMoneyPayment, ...paymentState } = useMobileMoneySubscriptionPayment({
    initiateFn: initiateOrangeSubscriptionPayment,
    planId,
    queryKey: 'orange',
    statusFn: fetchOrangePaymentStatus,
    token,
  });

  return {
    ...paymentState,
    initiateOrangePayment: initiateMobileMoneyPayment,
  };
};
