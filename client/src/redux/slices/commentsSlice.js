import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

export const getAllCommentsByPost = createAsyncThunk(
  "/comments/getComments",
  async (postId, { getState, rejectWithValue }) => {
    const postExists = getState().posts.posts.some(
      (post) => post._id === postId
    );
    if (!postExists) {
      return rejectWithValue("Post was deleted, comments not found");
    }
    try {
      const response = await apiClient.get(`/comments/comments/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching comments");
    }
  }
);

export const addComment = createAsyncThunk(
  "/comments/addComments",
  async ({ postId, commentText }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/comments/comment/${postId}`, {
        commentText,
      });
      return response.data.newComment;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding comment");
    }
  }
);

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCommentsByPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCommentsByPost.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload, "action.payload get all comments");
        state.comments = action.payload;
      })
      .addCase(getAllCommentsByPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log(action.payload, "action.payload comment");
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commentsSlice.reducer;
