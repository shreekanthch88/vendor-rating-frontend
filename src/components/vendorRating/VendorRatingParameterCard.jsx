/**
 * =========================================================
 * VENDOR RATING PARAMETER CARD
 * =========================================================
 *
 * Displays ONE vendor-rating parameter.
 *
 * Data source:
 *     Backend VendorRating document
 *
 * This component does NOT:
 * - calculate scores
 * - create scores
 * - use mock data
 * - change backend data
 *
 * It only displays the values supplied by the backend.
 *
 * =========================================================
 */

const VendorRatingParameterCard = ({
  title,
  parameter,
  description = "",
}) => {

  /**
   * =======================================================
   * SCORE FORMAT
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

    const value = Number(score);

    if (Number.isNaN(value)) {
      return "—";
    }

    return value.toFixed(1);
  };


  /**
   * =======================================================
   * SCORE CLASS
   * =======================================================
   *
   * Visual indication only.
   * It does not modify the actual score.
   */

  const getScoreClass = (score) => {

    if (
      score === null ||
      score === undefined
    ) {
      return "text-gray-400";
    }

    const value = Number(score);

    if (value >= 95) {
      return "text-green-700";
    }

    if (value >= 85) {
      return "text-green-600";
    }

    if (value >= 70) {
      return "text-amber-600";
    }

    if (value >= 50) {
      return "text-orange-600";
    }

    return "text-red-600";
  };


  /**
   * =======================================================
   * ADJUSTMENT CLASS
   * =======================================================
   */

  const getAdjustmentClass = (
    adjustment
  ) => {

    if (
      adjustment === null ||
      adjustment === undefined ||
      Number(adjustment) === 0
    ) {
      return "text-gray-500";
    }

    return Number(adjustment) > 0
      ? "text-green-600"
      : "text-red-600";
  };


  /**
   * =======================================================
   * EMPTY PARAMETER
   * =======================================================
   */

  if (!parameter) {

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <div className="flex items-center justify-between">

          <h3 className="font-semibold text-gray-900">
            {title}
          </h3>

          <span className="text-sm text-gray-400">
            —
          </span>

        </div>

        <p className="mt-2 text-sm text-gray-500">
          No backend data is available for this parameter.
        </p>

      </div>
    );
  }


  const systemScore =
    parameter.systemScore;

  const evaluatorScore =
    parameter.evaluatorScore;

  const finalScore =
    parameter.finalScore;

  const weight =
    parameter.weight;

  const adjustment =
    parameter.adjustment;

  const adjustmentReason =
    parameter.adjustmentReason;


  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b border-gray-100 p-5">

        <div className="flex items-start justify-between gap-4">

          <div>

            <h3 className="text-base font-semibold text-gray-900">
              {title}
            </h3>

            {description && (
              <p className="mt-1 text-xs leading-5 text-gray-500">
                {description}
              </p>
            )}

          </div>


          <div className="shrink-0 rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
            {weight !== null &&
            weight !== undefined
              ? `${weight}%`
              : "—"}
          </div>

        </div>

      </div>


      {/* =================================================
          FINAL SCORE
      ================================================= */}

      <div className="p-5">

        <div className="rounded-lg bg-gray-50 p-4">

          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Final Score
          </p>

          <p
            className={`mt-1 text-3xl font-bold ${getScoreClass(
              finalScore
            )}`}
          >
            {formatScore(
              finalScore
            )}

            <span className="ml-1 text-sm font-medium text-gray-400">
              /100
            </span>
          </p>

        </div>


        {/* =================================================
            SCORE BREAKDOWN
        ================================================= */}

        <div className="mt-5 space-y-3">

          {/* System Score */}

          <div className="flex items-center justify-between">

            <span className="text-sm text-gray-600">
              System Score
            </span>

            <span className="font-medium text-gray-900">
              {formatScore(
                systemScore
              )}
            </span>

          </div>


          {/* Evaluator Score */}

          <div className="flex items-center justify-between">

            <span className="text-sm text-gray-600">
              Evaluator Score
            </span>

            <span className="font-medium text-gray-900">
              {formatScore(
                evaluatorScore
              )}
            </span>

          </div>


          {/* Adjustment */}

          <div className="flex items-center justify-between">

            <span className="text-sm text-gray-600">
              Adjustment
            </span>

            <span
              className={`font-medium ${getAdjustmentClass(
                adjustment
              )}`}
            >
              {adjustment === null ||
              adjustment === undefined
                ? "—"
                : Number(adjustment) > 0
                  ? `+${Number(adjustment).toFixed(1)}`
                  : Number(adjustment).toFixed(1)}
            </span>

          </div>

        </div>


        {/* =================================================
            ADJUSTMENT REASON
        ================================================= */}

        {adjustmentReason && (
          <div className="mt-5 rounded-lg border border-amber-100 bg-amber-50 p-3">

            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              Adjustment Reason
            </p>

            <p className="mt-1 text-sm leading-5 text-amber-900">
              {adjustmentReason}
            </p>

          </div>
        )}

      </div>

    </div>
  );
};


export default VendorRatingParameterCard;