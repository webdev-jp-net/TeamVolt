import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import player, { playerGetApi, teamArticleGetApi, playerAddApi, teamPostApi } from './player';
import team, { teamGetApi, teamListPostApi } from './team';

const reducer = combineReducers({
  player,
  [playerGetApi.reducerPath]: playerGetApi.reducer,
  [playerAddApi.reducerPath]: playerAddApi.reducer,
  [teamArticleGetApi.reducerPath]: teamArticleGetApi.reducer,
  [teamPostApi.reducerPath]: teamPostApi.reducer,
  team,
  [teamGetApi.reducerPath]: teamGetApi.reducer,
  [teamListPostApi.reducerPath]: teamListPostApi.reducer,
});

const middleware = getDefaultMiddleware({ serializableCheck: false }).concat(
  playerGetApi.middleware,
  teamArticleGetApi.middleware,
  teamPostApi.middleware,
  playerAddApi.middleware,
  teamGetApi.middleware,
  teamListPostApi.middleware
);

export const store = configureStore({ reducer, middleware });

export type RootState = ReturnType<typeof reducer>;
