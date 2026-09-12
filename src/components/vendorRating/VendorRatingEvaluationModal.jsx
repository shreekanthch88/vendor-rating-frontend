import { useEffect, useState } from "react";

import Modal from "../../common/Modal";
import Button from "../../common/Button";
import Input from "../../common/Input";

import {
  updateEvaluatorScores,
} from "../../services/vendorRatingService";

/**
 * =========================================================
 * VENDOR RATING EVALUATION MODAL
 * =========================================================
 *
 * Purpose:
 *
 * Admin reviews the backend-generated vendor rating and can
 * enter evaluator scores for the individual parameters.
 *
 * IMPORTANT:
 *
 * - No mock scores
 * - No random data
 * - Existing system scores come from backend
 * - Existing weights come from backend
 * - Admin evaluator scores are sent to backend
 * - Backend remains responsible for final calculation
 *
 * =========================================================
 */

const VendorRatingEvaluationModal = ({
  isOpen,
  onClose,
  rating,
  onSuccess,
}) => {

  const [evaluatorScores, setEvaluatorScores] =
    useState({});

  const [adjustmentReasons, setAdjustmentReasons] =
    useState({});

  const [communication, setCommunication] =
    useState({
      score: "",
      rating: "",
      remarks: "",
    });

  const [remarks, setRemarks] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  /**
   * =======================================================
   * LOAD EXISTING BACKEND EVALUATION
   * =======================================================
   *
   * If evaluator scores already exist in MongoDB,
   * display those values.
   *
   * We never initialize scores with fake values.
   */

  useEffect(() => {

    if (!rating) {
      setEvaluatorScores({});
      setAdjustmentReasons({});
      setCommunication({
        score: "",
        rating: "",
        remarks: "",
      });
      setRemarks("");
      return;
    }


    setEvaluatorScores({
      delivery:
        rating?.delivery?.evaluatorScore ?? "",

      quality:
        rating?.quality?.evaluatorScore ?? "",

      fulfillment:
        rating?.fulfillment?.evaluatorScore ?? "",

      price:
        rating?.price?.evaluatorScore ?? "",

      responseTime:
        rating?.responseTime?.evaluatorScore ?? "",

      poAcceptance:
        rating?.poAcceptance?.evaluatorScore ?? "",

      documentation:
        rating?.documentation?.evaluatorScore ?? "",
    });

    setAdjustmentReasons({
      delivery:
        rating?.delivery?.adjustmentReason ?? "",

      quality:
        rating?.quality?.adjustmentReason ?? "",

      fulfillment:
        rating?.fulfillment?.adjustmentReason ?? "",

      price:
        rating?.price?.adjustmentReason ?? "",

      responseTime:
        rating?.responseTime?.adjustmentReason ?? "",

      poAcceptance:
        rating?.poAcceptance?.adjustmentReason ?? "",

      documentation:
        rating?.documentation?.adjustmentReason ?? "",
    });


    setCommunication({
      score:
        rating?.communication?.evaluatorScore ?? "",

      rating:
        rating?.communication?.rating ?? "",

      remarks:
        rating?.communication?.remarks ?? "",
    });


    setRemarks(
      rating?.remarks || ""
    );

  }, [rating]);


  /**
   * =======================================================
   * PARAMETER DEFINITIONS
   * =======================================================
   *
   * Labels are UI information.
   *
   * Scores and weights are read from the backend object.
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
  ];


  /**
   * =======================================================
   * UPDATE PARAMETER SCORE
   * =======================================================
   */

  const handleScoreChange = (
    key,
    value
  ) => {

    setEvaluatorScores(
      (previous) => ({
        ...previous,
        [key]: value,
      })
    );
  };

  /**
   * =======================================================
   * UPDATE ADJUSTMENT REASON
   * =======================================================
   */

  const handleReasonChange = (
    key,
    value
  ) => {

    setAdjustmentReasons(
      (previous) => ({
        ...previous,
        [key]: value,
      })
    );
  };


  /**
   * =======================================================
   * UPDATE COMMUNICATION
   * =======================================================
   */

  const handleCommunicationChange = (
    field,
    value
  ) => {

    setCommunication(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };


  /**
   * =======================================================
   * VALIDATE SCORE
   * =======================================================
   */

  const validateScore = (
    value
  ) => {

    if (
      value === "" ||
      value === null ||
      value === undefined
    ) {
      return true;
    }

    const numericValue =
      Number(value);

    return (
      !Number.isNaN(numericValue) &&
      numericValue >= 0 &&
      numericValue <= 100
    );
  };


  /**
   * =======================================================
   * SUBMIT EVALUATION
   * =======================================================
   */

  const handleSubmit = async () => {

    try {

      setError("");


      if (!rating?._id) {
        setError(
          "Vendor rating ID is missing."
        );
        return;
      }


      /**
       * Validate all entered parameter scores.
       */

      for (
        const parameter of parameters
      ) {

        const value =
          evaluatorScores[
            parameter.key
          ];


        if (
          !validateScore(value)
        ) {

          setError(
            `${parameter.label} score must be between 0 and 100.`
          );

          return;
        }

        // Validate adjustment reason when evaluator score overrides system score
        const sysVal = rating?.[parameter.key]?.systemScore;
        if (
          value !== "" &&
          value !== null &&
          value !== undefined &&
          sysVal !== null &&
          sysVal !== undefined &&
          Number(value) !== Number(sysVal)
        ) {
          const reason = (adjustmentReasons[parameter.key] || "").trim();
          if (!reason) {
            setError(
              `${parameter.label}: Adjustment reason is required when overriding system score (${sysVal} → ${value}).`
            );
            return;
          }
        }
      }


      /**
       * Communication score.
       */

      if (
        !validateScore(
          communication.score
        )
      ) {

        setError(
          "Communication score must be between 0 and 100."
        );

        return;
      }


      setSaving(true);


      /**
       * Convert empty strings to null and attach adjustment reasons.
       *
       * This avoids sending fake zero values.
       */

      const cleanedEvaluatorScores = {};

      parameters.forEach(
        (parameter) => {

          const value =
            evaluatorScores[
              parameter.key
            ];

          cleanedEvaluatorScores[
            parameter.key
          ] =
            value === "" ||
            value === null ||
            value === undefined
              ? null
              : Number(value);

          cleanedEvaluatorScores[
            `${parameter.key}AdjustmentReason`
          ] = (adjustmentReasons[parameter.key] || "").trim();
        }
      );


      const cleanedCommunication = {
        score:
          communication.score === "" ||
          communication.score === null ||
          communication.score === undefined
            ? null
            : Number(
                communication.score
              ),

        rating:
          communication.rating ||
          "",

        remarks:
          communication.remarks ||
          "",
      };


      /**
       * Send evaluation to backend.
       *
       * Backend calculates final scores.
       */

      const response =
        await updateEvaluatorScores(
          rating._id,
          {
            evaluatorScores:
              cleanedEvaluatorScores,

            communication:
              cleanedCommunication,

            remarks:
              remarks.trim(),
          }
        );


      if (onSuccess) {
        onSuccess(response);
      }


      onClose();

    } catch (err) {

      console.error(
        "Vendor Rating Evaluation Error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update vendor rating evaluation."
      );

    } finally {

      setSaving(false);
    }
  };


  /**
   * =======================================================
   * SCORE DISPLAY
   * =======================================================
   */

  const formatScore = (
    value
  ) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    return Number(value).toFixed(1);
  };


  /**
   * =======================================================
   * NO RATING
   * =======================================================
   */

  if (!rating) {
    return null;
  }


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Evaluate Vendor Rating"
    >

      <div className="space-y-6">

        {/* =================================================
            INFORMATION
        ================================================= */}

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">

          <p className="text-sm font-semibold text-blue-900">
            Evaluator Review
          </p>

          <p className="mt-1 text-sm leading-5 text-blue-800">
            Review the system-generated scores and enter
            evaluator scores where required. Final rating
            calculations are performed by the backend.
          </p>

        </div>


        {/* =================================================
            PARAMETER TABLE
        ================================================= */}

        <div>

          <div className="mb-3">

            <h3 className="text-sm font-semibold text-gray-900">
              Performance Parameters
            </h3>

          </div>


          <div className="overflow-x-auto rounded-lg border border-gray-200">

            <table className="min-w-full divide-y divide-gray-200">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Parameter
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Weight
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    System Score
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Evaluator Score
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100 bg-white">

                {parameters.map(
                  (parameter) => {

                    const data =
                      rating[
                        parameter.key
                      ] || {};


                    const evaluatorScore =
                      evaluatorScores[
                        parameter.key
                      ];


                    return (
                      <tr
                        key={
                          parameter.key
                        }
                      >

                        {/* Parameter */}

                        <td className="px-4 py-4">

                          <p className="text-sm font-medium text-gray-800">
                            {parameter.label}
                          </p>

                        </td>


                        {/* Weight */}

                        <td className="px-4 py-4 text-center">

                          <span className="text-sm font-medium text-gray-700">

                            {data.weight !==
                            null &&
                            data.weight !==
                            undefined
                              ? `${formatScore(
                                  data.weight
                                )}%`
                              : "—"}

                          </span>

                        </td>


                        {/* System Score */}

                        <td className="px-4 py-4 text-center">

                          <span className="font-semibold text-gray-900">

                            {formatScore(
                              data.systemScore ??
                              data.finalScore
                            )}

                          </span>

                          <span className="ml-1 text-xs text-gray-400">
                            /100
                          </span>

                        </td>


                        {/* Evaluator Score */}

                        <td className="px-4 py-4">

                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={
                              evaluatorScore
                            }
                            onChange={(event) =>
                              handleScoreChange(
                                parameter.key,
                                event.target.value
                              )
                            }
                            placeholder="Enter score"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />

                          {evaluatorScore !== "" &&
                            evaluatorScore !== null &&
                            evaluatorScore !== undefined &&
                            data.systemScore !== null &&
                            data.systemScore !== undefined &&
                            Number(evaluatorScore) !== Number(data.systemScore) && (
                              <div className="mt-2">
                                <input
                                  type="text"
                                  value={adjustmentReasons[parameter.key] || ""}
                                  onChange={(e) =>
                                    handleReasonChange(parameter.key, e.target.value)
                                  }
                                  placeholder="Adjustment reason (required) *"
                                  className="w-full rounded-md border border-amber-300 bg-amber-50/60 px-2.5 py-1.5 text-xs text-slate-800 outline-none placeholder:text-amber-700/60 focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500"
                                />
                              </div>
                            )}

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =================================================
            COMMUNICATION
        ================================================= */}

        <div className="rounded-lg border border-gray-200 p-4">

          <h3 className="text-sm font-semibold text-gray-900">
            Communication
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Communication is evaluator-assessed.
          </p>


          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>

              <label className="mb-1 block text-xs font-medium text-gray-600">
                Evaluator Score
              </label>

              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={
                  communication.score
                }
                onChange={(event) =>
                  handleCommunicationChange(
                    "score",
                    event.target.value
                  )
                }
                placeholder="Enter score"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            <div>

              <label className="mb-1 block text-xs font-medium text-gray-600">
                Rating
              </label>

              <select
                value={
                  communication.rating
                }
                onChange={(event) =>
                  handleCommunicationChange(
                    "rating",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Select rating
                </option>

                <option value="Excellent">
                  Excellent
                </option>

                <option value="Good">
                  Good
                </option>

                <option value="Average">
                  Average
                </option>

                <option value="Poor">
                  Poor
                </option>

              </select>

            </div>

          </div>


          <div className="mt-4">

            <label className="mb-1 block text-xs font-medium text-gray-600">
              Communication Remarks
            </label>

            <textarea
              rows={3}
              value={
                communication.remarks
              }
              onChange={(event) =>
                handleCommunicationChange(
                  "remarks",
                  event.target.value
                )
              }
              placeholder="Enter communication remarks..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </div>


        {/* =================================================
            GENERAL REMARKS
        ================================================= */}

        <div>

          <label className="mb-1 block text-xs font-medium text-gray-600">
            Evaluation Remarks
          </label>

          <textarea
            rows={4}
            value={remarks}
            onChange={(event) =>
              setRemarks(
                event.target.value
              )
            }
            placeholder="Enter overall evaluation remarks..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

            {error}

          </div>

        )}


        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>


          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Evaluation"}
          </Button>

        </div>

      </div>

    </Modal>
  );
};


export default VendorRatingEvaluationModal;