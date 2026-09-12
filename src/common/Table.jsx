import React from "react";
import Loader from "./Loader";

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No records found.",
  striped = false,
  className = "",
}) => {
  if (loading) {
    return <Loader text="Loading data..." />;
  }

  return (
    <div className={`overflow-x-auto rounded-xl border border-gray-200 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="sticky top-0 bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-6 py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-gray-600
                  ${column.className || ""}
                `}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row._id || row.id || rowIndex}
                className={`
                  hover:bg-blue-50 transition-colors
                  ${striped && rowIndex % 2 !== 0 ? "bg-gray-50" : ""}
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 text-sm text-gray-700 ${column.cellClassName || ""}`}
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;