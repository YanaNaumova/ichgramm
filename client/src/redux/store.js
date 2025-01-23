import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import postsReducer from "./slices/postsSlice.js";
import userRrducer from "./slices/userSlice.js";
import commentsReducer from "./slices/commentsSlice.js";
import likeReducer from "./slices/likeSlice.js";
import searchUsersReducer from "./slices/searchUsers.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    user: userRrducer,
    comments: commentsReducer,
    likes: likeReducer,
    searchedUsers: searchUsersReducer,
  },
});

export default store;
