import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { doc, getDocs, addDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from 'firebaseDB';
import { TeamArticleData } from 'types/team';

import type { ChargeUnitsData } from 'types/team';

type State = {
  teamList: TeamArticleData[];
  selectedTeam?: string;
};

const initialState: State = {
  teamList: [],
};

// RTK Queryの設定
// https://redux-toolkit.js.org/rtk-query/overview
export const teamGetApi = createApi({
  reducerPath: 'teamGetApi',
  baseQuery: async ({ id }: { id?: string }) => {
    // 全データ
    const teamRef = collection(db, 'team');
    const teamSnapshot = await getDocs(teamRef);
    const result = teamSnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    return { data: result };
  },
  endpoints: builder => ({
    // チーム情報取得
    getTeamList: builder.query<TeamArticleData[], void>({
      query: () => ({}),
    }),
  }),
});
export const { useGetTeamListQuery } = teamGetApi;

// チーム編集
type teamListPostApiProps = {
  operationType: string;
  id?: string;
  value?: string | number | ChargeUnitsData;
};
export const teamListPostApi = createApi({
  reducerPath: 'teamListPostApi',
  baseQuery: async ({ operationType, id, value }: teamListPostApiProps) => {
    if (operationType === 'add_team') {
      // チームを追加
      const teamRef = collection(db, 'team');
      const docRef = await addDoc(teamRef, {
        name: value,
        member: [],
      });
      return { data: { id: docRef.id, name: value, member: [] } };
    } else if (operationType === 'remove_team' && id) {
      // チームを削除
      await deleteDoc(doc(db, 'team', id));
      return { data: id };
    } else {
      return { error: 'No such document!' };
    }
  },
  endpoints: builder => ({
    // チームを追加
    addTeam: builder.mutation<TeamArticleData, string>({
      query: value => ({
        operationType: 'add_team',
        value,
      }),
    }),
    // チームを削除
    removeTeam: builder.mutation<string, string>({
      query: id => ({
        operationType: 'remove_team',
        id,
      }),
    }),
  }),
});
export const { useAddTeamMutation, useRemoveTeamMutation } = teamListPostApi;

const team = createSlice({
  name: 'team',

  initialState,

  reducers: {
    // 所属チーム更新
    updateTeam: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        selectedTeam: action.payload,
      };
    },
    // 所属チーム脱退
    escapeTeam: state => {
      return {
        ...state,
        selectedTeam: undefined,
      };
    },
  },

  extraReducers: builder => {
    // 成功: チームリスト情報取得
    builder.addMatcher(
      teamGetApi.endpoints.getTeamList.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData[]>) => {
        state.teamList = action.payload;
      }
    );
    // 成功: チーム追加
    builder.addMatcher(
      teamListPostApi.endpoints.addTeam.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData>) => {
        const result = { teamList: [...state.teamList, action.payload] };
        return {
          ...state,
          ...result,
        };
      }
    );
    // 成功: チーム削除
    builder.addMatcher(
      teamListPostApi.endpoints.removeTeam.matchFulfilled,
      (state, action: PayloadAction<string>) => {
        const result = state.teamList.filter(team => team.id !== action.payload);
        return {
          teamList: result,
          selectedTeam: undefined,
        };
      }
    );
  },
});

// Action Creator
export const { updateTeam, escapeTeam } = team.actions;

// Reducer
export default team.reducer;
