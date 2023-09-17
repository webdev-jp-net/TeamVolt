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
import type { TeamArticleData, ChargeUnitsData } from 'types/team';

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

// チーム情報の更新

// チームメンバー編集
type teamPostApiProps = {
  operationType: string;
  id?: string;
  value?: string | number | ChargeUnitsData;
};
export const teamPostApi = createApi({
  reducerPath: 'teamPostApi',
  baseQuery: async ({ operationType, id, value }: teamPostApiProps) => {
    if (operationType === 'add_member' && id) {
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
  useAddMemberMutation,
  useRemoveMemberMutation,
  useAddChallengerMutation,
  useRemoveChallengerMutation,
  useAddChargeUnitsMutation,
  useUpdateUsedUnitsMutation,
  useUpdateCurrentPositionMutation,
} = teamPostApi;

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
