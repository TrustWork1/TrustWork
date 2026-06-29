export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const baseUrlApi = `${process.env.NEXT_PUBLIC_BASE_URL}/api/`;
export const baseUrlMedia = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

export const mediaUrl = (url: string) => {
  return `${baseUrlMedia}/uploads/${url}`;
};

export const endpoints = {
  auth: {
    login: '/login/',
  },
  cms: {
    homePage: '/home-page/',
    aboutUsPage: '/aboutus-page/',
    contactUs: '/contactus-page/',
    contactUsFormSubmit: '/contactus-form/',
    termCondition: '/terms-conditions-page/',
    privacyPolicy: '/privacy-policy-page/',
  },
  subscription: {
    list: '/app-packages/',
    planDetails: '/v1/subscription/plans',
    cms: '/app-packages-cms/',
    request: '/send_subscription_request/',
    checkEmail: '/v1/subscription/auth/check-email/',
    resendPassword: '/v1/subscription/auth/resend-password/',
    validateToken: `${baseUrl}/subscription/validate-token/`,
    mtnInitiate: '/v1/subscription/mtn/initiate/',
    mtnPreapprovalStatus: (referenceId: string) =>
      `/v1/subscription/mtn/preapproval-status/${referenceId}/`,
    orangeInitiate: '/v1/subscription/orange/initiate/',
    orangeStatus: (referenceId: string) => `/v1/subscription/orange/status/${referenceId}/`,
    stripeInitiate: '/v1/subscription/stripe/initiate/',
    stripeStatus: (paymentIntentId: string) => `/v1/subscription/stripe/status/${paymentIntentId}/`,
  },
};

export const sucessNotificationEndPoints = [
  // endpoints.subscription.request,
];
