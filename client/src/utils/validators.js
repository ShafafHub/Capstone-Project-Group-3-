// Email Validation
export const validateEmail = (email) => {
  if (!email) return "Email is required";

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? "" : "Invalid email format";
};

// Password Validation
export const validatePassword = (password) => {
  if (!password) return "Password is required";

  if (password.length < 6)
    return "Password must be at least 6 characters";

  return "";
};

// Required Field
export const validateRequired = (value, fieldName = "Field") => {
  if (!value || value.trim() === "")
    return `${fieldName} is required`;

  return "";
};