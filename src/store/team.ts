import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDocs, addDoc, collection } from 'firebase/firestore';
import { db } from 'firebaseDB';
import { TeamArticleData } from 'types/team';

type State = {
  teamList: TeamArticleData[];
};

const initialState: State = {
  teamList: [],
};

// RTK Queryの設定
// https://redux-toolkit.js.org/rtk-query/overview
// read
export const teamGetApi = createApi({
  reducerPath: 'teamGetApi',
  baseQuery: async ({ path }) => {
    const teamRef = collection(db, path);
    const teamSnapshot = await getDocs(teamRef);
    const result = teamSnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    return { data: result };
  },
  endpoints: builder => ({
    // チーム情報取得
    getTeam: builder.query<TeamArticleData[], void>({
      query: () => ({ path: 'team' }),
    }),
  }),
});
export const { useGetTeamQuery } = teamGetApi;

// write
export const teamAddApi = createApi({
  reducerPath: 'teamAddApi',
  baseQuery: async ({ value }) => {
    const teamRef = collection(db, 'team');
    const docRef = await addDoc(teamRef, {
      name: value,
      member: [],
    });
    return { data: { id: docRef.id, name: value, member: [] } };
  },
  endpoints: builder => ({
    // チーム情報追加
    addTeam: builder.mutation<TeamArticleData, string>({
      query: value => ({ value }),
    }),
  }),
});
export const { useAddTeamMutation } = teamAddApi;

const team = createSlice({
  name: 'team',

  initialState,

  reducers: {
    updateTeamList: (state, action: PayloadAction<TeamArticleData[]>) => {
      return {
        ...state,
        teamList: action.payload,
      };
    },
  },

  extraReducers: builder => {
    // 成功: チーム情報取得
    builder.addMatcher(
      teamGetApi.endpoints.getTeam.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData[]>) => {
        state.teamList = action.payload;
      }
    );
    // 成功: チーム追加
    builder.addMatcher(
      teamAddApi.endpoints.addTeam.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData>) => {
        const result = { teamList: [...state.teamList, action.payload] };
        return {
          ...state,
          ...result,
        };
      }
    );
  },
});

// Action Creator
export const { updateTeamList } = team.actions;

// Reducer
export default team.reducer;
