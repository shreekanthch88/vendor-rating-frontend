import { useEffect, useMemo, useState } from "react";

import {
  X,
  Save,
  CheckCircle2,
  FileText,
} from "lucide-react";

import {
  createGoodsReceipt,
} from "../../services/goodsReceiptService";


const CreateGoodsReceiptForm = ({
  dispatch,
  onClose,
  onSuccess,
}) => {

  // =====================================================
  // DETECT REPLACEMENT DISPATCH
  // =====================================================

  const isReplacementDispatch =
    Boolean(
      dispatch?.isReplacement === true ||
      dispatch?.dispatchType === "Replacement" ||
      dispatch?.items?.some(
        (item) =>
          item?.isReplacement === true ||
          item?.dispatchType === "Replacement"
      )
    );


  // =====================================================
  // GET REPLACEMENT REQUEST ID
  // =====================================================

  const replacementRequestId =
    dispatch?.replacementRequest?._id ||
    dispatch?.replacementRequest ||
    dispatch?.items?.find(
      (item) =>
        item?.replacementRequest?._id ||
        item?.replacementRequest
    )?.replacementRequest?._id ||
    dispatch?.items?.find(
      (item) =>
        item?.replacementRequest?._id ||
        item?.replacementRequest
    )?.replacementRequest ||
    null;


  const [receiptDate, setReceiptDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );


  const [department, setDepartment] =
    useState("Stores");


  const [receiptType, setReceiptType] =
    useState(
      isReplacementDispatch
        ? "Replacement"
        : "Normal"
    );


  const [remarks, setRemarks] =
    useState("");


  const [items, setItems] =
    useState(
      (dispatch?.items || []).map(
        (item) => ({
          ...item,

          receivedQuantity:
            Number(
              item.dispatchQuantity || 0
            ),

          shortQuantity: 0,

          damageQuantity: 0,

          itemRemarks: "",
        })
      )
    );


  const [saving, setSaving] =
    useState(false);


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


  // =====================================================
  // KEEP RECEIPT TYPE IN SYNC WITH DISPATCH
  // =====================================================

  useEffect(() => {

    if (isReplacementDispatch) {

      setReceiptType(
        "Replacement"
      );

    } else {

      setReceiptType(
        "Normal"
      );

    }

  }, [
    isReplacementDispatch,
  ]);


  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN"
    );

  };


  // =====================================================
  // UPDATE ITEM
  // =====================================================

  const updateItem = (
    index,
    field,
    value
  ) => {

    setItems(
      (currentItems) =>
        currentItems.map(
          (item, itemIndex) => {

            if (
              itemIndex !== index
            ) {
              return item;
            }

            return {
              ...item,
              [field]: value,
            };

          }
        )
    );

  };


  // =====================================================
  // TOTALS
  // =====================================================

  const totals = useMemo(() => {

    let dispatched = 0;
    let received = 0;
    let short = 0;
    let damaged = 0;

    items.forEach(
      (item) => {

        dispatched += Number(
          item.dispatchQuantity || 0
        );

        received += Number(
          item.receivedQuantity || 0
        );

        short += Number(
          item.shortQuantity || 0
        );

        damaged += Number(
          item.damageQuantity || 0
        );

      }
    );

    return {
      dispatched,
      received,
      short,
      damaged,
    };

  }, [items]);


  // =====================================================
  // VALIDATE
  // =====================================================

  const validate = () => {

    if (
      isReplacementDispatch &&
      !replacementRequestId
    ) {

      return (
        "Replacement Request is missing from the selected replacement dispatch."
      );

    }


    for (
      const item of items
    ) {

      const dispatched =
        Number(
          item.dispatchQuantity || 0
        );

      const received =
        Number(
          item.receivedQuantity || 0
        );

      const short =
        Number(
          item.shortQuantity || 0
        );

      const damaged =
        Number(
          item.damageQuantity || 0
        );


      if (
        received < 0 ||
        short < 0 ||
        damaged < 0
      ) {

        return "Quantities cannot be negative.";

      }


      if (
        received +
          short +
          damaged >
        dispatched
      ) {

        return (
          `Received + Short + Damage cannot ` +
          `exceed dispatched quantity for ` +
          `${item.materialName || "material"}.`
        );

      }

    }

    return "";

  };


  // =====================================================
  // CREATE GRN
  // =====================================================

  const handleSubmit = async () => {

    try {

      setError("");
      setSuccess("");


      const validationError =
        validate();


      if (validationError) {

        setError(
          validationError
        );

        return;

      }


      setSaving(true);


      /*
       * ===================================================
       * IMPORTANT
       *
       * Receipt type is derived from the selected dispatch.
       *
       * Replacement dispatch
       *      -> Replacement GRN
       *
       * Normal dispatch
       *      -> Normal GRN
       * ===================================================
       */

      const finalReceiptType =
        isReplacementDispatch
          ? "Replacement"
          : "Normal";


      const payload = {

        purchaseOrder:
          dispatch.purchaseOrder?._id ||
          dispatch.purchaseOrder,

        dispatch:
          dispatch._id,

        vendor:
          dispatch.vendor?._id ||
          dispatch.vendor,

        receiptDate,

        department,

        status: "Received",

        receiptType:
          finalReceiptType,


        /*
         * =================================================
         * Replacement Request
         *
         * Normal GRN:
         *     null
         *
         * Replacement GRN:
         *     actual Replacement Request ID
         * =================================================
         */

        replacementRequest:
          finalReceiptType === "Replacement"
            ? replacementRequestId
            : null,


        items: items.map(
          (item) => ({

            material:
              item.material,

            materialCode:
              item.materialCode,

            materialName:
              item.materialName,

            unitOfMeasure:
              item.unitOfMeasure,

            orderedQuantity:
              Number(
                item.orderedQuantity || 0
              ),

            dispatchedQuantity:
              Number(
                item.dispatchQuantity || 0
              ),

            previouslyReceivedQuantity:
              Number(
                item.previouslyReceivedQuantity ||
                  0
              ),

            receivedQuantity:
              Number(
                item.receivedQuantity || 0
              ),

            totalReceivedQuantity:
              Number(
                item.previouslyReceivedQuantity ||
                  0
              ) +
              Number(
                item.receivedQuantity || 0
              ),

            shortQuantity:
              Number(
                item.shortQuantity || 0
              ),

            damageQuantity:
              Number(
                item.damageQuantity || 0
              ),

            remarks:
              item.itemRemarks || "",

          })
        ),

        documents: [],

        remarks,

      };


      console.log(
        "========================================"
      );

      console.log(
        "CREATING GOODS RECEIPT"
      );

      console.log(
        "DISPATCH NUMBER:",
        dispatch.dispatchNumber
      );

      console.log(
        "DISPATCH TYPE:",
        dispatch.dispatchType
      );

      console.log(
        "IS REPLACEMENT:",
        isReplacementDispatch
      );

      console.log(
        "RECEIPT TYPE:",
        finalReceiptType
      );

      console.log(
        "REPLACEMENT REQUEST:",
        replacementRequestId
      );

      console.log(
        "GRN PAYLOAD:",
        payload
      );

      console.log(
        "========================================"
      );


      const response =
        await createGoodsReceipt(
          payload
        );


      setSuccess(
        response.message ||
        "Goods Receipt created successfully."
      );


      setTimeout(() => {

        onSuccess?.(
          response.data
        );

      }, 800);


    } catch (error) {

      console.error(
        "Create GRN Error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to create Goods Receipt."
      );

    } finally {

      setSaving(false);

    }

  };


  return (

    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

      <div className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-slate-800">

              Create Goods Receipt

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              Record the actual quantity received
              against this dispatch.

            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
          >

            <X size={20} />

          </button>

        </div>


        {/* =================================================
            BODY
        ================================================= */}

        <div className="flex-1 overflow-y-auto p-6">

          <div className="space-y-6">


            {/* =================================================
                SOURCE INFORMATION
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <h3 className="mb-4 text-lg font-semibold text-slate-800">

                Dispatch Information

              </h3>


              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">


                <div>

                  <p className="text-xs text-slate-500">
                    Dispatch Number
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">

                    {dispatch.dispatchNumber || "-"}

                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-500">
                    Purchase Order
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">

                    {
                      dispatch.purchaseOrder
                        ?.poNumber || "-"
                    }

                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-500">
                    Vendor
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">

                    {
                      dispatch.vendor
                        ?.vendorName || "-"
                    }

                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-500">
                    Dispatch Date
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">

                    {
                      formatDate(
                        dispatch.dispatchDate
                      )
                    }

                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                RECEIPT INFORMATION
            ================================================= */}

            <div>

              <h3 className="mb-4 text-lg font-semibold text-slate-800">

                Receipt Information

              </h3>


              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">


                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">

                    Receipt Date

                  </label>

                  <input
                    type="date"
                    value={receiptDate}
                    onChange={(event) =>
                      setReceiptDate(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">

                    Department

                  </label>

                  <input
                    type="text"
                    value={department}
                    onChange={(event) =>
                      setDepartment(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">

                    Receipt Type

                  </label>

                  <select
                    value={receiptType}
                    disabled={isReplacementDispatch}
                    onChange={(event) =>
                      setReceiptType(
                        event.target.value
                      )
                    }
                    className={`w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                      isReplacementDispatch
                        ? "cursor-not-allowed bg-slate-100 text-slate-600"
                        : ""
                    }`}
                  >

                    <option value="Normal">
                      Normal
                    </option>

                    <option value="Replacement">
                      Replacement
                    </option>

                  </select>

                  {isReplacementDispatch && (

                    <p className="mt-2 text-xs font-medium text-orange-600">

                      This is a replacement dispatch, so the
                      receipt type is automatically set to
                      Replacement.

                    </p>

                  )}

                </div>

              </div>


              {/* =================================================
                  REPLACEMENT REQUEST INFORMATION
              ================================================= */}

              {isReplacementDispatch && (

                <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4">

                  <div className="flex items-start gap-3">

                    <FileText
                      size={20}
                      className="mt-0.5 text-orange-600"
                    />

                    <div>

                      <p className="text-sm font-semibold text-orange-800">

                        Replacement Request

                      </p>

                      <p className="mt-1 text-sm text-orange-700">

                        {replacementRequestId
                          ? replacementRequestId
                          : "Replacement Request ID is missing."}

                      </p>

                    </div>

                  </div>

                </div>

              )}

            </div>


            {/* =================================================
                ITEMS
            ================================================= */}

            <div>

              <div className="mb-4 flex items-center justify-between">

                <h3 className="text-lg font-semibold text-slate-800">

                  Received Materials

                </h3>

                <span className="text-sm text-slate-500">

                  Enter actual quantities

                </span>

              </div>


              <div className="overflow-x-auto rounded-2xl border border-slate-200">

                <table className="min-w-full">

                  <thead className="bg-slate-100">

                    <tr>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Material
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                        Dispatched
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                        Received
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                        Short
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                        Damaged
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Remarks
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {items.map(
                      (item, index) => (

                        <tr
                          key={
                            item._id ||
                            index
                          }
                          className="border-t border-slate-200"
                        >


                          {/* MATERIAL */}

                          <td className="px-4 py-4">

                            <p className="font-semibold text-slate-800">

                              {
                                item.materialName ||
                                "-"
                              }

                            </p>

                            <p className="text-xs text-slate-500">

                              {
                                item.materialCode ||
                                "-"
                              }

                            </p>

                          </td>


                          {/* DISPATCHED */}

                          <td className="px-4 py-4 text-right">

                            <span className="font-semibold text-slate-700">

                              {
                                item.dispatchQuantity ??
                                0
                              }

                            </span>

                            <span className="ml-1 text-xs text-slate-500">

                              {
                                item.unitOfMeasure ||
                                ""
                              }

                            </span>

                          </td>


                          {/* RECEIVED */}

                          <td className="px-4 py-4">

                            <input
                              type="number"
                              min="0"
                              value={
                                item.receivedQuantity
                              }
                              onChange={(event) =>
                                updateItem(
                                  index,
                                  "receivedQuantity",
                                  event.target.value
                                )
                              }
                              className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-right outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                          </td>


                          {/* SHORT */}

                          <td className="px-4 py-4">

                            <input
                              type="number"
                              min="0"
                              value={
                                item.shortQuantity
                              }
                              onChange={(event) =>
                                updateItem(
                                  index,
                                  "shortQuantity",
                                  event.target.value
                                )
                              }
                              className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-right outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                          </td>


                          {/* DAMAGE */}

                          <td className="px-4 py-4">

                            <input
                              type="number"
                              min="0"
                              value={
                                item.damageQuantity
                              }
                              onChange={(event) =>
                                updateItem(
                                  index,
                                  "damageQuantity",
                                  event.target.value
                                )
                              }
                              className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-right outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                          </td>


                          {/* REMARKS */}

                          <td className="px-4 py-4">

                            <input
                              type="text"
                              value={
                                item.itemRemarks
                              }
                              onChange={(event) =>
                                updateItem(
                                  index,
                                  "itemRemarks",
                                  event.target.value
                                )
                              }
                              placeholder="Item remarks"
                              className="min-w-[180px] rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

              <div className="rounded-xl bg-blue-50 p-4">

                <p className="text-xs text-slate-500">
                  Dispatched
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-800">
                  {totals.dispatched}
                </p>

              </div>


              <div className="rounded-xl bg-green-50 p-4">

                <p className="text-xs text-slate-500">
                  Received
                </p>

                <p className="mt-1 text-2xl font-bold text-green-700">
                  {totals.received}
                </p>

              </div>


              <div className="rounded-xl bg-yellow-50 p-4">

                <p className="text-xs text-slate-500">
                  Short
                </p>

                <p className="mt-1 text-2xl font-bold text-yellow-700">
                  {totals.short}
                </p>

              </div>


              <div className="rounded-xl bg-red-50 p-4">

                <p className="text-xs text-slate-500">
                  Damaged
                </p>

                <p className="mt-1 text-2xl font-bold text-red-700">
                  {totals.damaged}
                </p>

              </div>

            </div>


            {/* =================================================
                GENERAL REMARKS
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">

                Receipt Remarks

              </label>

              <textarea
                rows={3}
                value={remarks}
                onChange={(event) =>
                  setRemarks(
                    event.target.value
                  )
                }
                placeholder="Enter receiving remarks..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* =================================================
                DOCUMENTS - UI PREPARATION
            ================================================= */}

            <div className="rounded-xl border border-dashed border-slate-300 p-5">

              <div className="flex items-center gap-3">

                <FileText
                  size={20}
                  className="text-slate-500"
                />

                <div>

                  <p className="font-medium text-slate-700">

                    Receipt Documents

                  </p>

                  <p className="text-xs text-slate-500">

                    Document upload will be connected
                    in the next document-management step.

                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                {error}

              </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">

                <CheckCircle2 size={20} />

                {success}

              </div>

            )}

          </div>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >

            Cancel

          </button>


          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              saving ||
              items.length === 0
            }
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {saving ? (

              <>
                Saving...
              </>

            ) : (

              <>
                <Save size={18} />
                Create GRN
              </>

            )}

          </button>

        </div>

      </div>

    </div>

  );
};

export default CreateGoodsReceiptForm;