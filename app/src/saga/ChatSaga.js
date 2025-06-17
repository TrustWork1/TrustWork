import {call, put, select, takeLatest} from 'redux-saga/effects';
import {
  attachFileFailure,
  attachFileSuccess,
  chatUserListFailure,
  chatUserListSuccess,
  createChatRoomFailure,
  createChatRoomSuccess,
  markReadChatFailure,
  markReadChatSuccess,
  messageListFailure,
  messageListSuccess,
} from '../redux/reducer/ChatReducer';
import {getApi, postApi} from '../utils/helpers/ApiRequest';
import showErrorAlert from '../utils/helpers/Toast';

let getItem = state => state.AuthReducer;
let token = '';

// chatUserList
export function* chatUserListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, 'list_chat_rooms/', header);

    if (response?.status == 200) {
      yield put(chatUserListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(chatUserListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(chatUserListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(chatUserListFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(chatUserListFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(chatUserListFailure(error));
      showErrorAlert(error?.response?.data?.message);
    }
  }
}

// createChatRoom
export function* createChatRoomSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'create_chat_room/',
      action.payload,
      header,
    );
    console.log(response);
    if (response?.status == 200) {
      yield put(createChatRoomSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(createChatRoomFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(createChatRoomFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(createChatRoomFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(createChatRoomFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(createChatRoomFailure(error));
      showErrorAlert(error?.response?.data?.message);
    }
  }
}

// messageList
export function* messageListSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      getApi,
      `chat_messages/list/${action.payload}`,
      header,
    );

    if (response?.status == 200) {
      yield put(messageListSuccess(response?.data));
      //   showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(messageListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(messageListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(messageListFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(messageListFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(messageListFailure(error));
      showErrorAlert(error?.response?.data?.message);
    }
  }
}

// attachFile
export function* attachFileSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'chat/attach/files',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(attachFileSuccess(response?.data));
      //   showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(attachFileFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(attachFileFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(attachFileFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(attachFileFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(attachFileFailure(error));
      showErrorAlert(error?.response?.data?.message);
    }
  }
}

// markReadChat
export function* markReadChatSaga(action) {
  const items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.getTokenResponse,
  };
  try {
    let response = yield call(
      postApi,
      'chat/mark/read',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(markReadChatSuccess(response?.data));
      //   showErrorAlert(response?.data?.message);
    } else if (response?.status == 201) {
      yield put(markReadChatFailure(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(markReadChatFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    if (error?.status == 502) {
      yield put(markReadChatFailure(error));
      showErrorAlert(error?.message);
    } else if (error?.status == 401) {
      yield put(markReadChatFailure(error));
      showErrorAlert(error?.response?.data?.data?.detail);
    } else {
      yield put(markReadChatFailure(error));
      showErrorAlert(error?.response?.data?.message);
    }
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Chat/chatUserListRequest', chatUserListSaga);
  })(),
  (function* () {
    yield takeLatest('Chat/createChatRoomRequest', createChatRoomSaga);
  })(),
  (function* () {
    yield takeLatest('Chat/messageListRequest', messageListSaga);
  })(),
  (function* () {
    yield takeLatest('Chat/attachFileRequest', attachFileSaga);
  })(),
  (function* () {
    yield takeLatest('Chat/markReadChatRequest', markReadChatSaga);
  })(),
];

export default watchFunction;
