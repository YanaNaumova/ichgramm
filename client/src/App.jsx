import "./App.css";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ProfilePage from "./pages/profilePage";
import { Routes, Route, Navigate } from "react-router-dom";
import FogotPasswordPage from "./pages/fogotPasswordPage";
import SideNav from "./components/sideNav";
import SearchPage from "./pages/searchPage";
import NotificationPage from "./pages/notificationPage";
import MessagePage from "./pages/messagePage";
import ExplorePage from "./pages/explorePage";
import CreatePage from "./pages/createPage";
import HomePage from "./pages/homePage";
import store from "./redux/store";
import EditProfilePage from "./pages/editProfilePage";
import NotFoundPage from "./pages/notFoundPage";

function App() {
  console.log("Текущее состояние стора:", store.getState());
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
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/messages" element={<MessagePage />} />
                  <Route path="/notifications" element={<NotificationPage />} />
                  <Route path="/create" element={<CreatePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/edit" element={<EditProfilePage />} />
                  <Route path="*" element={<NotFoundPage />} />
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
