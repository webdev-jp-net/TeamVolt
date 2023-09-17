import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import player, { playerGetApi, teamArticleGetApi, playerAddApi } from './player';
import team, { teamGetApi, teamPostApi } from './team';

const reducer = combineReducers({
  player,
  [playerGetApi.reducerPath]: playerGetApi.reducer,
  [playerAddApi.reducerPath]: playerAddApi.reducer,
  [teamArticleGetApi.reducerPath]: teamArticleGetApi.reducer,
  team,
  [teamGetApi.reducerPath]: teamGetApi.reducer,
  [teamPostApi.reducerPath]: teamPostApi.reducer,
});

const middleware = getDefaultMiddleware({ serializableCheck: false }).concat(
  playerGetApi.middleware,
  teamArticleGetApi.middleware,
  playerAddApi.middleware,
  teamGetApi.middleware,
  teamPostApi.middleware
);

export const store = configureStore({ reducer, middleware });

export type RootState = ReturnType<typeof reducer>;
