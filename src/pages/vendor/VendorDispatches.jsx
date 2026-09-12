import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaBox,
  FaCircleCheck,
  FaEye,
  FaTruck,
  FaClock,
} from "react-icons/fa6";

import {
  getVendorDispatchOverview,
  getVendorDispatches,
  getVendorPurchaseOrderDispatchHistory,
} from "../../services/vendorDispatchService";

import DispatchSummaryCards from "../../components/vendor/dispatch/DispatchSummaryCards";
import DispatchFilters from "../../components/vendor/dispatch/DispatchFilters";
import DispatchOverviewTable from "../../components/vendor/dispatch/DispatchOverviewTable";
import FulfillmentProgress from "../../components/vendor/dispatch/FulfillmentProgress";
import DispatchTrend from "../../components/vendor/dispatch/DispatchTrend";
import TopMaterials from "../../components/vendor/dispatch/TopMaterials";


const VendorDispatches = () => {

  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [allDispatches, setAllDispatches] = useState([]);

  const [replacementDispatches, setReplacementDispatches] =
    useState([]);

  /*
   * =========================================================
   * INDIVIDUAL DISPATCH HISTORY
   * =========================================================
   *
   * Structure:
   *
   * {
   *   purchaseOrderId: [
   *     dispatch1,
   *     dispatch2,
   *     ...
   *   ]
   * }
   *
   * Example:
   *
   * {
   *   "PO_ID": [
   *      DSP000001 -> 95,
   *      DSP000002 -> 5
   *   ]
   * }
   */

  const [dispatchHistoryByPO, setDispatchHistoryByPO] =
    useState({});

  const [dispatchHistoryLoading, setDispatchHistoryLoading] =
    useState(false);


  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    status: "",
    purchaseOrder: "",
    fromDate: "",
    toDate: "",
  });


  const [loading, setLoading] = useState(true);

  const [replacementLoading, setReplacementLoading] =
    useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [purchaseOrder, setPurchaseOrder] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);

  const [pages, setPages] = useState(0);

  const [total, setTotal] = useState(0);

  const limit = 10;


  // =========================================================
  // LOAD PO DISPATCH OVERVIEW
  // =========================================================

  const loadDispatches = useCallback(async () => {

    try {

      setLoading(true);

      const response =
        await getVendorDispatchOverview();

      console.log(
        "Vendor Dispatch Overview Response:",
        response
      );

      const records =
        Array.isArray(
          response?.purchaseOrders
        )
          ? response.purchaseOrders
          : [];

      setAllDispatches(records);

      setTotal(
        Number(response?.total || records.length || 0)
      );

      setPages(
        records.length > 0
          ? Math.ceil(records.length / limit)
          : 0
      );

      if (
        records.length > 0 &&
        page >
          Math.ceil(records.length / limit)
      ) {
        setPage(1);
      }

    } catch (error) {

      console.error(
        "Vendor Dispatch Overview Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load dispatch overview.";

      toast.error(message);

      setAllDispatches([]);
      setTotal(0);
      setPages(0);

    } finally {

      setLoading(false);

    }

  }, [page]);


  // =========================================================
  // LOAD ACTUAL DISPATCH RECORDS
  //
  // Used for:
  //
  // - Replacement Dispatches
  // - Actual dispatch information
  // =========================================================

  const loadReplacementDispatches =
    useCallback(async () => {

      try {

        setReplacementLoading(true);

        const response =
          await getVendorDispatches({
            page: 1,
            limit: 100,
            search: "",
            status: "",
            purchaseOrder: "",
            fromDate: "",
            toDate: "",
          });

        console.log(
          "Vendor Actual Dispatches Response:",
          response
        );

        let records = [];

        if (Array.isArray(response?.data)) {

          records = response.data;

        } else if (
          Array.isArray(response?.dispatches)
        ) {

          records = response.dispatches;

        } else if (
          Array.isArray(
            response?.data?.dispatches
          )
        ) {

          records =
            response.data.dispatches;

        } else if (
          Array.isArray(
            response?.data?.records
          )
        ) {

          records =
            response.data.records;

        } else if (
          Array.isArray(
            response?.records
          )
        ) {

          records =
            response.records;

        }

        /*
         * Only keep actual replacement dispatches.
         */

        const replacementRecords =
          records.filter((dispatch) => {

            const itemIsReplacement =
              Array.isArray(dispatch?.items) &&
              dispatch.items.some(
                (item) =>
                  item?.isReplacement === true ||
                  Boolean(
                    item?.replacementRequest
                  )
              );

            return (
              dispatch?.isReplacement === true ||
              itemIsReplacement
            );

          });

        console.log(
          "Replacement Dispatch Records:",
          replacementRecords
        );

        setReplacementDispatches(
          replacementRecords
        );

      } catch (error) {

        console.error(
          "Replacement Dispatch Load Error:",
          error
        );

        setReplacementDispatches([]);

      } finally {

        setReplacementLoading(false);

      }

    }, []);


  // =========================================================
  // LOAD INDIVIDUAL DISPATCH HISTORY
  // =========================================================
  //
  // IMPORTANT:
  //
  // PO overview gives one PO-level record.
  //
  // Dispatch history gives every actual dispatch:
  //
  // DSP000001 -> 95
  // DSP000002 -> 5
  //
  // This is what supports multiple dispatches correctly.
  // =========================================================

  const loadDispatchHistory = useCallback(
    async (records = []) => {

      if (!Array.isArray(records) || records.length === 0) {

        setDispatchHistoryByPO({});

        return;

      }

      try {

        setDispatchHistoryLoading(true);

        const historyEntries =
          await Promise.all(
            records.map(
              async (record) => {

                const purchaseOrderId =
                  record?._id ||
                  record?.purchaseOrder?._id ||
                  record?.purchaseOrder?.id ||
                  record?.po?._id ||
                  record?.po?.id ||
                  record?.purchaseOrderId ||
                  record?.poId;

                if (!purchaseOrderId) {

                  return null;

                }

                try {

                  const response =
                    await getVendorPurchaseOrderDispatchHistory(
                      purchaseOrderId
                    );

                  console.log(
                    `Dispatch History Response for PO ${purchaseOrderId}:`,
                    response
                  );

                  /*
                   * Support possible backend response shapes.
                   */

                  let history = [];

                  if (
                    Array.isArray(
                      response?.dispatches
                    )
                  ) {

                    history =
                      response.dispatches;

                  } else if (
                    Array.isArray(
                      response?.data
                    )
                  ) {

                    history =
                      response.data;

                  } else if (
                    Array.isArray(
                      response?.data?.dispatches
                    )
                  ) {

                    history =
                      response.data.dispatches;

                  } else if (
                    Array.isArray(
                      response?.records
                    )
                  ) {

                    history =
                      response.records;

                  } else if (
                    Array.isArray(
                      response?.data?.records
                    )
                  ) {

                    history =
                      response.data.records;

                  }

                  /*
                   * Only normal dispatches belong here.
                   *
                   * Replacement dispatches remain in the
                   * separate Replacement Dispatches section.
                   */

                  const normalDispatchHistory =
                    history.filter(
                      (dispatch) => {

                        const hasReplacementItem =
                          Array.isArray(
                            dispatch?.items
                          ) &&
                          dispatch.items.some(
                            (item) =>
                              item?.isReplacement === true ||
                              Boolean(
                                item?.replacementRequest
                              )
                          );

                        return (
                          dispatch?.isReplacement !== true &&
                          !hasReplacementItem
                        );

                      }
                    );

                  return {
                    purchaseOrderId,
                    dispatches:
                      normalDispatchHistory,
                  };

                } catch (error) {

                  console.error(
                    `Failed to load dispatch history for PO ${purchaseOrderId}:`,
                    error
                  );

                  /*
                   * Do not break the entire Dispatch page
                   * because one PO history failed.
                   */

                  return {
                    purchaseOrderId,
                    dispatches: [],
                  };

                }

              }
            )
          );


        const historyMap = {};

        historyEntries.forEach(
          (entry) => {

            if (!entry?.purchaseOrderId) {

              return;

            }

            historyMap[
              String(
                entry.purchaseOrderId
              )
            ] =
              Array.isArray(
                entry.dispatches
              )
                ? entry.dispatches
                : [];

          }
        );


        console.log(
          "Complete Dispatch History Map:",
          historyMap
        );

        setDispatchHistoryByPO(
          historyMap
        );

      } catch (error) {

        console.error(
          "Dispatch History Load Error:",
          error
        );

        setDispatchHistoryByPO({});

      } finally {

        setDispatchHistoryLoading(false);

      }

    },
    []
  );


  // =========================================================
  // FILTER NORMAL PO DISPATCH OVERVIEW
  // =========================================================

  const dispatches = useMemo(() => {

    const normalizedSearch =
      appliedFilters.search
        .trim()
        .toLowerCase();

    const normalizedPurchaseOrder =
      appliedFilters.purchaseOrder
        .trim()
        .toLowerCase();

    const getRecordDate = (record) =>
      record?.latestDispatchDate ||
      record?.orderDate ||
      record?.requiredDate ||
      null;

    return allDispatches.filter(
      (record) => {

        const materialText =
          Array.isArray(record?.items)
            ? record.items
                .map((item) =>
                  [
                    item?.materialName,
                    item?.materialCode,
                  ]
                    .filter(Boolean)
                    .join(" ")
                )
                .join(" ")
            : "";

        const searchableText = [
          record?.poNumber,
          record?.latestDispatchNumber,
          materialText,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();


        if (
          normalizedSearch &&
          !searchableText.includes(
            normalizedSearch
          )
        ) {

          return false;

        }


        if (
          normalizedPurchaseOrder &&
          !String(
            record?.poNumber || ""
          )
            .toLowerCase()
            .includes(
              normalizedPurchaseOrder
            )
        ) {

          return false;

        }


        const recordStatus =
          record?.latestDispatchStatus ||
          record?.dispatchStatus ||
          "";


        if (
          appliedFilters.status &&
          recordStatus !==
            appliedFilters.status &&
          !(
            appliedFilters.status ===
              "Partial" &&
            record?.dispatchStatus ===
              "Partial Dispatch"
          ) &&
          !(
            appliedFilters.status ===
              "Dispatched" &&
            record?.dispatchStatus ===
              "Fully Dispatched"
          )
        ) {

          return false;

        }


        const recordDate =
          getRecordDate(record);


        if (
          !recordDate &&
          (
            appliedFilters.fromDate ||
            appliedFilters.toDate
          )
        ) {

          return false;

        }


        const dateValue =
          recordDate
            ? new Date(
                recordDate
              )
                .toISOString()
                .slice(0, 10)
            : "";


        if (
          appliedFilters.fromDate &&
          dateValue <
            appliedFilters.fromDate
        ) {

          return false;

        }


        if (
          appliedFilters.toDate &&
          dateValue >
            appliedFilters.toDate
        ) {

          return false;

        }


        return true;

      }
    );

  }, [
    allDispatches,
    appliedFilters,
  ]);


  // =========================================================
  // FILTER REPLACEMENT DISPATCHES
  // =========================================================

  const filteredReplacementDispatches =
    useMemo(() => {

      const normalizedSearch =
        appliedFilters.search
          .trim()
          .toLowerCase();

      const normalizedPO =
        appliedFilters.purchaseOrder
          .trim()
          .toLowerCase();

      return replacementDispatches.filter(
        (dispatch) => {

          const items =
            Array.isArray(dispatch?.items)
              ? dispatch.items
              : [];


          const materialText =
            items
              .map((item) =>
                [
                  item?.materialCode,
                  item?.materialName,
                ]
                  .filter(Boolean)
                  .join(" ")
              )
              .join(" ");


          const replacementRequest =
            items.find(
              (item) =>
                item?.replacementRequest
            )
              ?.replacementRequest;


          const replacementRequestNumber =
            typeof replacementRequest ===
            "object"
              ? replacementRequest?.requestNumber ||
                replacementRequest?.replacementRequestNumber ||
                replacementRequest?.rrNumber ||
                ""
              : "";


          const searchableText = [
            dispatch?.dispatchNumber,
            dispatch?.purchaseOrder?.poNumber,
            dispatch?.poNumber,
            replacementRequestNumber,
            materialText,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


          // SEARCH

          if (
            normalizedSearch &&
            !searchableText.includes(
              normalizedSearch
            )
          ) {

            return false;

          }


          // PO FILTER

          const poNumber =
            dispatch?.purchaseOrder?.poNumber ||
            dispatch?.poNumber ||
            "";

          if (
            normalizedPO &&
            !String(poNumber)
              .toLowerCase()
              .includes(
                normalizedPO
              )
          ) {

            return false;

          }


          // STATUS FILTER

          if (
            appliedFilters.status
          ) {

            const dispatchStatus =
              dispatch?.status || "";

            if (
              appliedFilters.status !==
                dispatchStatus &&
              !(
                appliedFilters.status ===
                  "Dispatched" &&
                dispatchStatus ===
                  "Dispatched"
              )
            ) {

              return false;

            }

          }


          // DATE FILTER

          const dispatchDate =
            dispatch?.dispatchDate ||
            dispatch?.createdAt ||
            null;


          if (
            !dispatchDate &&
            (
              appliedFilters.fromDate ||
              appliedFilters.toDate
            )
          ) {

            return false;

          }


          if (dispatchDate) {

            const dateValue =
              new Date(
                dispatchDate
              )
                .toISOString()
                .slice(0, 10);


            if (
              appliedFilters.fromDate &&
              dateValue <
                appliedFilters.fromDate
            ) {

              return false;

            }


            if (
              appliedFilters.toDate &&
              dateValue >
                appliedFilters.toDate
            ) {

              return false;

            }

          }


          return true;

        }
      );

    }, [
      replacementDispatches,
      appliedFilters,
    ]);


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadDispatches();

    loadReplacementDispatches();

  }, [
    loadDispatches,
    loadReplacementDispatches,
  ]);


  // =========================================================
  // LOAD HISTORY AFTER PO OVERVIEW LOAD
  // =========================================================

  useEffect(() => {

    if (
      Array.isArray(allDispatches) &&
      allDispatches.length > 0
    ) {

      loadDispatchHistory(
        allDispatches
      );

    } else {

      setDispatchHistoryByPO({});

    }

  }, [
    allDispatches,
    loadDispatchHistory,
  ]);


  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearchChange =
    (value) => {

      setSearch(value);

      setPage(1);

    };


  // =========================================================
  // STATUS
  // =========================================================

  const handleStatusChange =
    (value) => {

      setStatus(value);

      setPage(1);

    };


  // =========================================================
  // PURCHASE ORDER
  // =========================================================

  const handlePurchaseOrderChange =
    (value) => {

      setPurchaseOrder(value);

      setPage(1);

    };


  // =========================================================
  // FROM DATE
  // =========================================================

  const handleFromDateChange =
    (value) => {

      setFromDate(value);

      setPage(1);

    };


  // =========================================================
  // TO DATE
  // =========================================================

  const handleToDateChange =
    (value) => {

      setToDate(value);

      setPage(1);

    };


  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {

    setSearch("");

    setStatus("");

    setPurchaseOrder("");

    setFromDate("");

    setToDate("");

    setAppliedFilters({
      search: "",
      status: "",
      purchaseOrder: "",
      fromDate: "",
      toDate: "",
    });

    setPage(1);

  };


  // =========================================================
  // APPLY FILTERS
  // =========================================================

  const handleApplyFilters =
    () => {

      setAppliedFilters({
        search,
        status,
        purchaseOrder,
        fromDate,
        toDate,
      });

      setPage(1);

    };


  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {

    loadDispatches();

    loadReplacementDispatches();

  };


  // =========================================================
  // CREATE / CONTINUE NORMAL DISPATCH
  // =========================================================

  const handleDispatch =
    (record) => {

      if (!record) {

        toast.error(
          "Purchase Order information is missing."
        );

        return;

      }


      const purchaseOrderId =
        record._id ||
        record.purchaseOrder?._id ||
        record.purchaseOrder?.id ||
        record.po?._id ||
        record.po?.id ||
        record.purchaseOrderId ||
        record.poId;


      if (!purchaseOrderId) {

        console.error(
          "Purchase Order ID missing:",
          record
        );

        toast.error(
          "Purchase Order ID is missing."
        );

        return;

      }


      navigate(
        `/vendor/dispatches/create/${purchaseOrderId}`
      );

    };


  // =========================================================
  // VIEW NORMAL DISPATCH / HISTORY
  // =========================================================

  const handleView =
    (record) => {

      if (!record) {

        toast.error(
          "Dispatch information is missing."
        );

        return;

      }


      const dispatchId =
        record.latestDispatchId ||
        record.latestDispatch?._id ||
        record.dispatch?._id ||
        record.dispatchId;


      if (!dispatchId) {

        toast.error(
          "No dispatch has been created for this purchase order yet."
        );

        return;

      }


      navigate(
        `/vendor/dispatches/${dispatchId}`
      );

    };


  // =========================================================
  // VIEW INDIVIDUAL DISPATCH
  // =========================================================
  //
  // This is different from handleView().
  //
  // handleView() is for the existing PO overview.
  //
  // handleIndividualDispatch() is for:
  //
  // DSP000001
  // DSP000002
  // ...
  //
  // Each individual dispatch can be delivered separately.
  // =========================================================

  const handleIndividualDispatch =
    (dispatch) => {

      if (!dispatch) {

        toast.error(
          "Dispatch information is missing."
        );

        return;

      }


      const dispatchId =
        dispatch?._id ||
        dispatch?.id;


      if (!dispatchId) {

        console.error(
          "Dispatch ID missing:",
          dispatch
        );

        toast.error(
          "Dispatch ID is missing."
        );

        return;

      }


      navigate(
        `/vendor/dispatches/${dispatchId}`
      );

    };


  // =========================================================
  // OPEN REPLACEMENT DISPATCH DELIVERY
  // =========================================================

  const handleReplacementDelivery =
    (dispatch) => {

      if (!dispatch) {

        toast.error(
          "Replacement dispatch information is missing."
        );

        return;

      }


      const dispatchId =
        dispatch?._id ||
        dispatch?.id;


      if (!dispatchId) {

        console.error(
          "Replacement Dispatch ID missing:",
          dispatch
        );

        toast.error(
          "Replacement Dispatch ID is missing."
        );

        return;

      }


      navigate(
        `/vendor/dispatches/${dispatchId}`
      );

    };


  // =========================================================
  // PAGINATION
  // =========================================================

  const handlePageChange =
    (newPage) => {

      if (
        newPage < 1 ||
        newPage > pages
      ) {

        return;

      }

      setPage(newPage);

    };


  // =========================================================
  // NORMAL DISPATCH HISTORY ROWS
  // =========================================================
  //
  // Convert:
  //
  // {
  //   PO1: [DSP1, DSP2],
  //   PO2: [DSP3]
  // }
  //
  // into a flat list for display.
  // =========================================================

  const individualDispatchHistory =
    useMemo(() => {

      const normalizedSearch =
        appliedFilters.search
          .trim()
          .toLowerCase();

      const normalizedPO =
        appliedFilters.purchaseOrder
          .trim()
          .toLowerCase();

      const rows = [];

      Object.entries(
        dispatchHistoryByPO
      ).forEach(
        ([
          purchaseOrderId,
          history,
        ]) => {

          const overviewRecord =
            allDispatches.find(
              (record) => {

                const id =
                  record?._id ||
                  record?.purchaseOrder?._id ||
                  record?.purchaseOrder?.id ||
                  record?.purchaseOrderId ||
                  record?.poId;

                return (
                  String(id) ===
                  String(purchaseOrderId)
                );

              }
            );


          const historyRecords =
            Array.isArray(history)
              ? history
              : [];


          historyRecords.forEach(
            (dispatch) => {

              const items =
                Array.isArray(
                  dispatch?.items
                )
                  ? dispatch.items
                  : [];


              const materialText =
                items
                  .map(
                    (item) =>
                      [
                        item?.materialCode,
                        item?.materialName,
                      ]
                        .filter(Boolean)
                        .join(" ")
                  )
                  .join(" ");


              const poNumber =
                dispatch?.purchaseOrder?.poNumber ||
                dispatch?.poNumber ||
                overviewRecord?.poNumber ||
                "—";


              const searchableText = [
                dispatch?.dispatchNumber,
                poNumber,
                materialText,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


              // SEARCH

              if (
                normalizedSearch &&
                !searchableText.includes(
                  normalizedSearch
                )
              ) {

                return;

              }


              // PURCHASE ORDER FILTER

              if (
                normalizedPO &&
                !String(poNumber)
                  .toLowerCase()
                  .includes(
                    normalizedPO
                  )
              ) {

                return;

              }


              // STATUS FILTER

              if (
                appliedFilters.status &&
                dispatch?.status !==
                  appliedFilters.status
              ) {

                return;

              }


              // DATE FILTER

              const dispatchDate =
                dispatch?.dispatchDate ||
                dispatch?.createdAt ||
                null;


              if (
                !dispatchDate &&
                (
                  appliedFilters.fromDate ||
                  appliedFilters.toDate
                )
              ) {

                return;

              }


              if (dispatchDate) {

                const dateValue =
                  new Date(
                    dispatchDate
                  )
                    .toISOString()
                    .slice(0, 10);


                if (
                  appliedFilters.fromDate &&
                  dateValue <
                    appliedFilters.fromDate
                ) {

                  return;

                }


                if (
                  appliedFilters.toDate &&
                  dateValue >
                    appliedFilters.toDate
                ) {

                  return;

                }

              }


              rows.push({

                ...dispatch,

                purchaseOrderId,

                overviewRecord,

              });

            }
          );

        }
      );


      return rows.sort(
        (a, b) => {

          const dateA =
            new Date(
              a?.dispatchDate ||
              a?.createdAt ||
              0
            ).getTime();

          const dateB =
            new Date(
              b?.dispatchDate ||
              b?.createdAt ||
              0
            ).getTime();

          return dateB - dateA;

        }
      );

    }, [
      dispatchHistoryByPO,
      allDispatches,
      appliedFilters,
    ]);


  // =========================================================
  // DASHBOARD SUMMARY
  // =========================================================

  const summary = useMemo(() => {

    let readyToDispatch = 0;

    let dispatched = 0;

    let partialDispatch = 0;

    let inTransit = 0;

    let pendingQuantity = 0;

    let delayed = 0;


    dispatches.forEach(
      (record) => {

        const orderedQuantity =
          Number(
            record?.orderedQuantity ||
              0
          );


        const dispatchedQuantity =
          Number(
            record?.dispatchedQuantity ||
              0
          );


        const remainingQuantity =
          Number(
            record?.pendingQuantity ??
              record?.remainingQuantity ??
              Math.max(
                orderedQuantity -
                  dispatchedQuantity,
                0
              )
          );


        const dispatchStatus =
          record?.dispatchStatus ||
          "";


        if (
          dispatchStatus ===
            "Ready to Dispatch" &&
          remainingQuantity > 0
        ) {

          readyToDispatch += 1;

        }


        if (
          dispatchStatus ===
          "Fully Dispatched"
        ) {

          dispatched += 1;

        }


        if (
          dispatchStatus ===
          "Partial Dispatch"
        ) {

          partialDispatch += 1;

        }


        pendingQuantity +=
          remainingQuantity;


        if (
          record?.dispatchStatus ===
          "In Transit"
        ) {

          inTransit += 1;

        }


        if (
          record?.isDelayed === true ||
          record?.dispatchStatus ===
            "Delayed"
        ) {

          delayed += 1;

        }

      }
    );


    return {
      readyToDispatch,
      dispatched,
      partialDispatch,
      inTransit,
      pendingQuantity,
      delayed,
    };

  }, [dispatches]);


  // =========================================================
  // ANALYTICS DATA
  // =========================================================

  const analyticsData = useMemo(() => {

    return {
      dispatches,
      total: dispatches.length,
    };

  }, [dispatches]);


  // =========================================================
  // REPLACEMENT STATUS CLASS
  // =========================================================

  const replacementStatusClass =
    (status) => {

      switch (status) {

        case "Delivered":
          return "bg-green-100 text-green-700";

        case "In Transit":
          return "bg-orange-100 text-orange-700";

        case "Dispatched":
          return "bg-blue-100 text-blue-700";

        case "Cancelled":
          return "bg-red-100 text-red-700";

        case "Draft":
        default:
          return "bg-slate-100 text-slate-700";

      }

    };


  // =========================================================
  // INDIVIDUAL DISPATCH STATUS CLASS
  // =========================================================

  const individualDispatchStatusClass =
    (dispatchStatus) => {

      switch (dispatchStatus) {

        case "Delivered":
          return "bg-green-100 text-green-700";

        case "In Transit":
          return "bg-orange-100 text-orange-700";

        case "Dispatched":
          return "bg-blue-100 text-blue-700";

        case "Cancelled":
          return "bg-red-100 text-red-700";

        case "Draft":
        default:
          return "bg-slate-100 text-slate-700";

      }

    };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="space-y-6">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Dispatch
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage dispatches, partial deliveries,
          fulfillment and delivery tracking.
        </p>

      </div>


      {/* =====================================================
          SUMMARY CARDS
          ===================================================== */}

      <DispatchSummaryCards
        readyToDispatch={
          summary.readyToDispatch
        }
        dispatched={
          summary.dispatched
        }
        partialDispatch={
          summary.partialDispatch
        }
        inTransit={
          summary.inTransit
        }
        pendingQuantity={
          summary.pendingQuantity
        }
        delayed={
          summary.delayed
        }
      />


      {/* =====================================================
          DISPATCH FILTERS
          ===================================================== */}

      <DispatchFilters
        search={search}
        status={status}
        purchaseOrder={
          purchaseOrder
        }
        fromDate={fromDate}
        toDate={toDate}
        onSearchChange={
          handleSearchChange
        }
        onStatusChange={
          handleStatusChange
        }
        onPurchaseOrderChange={
          handlePurchaseOrderChange
        }
        onFromDateChange={
          handleFromDateChange
        }
        onToDateChange={
          handleToDateChange
        }
        onApply={
          handleApplyFilters
        }
        onReset={
          handleReset
        }
        onRefresh={
          handleRefresh
        }
        loading={
          loading ||
          replacementLoading ||
          dispatchHistoryLoading
        }
      />


      {/* =====================================================
          NORMAL PO DISPATCH OVERVIEW
          ===================================================== */}

      <DispatchOverviewTable
        dispatches={dispatches}
        loading={loading}
        page={page}
        pages={pages}
        total={dispatches.length}
        onDispatch={
          handleDispatch
        }
        onView={
          handleView
        }
        onPageChange={
          handlePageChange
        }
      />


      {/* =====================================================
          INDIVIDUAL DISPATCH HISTORY
          =====================================================
          
          IMPORTANT:
          
          This section fixes the multiple-dispatch display.
          
          Example:
          
          PO = 100
          
          DSP000001 = 95
          DSP000002 = 5
          
          Both appear separately.
          ===================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white">

        {/* HEADER */}

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <FaTruck className="text-blue-600" />

                <h2 className="text-base font-semibold text-slate-800">
                  Individual Dispatch History
                </h2>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Every normal dispatch created against the purchase order.
              </p>

            </div>


            <div className="text-sm text-slate-500">

              Total Dispatches:{" "}

              <span className="font-semibold text-slate-700">
                {individualDispatchHistory.length}
              </span>

            </div>

          </div>

        </div>


        {/* LOADING */}

        {dispatchHistoryLoading ? (

          <div className="p-10 text-center">

            <div className="text-sm text-slate-500">
              Loading dispatch history...
            </div>

          </div>

        ) : individualDispatchHistory.length === 0 ? (

          /* EMPTY */

          <div className="p-10 text-center">

            <FaBox className="mx-auto text-2xl text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-600">
              No individual dispatches found.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Individual dispatches will appear here after the vendor creates a dispatch.
            </p>

          </div>

        ) : (

          /* TABLE */

          <div className="overflow-x-auto">

            <table className="min-w-full text-sm">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    DISPATCH
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    PURCHASE ORDER
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    TYPE
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    MATERIAL
                  </th>

                  <th className="px-5 py-3 text-right font-semibold text-slate-600">
                    QTY
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    DISPATCH DATE
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    STATUS
                  </th>

                  <th className="px-5 py-3 text-center font-semibold text-slate-600">
                    ACTION
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {individualDispatchHistory.map(
                  (dispatch, index) => {

                    const items =
                      Array.isArray(
                        dispatch?.items
                      )
                        ? dispatch.items
                        : [];


                    const poNumber =
                      dispatch?.purchaseOrder?.poNumber ||
                      dispatch?.poNumber ||
                      dispatch?.overviewRecord?.poNumber ||
                      "—";


                    return (

                      <tr
                        key={
                          dispatch?._id ||
                          `${dispatch?.dispatchNumber}-${index}`
                        }
                        className="hover:bg-slate-50"
                      >

                        {/* DISPATCH */}

                        <td className="px-5 py-4">

                          <p className="font-semibold text-slate-700">
                            {dispatch?.dispatchNumber ||
                              "—"}
                          </p>

                          {dispatch?.dispatchType && (

                            <p className="mt-1 text-xs text-slate-400">
                              {dispatch.dispatchType}
                            </p>

                          )}

                        </td>


                        {/* PO */}

                        <td className="px-5 py-4">

                          <span className="font-medium text-slate-700">
                            {poNumber}
                          </span>

                        </td>


                        {/* TYPE */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              dispatch?.dispatchType ===
                              "Partial"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >

                            {dispatch?.dispatchType ||
                              "Full"}

                          </span>

                        </td>


                        {/* MATERIAL */}

                        <td className="px-5 py-4">

                          <div className="space-y-2">

                            {items.length > 0 ? (

                              items.map(
                                (
                                  item,
                                  itemIndex
                                ) => (

                                  <div
                                    key={
                                      item?._id ||
                                      `${dispatch?._id}-item-${itemIndex}`
                                    }
                                  >

                                    <p className="font-medium text-slate-700">
                                      {item?.materialCode ||
                                        "—"}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                      {item?.materialName ||
                                        "—"}
                                    </p>

                                  </div>

                                )
                              )

                            ) : (

                              <span className="text-slate-400">
                                —
                              </span>

                            )}

                          </div>

                        </td>


                        {/* QUANTITY */}

                        <td className="px-5 py-4 text-right">

                          <div className="space-y-2">

                            {items.length > 0 ? (

                              items.map(
                                (
                                  item,
                                  itemIndex
                                ) => (

                                  <p
                                    key={
                                      item?._id ||
                                      `${dispatch?._id}-qty-${itemIndex}`
                                    }
                                    className="font-semibold text-blue-700"
                                  >

                                    {item?.dispatchQuantity ??
                                      0}

                                    {" "}

                                    <span className="text-xs font-normal text-slate-400">
                                      {item?.unitOfMeasure ||
                                        ""}
                                    </span>

                                  </p>

                                )
                              )

                            ) : (

                              <span className="text-slate-400">
                                0
                              </span>

                            )}

                          </div>

                        </td>


                        {/* DATE */}

                        <td className="px-5 py-4 text-slate-600">

                          {dispatch?.dispatchDate
                            ? new Date(
                                dispatch.dispatchDate
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "—"}

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${individualDispatchStatusClass(
                              dispatch?.status
                            )}`}
                          >

                            {dispatch?.status ===
                              "Delivered" ? (
                              <FaCircleCheck />
                            ) : dispatch?.status ===
                              "In Transit" ? (
                              <FaTruck />
                            ) : (
                              <FaClock />
                            )}

                            {dispatch?.status ||
                              "Draft"}

                          </span>

                        </td>


                        {/* ACTION */}

                        <td className="px-5 py-4 text-center">

                          <button
                            type="button"
                            onClick={() =>
                              handleIndividualDispatch(
                                dispatch
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                          >

                            {dispatch?.status ===
                            "Delivered" ? (
                              <>
                                <FaEye />
                                View
                              </>
                            ) : (
                              <>
                                <FaTruck />
                                Delivery
                              </>
                            )}

                          </button>

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


      {/* =====================================================
          REPLACEMENT DISPATCHES
          ===================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white">

        {/* HEADER */}

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <FaTruck className="text-blue-600" />

                <h2 className="text-base font-semibold text-slate-800">
                  Replacement Dispatches
                </h2>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Replacement items dispatched against approved replacement requests.
              </p>

            </div>


            <div className="text-sm text-slate-500">

              Total Records:{" "}

              <span className="font-semibold text-slate-700">
                {filteredReplacementDispatches.length}
              </span>

            </div>

          </div>

        </div>


        {/* LOADING */}

        {replacementLoading ? (

          <div className="p-10 text-center">

            <div className="text-sm text-slate-500">
              Loading replacement dispatches...
            </div>

          </div>

        ) : filteredReplacementDispatches.length === 0 ? (

          /* EMPTY */

          <div className="p-10 text-center">

            <FaBox className="mx-auto text-2xl text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-600">
              No replacement dispatches found.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Replacement dispatches will appear here after the vendor dispatches replacement items.
            </p>

          </div>

        ) : (

          /* TABLE */

          <div className="overflow-x-auto">

            <table className="min-w-full text-sm">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    DISPATCH
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    REPLACEMENT REQUEST
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    PURCHASE ORDER
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    MATERIAL
                  </th>

                  <th className="px-5 py-3 text-right font-semibold text-slate-600">
                    QTY
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    DISPATCH DATE
                  </th>

                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    STATUS
                  </th>

                  <th className="px-5 py-3 text-center font-semibold text-slate-600">
                    ACTION
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filteredReplacementDispatches.map(
                  (dispatch) => {

                    const items =
                      Array.isArray(
                        dispatch?.items
                      )
                        ? dispatch.items
                        : [];


                    const replacementItems =
                      items.filter(
                        (item) =>
                          item?.isReplacement === true ||
                          Boolean(
                            item?.replacementRequest
                          )
                      );


                    const displayItems =
                      replacementItems.length >
                      0
                        ? replacementItems
                        : items;


                    const replacementRequest =
                      displayItems.find(
                        (item) =>
                          item?.replacementRequest
                      )
                        ?.replacementRequest;


                    const replacementRequestNumber =
                      typeof replacementRequest ===
                      "object"
                        ? (
                            replacementRequest?.requestNumber ||
                            replacementRequest?.replacementRequestNumber ||
                            replacementRequest?.rrNumber ||
                            replacementRequest?.code ||
                            "—"
                          )
                        : (
                            dispatch?.replacementRequestNumber ||
                            "—"
                          );


                    const poNumber =
                      dispatch?.purchaseOrder?.poNumber ||
                      dispatch?.poNumber ||
                      "—";


                    return (

                      <tr
                        key={
                          dispatch?._id ||
                          dispatch?.dispatchNumber
                        }
                        className="hover:bg-slate-50"
                      >

                        {/* DISPATCH */}

                        <td className="px-5 py-4">

                          <p className="font-semibold text-slate-700">
                            {dispatch?.dispatchNumber ||
                              "—"}
                          </p>

                          <p className="mt-1 text-xs text-purple-600">
                            Replacement Dispatch
                          </p>

                        </td>


                        {/* REPLACEMENT REQUEST */}

                        <td className="px-5 py-4">

                          <p className="font-medium text-slate-700">
                            {replacementRequestNumber}
                          </p>

                          {typeof replacementRequest ===
                            "object" &&
                            replacementRequest?.status && (

                              <p className="mt-1 text-xs text-slate-400">
                                {replacementRequest.status}
                              </p>

                            )}

                        </td>


                        {/* PO */}

                        <td className="px-5 py-4">

                          <span className="font-medium text-slate-700">
                            {poNumber}
                          </span>

                        </td>


                        {/* MATERIAL */}

                        <td className="px-5 py-4">

                          <div className="space-y-2">

                            {displayItems.map(
                              (
                                item,
                                index
                              ) => (

                                <div
                                  key={
                                    item?._id ||
                                    `${dispatch?._id}-item-${index}`
                                  }
                                >

                                  <p className="font-medium text-slate-700">
                                    {item?.materialCode ||
                                      "—"}
                                  </p>

                                  <p className="text-xs text-slate-500">
                                    {item?.materialName ||
                                      "—"}
                                  </p>

                                </div>

                              )
                            )}

                          </div>

                        </td>


                        {/* QUANTITY */}

                        <td className="px-5 py-4 text-right">

                          <div className="space-y-2">

                            {displayItems.map(
                              (
                                item,
                                index
                              ) => (

                                <p
                                  key={
                                    item?._id ||
                                    `${dispatch?._id}-qty-${index}`
                                  }
                                  className="font-semibold text-blue-700"
                                >

                                  {item?.dispatchQuantity ??
                                    0}

                                  {" "}

                                  <span className="text-xs font-normal text-slate-400">
                                    {item?.unitOfMeasure ||
                                      ""}
                                  </span>

                                </p>

                              )
                            )}

                          </div>

                        </td>


                        {/* DATE */}

                        <td className="px-5 py-4 text-slate-600">

                          {dispatch?.dispatchDate
                            ? new Date(
                                dispatch.dispatchDate
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "—"}

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${replacementStatusClass(
                              dispatch?.status
                            )}`}
                          >

                            {dispatch?.status ===
                              "Delivered" ? (
                              <FaCircleCheck />
                            ) : dispatch?.status ===
                              "In Transit" ? (
                              <FaTruck />
                            ) : (
                              <FaClock />
                            )}

                            {dispatch?.status ||
                              "Draft"}

                          </span>

                        </td>


                        {/* ACTION */}

                        <td className="px-5 py-4 text-center">

                          <button
                            type="button"
                            onClick={() =>
                              handleReplacementDelivery(
                                dispatch
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                          >

                            {dispatch?.status ===
                            "Delivered" ? (
                              <>
                                <FaEye />
                                View
                              </>
                            ) : (
                              <>
                                <FaTruck />
                                Delivery
                              </>
                            )}

                          </button>

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


      {/* =====================================================
          ANALYTICS
          ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        <FulfillmentProgress
          data={analyticsData}
        />

        <DispatchTrend
          data={analyticsData}
        />

        <TopMaterials
          data={analyticsData}
        />

      </div>

    </div>

  );

};


export default VendorDispatches;