import React from "react";
import { Loader2 } from "lucide-react";

const sizes = {
  sm: {
    spinner: "h-5 w-5",
    text: "text-sm",
  },
  md: {
    spinner: "h-8 w-8",
    text: "text-base",
  },
  lg: {
    spinner: "h-12 w-12",
    text: "text-lg",
  },
};

const Loader = ({
  size = "md",
  text = "Loading...",
  fullScreen = false,
  className = "",
}) => {
  const currentSize = sizes[size] || sizes.md;

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <Loader2
        className={`${currentSize.spinner} animate-spin text-blue-600`}
      />

      {text && (
        <p className={`${currentSize.text} text-gray-600`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {content}
    </div>
  );
};

export default Loader;