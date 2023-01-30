import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface BookmarkState {
  url: string;
  status: "idle" | "loading" | "failed" | "bookmarked";
}

export const bookmarkAsync = createAsyncThunk(
  "bookmark",
  async (url: string) => {
    console.log("bookmark url: ", url);
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
);

const initialState: BookmarkState = {
  url: "",
  status: "idle"
};

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    update: (state, action) => {
      state.status = action.payload.status;
      state.url = action.payload.url;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookmarkAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(bookmarkAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.url += action.payload;
      })
      .addCase(bookmarkAsync.rejected, (state) => {
        state.status = "failed";
      });
  }
});

export const { update } = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
