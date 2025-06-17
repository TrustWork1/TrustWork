import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
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
  SubscriptionResponse: {},
  CreatePaymentResponse: {},
  StripePaymentResponse: {},
  StripePaymentFailResponse: {},
};

const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    userCheckRequest(state, action) {
      state.status = action.type;
    },
    userCheckSuccess(state, action) {
      state.userCheckResponse = action.payload;
      state.setupProfileResponse = action.payload?.data?.setup_profile;
      state.roleType = action.payload?.data?.roletype;
      state.getTokenResponse = state.getTempTokenResponse;
      state.getTempTokenResponse = null;
      state.status = action.type;
    },
    userCheckFailure(state, action) {
      state.getTempTokenResponse = null;
      state.getTokenResponse = null;
      state.error = action.error;
      state.status = action.type;
    },

    //TOKEN
    getTokenRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    getTokenSuccess(state, action) {
      state.isLoading = false;
      state.getTokenResponse = action.payload;
      state.status = action.type;
    },
    getTokenFailure(state, action) {
      state.isLoading = false;
      state.error = action.error;
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
      state.status = action.type;
    },
    signUpSuccess(state, action) {
      state.signUpResponse = action.payload;
      state.status = action.type;
    },
    signUpFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //verifyEmail
    verifyEmailRequest(state, action) {
      state.status = action.type;
    },
    verifyEmailSuccess(state, action) {
      state.verifyEmailResponse = action.payload;
      state.status = action.type;
    },
    verifyEmailFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //ResendOtp
    ResendOtpRequest(state, action) {
      state.status = action.type;
    },
    ResendOtpSuccess(state, action) {
      state.ResendOtpResponse = action.payload;
      state.status = action.type;
    },
    ResendOtpFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //signin
    signinRequest(state, action) {
      state.status = action.type;
    },
    signinSuccess(state, action) {
      state.signinResponse = action.payload;
      state.setupProfileResponse = action.payload?.data?.setup_profile;
      state.roleType = action.payload?.data?.roletype;
      state.isPaymentVerified = action.payload?.data?.is_payment_verified;
      state.isDiscountApplied = action.payload?.data?.is_discount;
      state.getTokenResponse = action.payload?.token;
      state.status = action.type;
    },
    signinFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //forgotPassword
    forgotPasswordRequest(state, action) {
      state.status = action.type;
    },
    forgotPasswordSuccess(state, action) {
      state.forgotPasswordResponse = action.payload;
      state.status = action.type;
    },
    forgotPasswordFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //verification
    verificationRequest(state, action) {
      state.status = action.type;
    },
    verificationSuccess(state, action) {
      state.verificationResponse = action.payload;
      state.status = action.type;
    },
    verificationFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //verificationOtp
    verificationOtpRequest(state, action) {
      state.status = action.type;
    },
    verificationOtpSuccess(state, action) {
      state.verificationOtpResponse = action.payload;
      state.status = action.type;
    },
    verificationOtpFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //resetPassword
    resetPasswordRequest(state, action) {
      state.status = action.type;
    },
    resetPasswordSuccess(state, action) {
      state.resetPasswordResponse = action.payload;
      state.status = action.type;
    },
    resetPasswordFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //logout
    logoutRequest(state, action) {
      state.status = action.type;
    },
    logoutSuccess(state, action) {
      state.logoutResponse = action.payload;
      state.getTokenResponse = null;
      state.roleType = '';
      state.status = action.type;
    },
    logoutFailure(state, action) {
      state.error = action.error;
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
      state.status = action.type;
    },
    deleteUserSuccess(state, action) {
      state.deleteUserResponse = action.payload;
      state.getTokenResponse = null;
      state.roleType = '';
      state.status = action.type;
    },
    deleteUserFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //changePassword
    changePasswordRequest(state, action) {
      state.status = action.type;
    },
    changePasswordSuccess(state, action) {
      state.changePasswordResponse = action.payload;
      state.status = action.type;
    },
    changePasswordFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //Profile
    ProfileRequest(state, action) {
      state.status = action.type;
    },
    ProfileSuccess(state, action) {
      state.ProfileResponse = action.payload;
      state.status = action.type;
    },
    ProfileFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    ///////////////////// update Profile //////////////////
    UpdateProfileRequest(state, action) {
      state.status = action.type;
    },
    UpdateProfileSuccess(state, action) {
      state.UpdateProfileResponse = action.payload;
      state.status = action.type;
    },
    UpdateProfileFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    ///////////////////// update Profile //////////////////
    UpdateCoverPicRequest(state, action) {
      state.status = action.type;
    },
    UpdateCoverPicSuccess(state, action) {
      state.UpdateCoverPicResponse = action.payload;
      state.status = action.type;
    },
    UpdateCoverPicFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    ///////////////////// ProviderList //////////////////
    ProviderListRequest(state, action) {
      state.status = action.type;
    },
    ProviderListSuccess(state, action) {
      state.ProviderListResponse = action.payload;
      state.status = action.type;
    },
    ProviderListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    ///////////////////// providerDetails //////////////////
    providerDetailsRequest(state, action) {
      state.status = action.type;
    },
    providerDetailsSuccess(state, action) {
      state.providerDetailsResponse = action.payload;
      state.status = action.type;
    },
    providerDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    ///////////////////// providerListByLocation //////////////////
    providerListByLocationRequest(state, action) {
      state.status = action.type;
    },
    providerListByLocationSuccess(state, action) {
      state.providerListByLocationResponse = action.payload;
      state.status = action.type;
    },
    providerListByLocationFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    ///////////////////// MembershipList //////////////////
    MembershipListRequest(state, action) {
      state.status = action.type;
    },
    MembershipListSuccess(state, action) {
      state.MembershipListResponse = action.payload;
      state.status = action.type;
    },
    MembershipListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    ///////////////////// MembershipStatus //////////////////
    MembershipStatusRequest(state, action) {
      state.status = action.type;
    },
    MembershipStatusSuccess(state, action) {
      state.MembershipStatusResponse = action.payload;
      state.status = action.type;
    },
    MembershipStatusFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    ///////////////////// Service List //////////////////
    serviceListRequest(state, action) {
      state.status = action.type;
    },
    serviceListSuccess(state, action) {
      state.serviceListResponse = action.payload;
      state.status = action.type;
    },
    serviceListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    ///////////////////// recentUpdateClient //////////////////
    recentUpdateClientRequest(state, action) {
      state.status = action.type;
    },
    recentUpdateClientSuccess(state, action) {
      state.recentUpdateClientResponse = action.payload;
      state.status = action.type;
    },
    recentUpdateClientFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    ///////////////////// MTNPayment //////////////////
    mtnPaymentRequest(state, action) {
      state.status = action.type;
    },
    mtnPaymentSuccess(state, action) {
      state.mtnPaymentResponse = action.payload;
      state.status = action.type;
    },
    mtnPaymentFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    ///////////////////// Subscription //////////////////
    SubscriptionRequest(state, action) {
      state.status = action.type;
    },
    SubscriptionSuccess(state, action) {
      state.SubscriptionResponse = action.payload;
      state.status = action.type;
    },
    SubscriptionFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    /////////////////////// CreatePayment  ////////////////////
    CreatePaymentRequest(state, action) {
      state.status = action.type;
    },
    CreatePaymentSuccess(state, action) {
      state.CreatePaymentResponse = action.payload;
      state.status = action.type;
    },
    CreatePaymentFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    /////////////////////// StripePayment  ////////////////////
    StripePaymentRequest(state, action) {
      state.status = action.type;
    },
    StripePaymentSuccess(state, action) {
      state.StripePaymentResponse = action.payload;
      state.status = action.type;
    },
    StripePaymentFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    /////////////////////// StripePaymentFail  ////////////////////
    StripePaymentFailRequest(state, action) {
      state.status = action.type;
    },
    StripePaymentFailSuccess(state, action) {
      state.StripePaymentFailResponse = action.payload;
      state.status = action.type;
    },
    StripePaymentFailFailure(state, action) {
      state.error = action.error;
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
} = AuthSlice.actions;

export default AuthSlice.reducer;
