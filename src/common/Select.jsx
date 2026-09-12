import React from "react";
import { ChevronDown } from "lucide-react";

const Select = ({
  label,
  name,
  value = "",
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  disabled = false,
  error,
  helperText,
  className = "",
  ...props
}) => {
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
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full
            appearance-none
            rounded-xl
            border
            bg-white
            px-4
            py-2.5
            pr-10
            text-sm
            text-gray-700
            outline-none
            transition-all
            duration-200
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
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
        >
          <option value="">
            {placeholder}
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
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

export default Select;