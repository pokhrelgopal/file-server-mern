import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { keyApi } from "./keyApi"; // Adjust this import based on your file structure

interface KeyState {
  secretKey: string | null;
}

const initialState: KeyState = {
  secretKey: null,
};

const keySlice = createSlice({
  name: "key",
  initialState,
  reducers: {
    setSecretKey: (state, action: PayloadAction<string>) => {
      state.secretKey = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      keyApi.endpoints.getSecretKey.matchFulfilled,
      (state, { payload }) => {
        state.secretKey = payload.secretKey;
      }
    );
  },
});

export const { setSecretKey } = keySlice.actions;
export default keySlice.reducer;
