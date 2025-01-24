import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

// Асинхронные экшены
export const followUser = createAsyncThunk(
  "follow/addFollowing",
  async (followId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/following/:followId", {
        followId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error following user");
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "follow/deleteFollowing",
  async (followId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete("/unfollow/:followId", {
        data: { followId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error unfollowing user");
    }
  }
);

export const getFollowings = createAsyncThunk(
  "user/getFollowings",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/followings/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error unfollowing user");
    }
  }
);

export const getFollowers = createAsyncThunk(
  "user/getFollowers",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/followers/${userId}"`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error unfollowing user");
    }
  }
);

// Слайс
const followSlice = createSlice({
  name: "follow",
  initialState: {
    loading: false,
    error: null,
    follower: null,
    following: null,
  },
  reducers: {
    clearFollowState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFollowState } = followSlice.actions;

export default followSlice.reducer;
