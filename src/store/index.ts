import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import energy, { energyGetApi, energyPostApi } from './energy';
import player, { playerGetApi, playerAddApi } from './player';
import team, { teamGetApi, teamPostApi } from './team';

const reducer = combineReducers({
  player,
  [playerGetApi.reducerPath]: playerGetApi.reducer,
  [playerAddApi.reducerPath]: playerAddApi.reducer,
  team,
  [teamGetApi.reducerPath]: teamGetApi.reducer,
  [teamPostApi.reducerPath]: teamPostApi.reducer,
  energy,
  [energyGetApi.reducerPath]: energyGetApi.reducer,
  [energyPostApi.reducerPath]: energyPostApi.reducer,
});

const middleware = getDefaultMiddleware({ serializableCheck: false }).concat(
  playerGetApi.middleware,
  playerAddApi.middleware,
  teamGetApi.middleware,
  teamPostApi.middleware,
  energyGetApi.middleware,
  energyPostApi.middleware
);

export const store = configureStore({ reducer, middleware });

export type RootState = ReturnType<typeof reducer>;
