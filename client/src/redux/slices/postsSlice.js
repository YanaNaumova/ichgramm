import apiClient from "../../api/apiClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  loading: false,
  selectedPost: null,
  error: null,
};

export const getUserPosts = createAsyncThunk("posts/userPosts", async () => {
  const response = await apiClient.get("/posts/posts");
  return response.data;
});

export const getByUserIdPosts = createAsyncThunk(
  "posts/otherUserPosts",
  async (id) => {
    const response = await apiClient.get(`/posts/posts/${id}`);
    return response.data;
  }
);

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
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
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
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ postId, description, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("description", description);
      if (image) {
        formData.append("image", image); // Прикрепляем изображение, если оно есть
      }

      // Отправляем formData как данные запроса
      const response = await apiClient.put(
        `/posts/update/${postId}`,
        formData, // Передаем formData напрямую
        {
          headers: {
            "Content-Type": "multipart/form-data", // Устанавливаем Content-Type
          },
        }
      );

      return response.data; // Возвращаем ответ
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const getAllPosts = createAsyncThunk("post/getAllPosts", async () => {
  const response = await apiClient.get("/posts/allposts");
  return response.data;
});

export const getRandomPosts = createAsyncThunk(
  "posts/getRandomPosts",
  async () => {
    try {
      const response = await apiClient.get("/random/randomPosts");

      return response.data;
    } catch (error) {
      throw error.response?.data || "Error fetching random posts";
    }
  }
);

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
        state.posts = action.payload.posts;
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
        state.posts = [...state.posts, action.payload.newPost]; // Добавляем новый пост в state
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
    builder.addCase(updatePost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPost = action.payload;
        const postIndex = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );

        if (postIndex !== -1) {
          // Обновляем пост в массиве
          state.posts[postIndex] = {
            ...state.posts[postIndex],
            ...updatedPost, // Обновляем только изменённые поля
          };
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
    builder
      .addCase(getRandomPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRandomPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getRandomPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getByUserIdPosts.pending, (state) => {
        state.status = "loading";
      })
      // Когда запрос завершен успешно
      .addCase(getByUserIdPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload.posts; // Или другой путь к данным в ответе
      })
      // Когда запрос завершен с ошибкой
      .addCase(getByUserIdPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
