import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayRemove,
  arrayUnion,
  addDoc,
  deleteDoc,
  deleteField,
  collection,
  runTransaction,
} from 'firebase/firestore';
import { db } from 'firebaseDB';

import type { PlayerArticleData } from 'types/player';
import type { TeamArticleData } from 'types/team';

type State = {
  localId: string;
  player?: string;
  playerList: PlayerArticleData[];
  genEnergy: number;
  myTeam?: TeamArticleData;
};

const initialState: State = {
  localId: '',
  playerList: [],
  genEnergy: 0,
};

// RTK Queryの設定
// https://redux-toolkit.js.org/rtk-query/overview
// 読込用
export const playerGetApi = createApi({
  reducerPath: 'playerGetApi',
  baseQuery: async () => {
    const playerRef = collection(db, 'player');
    const playerSnapshot = await getDocs(playerRef);
    const result = playerSnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    return { data: result };
  },
  endpoints: builder => ({
    // プレイヤー情報取得
    getPlayer: builder.query<PlayerArticleData[], void>({
      query: () => ({}),
    }),
  }),
});
export const { useGetPlayerQuery } = playerGetApi;

// チーム情報取得
export const teamArticleGetApi = createApi({
  reducerPath: 'teamArticleGetApi',
  baseQuery: async ({ id }) => {
    const docRef = doc(db, 'team', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { data: { id, ...docSnap.data() } };
    } else {
      return { error: 'No such document!' };
    }
  },
  endpoints: builder => ({
    // チーム情報取得
    getTeamArticle: builder.query<TeamArticleData, string>({
      query: id => ({ id }),
    }),
  }),
});
export const { useGetTeamArticleQuery } = teamArticleGetApi;

// 書込用
export const playerAddApi = createApi({
  reducerPath: 'playerAddApi',
  baseQuery: async ({ value }) => {
    const playerRef = collection(db, 'player');
    const docRef = await addDoc(playerRef, {
      localId: value,
    });
    return { data: { id: docRef.id, localId: value } };
  },
  endpoints: builder => ({
    // プレイヤー情報追加
    addPlayer: builder.mutation<PlayerArticleData, string>({
      query: value => ({ value }),
    }),
  }),
});
export const { useAddPlayerMutation } = playerAddApi;

const player = createSlice({
  name: 'player',

  initialState,

  reducers: {
    // ローカルID更新
    updateLocalId: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        localId: action.payload,
      };
    },
    // 獲得エネルギーを更新
    updateGenEnergy: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        genEnergy: action.payload,
      };
    },
    // 獲得エネルギーをリセット
    resetEnergy: store => {
      return {
        ...store,
        genEnergy: 0,
      };
    },
  },
  extraReducers: builder => {
    // 成功: プレイヤー情報取得
    builder.addMatcher(
      playerGetApi.endpoints.getPlayer.matchFulfilled,
      (state, action: PayloadAction<PlayerArticleData[]>) => {
        state.playerList = action.payload;
      }
    );
    // 成功: プレイヤー追加
    builder.addMatcher(
      playerAddApi.endpoints.addPlayer.matchFulfilled,
      (state, action: PayloadAction<PlayerArticleData>) => {
        const result = { playerList: [...state.playerList, action.payload] };
        return {
          ...state,
          ...result,
        };
      }
    );
    // 成功: チーム情報取得
    builder.addMatcher(
      teamArticleGetApi.endpoints.getTeamArticle.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData>) => {
        state.myTeam = action.payload;
      }
    );
  },
});

// Action Creator
export const { updateLocalId, updateGenEnergy, resetEnergy } = player.actions;

// Reducer
export default player.reducer;
