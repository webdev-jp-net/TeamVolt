import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { doc, getDoc, updateDoc, arrayUnion, runTransaction } from 'firebase/firestore';
import { db } from 'firebaseDB';

type ChargeUnitsData = { member: string; count: number };

type State = {
  genEnergy: number;
  chargeUnits: ChargeUnitsData[];
};
const initialState: State = {
  genEnergy: 0,
  chargeUnits: [],
};

// RTK Queryの設定
// https://redux-toolkit.js.org/rtk-query/overview

export const energyGetApi = createApi({
  reducerPath: 'energyGetApi',
  baseQuery: async id => {
    if (id) {
      const docRef = doc(db, 'team', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: docSnap.data().chargeUnits };
      } else {
        return { error: 'No such document!' };
      }
    } else {
      return { error: 'No such document!' };
    }
  },
  endpoints: builder => ({
    // 獲得バッテリー取得
    getChargeUnits: builder.query<ChargeUnitsData[], string>({
      query: id => id,
    }),
  }),
});
export const { useGetChargeUnitsQuery } = energyGetApi;

export const energyPostApi = createApi({
  reducerPath: 'energyPostApi',
  baseQuery: async ({ id, value }: { id?: string; value: ChargeUnitsData }) => {
    if (id && value) {
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
            ...oldList.filter((item: ChargeUnitsData) => item.member !== value.member),
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
        return { data: docSnap.data().chargeUnits };
      } else {
        return { error: 'No such document!' };
      }
    } else {
      return { error: 'No such document!' };
    }
  },
  endpoints: builder => ({
    // 獲得バッテリー追加
    addChargeUnits: builder.mutation<ChargeUnitsData[], { id: string; value: ChargeUnitsData }>({
      query: ({ id, value }) => ({
        operationType: 'remove_challenger',
        id,
        value,
      }),
    }),
  }),
});

export const { useAddChargeUnitsMutation } = energyPostApi;

const energy = createSlice({
  name: 'energy',

  initialState,

  reducers: {
    // 獲得エネルギーを更新
    updateGenEnergy: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        genEnergy: action.payload,
      };
    },
    // 獲得エネルギーをリセット
    resetEnergy: () => {
      return {
        genEnergy: 0,
        chargeUnits: [],
      };
    },
  },

  extraReducers: builder => {
    // 成功: 獲得バッテリー取得
    builder.addMatcher(
      energyGetApi.endpoints.getChargeUnits.matchFulfilled,
      (state, action: PayloadAction<ChargeUnitsData[]>) => {
        const result = { chargeUnits: action.payload };
        return {
          ...state,
          ...result,
        };
      }
    );
    // 成功: 獲得バッテリー追加
    builder.addMatcher(
      energyPostApi.endpoints.addChargeUnits.matchFulfilled,
      (state, action: PayloadAction<ChargeUnitsData[]>) => {
        const result = { chargeUnits: action.payload };
        return {
          ...state,
          ...result,
        };
      }
    );
  },
});

// Action Creator
export const { updateGenEnergy, resetEnergy } = energy.actions;

// Reducer
export default energy.reducer;
