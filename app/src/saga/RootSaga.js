import {all} from 'redux-saga/effects';
import AuthSaga from './AuthSaga';
import ChatSaga from './ChatSaga';
import ProfileSaga from './ProfileSaga';
import ProjectSaga from './ProjectSaga';

const combinedSaga = [...AuthSaga, ...ProjectSaga, ...ProfileSaga, ...ChatSaga];

export default function* RootSaga() {
  yield all(combinedSaga);
}
