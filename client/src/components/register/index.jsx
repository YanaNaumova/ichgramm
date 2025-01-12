import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice.js";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import Logo from "../../assets/icons/logo.svg";
import { useForm } from "react-hook-form";
import {
  passwordValidate,
  validateEmail,
  validateUsername,
  validateFullName,
} from "../../utils/validations.js";

function Register() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className={styles.registerMainPage}>
      <div className={styles.registerContainer}>
        <img src={Logo} alt="logo" />
        <div className={styles.singUpText}>
          Sign up to see photos and videos from your friends.
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.registerFormContainer}
        >
          <div className={styles.inputsContainer}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              {...register("email", {
                validate: validateEmail,
              })}
            />
            {errors.email && (
              <p className={styles.errorText}>{errors.email.message}</p>
            )}

            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              {...register("full_name", {
                validate: validateFullName,
              })}
            />
            {errors.full_name && (
              <p className={styles.errorText}>{errors.full_name.message}</p>
            )}

            <input
              type="text"
              name="username"
              placeholder="Username"
              {...register("username", {
                validate: validateUsername,
              })}
            />
            {errors.username && (
              <p className={styles.errorText}>{errors.username.message}</p>
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
            {loading ? "Signing..." : "Sign up"}
          </button>
        </form>

        {error && (
          <p>
            {error?.message ===
              "The user with this email or username  already exists" &&
              error?.message}
          </p>
        )}
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
