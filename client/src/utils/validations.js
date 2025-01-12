export const validateEmailOrUsername = (value) => {
  if (!value) {
    return "Username or email is required";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(value)) {
    return true;
  }

  if (value.length < 4) {
    return "Username must be at least 4 characters";
  }
  return true;
};

export const passwordValidate = (value) => {
  if (!value) {
    return "Password is required";
  }
  if (value.length < 7) {
    return "Password must be at least 7 characters";
  }

  return true;
};

export const validateEmail = (value) => {
  if (!value) {
    return "Email is required";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(value)) {
    return true;
  }
  return "Email is not'valid";
};

export const validateUsername = (value) => {
  if (!value) {
    return "Username is required";
  }

  if (value.length < 4) {
    return "Username must be at least 4 characters";
  }
  return true;
};

export const validateFullName = (value) => {
  if (!value) {
    return "Username is required";
  }

  if (value.length < 4) {
    return "Full Name must be at least 4 characters";
  }
  return true;
};
