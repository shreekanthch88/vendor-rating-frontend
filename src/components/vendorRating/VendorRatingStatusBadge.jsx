/**
 * =========================================================
 * VENDOR RATING STATUS BADGE
 * =========================================================
 *
 * Backend-supported rating statuses:
 *
 * Draft
 * Under Review
 * Submitted
 * Approved
 * Locked
 *
 * This component does NOT create or calculate status.
 * It only displays the status returned by the backend.
 *
 * =========================================================
 */

const VendorRatingStatusBadge = ({
  status,
}) => {

  /**
   * =======================================================
   * EMPTY STATUS
   * =======================================================
   */

  if (!status) {
    return (
      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
        —
      </span>
    );
  }


  /**
   * =======================================================
   * STATUS STYLES
   * =======================================================
   *
   * These are UI styles only.
   * They do not modify the backend status.
   * =======================================================
   */

  const statusStyles = {
    Draft:
      "border-gray-200 bg-gray-50 text-gray-700",

    "Under Review":
      "border-amber-200 bg-amber-50 text-amber-700",

    Submitted:
      "border-blue-200 bg-blue-50 text-blue-700",

    Approved:
      "border-green-200 bg-green-50 text-green-700",

    Locked:
      "border-purple-200 bg-purple-50 text-purple-700",
  };


  const className =
    statusStyles[status] ||
    "border-gray-200 bg-gray-50 text-gray-700";


  /**
   * =======================================================
   * DISPLAY
   * =======================================================
   */

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {status}
    </span>
  );
};


export default VendorRatingStatusBadge;