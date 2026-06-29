export type TSubscriptionPaymentMode = 'orange_money' | 'mtn_mobile_money' | 'stripe';

export type TSubscriptionCheckoutPlan = {
  id: number;
  planName: string;
  description: string;
  amount: number;
  billingCycle: string;
  features: string[];
};

export type TSubscriptionPaymentFormProps = {
  token: string;
  plan: TSubscriptionCheckoutPlan;
  onPaymentSubmit?: (payload: Record<string, unknown>) => void;
};
