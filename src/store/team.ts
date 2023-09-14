import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayRemove,
  addDoc,
  collection,
  runTransaction,
} from 'firebase/firestore';
import { db } from 'firebaseDB';
import { TeamArticleData } from 'types/team';

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
    if (!id) {
      const teamRef = collection(db, 'team');
      const teamSnapshot = await getDocs(teamRef);
      const result = teamSnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() };
      });
      return { data: result };
    } else {
      // 特定のデータ
      const docRef = doc(db, 'team', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: { id, ...docSnap.data() } };
      } else {
        return { error: 'No such document!' };
      }
    }
  },
  endpoints: builder => ({
    // チーム情報取得
    getTeamList: builder.query<TeamArticleData[], void>({
      query: () => ({}),
    }),
    // チーム情報取得
    getTeamArticle: builder.query<TeamArticleData, string>({
      query: id => ({ id }),
    }),
  }),
});
export const { useGetTeamListQuery, useGetTeamArticleQuery } = teamGetApi;

// チームメンバー編集
type teamPostApiProps = {
  operationType: string;
  id?: string;
  value?: string;
};
export const teamPostApi = createApi({
  reducerPath: 'teamPostApi',
  baseQuery: async ({ operationType, id, value }: teamPostApiProps) => {
    if (operationType === 'add_team') {
      // チームを追加
      const teamRef = collection(db, 'team');
      const docRef = await addDoc(teamRef, {
        name: value,
        member: [],
      });
      return { data: { id: docRef.id, name: value, member: [] } };
    } else if (operationType === 'add_member' && id) {
      // メンバーを追加
      const docRef = doc(db, 'team', id);
      await runTransaction(db, async transaction => {
        const sfDoc = await transaction.get(docRef);
        if (!sfDoc.exists()) {
          // eslint-disable-next-line no-throw-literal
          throw 'Document does not exist!';
        }
        const oldMemberList = sfDoc.data().memberList || [];
        const newMemberList = [...oldMemberList, value];
        const uniqueMemberList = Array.from(new Set(newMemberList));
        transaction.update(docRef, { member: uniqueMemberList });
      });
      // レスポンスで返す情報を再取得
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: { id, ...docSnap.data() } };
      } else {
        return { error: 'No such document!' };
      }
    } else if (operationType === 'remove_member' && id) {
      const docRef = doc(db, 'team', id);
      // メンバーを削除
      await updateDoc(docRef, {
        member: arrayRemove(value),
      });
      // レスポンスで返す情報を再取得
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: { id, ...docSnap.data() } };
      } else {
        return { error: 'No such document!' };
      }
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
    // メンバー追加
    addMember: builder.mutation<TeamArticleData, { id: string; value: string }>({
      query: ({ id, value }) => ({
        operationType: 'add_member',
        id,
        value,
      }),
    }),
    // メンバー削除
    removeMember: builder.mutation<TeamArticleData, { id: string; value: string }>({
      query: ({ id, value }) => ({
        operationType: 'remove_member',
        id,
        value,
      }),
    }),
  }),
});
export const { useAddTeamMutation, useAddMemberMutation, useRemoveMemberMutation } = teamPostApi;

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
    // 成功: チーム情報取得
    builder.addMatcher(
      teamGetApi.endpoints.getTeamArticle.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData>) => {
        const externalTeamList = state.teamList.filter(team => team.id !== action.payload.id);
        state.teamList = [...externalTeamList, action.payload];
      }
    );
    // 成功: チーム追加
    builder.addMatcher(
      teamPostApi.endpoints.addTeam.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData>) => {
        const result = { teamList: [...state.teamList, action.payload] };
        return {
          ...state,
          ...result,
        };
      }
    );
    // 成功: メンバー追加
    builder.addMatcher(
      teamPostApi.endpoints.addMember.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData>) => {
        const externalTeamList = state.teamList.filter(team => team.id !== action.payload.id);
        state.teamList = [...externalTeamList, action.payload];
      }
    );
    // 成功: メンバー削除
    builder.addMatcher(
      teamPostApi.endpoints.removeMember.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData>) => {
        const externalTeamList = state.teamList.filter(team => team.id !== action.payload.id);
        state.teamList = [...externalTeamList, action.payload];
      }
    );
  },
});

// Action Creator
export const { updateTeam, escapeTeam } = team.actions;

// Reducer
export default team.reducer;
