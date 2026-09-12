import React from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({
  icon,
  title = "No Data Found",
  description = "There are no records to display.",
  action,
  className = "",
}) => {
  const Icon = icon || Inbox;

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center ${className}`}
    >
      <div className="mb-4 rounded-full bg-blue-100 p-4">
        <Icon className="h-10 w-10 text-blue-600" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-gray-500">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;