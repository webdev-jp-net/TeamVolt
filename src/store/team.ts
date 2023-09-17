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
    } else if (operationType === 'add_member' && id) {
      // メンバーを追加
      const docRef = doc(db, 'team', id);
      await updateDoc(docRef, {
        member: arrayUnion(value),
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
    } else if (operationType === 'add_challenger' && id) {
      const docRef = doc(db, 'team', id);
      // 代表者を登録
      await updateDoc(docRef, {
        challenger: value,
      });
      // レスポンスで返す情報を再取得
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: { id, ...docSnap.data() } };
      } else {
        return { error: 'No such document!' };
      }
    } else if (operationType === 'remove_challenger' && id) {
      const docRef = doc(db, 'team', id);
      // 代表者を削除
      await updateDoc(docRef, {
        challenger: deleteField(),
      });
      // レスポンスで返す情報を再取得
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: { id, ...docSnap.data() } };
      } else {
        return { error: 'No such document!' };
      }
    } else if (operationType === 'add_charge_units' && id && value) {
      // 獲得バッテリーを登録
      const docRef = doc(db, 'team', id);
      try {
        await runTransaction(db, async transaction => {
          const sfDoc = await transaction.get(docRef);
          if (!sfDoc.exists()) {
            // eslint-disable-next-line no-throw-literal
            throw 'Document does not exist!';
          }
          const oldList = sfDoc.data().chargeUnits || [];
          const newList = [
            ...oldList.filter(
              (item: ChargeUnitsData) =>
                item.member !== (value as unknown as ChargeUnitsData).member
            ),
            value,
          ];
          transaction.update(docRef, { chargeUnits: newList });
        });
      } catch (e) {
        console.log('Transaction failure:', e);
      }
      // レスポンスで返す情報を再取得
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: { id, ...docSnap.data() } };
      } else {
        return { error: 'No such document!' };
      }
    } else if (operationType === 'update_used_units' && id) {
      const docRef = doc(db, 'team', id);
      // 救出ミッション試行回数を登録
      await updateDoc(docRef, {
        usedUnits: value,
      });
      // レスポンスで返す情報を再取得
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: { id, ...docSnap.data() } };
      } else {
        return { error: 'No such document!' };
      }
    } else if (operationType === 'update_current_positions' && id) {
      const docRef = doc(db, 'team', id);
      // 救出ミッション進捗を登録
      await updateDoc(docRef, {
        currentPosition: value,
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
    // チームを削除
    removeTeam: builder.mutation<string, string>({
      query: id => ({
        operationType: 'remove_team',
        id,
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
    // 抽選結果追加
    addChallenger: builder.mutation<TeamArticleData, { id: string; value: string }>({
      query: ({ id, value }) => ({
        operationType: 'add_challenger',
        id,
        value,
      }),
    }),
    // 抽選結果追加
    removeChallenger: builder.mutation<TeamArticleData, { id: string; value: string }>({
      query: ({ id, value }) => ({
        operationType: 'remove_challenger',
        id,
        value,
      }),
    }),
    // 獲得バッテリー追加
    addChargeUnits: builder.mutation<TeamArticleData, { id: string; value: ChargeUnitsData }>({
      query: ({ id, value }) => ({
        operationType: 'add_charge_units',
        id,
        value,
      }),
    }),
    // 救出ミッション試行数を更新
    updateUsedUnits: builder.mutation<TeamArticleData, { id: string; value: number }>({
      query: ({ id, value }) => ({
        operationType: 'update_used_units',
        id,
        value,
      }),
    }),
    // 救出ミッション進捗を更新
    updateCurrentPosition: builder.mutation<TeamArticleData, { id: string; value: number }>({
      query: ({ id, value }) => ({
        operationType: 'update_current_positions',
        id,
        value,
      }),
    }),
  }),
});
export const {
  useAddTeamMutation,
  useRemoveTeamMutation,
  useAddMemberMutation,
  useRemoveMemberMutation,
  useAddChallengerMutation,
  useRemoveChallengerMutation,
  useAddChargeUnitsMutation,
  useUpdateUsedUnitsMutation,
  useUpdateCurrentPositionMutation,
} = teamListPostApi;

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
    // 成功: メンバー追加
    builder.addMatcher(
      teamListPostApi.endpoints.addMember.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData>) => {
        const externalTeamList = state.teamList.filter(team => team.id !== action.payload.id);
        state.teamList = [...externalTeamList, action.payload];
      }
    );
    // 成功: メンバー削除
    builder.addMatcher(
      teamListPostApi.endpoints.removeMember.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData>) => {
        const externalTeamList = state.teamList.filter(team => team.id !== action.payload.id);
        state.teamList = [...externalTeamList, action.payload];
      }
    );
    // 成功: 代表者追加
    builder.addMatcher(
      teamListPostApi.endpoints.addChallenger.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData>) => {
        const externalTeamList = state.teamList.filter(team => team.id !== action.payload.id);
        state.teamList = [...externalTeamList, action.payload];
      }
    );
    // 成功: 代表者削除
    builder.addMatcher(
      teamListPostApi.endpoints.removeChallenger.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData>) => {
        const externalTeamList = state.teamList.filter(team => team.id !== action.payload.id);
        state.teamList = [...externalTeamList, action.payload];
      }
    );
    // 成功: 獲得バッテリー追加
    builder.addMatcher(
      teamListPostApi.endpoints.addChargeUnits.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData>) => {
        const externalTeamList = state.teamList.filter(team => team.id !== action.payload.id);
        state.teamList = [...externalTeamList, action.payload];
      }
    );
    // 成功: 救出ミッション試行数更新
    builder.addMatcher(
      teamListPostApi.endpoints.updateUsedUnits.matchFulfilled,
      (state, action: PayloadAction<TeamArticleData>) => {
        const externalTeamList = state.teamList.filter(team => team.id !== action.payload.id);
        state.teamList = [...externalTeamList, action.payload];
      }
    );
    // 成功: 救出ミッション進捗更新
    builder.addMatcher(
      teamListPostApi.endpoints.updateCurrentPosition.matchFulfilled,
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
