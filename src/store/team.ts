import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { doc, getDocs, addDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from 'firebaseDB';
import { TeamArticleData } from 'types/team';

type State = {
  teamList: TeamArticleData[];
  logList?: TeamArticleData[];
};

const initialState: State = {
  teamList: [],
  logList: [],
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
  value?: string | number | TeamArticleData;
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
    } else if (operationType === 'add_log' && value) {
      // プレイログを追加
      const logRef = collection(db, 'log');
      await addDoc(logRef, value as TeamArticleData);
      return { data: null };
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
    // プレイログを追加
    addLog: builder.mutation<void, TeamArticleData>({
      query: value => ({
        operationType: 'add_log',
        value,
      }),
    }),
  }),
});
export const { useAddTeamMutation, useRemoveTeamMutation, useAddLogMutation } = teamListPostApi;

const team = createSlice({
  name: 'team',

  initialState,

  reducers: {},

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
// export const {} = team.actions;

// Reducer
export default team.reducer;
