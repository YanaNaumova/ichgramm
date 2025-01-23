import "./App.css";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ProfilePage from "./pages/profilePage";
import { Routes, Route, Navigate } from "react-router-dom";
import FogotPasswordPage from "./pages/fogotPasswordPage";
import SideNav from "./components/sideNav";
import NotificationPage from "./pages/notificationPage";
import MessagePage from "./pages/messagePage";
import ExplorePage from "./pages/explorePage";
import HomePage from "./pages/homePage";
// import store from "./redux/store";
import EditProfilePage from "./pages/editProfilePage";
import NotFoundPage from "./pages/notFoundPage";
import PostModal from "./components/postModal";
import PostPage from "./pages/postPage";
import OtherProfile from "./components/otheProfile";

function App() {
  // console.log("Текущее состояние стора:", store.getState());

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotPassword" element={<FogotPasswordPage />} />
        <Route
          path="*"
          element={
            <div className="container">
              <div className="leftContainer">
                <SideNav />
              </div>
              <div className="rightContainer">
                <Routes>
                  <Route path="/home" element={<HomePage />}>
                    <Route path="post/:postId" element={<PostModal />} />
                  </Route>
                  <Route path="/explore" element={<ExplorePage />}>
                    <Route path="post/:postId" element={<PostModal />} />
                  </Route>
                  <Route path="/messages" element={<MessagePage />} />
                  <Route path="/notifications" element={<NotificationPage />} />
                  <Route path="/profile" element={<ProfilePage />}>
                    <Route path="post/:postId" element={<PostModal />} />
                  </Route>
                  <Route path="/profile/edit" element={<EditProfilePage />} />
                  <Route path="/post/:postId" element={<PostPage />}>
                    <Route path="post/:postId" element={<PostModal />} />
                  </Route>
                  <Route path="*" element={<NotFoundPage />} />
                  <Route path="/profile/:userId" element={<OtherProfile />}>
                    <Route path="post/:postId" element={<PostModal />} />
                  </Route>
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
