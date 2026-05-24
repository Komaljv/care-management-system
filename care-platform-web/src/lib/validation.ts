// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain at least one special character (!@#$%^&*)";
  }
  return null;
};

// Password confirmation validation
export const validatePasswordConfirm = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
};

// Full name validation
export const validateFullName = (name: string): string | null => {
  if (!name.trim()) {
    return "Full name is required";
  }
  if (name.trim().length < 2) {
    return "Full name must be at least 2 characters";
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return "Full name can only contain letters, spaces, hyphens, and apostrophes";
  }
  return null;
};

// Role validation
export const validateRole = (role: string): string | null => {
  if (!role) {
    return "Please select a role";
  }
  return null;
};

// Login form validation
export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export const validateLoginForm = (
  email: string,
  password: string,
): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

// Register form validation
export interface RegisterFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

export const validateRegisterForm = (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
  role: string,
): RegisterFormErrors => {
  const errors: RegisterFormErrors = {};

  const nameError = validateFullName(fullName);
  if (nameError) errors.fullName = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validatePasswordConfirm(password, confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  const roleError = validateRole(role);
  if (roleError) errors.role = roleError;

  return errors;
};

// Forgot password form validation
export interface ForgotPasswordFormErrors {
  email?: string;
}

export const validateForgotPasswordForm = (
  email: string,
): ForgotPasswordFormErrors => {
  const errors: ForgotPasswordFormErrors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  return errors;
};

// Reset password form validation
export interface ResetPasswordFormErrors {
  newPassword?: string;
  confirmPassword?: string;
}

export const validateResetPasswordForm = (
  newPassword: string,
  confirmPassword: string,
): ResetPasswordFormErrors => {
  const errors: ResetPasswordFormErrors = {};

  const passwordError = validatePassword(newPassword);
  if (passwordError) errors.newPassword = passwordError;

  const confirmError = validatePasswordConfirm(newPassword, confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  return errors;
};
