/**
 * =========================================================
 * VENDOR RATING EVIDENCE
 * =========================================================
 *
 * Displays backend evidence used for Vendor Rating.
 *
 * Evidence includes:
 *
 * - Purchase Orders
 * - Delivery
 * - Dispatches
 * - Goods Receipts
 * - Quality Inspection
 * - Rejected Quantity
 * - Damaged Quantity
 * - Deviation Accepted / Rejected
 * - Re-inspection
 * - Replacement
 * - Fulfillment
 * - Response
 * - Documentation
 *
 * IMPORTANT:
 *
 * No mock data.
 * No random values.
 * No frontend calculations.
 *
 * Backend is the source of truth.
 *
 * =========================================================
 */

const VendorRatingEvidence = ({
  rating,
}) => {

  /**
   * =======================================================
   * FORMAT NUMBER
   * =======================================================
   */

  const formatNumber = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return "—";
    }

    return number.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    );
  };


  /**
   * =======================================================
   * FORMAT DATE
   * =======================================================
   */

  const formatDate = (value) => {

    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  /**
   * =======================================================
   * GENERIC VALUE
   * =======================================================
   */

  const displayValue = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    return value;
  };


  /**
   * =======================================================
   * EMPTY STATE
   * =======================================================
   */

  if (!rating) {

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">

        <p className="text-sm font-medium text-gray-700">
          Rating evidence unavailable.
        </p>

        <p className="mt-1 text-sm text-gray-500">
          No vendor rating data was received from the backend.
        </p>

      </div>
    );
  }


  const delivery =
    rating.delivery || {};

  const quality =
    rating.quality || {};

  const fulfillment =
    rating.fulfillment || {};

  const responseTime =
    rating.responseTime || {};

  const poAcceptance =
    rating.poAcceptance || {};

  const documentation =
    rating.documentation || {};

  const replacement =
    rating.replacementSummary || {};

  const reInspection =
    rating.reInspectionSummary || {};

  const transaction =
    rating.transactionSummary || {};


  /**
   * =======================================================
   * EVIDENCE ROW
   * =======================================================
   */

  const EvidenceRow = ({
    label,
    value,
  }) => (

    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">

      <span className="text-sm text-gray-600">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-gray-900">
        {displayValue(value)}
      </span>

    </div>
  );


  /**
   * =======================================================
   * SECTION
   * =======================================================
   */

  const Section = ({
    title,
    description,
    children,
  }) => (

    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

      <div className="border-b border-gray-100 p-5">

        <h2 className="text-base font-semibold text-gray-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}

      </div>

      <div className="p-5">
        {children}
      </div>

    </section>
  );


  return (
    <div className="space-y-5">

      {/* =================================================
          TRANSACTION EVIDENCE
      ================================================= */}

      <Section
        title="Purchase Transaction Evidence"
        description="Actual purchase activity used by the rating calculation."
      >

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div className="rounded-lg border border-gray-100 px-4">

            <EvidenceRow
              label="Total Purchase Orders"
              value={formatNumber(
                transaction.totalPurchaseOrders
              )}
            />

            <EvidenceRow
              label="Completed Purchase Orders"
              value={formatNumber(
                transaction.completedPurchaseOrders
              )}
            />

            <EvidenceRow
              label="Ordered Quantity"
              value={formatNumber(
                transaction.totalOrderedQuantity
              )}
            />

            <EvidenceRow
              label="Dispatched Quantity"
              value={formatNumber(
                transaction.totalDispatchedQuantity
              )}
            />

          </div>


          <div className="rounded-lg border border-gray-100 px-4">

            <EvidenceRow
              label="Received Quantity"
              value={formatNumber(
                transaction.totalReceivedQuantity
              )}
            />

            <EvidenceRow
              label="Accepted Quantity"
              value={formatNumber(
                transaction.totalAcceptedQuantity
              )}
            />

            <EvidenceRow
              label="Rejected Quantity"
              value={formatNumber(
                transaction.totalRejectedQuantity
              )}
            />

            <EvidenceRow
              label="Pending Quantity"
              value={formatNumber(
                transaction.totalPendingQuantity
              )}
            />

          </div>

        </div>

      </Section>


      {/* =================================================
          DELIVERY EVIDENCE
      ================================================= */}

      <Section
        title="Delivery Evidence"
        description="Delivery score evidence is based on actual committed and delivered dates."
      >

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div className="rounded-lg border border-gray-100 px-4">

            <EvidenceRow
              label="Evaluated Deliveries"
              value={formatNumber(
                delivery.evaluatedDeliveries
              )}
            />

            <EvidenceRow
              label="On-Time Deliveries"
              value={formatNumber(
                delivery.onTimeDeliveries
              )}
            />

            <EvidenceRow
              label="Delayed Deliveries"
              value={formatNumber(
                delivery.delayedDeliveries
              )}
            />

            <EvidenceRow
              label="Early Deliveries"
              value={formatNumber(
                delivery.earlyDeliveries
              )}
            />

          </div>


          <div className="rounded-lg border border-gray-100 px-4">

            <EvidenceRow
              label="Average Delay"
              value={
                delivery.averageDelayDays !==
                undefined
                  ? `${formatNumber(
                      delivery.averageDelayDays
                    )} days`
                  : "—"
              }
            />

            <EvidenceRow
              label="Maximum Delay"
              value={
                delivery.maximumDelayDays !==
                undefined
                  ? `${formatNumber(
                      delivery.maximumDelayDays
                    )} days`
                  : "—"
              }
            />

            <EvidenceRow
              label="On-Time Percentage"
              value={
                delivery.onTimePercentage !==
                undefined
                  ? `${formatNumber(
                      delivery.onTimePercentage
                    )}%`
                  : "—"
              }
            />

            <EvidenceRow
              label="Delivery Score"
              value={
                delivery.finalScore !==
                undefined
                  ? `${formatNumber(
                      delivery.finalScore
                    )}/100`
                  : "—"
              }
            />

          </div>

        </div>

      </Section>


      {/* =================================================
          QUALITY EVIDENCE
      ================================================= */}

      <Section
        title="Quality Inspection Evidence"
        description="Quality evidence comes from inspection and re-inspection results."
      >

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div className="rounded-lg border border-gray-100 px-4">

            <EvidenceRow
              label="Inspected Quantity"
              value={formatNumber(
                quality.inspectedQuantity
              )}
            />

            <EvidenceRow
              label="Accepted Quantity"
              value={formatNumber(
                quality.normalAcceptedQuantity
              )}
            />

            <EvidenceRow
              label="Rejected Quantity"
              value={formatNumber(
                quality.totalRejectedQuantity
              )}
            />

            <EvidenceRow
              label="Damaged Quantity"
              value={formatNumber(
                quality.totalDamagedQuantity
              )}
            />

          </div>


          <div className="rounded-lg border border-gray-100 px-4">

            <EvidenceRow
              label="Rejected Percentage"
              value={
                quality.rejectionPercentage !==
                undefined
                  ? `${formatNumber(
                      quality.rejectionPercentage
                    )}%`
                  : "—"
              }
            />

            <EvidenceRow
              label="Damage Percentage"
              value={
                quality.damagePercentage !==
                undefined
                  ? `${formatNumber(
                      quality.damagePercentage
                    )}%`
                  : "—"
              }
            />

            <EvidenceRow
              label="Deviation Quantity"
              value={formatNumber(
                quality.deviationQuantity
              )}
            />

            <EvidenceRow
              label="Deviation Cases"
              value={formatNumber(
                quality.deviationCount
              )}
            />

          </div>

        </div>


        {/* ===============================================
            DEVIATION
        =============================================== */}

        <div className="mt-5">

          <h3 className="mb-2 text-sm font-semibold text-gray-800">
            Deviation Outcome
          </h3>

          <div className="rounded-lg border border-gray-100 px-4">

            <EvidenceRow
              label="Deviation Quantity"
              value={formatNumber(
                quality.deviationQuantity
              )}
            />

            <EvidenceRow
              label="Deviation Accepted"
              value={formatNumber(
                quality.deviationAcceptedQuantity
              )}
            />

            <EvidenceRow
              label="Deviation Rejected"
              value={formatNumber(
                quality.deviationRejectedQuantity
              )}
            />

          </div>

        </div>


        {/* ===============================================
            DAMAGE
        =============================================== */}

        <div className="mt-5">

          <h3 className="mb-2 text-sm font-semibold text-gray-800">
            Damage Outcome
          </h3>

          <div className="rounded-lg border border-gray-100 px-4">

            <EvidenceRow
              label="Damaged Quantity"
              value={formatNumber(
                quality.damagedQuantity
              )}
            />

            <EvidenceRow
              label="Damage Accepted"
              value={formatNumber(
                quality.damagedAcceptedQuantity
              )}
            />

            <EvidenceRow
              label="Damage Rejected"
              value={formatNumber(
                quality.damagedRejectedQuantity
              )}
            />

          </div>

        </div>

      </Section>


      {/* =================================================
          RE-INSPECTION
      ================================================= */}

      <Section
        title="Re-inspection Evidence"
        description="Re-inspection results are shown separately from the original inspection."
      >

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div className="rounded-lg border border-gray-100 px-4">

            <EvidenceRow
              label="Total Re-inspections"
              value={formatNumber(
                reInspection.totalReInspections
              )}
            />

            <EvidenceRow
              label="Inspected Quantity"
              value={formatNumber(
                reInspection.inspectedQuantity
              )}
            />

            <EvidenceRow
              label="Accepted Quantity"
              value={formatNumber(
                reInspection.acceptedQuantity
              )}
            />

          </div>


          <div className="rounded-lg border border-gray-100 px-4">

            <EvidenceRow
              label="Rejected Quantity"
              value={formatNumber(
                reInspection.rejectedQuantity
              )}
            />

            <EvidenceRow
              label="Damaged Quantity"
              value={formatNumber(
                reInspection.damagedQuantity
              )}
            />

            <EvidenceRow
              label="Deviation Quantity"
              value={formatNumber(
                reInspection.deviationQuantity
              )}
            />

          </div>

        </div>

      </Section>


      {/* =================================================
          REPLACEMENT
      ================================================= */}

      <Section
        title="Replacement Evidence"
        description="Replacement quantities are tracked separately from the original rejected quantity."
      >

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div className="rounded-lg border border-gray-100 px-4">

            <EvidenceRow
              label="Replacement Requests"
              value={formatNumber(
                replacement.requestCount
              )}
            />

            <EvidenceRow
              label="Requested Quantity"
              value={formatNumber(
                replacement.requestedQuantity
              )}
            />

            <EvidenceRow
              label="Approved Quantity"
              value={formatNumber(
                replacement.approvedQuantity
              )}
            />

            <EvidenceRow
              label="Dispatched Quantity"
              value={formatNumber(
                replacement.dispatchedQuantity
              )}
            />

          </div>


          <div className="rounded-lg border border-gray-100 px-4">

            <EvidenceRow
              label="Received Quantity"
              value={formatNumber(
                replacement.receivedQuantity
              )}
            />

            <EvidenceRow
              label="Inspected Quantity"
              value={formatNumber(
                replacement.inspectedQuantity
              )}
            />

            <EvidenceRow
              label="Accepted Quantity"
              value={formatNumber(
                replacement.acceptedQuantity
              )}
            />

            <EvidenceRow
              label="Pending Quantity"
              value={formatNumber(
                replacement.pendingQuantity
              )}
            />

          </div>

        </div>

      </Section>


      {/* =================================================
          FULFILLMENT
      ================================================= */}

      <Section
        title="Fulfillment Evidence"
        description="Final fulfillment considers the complete procurement lifecycle."
      >

        <div className="rounded-lg border border-gray-100 px-4">

          <EvidenceRow
            label="Ordered Quantity"
            value={formatNumber(
              fulfillment.orderedQuantity
            )}
          />

          <EvidenceRow
            label="Original Fulfilled Quantity"
            value={formatNumber(
              fulfillment.originalAcceptedQuantity
            )}
          />

          <EvidenceRow
            label="Replacement Fulfilled Quantity"
            value={formatNumber(
              fulfillment.replacementAcceptedQuantity
            )}
          />

          <EvidenceRow
            label="Final Fulfilled Quantity"
            value={formatNumber(
              fulfillment.finalFulfilledQuantity
            )}
          />

          <EvidenceRow
            label="Pending Quantity"
            value={formatNumber(
              fulfillment.pendingQuantity
            )}
          />

          <EvidenceRow
            label="Fulfillment Percentage"
            value={
              fulfillment.fulfillmentPercentage !==
              undefined
                ? `${formatNumber(
                    fulfillment.fulfillmentPercentage
                  )}%`
                : "—"
            }
          />

        </div>

      </Section>


      {/* =================================================
          RESPONSE TIME
      ================================================= */}

      <Section
        title="Vendor Response Evidence"
        description="Evidence used to evaluate how quickly the vendor responds to procurement events."
      >

        <div className="rounded-lg border border-gray-100 px-4">

          <EvidenceRow
            label="Evaluated Responses"
            value={formatNumber(
              responseTime.evaluatedResponses
            )}
          />

          <EvidenceRow
            label="Average Response Time"
            value={
              responseTime.averageResponseHours !==
              undefined
                ? `${formatNumber(
                    responseTime.averageResponseHours
                  )} hrs`
                : "—"
            }
          />

          <EvidenceRow
            label="Fastest Response"
            value={
              responseTime.fastestResponseHours !==
              undefined
                ? `${formatNumber(
                    responseTime.fastestResponseHours
                  )} hrs`
                : "—"
            }
          />

          <EvidenceRow
            label="Slowest Response"
            value={
              responseTime.slowestResponseHours !==
              undefined
                ? `${formatNumber(
                    responseTime.slowestResponseHours
                  )} hrs`
                : "—"
            }
          />

        </div>

      </Section>


      {/* =================================================
          PO ACCEPTANCE
      ================================================= */}

      <Section
        title="Purchase Order Acceptance Evidence"
        description="Actual purchase-order acceptance behaviour."
      >

        <div className="rounded-lg border border-gray-100 px-4">

          <EvidenceRow
            label="Total POs"
            value={formatNumber(
              poAcceptance.totalPOs
            )}
          />

          <EvidenceRow
            label="Accepted POs"
            value={formatNumber(
              poAcceptance.acceptedPOs
            )}
          />

          <EvidenceRow
            label="Rejected POs"
            value={formatNumber(
              poAcceptance.rejectedPOs
            )}
          />

          <EvidenceRow
            label="Acceptance Percentage"
            value={
              poAcceptance.acceptancePercentage !==
              undefined
                ? `${formatNumber(
                    poAcceptance.acceptancePercentage
                  )}%`
                : "—"
            }
          />

        </div>

      </Section>


      {/* =================================================
          DOCUMENTATION
      ================================================= */}

      <Section
        title="Documentation Evidence"
        description="Document compliance evidence used for the documentation score."
      >

        <div className="rounded-lg border border-gray-100 px-4">

          <EvidenceRow
            label="Documents Evaluated"
            value={formatNumber(
              documentation.totalDocuments
            )}
          />

          <EvidenceRow
            label="Correct Documents"
            value={formatNumber(
              documentation.correctDocuments
            )}
          />

          <EvidenceRow
            label="Incorrect Documents"
            value={formatNumber(
              documentation.incorrectDocuments
            )}
          />

          <EvidenceRow
            label="Missing Documents"
            value={formatNumber(
              documentation.missingDocuments
            )}
          />

          <EvidenceRow
            label="Documentation Percentage"
            value={
              documentation.accuracyPercentage !==
              undefined
                ? `${formatNumber(
                    documentation.accuracyPercentage
                  )}%`
                : "—"
            }
          />

        </div>

      </Section>


      {/* =================================================
          IMPORTANT AUDIT NOTE
      ================================================= */}

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">

        <p className="text-sm font-semibold text-blue-900">
          Rating Evidence Rule
        </p>

        <p className="mt-1 text-sm leading-6 text-blue-800">
          This screen displays the actual transaction,
          inspection, re-inspection and replacement evidence
          received from the backend. It does not recalculate
          or modify the vendor rating.
        </p>

      </div>

    </div>
  );
};


export default VendorRatingEvidence;