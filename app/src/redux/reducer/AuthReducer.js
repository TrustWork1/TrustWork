import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: false,
  getTokenResponse: null,
  getTempTokenResponse: null,
  error: {},
  roleType: '',
  isPaymentVerified: false,
  isDiscountApplied: false,
  isProfileVerified: false,
  signUpResponse: {},
  signinResponse: {},
  forgotPasswordResponse: {},
  verificationResponse: {},
  verificationOtpResponse: {},
  resetPasswordResponse: {},
  logoutResponse: {},
  userCheckResponse: {},
  setupProfileResponse: '',
  // viewCountryListResponse: {},
  // viewStateListResponse: {},

  deleteUserResponse: {},
  changePasswordResponse: {},
  verifyEmailResponse: {},
  ResendOtpResponse: {},
  notificationTokenResponse: {},
  ProfileResponse: {},
  UpdateProfileResponse: {},
  UpdateCoverPicResponse: {},
  ProviderListResponse: {},
  MembershipListResponse: {},
  MembershipStatusResponse: {},
  serviceListResponse: {},
  providerListByLocationResponse: {},
  providerDetailsResponse: {},
  mtnPaymentResponse: {},
  orangePaymentResponse: {},
  SubscriptionResponse: {},
  CreatePaymentResponse: {},
  StripePaymentResponse: {},
  StripePaymentFailResponse: {},
  PayCodeResponse: {},
  orangeSubResponse: {},
  orangeRedeemResponse: {},
};

const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    userCheckRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    userCheckSuccess(state, action) {
      state.isLoading = false;
      state.userCheckResponse = action.payload;
      state.setupProfileResponse = action.payload?.data?.setup_profile;
      state.roleType = action.payload?.data?.roletype;
      state.getTokenResponse = state.getTempTokenResponse;
      state.getTempTokenResponse = null;
      state.status = action.type;
    },
    userCheckFailure(state, action) {
      state.isLoading = false;
      state.getTempTokenResponse = null;
      state.getTokenResponse = null;
      state.error = action.payload;
      state.status = action.type;
    },

    //TOKEN
    getTokenRequest(state, action) {
      state.status = action.type;
    },
    getTokenSuccess(state, action) {
      state.getTokenResponse = action.payload;
      state.status = action.type;
    },
    getTokenFailure(state, action) {
      state.error = action.payload;
      state.status = action.type;
    },

    storeRoletype(state, action) {
      state.roleType = action.payload;
    },

    storePaymentVerified(state, action) {
      state.isPaymentVerified = action.payload;
    },
    storeIsDiscount(state, action) {
      state.isDiscountApplied = action.payload;
    },

    storeProfileVerified(state, action) {
      state.isProfileVerified = action.payload;
    },

    //signup
    signUpRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    signUpSuccess(state, action) {
      state.isLoading = false;
      state.signUpResponse = action.payload;
      state.status = action.type;
    },
    signUpFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //verifyEmail
    verifyEmailRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    verifyEmailSuccess(state, action) {
      state.isLoading = false;
      state.verifyEmailResponse = action.payload;
      state.status = action.type;
    },
    verifyEmailFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //ResendOtp
    ResendOtpRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    ResendOtpSuccess(state, action) {
      state.isLoading = false;
      state.ResendOtpResponse = action.payload;
      state.status = action.type;
    },
    ResendOtpFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //signin
    signinRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    signinSuccess(state, action) {
      state.isLoading = false;
      state.signinResponse = action.payload;
      state.setupProfileResponse = action.payload?.UserData?.is_profile_updated;
      state.roleType = action.payload?.UserData?.user_type;
      state.isPaymentVerified = action.payload?.UserData?.is_payment_verified;
      state.isDiscountApplied = action.payload?.UserData?.is_discount;
      state.isProfileVerified = action.payload?.UserData?.is_profile_updated;
      state.getTokenResponse = action.payload?.accessToken;
      state.status = action.type;
    },
    signinFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //forgotPassword
    forgotPasswordRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    forgotPasswordSuccess(state, action) {
      state.isLoading = false;
      state.forgotPasswordResponse = action.payload;
      state.status = action.type;
    },
    forgotPasswordFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //verification
    verificationRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    verificationSuccess(state, action) {
      state.isLoading = false;
      state.verificationResponse = action.payload;
      state.status = action.type;
    },
    verificationFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //verificationOtp
    verificationOtpRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    verificationOtpSuccess(state, action) {
      state.isLoading = false;
      state.verificationOtpResponse = action.payload;
      state.status = action.type;
    },
    verificationOtpFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //resetPassword
    resetPasswordRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    resetPasswordSuccess(state, action) {
      state.isLoading = false;
      state.resetPasswordResponse = action.payload;
      state.status = action.type;
    },
    resetPasswordFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //logout
    logoutRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    logoutSuccess(state, action) {
      // Full reset to initial state — clears token, role, payment/profile flags,
      // and all cached responses so no stale data leaks to the next session.
      return {
        ...initialState,
        status: action.type,
      };
    },
    logoutFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    // // viewCountryList //
    // viewCountryListRequest(state, action) {
    //   state.status = action.type;
    // },
    // viewCountryListSuccess(state, action) {
    //   state.viewCountryListResponse = action.payload;
    //   state.status = action.type;
    // },
    // viewCountryListFailure(state, action) {
    //   state.error = action.error;
    //   state.status = action.type;
    // },

    // // viewStateList //
    // viewStateListRequest(state, action) {
    //   state.status = action.type;
    // },
    // viewStateListSuccess(state, action) {
    //   state.viewStateListResponse = action.payload;
    //   state.status = action.type;
    // },
    // viewStateListFailure(state, action) {
    //   state.error = action.error;
    //   state.status = action.type;
    // },

    //deleteUser
    deleteUserRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    deleteUserSuccess(state, action) {
      state.isLoading = false;
      state.deleteUserResponse = action.payload;
      state.getTokenResponse = null;
      state.roleType = '';
      state.status = action.type;
    },
    deleteUserFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //changePassword
    changePasswordRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    changePasswordSuccess(state, action) {
      state.isLoading = false;
      state.changePasswordResponse = action.payload;
      state.status = action.type;
    },
    changePasswordFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //Profile
    ProfileRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    ProfileSuccess(state, action) {
      state.isLoading = false;
      state.ProfileResponse = action.payload;
      state.isPaymentVerified = action.payload?.data?.is_payment_verified;
      state.status = action.type;
    },
    ProfileFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// update Profile //////////////////
    UpdateProfileRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    UpdateProfileSuccess(state, action) {
      state.isLoading = false;
      state.UpdateProfileResponse = action.payload;
      state.status = action.type;
    },
    UpdateProfileFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// update Profile //////////////////
    UpdateCoverPicRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    UpdateCoverPicSuccess(state, action) {
      state.isLoading = false;
      state.UpdateCoverPicResponse = action.payload;
      state.status = action.type;
    },
    UpdateCoverPicFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// ProviderList //////////////////
    ProviderListRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    ProviderListSuccess(state, action) {
      state.isLoading = false;
      state.ProviderListResponse = action.payload;
      state.status = action.type;
    },
    ProviderListFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// providerDetails //////////////////
    providerDetailsRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    providerDetailsSuccess(state, action) {
      state.isLoading = false;
      state.providerDetailsResponse = action.payload;
      state.status = action.type;
    },
    providerDetailsFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// providerListByLocation //////////////////
    providerListByLocationRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    providerListByLocationSuccess(state, action) {
      state.isLoading = false;
      state.providerListByLocationResponse = action.payload;
      state.status = action.type;
    },
    providerListByLocationFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// MembershipList //////////////////
    MembershipListRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    MembershipListSuccess(state, action) {
      state.isLoading = false;
      state.MembershipListResponse = action.payload;
      state.status = action.type;
    },
    MembershipListFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },
    ///////////////////// MembershipStatus //////////////////
    MembershipStatusRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    MembershipStatusSuccess(state, action) {
      state.isLoading = false;
      state.MembershipStatusResponse = action.payload;
      // Update the access gate so an expired subscription is blocked immediately
      state.isPaymentVerified =
        action.payload?.data?.is_payment_verified ?? state.isPaymentVerified;
      state.status = action.type;
    },
    MembershipStatusFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// Service List //////////////////
    serviceListRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    serviceListSuccess(state, action) {
      state.isLoading = false;
      state.serviceListResponse = action.payload;
      state.status = action.type;
    },
    serviceListFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// recentUpdateClient //////////////////
    recentUpdateClientRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    recentUpdateClientSuccess(state, action) {
      state.isLoading = false;
      state.recentUpdateClientResponse = action.payload;
      state.status = action.type;
    },
    recentUpdateClientFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// MTNPayment //////////////////
    mtnPaymentRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    mtnPaymentSuccess(state, action) {
      state.isLoading = false;
      state.mtnPaymentResponse = action.payload;
      state.status = action.type;
    },
    mtnPaymentFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// OrangePayment //////////////////
    orangePaymentRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    orangePaymentSuccess(state, action) {
      state.isLoading = false;
      state.orangePaymentResponse = action.payload;
      state.status = action.type;
    },
    orangePaymentFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// Subscription //////////////////
    SubscriptionRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    SubscriptionSuccess(state, action) {
      state.isLoading = false;
      state.SubscriptionResponse = action.payload;
      state.status = action.type;
    },
    SubscriptionFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    /////////////////////// CreatePayment  ////////////////////
    CreatePaymentRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    CreatePaymentSuccess(state, action) {
      state.isLoading = false;
      state.CreatePaymentResponse = action.payload;
      state.status = action.type;
    },
    CreatePaymentFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    /////////////////////// StripePayment  ////////////////////
    StripePaymentRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    StripePaymentSuccess(state, action) {
      state.isLoading = false;
      state.StripePaymentResponse = action.payload;
      state.status = action.type;
    },
    StripePaymentFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    /////////////////////// StripePaymentFail  ////////////////////
    StripePaymentFailRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    StripePaymentFailSuccess(state, action) {
      state.isLoading = false;
      state.StripePaymentFailResponse = action.payload;
      state.status = action.type;
    },
    StripePaymentFailFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    /////////////////////// PayCode  ////////////////////
    PayCodeRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    PayCodeSuccess(state, action) {
      state.isLoading = false;
      state.PayCodeResponse = action.payload;
      state.status = action.type;
      state.isPaymentVerified = action.payload?.data?.is_payment_verified;
    },
    PayCodeFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    /////////////////////// OrangeSub (send payment request) ////////////////////
    orangeSubRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    orangeSubSuccess(state, action) {
      state.isLoading = false;
      state.orangeSubResponse = action.payload;
      state.status = action.type;
    },
    orangeSubFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    /////////////////////// OrangeRedeem (redeem subscription code) ////////////////////
    orangeRedeemRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    orangeRedeemSuccess(state, action) {
      state.isLoading = false;
      state.orangeRedeemResponse = action.payload;
      state.status = action.type;
      state.isPaymentVerified = action.payload?.data?.is_payment_verified ?? action.payload?.data?.data?.is_payment_verified ?? state.isPaymentVerified;
    },
    orangeRedeemFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },
  },
});

export const {
  userCheckRequest,
  userCheckSuccess,
  userCheckFailure,

  getTokenRequest,
  getTokenSuccess,
  getTokenFailure,

  storeRoletype,

  storePaymentVerified,

  storeIsDiscount,

  storeProfileVerified,

  signUpRequest,
  signUpSuccess,
  signUpFailure,

  verifyEmailRequest,
  verifyEmailSuccess,
  verifyEmailFailure,

  ResendOtpRequest,
  ResendOtpSuccess,
  ResendOtpFailure,

  signinRequest,
  signinSuccess,
  signinFailure,

  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,

  verificationRequest,
  verificationSuccess,
  verificationFailure,

  verificationOtpRequest,
  verificationOtpSuccess,
  verificationOtpFailure,

  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,

  logoutRequest,
  logoutSuccess,
  logoutFailure,

  // viewCountryListRequest,
  // viewCountryListSuccess,
  // viewCountryListFailure,

  // viewStateListRequest,
  // viewStateListSuccess,
  // viewStateListFailure,

  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,

  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,

  ProfileRequest,
  ProfileSuccess,
  ProfileFailure,

  UpdateProfileRequest,
  UpdateProfileSuccess,
  UpdateProfileFailure,

  UpdateCoverPicRequest,
  UpdateCoverPicSuccess,
  UpdateCoverPicFailure,

  ProviderListRequest,
  ProviderListSuccess,
  ProviderListFailure,

  providerDetailsRequest,
  providerDetailsSuccess,
  providerDetailsFailure,

  providerListByLocationRequest,
  providerListByLocationSuccess,
  providerListByLocationFailure,

  MembershipListRequest,
  MembershipListSuccess,
  MembershipListFailure,

  MembershipStatusRequest,
  MembershipStatusSuccess,
  MembershipStatusFailure,

  serviceListRequest,
  serviceListSuccess,
  serviceListFailure,

  recentUpdateClientRequest,
  recentUpdateClientSuccess,
  recentUpdateClientFailure,

  mtnPaymentRequest,
  mtnPaymentSuccess,
  mtnPaymentFailure,

  orangePaymentRequest,
  orangePaymentSuccess,
  orangePaymentFailure,

  SubscriptionRequest,
  SubscriptionSuccess,
  SubscriptionFailure,

  CreatePaymentRequest,
  CreatePaymentSuccess,
  CreatePaymentFailure,

  StripePaymentRequest,
  StripePaymentSuccess,
  StripePaymentFailure,

  StripePaymentFailRequest,
  StripePaymentFailSuccess,
  StripePaymentFailFailure,

  PayCodeRequest,
  PayCodeSuccess,
  PayCodeFailure,

  orangeSubRequest,
  orangeSubSuccess,
  orangeSubFailure,

  orangeRedeemRequest,
  orangeRedeemSuccess,
  orangeRedeemFailure,
} = AuthSlice.actions;

export default AuthSlice.reducer;
