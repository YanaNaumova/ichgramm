import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

const initialState = {
  selectedUser: null,
  loading: false,
  error: null,
};

export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/users/profile/${userId}`);
      console.log(response.data, "selected response.data");
      return response.data;
    } catch (error) {
      console.log(error, "error response");
      return rejectWithValue(error.response?.data || error?.message);
    }
  }
);

const selectedUserSlice = createSlice({
  name: "selectedUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload.user, "selected User");
        state.selectedUser = action.payload.user;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        console.log(action.payload, "ERROR Action payload");
        state.error = action.payload;
      });
  },
});

export default selectedUserSlice.reducer;
