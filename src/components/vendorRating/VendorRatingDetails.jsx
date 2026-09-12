import VendorRatingParameterCard from "./VendorRatingParameterCard";
import VendorRatingStatusBadge from "./VendorRatingStatusBadge";

/**
 * =========================================================
 * VENDOR RATING DETAILS
 * =========================================================
 *
 * Displays the complete VendorRating backend document.
 *
 * Includes:
 *
 * 1. Vendor information
 * 2. Overall rating
 * 3. Eight rating parameters
 * 4. Evaluation period
 * 5. Quality evidence
 * 6. Deviation information
 * 7. Damage information
 * 8. Re-inspection summary
 * 9. Replacement summary
 * 10. Transaction summary
 * 11. Evaluation / approval / lock information
 *
 * IMPORTANT:
 *
 * No score is calculated here.
 * No mock data is used.
 *
 * Backend remains the source of truth.
 *
 * =========================================================
 */

const VendorRatingDetails = ({
  rating,
}) => {

  /**
   * =======================================================
   * EMPTY STATE
   * =======================================================
   */

  if (!rating) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">

        <p className="text-sm font-semibold text-gray-800">
          Vendor rating not available
        </p>

        <p className="mt-1 text-sm text-gray-500">
          No rating data was received from the backend.
        </p>

      </div>
    );
  }


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

    const number =
      Number(value);

    if (
      Number.isNaN(number)
    ) {
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

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
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
   * VENDOR
   * =======================================================
   */

  const vendor =
    rating.vendor || {};


  const vendorName =
    vendor.vendorName ||
    vendor.companyName ||
    "—";


  const vendorCode =
    vendor.vendorCode ||
    "—";


  /**
   * =======================================================
   * QUALITY
   * =======================================================
   */

  const quality =
    rating.quality || {};


  /**
   * =======================================================
   * FULFILLMENT
   * =======================================================
   */

  const fulfillment =
    rating.fulfillment || {};


  /**
   * =======================================================
   * REPLACEMENT
   * =======================================================
   */

  const replacement =
    rating.replacementSummary || {};


  /**
   * =======================================================
   * RE-INSPECTION
   * =======================================================
   */

  const reInspection =
    rating.reInspectionSummary || {};


  /**
   * =======================================================
   * TRANSACTION
   * =======================================================
   */

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
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-2.5 last:border-b-0">

      <span className="text-sm text-gray-600">
        {label}
      </span>

      <span className="text-sm font-semibold text-gray-900">
        {value}
      </span>

    </div>
  );


  /**
   * =======================================================
   * SECTION HEADER
   * =======================================================
   */

  const SectionHeader = ({
    title,
    description,
  }) => (
    <div className="mb-4">

      <h2 className="text-lg font-semibold text-gray-900">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      )}

    </div>
  );


  return (
    <div className="space-y-6">

      {/* =================================================
          VENDOR HEADER
      ================================================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Vendor
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-gray-900">
              {vendorName}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {vendorCode}
            </p>

          </div>


          <div className="flex flex-wrap items-center gap-3">

            <VendorRatingStatusBadge
              status={
                rating.status
              }
            />

            <div className="rounded-lg border border-gray-200 px-4 py-2">

              <p className="text-xs text-gray-400">
                Overall Score
              </p>

              <p className="text-xl font-bold text-gray-900">

                {rating.finalOverallScore !==
                null &&
                rating.finalOverallScore !==
                undefined
                  ? Number(
                      rating.finalOverallScore
                    ).toFixed(1)
                  : "—"}

                <span className="ml-1 text-xs font-medium text-gray-400">
                  /100
                </span>

              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          EVALUATION PERIOD
      ================================================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <SectionHeader
          title="Evaluation Period"
          description="The period covered by this vendor evaluation."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              From
            </p>

            <p className="mt-1 font-semibold text-gray-800">
              {formatDate(
                rating
                  ?.evaluationPeriod
                  ?.fromDate
              )}
            </p>

          </div>


          <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              To
            </p>

            <p className="mt-1 font-semibold text-gray-800">
              {formatDate(
                rating
                  ?.evaluationPeriod
                  ?.toDate
              )}
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          PARAMETER SCORES
      ================================================= */}

      <div>

        <SectionHeader
          title="Vendor Performance Parameters"
          description="System and evaluator scores for all approved rating parameters."
        />


        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          <VendorRatingParameterCard
            title="Delivery Performance"
            description="Measures delivery performance against committed delivery dates."
            parameter={
              rating.delivery
            }
          />


          <VendorRatingParameterCard
            title="Quality Performance"
            description="Measures inspection outcomes, rejection, damage and approved deviations."
            parameter={
              rating.quality
            }
          />


          <VendorRatingParameterCard
            title="Fulfillment"
            description="Measures final fulfilled quantity against the ordered quantity."
            parameter={
              rating.fulfillment
            }
          />


          <VendorRatingParameterCard
            title="Price Competitiveness"
            description="Measures vendor pricing against the available reference cost."
            parameter={
              rating.price
            }
          />


          <VendorRatingParameterCard
            title="Response Time"
            description="Measures vendor response time for purchase orders."
            parameter={
              rating.responseTime
            }
          />


          <VendorRatingParameterCard
            title="PO Acceptance"
            description="Measures accepted purchase orders against evaluated purchase orders."
            parameter={
              rating.poAcceptance
            }
          />


          <VendorRatingParameterCard
            title="Documentation"
            description="Measures completeness and verification of procurement documentation."
            parameter={
              rating.documentation
            }
          />


          <VendorRatingParameterCard
            title="Communication"
            description="Evaluator-assessed vendor communication performance."
            parameter={
              rating.communication
            }
          />

        </div>

      </div>


      {/* =================================================
          QUALITY EVIDENCE
      ================================================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <SectionHeader
          title="Quality Evidence"
          description="Inspection results used to support the quality performance score."
        />


        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-lg border border-gray-100 p-4">

            <p className="text-xs text-gray-500">
              Inspected Quantity
            </p>

            <p className="mt-1 text-xl font-semibold text-gray-900">
              {formatNumber(
                quality.inspectedQuantity
              )}
            </p>

          </div>


          <div className="rounded-lg border border-gray-100 p-4">

            <p className="text-xs text-gray-500">
              Rejected Quantity
            </p>

            <p className="mt-1 text-xl font-semibold text-red-600">
              {formatNumber(
                quality.totalRejectedQuantity
              )}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Rejection:{" "}
              {quality.rejectionPercentage !==
              undefined
                ? `${formatNumber(
                    quality.rejectionPercentage
                  )}%`
                : "—"}
            </p>

          </div>


          <div className="rounded-lg border border-gray-100 p-4">

            <p className="text-xs text-gray-500">
              Damaged Quantity
            </p>

            <p className="mt-1 text-xl font-semibold text-orange-600">
              {formatNumber(
                quality.totalDamagedQuantity
              )}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Damage:{" "}
              {quality.damagePercentage !==
              undefined
                ? `${formatNumber(
                    quality.damagePercentage
                  )}%`
                : "—"}
            </p>

          </div>


          <div className="rounded-lg border border-gray-100 p-4">

            <p className="text-xs text-gray-500">
              Re-inspections
            </p>

            <p className="mt-1 text-xl font-semibold text-gray-900">
              {formatNumber(
                quality.reInspectionCount
              )}
            </p>

          </div>

        </div>


        {/* =================================================
            DETAILED QUALITY RESULTS
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

          <div>

            <h3 className="mb-2 text-sm font-semibold text-gray-800">
              Accepted / Rejected
            </h3>

            <div className="rounded-lg border border-gray-100 px-4">

              <EvidenceRow
                label="Normal Accepted"
                value={formatNumber(
                  quality.normalAcceptedQuantity
                )}
              />

              <EvidenceRow
                label="Normal Rejected"
                value={formatNumber(
                  quality.normalRejectedQuantity
                )}
              />

              <EvidenceRow
                label="Total Rejected"
                value={formatNumber(
                  quality.totalRejectedQuantity
                )}
              />

            </div>

          </div>


          <div>

            <h3 className="mb-2 text-sm font-semibold text-gray-800">
              Deviation
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

              <EvidenceRow
                label="Deviation Cases"
                value={formatNumber(
                  quality.deviationCount
                )}
              />

            </div>

          </div>


          <div>

            <h3 className="mb-2 text-sm font-semibold text-gray-800">
              Damage
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


          <div>

            <h3 className="mb-2 text-sm font-semibold text-gray-800">
              Quality Percentage
            </h3>

            <div className="rounded-lg border border-gray-100 px-4">

              <EvidenceRow
                label="Rejection Percentage"
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
                label="Defect Percentage"
                value={
                  quality.defectPercentage !==
                  undefined
                    ? `${formatNumber(
                        quality.defectPercentage
                      )}%`
                    : "—"
                }
              />

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          FULFILLMENT EVIDENCE
      ================================================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <SectionHeader
          title="Fulfillment Evidence"
          description="Original fulfillment and replacement fulfillment are shown separately."
        />


        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-xs text-gray-500">
              Ordered
            </p>

            <p className="mt-1 text-xl font-semibold text-gray-900">
              {formatNumber(
                fulfillment.orderedQuantity
              )}
            </p>

          </div>


          <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-xs text-gray-500">
              Dispatched
            </p>

            <p className="mt-1 text-xl font-semibold text-gray-900">
              {formatNumber(
                fulfillment.dispatchedQuantity
              )}
            </p>

          </div>


          <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-xs text-gray-500">
              Received
            </p>

            <p className="mt-1 text-xl font-semibold text-gray-900">
              {formatNumber(
                fulfillment.receivedQuantity
              )}
            </p>

          </div>


          <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-xs text-gray-500">
              Final Fulfilled
            </p>

            <p className="mt-1 text-xl font-semibold text-green-700">
              {formatNumber(
                fulfillment.finalFulfilledQuantity
              )}
            </p>

          </div>

        </div>


        <div className="mt-5 rounded-lg border border-gray-100 px-4">

          <EvidenceRow
            label="Original Accepted"
            value={formatNumber(
              fulfillment.originalAcceptedQuantity
            )}
          />

          <EvidenceRow
            label="Replacement Requested"
            value={formatNumber(
              fulfillment.replacementRequestedQuantity
            )}
          />

          <EvidenceRow
            label="Replacement Approved"
            value={formatNumber(
              fulfillment.replacementApprovedQuantity
            )}
          />

          <EvidenceRow
            label="Replacement Dispatched"
            value={formatNumber(
              fulfillment.replacementDispatchedQuantity
            )}
          />

          <EvidenceRow
            label="Replacement Received"
            value={formatNumber(
              fulfillment.replacementReceivedQuantity
            )}
          />

          <EvidenceRow
            label="Replacement Accepted"
            value={formatNumber(
              fulfillment.replacementAcceptedQuantity
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

      </div>


      {/* =================================================
          REPLACEMENT SUMMARY
      ================================================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <SectionHeader
          title="Replacement Summary"
          description="Replacement activity supporting the vendor performance evaluation."
        />


        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-lg border border-gray-100 p-4">

            <p className="text-xs text-gray-500">
              Requests
            </p>

            <p className="mt-1 text-xl font-semibold text-gray-900">
              {formatNumber(
                replacement.requestCount
              )}
            </p>

          </div>


          <div className="rounded-lg border border-gray-100 p-4">

            <p className="text-xs text-gray-500">
              Requested Quantity
            </p>

            <p className="mt-1 text-xl font-semibold text-gray-900">
              {formatNumber(
                replacement.requestedQuantity
              )}
            </p>

          </div>


          <div className="rounded-lg border border-gray-100 p-4">

            <p className="text-xs text-gray-500">
              Replacement Accepted
            </p>

            <p className="mt-1 text-xl font-semibold text-green-700">
              {formatNumber(
                replacement.acceptedQuantity
              )}
            </p>

          </div>


          <div className="rounded-lg border border-gray-100 p-4">

            <p className="text-xs text-gray-500">
              Replacement Pending
            </p>

            <p className="mt-1 text-xl font-semibold text-amber-600">
              {formatNumber(
                replacement.pendingQuantity
              )}
            </p>

          </div>

        </div>


        <div className="mt-5 rounded-lg border border-gray-100 px-4">

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
            label="Rejected Quantity"
            value={formatNumber(
              replacement.rejectedQuantity
            )}
          />

          <EvidenceRow
            label="Damaged Quantity"
            value={formatNumber(
              replacement.damagedQuantity
            )}
          />

          <EvidenceRow
            label="Average Response"
            value={
              replacement.averageResponseHours !==
              undefined
                ? `${formatNumber(
                    replacement.averageResponseHours
                  )} hrs`
                : "—"
            }
          />

          <EvidenceRow
            label="Average Delivery Delay"
            value={
              replacement.averageDeliveryDelayDays !==
              undefined
                ? `${formatNumber(
                    replacement.averageDeliveryDelayDays
                  )} days`
                : "—"
            }
          />

        </div>

      </div>


      {/* =================================================
          RE-INSPECTION SUMMARY
      ================================================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <SectionHeader
          title="Re-inspection Summary"
          description="Results from re-inspection activities related to rejected, damaged or conditionally accepted materials."
        />


        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-xs text-gray-500">
              Re-inspections
            </p>

            <p className="mt-1 text-xl font-semibold text-gray-900">
              {formatNumber(
                reInspection.totalReInspections
              )}
            </p>

          </div>


          <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-xs text-gray-500">
              Inspected
            </p>

            <p className="mt-1 text-xl font-semibold text-gray-900">
              {formatNumber(
                reInspection.inspectedQuantity
              )}
            </p>

          </div>


          <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-xs text-gray-500">
              Accepted
            </p>

            <p className="mt-1 text-xl font-semibold text-green-700">
              {formatNumber(
                reInspection.acceptedQuantity
              )}
            </p>

          </div>


          <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-xs text-gray-500">
              Rejected
            </p>

            <p className="mt-1 text-xl font-semibold text-red-600">
              {formatNumber(
                reInspection.rejectedQuantity
              )}
            </p>

          </div>


          <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-xs text-gray-500">
              Damaged
            </p>

            <p className="mt-1 text-xl font-semibold text-orange-600">
              {formatNumber(
                reInspection.damagedQuantity
              )}
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          TRANSACTION SUMMARY
      ================================================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <SectionHeader
          title="Transaction Summary"
          description="Purchase transaction totals used for this evaluation."
        />


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <EvidenceRow
            label="Purchase Orders"
            value={formatNumber(
              transaction.totalPurchaseOrders
            )}
          />

          <EvidenceRow
            label="Completed POs"
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


      {/* =================================================
          COMPLAINT
      ================================================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <SectionHeader
          title="Complaint Evaluation"
          description="Complaint evaluation is conditional and does not automatically reduce the vendor's 100% weighted rating."
        />


        {rating.complaint?.applicable ? (

          <div className="rounded-lg border border-gray-100 px-4">

            <EvidenceRow
              label="Complaint Count"
              value={formatNumber(
                rating.complaint.complaintCount
              )}
            />

            <EvidenceRow
              label="Resolved Complaints"
              value={formatNumber(
                rating.complaint.resolvedComplaintCount
              )}
            />

            <EvidenceRow
              label="Open Complaints"
              value={formatNumber(
                rating.complaint.openComplaintCount
              )}
            />

            <EvidenceRow
              label="Average Resolution"
              value={
                rating.complaint.averageResolutionDays !==
                undefined
                  ? `${formatNumber(
                      rating.complaint.averageResolutionDays
                    )} days`
                  : "—"
              }
            />

          </div>

        ) : (

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

            <p className="text-sm font-medium text-gray-700">
              Not Applicable
            </p>

            <p className="mt-1 text-sm text-gray-500">
              No complaint evaluation is applicable for
              this rating period.
            </p>

          </div>

        )}

      </div>


      {/* =================================================
          EVALUATION WORKFLOW
      ================================================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <SectionHeader
          title="Evaluation Workflow"
          description="Audit information for evaluation, approval and locking."
        />


        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          <div>

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Evaluated By
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {rating?.evaluatedBy?.name ||
                rating?.evaluatedBy?.email ||
                "—"}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {formatDate(
                rating.evaluatedAt
              )}
            </p>

          </div>


          <div>

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Approved By
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {rating?.approvedBy?.name ||
                rating?.approvedBy?.email ||
                "—"}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {formatDate(
                rating.approvedAt
              )}
            </p>

          </div>


          <div>

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Locked By
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {rating?.lockedBy?.name ||
                rating?.lockedBy?.email ||
                "—"}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {formatDate(
                rating.lockedAt
              )}
            </p>

          </div>

        </div>


        {rating.remarks && (

          <div className="mt-5 rounded-lg border border-gray-100 bg-gray-50 p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Evaluation Remarks
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-700">
              {rating.remarks}
            </p>

          </div>

        )}

      </div>

    </div>
  );
};


export default VendorRatingDetails;