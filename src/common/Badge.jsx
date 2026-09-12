import React from "react";

const variants = {
  success:
    "bg-green-100 text-green-700 border border-green-200",

  danger:
    "bg-red-100 text-red-700 border border-red-200",

  warning:
    "bg-yellow-100 text-yellow-700 border border-yellow-200",

  info:
    "bg-cyan-100 text-cyan-700 border border-cyan-200",

  primary:
    "bg-blue-100 text-blue-700 border border-blue-200",

  secondary:
    "bg-purple-100 text-purple-700 border border-purple-200",

  gray:
    "bg-gray-100 text-gray-700 border border-gray-200",
};

const sizes = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

const dotColors = {
  success: "bg-green-500",
  danger: "bg-red-500",
  warning: "bg-yellow-500",
  info: "bg-cyan-500",
  primary: "bg-blue-500",
  secondary: "bg-purple-500",
  gray: "bg-gray-500",
};

const Badge = ({
  children,
  variant = "primary",
  size = "md",
  rounded = true,
  dot = false,
  uppercase = false,
  className = "",
}) => {
  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        font-medium
        border
        ${variants[variant]}
        ${sizes[size]}
        ${rounded ? "rounded-full" : "rounded-lg"}
        ${uppercase ? "uppercase tracking-wide" : ""}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`h-2 w-2 rounded-full ${dotColors[variant]}`}
        />
      )}

      {children}
    </span>
  );
};

export default Badge;