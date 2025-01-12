import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import Logo from "../../assets/icons/logo.svg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  validateEmailOrUsername,
  passwordValidate,
} from "../../utils/validations.js";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      navigate("/home");
    }
  };

  return (
    <div className={styles.loginMainContainer}>
      <div className={styles.loginContainer}>
        <img src={Logo} alt="logo" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.loginFormContainer}
        >
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Username, or email"
            {...register("emailOrUsername", {
              validate: validateEmailOrUsername,
            })}
          />
          {errors.emailOrUsername && (
            <p className={styles.errorText}>{errors.emailOrUsername.message}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            {...register("password", {
              validate: passwordValidate,
            })}
          />
          {errors.password && (
            <p className={styles.errorText}>{errors.password.message}</p>
          )}

          <button type="submit" disabled={loading} className={styles.loginBtn}>
            {loading ? "Logging in..." : "Log in"}
          </button>

          {error && (
            <p className={styles.errorText}>
              {error?.message === "Invalid credentials" &&
                "Incorrect login or password"}
            </p>
          )}
        </form>
        <div className={styles.lineBoxContainer}>
          <div className={styles.line}></div>
          <div className={styles.text}>OR</div>
          <div className={styles.line}></div>
        </div>
        <Link to="/forgotPassword" className={styles.fogotPasswordLink}>
          <div className={styles.fogotPasswordContainer}>Forgot password?</div>
        </Link>
      </div>
      <div className={styles.dontAccauntContainer}>
        <p className={styles.dontHaveAccountText}>
          Don&#39;t have an account?
          <Link to="/register" className={styles.singUpBtn}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
