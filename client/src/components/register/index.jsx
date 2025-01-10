import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice.js";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import Logo from "../../assets/icons/logo.svg";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    full_name: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };
  return (
    <div className={styles.registerMainPage}>
      <div className={styles.registerContainer}>
        <img src={Logo} alt="logo" />
        <div className={styles.singUpText}>
          Sign up to see photos and videos from your friends.
        </div>
        <form onSubmit={handleSubmit} className={styles.registerFormContainer}>
          <div className={styles.inputsContainer}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            ></input>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            ></input>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
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
          </div>
          <div className={styles.privacyNotice}>
            <p>People who use our service may have uploaded</p>
            <p>
              your contact information to Instagram.<a href="#">Learn More</a>
            </p>
          </div>
          <div className={styles.agreementText}>
            <p>
              By signing up, you agree to our <a href="#">Terms</a>,
              <a href="#">Privacy</a>
            </p>
            <p>
              <a href="#">Policy</a>and<a href="#">Cookies Policy</a>
            </p>
          </div>
          <button type="submit" disabled={loading} className={styles.singUpBtn}>
            {loading ? "Signing..." : "Sing up"}
          </button>
        </form>
        {error && <p>{error?.message}</p>}
      </div>
      <div className={styles.accauntContainer}>
        <p className={styles.haveAccountText}>
          Have an account?
          <Link to={"/login"} className={styles.loginBtn}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Register;
