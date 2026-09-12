import { useEffect, useState } from "react";
import { getAllPurchaseRequisitions } from "../../../services/purchaseRequisitionService";

const BasicInformationStep = ({
  formData,
  setFormData,
  errors = {},
  setErrors,
}) => {

  const [purchaseRequisitions, setPurchaseRequisitions] = useState([]);
  const [selectedPR, setSelectedPR] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * ==========================================
   * Load Approved Purchase Requisitions
   * ==========================================
   */
  const loadPurchaseRequisitions = async () => {

    try {

      setLoading(true);

      const response =
        await getAllPurchaseRequisitions({
          page: 1,
          limit: 100,
          search: "",
          status: "Approved",
        });

      setPurchaseRequisitions(
        response.requisitions || []
      );

    } catch (error) {

      console.error(
        "Failed to load Purchase Requisitions",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadPurchaseRequisitions();

  }, []);

  /**
   * ==========================================
   * Set Default Order Date
   * ==========================================
   */

  useEffect(() => {

    if (!formData.orderDate) {

      setFormData((prev) => ({

        ...prev,

        orderDate:
          new Date()
            .toISOString()
            .split("T")[0],

      }));

    }

  }, []);

  /**
   * ==========================================
   * Purchase Requisition Changed
   * ==========================================
   */

  const handlePurchaseRequisitionChange = (
    e
  ) => {

    const prId = e.target.value;

    const requisition =
      purchaseRequisitions.find(
        (item) => item._id === prId
      );

    setSelectedPR(requisition);

    setFormData((prev) => ({

      ...prev,

      purchaseRequisition: prId,

      priority:
        requisition?.priority || "Medium",

      items:
        requisition?.items?.map((item) => ({

          material:
            item.material?._id ||

            item.material,

          materialCode:
            item.material?.materialCode || "",

          materialName:
            item.material?.materialName || "",

          quantity:
            item.quantity || 0,

          unitOfMeasure:
            item.unitOfMeasure || "",

          unitPrice: 0,

          taxPercentage: 0,

          discountPercentage: 0,

          remarks:
            item.remarks || "",

        })) || [],

    }));

    if (setErrors) {

      setErrors((prev) => ({

        ...prev,

        purchaseRequisition: "",

      }));

    }

  };
    return (

    <div className="space-y-8">

      {/* ==========================================
          Header
      ========================================== */}

      <div>

        <h2 className="text-2xl font-bold text-slate-800">

          Basic Information

        </h2>

        <p className="mt-1 text-sm text-slate-500">

          Select an approved Purchase Requisition and
          provide the Purchase Order details.

        </p>

      </div>

      {/* ==========================================
          Basic Information Form
      ========================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Purchase Requisition */}

        <div>

          <label className="mb-2 block text-sm font-semibold">

            Purchase Requisition
            <span className="text-red-500"> *</span>

          </label>

          <select

            value={formData.purchaseRequisition}

            onChange={handlePurchaseRequisitionChange}

            disabled={loading}

            className={`w-full rounded-xl border px-4 py-3 transition outline-none

            ${
              errors.purchaseRequisition

                ? "border-red-500"

                : "border-slate-300 focus:border-blue-500"

            }`}

          >

            <option value="">

              {loading

                ? "Loading Approved Purchase Requisitions..."

                : "Select Purchase Requisition"}

            </option>

            {purchaseRequisitions.map((pr) => (

              <option

                key={pr._id}

                value={pr._id}

              >

                {pr.prNumber}

                {" | "}

                {pr.department}

                {" | "}

                ₹{" "}

                {Number(
                  pr.totalEstimatedAmount || 0
                ).toLocaleString()}

              </option>

            ))}

          </select>

          {errors.purchaseRequisition && (

            <p className="mt-1 text-sm text-red-600">

              {errors.purchaseRequisition}

            </p>

          )}

        </div>

        {/* Purchase Order Number */}

        <div>

          <label className="mb-2 block text-sm font-semibold">

            Purchase Order Number

          </label>

          <input

            type="text"

            value="Generated after Save"

            disabled

            className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-500"

          />

        </div>

        {/* Order Date */}

        <div>

          <label className="mb-2 block text-sm font-semibold">

            Order Date

          </label>

          <input

            type="date"

            value={formData.orderDate}

            onChange={(e) =>

              setFormData((prev) => ({

                ...prev,

                orderDate: e.target.value,

              }))

            }

            className="w-full rounded-xl border border-slate-300 px-4 py-3"

          />

        </div>

        {/* Expected Delivery Date */}

        <div>

          <label className="mb-2 block text-sm font-semibold">

            Expected Delivery Date
            <span className="text-red-500"> *</span>

          </label>

          <input

            type="date"

            min={new Date().toISOString().split("T")[0]}

            value={formData.expectedDeliveryDate}

            onChange={(e) =>

              setFormData((prev) => ({

                ...prev,

                expectedDeliveryDate: e.target.value,

              }))

            }

            className={`w-full rounded-xl border px-4 py-3

            ${
              errors.expectedDeliveryDate

                ? "border-red-500"

                : "border-slate-300"

            }`}

          />

          {errors.expectedDeliveryDate && (

            <p className="mt-1 text-sm text-red-600">

              {errors.expectedDeliveryDate}

            </p>

          )}

        </div>

        {/* Priority */}

        <div>

          <label className="mb-2 block text-sm font-semibold">

            Priority

          </label>

          <select

            value={formData.priority}

            onChange={(e) =>

              setFormData((prev) => ({

                ...prev,

                priority: e.target.value,

              }))

            }

            className="w-full rounded-xl border border-slate-300 px-4 py-3"

          >

            <option value="Low">Low</option>

            <option value="Medium">Medium</option>

            <option value="High">High</option>

            <option value="Critical">Critical</option>

          </select>

        </div>

        {/* Currency */}

        <div>

          <label className="mb-2 block text-sm font-semibold">

            Currency

          </label>

          <select

            value={formData.currency}

            onChange={(e) =>

              setFormData((prev) => ({

                ...prev,

                currency: e.target.value,

              }))

            }

            className="w-full rounded-xl border border-slate-300 px-4 py-3"

          >

            <option value="INR">INR</option>

            <option value="USD">USD</option>

            <option value="EUR">EUR</option>

          </select>

        </div>

        {/* Payment Terms */}

        <div>

          <label className="mb-2 block text-sm font-semibold">

            Payment Terms

          </label>

          <select

            value={formData.paymentTerms}

            onChange={(e) =>

              setFormData((prev) => ({

                ...prev,

                paymentTerms: e.target.value,

              }))

            }

            className="w-full rounded-xl border border-slate-300 px-4 py-3"

          >

            <option value="">

              Select Payment Terms

            </option>

            <option value="Advance">

              Advance

            </option>

            <option value="Immediate">

              Immediate

            </option>

            <option value="Net 15">

              Net 15

            </option>

            <option value="Net 30">

              Net 30

            </option>

            <option value="Net 45">

              Net 45

            </option>

            <option value="Net 60">

              Net 60

            </option>

          </select>

        </div>

        {/* Delivery Location */}

        <div>

          <label className="mb-2 block text-sm font-semibold">

            Delivery Location
            <span className="text-red-500"> *</span>

          </label>

          <input

            type="text"

            placeholder="Warehouse / Factory / Office"

            value={formData.deliveryLocation}

            onChange={(e) =>

              setFormData((prev) => ({

                ...prev,

                deliveryLocation: e.target.value,

              }))

            }

            className={`w-full rounded-xl border px-4 py-3

            ${
              errors.deliveryLocation

                ? "border-red-500"

                : "border-slate-300"

            }`}

          />

          {errors.deliveryLocation && (

            <p className="mt-1 text-sm text-red-600">

              {errors.deliveryLocation}

            </p>

          )}

        </div>

      </div>

      {/* Buyer Remarks */}

      <div>

        <label className="mb-2 block text-sm font-semibold">

          Buyer Remarks

        </label>

        <textarea

          rows={5}

          placeholder="Enter any instructions for the vendor..."

          value={formData.buyerRemarks}

          onChange={(e) =>

            setFormData((prev) => ({

              ...prev,

              buyerRemarks: e.target.value,

            }))

          }

          className="w-full rounded-xl border border-slate-300 px-4 py-3"

        />

      </div>
            {/* ==========================================
          Purchase Requisition Summary
      ========================================== */}

      {selectedPR ? (

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h3 className="text-xl font-bold text-slate-800">

                Purchase Requisition Summary

              </h3>

              <p className="mt-1 text-sm text-slate-500">

                Details automatically retrieved from the selected
                Purchase Requisition.

              </p>

            </div>

            <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">

              {selectedPR.prNumber}

            </span>

          </div>

          {/* Summary Cards */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border bg-white p-4 shadow-sm">

              <p className="text-sm text-slate-500">

                Department

              </p>

              <h4 className="mt-2 font-semibold text-slate-800">

                {selectedPR.department || "-"}

              </h4>

            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">

              <p className="text-sm text-slate-500">

                Requested By

              </p>

              <h4 className="mt-2 font-semibold text-slate-800">

                {selectedPR.requestedBy?.name || "-"}

              </h4>

            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">

              <p className="text-sm text-slate-500">

                Required Date

              </p>

              <h4 className="mt-2 font-semibold text-slate-800">

                {selectedPR.requiredDate
                  ? new Date(
                      selectedPR.requiredDate
                    ).toLocaleDateString()
                  : "-"}

              </h4>

            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">

              <p className="text-sm text-slate-500">

                Priority

              </p>

              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold

                ${
                  selectedPR.priority === "Critical"

                    ? "bg-red-100 text-red-700"

                    : selectedPR.priority === "High"

                    ? "bg-orange-100 text-orange-700"

                    : selectedPR.priority === "Medium"

                    ? "bg-blue-100 text-blue-700"

                    : "bg-gray-100 text-gray-700"

                }`}
              >

                {selectedPR.priority}

              </span>

            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">

              <p className="text-sm text-slate-500">

                Estimated Amount

              </p>

              <h4 className="mt-2 text-lg font-bold text-green-600">

                ₹{" "}

                {Number(
                  selectedPR.totalEstimatedAmount || 0
                ).toLocaleString()}

              </h4>

            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">

              <p className="text-sm text-slate-500">

                Total Materials

              </p>

              <h4 className="mt-2 text-lg font-bold text-slate-800">

                {selectedPR.items?.length || 0}

              </h4>

            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">

              <p className="text-sm text-slate-500">

                Status

              </p>

              <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">

                {selectedPR.status}

              </span>

            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">

              <p className="text-sm text-slate-500">

                Created Date

              </p>

              <h4 className="mt-2 font-semibold text-slate-800">

                {selectedPR.createdAt
                  ? new Date(
                      selectedPR.createdAt
                    ).toLocaleDateString()
                  : "-"}

              </h4>

            </div>

          </div>

          {/* Material Preview */}

          <div className="mt-8">

            <div className="mb-4 flex items-center justify-between">

              <h3 className="text-lg font-bold text-slate-800">

                Material Preview (Read Only)

              </h3>

              <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium">

                {selectedPR.items?.length || 0} Items

              </span>

            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">

              <table className="min-w-full">

                <thead className="bg-slate-100">

                  <tr>

                    <th className="px-4 py-3 text-left">

                      Material Code

                    </th>

                    <th className="px-4 py-3 text-left">

                      Material Name

                    </th>

                    <th className="px-4 py-3 text-center">

                      Quantity

                    </th>

                    <th className="px-4 py-3 text-center">

                      Unit

                    </th>

                    <th className="px-4 py-3 text-right">

                      Estimated Cost

                    </th>

                  </tr>

                </thead>

                <tbody>

                  {selectedPR.items?.map((item, index) => (

                    <tr
                      key={index}
                      className="border-t hover:bg-slate-50"
                    >

                      <td className="px-4 py-3">

                        {item.material?.materialCode || "-"}

                      </td>

                      <td className="px-4 py-3">

                        {item.material?.materialName || "-"}

                      </td>

                      <td className="px-4 py-3 text-center">

                        {item.quantity}

                      </td>

                      <td className="px-4 py-3 text-center">

                        {item.unitOfMeasure}

                      </td>

                      <td className="px-4 py-3 text-right font-semibold">

                        ₹{" "}

                        {Number(
                          item.estimatedCost || 0
                        ).toLocaleString()}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      ) : (

        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">

          <h3 className="text-xl font-semibold text-slate-700">

            Purchase Requisition Summary

          </h3>

          <p className="mt-3 text-slate-500">

            Select an approved Purchase Requisition
            to view its details.

          </p>

        </div>

      )}
          </div>

  );

};

export default BasicInformationStep;