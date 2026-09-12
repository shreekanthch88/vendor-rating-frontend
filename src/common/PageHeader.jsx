import React from "react";
import { ChevronRight } from "lucide-react";

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  action,
  actions,
  className = "",
}) => {
  return (
    <div
      className={`mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      <div className="space-y-2">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center text-sm text-gray-500">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="mx-2 h-4 w-4" />
                )}

                {item.href ? (
                  <a
                    href={item.href}
                    className="transition-colors hover:text-blue-600"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {actions}
        {action}
      </div>
    </div>
  );
};

export default PageHeader;