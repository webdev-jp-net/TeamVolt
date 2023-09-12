import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import team, { teamGetApi, teamAddApi } from './team';
import user, { statusGetApi, statusUpdateApi } from './user';

const reducer = combineReducers({
  team,
  [teamGetApi.reducerPath]: teamGetApi.reducer,
  [teamAddApi.reducerPath]: teamAddApi.reducer,
  user,
  [statusGetApi.reducerPath]: statusGetApi.reducer,
  [statusUpdateApi.reducerPath]: statusUpdateApi.reducer,
});

const middleware = getDefaultMiddleware({ serializableCheck: false }).concat(
  teamGetApi.middleware,
  teamAddApi.middleware,
  statusGetApi.middleware,
  statusUpdateApi.middleware
);

export const store = configureStore({ reducer, middleware });

export type RootState = ReturnType<typeof reducer>;
