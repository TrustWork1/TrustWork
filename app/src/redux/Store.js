import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {logger} from 'redux-logger';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import createSagaMiddleware from 'redux-saga';
import RootSaga from '../saga/RootSaga';
import AuthReducer from './reducer/AuthReducer';
import ChatReducer from './reducer/ChatReducer';
import ProfileReducer from './reducer/ProfileReducer';
import ProjectReducer from './reducer/ProjectReducer';

const rootReducer = combineReducers({
  AuthReducer,
  ProjectReducer,
  ProfileReducer,
  ChatReducer,
});

let SagaMiddleware = createSagaMiddleware();
const middleware = [SagaMiddleware, logger];
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const Store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middleware),
});
export const persistor = persistStore(Store);
SagaMiddleware.run(RootSaga);
