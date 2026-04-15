import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  fullWidth = false,
}) => {
  const baseStyle = "px-4 py-2 rounded-xl font-medium transition duration-200";

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    outline: "border border-black text-black hover:bg-black hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      }${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
