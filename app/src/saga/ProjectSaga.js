import {call, put, select, takeLatest} from 'redux-saga/effects';
import {
  bidListFailure,
  bidListSuccess,
  bidStatusFailure,
  bidStatusSuccess,
  cancelBidFailure,
  cancelBidSuccess,
  clientActiveProjectFailure,
  clientActiveProjectSuccess,
  CreateProjectFailure,
  CreateProjectSuccess,
  EditProjectFailure,
  EditProjectSuccess,
  getFeedBackFailure,
  getFeedBackSuccess,
  getOveralReviewFailure,
  getOveralReviewSuccess,
  JobCategoryFailure,
  JobCategoryProviderFailure,
  JobCategoryProviderSuccess,
  JobCategorySuccess,
  markAsCompletedSuccess,
  PaymentHistoryFailure,
  PaymentHistorySuccess,
  paymentReqFailure,
  paymentReqSuccess,
  PendingPaymentFailure,
  PendingPaymentSuccess,
  ProActiveProjectFailure,
  ProActiveProjectSuccess,
  ProjectBidsFailure,
  ProjectBidsSuccess,
  projectDetailsByLocationFailure,
  projectDetailsByLocationSuccess,
  projectDetailsFailure,
  projectDetailsSuccess,
  projectListByLocationFailure,
  projectListByLocationSuccess,
  projectListFailure,
  projectListSuccess,
  ProviderOfferFailure,
  ProviderOfferListFailure,
  ProviderOfferListSuccess,
  ProviderOfferSuccess,
  ProviderPaymentListFailure,
  ProviderPaymentListSuccess,
  ProviderProjectListFailure,
  ProviderProjectListSuccess,
  RejectBidFailure,
  RejectBidSuccess,
  SendBidFailure,
  SendBidSuccess,
  sendFeedBackFailure,
  sendFeedBackProviderFailure,
  sendFeedBackProviderSuccess,
  sendFeedBackSuccess,
  UploadImagesFailure,
  UploadImagesSuccess,
} from '../redux/reducer/ProjectReducer';
import {deleteApi, getApi, postApi, putApi} from '../utils/helpers/ApiRequest';
import showErrorAlert from '../utils/helpers/Toast';

let getItem = state => state.AuthReducer;
let token = '';

//projectListSaga
export function* projectListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      getApi,
      `mobile/project/add/?status=${action.payload?.status}&&page=${action?.payload?.page}&limit=${action?.payload?.perpage}&search=${action?.payload?.keyword_search}`,
      header,
    );

    if (response?.status == 200) {
      yield put(projectListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(projectListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(projectListFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(projectListFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(projectListFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

///////////////// clientActiveProject //////////////////
export function* clientActiveProjectSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      getApi,
      `mobile/project/view/list?page=${action?.payload?.page}&limit=${action?.payload?.perpage}&search=${action?.payload?.keyword_search}`,
      // `mobile/project/add/?status=${action.payload?.status}&&page=${action?.payload?.page}&limit=${action?.payload?.perpage}&search=${action?.payload?.keyword_search}`,
      header,
    );

    if (response?.status == 200) {
      yield put(clientActiveProjectSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(clientActiveProjectFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(clientActiveProjectFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(clientActiveProjectFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(clientActiveProjectFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

//ProviderProjectListSaga
export function* ProviderProjectListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      getApi,
      `service-providers/projects/?status=${action?.payload?.status}&page=${action?.payload?.page}&limit=${action?.payload?.perpage}&search=${action?.payload?.keyword_search}`,
      header,
    );

    if (response?.status == 200) {
      yield put(ProviderProjectListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(ProviderProjectListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(ProviderProjectListFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(ProviderProjectListFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(ProviderProjectListFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

//ProviderOfferListSaga
export function* ProviderOfferListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      getApi,
      `provider/myoffers/?page=${action?.payload?.page}&limit=${action?.payload?.limit}`,
      header,
    );
    console.log(response);
    if (response?.status == 200) {
      yield put(ProviderOfferListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(ProviderOfferListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(ProviderOfferListFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(ProviderOfferListFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(ProviderOfferListFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

//projectDetailsSaga
export function* projectDetailsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      getApi,
      `project/details/${action.payload}`,
      header,
    );

    if (response?.status == 200) {
      yield put(projectDetailsSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(projectDetailsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(projectDetailsFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(projectDetailsFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(projectDetailsFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

//CreateProject
export function* CreateProjectSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      postApi,
      'mobile/project/add/',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(CreateProjectSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(CreateProjectFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(CreateProjectFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(CreateProjectFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(CreateProjectFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

//ProviderOffe
export function* ProviderOfferSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      postApi,
      'direct-offer/client/',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(ProviderOfferSuccess(response?.data));
      showErrorAlert(response?.data?.data?.message);
    } else {
      yield put(ProviderOfferFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(ProviderOfferFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(ProviderOfferFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(ProviderOfferFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

//EditProject
export function* EditProjectSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      putApi,
      `project/edit/${action.payload.id}/`,
      action.payload.data,
      header,
    );

    if (response?.status == 200) {
      yield put(EditProjectSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(EditProjectFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(EditProjectFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(EditProjectFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(EditProjectFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

//ProActiveProject
export function* ProActiveProjectSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      getApi,
      `projects/service-providers/?page=${action?.payload?.page}&limit=${action?.payload?.perpage}&search=${action?.payload?.keyword_search}`,
      header,
    );

    if (response?.status == 200) {
      yield put(ProActiveProjectSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(ProActiveProjectFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(ProActiveProjectFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(ProActiveProjectFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(ProActiveProjectFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

//JobCategory
export function* JobCategorySaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  // pre->  job_category/list/
  //now->  api/categories/?user_type=provider&provider_id=2
  try {
    let response = yield call(
      getApi,
      `job_category/list/?user_type=provider&provider_id=${''}`,
      header,
    );

    if (response?.status == 200) {
      yield put(JobCategorySuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(JobCategoryFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(JobCategoryFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(JobCategoryFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(JobCategoryFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

//JobCategoryProvider
export function* JobCategoryProviderSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  // pre->  job_category/list/
  //now->  api/categories/?user_type=provider&provider_id=2
  try {
    let response = yield call(
      getApi,
      `job_category/list/?user_type=provider&provider_id=${action.payload.data}`,
      header,
    );

    if (response?.status == 200) {
      yield put(JobCategoryProviderSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(JobCategoryProviderFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(JobCategoryProviderFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(JobCategoryProviderFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(JobCategoryProviderFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

//SendBid
export function* SendBidSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      postApi,
      'mobile/bid/add/',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(SendBidSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(SendBidFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(SendBidFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 400) {
      yield put(SendBidFailure(error));
      showErrorAlert(error?.response?.data?.data?.data?.detail);
    } else {
      yield put(SendBidFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

//ProjectBids
export function* ProjectBidsSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(getApi, `project/bid/${action.payload}`, header);

    if (response?.status == 200) {
      yield put(ProjectBidsSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(ProjectBidsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(ProjectBidsFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(ProjectBidsFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(ProjectBidsFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

//bidStatus
export function* bidStatusSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      putApi,
      `project/bids/${action.payload.bid_id}/`,
      action.payload.data,
      header,
    );

    if (response?.status == 200) {
      yield put(bidStatusSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(bidStatusFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(bidStatusFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(bidStatusFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(bidStatusFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

//bidList
export function* bidListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };

  try {
    let response = yield call(
      getApi,
      `bid/filtered/?status=${action?.payload?.status}`,
      // `bid/filtered/?status=${action?.payload?.status}/?page=${action?.payload?.page}&limit=${action?.payload?.limit}`,
      header,
    );

    if (response?.status == 200) {
      yield put(bidListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(bidListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(bidListFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(bidListFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(bidListFailure(error));
      showErrorAlert(error?.message);
    }
  }
}

// markAsCompleted
export function* markAsCompletedSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      putApi,
      `project/status/change/${action.payload.id}/`,
      action.payload.data,
      header,
    );

    if (response?.status == 200) {
      yield put(markAsCompletedSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(markAsCompletedFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(markAsCompletedFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(markAsCompletedFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(markAsCompletedFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// sendFeedBack
export function* sendFeedBackSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      `projects/${action.payload.id}/feedback/`,
      action.payload.data,
      header,
    );

    if (response?.status == 200) {
      yield put(sendFeedBackSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(sendFeedBackFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(sendFeedBackFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(sendFeedBackFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(sendFeedBackFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// sendFeedBackProvider
export function* sendFeedBackProviderSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      `feedback/${action.payload.id}/`,
      action.payload.data,
      header,
    );

    if (response?.status == 200) {
      yield put(sendFeedBackProviderSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(sendFeedBackProviderFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(sendFeedBackProviderFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(sendFeedBackProviderFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(sendFeedBackProviderFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

// getFeedBack
export function* getFeedBackSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      getApi,
      `feedback/${action.payload.id}/`,
      // action.payload.data,
      header,
    );

    if (response?.status == 200) {
      yield put(getFeedBackSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(getFeedBackFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(getFeedBackFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(getFeedBackFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(getFeedBackFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//projectListByLocation
export function* projectListByLocationSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      getApi,
      `project/view/?latitude=${action?.payload?.lat}&longitude=${action?.payload?.long}&radius=${action?.payload?.radius}&page=${action?.payload?.page}&limit=${action?.payload?.perpage}&search=${action?.payload?.keyword_search}`,
      header,
    );

    if (response?.status == 200) {
      yield put(projectListByLocationSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(projectListByLocationFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(projectListByLocationFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(projectListByLocationFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(projectListByLocationFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//projectListByLocation
export function* projectDetailsByLocationSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      getApi,
      `project/view/${action?.payload?.id}?latitude=${action?.payload?.lat}&longitude=${action?.payload?.long}&radius=${action?.payload?.radius}`,
      header,
    );

    if (response?.status == 200) {
      yield put(projectDetailsByLocationSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(projectDetailsByLocationFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(projectDetailsByLocationFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(projectDetailsByLocationFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(projectDetailsByLocationFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//projectListByLocation
export function* overalReviewSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      getApi,
      `provider/${action?.payload?.provider_id}/service/${action?.payload?.job_category_id}/`,
      header,
    );

    if (response?.status == 200) {
      yield put(getOveralReviewSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(getOveralReviewFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(getOveralReviewFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(getOveralReviewFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(getOveralReviewFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//cancelBid
export function* cancelBidSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      deleteApi,
      `bid/delete/${action.payload}/`,
      header,
    );
    if (response?.status == 200) {
      yield put(cancelBidSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(cancelBidFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(cancelBidFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(cancelBidFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(cancelBidFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//PendingPayment
export function* PendingPaymentSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      getApi,
      `membership-payment-pending/list/?search=pending&page=${action?.payload?.page}&limit=${action?.payload?.limit}`,
      header,
    );

    if (response?.status == 200) {
      yield put(PendingPaymentSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(PendingPaymentFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(PendingPaymentFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(PendingPaymentFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(PendingPaymentFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//PaymentHistory
export function* PaymentHistorySaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      getApi,
      `membership-payment-pending/list/?search=completed&page=${action?.payload?.page}&limit=${action?.payload?.limit}`,
      header,
    );

    if (response?.status == 200) {
      yield put(PaymentHistorySuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(PaymentHistoryFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(PaymentHistoryFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(PaymentHistoryFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(PaymentHistoryFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

//ProviderPaymentList
export function* ProviderPaymentListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      getApi,
      `service-provider/payment-history/?page=${action?.payload?.page}&limit=${action?.payload?.limit}&search=${action?.payload?.keyword_search}`,
      header,
    );

    if (response?.status == 200) {
      yield put(ProviderPaymentListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else {
      yield put(ProviderPaymentListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(ProviderPaymentListFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(ProviderPaymentListFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(ProviderPaymentListFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

////////////////// UploadImages ///////////
export function* UploadImagesSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      `previous-works/`,
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(UploadImagesSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(UploadImagesFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(UploadImagesFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(UploadImagesFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(UploadImagesFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

////////////////// paymentReqRequest ///////////
export function* paymentReqSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      `send-payment-request/`,
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(paymentReqSuccess(response?.data));
      showErrorAlert(response?.data?.data?.message);
    } else {
      yield put(paymentReqFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(paymentReqFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(paymentReqFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(paymentReqFailure(error));
      showErrorAlert(error?.response?.data?.data?.error);
    }
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Project/projectListRequest', projectListSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Project/clientActiveProjectRequest',
      clientActiveProjectSaga,
    );
  })(),
  (function* () {
    yield takeLatest(
      'Project/ProviderProjectListRequest',
      ProviderProjectListSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Project/ProviderOfferListRequest', ProviderOfferListSaga);
  })(),
  (function* () {
    yield takeLatest('Project/projectDetailsRequest', projectDetailsSaga);
  })(),
  (function* () {
    yield takeLatest('Project/CreateProjectRequest', CreateProjectSaga);
  })(),
  (function* () {
    yield takeLatest('Project/ProviderOfferRequest', ProviderOfferSaga);
  })(),
  (function* () {
    yield takeLatest('Project/EditProjectRequest', EditProjectSaga);
  })(),
  (function* () {
    yield takeLatest('Project/JobCategoryRequest', JobCategorySaga);
  })(),
  (function* () {
    yield takeLatest(
      'Project/JobCategoryProviderRequest',
      JobCategoryProviderSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Project/ProActiveProjectRequest', ProActiveProjectSaga);
  })(),
  (function* () {
    yield takeLatest('Project/SendBidRequest', SendBidSaga);
  })(),
  (function* () {
    yield takeLatest('Project/ProjectBidsRequest', ProjectBidsSaga);
  })(),
  (function* () {
    yield takeLatest('Project/bidStatusRequest', bidStatusSaga);
  })(),
  (function* () {
    yield takeLatest('Project/bidListRequest', bidListSaga);
  })(),
  (function* () {
    yield takeLatest('Project/markAsCompletedRequest', markAsCompletedSaga);
  })(),
  (function* () {
    yield takeLatest('Project/sendFeedBackRequest', sendFeedBackSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Project/sendFeedBackProviderRequest',
      sendFeedBackProviderSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Project/getFeedBackRequest', getFeedBackSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Project/projectListByLocationRequest',
      projectListByLocationSaga,
    );
  })(),
  (function* () {
    yield takeLatest(
      'Project/projectDetailsByLocationRequest',
      projectDetailsByLocationSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Project/getOveralReviewRequest', overalReviewSaga);
  })(),
  (function* () {
    yield takeLatest('Project/cancelBidRequest', cancelBidSaga);
  })(),
  (function* () {
    yield takeLatest('Project/PendingPaymentRequest', PendingPaymentSaga);
  })(),
  (function* () {
    yield takeLatest('Project/PaymentHistoryRequest', PaymentHistorySaga);
  })(),
  (function* () {
    yield takeLatest(
      'Project/ProviderPaymentListRequest',
      ProviderPaymentListSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Project/UploadImagesRequest', UploadImagesSaga);
  })(),
  (function* () {
    yield takeLatest('Project/paymentReqRequest', paymentReqSaga);
  })(),
];

export default watchFunction;
