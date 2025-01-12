import "./App.css";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ProfilePage from "./pages/profilePage";
import { Routes, Route } from "react-router-dom";
import FogotPasswordPage from "./pages/fogotPasswordPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<ProfilePage />} />
        <Route path="/forgotPassword" element={<FogotPasswordPage />} />
      </Routes>
    </div>
  );
}

export default App;
