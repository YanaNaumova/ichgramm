import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import postsReducer from "./slices/postsSlice.js";
import userRrducer from "./slices/userSlice.js";
import commentsReducer from "./slices/commentsSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    user: userRrducer,
    comments: commentsReducer,
  },
});

export default store;
