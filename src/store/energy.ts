import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  genEnergy: number;
  chargeUnits: { member: string; count: number }[];
};
const initialState: State = {
  genEnergy: 0,
  chargeUnits: [],
};

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
    // 獲得バッテリー数を更新
    updateChargeUnits: (state, action: PayloadAction<{ member: string; count: number }>) => {
      const result = { chargeUnits: [...state.chargeUnits, action.payload] };
      return {
        ...state,
        ...result,
      };
    },
  },
});

// Action Creator
export const { updateChargeUnits, updateGenEnergy } = energy.actions;

// Reducer
export default energy.reducer;
