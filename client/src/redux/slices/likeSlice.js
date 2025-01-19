import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

// Async thunk для добавления или удаления лайка для поста
export const togglePostLike = createAsyncThunk(
  "likes/togglePostLike",
  async ({ postId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/likes/like/${postId}`);

      return { postId, liked: response.data.message === "Like added to post" };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error toggling post like"
      );
    }
  }
);

// Async thunk для добавления или удаления лайка для комментария
export const toggleCommentLike = createAsyncThunk(
  "likes/toggleCommentLike",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/likes/like/${postId}/${commentId}`
      );
      return {
        postId,
        commentId,
        liked: response.data.message === "Like added to comment",
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error toggling comment like"
      );
    }
  }
);

// Async thunk для получения количества лайков на пост
export const getPostLikes = createAsyncThunk(
  "likes/getPostLikes",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/likes/likeCount/${postId}`);
      return {
        postId,
        postLikesCount: response.data.postslikeCount,
        userPostLikes: response.data.liked,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching post likes"
      );
    }
  }
);

// Async thunk для получения количества лайков на комментарий
export const getCommentLikes = createAsyncThunk(
  "likes/getCommentLikes",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/likes/likeCount/${postId}/${commentId}`
      );
      return {
        postId,
        commentId,
        commentsLikeCount: response.data.commentsLikeCount,
        userCommentLikes: response.data.liked,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching comment likes"
      );
    }
  }
);

const initialState = {
  postLikesCount: {}, // Хранение количества лайков для постов
  commentLikesCount: {},
  userPostLikes: {},
  userCommentLikes: {},
  loading: false,
  error: null,
};

const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Для лайков постов
      .addCase(togglePostLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePostLike.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, liked } = action.payload;
        // Если лайк был добавлен или удален, то обновляем счетчик лайков
        if (liked) {
          state.postLikesCount[postId] =
            (state.postLikesCount[postId] || 0) + 1;
        } else {
          state.postLikesCount[postId] = Math.max(
            0,
            (state.postLikesCount[postId] || 0) - 1
          );
        }
        // Обновляем состояние лайка для пользователя
        state.userPostLikes[postId] = liked;
      })
      .addCase(togglePostLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Для лайков комментариев
      .addCase(toggleCommentLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, commentId, liked } = action.payload;
        if (liked) {
          state.commentLikesCount[postId] = {
            ...(state.commentLikesCount[postId] || {}),
            [commentId]:
              (state.commentLikesCount[postId]?.[commentId] || 0) + 1,
          };
        } else {
          state.commentLikesCount[postId] = {
            ...(state.commentLikesCount[postId] || {}),
            [commentId]: Math.max(
              0,
              (state.commentLikesCount[postId]?.[commentId] || 0) - 1
            ),
          };
        }
        // Обновляем состояние лайка для комментария
        state.userCommentLikes[postId] = state.userCommentLikes[postId] || {};
        state.userCommentLikes[postId][commentId] = liked;
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Для получения количества лайков на пост
      .addCase(getPostLikes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostLikes.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, postLikesCount, userPostLikes } = action.payload;
        state.postLikesCount[postId] = postLikesCount;
        state.userPostLikes[postId] = userPostLikes; // true или false
      })
      .addCase(getPostLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Для получения количества лайков на комментарий
      .addCase(getCommentLikes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentLikes.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, commentId, commentsLikeCount, userCommentLikes } =
          action.payload;
        state.commentLikesCount[postId] = {
          ...(state.commentLikesCount[postId] || {}),
          [commentId]: commentsLikeCount,
        };
        state.userCommentLikes[postId] = state.userCommentLikes[postId] || {};
        state.userCommentLikes[postId][commentId] = userCommentLikes; // true или false
      })
      .addCase(getCommentLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;
