import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  runTransaction,
  updateDoc,
  // arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from 'firebaseDB';

type State = {
  userId: string;
  memberList: string[];
  drawResult?: string;
};

const initialState: State = {
  userId: '',
  memberList: [],
};

type EntriesResponse = {
  memberList: string[];
};

type DrawResultResponse = {
  userId?: string;
};

// RTK Queryの設定
// https://redux-toolkit.js.org/rtk-query/overview
// 読み込み用のAPI
type FirebaseBaseQueryParams = {
  path: string;
};
const firebaseBaseQuery = async ({ path }: FirebaseBaseQueryParams) => {
  const docRef = doc(db, 'status', path);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { data: docSnap.data() };
  } else {
    return { error: 'No such document!' };
  }
};
export const statusGetApi = createApi({
  reducerPath: 'statusGetApi',
  baseQuery: firebaseBaseQuery,
  endpoints: builder => ({
    getEntries: builder.query<EntriesResponse, void>({
      query: () => ({ path: 'room_entries' }),
    }),
    getDrawResult: builder.query<DrawResultResponse, void>({
      query: () => ({ path: 'draw_result' }),
    }),
  }),
});
export const { useGetEntriesQuery, useGetDrawResultQuery } = statusGetApi;

// 書き込み用のAPI
type FirebaseMutationParams<T> = {
  path: string;
  value: EntriesResponse | DrawResultResponse | string;
};
const firebaseMutationBaseQuery = async <T>({ path, value }: FirebaseMutationParams<T>) => {
  const statusRef = collection(db, 'status');
  const memberListRef = doc(db, 'status', 'room_entries');

  if (path === 'room_entries_add') {
    // 要素を追加
    // await updateDoc(memberListRef, {
    //   memberList: arrayUnion(value),
    // });
    try {
      await runTransaction(db, async transaction => {
        const sfDoc = await transaction.get(memberListRef);
        if (!sfDoc.exists()) {
          // eslint-disable-next-line no-throw-literal
          throw 'Document does not exist!';
        }
        const oldMemberList = sfDoc.data().memberList || [];
        const newMemberList = [...oldMemberList, value];
        const uniqueMemberList = Array.from(new Set(newMemberList));
        transaction.update(memberListRef, { memberList: uniqueMemberList });
      });
      console.log('Transaction successfully committed!');
    } catch (e) {
      console.log('Transaction failed: ', e);
    }
    return { data: null };
  } else if (path === 'room_entries_remove') {
    // 要素を削除
    await updateDoc(memberListRef, {
      memberList: arrayRemove(value),
    });
    return { data: null };
  } else {
    await setDoc(doc(statusRef, path), value as DrawResultResponse);
    return { data: null };
  }
};
export const statusUpdateApi = createApi({
  reducerPath: 'statusUpdateApi',
  baseQuery: firebaseMutationBaseQuery,
  endpoints: builder => ({
    // updateEntries: builder.mutation<void, string[]>({
    //   query: newMemberList => ({
    //     path: 'room_entries',
    //     value: { memberList: newMemberList },
    //   }),
    // }),
    addEntries: builder.mutation<void, string>({
      query: newMember => ({
        path: 'room_entries_add',
        value: newMember,
      }),
    }),
    removeEntries: builder.mutation<void, string>({
      query: newMember => ({
        path: 'room_entries_remove',
        value: newMember,
      }),
    }),
    updateDrawResult: builder.mutation<void, string>({
      query: newUserId => ({ path: 'draw_result', value: { userId: newUserId } }),
    }),
  }),
});

export const { useAddEntriesMutation, useRemoveEntriesMutation, useUpdateDrawResultMutation } =
  statusUpdateApi;

const user = createSlice({
  name: 'user',

  initialState,

  reducers: {
    updateUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    updateMemberList: (state, action: PayloadAction<string[]>) => {
      state.memberList = action.payload;
    },
    resetDrawResult: state => {
      state.drawResult = '';
    },
  },

  extraReducers: builder => {
    builder.addMatcher(
      statusGetApi.endpoints.getEntries.matchFulfilled,
      (state, action: PayloadAction<EntriesResponse>) => {
        const oldMemberList = action.payload.memberList || [];
        const newMemberList = [...oldMemberList, state.userId];
        const uniqueMemberList = Array.from(new Set(newMemberList));

        state.memberList = uniqueMemberList;
      }
    );
    builder.addMatcher(
      statusGetApi.endpoints.getDrawResult.matchFulfilled,
      (state, action: PayloadAction<DrawResultResponse>) => {
        state.drawResult = action.payload.userId;
      }
    );
  },
});

// Action Creators
export const { updateUserId, updateMemberList, resetDrawResult } = user.actions;

// Reducer
export default user.reducer;
