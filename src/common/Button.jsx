import React from "react";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600",

  secondary:
    "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",

  success:
    "bg-green-600 hover:bg-green-700 text-white border border-green-600",

  danger:
    "bg-red-600 hover:bg-red-700 text-white border border-red-600",

  warning:
    "bg-yellow-500 hover:bg-yellow-600 text-white border border-yellow-500",

  outline:
    "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",

  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-700",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",

  md: "px-4 py-2 text-sm",

  lg: "px-5 py-3 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        font-medium
        transition-all
        duration-200
        shadow-sm
        disabled:opacity-60
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};

export default Button;