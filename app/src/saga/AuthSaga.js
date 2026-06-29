import AsyncStorage from '@react-native-async-storage/async-storage';
import {call, delay, put, select, takeLatest} from 'redux-saga/effects';
import {
  changePasswordFailure,
  changePasswordSuccess,
  CreatePaymentFailure,
  CreatePaymentSuccess,
  deleteUserFailure,
  deleteUserSuccess,
  forgotPasswordFailure,
  forgotPasswordSuccess,
  getTokenFailure,
  getTokenSuccess,
  logoutFailure,
  logoutSuccess,
  MembershipListFailure,
  MembershipListSuccess,
  MembershipStatusFailure,
  MembershipStatusSuccess,
  mtnPaymentFailure,
  mtnPaymentSuccess,
  orangePaymentFailure,
  orangePaymentSuccess,
  orangeRedeemFailure,
  orangeRedeemSuccess,
  orangeSubFailure,
  orangeSubSuccess,
  PayCodeFailure,
  PayCodeSuccess,
  ProfileFailure,
  ProfileSuccess,
  providerDetailsFailure,
  providerDetailsSuccess,
  providerListByLocationFailure,
  providerListByLocationSuccess,
  ProviderListFailure,
  ProviderListSuccess,
  recentUpdateClientFailure,
  recentUpdateClientSuccess,
  ResendOtpFailure,
  ResendOtpSuccess,
  resetPasswordFailure,
  resetPasswordSuccess,
  serviceListFailure,
  serviceListSuccess,
  signinFailure,
  signinSuccess,
  signUpFailure,
  signUpSuccess,
  storeIsDiscount,
  storePaymentVerified,
  storeProfileVerified,
  storeRoletype,
  StripePaymentFailFailure,
  StripePaymentFailSuccess,
  StripePaymentFailure,
  StripePaymentSuccess,
  SubscriptionFailure,
  SubscriptionSuccess,
  UpdateCoverPicFailure,
  UpdateCoverPicSuccess,
  UpdateProfileFailure,
  UpdateProfileSuccess,
  userCheckFailure,
  userCheckSuccess,
  verificationFailure,
  verificationOtpFailure,
  verificationOtpSuccess,
  verificationSuccess,
  verifyEmailFailure,
  verifyEmailSuccess,
} from '../redux/reducer/AuthReducer';
import {
  deleteApi,
  getApi,
  patchApi,
  postApi,
  putApi,
} from '../utils/helpers/ApiRequest';
import showErrorAlert from '../utils/helpers/Toast';
import constants from '../utils/helpers/constants';
import {getErrorDetails} from '../utils/helpers/errorHelper';

let getItem = state => state.AuthReducer;

//userCheck
export function* userCheckSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTempTokenResponse,
  };
  try {
    let response = yield call(getApi, 'profile/', header);

    if (response?.status == 200) {
      yield put(userCheckSuccess(response?.data));
      // console.log(response?.data?.data?.is_payment_verified);
      // yield put(
      //   storePaymentVerified(response?.data?.data?.is_payment_verified),
      // );

      // showErrorAlert(response?.data?.message);
    } else {
      yield put(userCheckFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(userCheckFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 504) {
      yield put(userCheckFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(userCheckFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//token
export function* getTokenSaga() {
  //   let item = yield select(getItem);
  try {
    const response = yield call(AsyncStorage.getItem, constants.TRUSTWORKTKN);

    if (response != null) {
      yield put(getTokenSuccess(response));
    } else {
      yield put(getTokenFailure({message: 'No saved token found', status: null}));
    }
  } catch (error) {
    const {status, message} = getErrorDetails(error);
    yield put(getTokenFailure({message, status}));
  }
}

//signup
export function* signUpSaga(action) {
  // let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    // authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'user/register/',
      action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(signUpSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(signUpFailure(response?.data));
      showErrorAlert(response?.data?.data?.message);
      console.log('error1', response?.data?.data?.message);
    }
  } catch (error) {
    const {status, message} = getErrorDetails(error);
    yield put(signUpFailure({message, status}));
    showErrorAlert(message);
  }
}

//verifyEmail
export function* verifyEmailSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(
      postApi,
      'user/resend-forgot-password-otp',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(verifyEmailSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(verifyEmailFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(verifyEmailFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 504) {
      yield put(verifyEmailFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(verifyEmailFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//ResendOtp
export function* ResendOtpSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(postApi, 'resend-otp/', action.payload, header);

    if (response?.status == 200) {
      yield put(ResendOtpSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(ResendOtpFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(ResendOtpFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 504) {
      yield put(ResendOtpFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(ResendOtpFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//signin
export function* signinSaga(action) {
  const items = yield select(getItem);

  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    // authorization: items?.token,
  };

  try {
    let response = yield call(
      postApi,
      'login/',
      action?.payload?.creds,
      header,
    );

    if (response?.status === 200) {
      const responseData = response.data?.data;
      const userData = responseData?.UserData;
      const accessToken = responseData?.accessToken;

      // 1. Persist token to AsyncStorage first
      if (accessToken) {
        yield call(AsyncStorage.setItem, constants.TRUSTWORKTKN, accessToken);
      } else {
        console.log('Access token is undefined');
      }

      // 2. Persist role type to AsyncStorage
      const roleType = userData?.user_type;
      if (roleType) {
        yield call(AsyncStorage.setItem, constants.roleType, roleType);
      }

      // 3. Persist remember-me credentials if requested
      if (action?.payload?.savePassword) {
        yield call(
          AsyncStorage.setItem,
          constants.TRUSTWORKREMBERTKN,
          JSON.stringify({
            email: action?.payload?.creds?.email ?? '',
            password: action?.payload?.creds?.password ?? '',
          }),
        );
      } else if (action?.payload?.savePassword === false) {
        yield call(AsyncStorage.removeItem, constants.TRUSTWORKREMBERTKN);
      }

      // 4. Single dispatch — signinSuccess sets isPaymentVerified, isDiscountApplied,
      //    isProfileVerified, roleType, and getTokenResponse all at once so StackNav
      //    only re-renders once with the complete, correct state.
      yield put(signinSuccess(responseData));

      if (responseData?.message) {
        showErrorAlert(responseData.message);
      }
    } else {
      yield put(signinFailure(response.data?.data));
      if (response?.data?.data?.message) {
        showErrorAlert(response?.data?.data?.message);
      }
    }
  } catch (error) {
    const {status, message} = getErrorDetails(error);
    yield put(signinFailure({message, status}));
    showErrorAlert(message);
  }
}

//forgotPassword
export function* forgotPasswordSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(postApi, 'generate-otp/', action.payload, header);

    if (response?.status == 200) {
      yield put(forgotPasswordSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(forgotPasswordFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(forgotPasswordFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 500) {
      yield put(forgotPasswordFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 504) {
      yield put(forgotPasswordFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(forgotPasswordFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//verification
export function* verificationSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(postApi, 'otp-verify/', action.payload, header);

    if (response?.status == 200) {
      yield put(verificationSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(verificationFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(verificationFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 504) {
      yield put(verificationFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(verificationFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//verificationOtp
export function* verificationOtpSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(postApi, 'otp-verify/', action.payload, header);

    if (response?.status == 200) {
      yield put(verificationOtpSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(verificationOtpFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(verificationOtpFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 500) {
      yield put(verificationOtpFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 504) {
      yield put(verificationOtpFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      console.log(error?.message);
      yield put(verificationOtpFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//resetpassword
export function* resetPasswordSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'change-password/',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(resetPasswordSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(resetPasswordFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(resetPasswordFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 504) {
      yield put(resetPasswordFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(resetPasswordFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}
//Profile
export function* ProfileSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, 'profile/', header);

    if (response?.status == 200) {
      yield put(ProfileSuccess(response?.data));
      // console.log(response?.data?.data?.is_payment_verified);
      yield put(
        storePaymentVerified(response?.data?.data?.is_payment_verified),
      );
      yield put(storeIsDiscount(response?.data?.data?.is_discount));
      yield put(storeProfileVerified(response?.data?.data?.is_profile_updated));

      // showErrorAlert(response?.data?.message);
    } else {
      yield put(ProfileFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(ProfileFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(ProfileFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(ProfileFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(ProfileFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//logout
export function* logoutSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(postApi, 'logout/', action.payload, header);
    if (response?.status == 200) {
      yield call(AsyncStorage.removeItem, constants.TRUSTWORKTKN);
      yield put(logoutSuccess(null));
      yield put(storeRoletype(''));
      showErrorAlert('Logged out successfully');
    } else {
      // Non-200 but not an exception — still force local logout
      yield call(AsyncStorage.removeItem, constants.TRUSTWORKTKN);
      yield put(logoutSuccess(null));
    }
  } catch (error) {
    // Network error or 401 — still force local logout
    yield call(AsyncStorage.removeItem, constants.TRUSTWORKTKN);
    yield put(logoutSuccess(null));
  }
}

//changePassword
export function* changePasswordSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      patchApi,
      'profile/change_password/',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(changePasswordSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(changePasswordFailure(response?.data));
      console.log(response?.data);
      showErrorAlert(response?.data?.data?.error);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(changePasswordFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 504) {
      yield put(changePasswordFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(changePasswordFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//UpdateProfile
export function* UpdateProfileSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(putApi, 'profile/', action.payload, header);

    if (response?.status == 200) {
      console.log(response);
      yield put(UpdateProfileSuccess(response?.data));
      yield put(storeProfileVerified(response?.data?.data?.is_profile_updated));

      showErrorAlert(response?.data?.message);
    } else {
      yield put(UpdateProfileFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(UpdateProfileFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(UpdateProfileFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(UpdateProfileFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(UpdateProfileFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//UpdateCoverPic
export function* UpdateCoverPicSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      patchApi,
      'profile/update-cover-image/',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(UpdateCoverPicSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(UpdateCoverPicFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    console.log(error?.response);
    if (error?.status == 502) {
      yield put(UpdateCoverPicFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(UpdateCoverPicFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 413) {
      yield put(UpdateCoverPicFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Oops! That image is too large to upload');
    } else if (error?.status == 504) {
      yield put(UpdateCoverPicFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(UpdateCoverPicFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//ProviderList
export function* ProviderListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      getApi,
      `user/provider/list?page=${action?.payload?.page}&limit=${action?.payload?.perpage}&search=${action?.payload?.keyword_search}`,
      header,
    );

    if (response?.status == 200) {
      yield put(ProviderListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(ProviderListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(ProviderListFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(ProviderListFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(ProviderListFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(ProviderListFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//providerDetails
export function* providerDetailsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      getApi,
      `profile/details/${action?.payload?.id}?latitude=${action?.payload?.lat}&longitude=${action?.payload?.long}`,
      header,
    );

    if (response?.status == 200) {
      yield put(providerDetailsSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(providerDetailsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(providerDetailsFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(providerDetailsFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(providerDetailsFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(providerDetailsFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//providerListByLocation
export function* providerListByLocationSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      getApi,
      `profile/details?latitude=${action?.payload?.lat}&longitude=${action?.payload?.long}&radius=${action?.payload?.radius}&page=${action?.payload?.page}&limit=${action?.payload?.perpage}&search=${action?.payload?.keyword_search}`,
      header,
    );

    if (response?.status == 200) {
      yield put(providerListByLocationSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(providerListByLocationFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(providerListByLocationFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(providerListByLocationFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(providerListByLocationFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(providerListByLocationFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//MembershipList
export function* MembershipListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, `membership-plans/`, header);

    if (response?.status == 200) {
      yield put(MembershipListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(MembershipListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(MembershipListFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(MembershipListFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(MembershipListFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(MembershipListFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//MembershipStatus
export function* MembershipStatusSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      `profile/payment-status/`,
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(MembershipStatusSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(MembershipStatusFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(MembershipStatusFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(MembershipStatusFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(MembershipStatusFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(MembershipStatusFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//MTNPayment
export function* MTNPaymentSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      `membership-payment/`,
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(mtnPaymentSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(mtnPaymentFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(mtnPaymentFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(mtnPaymentFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(mtnPaymentFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(mtnPaymentFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//deleteUser
export function* deleteUserSaga(action) {
  const items = yield select(getItem);

  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      deleteApi,
      `admin/${action.payload.userType}/delete/${action.payload.id}/`,
      header,
    );

    if (response?.status == 200) {
      yield call(AsyncStorage.removeItem, constants.TRUSTWORKTKN);
      yield put(deleteUserSuccess(null));
      yield put(storeRoletype(''));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(deleteUserFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(deleteUserFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(deleteUserFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(deleteUserFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(deleteUserFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//ServiceList
export function* ServiceListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      getApi,
      `category/?page=${action?.payload?.page}&limit=${action?.payload?.perpage}`,
      header,
    );

    if (response?.status == 200) {
      yield put(serviceListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(serviceListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(serviceListFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(serviceListFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(serviceListFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(serviceListFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//recentUpdateClient
export function* recentUpdateClientSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      getApi,
      `provider/view/project?status=active&page=${action?.payload?.page}&limit=${action?.payload?.perpage}&search=${action?.payload?.keyword_search}`,
      header,
    );

    if (response?.status == 200) {
      yield put(recentUpdateClientSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(recentUpdateClientFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(recentUpdateClientFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(recentUpdateClientFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(recentUpdateClientFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(recentUpdateClientFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

///////////////////// Subscription //////////////////////
export function* SubscriptionSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      postApi,
      `handle_subscription/`,
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(SubscriptionSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(SubscriptionFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(SubscriptionFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(SubscriptionFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(SubscriptionFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(SubscriptionFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

///////////////////// CreatePayment //////////////////////
export function* CreatePaymentSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      postApi,
      `api/checkout-session/`,
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(CreatePaymentSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(CreatePaymentFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(CreatePaymentFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(CreatePaymentFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(CreatePaymentFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(CreatePaymentFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

///////////////////// StripePayment //////////////////////
export function* StripePaymentSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      postApi,
      `stripe-webhook/`,
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(StripePaymentSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(StripePaymentFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(StripePaymentFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 500) {
      yield put(StripePaymentFailure({ message: error?.message, status: error?.status }));
      console.log(error?.message);
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(StripePaymentFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(StripePaymentFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(StripePaymentFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

export function* StripePaymentFailSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      putApi,
      `payment/transactions_failed/${action.payload.bid_id}`,
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(StripePaymentFailSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(StripePaymentFailFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(StripePaymentFailFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 500) {
      yield put(StripePaymentFailFailure({ message: error?.message, status: error?.status }));
      console.log(error?.message);
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(StripePaymentFailFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(StripePaymentFailFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(StripePaymentFailFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

export function* PayCodeSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      postApi,
      `check_subscription_codes/`,
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(PayCodeSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(PayCodeFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(PayCodeFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.message);
    } else if (error?.status == 500) {
      yield put(PayCodeFailure({ message: error?.message, status: error?.status }));
      console.log(error?.message);
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(PayCodeFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else if (error?.status == 504) {
      yield put(PayCodeFailure({ message: error?.message, status: error?.status }));
      showErrorAlert('Request Timed Out');
    } else {
      yield put(PayCodeFailure({ message: error?.message, status: error?.status }));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//OrangePayment (Subscription)
const SUCCESS_STATUSES = ['SUCCESS', 'SUCCESSFUL', 'SUCCEEDED'];
const PENDING_STATUSES = ['PENDING', 'INITIATED', 'PROCESSING'];
const FAILED_STATUSES = ['FAILED', 'FAIL', 'CANCELLED', 'EXPIRED'];
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 24; // 2 minutes max

export function* OrangePaymentSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(postApi, `orange/pay/`, action.payload, header);

    if (response?.status === 200 || response?.status === 201) {
      const data = response?.data;
      const paymentResponse = data?.payment_response;
      const transactionId = data?.transaction_id;

      // Extract Orange transaction fields from payment_response if present
      const orderId = paymentResponse?.orderId ?? null;
      const payToken = paymentResponse?.payToken ?? null;
      const orangeTransactionId = paymentResponse?.orangeTransactionId ?? null;
      const initialStatus = paymentResponse?.status ?? null;

      // Immediately resolve if already successful
      if (initialStatus && SUCCESS_STATUSES.includes(initialStatus?.toUpperCase())) {
        yield put(
          orangePaymentSuccess({
            ...data,
            finalStatus: 'SUCCESS',
          }),
        );
        return;
      }

      // If failed right away
      if (initialStatus && FAILED_STATUSES.includes(initialStatus?.toUpperCase())) {
        yield put(
          orangePaymentFailure({
            message: 'Payment failed or was cancelled.',
            finalStatus: initialStatus,
          }),
        );
        showErrorAlert('Payment failed or was cancelled.');
        return;
      }

      // Emit pending state so UI can show the pending screen
      yield put(
        orangePaymentSuccess({
          ...data,
          finalStatus: 'PENDING',
          orderId,
          payToken,
          orangeTransactionId,
          transactionId,
        }),
      );

      // Poll for final status
      let attempts = 0;
      while (attempts < MAX_POLL_ATTEMPTS) {
        yield delay(POLL_INTERVAL_MS);
        attempts++;

        try {
          let pollResponse = null;

          // Prefer orderId endpoint; fall back to payToken
          if (orderId) {
            pollResponse = yield call(getApi, `status/${orderId}/`, header);
          } else if (payToken) {
            pollResponse = yield call(
              getApi,
              `paymentstatus/${payToken}/`,
              header,
            );
          } else {
            // No identifiers to poll with — give up
            yield put(
              orangePaymentFailure({
                message: 'Unable to verify payment status.',
                finalStatus: 'UNKNOWN',
              }),
            );
            return;
          }

          const pollData = pollResponse?.data;
          const pollStatus = (
            pollData?.status ??
            pollData?.payment_status ??
            ''
          ).toUpperCase();

          if (SUCCESS_STATUSES.includes(pollStatus)) {
            yield put(
              orangePaymentSuccess({
                ...pollData,
                finalStatus: 'SUCCESS',
                orderId,
                payToken,
                orangeTransactionId,
                transactionId,
              }),
            );
            return;
          }

          if (FAILED_STATUSES.includes(pollStatus)) {
            yield put(
              orangePaymentFailure({
                message: 'Payment failed or was cancelled.',
                finalStatus: pollStatus,
              }),
            );
            showErrorAlert('Payment failed or was cancelled.');
            return;
          }

          // Still PENDING — continue polling
        } catch (pollError) {
          // Network hiccup during poll — keep trying
          console.warn('Orange pay poll error:', pollError);
        }
      }

      // Timed out
      yield put(
        orangePaymentFailure({
          message: 'Payment verification timed out. Please check your account.',
          finalStatus: 'TIMEOUT',
        }),
      );
      showErrorAlert(
        'Payment verification timed out. Please check your account.',
      );
    } else {
      yield put(orangePaymentFailure(response?.data));
      showErrorAlert(response?.data?.message ?? 'Orange payment failed.');
    }
  } catch (error) {
    const {message} = getErrorDetails(error);
    yield put(orangePaymentFailure({message}));
    showErrorAlert(message);
  }
}

///////////////////// OrangeSub — send Orange subscription payment request //////////////////////
export function* OrangeSubSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      postApi,
      `send_orange_subscription_request/`,
      action.payload,
      header,
    );

    if (response?.status === 200 || response?.status === 201) {
      const data = response?.data?.data ?? response?.data;
      yield put(orangeSubSuccess(data));
    } else {
      const errData = response?.data?.data ?? response?.data;
      yield put(orangeSubFailure(errData));
      showErrorAlert(resolveOrangeErrorMessage(errData));
    }
  } catch (error) {
    // Parse the Orange-specific error out of the 400 response body
    const errBody = error?.response?.data;
    const userMessage = resolveOrangeErrorMessage(errBody);
    yield put(orangeSubFailure({message: userMessage}));
    showErrorAlert(userMessage);
  }
}

/**
 * Extracts a user-friendly message from the Orange subscription error response.
 * The backend wraps the raw Orange API JSON string inside data.orange_response.detail.
 */
function resolveOrangeErrorMessage(errBody) {
  try {
    const orangeResponse = errBody?.data?.orange_response;
    if (orangeResponse?.detail) {
      const detail =
        typeof orangeResponse.detail === 'string'
          ? JSON.parse(orangeResponse.detail)
          : orangeResponse.detail;

      const inittxnstatus = String(detail?.data?.inittxnstatus ?? detail?.inittxnstatus ?? '');

      const STATUS_MESSAGES = {
        '60019': 'Insufficient balance on your Orange Money account. Please top up and try again.',
        '60021': 'Your Orange Money account is not active. Please contact Orange support.',
        '60022': 'Transaction limit exceeded on your Orange Money account.',
        '60026': 'Orange Money service is temporarily unavailable. Please try again in a few minutes.',
        '60031': 'Invalid Orange Money phone number. Please check and try again.',
        '60032': 'Orange Money service is not available for this number.',
        '60033': 'Your Orange Money account is blocked. Please contact Orange support.',
        '60034': 'Daily transaction limit reached on your Orange Money account.',
        '60035': 'Monthly transaction limit reached on your Orange Money account.',
      };

      if (inittxnstatus && STATUS_MESSAGES[inittxnstatus]) {
        return STATUS_MESSAGES[inittxnstatus];
      }

      // Unknown code — show the raw inittxnmessage if available
      const rawMsg =
        detail?.data?.inittxnmessage ??
        detail?.inittxnmessage ??
        '';
      if (rawMsg) {
        return `Orange Money error (${inittxnstatus || 'unknown'}): ${rawMsg}`;
      }
    }

    // Fall back to backend message
    return (
      errBody?.data?.message ??
      errBody?.message ??
      'Unable to send Orange Money payment request. Please check your details and try again.'
    );
  } catch (_) {
    return 'Unable to send Orange Money payment request. Please check your details and try again.';
  }
}

///////////////////// OrangeRedeem — redeem Orange subscription code //////////////////////
export function* OrangeRedeemSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      postApi,
      `check_orange_subscription_codes/`,
      action.payload,
      header,
    );

    if (response?.status === 200 || response?.status === 201) {
      const data = response?.data?.data ?? response?.data;
      yield put(orangeRedeemSuccess(data));
      // Refresh user profile after successful redemption
      yield put({type: 'Auth/ProfileRequest'});
    } else {
      const errData = response?.data?.data ?? response?.data;
      yield put(orangeRedeemFailure(errData));
      showErrorAlert(
        errData?.message ??
          'Invalid or already used subscription code. Please check the code and try again.',
      );
    }
  } catch (error) {
    const {message} = getErrorDetails(error);
    yield put(orangeRedeemFailure({message}));
    showErrorAlert(
      message ??
        'Invalid or already used subscription code. Please check the code and try again.',
    );
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Auth/getTokenRequest', getTokenSaga);
  })(),  (function* () {
    yield takeLatest('Auth/signUpRequest', signUpSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/verifyEmailRequest', verifyEmailSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/ResendOtpRequest', ResendOtpSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/signinRequest', signinSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/forgotPasswordRequest', forgotPasswordSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/verificationRequest', verificationSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/verificationOtpRequest', verificationOtpSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/resetPasswordRequest', resetPasswordSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/ProfileRequest', ProfileSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/UpdateProfileRequest', UpdateProfileSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/UpdateCoverPicRequest', UpdateCoverPicSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/deleteUserRequest', deleteUserSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/logoutRequest', logoutSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/changePasswordRequest', changePasswordSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/ProviderListRequest', ProviderListSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/providerDetailsRequest', providerDetailsSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Auth/providerListByLocationRequest',
      providerListByLocationSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Auth/MembershipListRequest', MembershipListSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/MembershipStatusRequest', MembershipStatusSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/mtnPaymentRequest', MTNPaymentSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/serviceListRequest', ServiceListSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/recentUpdateClientRequest', recentUpdateClientSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/SubscriptionRequest', SubscriptionSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/CreatePaymentRequest', CreatePaymentSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/StripePaymentRequest', StripePaymentSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/StripePaymentFailRequest', StripePaymentFailSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/PayCodeRequest', PayCodeSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/orangePaymentRequest', OrangePaymentSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/orangeSubRequest', OrangeSubSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/orangeRedeemRequest', OrangeRedeemSaga);
  })(),
];
export default watchFunction;
