import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Star,
  RefreshCw,
} from "lucide-react";

import {
  getAllVendors,
} from "../../../services/vendorService";

import {
  getVendorRatingDashboard,
} from "../../../services/vendorRatingService";


const VendorSelectionStep = ({
  formData,
  setFormData,
  errors = {},
  setErrors,
}) => {

  const [vendors, setVendors] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  /**
   * =========================================================
   * LOAD ACTIVE VENDORS + REAL VENDOR RATINGS
   * =========================================================
   *
   * Vendor master data comes from:
   *
   * GET /api/vendors
   *
   * Vendor rating data comes from:
   *
   * GET /api/vendor-ratings/vendor/:vendorId/dashboard
   *
   * IMPORTANT:
   * ---------------------------------------------------------
   * Rating is NOT calculated here.
   * Backend remains the source of truth.
   * =========================================================
   */

  const loadVendors = async () => {

    try {

      setLoading(true);

      /**
       * -----------------------------------------------------
       * Get active vendors
       * -----------------------------------------------------
       */

      const response =
        await getAllVendors(
          1,
          100,
          "",
          "Active"
        );

      const vendorList =
        response?.vendors || [];

      /**
       * -----------------------------------------------------
       * Load latest rating for every vendor
       *
       * Promise.allSettled is intentionally used.
       *
       * If one vendor has no rating, it must NOT prevent
       * the remaining vendors from appearing.
       * -----------------------------------------------------
       */

      const vendorsWithRatings =
        await Promise.all(
          vendorList.map(
            async (vendor) => {

              try {

                const ratingResponse =
                  await getVendorRatingDashboard(
                    vendor._id
                  );

                /**
                 * Backend response may be:
                 *
                 * {
                 *   success: true,
                 *   data: {...}
                 * }
                 *
                 * or directly:
                 *
                 * {
                 *   success: true,
                 *   overallScore: ...
                 * }
                 */

                const ratingData =
                  ratingResponse?.data ||
                  ratingResponse;

                return {
                  ...vendor,

                  ratingDashboard:
                    ratingData,
                };

              } catch (ratingError) {

                /**
                 * ------------------------------------------------
                 * A vendor without a rating is valid.
                 *
                 * Do NOT convert it to zero.
                 * ------------------------------------------------
                 */

                console.warn(
                  `No vendor rating available for ${vendor.vendorName}:`,
                  ratingError
                );

                return {
                  ...vendor,

                  ratingDashboard:
                    null,
                };

              }

            }
          )
        );

      setVendors(
        vendorsWithRatings
      );

    } catch (error) {

      console.error(
        "Failed to load vendors:",
        error
      );

      setVendors([]);

    } finally {

      setLoading(false);

    }

  };


  /**
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */

  useEffect(() => {

    loadVendors();

  }, []);


  /**
   * =========================================================
   * SEARCH VENDORS
   * =========================================================
   */

  const filteredVendors =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return vendors;
      }

      return vendors.filter(
        (vendor) =>

          vendor.vendorName
            ?.toLowerCase()
            .includes(keyword)

          ||

          vendor.vendorCode
            ?.toLowerCase()
            .includes(keyword)

          ||

          vendor.vendorCategory
            ?.toLowerCase()
            .includes(keyword)

          ||

          vendor.businessType
            ?.toLowerCase()
            .includes(keyword)

      );

    }, [
      vendors,
      search,
    ]);


  /**
   * =========================================================
   * SELECTED VENDOR
   * =========================================================
   */

  const selectedVendor =
    vendors.find(
      (vendor) =>
        vendor._id ===
        formData.vendor
    );


  /**
   * =========================================================
   * SELECT VENDOR
   * =========================================================
   */

  const handleVendorSelect =
    (vendor) => {

      setFormData(
        (prev) => ({

          ...prev,

          vendor:
            vendor._id,

          paymentTerms:
            vendor.paymentTerms ||
            prev.paymentTerms,

          currency:
            vendor.currency ||
            prev.currency,

        })
      );

      if (setErrors) {

        setErrors(
          (prev) => ({

            ...prev,

            vendor: "",

          })
        );

      }

    };


  /**
   * =========================================================
   * GET RATING DATA
   * =========================================================
   *
   * Backend rating dashboard is the source of truth.
   *
   * We support the actual backend structure:
   *
   * ratingDashboard.overallScore
   *
   * ratingDashboard.parameters.quality.score
   * ratingDashboard.parameters.delivery.score
   * ratingDashboard.parameters.price.score
   * ratingDashboard.parameters.communication.score
   *
   * =========================================================
   */

  const getRatingData =
    (vendor) => {

      const dashboard =
        vendor?.ratingDashboard;

      if (!dashboard) {

        return {
          hasRating: false,

          overallScore: null,

          qualityScore: null,

          deliveryScore: null,

          priceScore: null,

          communicationScore: null,

          rating: null,
        };

      }

      const parameters =
        dashboard?.parameters ||
        {};

      const overallScore =
        dashboard?.overallScore ??
        dashboard?.score ??
        null;

      const qualityScore =
        parameters?.quality?.score ??
        dashboard?.qualityScore ??
        null;

      const deliveryScore =
        parameters?.delivery?.score ??
        dashboard?.deliveryScore ??
        null;

      const priceScore =
        parameters?.price?.score ??
        dashboard?.priceScore ??
        null;

      const communicationScore =
        parameters?.communication?.score ??
        dashboard?.communicationScore ??
        parameters?.responseTime?.score ??
        dashboard?.responseTimeScore ??
        null;

      /**
       * A rating is considered available when the backend
       * actually returned an overall score.
       */

      const hasRating =
        overallScore !== null &&
        overallScore !== undefined;

      return {

        hasRating,

        overallScore,

        qualityScore,

        deliveryScore,

        priceScore,

        communicationScore,

        rating:
          dashboard?.overallRating ??
          dashboard?.rating ??
          null,

      };

    };


  /**
   * =========================================================
   * PERFORMANCE GRADE
   * =========================================================
   *
   * This is only a presentation classification.
   *
   * The actual vendor score comes from the backend.
   * =========================================================
   */

  const getVendorGrade =
    (rating) => {

      if (
        rating === null ||
        rating === undefined
      ) {

        return {
          label: "Not Rated",
          className:
            "text-slate-500",
        };

      }

      const score =
        Number(rating);

      if (Number.isNaN(score)) {

        return {
          label: "Not Rated",
          className:
            "text-slate-500",
        };

      }

      if (score >= 90) {

        return {
          label: "A+ Excellent",
          className:
            "text-emerald-600",
        };

      }

      if (score >= 80) {

        return {
          label: "A Very Good",
          className:
            "text-green-600",
        };

      }

      if (score >= 70) {

        return {
          label: "B Good",
          className:
            "text-blue-600",
        };

      }

      if (score >= 60) {

        return {
          label: "C Average",
          className:
            "text-amber-600",
        };

      }

      return {
        label: "D Poor",
        className:
          "text-red-600",
      };

    };


  /**
   * =========================================================
   * FORMAT SCORE
   * =========================================================
   */

  const formatScore =
    (value) => {

      if (
        value === null ||
        value === undefined
      ) {

        return "Not Rated";

      }

      const number =
        Number(value);

      if (
        Number.isNaN(number)
      ) {

        return "Not Rated";

      }

      return `${number.toFixed(2)}%`;

    };


  /**
   * =========================================================
   * RATING BAR
   * =========================================================
   */

  const getRatingBarWidth =
    (value) => {

      if (
        value === null ||
        value === undefined
      ) {

        return "0%";

      }

      const number =
        Number(value);

      if (
        Number.isNaN(number)
      ) {

        return "0%";

      }

      return `${Math.max(
        0,
        Math.min(
          100,
          number
        )
      )}%`;

    };


  /**
   * =========================================================
   * RATING BAR COLOR
   * =========================================================
   */

  const getRatingBarColor =
    (value) => {

      if (
        value === null ||
        value === undefined
      ) {

        return "bg-slate-300";

      }

      const number =
        Number(value);

      if (number >= 80) {

        return "bg-emerald-500";

      }

      if (number >= 70) {

        return "bg-blue-500";

      }

      if (number >= 60) {

        return "bg-amber-500";

      }

      return "bg-red-500";

    };


  return (

    <div className="space-y-8">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div>

        <h2 className="text-2xl font-bold text-slate-800">
          Vendor Selection
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Select the most suitable vendor based on
          performance and procurement requirements.
        </p>

      </div>


      {/* ===================================================
          SEARCH TOOLBAR
      =================================================== */}

      <div className="rounded-2xl border bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}

          <div className="relative w-full lg:w-[420px]">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search Vendor Name, Code, Category..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500"
            />

          </div>


          {/* Summary */}

          <div className="flex flex-wrap items-center gap-3">

            <div className="rounded-xl bg-blue-50 px-5 py-3">

              <p className="text-xs text-slate-500">
                Active Vendors
              </p>

              <h4 className="text-lg font-bold text-blue-600">
                {filteredVendors.length}
              </h4>

            </div>


            <div className="rounded-xl bg-green-50 px-5 py-3">

              <p className="text-xs text-slate-500">
                Preferred Vendors
              </p>

              <h4 className="text-lg font-bold text-green-600">

                {
                  filteredVendors.filter(
                    (vendor) =>
                      vendor.preferredVendor
                  ).length
                }

              </h4>

            </div>

          </div>

        </div>

      </div>


      {/* ===================================================
          VALIDATION
      =================================================== */}

      {errors.vendor && (

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">

          <p className="text-sm font-medium text-red-600">
            {errors.vendor}
          </p>

        </div>

      )}


      {/* ===================================================
          LOADING
      =================================================== */}

      {loading && (

        <div className="rounded-xl border bg-white p-10 text-center">

          <RefreshCw
            size={30}
            className="mx-auto mb-4 animate-spin text-blue-600"
          />

          <p className="font-medium text-slate-600">
            Loading Vendors...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Fetching vendor performance data...
          </p>

        </div>

      )}


      {/* ===================================================
          VENDOR CARDS
      =================================================== */}

      {!loading && (

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {filteredVendors.length === 0 ? (

            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-16 text-center">

              <h3 className="text-lg font-semibold text-slate-700">
                No Vendors Found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try another search keyword.
              </p>

            </div>

          ) : (

            filteredVendors.map(
              (vendor) => {

                const selected =
                  formData.vendor ===
                  vendor._id;

                const ratingData =
                  getRatingData(
                    vendor
                  );

                const grade =
                  getVendorGrade(
                    ratingData.overallScore
                  );

                return (

                  <div
                    key={vendor._id}
                    onClick={() =>
                      handleVendorSelect(
                        vendor
                      )
                    }
                    className={`cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 ${
                      selected
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "hover:border-blue-300 hover:shadow-md"
                    }`}
                  >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="flex items-start justify-between">

                      <div>

                        <h3 className="text-lg font-bold text-slate-800">
                          {vendor.vendorName}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {vendor.vendorCode}
                        </p>

                      </div>


                      {vendor.preferredVendor && (

                        <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">

                          <Star
                            size={14}
                            fill="currentColor"
                          />

                          Preferred

                        </span>

                      )}

                    </div>


                    {/* =================================================
                        BASIC DETAILS
                    ================================================= */}

                    <div className="mt-5 grid grid-cols-2 gap-4">

                      <div>

                        <p className="text-xs text-slate-500">
                          Category
                        </p>

                        <p className="font-medium">
                          {vendor.vendorCategory ||
                            "-"}
                        </p>

                      </div>


                      <div>

                        <p className="text-xs text-slate-500">
                          Business Type
                        </p>

                        <p className="font-medium">
                          {vendor.businessType ||
                            "-"}
                        </p>

                      </div>


                      <div>

                        <p className="text-xs text-slate-500">
                          Payment Terms
                        </p>

                        <p className="font-medium">
                          {vendor.paymentTerms ||
                            "-"}
                        </p>

                      </div>


                      <div>

                        <p className="text-xs text-slate-500">
                          Lead Time
                        </p>

                        <p className="font-medium">
                          {vendor.leadTime != null
                            ? `${vendor.leadTime} Days`
                            : "-"}
                        </p>

                      </div>

                    </div>


                    {/* =================================================
                        OVERALL RATING
                    ================================================= */}

                    <div className="mt-6">

                      <div className="mb-2 flex justify-between">

                        <span className="text-sm font-medium">
                          Overall Rating
                        </span>

                        <span
                          className={`font-bold ${
                            ratingData.hasRating
                              ? "text-blue-600"
                              : "text-slate-400"
                          }`}
                        >
                          {formatScore(
                            ratingData.overallScore
                          )}
                        </span>

                      </div>


                      <div className="h-3 rounded-full bg-slate-200">

                        <div
                          className={`h-3 rounded-full transition-all ${getRatingBarColor(
                            ratingData.overallScore
                          )}`}
                          style={{
                            width:
                              getRatingBarWidth(
                                ratingData.overallScore
                              ),
                          }}
                        />

                      </div>


                      <p className="mt-2 text-sm text-slate-500">

                        Grade:

                        <span
                          className={`ml-2 font-semibold ${grade.className}`}
                        >
                          {grade.label}
                        </span>

                      </p>

                    </div>


                    {/* =================================================
                        PERFORMANCE
                    ================================================= */}

                    <div className="mt-6 grid grid-cols-2 gap-4">

                      {/* Quality */}

                      <div>

                        <p className="text-xs text-slate-500">
                          Quality
                        </p>

                        <p
                          className={`font-semibold ${
                            ratingData.qualityScore ==
                            null
                              ? "text-slate-400"
                              : "text-slate-800"
                          }`}
                        >
                          {formatScore(
                            ratingData.qualityScore
                          )}
                        </p>

                      </div>


                      {/* Delivery */}

                      <div>

                        <p className="text-xs text-slate-500">
                          Delivery
                        </p>

                        <p
                          className={`font-semibold ${
                            ratingData.deliveryScore ==
                            null
                              ? "text-slate-400"
                              : "text-slate-800"
                          }`}
                        >
                          {formatScore(
                            ratingData.deliveryScore
                          )}
                        </p>

                      </div>


                      {/* Price */}

                      <div>

                        <p className="text-xs text-slate-500">
                          Price
                        </p>

                        <p
                          className={`font-semibold ${
                            ratingData.priceScore ==
                            null
                              ? "text-slate-400"
                              : "text-slate-800"
                          }`}
                        >
                          {formatScore(
                            ratingData.priceScore
                          )}
                        </p>

                      </div>


                      {/* Communication */}

                      <div>

                        <p className="text-xs text-slate-500">
                          Communication
                        </p>

                        <p
                          className={`font-semibold ${
                            ratingData.communicationScore ==
                            null
                              ? "text-slate-400"
                              : "text-slate-800"
                          }`}
                        >
                          {formatScore(
                            ratingData.communicationScore
                          )}
                        </p>

                      </div>

                    </div>


                    {/* =================================================
                        RATING STATUS
                    ================================================= */}

                    <div className="mt-5">

                      {ratingData.hasRating ? (

                        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">

                          <Star
                            size={15}
                            className="fill-emerald-500 text-emerald-500"
                          />

                          <span className="text-xs font-medium text-emerald-700">
                            Latest vendor rating available
                          </span>

                        </div>

                      ) : (

                        <div className="rounded-lg bg-slate-50 px-3 py-2">

                          <span className="text-xs font-medium text-slate-500">
                            Vendor has not been rated yet
                          </span>

                        </div>

                      )}

                    </div>


                    {/* =================================================
                        SELECT BUTTON
                    ================================================= */}

                    <button
                      type="button"
                      onClick={(event) => {

                        event.stopPropagation();

                        handleVendorSelect(
                          vendor
                        );

                      }}
                      className={`mt-6 w-full rounded-xl py-3 font-semibold transition ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                      }`}
                    >

                      {selected
                        ? "Selected Vendor"
                        : "Select Vendor"}

                    </button>

                  </div>

                );

              }
            )

          )}

        </div>

      )}


      {/* ===================================================
          SELECTED VENDOR DETAILS
      =================================================== */}

      {selectedVendor && (

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h3 className="text-xl font-bold text-slate-800">
                Selected Vendor Details
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Complete information about the selected vendor.
              </p>

            </div>

            <span className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white">
              Selected
            </span>

          </div>


          {/* =================================================
              VENDOR INFORMATION
          ================================================= */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border bg-white p-4">

              <p className="text-sm text-slate-500">
                Vendor Code
              </p>

              <h4 className="mt-2 font-semibold">
                {selectedVendor.vendorCode ||
                  "-"}
              </h4>

            </div>


            <div className="rounded-xl border bg-white p-4">

              <p className="text-sm text-slate-500">
                Vendor Name
              </p>

              <h4 className="mt-2 font-semibold">
                {selectedVendor.vendorName ||
                  "-"}
              </h4>

            </div>


            <div className="rounded-xl border bg-white p-4">

              <p className="text-sm text-slate-500">
                Contact Person
              </p>

              <h4 className="mt-2 font-semibold">
                {selectedVendor.contactPerson ||
                  "-"}
              </h4>

            </div>


            <div className="rounded-xl border bg-white p-4">

              <p className="text-sm text-slate-500">
                Mobile
              </p>

              <h4 className="mt-2 font-semibold">
                {selectedVendor.mobile ||
                  selectedVendor.phone ||
                  "-"}
              </h4>

            </div>


            <div className="rounded-xl border bg-white p-4">

              <p className="text-sm text-slate-500">
                Email
              </p>

              <h4 className="mt-2 font-semibold">
                {selectedVendor.email ||
                  "-"}
              </h4>

            </div>


            <div className="rounded-xl border bg-white p-4">

              <p className="text-sm text-slate-500">
                GST Number
              </p>

              <h4 className="mt-2 font-semibold">
                {selectedVendor.gstNumber ||
                  "-"}
              </h4>

            </div>


            <div className="rounded-xl border bg-white p-4">

              <p className="text-sm text-slate-500">
                PAN Number
              </p>

              <h4 className="mt-2 font-semibold">
                {selectedVendor.panNumber ||
                  "-"}
              </h4>

            </div>


            <div className="rounded-xl border bg-white p-4">

              <p className="text-sm text-slate-500">
                Website
              </p>

              <h4 className="mt-2 font-semibold">
                {selectedVendor.website ||
                  "-"}
              </h4>

            </div>

          </div>


          {/* =================================================
              PURCHASE CONFIGURATION
          ================================================= */}

          <div className="mt-8">

            <h4 className="mb-4 text-lg font-bold">
              Purchase Configuration
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-xl border bg-white p-4">

                <p className="text-sm text-slate-500">
                  Payment Terms
                </p>

                <h4 className="mt-2 font-semibold">
                  {selectedVendor.paymentTerms ||
                    "-"}
                </h4>

              </div>


              <div className="rounded-xl border bg-white p-4">

                <p className="text-sm text-slate-500">
                  Currency
                </p>

                <h4 className="mt-2 font-semibold">
                  {selectedVendor.currency ||
                    "-"}
                </h4>

              </div>


              <div className="rounded-xl border bg-white p-4">

                <p className="text-sm text-slate-500">
                  Credit Days
                </p>

                <h4 className="mt-2 font-semibold">

                  {selectedVendor.creditDays !=
                  null
                    ? `${selectedVendor.creditDays} Days`
                    : "-"}

                </h4>

              </div>


              <div className="rounded-xl border bg-white p-4">

                <p className="text-sm text-slate-500">
                  Lead Time
                </p>

                <h4 className="mt-2 font-semibold">

                  {selectedVendor.leadTime !=
                  null
                    ? `${selectedVendor.leadTime} Days`
                    : "-"}

                </h4>

              </div>

            </div>

          </div>


          {/* =================================================
              PERFORMANCE
          ================================================= */}

          <div className="mt-8">

            <h4 className="mb-4 text-lg font-bold">
              Vendor Performance
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              <div className="rounded-xl border bg-white p-5">

                <p className="text-sm text-slate-500">
                  Total Orders
                </p>

                <h2 className="mt-2 text-2xl font-bold">

                  {selectedVendor.performance?.totalOrders ??
                    selectedVendor.totalOrders ??
                    0}

                </h2>

              </div>


              <div className="rounded-xl border bg-white p-5">

                <p className="text-sm text-slate-500">
                  Completed Orders
                </p>

                <h2 className="mt-2 text-2xl font-bold text-green-600">

                  {selectedVendor.performance?.completedOrders ??
                    selectedVendor.completedOrders ??
                    0}

                </h2>

              </div>


              <div className="rounded-xl border bg-white p-5">

                <p className="text-sm text-slate-500">
                  Cancelled Orders
                </p>

                <h2 className="mt-2 text-2xl font-bold text-red-600">

                  {selectedVendor.performance?.cancelledOrders ??
                    selectedVendor.cancelledOrders ??
                    0}

                </h2>

              </div>

            </div>

          </div>


          {/* =================================================
              SELECTED VENDOR RATING
          ================================================= */}

          <div className="mt-8">

            <h4 className="mb-4 text-lg font-bold">
              Vendor Rating
            </h4>

            {(() => {

              const ratingData =
                getRatingData(
                  selectedVendor
                );

              const grade =
                getVendorGrade(
                  ratingData.overallScore
                );

              return (

                <div className="rounded-xl border bg-white p-5">

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">

                    <div>

                      <p className="text-xs text-slate-500">
                        Overall
                      </p>

                      <p className="mt-1 text-xl font-bold text-blue-600">
                        {formatScore(
                          ratingData.overallScore
                        )}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Quality
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {formatScore(
                          ratingData.qualityScore
                        )}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Delivery
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {formatScore(
                          ratingData.deliveryScore
                        )}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Price
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {formatScore(
                          ratingData.priceScore
                        )}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Grade
                      </p>

                      <p
                        className={`mt-1 text-xl font-bold ${grade.className}`}
                      >
                        {grade.label}
                      </p>

                    </div>

                  </div>

                </div>

              );

            })()}

          </div>


          {/* =================================================
              ADDRESS
          ================================================= */}

          <div className="mt-8 rounded-xl border bg-white p-5">

            <h4 className="mb-3 text-lg font-bold">
              Vendor Address
            </h4>

            <p className="text-slate-700">

              {selectedVendor.address?.line1 ||
                ""}

              {selectedVendor.address?.line2 &&
                `, ${selectedVendor.address.line2}`}

            </p>

            <p className="mt-2 text-slate-600">

              {selectedVendor.address?.city ||
                "-"}
              ,{" "}

              {selectedVendor.address?.district ||
                "-"}
              ,{" "}

              {selectedVendor.address?.state ||
                "-"}
              ,{" "}

              {selectedVendor.address?.country ||
                "-"}{" "}

              -{" "}

              {selectedVendor.address?.pincode ||
                "-"}

            </p>

          </div>

        </div>

      )}


      {/* ===================================================
          EMPTY STATE
      =================================================== */}

      {!selectedVendor &&
        !loading && (

          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">

            <h3 className="text-xl font-semibold text-slate-700">
              No Vendor Selected
            </h3>

            <p className="mt-2 text-slate-500">
              Select a vendor from the list above to view
              complete vendor information.
            </p>

          </div>

        )}

    </div>

  );

};


export default VendorSelectionStep;