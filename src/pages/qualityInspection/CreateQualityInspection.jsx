import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  PackageCheck,
  Truck,
  ClipboardCheck,
  CircleCheck,
  Clock3,
  AlertTriangle,
  CalendarDays,
  FileText,
} from "lucide-react";

import {
  getEligibleGoodsReceipts,
  createQualityInspection,
} from "../../services/qualityInspectionService";


const CreateQualityInspection = () => {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [goodsReceipts, setGoodsReceipts] = useState([]);

  const [selectedGRN, setSelectedGRN] = useState(null);

  const [search, setSearch] = useState("");

  const [vendorFilter, setVendorFilter] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [materialFilter, setMaterialFilter] = useState("");

  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const rowsPerPage = 5;


  // =========================================================
  // LOAD ELIGIBLE GRNs
  // =========================================================

  const loadEligibleGRNs = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getEligibleGoodsReceipts();

      console.log(
        "Eligible GRNs Response:",
        response
      );

      const data =
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

      setGoodsReceipts(data);

    } catch (err) {
      console.error(
        "Load Eligible GRNs Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load eligible Goods Receipts."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadEligibleGRNs();
  }, []);


  // =========================================================
  // NORMALIZE DATA
  // =========================================================

  const normalizeGRN = (grn) => {
    const purchaseOrder =
      grn.purchaseOrder ||
      grn.po ||
      {};

    const vendor =
      grn.vendor ||
      purchaseOrder.vendor ||
      {};

    const items = Array.isArray(grn.items) ? grn.items : [];
    const firstItem = items[0] || {};

    const material =
      firstItem.material ||
      grn.material ||
      grn.materialItem ||
      {};

    const materialName =
      firstItem.materialName ||
      material.materialName ||
      grn.materialName ||
      grn.itemName ||
      "-";

    const materialId =
      firstItem.material?._id ||
      firstItem.material ||
      material._id ||
      grn.materialId ||
      "";

    const receivedQty =
      items.length > 0
        ? items.reduce((sum, it) => sum + (Number(it.receivedQuantity) || 0), 0)
        : grn.receivedQuantity ?? grn.receivedQty ?? grn.quantityReceived ?? 0;

    const orderedQty =
      items.length > 0
        ? items.reduce((sum, it) => sum + (Number(it.orderedQuantity) || 0), 0)
        : grn.orderedQuantity ?? grn.orderedQty ?? purchaseOrder.quantity ?? 0;

    const dispatchedQty =
      items.length > 0
        ? items.reduce((sum, it) => sum + (Number(it.dispatchedQuantity) || 0), 0)
        : grn.dispatchedQuantity ?? grn.dispatchedQty ?? 0;

    const shortQty =
      items.length > 0
        ? items.reduce((sum, it) => sum + (Number(it.shortQuantity) || 0), 0)
        : grn.shortQuantity ?? grn.shortQty ?? 0;

    const damagedQty =
      items.length > 0
        ? items.reduce((sum, it) => sum + (Number(it.damageQuantity ?? it.damagedQuantity) || 0), 0)
        : grn.damagedQuantity ?? grn.damagedQty ?? 0;

    const pendingQty =
      items.length > 0
        ? Math.max(0, orderedQty - receivedQty)
        : grn.pendingQuantity ?? grn.pendingQty ?? 0;

    const unit =
      firstItem.unitOfMeasure ||
      firstItem.uom ||
      grn.uom ||
      grn.unit ||
      material.uom ||
      "KG";

    return {
      ...grn,

      grnNumber:
        grn.grnNumber ||
        grn.grnNo ||
        grn.receiptNumber ||
        "-",

      grnDate:
        grn.grnDate ||
        grn.receiptDate ||
        grn.createdAt,

      poNumber:
        purchaseOrder.poNumber ||
        grn.poNumber ||
        grn.purchaseOrderNumber ||
        "-",

      vendorName:
        vendor.vendorName ||
        vendor.companyName ||
        grn.vendorName ||
        "-",

      vendorId:
        vendor._id ||
        grn.vendorId ||
        "",

      materialName,
      materialId,
      receivedQty,
      orderedQty,
      dispatchedQty,
      shortQty,
      damagedQty,
      pendingQty,
      unit,

      status:
        grn.status ||
        "Received",
    };
  };


  const normalizedGRNs =
    useMemo(
      () =>
        goodsReceipts.map(
          normalizeGRN
        ),
      [goodsReceipts]
    );


  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const vendorOptions =
    useMemo(() => {
      return [
        ...new Set(
          normalizedGRNs
            .map(
              (item) =>
                item.vendorName
            )
            .filter(Boolean)
        ),
      ];
    }, [normalizedGRNs]);


  const materialOptions =
    useMemo(() => {
      return [
        ...new Set(
          normalizedGRNs
            .map(
              (item) =>
                item.materialName
            )
            .filter(Boolean)
        ),
      ];
    }, [normalizedGRNs]);


  const statusOptions =
    useMemo(() => {
      return [
        ...new Set(
          normalizedGRNs
            .map(
              (item) =>
                item.status
            )
            .filter(Boolean)
        ),
      ];
    }, [normalizedGRNs]);


  // =========================================================
  // FILTERED GRNs
  // =========================================================

  const filteredGRNs =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return normalizedGRNs.filter(
        (item) => {

          const matchesSearch =
            !searchValue ||
            item.grnNumber
              .toLowerCase()
              .includes(searchValue) ||
            item.poNumber
              .toLowerCase()
              .includes(searchValue) ||
            item.vendorName
              .toLowerCase()
              .includes(searchValue) ||
            item.materialName
              .toLowerCase()
              .includes(searchValue);

          const matchesVendor =
            !vendorFilter ||
            item.vendorName ===
              vendorFilter;

          const matchesStatus =
            !statusFilter ||
            item.status ===
              statusFilter;

          const matchesMaterial =
            !materialFilter ||
            item.materialName ===
              materialFilter;

          return (
            matchesSearch &&
            matchesVendor &&
            matchesStatus &&
            matchesMaterial
          );
        }
      );
    }, [
      normalizedGRNs,
      search,
      vendorFilter,
      statusFilter,
      materialFilter,
    ]);


  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredGRNs.length /
          rowsPerPage
      )
    );

  const paginatedGRNs =
    filteredGRNs.slice(
      (page - 1) *
        rowsPerPage,
      page *
        rowsPerPage
    );


  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [
    page,
    totalPages,
  ]);


  // =========================================================
  // SELECT GRN
  // =========================================================

  const handleSelectGRN = (grn) => {
    setSelectedGRN(grn);
  };


  // =========================================================
  // CREATE INSPECTION
  // =========================================================

  const handleNext = async () => {
    if (!selectedGRN) {
      setError(
        "Please select a Goods Receipt before continuing."
      );

      return;
    }

    try {
      setCreating(true);
      setError("");

      const goodsReceiptId =
        selectedGRN._id ||
        selectedGRN.id;

      if (!goodsReceiptId) {
        setError(
          "Selected Goods Receipt does not have a valid ID."
        );

        return;
      }

      // If the selected GRN already has an associated quality inspection, navigate directly
      if (selectedGRN.qualityInspection) {
        const qiId =
          typeof selectedGRN.qualityInspection === "object"
            ? (selectedGRN.qualityInspection._id || selectedGRN.qualityInspection.id)
            : selectedGRN.qualityInspection;

        if (qiId) {
          navigate(`/quality-inspection/inspections/${qiId}`);
          return;
        }
      }

      const response =
        await createQualityInspection(
          goodsReceiptId
        );

      console.log(
        "Created Quality Inspection:",
        response
      );

      const inspection =
        response?.data ||
        response;

      const inspectionId =
        inspection?._id ||
        inspection?.id;

      if (!inspectionId) {
        setError(
          "Quality Inspection was created, but its ID was not returned."
        );

        return;
      }

      navigate(
        `/quality-inspection/inspections/${inspectionId}`
      );

    } catch (err) {
      console.error(
        "Create Quality Inspection Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to create Quality Inspection."
      );

    } finally {
      setCreating(false);
    }
  };


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-GB"
    );
  };


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setVendorFilter("");
    setStatusFilter("");
    setMaterialFilter("");
    setPage(1);
  };


  // =========================================================
  // SELECTED GRN SUMMARY
  // =========================================================

  const selected =
    selectedGRN
      ? normalizeGRN(
          selectedGRN
        )
      : null;


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Create Quality Inspection
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

            <span>
              Quality Inspection
            </span>

            <ChevronRight
              size={16}
            />

            <span>
              Create Inspection
            </span>

            <ChevronRight
              size={16}
            />

            <span className="font-medium text-slate-800">
              Select GRN
            </span>

          </div>

        </div>


        <button
          type="button"
          onClick={() =>
            navigate(
              "/quality-inspection/dashboard"
            )
          }
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >

          <X size={17} />

          Cancel

        </button>

      </div>


      {/* =====================================================
          STEPPER
      ===================================================== */}

      <div className="mb-6 rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">

        <div className="flex items-center justify-between">

          {/* STEP 1 */}

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              1
            </div>

            <span className="text-sm font-semibold text-blue-700">
              Select GRN
            </span>

          </div>


          <div className="h-px flex-1 bg-slate-200 mx-4" />


          {/* STEP 2 */}

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
              2
            </div>

            <span className="text-sm text-slate-500">
              Inspection Details
            </span>

          </div>


          <div className="h-px flex-1 bg-slate-200 mx-4" />


          {/* STEP 3 */}

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
              3
            </div>

            <span className="text-sm text-slate-500">
              Material Inspection
            </span>

          </div>


          <div className="h-px flex-1 bg-slate-200 mx-4" />


          {/* STEP 4 */}

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
              4
            </div>

            <span className="text-sm text-slate-500">
              Specifications
            </span>

          </div>


          <div className="h-px flex-1 bg-slate-200 mx-4" />


          {/* STEP 5 */}

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
              5
            </div>

            <span className="text-sm text-slate-500">
              Defects & Docs
            </span>

          </div>


          <div className="h-px flex-1 bg-slate-200 mx-4" />


          {/* STEP 6 */}

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
              6
            </div>

            <span className="text-sm text-slate-500">
              Final Decision
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            <X size={17} />
          </button>

        </div>

      )}


      {/* =====================================================
          TOP INFORMATION
      ===================================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* ===================================================
            SELECT GRN
        =================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">

          <div className="mb-5">

            <h2 className="text-lg font-bold text-slate-900">
              Select Goods Receipt (GRN)
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose an eligible GRN to start inspection
            </p>

          </div>


          {/* SEARCH */}

          <div className="relative mb-4">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                );
                setPage(1);
              }}
              placeholder="Search GRN No., PO No., Vendor, Material..."
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          {/* FILTERS */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">

            <select
              value={vendorFilter}
              onChange={(event) => {
                setVendorFilter(
                  event.target.value
                );
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
            >

              <option value="">
                All Vendors
              </option>

              {vendorOptions.map(
                (vendor) => (
                  <option
                    key={vendor}
                    value={vendor}
                  >
                    {vendor}
                  </option>
                )
              )}

            </select>


            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target.value
                );
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
            >

              <option value="">
                All Status
              </option>

              {statusOptions.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}

            </select>


            <select
              value={materialFilter}
              onChange={(event) => {
                setMaterialFilter(
                  event.target.value
                );
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
            >

              <option value="">
                All Materials
              </option>

              {materialOptions.map(
                (material) => (
                  <option
                    key={material}
                    value={material}
                  >
                    {material}
                  </option>
                )
              )}

            </select>

          </div>


          <button
            type="button"
            onClick={() => {
              setPage(1);
            }}
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Search
          </button>


          {(search ||
            vendorFilter ||
            statusFilter ||
            materialFilter) && (

            <button
              type="button"
              onClick={clearFilters}
              className="mt-2 w-full text-sm font-medium text-slate-500 hover:text-blue-600"
            >
              Clear Filters
            </button>

          )}

        </div>


        {/* ===================================================
            SELECTED GRN INFORMATION
        =================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">

            <h2 className="text-lg font-bold text-slate-900">
              Selected GRN Information
            </h2>

          </div>


          {selected ? (

            <div className="space-y-4">

              <InfoRow
                label="GRN No."
                value={selected.grnNumber}
              />

              <InfoRow
                label="GRN Date"
                value={formatDate(
                  selected.grnDate
                )}
              />

              <InfoRow
                label="PO No."
                value={selected.poNumber}
              />

              <InfoRow
                label="Vendor"
                value={selected.vendorName}
              />

              <InfoRow
                label="Material"
                value={selected.materialName}
              />

              <InfoRow
                label="Total Received"
                value={`${selected.receivedQty} ${selected.unit}`}
              />

              <InfoRow
                label="Status"
                value={
                  <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    {selected.status}
                  </span>
                }
              />

            </div>

          ) : (

            <div className="flex h-full min-h-[250px] items-center justify-center text-center">

              <div>

                <FileText
                  size={42}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 font-semibold text-slate-600">
                  No GRN selected
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Select a Goods Receipt from the list below.
                </p>

              </div>

            </div>

          )}

        </div>


        {/* ===================================================
            INSPECTION FLOW
        =================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Inspection Flow
          </h2>

          <div className="mt-6 flex items-center justify-between">

            <FlowItem
              icon={<CheckCircle2 size={20} />}
              title="PO Created"
              status="Completed"
            />

            <div className="h-px flex-1 bg-slate-200" />

            <FlowItem
              icon={<Truck size={20} />}
              title="Dispatched"
              status="Completed"
            />

            <div className="h-px flex-1 bg-slate-200" />

            <FlowItem
              icon={<PackageCheck size={20} />}
              title="Goods Received"
              status="Completed"
              active
            />

            <div className="h-px flex-1 bg-slate-200" />

            <FlowItem
              icon={<ClipboardCheck size={20} />}
              title="Quality Inspection"
              status="Pending"
            />

            <div className="h-px flex-1 bg-slate-200" />

            <FlowItem
              icon={<CircleCheck size={20} />}
              title="Completed"
              status="Pending"
            />

          </div>


          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">

            <div className="flex gap-3">

              <AlertTriangle
                size={19}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <div>

                <p className="text-sm font-semibold text-amber-800">
                  Inspection creation
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  You are creating a new Quality Inspection
                  for the selected GRN. Please verify all
                  information before proceeding.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          ELIGIBLE GRNs
      ===================================================== */}

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="text-lg font-bold text-slate-900">
            Eligible Goods Receipts
          </h2>

        </div>


        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                  GRN No.
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                  GRN Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                  PO No.
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Vendor
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Material
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                  Received Qty
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Unit
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Short / Damage
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase text-slate-500">
                  Action
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>

                  <td
                    colSpan="10"
                    className="px-5 py-14 text-center"
                  >

                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading eligible Goods Receipts...
                    </p>

                  </td>

                </tr>

              ) : paginatedGRNs.length === 0 ? (

                <tr>

                  <td
                    colSpan="10"
                    className="px-5 py-14 text-center"
                  >

                    <PackageCheck
                      size={42}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 font-semibold text-slate-700">
                      No eligible Goods Receipts
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      There are currently no GRNs available
                      for Quality Inspection.
                    </p>

                  </td>

                </tr>

              ) : (

                paginatedGRNs.map(
                  (grn) => {

                    const normalized =
                      normalizeGRN(
                        grn
                      );

                    const isSelected =
                      selectedGRN?._id ===
                        grn._id ||
                      selectedGRN?.id ===
                        grn.id;

                    return (

                      <tr
                        key={
                          grn._id ||
                          grn.id
                        }
                        className={`transition ${
                          isSelected
                            ? "bg-blue-50"
                            : "hover:bg-slate-50"
                        }`}
                      >

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <input
                              type="radio"
                              checked={
                                isSelected
                              }
                              onChange={() =>
                                handleSelectGRN(
                                  grn
                                )
                              }
                              className="h-4 w-4 accent-blue-600"
                            />

                            <span className="font-semibold text-slate-800">
                              {normalized.grnNumber}
                            </span>

                          </div>

                        </td>


                        <td className="px-5 py-4 text-sm text-slate-600">

                          <div className="flex items-center gap-2">

                            <CalendarDays
                              size={15}
                              className="text-slate-400"
                            />

                            {formatDate(
                              normalized.grnDate
                            )}

                          </div>

                        </td>


                        <td className="px-5 py-4 text-sm font-medium text-slate-700">

                          {normalized.poNumber}

                        </td>


                        <td className="px-5 py-4 text-sm text-slate-700">

                          {normalized.vendorName}

                        </td>


                        <td className="px-5 py-4 text-sm text-slate-700">

                          {normalized.materialName}

                        </td>


                        <td className="px-5 py-4 text-right text-sm font-semibold text-slate-800">

                          {normalized.receivedQty}

                        </td>


                        <td className="px-5 py-4 text-sm text-slate-600">

                          {normalized.unit}

                        </td>


                        <td className="px-5 py-4 text-sm">

                          {Number(
                            normalized.shortQty
                          ) > 0 ? (

                            <span className="text-red-600">
                              {normalized.shortQty}{" "}
                              (Short)
                            </span>

                          ) : Number(
                              normalized.damagedQty
                            ) > 0 ? (

                            <span className="text-orange-600">
                              {normalized.damagedQty}{" "}
                              (Damage)
                            </span>

                          ) : (

                            <span className="text-slate-500">
                              0
                            </span>

                          )}

                        </td>


                        <td className="px-5 py-4">

                          <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">

                            {normalized.status}

                          </span>

                        </td>


                        <td className="px-5 py-4 text-center">

                          <button
                            type="button"
                            onClick={() =>
                              handleSelectGRN(
                                grn
                              )
                            }
                            className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                            }`}
                          >

                            {isSelected
                              ? "Selected"
                              : "Select"}

                          </button>

                        </td>

                      </tr>

                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>


        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-500">

            Showing{" "}

            <span className="font-semibold text-slate-700">
              {filteredGRNs.length === 0
                ? 0
                : (page - 1) *
                    rowsPerPage +
                  1}
            </span>

            {" "}to{" "}

            <span className="font-semibold text-slate-700">
              {Math.min(
                page *
                  rowsPerPage,
                filteredGRNs.length
              )}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-slate-700">
              {filteredGRNs.length}
            </span>

            {" "}entries

          </p>


          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage(
                  (current) =>
                    Math.max(
                      1,
                      current - 1
                    )
                )
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >

              <ChevronLeft
                size={17}
              />

            </button>


            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            )
              .slice(0, 5)
              .map(
                (number) => (

                  <button
                    key={number}
                    type="button"
                    onClick={() =>
                      setPage(
                        number
                      )
                    }
                    className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium ${
                      page === number
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {number}
                  </button>

                )
              )}


            <button
              type="button"
              disabled={
                page >=
                totalPages
              }
              onClick={() =>
                setPage(
                  (current) =>
                    Math.min(
                      totalPages,
                      current + 1
                    )
                )
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >

              <ChevronRight
                size={17}
              />

            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          GRN SUMMARY
      ===================================================== */}

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <h2 className="mb-4 text-lg font-bold text-slate-900">
          GRN Summary
        </h2>


        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">

          <SummaryCard
            icon={<FileText size={20} />}
            title="Ordered Qty"
            value={
              selected
                ? selected.orderedQty
                : 0
            }
            unit={
              selected?.unit ||
              "KG"
            }
          />

          <SummaryCard
            icon={<Truck size={20} />}
            title="Dispatched Qty"
            value={
              selected
                ? selected.dispatchedQty
                : 0
            }
            unit={
              selected?.unit ||
              "KG"
            }
          />

          <SummaryCard
            icon={<PackageCheck size={20} />}
            title="Received Qty"
            value={
              selected
                ? selected.receivedQty
                : 0
            }
            unit={
              selected?.unit ||
              "KG"
            }
          />

          <SummaryCard
            icon={<AlertTriangle size={20} />}
            title="Short Qty"
            value={
              selected
                ? selected.shortQty
                : 0
            }
            unit={
              selected?.unit ||
              "KG"
            }
          />

          <SummaryCard
            icon={<AlertTriangle size={20} />}
            title="Damaged Qty"
            value={
              selected
                ? selected.damagedQty
                : 0
            }
            unit={
              selected?.unit ||
              "KG"
            }
          />

          <SummaryCard
            icon={<Clock3 size={20} />}
            title="Pending Qty"
            value={
              selected
                ? selected.pendingQty
                : 0
            }
            unit={
              selected?.unit ||
              "KG"
            }
          />

        </div>

      </div>


      {/* =====================================================
          BOTTOM ACTION
      ===================================================== */}

      <div className="mt-6 flex items-center justify-end">

        <button
          type="button"
          disabled={
            !selectedGRN ||
            creating
          }
          onClick={handleNext}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {creating
            ? "Creating Inspection..."
            : "Next: Inspection Details"}

          {!creating && (
            <ChevronRight
              size={18}
            />
          )}

        </button>

      </div>

    </div>
  );
};


// =========================================================
// INFO ROW
// =========================================================

const InfoRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
};


// =========================================================
// FLOW ITEM
// =========================================================

const FlowItem = ({
  icon,
  title,
  status,
  active = false,
}) => {
  return (
    <div className="flex min-w-0 flex-col items-center text-center">

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full ${
          active
            ? "bg-blue-100 text-blue-600"
            : status === "Completed"
            ? "bg-green-100 text-green-600"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {icon}
      </div>

      <p className="mt-2 text-xs font-semibold text-slate-700">
        {title}
      </p>

      <p
        className={`mt-1 text-[10px] ${
          active
            ? "text-blue-600"
            : status === "Completed"
            ? "text-green-600"
            : "text-slate-400"
        }`}
      >
        {status}
      </p>

    </div>
  );
};


// =========================================================
// SUMMARY CARD
// =========================================================

const SummaryCard = ({
  icon,
  title,
  value,
  unit,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div>

          <p className="text-xs text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {value}{" "}
            <span className="text-xs font-medium text-slate-500">
              {unit}
            </span>
          </p>

        </div>

      </div>

    </div>
  );
};


export default CreateQualityInspection;