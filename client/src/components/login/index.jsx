import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import Logo from "../../assets/icons/logo.svg";

function Login() {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };
  return (
    <div className={styles.loginMainContainer}>
      <div className={styles.loginContainer}>
        <img src={Logo} alt="logo" />
        <form onSubmit={handleSubmit} className={styles.loginFormContainer}>
          <input
            type="text"
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleChange}
            placeholder="Username, or email"
            required
          ></input>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          ></input>
          <Link to={"/home"} className={styles.loginBtnLink}>
            <button
              type="submit"
              disabled={loading}
              className={styles.loginBtn}
            >
              {loading ? "loginning in..." : "log in"}
            </button>
          </Link>
        </form>
        <div className={styles.lineBoxContainer}>
          <div className={styles.line}></div>
          <div className={styles.text}>OR</div>
          <div className={styles.line}></div>
        </div>
        <Link to="/fogotPassword" className={styles.fogotPasswordLink}>
          <div className={styles.fogotPasswordContainer}>Fogot password?</div>
        </Link>
        {error && <p>{error?.message}</p>}
      </div>
      <div className={styles.dontAccauntContainer}>
        <p className={styles.dontHaveAccountText}>
          Don&#39;t have an account?
          <Link to={"/register"} className={styles.singUpBtn}>
            Sing up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
