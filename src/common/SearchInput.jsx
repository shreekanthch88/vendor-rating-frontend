import React from "react";
import { Search, X, Loader2 } from "lucide-react";
import Input from "./Input";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  loading = false,
  className = "",
}) => {
  return (
    <Input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      leftIcon={<Search size={18} />}
      rightIcon={
        loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : value ? (
          <button
            type="button"
            onClick={() =>
              onChange({
                target: { value: "" },
              })
            }
            className="rounded p-1 hover:bg-gray-100"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        ) : null
      }
    />
  );
};

export default SearchInput;