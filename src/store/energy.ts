import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  genEnergy: number;
  chargeUnits: number;
};
const initialState: State = {
  genEnergy: 0,
  chargeUnits: 0,
};

const energy = createSlice({
  name: 'energy',

  initialState,

  reducers: {
    updateGenEnergy: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        genEnergy: action.payload,
      };
    },
    updateChargeUnits: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        chargeUnits: action.payload,
      };
    },
  },
});

// Action Creator
export const { updateChargeUnits, updateGenEnergy } = energy.actions;

// Reducer
export default energy.reducer;
