import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
  params: {},
};

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    changeVisible: (state, action) => {
      state.visible = action.payload;
    },
    toggleVisible: (state) => {
      state.visible = !state.visible;
    },
    changeParams: (state, action) => {
      state.params = { ...state.params, ...action.payload };
    },
    changePage: (state) => {
      state.params = { ...state.params, page: state.params.page + 1 };
      console.log(state.params);
    },
  },
});

export const { changeVisible, toggleVisible, changeParams, changePage } =
  formSlice.actions;
export default formSlice.reducer;
