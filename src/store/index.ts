import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import user, { statusGetApi, statusUpdateApi } from './user';

const reducer = combineReducers({
  user,
  [statusGetApi.reducerPath]: statusGetApi.reducer,
  [statusUpdateApi.reducerPath]: statusUpdateApi.reducer,
});

const middleware = getDefaultMiddleware({ serializableCheck: false }).concat(
  statusGetApi.middleware,
  statusUpdateApi.middleware
);

export const store = configureStore({ reducer, middleware });

export type RootState = ReturnType<typeof reducer>;
