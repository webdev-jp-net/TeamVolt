import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import player, { playerGetApi, playerAddApi } from './player';
import team, { teamGetApi, teamAddApi } from './team';
import user, { statusGetApi, statusUpdateApi } from './user';

const reducer = combineReducers({
  player,
  [playerGetApi.reducerPath]: playerGetApi.reducer,
  [playerAddApi.reducerPath]: playerAddApi.reducer,
  team,
  [teamGetApi.reducerPath]: teamGetApi.reducer,
  [teamAddApi.reducerPath]: teamAddApi.reducer,
  user,
  [statusGetApi.reducerPath]: statusGetApi.reducer,
  [statusUpdateApi.reducerPath]: statusUpdateApi.reducer,
});

const middleware = getDefaultMiddleware({ serializableCheck: false }).concat(
  playerGetApi.middleware,
  playerAddApi.middleware,
  teamGetApi.middleware,
  teamAddApi.middleware,
  statusGetApi.middleware,
  statusUpdateApi.middleware
);

export const store = configureStore({ reducer, middleware });

export type RootState = ReturnType<typeof reducer>;
