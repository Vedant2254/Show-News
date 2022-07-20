import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle", // idle | loading | success | failure
  news: [],
  error: null,
};

// Thunk
export const getNews = createAsyncThunk(
  "news/getNews",
  async (clear, { getState, rejectWithValue }) => {
    const { params } = getState().form;
    try {
      const res = await axios.get(`https://newsapi.org/v2/${params.type}`, {
        params,
      });
      return res.data;
    } catch (err) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  }
);

export const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: {
    [getNews.pending]: (state) => {
      state.status = "loading";
    },
    [getNews.fulfilled]: (state, action) => {
      state.status = "success";
      if (action.meta.arg.clear === true) state.news = action.payload;
      else {
        state.news.articles = [
          ...action.payload.articles,
          ...state.news.articles,
        ];
      }
      state.error = null;
    },
    [getNews.rejected]: (state, action) => {
      state.status = "failure";
      state.error = action.payload.message;
    },
  },
});

export default newsSlice.reducer;
