import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Layout from "../layout/Layout";

import {
  getVendorRatingById,
} from "../services/vendorRatingService";

import VendorRatingDashboardCards
  from "../components/vendorRating/VendorRatingDashboardCards";

import VendorRatingDetailsView
  from "../components/vendorRating/VendorRatingDetails";

import VendorRatingScoreBreakdown
  from "../components/vendorRating/VendorRatingScoreBreakdown";

import VendorRatingEvidence
  from "../components/vendorRating/VendorRatingEvidence";

import VendorRatingEvaluationModal
  from "../components/vendorRating/VendorRatingEvaluationModal";

import VendorRatingStatusBadge
  from "../components/vendorRating/VendorRatingStatusBadge";


const VendorRatingDetailsPage = () => {

  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();


  const [rating, setRating] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [evaluationOpen, setEvaluationOpen] =
    useState(false);


  // =======================================================
  // LOAD RATING
  // =======================================================

  const loadRating =
    useCallback(async () => {

      if (!id) {

        setError(
          "Vendor Rating ID is missing."
        );

        setLoading(false);

        return;
      }


      try {

        setLoading(true);

        setError("");


        const response =
          await getVendorRatingById(
            id
          );


        console.log(
          "[Vendor Rating Details] API response:",
          response
        );


        /*
         * vendorRatingService already returns response.data.
         *
         * Expected backend response:
         *
         * {
         *   success: true,
         *   rating: {...}
         * }
         */

        const ratingData =
          response?.rating ||
          response?.data?.rating ||
          response?.data ||
          response;


        if (!ratingData) {

          setRating(null);

          setError(
            "Vendor rating was not found."
          );

          return;
        }


        console.log(
          "[Vendor Rating Details] Rating:",
          ratingData
        );


        setRating(
          ratingData
        );

      } catch (err) {

        console.error(
          "[Vendor Rating Details] Load error:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load vendor rating."
        );

      } finally {

        setLoading(false);
      }

    }, [
      id,
    ]);


  useEffect(() => {

    loadRating();

  }, [
    loadRating,
  ]);


  // =======================================================
  // EVALUATION SUCCESS
  // =======================================================

  const handleEvaluationSuccess =
    async () => {

      setEvaluationOpen(false);

      /*
       * Re-read the rating from MongoDB.
       *
       * Do not calculate updated scores in frontend.
       */

      await loadRating();

    };


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (
      <Layout>

        <div className="flex min-h-[500px] items-center justify-center">

          <div className="text-sm text-gray-500">
            Loading vendor rating...
          </div>

        </div>

      </Layout>
    );
  }


  // =======================================================
  // ERROR
  // =======================================================

  if (error) {

    return (
      <Layout>

        <div className="space-y-5">

          <button
            type="button"
            onClick={() =>
              navigate("/ratings")
            }
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Vendor Ratings
          </button>


          <div className="rounded-xl border border-red-200 bg-red-50 p-6">

            <h2 className="font-semibold text-red-800">
              Unable to load vendor rating
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

          </div>

        </div>

      </Layout>
    );
  }


  // =======================================================
  // NOT FOUND
  // =======================================================

  if (!rating) {

    return (
      <Layout>

        <div className="space-y-5">

          <button
            type="button"
            onClick={() =>
              navigate("/ratings")
            }
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Vendor Ratings
          </button>


          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">

            <h2 className="font-semibold text-gray-900">
              Vendor rating not found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              No rating record was returned by the backend.
            </p>

          </div>

        </div>

      </Layout>
    );
  }


  // =======================================================
  // STATUS
  // =======================================================

  const status =
    rating?.status;


  // =======================================================
  // VENDOR
  // =======================================================

  const vendor =
    rating?.vendor || {};


  const vendorName =
    vendor?.vendorName ||
    vendor?.companyName ||
    "Vendor";


  const vendorCode =
    vendor?.vendorCode ||
    "—";


  // =======================================================
  // EVALUATION
  // =======================================================

  /*
   * Frontend only controls visibility.
   *
   * Backend remains responsible for authorization.
   */

  const canEvaluate =
    status !== "Locked";


  return (
    <Layout>

      <div className="space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

          <div>

            <button
              type="button"
              onClick={() =>
                navigate("/ratings")
              }
              className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              ← Back to Vendor Ratings
            </button>


            <h1 className="text-2xl font-semibold text-gray-900">
              Vendor Rating Details
            </h1>


            <p className="mt-1 text-sm text-gray-500">
              {vendorName}{" "}
              <span className="mx-1">
                •
              </span>
              {vendorCode}
            </p>

          </div>


          <div className="flex items-center gap-3">

            <VendorRatingStatusBadge
              status={
                status
              }
            />

            <button
              type="button"
              onClick={() =>
                navigate(`/ratings/${id}/delivery-calculation`)
              }
              className="flex items-center gap-1.5 rounded-lg border border-blue-600 bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-100 transition-colors"
            >
              <span>🚚</span>
              <span>Delivery Calculation</span>
            </button>

            {canEvaluate && (

              <button
                type="button"
                onClick={() =>
                  setEvaluationOpen(
                    true
                  )
                }
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Evaluate Rating
              </button>

            )}

          </div>

        </div>


        {/* =================================================
            DASHBOARD CARDS
        ================================================= */}

        <VendorRatingDashboardCards
          rating={
            rating
          }
        />


        {/* =================================================
            COMPLETE RATING DETAILS
        ================================================= */}

        <VendorRatingDetailsView
          rating={
            rating
          }
        />


        {/* =================================================
            SCORE BREAKDOWN
        ================================================= */}

        <VendorRatingScoreBreakdown
          rating={
            rating
          }
        />


        {/* =================================================
            RATING EVIDENCE
        ================================================= */}

        <VendorRatingEvidence
          rating={
            rating
          }
        />


        {/* =================================================
            EVALUATION MODAL
        ================================================= */}

        <VendorRatingEvaluationModal
          isOpen={
            evaluationOpen
          }

          onClose={() =>
            setEvaluationOpen(
              false
            )
          }

          rating={
            rating
          }

          onSuccess={
            handleEvaluationSuccess
          }
        />

      </div>

    </Layout>
  );
};


export default VendorRatingDetailsPage;