import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

const initialState = {
  searchedUsers: [],
  loading: false,
  error: null,
};

export const getSearchUsers = createAsyncThunk(
  "users/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/search/users?query=${query}`);
      console.log(response.data, "response data search Users");
      return response.data; // Возвращаем только список пользователей
    } catch (error) {
      return rejectWithValue(error.response?.data || error?.message);
    }
  }
);

const searchUserSlice = createSlice({
  name: "searchUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSearchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSearchUsers.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload, "action.payload searchUsers");
        state.searchedUsers = action.payload.users; // Добавляем список найденных пользователей
      })
      .addCase(getSearchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default searchUserSlice.reducer;
