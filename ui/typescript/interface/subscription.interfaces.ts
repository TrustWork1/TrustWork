import { BaseApiResponse } from './common.interface';

export interface ISubscriptionModel {
  SubscriptionCheckEmailPayload: {
    email: string;
  };

  SubscriptionCheckEmailResponse: {
    message: string;
    email: string;
    exists: boolean;
    created: boolean;
    password_sent: boolean;
    can_login: boolean;
    login_endpoint: string;
    data?: {
      message?: string;
      email?: string;
      exists?: boolean;
      created?: boolean;
      password_sent?: boolean;
      can_login?: boolean;
      login_endpoint?: string;
    };
  } & BaseApiResponse;

  SubscriptionLoginPayload: {
    email?: string;
    username?: string;
    password: string;
  };

  SubscriptionLoginResponse: {
    accessToken?: string;
    user?: Record<string, unknown>;
    UserData?: Record<string, unknown>;
    data?: {
      accessToken?: string;
      user?: Record<string, unknown>;
      UserData?: Record<string, unknown>;
    };
  } & BaseApiResponse;

  SubscriptionResendPasswordPayload: {
    email: string;
  };

  SubscriptionResendPasswordResponse: {
    message: string;
    email?: string;
    password_sent?: boolean;
    data?: {
      message?: string;
      email?: string;
      password_sent?: boolean;
    };
  } & BaseApiResponse;

  SubscriptionValidateTokenPayload: {
    token: string;
  };

  SubscriptionValidateTokenResponse: {
    valid: boolean;
    user: {
      id: number;
      email: string;
      full_name: string;
      user_type: string;
      profile_id: number;
      is_payment_verified: boolean;
      active_subscription: unknown;
    };
    data?: {
      valid?: boolean;
      user?: ISubscriptionModel['SubscriptionValidateTokenResponse']['user'];
    };
  } & BaseApiResponse;

  MobileMoneyPaymentPayload: {
    phone_number: string;
    pricing_plan_id: number;
    token?: string;
  };

  MobileMoneyInitiateData: {
    message: string;
    referenceId?: string;
    orderId?: string;
    payToken?: string;
    orangeTransactionId?: number;
    subscription_id?: string;
    pricing_plan?: {
      id: number;
      plan_name: string;
      billing_cycle: string;
      subscription_frequency: string;
      amount: number;
      whole_amount: string;
    };
    payment_status: 'pending' | 'paid' | 'failed' | string;
    next_action?: {
      type?: string;
      message?: string;
    };
    payment_response: Record<string, unknown>;
  };

  MobileMoneyInitiateResponse: ISubscriptionModel['MobileMoneyInitiateData'] &
    BaseApiResponse & {
      data?: ISubscriptionModel['MobileMoneyInitiateData'];
    };

  SubscriptionPaymentStatusData: {
    message?: string;
    payment_status: 'pending' | 'paid' | 'failed' | string;
    subscription_activated: boolean;
    is_payment_verified: boolean;
    active_subscription: {
      id: number;
      subscription_frequency: string;
      subscription_plan: string;
      expire_at: string;
      purchase_token: string;
    } | null;
    payment_response: Record<string, unknown>;
  };

  SubscriptionPaymentStatusResponse: ISubscriptionModel['SubscriptionPaymentStatusData'] &
    BaseApiResponse & {
      data?: ISubscriptionModel['SubscriptionPaymentStatusData'];
    };

  StripeInitiatePayload: {
    pricing_plan_id: number;
    currency: string;
    idempotencyKey?: string;
    token: string;
  };

  StripeInitiateData: {
    message?: string;
    client_secret?: string;
    publishable_key?: string;
    payment_intent_id?: string;
    paymentIntentId?: string;
    referenceId?: string;
    payment_status?: 'pending' | 'paid' | 'failed' | string;
    payment_response?: Record<string, unknown>;
  };

  StripeInitiateResponse: ISubscriptionModel['StripeInitiateData'] &
    BaseApiResponse & {
      data?: ISubscriptionModel['StripeInitiateData'];
    };

  PricingPlanSection: {
    id: number;
    plan_name: string;
    description: string;
    billing_cycle: string;
    price: string;
    is_popular: boolean;
    features: {
      id: number;
      features: string;
    }[];
  }[];

  SubscriptionCmsSection: {
    id: number;
    header: string;
    description: string;
    created_at: string;
    updated_at: string;
  };

  DownloadSection: {
    playstore_link: string;
    appstore_link: string;
  };

  SubscriptionRequestPayload: {
    amount: string;
    phone_number: string;
    email: string;
    subscription_frequency: string;
  };

  SubscriptionRequestResponse: {
    data: {
      message: string;
    };
  } & BaseApiResponse;

  Feature: {
    id: number;
    features: string;
  };

  Section: {
    id: number;
    header: string;
    description: string;
  };

  TSubscriptionDetails: {
    id: number;
    plan_name: string;
    description: string;
    price: string;
    amount: string;
    amount_integer: number;
    currency: string;
    billing_cycle: string;
    subscription_frequency: string;
    is_popular: boolean;
    features: ISubscriptionModel['Feature'][];
    section: ISubscriptionModel['Section'];
  };

  TSubscriptionDetailsResponse: BaseApiResponse & {
    data: ISubscriptionModel['TSubscriptionDetails'];
  };

  SubscriptionPageResponse: {
    data: {
      plans: ISubscriptionModel['PricingPlanSection'];
      download_section: ISubscriptionModel['DownloadSection'];
    };
  } & BaseApiResponse;
  SubscriptionCmsResponse: {
    data: ISubscriptionModel['SubscriptionCmsSection'];
  } & BaseApiResponse;
}
