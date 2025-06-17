import AsyncStorage from '@react-native-async-storage/async-storage';
import {call, put, select, takeLatest} from 'redux-saga/effects';
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
      yield put(userCheckFailure(error));
      showErrorAlert(error?.message);
    } else {
      yield put(userCheckFailure(error));
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
      yield put(getTokenFailure(error));
    }
  } catch (error) {
    yield put(getTokenFailure(error));
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
    if (error?.status == 502) {
      yield put(signUpFailure(error));
      showErrorAlert(error?.message);
    } else {
      yield put(signUpFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
      console.log('error2', error);
      // showErrorAlert(error?.response?.data?.data?.email?.[0]);
    }
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
      yield put(verifyEmailFailure(error));
      showErrorAlert(error?.message);
    } else {
      yield put(verifyEmailFailure(error));
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
      showErrorAlert(response?.data?.message);
    } else {
      yield put(ResendOtpFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(ResendOtpFailure(error));
      showErrorAlert(error?.message);
    } else {
      yield put(ResendOtpFailure(error));
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
      yield put(signinSuccess(response.data?.data));

      yield put(
        storePaymentVerified(
          response?.data?.data?.UserData?.is_payment_verified,
        ),
      );
      yield put(storeIsDiscount(response?.data?.data?.UserData?.is_discount));
      yield put(
        storeProfileVerified(
          response?.data?.data?.UserData?.is_profile_updated,
        ),
      );
      const accessToken = response?.data?.data?.accessToken;

      if (accessToken) {
        yield call(AsyncStorage.setItem, constants.TRUSTWORKTKN, accessToken);
        yield put(getTokenSuccess(accessToken));
      } else {
        console.log('Access token is undefined');
      }

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

      const roleType = response?.data?.data?.UserData?.user_type;
      if (roleType) {
        yield put(storeRoletype(response?.data?.data?.UserData?.user_type));
        yield call(AsyncStorage.setItem, constants.roleType, roleType);
      }

      showErrorAlert(response?.data?.data?.message);
    } else {
      yield put(signinFailure(response.data?.data));
      showErrorAlert(response?.data?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(signinFailure(error));
      showErrorAlert(error?.message);
    } else {
      yield put(signinFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
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
      yield put(forgotPasswordFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 500) {
      yield put(forgotPasswordFailure(error));
      showErrorAlert(error?.message);
    } else {
      yield put(forgotPasswordFailure(error));
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
      yield put(verificationFailure(error));
      showErrorAlert(error?.message);
    } else {
      yield put(verificationFailure(error));
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
      yield put(verificationOtpFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 500) {
      yield put(verificationOtpFailure(error));
      showErrorAlert(error?.message);
    } else {
      console.log(error?.message);
      yield put(verificationOtpFailure(error));
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
      yield put(resetPasswordFailure(error));
      showErrorAlert(error?.message);
    } else {
      yield put(resetPasswordFailure(error));
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
      console.log('try part', error);
      yield put(ProfileFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('catch part', error?.response?.data?.data?.detail);
    if (error?.status == 502) {
      yield put(ProfileFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(ProfileFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(ProfileFailure(error));
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
      // yield put(getTokenSuccess(null));
      // yield put(viewProfileSuccess(null));
      yield put(logoutSuccess(null));
      yield put(storeRoletype(''));
      showErrorAlert('Logged out successfully');
    } else {
      yield put(logoutFailure(error));
      yield call(AsyncStorage.removeItem, constants.TRUSTWORKTKN);
      yield put(logoutSuccess(null));
      // showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(logoutFailure(error));
    yield call(AsyncStorage.removeItem, constants.TRUSTWORKTKN);
    yield put(logoutSuccess(null));
    // showErrorAlert(error?.response?.data?.data?.error);
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
      yield put(changePasswordFailure(error));
      showErrorAlert(error?.message);
    } else {
      yield put(changePasswordFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//UpdateProfile
export function* UpdateProfileSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
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
      yield put(UpdateProfileFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(UpdateProfileFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(UpdateProfileFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//UpdateCoverPic
export function* UpdateCoverPicSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
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
    if (error?.status == 502) {
      yield put(UpdateCoverPicFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(UpdateCoverPicFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(UpdateCoverPicFailure(error));
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
      `admin/provider/list?page=${action?.payload?.page}&limit=${action?.payload?.perpage}&search=${action?.payload?.keyword_search}`,
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
      yield put(ProviderListFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(ProviderListFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(ProviderListFailure(error));
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
      yield put(providerDetailsFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(providerDetailsFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(providerDetailsFailure(error));
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
      yield put(providerListByLocationFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(providerListByLocationFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(providerListByLocationFailure(error));
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
      yield put(MembershipListFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(MembershipListFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(MembershipListFailure(error));
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
      yield put(MembershipStatusFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(MembershipStatusFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(MembershipStatusFailure(error));
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
      yield put(mtnPaymentFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(mtnPaymentFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(mtnPaymentFailure(error));
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
      yield put(getTokenSuccess(null));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(deleteUserFailure(error));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(deleteUserFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(deleteUserFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(deleteUserFailure(error));
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
      yield put(serviceListFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(serviceListFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(serviceListFailure(error));
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
      `provider/view/project?status=active?page=${action?.payload?.page}&limit=${action?.payload?.perpage}&search=${action?.payload?.keyword_search}`,
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
      yield put(recentUpdateClientFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(recentUpdateClientFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(recentUpdateClientFailure(error));
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
      yield put(SubscriptionFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(SubscriptionFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(SubscriptionFailure(error));
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
      yield put(CreatePaymentFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(CreatePaymentFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(CreatePaymentFailure(error));
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
      yield put(StripePaymentFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 500) {
      yield put(StripePaymentFailure(error));
      console.log(error?.message);
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(StripePaymentFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(StripePaymentFailure(error));
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
      yield put(StripePaymentFailFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 500) {
      yield put(StripePaymentFailFailure(error));
      console.log(error?.message);
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(StripePaymentFailFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(StripePaymentFailFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Auth/userCheckRequest', userCheckSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/getTokenRequest', getTokenSaga);
  })(),
  (function* () {
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
];
export default watchFunction;
