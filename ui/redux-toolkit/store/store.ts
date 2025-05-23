import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../slices/rootReducer';

const storeName = `store-${process.env.NEXT_APP_PROJECT_NAME}`;

const persistConfig = {
  key: storeName,
  storage,
  version: 1,
};

const _combined = combineReducers(rootReducer);

const persistedReducer = persistReducer(persistConfig, _combined) as unknown as typeof _combined;

export const store = configureStore({
  reducer: persistedReducer,

  devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);

// Infer the `ReduxRootState` and `ReduxAppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
