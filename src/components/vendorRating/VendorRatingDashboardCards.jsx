/**
 * =========================================================
 * VENDOR RATING DASHBOARD CARDS
 * =========================================================
 *
 * Displays the individual vendor-rating parameters
 * returned by the backend.
 *
 * No hardcoded rating values.
 * No random data.
 * No score calculation in frontend.
 *
 * Backend remains the source of truth.
 *
 * =========================================================
 */

const VendorRatingDashboardCards = ({
  rating,
}) => {

  /**
   * =======================================================
   * SCORE FORMATTER
   * =======================================================
   */

  const formatScore = (score) => {

    if (
      score === null ||
      score === undefined ||
      score === ""
    ) {
      return "—";
    }

    const numericScore =
      Number(score);

    if (
      Number.isNaN(numericScore)
    ) {
      return "—";
    }

    return numericScore.toFixed(1);
  };


  /**
   * =======================================================
   * SCORE COLOR
   * =======================================================
   *
   * UI indication only.
   * Does NOT change the backend score.
   * =======================================================
   */

  const getScoreClass = (score) => {

    if (
      score === null ||
      score === undefined
    ) {
      return "text-gray-400";
    }

    const numericScore =
      Number(score);

    if (numericScore >= 95) {
      return "text-green-700";
    }

    if (numericScore >= 85) {
      return "text-green-600";
    }

    if (numericScore >= 70) {
      return "text-amber-600";
    }

    if (numericScore >= 50) {
      return "text-orange-600";
    }

    return "text-red-600";
  };


  /**
   * =======================================================
   * PARAMETER CARD
   * =======================================================
   */

  const ParameterCard = ({
    title,
    parameter,
  }) => {

    const score =
      parameter?.finalScore;


    const weight =
      parameter?.weight;


    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <div className="flex items-start justify-between gap-3">

          <div>

            <p className="text-sm font-medium text-gray-500">
              {title}
            </p>

            <p
              className={`mt-2 text-2xl font-bold ${getScoreClass(
                score
              )}`}
            >
              {formatScore(score)}
              <span className="ml-1 text-sm font-medium text-gray-400">
                /100
              </span>
            </p>

          </div>


          <div className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
            {weight !== null &&
            weight !== undefined
              ? `${weight}%`
              : "—"}
          </div>

        </div>

      </div>
    );
  };


  /**
   * =======================================================
   * EMPTY STATE
   * =======================================================
   */

  if (!rating) {

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">

        <p className="text-sm font-medium text-gray-700">
          No vendor rating data available.
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Rating information will appear here when it is
          available from the backend.
        </p>

      </div>
    );
  }


  /**
   * =======================================================
   * DATA
   * =======================================================
   *
   * These values come directly from the backend rating.
   * =======================================================
   */

  const overallScore =
    rating?.finalOverallScore;


  return (
    <div className="space-y-5">

      {/* =================================================
          OVERALL RATING
      ================================================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-medium text-gray-500">
              Overall Vendor Rating
            </p>

            <p
              className={`mt-1 text-4xl font-bold ${getScoreClass(
                overallScore
              )}`}
            >
              {formatScore(
                overallScore
              )}

              <span className="ml-2 text-base font-medium text-gray-400">
                /100
              </span>
            </p>

          </div>


          <div className="text-left sm:text-right">

            <p className="text-xs uppercase tracking-wide text-gray-400">
              Rating Category
            </p>

            <p className="mt-1 text-base font-semibold text-gray-800">
              {rating?.ratingCategory || "—"}
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          INDIVIDUAL PARAMETERS
      ================================================= */}

      <div>

        <div className="mb-3">

          <h2 className="text-base font-semibold text-gray-900">
            Performance Parameters
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Individual parameter scores calculated from the
            vendor's transaction history.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <ParameterCard
            title="Delivery Performance"
            parameter={
              rating?.delivery
            }
          />

          <ParameterCard
            title="Quality Performance"
            parameter={
              rating?.quality
            }
          />

          <ParameterCard
            title="Fulfillment"
            parameter={
              rating?.fulfillment
            }
          />

          <ParameterCard
            title="Price Competitiveness"
            parameter={
              rating?.price
            }
          />

          <ParameterCard
            title="Response Time"
            parameter={
              rating?.responseTime
            }
          />

          <ParameterCard
            title="PO Acceptance"
            parameter={
              rating?.poAcceptance
            }
          />

          <ParameterCard
            title="Documentation"
            parameter={
              rating?.documentation
            }
          />

          <ParameterCard
            title="Communication"
            parameter={
              rating?.communication
            }
          />

        </div>

      </div>

    </div>
  );
};


export default VendorRatingDashboardCards;