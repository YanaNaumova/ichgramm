import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")),
  loading: false,
  error: null,
};

export const getProfile = createAsyncThunk(
  "users/getProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const id = getState().auth?.user?.id || getState().auth?.user?._id;
      console.log(getState().auth?.user?.id, "auth");
      if (!id) {
        throw new Error("User ID is undefined");
      }
      const response = await apiClient.get(`/users/profile/${id}`);
      console.log(response.data, "data");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "users/updateProfile",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const id = getState().auth?.user?.id || getState().auth?.user?._id;
      console.log(getState().auth?.user?.id, "auth");
      if (!id) {
        throw new Error("User ID is undefined");
      }
      const response = await apiClient.put(`/users/profile/${id}`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data, "data");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        // state.user = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload, "action.payload");
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        // state.user = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload, "action.payload");
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
