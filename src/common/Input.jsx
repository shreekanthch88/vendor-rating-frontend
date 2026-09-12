import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`
            w-full
            rounded-xl
            border
            bg-white
            px-4
            py-2.5
            text-sm
            outline-none
            transition-all
            duration-200
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
            ${
              leftIcon
                ? "pl-10"
                : ""
            }
            ${
              (rightIcon || type === "password")
                ? "pr-10"
                : ""
            }
            ${
              error
                ? "border-red-500"
                : "border-gray-300"
            }
            ${
              disabled
                ? "cursor-not-allowed bg-gray-100"
                : ""
            }
            ${className}
          `}
          {...props}
        />

        {type === "password" ? (
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        ) : (
          rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )
        )}
      </div>

      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;