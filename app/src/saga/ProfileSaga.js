import AsyncStorage from '@react-native-async-storage/async-storage';
import {call, put, select, takeLatest} from 'redux-saga/effects';
import {storeRoletype} from '../redux/reducer/AuthReducer';
import {
  addBankAccountFailure,
  addBankAccountSuccess,
  bankAccountFailure,
  bankAccountSuccess,
  BankTransferFailure,
  BankTransferSuccess,
  cmsFailure,
  cmsSuccess,
  contactUsDetailsFailure,
  contactUsDetailsSuccess,
  contactUsFailure,
  contactUsSuccess,
  deleteBankAccountFailure,
  deleteBankAccountSuccess,
  deleteNotificationFailure,
  deleteNotificationSuccess,
  editProfileFailure,
  editProfileSuccess,
  notificationFailure,
  notificationStatusChangeFailure,
  notificationStatusChangeSuccess,
  notificationSuccess,
  readUnReadNotificationFailure,
  readUnReadNotificationSuccess,
  specializationListFailure,
  specializationListSuccess,
  SwitchAccountFailure,
  SwitchAccountSuccess,
  updateBankAccountFailure,
  updateBankAccountSuccess,
  userDetailsFailure,
  // deleteNotificationFailure,
  // deleteNotificationSuccess,
  userDetailsSuccess,
  // notificationFailure,
  // notificationSuccess,
  // searchStoriesFailure,
  // searchStoriesSuccess,
  viewProfileFailure,
  viewProfileSuccess,
  WithdrawPointsFailure,
  WithdrawPointsSuccess,
  deleteGalleryItemRequest,
  deleteGalleryItemSuccess,
  deleteGalleryItemFailure,
  makePrimarySuccess,
  makePrimaryFailure,
  ReferralStepsSuccess,
  ReferralStepsFailure,
  addMtnAccountSuccess,
  addMtnAccountFailure,
  mtnListSuccess,
  mtnListFailure,
  deleteMtnSuccess,
  deleteMtnFailure,
  makePrimaryMtnFailure,
  makePrimaryMtnSuccess,
} from '../redux/reducer/ProfileReducer';
import {deleteApi, getApi, postApi, putApi} from '../utils/helpers/ApiRequest';
import constants from '../utils/helpers/constants';
import showErrorAlert from '../utils/helpers/Toast';

let getItem = state => state.AuthReducer;
let token = '';

// specializationList

export function* specializationListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, 'specialization/list', header);

    if (response?.status == 200) {
      yield put(specializationListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(specializationListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(specializationListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(specializationListFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(specializationListFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(specializationListFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//userDetailsSaga
export function* userDetailsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, 'user/profile', header);

    if (response?.status == 200) {
      yield put(userDetailsSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(userDetailsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(userDetailsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(userDetailsFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(userDetailsFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(userDetailsFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//editProfileSaga
export function* editProfileSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'user/profile-update',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(editProfileSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(editProfileFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(editProfileFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(editProfileFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(editProfileFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(editProfileFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//viewProfileSaga
export function* viewProfileSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, 'user/profile', header);

    if (response?.status == 200) {
      yield put(viewProfileSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(viewProfileFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(viewProfileFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(viewProfileFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(viewProfileFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(viewProfileFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// Privacypolicy & Term&Conditions & CookiesPloicy//
export function* cmsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, 'cms/list/', header);

    if (response?.status == 200) {
      yield put(cmsSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(cmsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(cmsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(cmsFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(cmsFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(cmsFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// contactUs
export function* contactUsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(postApi, 'qms/add/', action.payload, header);

    if (response?.status == 200) {
      yield put(contactUsSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(contactUsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(contactUsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(contactUsFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(contactUsFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(contactUsFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// contactUsDetails
export function* contactUsDetailsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, 'settings/details', header);

    if (response?.status == 200) {
      yield put(contactUsDetailsSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(contactUsDetailsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(contactUsDetailsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(contactUsDetailsFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(contactUsDetailsFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(contactUsDetailsFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// NOTIFICATION
export function* notificationsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      getApi,
      `notifications/?page=${action?.payload?.page}&limit=${action?.payload?.perpage}`,
      header,
    );

    if (response?.status == 200) {
      yield put(notificationSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(notificationFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(notificationFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(notificationFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(notificationFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(notificationFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// notificationStatusChange
export function* notificationStatusChangesSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'notifications_status_change/',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(notificationStatusChangeSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(notificationStatusChangeFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(notificationStatusChangeFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(notificationStatusChangeFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(notificationStatusChangeFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(notificationStatusChangeFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// delete NOTIFICATION
export function* deleteNotificationsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'notification/delete',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(deleteNotificationSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(deleteNotificationFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(deleteNotificationFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(deleteNotificationFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(deleteNotificationFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(deleteNotificationFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// readUnRead NOTIFICATION
export function* readUnReadNotificationsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'notification/mark-all-as-read',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(readUnReadNotificationSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(readUnReadNotificationFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(readUnReadNotificationFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(readUnReadNotificationFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(readUnReadNotificationFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(readUnReadNotificationFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// getBankAccountSaga
export function* getBankAccountSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, 'bank-details/', header);

    if (response?.status == 200) {
      yield put(bankAccountSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(bankAccountFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(bankAccountFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(bankAccountFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(bankAccountFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(bankAccountFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// addBankAccountSaga
export function* addBankAccountSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(postApi, 'bank-details/', action.payload, header);

    if (response?.status == 200) {
      yield put(addBankAccountSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(addBankAccountFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(addBankAccountFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(addBankAccountFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(addBankAccountFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(addBankAccountFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// addMtnAccountSaga
export function* addMtnAccountSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(postApi, 'mtn-account/', action.payload, header);

    if (response?.status == 200) {
      yield put(addMtnAccountSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(addMtnAccountFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(addMtnAccountFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(addMtnAccountFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(addMtnAccountFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(addMtnAccountFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}
// mtnListRequest
export function* mtnListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, 'mtn-account/', header);

    if (response?.status == 200) {
      yield put(mtnListSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(mtnListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(mtnListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(mtnListFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(mtnListFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(mtnListFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// updateBankAccountSaga
export function* updateBankAccountSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      putApi,
      `bank-details/${action.payload.id}/`,
      action.payload.data,
      header,
    );

    if (response?.status == 200) {
      yield put(updateBankAccountSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(updateBankAccountFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(updateBankAccountFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(updateBankAccountFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(updateBankAccountFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(updateBankAccountFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}
// makePrimarySaga
export function* makePrimarySaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      putApi,
      `bank-primary/${action.payload.id}/`,
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(makePrimarySuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(makePrimaryFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(makePrimaryFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(makePrimaryFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(makePrimaryFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(makePrimaryFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}
// makePrimarySaga
export function* makePrimaryMtnSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      putApi,
      `mtn-primary/${action.payload.id}/`,
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(makePrimaryMtnSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(makePrimaryMtnFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(makePrimaryMtnFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(makePrimaryMtnFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(makePrimaryMtnFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(makePrimaryMtnFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// deleteBankAccountSaga
export function* deleteBankAccountSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      deleteApi,
      `bank-details/${action.payload.id}/`,
      header,
    );

    if (response?.status == 200) {
      yield put(deleteBankAccountSuccess(response?.data));
      showErrorAlert(response?.data?.data?.message);
    } else if (response?.status == 201) {
      yield put(deleteBankAccountFailure(response?.data));
      showErrorAlert(response?.data?.data?.message);
    } else {
      yield put(deleteBankAccountFailure(response?.data));
      showErrorAlert(response?.data?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(deleteBankAccountFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(deleteBankAccountFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(deleteBankAccountFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}
// deleteMtnSaga
export function* deleteMtnSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      deleteApi,
      `mtn-account/${action.payload.id}/`,
      header,
    );

    if (response?.status == 200) {
      yield put(deleteMtnSuccess(response?.data));
      showErrorAlert(response?.data?.data?.message);
    } else if (response?.status == 201) {
      yield put(deleteMtnFailure(response?.data));
      showErrorAlert(response?.data?.data?.message);
    } else {
      yield put(deleteMtnFailure(response?.data));
      showErrorAlert(response?.data?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(deleteMtnFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(deleteMtnFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(deleteMtnFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

export function* SwitchAccountSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(postApi, 'switch-role/', action.payload, header);

    if (response?.status == 200) {
      yield put(SwitchAccountSuccess(response?.data));
      console.log(response?.data?.data?.new_user_type);
      yield put(storeRoletype(response?.data?.data?.new_user_type));
      yield call(
        AsyncStorage.setItem,
        constants.roleType,
        response?.data?.data?.new_user_type,
      );
      // showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(SwitchAccountFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(SwitchAccountFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(SwitchAccountFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(SwitchAccountFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(SwitchAccountFailure(error));
      showErrorAlert(error?.response?.data?.error);
    }
  }
}

/////////////////// WithdrawPoints ////////////
export function* WithdrawPointsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'handle_withdraw/',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(WithdrawPointsSuccess(response?.data));
    } else if (response?.status == 201) {
      yield put(WithdrawPointsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(WithdrawPointsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(WithdrawPointsFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(WithdrawPointsFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(WithdrawPointsFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//////////////////////// Referral Steps //////////////
export function* ReferralStepsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, 'app-refer-content/', header);

    if (response?.status == 200) {
      yield put(ReferralStepsSuccess(response?.data));
    } else if (response?.status == 201) {
      yield put(ReferralStepsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(ReferralStepsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(ReferralStepsFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(ReferralStepsFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(ReferralStepsFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}
//////////////////////// BankTransfer //////////////
export function* BankTransferSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'stripe-bank-payout/',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(BankTransferSuccess(response?.data));
    } else if (response?.status == 201) {
      yield put(BankTransferFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(BankTransferFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(BankTransferFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(BankTransferFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(BankTransferFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// deleteGalleryItemSaga
export function* deleteGalleryItemSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      deleteApi,
      `previous-works/${action.payload.id}/`,
      header,
    );

    if (response?.status == 200) {
      yield put(deleteGalleryItemSuccess(response?.data));
      showErrorAlert(response?.data?.data?.message);
    } else if (response?.status == 201) {
      yield put(deleteGalleryItemFailure(response?.data));
      showErrorAlert(response?.data?.data?.message);
    } else {
      yield put(deleteGalleryItemFailure(response?.data));
      showErrorAlert(response?.data?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(deleteGalleryItemFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(deleteGalleryItemFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(deleteGalleryItemFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest(
      'Profile/specializationListRequest',
      specializationListSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Profile/userDetailsRequest', userDetailsSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/editProfileRequest', editProfileSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/viewProfileRequest', viewProfileSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/cmsRequest', cmsSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/contactUsRequest', contactUsSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/contactUsDetailsRequest', contactUsDetailsSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/notificationRequest', notificationsSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Profile/notificationStatusChangeRequest',
      notificationStatusChangesSaga,
    );
  })(),
  (function* () {
    yield takeLatest(
      'Profile/deleteNotificationRequest',
      deleteNotificationsSaga,
    );
  })(),
  (function* () {
    yield takeLatest(
      'Profile/readUnReadNotificationRequest',
      readUnReadNotificationsSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Profile/bankAccountRequest', getBankAccountSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/mtnListRequest', mtnListSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/addBankAccountRequest', addBankAccountSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/addMtnAccountRequest', addMtnAccountSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/updateBankAccountRequest', updateBankAccountSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/makePrimaryRequest', makePrimarySaga);
  })(),
  (function* () {
    yield takeLatest('Profile/makePrimaryMtnRequest', makePrimaryMtnSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/deleteBankAccountRequest', deleteBankAccountSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/deleteMtnRequest', deleteMtnSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/SwitchAccountRequest', SwitchAccountSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/WithdrawPointsRequest', WithdrawPointsSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/BankTransferRequest', BankTransferSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/ReferralStepsRequest', ReferralStepsSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/deleteGalleryItemRequest', deleteGalleryItemSaga);
  })(),
];

export default watchFunction;
