import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDocs, addDoc, collection } from 'firebase/firestore';
import { db } from 'firebaseDB';
import { PlayerArticleData } from 'types/player';
import { TeamArticleData } from 'types/team';

type State = {
  localId: string;
  player?: string;
  playerList: PlayerArticleData[];
  team?: TeamArticleData;
};

const initialState: State = {
  localId: '',
  playerList: [],
};

// RTK Queryの設定
// https://redux-toolkit.js.org/rtk-query/overview
// read
export const playerGetApi = createApi({
  reducerPath: 'playerGetApi',
  baseQuery: async ({ path }) => {
    const playerRef = collection(db, path);
    const playerSnapshot = await getDocs(playerRef);
    const result = playerSnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    return { data: result };
  },
  endpoints: builder => ({
    // プレイヤー情報取得
    getPlayer: builder.query<PlayerArticleData[], void>({
      query: () => ({ path: 'player' }),
    }),
  }),
});
export const { useGetPlayerQuery } = playerGetApi;

// write
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
    // 所属チーム更新
    updateTeam: (state, action: PayloadAction<TeamArticleData>) => {
      return {
        ...state,
        team: action.payload,
      };
    },
    // 所属チーム脱退
    escapeTeam: state => {
      return {
        ...state,
        team: undefined,
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
  },
});

// Action Creator
export const { updateLocalId, updateTeam, escapeTeam } = player.actions;

// Reducer
export default player.reducer;
