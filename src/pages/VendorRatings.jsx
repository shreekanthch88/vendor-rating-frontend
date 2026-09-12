import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Layout from "../layout/Layout";

import {
  getAllVendors,
} from "../services/vendorService";

import {
  getVendorRatings,
  generateVendorRating,
} from "../services/vendorRatingService";

import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import SearchInput from "../common/SearchInput";
import Select from "../common/Select";
import Pagination from "../common/Pagination";
import Button from "../common/Button";

import VendorRatingStatusBadge
  from "../components/vendorRating/VendorRatingStatusBadge";


/**
 * =========================================================
 * ADMIN VENDOR RATINGS
 * =========================================================
 *
 * Route:
 *
 * /ratings
 *
 * Backend sources:
 *
 * GET  /api/vendors
 * GET  /api/vendor-ratings
 * POST /api/vendor-ratings/generate
 *
 * IMPORTANT:
 *
 * - No mock data
 * - No random data
 * - No frontend rating calculation
 * - Vendor data comes from Vendor collection
 * - Rating data comes from VendorRating collection
 * - Scores are calculated by backend
 *
 * =========================================================
 */

const VendorRatings = () => {

  const navigate =
    useNavigate();


  // =======================================================
  // VENDORS
  // =======================================================

  const [vendors, setVendors] =
    useState([]);

  const [vendorLoading, setVendorLoading] =
    useState(true);


  // =======================================================
  // RATINGS
  // =======================================================

  const [ratings, setRatings] =
    useState([]);

  const [ratingLoading, setRatingLoading] =
    useState(true);


  // =======================================================
  // COMMON LOADING / ERROR
  // =======================================================

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =======================================================
  // FILTERS
  // =======================================================

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [vendorFilter, setVendorFilter] =
    useState("");


  // =======================================================
  // PAGINATION
  // =======================================================

  const [page, setPage] =
    useState(1);

  const [limit] =
    useState(10);

  const [pagination, setPagination] =
    useState({
      total: 0,
      totalPages: 0,
      page: 1,
      limit: 10,
    });


  // =======================================================
  // GENERATE RATING
  // =======================================================

  const [generateVendorId, setGenerateVendorId] =
    useState("");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [generating, setGenerating] =
    useState(false);

  const [generateMessage, setGenerateMessage] =
    useState("");

  const [generateError, setGenerateError] =
    useState("");

  const [lastGeneratedRatingId, setLastGeneratedRatingId] =
    useState(null);


  // =======================================================
  // LOAD VENDORS
  // =======================================================

  const loadVendors =
    useCallback(async () => {

      try {

        setVendorLoading(true);

        setError("");


        const response =
          await getAllVendors(
            1,
            100,
            "",
            ""
          );


        console.log(
          "[Vendor Ratings] Vendor API response:",
          response
        );


        /*
         * vendorService already returns response.data.
         *
         * Expected:
         *
         * {
         *   success: true,
         *   vendors: [...]
         * }
         */

        const vendorList =
          Array.isArray(
            response?.vendors
          )
            ? response.vendors
            : Array.isArray(
                response?.data?.vendors
              )
              ? response.data.vendors
              : [];


        console.log(
          "[Vendor Ratings] Vendors:",
          vendorList
        );


        setVendors(
          vendorList
        );

      } catch (err) {

        console.error(
          "[Vendor Ratings] Vendor loading error:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load vendors."
        );


        setVendors([]);

      } finally {

        setVendorLoading(false);
      }

    }, []);


  // =======================================================
  // LOAD RATINGS
  // =======================================================

  const loadRatings =
    useCallback(async () => {

      try {

        setRatingLoading(true);

        setError("");


        const response =
          await getVendorRatings({
            page,
            limit,
            vendorId:
              vendorFilter,
            status,
          });


        console.log(
          "================================================"
        );

        console.log(
          "[Vendor Ratings] GET response:",
          response
        );

        console.log(
          "[Vendor Ratings] response.data:",
          response?.data
        );

        console.log(
          "[Vendor Ratings] response.ratings:",
          response?.ratings
        );

        console.log(
          "[Vendor Ratings] response.data.ratings:",
          response?.data?.ratings
        );


        /*
         * =====================================================
         * NORMAL SERVICE RESPONSE
         * =====================================================
         *
         * vendorRatingService does:
         *
         * return response.data;
         *
         * Therefore normally:
         *
         * response = {
         *   success: true,
         *   ratings: [...]
         * }
         *
         * But we safely support nested API wrappers too.
         */


        let payload =
          response || {};


        /*
         * If an axios-like object somehow reaches here,
         * support response.data.
         */

        if (
          !Array.isArray(
            payload?.ratings
          ) &&
          payload?.data
        ) {

          payload =
            payload.data;

        }


        /*
         * Some backend wrappers may return:
         *
         * {
         *   data: {
         *      ratings: [...]
         *   }
         * }
         */

        if (
          !Array.isArray(
            payload?.ratings
          ) &&
          payload?.data
        ) {

          payload =
            payload.data;

        }


        const ratingList =
          Array.isArray(
            payload?.ratings
          )
            ? payload.ratings
            : Array.isArray(
                response?.ratings
              )
              ? response.ratings
              : Array.isArray(
                  response?.data?.ratings
                )
                ? response.data.ratings
                : [];


        console.log(
          "[Vendor Ratings] FINAL rating list:",
          ratingList
        );

        console.log(
          "[Vendor Ratings] Rating count:",
          ratingList.length
        );


        if (
          ratingList.length > 0
        ) {

          console.log(
            "[Vendor Ratings] First rating:",
            ratingList[0]
          );

          console.log(
            "[Vendor Ratings] First rating vendor:",
            ratingList[0]?.vendor
          );

          console.log(
            "[Vendor Ratings] First rating overall score:",
            ratingList[0]?.finalOverallScore
          );

        }


        console.log(
          "================================================"
        );


        setRatings(
          ratingList
        );


        setPagination({
          total:
            payload?.total ??
            response?.total ??
            ratingList.length,

          totalPages:
            payload?.totalPages ??
            response?.totalPages ??
            (
              ratingList.length > 0
                ? 1
                : 0
            ),

          page:
            payload?.page ??
            response?.page ??
            page,

          limit:
            payload?.limit ??
            response?.limit ??
            limit,
        });

      } catch (err) {

        console.error(
          "[Vendor Ratings] Rating loading error:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load vendor ratings."
        );


        setRatings([]);

      } finally {

        setRatingLoading(false);
      }

    }, [
      page,
      limit,
      vendorFilter,
      status,
    ]);


  // =======================================================
  // INITIAL VENDOR LOAD
  // =======================================================

  useEffect(() => {

    loadVendors();

  }, [
    loadVendors,
  ]);


  // =======================================================
  // INITIAL / FILTER RATING LOAD
  // =======================================================

  useEffect(() => {

    loadRatings();

  }, [
    loadRatings,
  ]);


  // =======================================================
  // COMBINED LOADING
  // =======================================================

  useEffect(() => {

    setLoading(
      vendorLoading ||
      ratingLoading
    );

  }, [
    vendorLoading,
    ratingLoading,
  ]);


  // =======================================================
  // BUILD VENDOR → RATING MAP
  // =======================================================
  //
  // Handles:
  //
  // vendor: "MongoId"
  //
  // AND
  //
  // vendor: {
  //    _id: "MongoId",
  //    vendorCode: "...",
  //    vendorName: "..."
  // }
  //
  // =======================================================

  const ratingByVendorId =
    useMemo(() => {

      const map =
        new Map();


      ratings.forEach(
        (rating) => {

          if (!rating) {
            return;
          }


          const vendor =
            rating?.vendor;


          const vendorId =
            typeof vendor === "object"
              ? vendor?._id
              : vendor;


          if (!vendorId) {

            console.warn(
              "[Vendor Ratings] Rating has no vendor:",
              rating
            );

            return;
          }


          if (!map.has(String(vendorId))) {
            map.set(
              String(vendorId),
              rating
            );
          }

        }
      );


      console.log(
        "[Vendor Ratings] Vendor → Rating map:",
        Object.fromEntries(map)
      );


      return map;

    }, [
      ratings,
    ]);


  // =======================================================
  // FILTER VENDORS
  // =======================================================

  const filteredVendors =
    useMemo(() => {

      const searchValue =
        search
          .trim()
          .toLowerCase();


      return vendors.filter(
        (vendor) => {

          // Vendor filter

          if (
            vendorFilter &&
            String(
              vendor?._id
            ) !==
            String(
              vendorFilter
            )
          ) {

            return false;
          }


          // Search

          if (
            !searchValue
          ) {

            return true;
          }


          const vendorName =
            (
              vendor?.vendorName ||
              ""
            ).toLowerCase();


          const companyName =
            (
              vendor?.companyName ||
              ""
            ).toLowerCase();


          const vendorCode =
            (
              vendor?.vendorCode ||
              ""
            ).toLowerCase();


          return (
            vendorName.includes(
              searchValue
            ) ||
            companyName.includes(
              searchValue
            ) ||
            vendorCode.includes(
              searchValue
            )
          );

        }
      );

    }, [
      vendors,
      vendorFilter,
      search,
    ]);


  // =======================================================
  // STATUS FILTER
  // =======================================================

  const displayedVendors =
    useMemo(() => {

      if (!status) {

        return filteredVendors;
      }


      return filteredVendors.filter(
        (vendor) => {

          const rating =
            ratingByVendorId.get(
              String(
                vendor?._id
              )
            );


          if (!rating) {

            return false;
          }


          return (
            rating.status ===
            status
          );

        }
      );

    }, [
      filteredVendors,
      status,
      ratingByVendorId,
    ]);


  // =======================================================
  // GET VENDOR NAME
  // =======================================================

  const getVendorName =
    (vendor) => {

      return (
        vendor?.vendorName ||
        vendor?.companyName ||
        "—"
      );

    };


  // =======================================================
  // GET VENDOR CODE
  // =======================================================

  const getVendorCode =
    (vendor) => {

      return (
        vendor?.vendorCode ||
        "—"
      );

    };


  // =======================================================
  // FORMAT SCORE
  // =======================================================

  const formatScore =
    (score) => {

      if (
        score === null ||
        score === undefined ||
        score === ""
      ) {

        return "—";
      }


      const number =
        Number(score);


      if (
        Number.isNaN(
          number
        )
      ) {

        return "—";
      }


      return number.toFixed(
        1
      );

    };


  // =======================================================
  // GET RATING FOR VENDOR
  // =======================================================

  const getVendorRating =
    (vendor) => {

      return ratingByVendorId.get(
        String(
          vendor?._id
        )
      );

    };


  // =======================================================
  // GENERATE VENDOR RATING
  // =======================================================

  const handleGenerateRating =
    async () => {

      try {

        setGenerateError("");
        setGenerateMessage("");


        // Vendor

        if (
          !generateVendorId
        ) {

          setGenerateError(
            "Please select a vendor."
          );

          return;
        }


        // From date

        if (
          !fromDate
        ) {

          setGenerateError(
            "Please select the evaluation start date."
          );

          return;
        }


        // To date

        if (
          !toDate
        ) {

          setGenerateError(
            "Please select the evaluation end date."
          );

          return;
        }


        // Date validation

        if (
          new Date(fromDate) >
          new Date(toDate)
        ) {

          setGenerateError(
            "From date cannot be after the to date."
          );

          return;
        }


        setGenerating(
          true
        );


        // =================================================
        // BACKEND GENERATION
        // =================================================

        const response =
          await generateVendorRating({
            vendorId:
              generateVendorId,

            fromDate,

            toDate,
          });


        console.log(
          "================================================"
        );

        console.log(
          "[Vendor Ratings] GENERATE response:",
          response
        );

        console.log(
          "[Vendor Ratings] Generated rating:",
          response?.rating
        );

        console.log(
          "[Vendor Ratings] Generated score:",
          response?.rating?.finalOverallScore
        );

        console.log(
          "[Vendor Ratings] Generated vendor:",
          response?.rating?.vendor
        );

        console.log(
          "================================================"
        );


        setGenerateMessage(
          response?.message ||
          response?.data?.message ||
          "Vendor rating generated successfully."
        );


        /*
         * =================================================
         * EXTRACT NEWLY GENERATED RATING
         * =================================================
         *
         * We do not create any frontend data.
         *
         * We only use what the backend returned.
         */

        const generatedRating =
          response?.rating ||
          response?.data?.rating ||
          response?.data?.data?.rating ||
          null;


        /*
         * =================================================
         * UPDATE CURRENT STATE IMMEDIATELY
         * =================================================
         */

        if (
          generatedRating?._id
        ) {
          setLastGeneratedRatingId(generatedRating._id);

          setRatings(
            (previousRatings) => {

              const generatedId =
                String(
                  generatedRating._id
                );


              const existingIndex =
                previousRatings.findIndex(
                  (item) =>
                    String(
                      item?._id
                    ) ===
                    generatedId
                );


              // Update existing rating

              if (
                existingIndex >= 0
              ) {

                const updatedRatings =
                  [
                    ...previousRatings,
                  ];


                updatedRatings[
                  existingIndex
                ] =
                  generatedRating;


                return updatedRatings;
              }


              // Add new rating

              return [
                generatedRating,
                ...previousRatings,
              ];

            }
          );

        }


        /*
         * Clear generator vendor
         */

        setGenerateVendorId("");


        /*
         * Synchronize with MongoDB.
         *
         * This ensures the page ultimately displays
         * the database record, not merely the POST response.
         */

        await loadRatings();

      } catch (err) {

        console.error(
          "[Vendor Ratings] Generate error:",
          err
        );


        setGenerateError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to generate vendor rating."
        );

      } finally {

        setGenerating(
          false
        );
      }

    };


  // =======================================================
  // SEARCH
  // =======================================================

  const handleSearchChange =
    (value) => {

      setSearch(
        typeof value === "string"
          ? value
          : value?.target?.value ||
            ""
      );

      setPage(1);

    };


  // =======================================================
  // VENDOR FILTER
  // =======================================================

  const handleVendorFilter =
    (event) => {

      setVendorFilter(
        event.target.value
      );

      setPage(1);

    };


  // =======================================================
  // STATUS FILTER
  // =======================================================

  const handleStatusChange =
    (event) => {

      setStatus(
        event.target.value
      );

      setPage(1);

    };


  // =======================================================
  // PAGINATION
  // =======================================================

  const handlePageChange =
    (nextPage) => {

      setPage(
        nextPage
      );


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    };


  // =======================================================
  // OPEN RATING DETAILS
  // =======================================================

  const handleOpenRating =
    (rating) => {

      if (
        !rating?._id
      ) {

        return;
      }


      navigate(
        `/ratings/${rating._id}`
      );

    };


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (
      <Layout>

        <div className="flex min-h-[400px] items-center justify-center">

          <Loader />

        </div>

      </Layout>
    );

  }


  // =======================================================
  // PAGE
  // =======================================================

  return (
    <Layout>

      <div className="space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div>

          <h1 className="text-2xl font-semibold text-gray-900">
            Vendor Ratings
          </h1>


          <p className="mt-1 text-sm text-gray-500">
            Review and evaluate vendor performance using
            actual procurement transaction data.
          </p>

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
            GENERATE RATING
        ================================================= */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="mb-4">

            <h2 className="text-base font-semibold text-gray-900">
              Generate Vendor Rating
            </h2>


            <p className="mt-1 text-sm text-gray-500">
              Select a vendor and evaluation period. The
              backend will calculate the rating from actual
              procurement records.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* =================================================
                VENDOR
            ================================================= */}

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Vendor
              </label>


              <select
                value={
                  generateVendorId
                }
                onChange={(event) =>
                  setGenerateVendorId(
                    event.target.value
                  )
                }
                disabled={
                  vendorLoading ||
                  generating
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              >

                <option value="">
                  {vendorLoading
                    ? "Loading vendors..."
                    : "Select vendor"}
                </option>


                {vendors.map(
                  (vendor) => (

                    <option
                      key={
                        vendor._id
                      }
                      value={
                        vendor._id
                      }
                    >

                      {getVendorName(
                        vendor
                      )}

                      {vendor.vendorCode
                        ? ` (${vendor.vendorCode})`
                        : ""}

                    </option>

                  )
                )}

              </select>

            </div>


            {/* =================================================
                FROM DATE
            ================================================= */}

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                From Date
              </label>


              <input
                type="date"
                value={
                  fromDate
                }
                disabled={
                  generating
                }
                onChange={(event) =>
                  setFromDate(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* =================================================
                TO DATE
            ================================================= */}

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                To Date
              </label>


              <input
                type="date"
                value={
                  toDate
                }
                min={
                  fromDate ||
                  undefined
                }
                disabled={
                  generating
                }
                onChange={(event) =>
                  setToDate(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* =================================================
                GENERATE
            ================================================= */}

            <div className="flex items-end">

              <Button
                type="button"
                onClick={
                  handleGenerateRating
                }
                disabled={
                  generating ||
                  vendorLoading
                }
              >

                {generating
                  ? "Generating..."
                  : "Generate Rating"}

              </Button>

            </div>

          </div>


          {/* =================================================
              GENERATION ERROR
          ================================================= */}

          {generateError && (

            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

              {generateError}

            </div>

          )}


          {/* =================================================
              GENERATION SUCCESS
          ================================================= */}

          {generateMessage && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <div>{generateMessage}</div>
              {lastGeneratedRatingId && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/ratings/${lastGeneratedRatingId}/delivery-calculation`
                    )
                  }
                  className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                >
                  <span>🚚 Open Delivery Calculation</span>
                  <span>→</span>
                </button>
              )}
            </div>
          )}

        </div>


        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <SearchInput
              value={
                search
              }
              onChange={
                handleSearchChange
              }
              placeholder="Search vendor name or code..."
            />


            <Select
              value={
                vendorFilter
              }
              onChange={
                handleVendorFilter
              }
              options={[
                {
                  value: "",
                  label: "All Vendors",
                },

                ...vendors.map(
                  (vendor) => ({

                    value:
                      vendor._id,

                    label:
                      `${getVendorName(
                        vendor
                      )}${
                        vendor.vendorCode
                          ? ` (${vendor.vendorCode})`
                          : ""
                      }`,

                  })
                ),

              ]}
            />


            <Select
              value={
                status
              }
              onChange={
                handleStatusChange
              }
              options={[
                {
                  value: "",
                  label:
                    "All Rating Statuses",
                },

                {
                  value:
                    "Draft",
                  label:
                    "Draft",
                },

                {
                  value:
                    "Under Review",
                  label:
                    "Under Review",
                },

                {
                  value:
                    "Submitted",
                  label:
                    "Submitted",
                },

                {
                  value:
                    "Approved",
                  label:
                    "Approved",
                },

                {
                  value:
                    "Locked",
                  label:
                    "Locked",
                },

              ]}
            />

          </div>

        </div>


        {/* =================================================
            RATING TABLE
        ================================================= */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          {displayedVendors.length === 0 ? (

            <div className="p-8">

              <EmptyState
                title="No vendors found"
                description={
                  search ||
                  status ||
                  vendorFilter
                    ? "No vendors match the selected filters."
                    : "No vendors are available in the backend."
                }
              />

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-full divide-y divide-gray-200">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Vendor
                    </th>

                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Delivery
                    </th>

                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Quality
                    </th>

                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Fulfillment
                    </th>

                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Price
                    </th>

                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Overall
                    </th>

                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-gray-200 bg-white">

                  {displayedVendors.map(
                    (vendor) => {

                      const rating =
                        getVendorRating(
                          vendor
                        );


                      return (

                        <tr
                          key={
                            vendor._id
                          }
                          className="hover:bg-gray-50"
                        >

                          {/* Vendor */}

                          <td className="px-5 py-4">

                            <div className="font-medium text-gray-900">
                              {getVendorName(
                                vendor
                              )}
                            </div>

                            <div className="text-xs text-gray-500">
                              {getVendorCode(
                                vendor
                              )}
                            </div>

                          </td>


                          {/* Delivery */}

                          <td className="px-5 py-4 text-center font-medium text-gray-900">

                            {rating
                              ? formatScore(
                                  rating
                                    ?.delivery
                                    ?.finalScore
                                )
                              : "—"}

                          </td>


                          {/* Quality */}

                          <td className="px-5 py-4 text-center font-medium text-gray-900">

                            {rating
                              ? formatScore(
                                  rating
                                    ?.quality
                                    ?.finalScore
                                )
                              : "—"}

                          </td>


                          {/* Fulfillment */}

                          <td className="px-5 py-4 text-center font-medium text-gray-900">

                            {rating
                              ? formatScore(
                                  rating
                                    ?.fulfillment
                                    ?.finalScore
                                )
                              : "—"}

                          </td>


                          {/* Price */}

                          <td className="px-5 py-4 text-center font-medium text-gray-900">

                            {rating
                              ? formatScore(
                                  rating
                                    ?.price
                                    ?.finalScore
                                )
                              : "—"}

                          </td>


                          {/* Overall */}

                          <td className="px-5 py-4 text-center">

                            {rating ? (

                              <>

                                <span className="font-semibold text-gray-900">

                                  {formatScore(
                                    rating
                                      ?.finalOverallScore
                                  )}

                                </span>


                                <span className="ml-1 text-xs text-gray-500">
                                  /100
                                </span>

                              </>

                            ) : (

                              <span className="text-sm text-gray-400">
                                —
                              </span>

                            )}

                          </td>


                          {/* Status */}

                          <td className="px-5 py-4 text-center">

                            {rating ? (

                              <VendorRatingStatusBadge
                                status={
                                  rating.status
                                }
                              />

                            ) : (

                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                Not Evaluated
                              </span>

                            )}

                          </td>


                          {/* Action */}

                          <td className="px-5 py-4 text-center">

                            {rating ? (

                              <div className="flex items-center justify-center gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenRating(
                                      rating
                                    )
                                  }
                                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                  View Rating
                                </button>
                                <span className="text-gray-300">•</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/ratings/${rating._id}/delivery-calculation`
                                    )
                                  }
                                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                >
                                  <span>🚚</span>
                                  <span>Calculation</span>
                                </button>
                              </div>

                            ) : (

                              <button
                                type="button"
                                onClick={() =>
                                  setGenerateVendorId(
                                    vendor._id
                                  )
                                }
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                              >
                                Generate
                              </button>

                            )}

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* =================================================
            PAGINATION
        ================================================= */}

        {pagination.totalPages > 1 && (

          <div className="flex justify-end">

            <Pagination
              currentPage={
                pagination.page
              }
              totalPages={
                pagination.totalPages
              }
              onPageChange={
                handlePageChange
              }
            />

          </div>

        )}

      </div>

    </Layout>
  );
};


export default VendorRatings;