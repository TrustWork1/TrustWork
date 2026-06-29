import { ISubscriptionModel } from '@/typescript/interface/subscription.interfaces';
import { TSubscriptionCheckoutPlan } from '@/typescript/types/subscriptionPayment.type';

type TSubscriptionPaymentReferenceResponse = {
  paymentIntentId?: string;
  payment_intent_id?: string;
  payToken?: string;
  referenceId?: string;
};

type TPaymentStateOptions = {
  hasSubmittedPayment?: boolean;
  isFailed: boolean;
  isPaid: boolean;
  referenceId: string;
};

export const getSubscriptionPaymentReferenceId = (
  response?: TSubscriptionPaymentReferenceResponse
) =>
  response?.referenceId ||
  response?.payToken ||
  response?.payment_intent_id ||
  response?.paymentIntentId ||
  '';

export const cameroonMobileMoneyPhoneError =
  'Please enter a valid Cameroon mobile money number. Use 9 digits starting with 6, for example 675708549, or include +237 before the full number.';

export const normalizeCameroonMobileMoneyPhone = (phone: string) => {
  const compactPhone = phone.replace(/[\s-]/g, '');

  if (/^6\d{8}$/.test(compactPhone)) {
    return `+237${compactPhone}`;
  }

  if (/^\+2376\d{8}$/.test(compactPhone)) {
    return compactPhone;
  }

  return '';
};

export const getIsSubscriptionPaymentPaid = (
  response?:
    | ISubscriptionModel['SubscriptionPaymentStatusData']
    | ISubscriptionModel['SubscriptionPaymentStatusResponse']
) =>
  response?.payment_status === 'paid' ||
  Boolean(response?.subscription_activated) ||
  Boolean(response?.is_payment_verified);

export const getIsSubscriptionPaymentPending = ({
  hasSubmittedPayment = true,
  isFailed,
  isPaid,
  referenceId,
}: TPaymentStateOptions) => hasSubmittedPayment && Boolean(referenceId) && !isPaid && !isFailed;

export const getHasMobileMoneyInitiateFailure = ({
  initiateResponse,
  isInitiateError,
}: {
  initiateResponse?:
    | ISubscriptionModel['MobileMoneyInitiateData']
    | ISubscriptionModel['MobileMoneyInitiateResponse'];
  isInitiateError: boolean;
}) => {
  const referenceId = getSubscriptionPaymentReferenceId(initiateResponse);

  return (
    isInitiateError ||
    initiateResponse?.payment_status === 'failed' ||
    Boolean(initiateResponse && !referenceId)
  );
};

export const createStripeIdempotencyKey = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `stripe-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const createStripePaymentPayload = ({
  plan,
  token,
}: {
  plan: TSubscriptionCheckoutPlan;
  token: string;
}): ISubscriptionModel['StripeInitiatePayload'] => {
  const pricingPlanId = Number(plan.id) || 2;

  return {
    pricing_plan_id: pricingPlanId,
    currency: 'xaf',
    idempotencyKey: createStripeIdempotencyKey(),
    token,
  };
};
