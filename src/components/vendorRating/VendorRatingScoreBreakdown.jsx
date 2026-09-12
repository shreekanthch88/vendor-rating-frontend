import { Link } from "react-router-dom";

/**
 * =========================================================
 * VENDOR RATING SCORE BREAKDOWN
 * =========================================================
 *
 * Displays the backend-generated weighted score breakdown.
 *
 * IMPORTANT:
 *
 * Frontend does NOT calculate the official rating.
 * Backend remains the source of truth.
 *
 * This component only displays:
 *
 * - Parameter
 * - Final Score
 * - Weight
 * - Weighted Contribution
 *
 * If backend provides weightedContribution,
 * that value is displayed directly.
 *
 * =========================================================
 */

const VendorRatingScoreBreakdown = ({
  rating,
}) => {

  /**
   * =======================================================
   * FORMAT SCORE
   * =======================================================
   */

  const formatScore = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    const number =
      Number(value);

    if (Number.isNaN(number)) {
      return "—";
    }

    return number.toFixed(2);
  };


  /**
   * =======================================================
   * PARAMETER DEFINITIONS
   * =======================================================
   *
   * These are parameter names only.
   *
   * Scores and weights come from backend.
   * =======================================================
   */

  const parameters = [
    {
      key: "delivery",
      label: "Delivery Performance",
    },
    {
      key: "quality",
      label: "Quality Performance",
    },
    {
      key: "fulfillment",
      label: "Order Fulfillment",
    },
    {
      key: "price",
      label: "Price Competitiveness",
    },
    {
      key: "responseTime",
      label: "Response Time",
    },
    {
      key: "poAcceptance",
      label: "PO Acceptance",
    },
    {
      key: "documentation",
      label: "Documentation",
    },
    {
      key: "communication",
      label: "Communication",
    },
  ];


  /**
   * =======================================================
   * EMPTY STATE
   * =======================================================
   */

  if (!rating) {

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">

        <p className="text-sm font-medium text-gray-700">
          Score breakdown unavailable.
        </p>

        <p className="mt-1 text-sm text-gray-500">
          No vendor rating data was received from the backend.
        </p>

      </div>
    );
  }


  /**
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b border-gray-100 p-6">

        <h2 className="text-lg font-semibold text-gray-900">
          Score Breakdown
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Weighted contribution of each vendor performance
          parameter.
        </p>

      </div>


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Parameter
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Final Score
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Weight
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Weighted Contribution
              </th>

            </tr>

          </thead>


          <tbody className="divide-y divide-gray-100">

            {parameters.map(
              (parameter) => {

                const data =
                  rating[
                    parameter.key
                  ];


                if (!data) {

                  return (
                    <tr
                      key={parameter.key}
                    >

                      <td className="px-5 py-4 text-sm font-medium text-gray-800">
                        {parameter.label}
                      </td>

                      <td className="px-5 py-4 text-center text-sm text-gray-400">
                        —
                      </td>

                      <td className="px-5 py-4 text-center text-sm text-gray-400">
                        —
                      </td>

                      <td className="px-5 py-4 text-right text-sm text-gray-400">
                        —
                      </td>

                    </tr>
                  );
                }


                return (
                  <tr
                    key={parameter.key}
                    className="hover:bg-gray-50"
                  >

                    {/* Parameter */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800">
                          {parameter.label}
                        </p>

                        {parameter.key === "delivery" && rating?._id && (
                          <Link
                            to={`/ratings/${rating._id}/delivery-calculation`}
                            className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 hover:underline"
                            title="View line-by-line delivery calculations"
                          >
                            <span>Transparency</span>
                            <span>→</span>
                          </Link>
                        )}
                      </div>

                    </td>


                    {/* Final Score */}

                    <td className="px-5 py-4 text-center">

                      <span className="font-semibold text-gray-900">
                        {formatScore(
                          data.finalScore
                        )}
                      </span>

                      <span className="ml-1 text-xs text-gray-400">
                        /100
                      </span>

                    </td>


                    {/* Weight */}

                    <td className="px-5 py-4 text-center">

                      {data.weight !==
                        null &&
                      data.weight !==
                        undefined
                        ? (
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                            {formatScore(
                              data.weight
                            )}
                            %
                          </span>
                        )
                        : (
                          <span className="text-sm text-gray-400">
                            —
                          </span>
                        )}

                    </td>


                    {/* Weighted Contribution */}

                    <td className="px-5 py-4 text-right">

                      {data.weightedContribution !==
                        null &&
                      data.weightedContribution !==
                        undefined
                        ? (
                          <span className="font-semibold text-gray-900">
                            {formatScore(
                              data.weightedContribution
                            )}
                          </span>
                        )
                        : (
                          <span className="text-sm text-gray-400">
                            —
                          </span>
                        )}

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>


          {/* =================================================
              FINAL SCORE
          ================================================= */}

          <tfoot className="border-t-2 border-gray-200 bg-gray-50">

            <tr>

              <td
                colSpan={3}
                className="px-5 py-4 text-right text-sm font-semibold text-gray-800"
              >
                Final Overall Score
              </td>

              <td className="px-5 py-4 text-right">

                <span className="text-xl font-bold text-gray-900">

                  {formatScore(
                    rating.finalOverallScore
                  )}

                </span>

                <span className="ml-1 text-xs text-gray-400">
                  /100
                </span>

              </td>

            </tr>

          </tfoot>

        </table>

      </div>


      {/* =================================================
          RATING CATEGORY
      ================================================= */}

      <div className="border-t border-gray-100 p-5">

        <div className="flex items-center justify-between gap-4">

          <span className="text-sm text-gray-500">
            Rating Category
          </span>

          <span className="font-semibold text-gray-900">
            {rating.ratingCategory ||
              "—"}
          </span>

        </div>

      </div>

    </div>
  );
};


export default VendorRatingScoreBreakdown;