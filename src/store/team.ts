import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  doc,
  getDocs,
  updateDoc,
  arrayRemove,
  addDoc,
  collection,
  runTransaction,
} from 'firebase/firestore';
import { db } from 'firebaseDB';
import { TeamArticleData, TeamMemberEditData } from 'types/team';

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

// チームメンバー編集
export const teamMemberApi = createApi({
  reducerPath: 'teamMemberApi',
  baseQuery: async ({ operationType, team, member }) => {
    const documentRef = doc(db, 'team', team);

    if (operationType === 'add') {
      // 要素を追加
      try {
        await runTransaction(db, async transaction => {
          const sfDoc = await transaction.get(documentRef);
          if (!sfDoc.exists()) {
            // eslint-disable-next-line no-throw-literal
            throw 'Document does not exist!';
          }
          const oldMemberList = sfDoc.data().memberList || [];
          const newMemberList = [...oldMemberList, member];
          const uniqueMemberList = Array.from(new Set(newMemberList));
          transaction.update(documentRef, { member: uniqueMemberList });
        });
        console.log('Transaction successfully committed!');
      } catch (e) {
        console.log('Transaction failed: ', e);
      }
    } else if (operationType === 'remove') {
      // 要素を削除
      await updateDoc(documentRef, {
        member: arrayRemove(member),
      });
    }
    return { data: null };
  },
  endpoints: builder => ({
    // メンバー追加
    addEntries: builder.mutation<void, TeamMemberEditData>({
      query: ({ team, member }) => ({
        operationType: 'add',
        team,
        member,
      }),
    }),
    // メンバー削除
    removeEntries: builder.mutation<void, TeamMemberEditData>({
      query: ({ team, member }) => ({
        operationType: 'remove',
        team,
        member,
      }),
    }),
  }),
});
export const { useAddEntriesMutation, useRemoveEntriesMutation } = teamMemberApi;

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
