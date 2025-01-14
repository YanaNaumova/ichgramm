import apiClient from "../../api/apiClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

export const getUserPosts = createAsyncThunk("posts/userPosts", async () => {
  const response = await apiClient.get("/posts/posts");
  return response;
});

export const createPost = createAsyncThunk(
  "posts/create",
  async ({ description, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      const response = await apiClient.post("/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/posts/post/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPostById = createAsyncThunk(
  "post/getPostById",
  async (postId) => {
    const response = await apiClient.get(`/posts/post/${postId}`);
    console.log("Response from getPostById:", response.data);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, updatedData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("description", updatedData.description);
      if (updatedData.image) {
        formData.append("image", updatedData.image);
      }

      const response = await apiClient.put(
        `/posts/update/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllPosts = createAsyncThunk("post/getAllPosts", async () => {
  const response = await apiClient.get("/posts/allposts");
  return response.data;
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload.newPost); // Добавляем новый пост в state
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = [action.payload.post];
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPostIndex = state.posts.findIndex(
          (post) => post._id === action.payload.post._id
        );
        if (updatedPostIndex !== -1) {
          state.posts[updatedPostIndex] = action.payload.post;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postsSlice.reducer;
