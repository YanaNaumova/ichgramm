import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

const initialState = {
  followers: [],
  followings: [],
  followersCount: 0,
  followingsCount: 0,
  loading: false,
  error: null,
};
// Асинхронные экшены
export const addFollowing = createAsyncThunk(
  "follow/addFollowing",
  async (followId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/follower/following/${followId}`, {
        followId,
      });
      console.log(response.data.isFollowing, "response.Data");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error following user");
    }
  }
);

export const deleteFollowing = createAsyncThunk(
  "follow/deleteFollowing",
  async (followId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(
        `/follower/unfollow/${followId}`,
        { followId }
      );
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
      const response = await apiClient.get(`/follower/followings/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error unfollowing user");
    }
  }
);

export const getUserFollowings = createAsyncThunk(
  "user/getUserFollowings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/follower/followings`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error unfollowing user");
    }
  }
);
export const getUserFollowers = createAsyncThunk(
  "user/getUserFollowers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/follower/followers`);
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
      const response = await apiClient.get(`/follower/followers/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error unfollowing user");
    }
  }
);

// Слайс
const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserFollowings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFollowings.fulfilled, (state, action) => {
        state.loading = false;
        state.followings = action.payload.followings;
        state.followingsCount = action.payload.followingsCount;
      })
      .addCase(getUserFollowings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFollowings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowings.fulfilled, (state, action) => {
        state.loading = false;
        state.followings = action.payload.followings;
        state.followingsCount = action.payload.followingsCount;
      })
      .addCase(getFollowings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload.followers;
        state.followersCount = action.payload.followersCount;
      })
      .addCase(getUserFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload.followers;
        state.followersCount = action.payload.followersCount;
      })
      .addCase(getFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFollowing.fulfilled, (state, action) => {
        state.loading = false;
        console.log(state.followings, "followings");
        state.followings = [...state.followings, action.payload.newFollower];
        state.followingsCount += 1;
      })
      .addCase(addFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = state.followers.filter(
          (follower) => follower.following !== action.payload.unfollowedId
        );
        state.followingsCount -= 1;
      })
      .addCase(deleteFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default followSlice.reducer;
