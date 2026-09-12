import React from "react";
import Loader from "./Loader";

const Card = ({
  title,
  subtitle,
  actions,
  footer,
  loading = false,
  noPadding = false,
  shadow = "md",
  className = "",
  children,
}) => {
  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  return (
    <div
      className={`
        bg-white
        rounded-2xl
        border
        border-gray-200
        ${shadows[shadow]}
        ${className}
      `}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      <div className={noPadding ? "" : "p-6"}>
        {loading ? <Loader /> : children}
      </div>

      {footer && (
        <div className="border-t border-gray-200 px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;