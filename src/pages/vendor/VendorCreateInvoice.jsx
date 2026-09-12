import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getEligiblePurchaseOrders,
  getPOInvoiceableDetails,
  createInvoice,
} from "../../services/invoiceService";
import { formatCurrency, roundToPaise } from "../../utils/formatters";

import {
  Receipt,
  ArrowLeft,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Package,
  Plus,
  Trash2,
  Clock,
  Sparkles,
} from "lucide-react";

const VendorCreateInvoice = () => {
  const navigate = useNavigate();

  const [eligiblePOs, setEligiblePOs] = useState([]);
  const [loadingPOs, setLoadingPOs] = useState(false);
  const [selectedPOId, setSelectedPOId] = useState("");
  const [poDetails, setPoDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [freightCharges, setFreightCharges] = useState(0);
  const [vendorRemarks, setVendorRemarks] = useState("");
  const [items, setItems] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load eligible POs
  const loadEligiblePOs = useCallback(async () => {
    try {
      setLoadingPOs(true);
      const res = await getEligiblePurchaseOrders();
      setEligiblePOs(res.data || []);
    } catch (err) {
      console.error("Error loading eligible POs:", err);
      setError("Failed to load eligible purchase orders.");
    } finally {
      setLoadingPOs(false);
    }
  }, []);

  useEffect(() => {
    loadEligiblePOs();
  }, [loadEligiblePOs]);

  // When PO is selected, fetch details
  const handlePOSelect = async (poId) => {
    setSelectedPOId(poId);
    if (!poId) {
      setPoDetails(null);
      setItems([]);
      return;
    }

    try {
      setLoadingDetails(true);
      setError("");
      const res = await getPOInvoiceableDetails(poId);
      setPoDetails(res.data);

      // Prepopulate items with available quantities
      const initialItems = (res.data?.items || [])
        .filter((item) => item.availableToInvoiceQuantity > 0)
        .map((item) => ({
          material: item.material,
          materialCode: item.materialCode,
          materialName: item.materialName,
          unitOfMeasure: item.unitOfMeasure,
          orderedQuantity: item.orderedQuantity,
          receivedQuantity: item.receivedQuantity,
          acceptedQuantity: item.acceptedQuantity,
          alreadyInvoicedQuantity: item.alreadyInvoicedQuantity,
          availableToInvoiceQuantity: item.availableToInvoiceQuantity,
          invoicedQuantity: item.availableToInvoiceQuantity, // Default to max available
          unitPrice: item.unitPrice,
          taxPercentage: item.taxPercentage || 18,
          discountPercentage: item.discountPercentage || 0,
          remarks: "",
        }));

      setItems(initialItems);
    } catch (err) {
      console.error("Error loading PO details:", err);
      setError(err.response?.data?.message || err.message || "Failed to calculate PO details.");
      setPoDetails(null);
      setItems([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleItemQtyChange = (idx, val) => {
    const updated = [...items];
    const item = updated[idx];
    const num = Number(val);
    item.invoicedQuantity = num;
    setItems(updated);
  };

  // Calculations
  const calculateTotals = () => {
    let subtotal = 0;
    let taxAmount = 0;
    let discountAmount = 0;

    items.forEach((item) => {
      const qty = Number(item.invoicedQuantity || 0);
      const price = roundToPaise(item.unitPrice || 0);
      const disc = Number(item.discountPercentage || 0);
      const tax = Number(item.taxPercentage || 0);

      const gross = roundToPaise(qty * price);
      const dAmt = roundToPaise((gross * disc) / 100);
      const taxable = roundToPaise(gross - dAmt);
      const tAmt = roundToPaise((taxable * tax) / 100);

      subtotal = roundToPaise(subtotal + gross);
      discountAmount = roundToPaise(discountAmount + dAmt);
      taxAmount = roundToPaise(taxAmount + tAmt);
    });

    const freight = roundToPaise(freightCharges || 0);
    const totalAmount = roundToPaise(subtotal - discountAmount + taxAmount + freight);

    return {
      subtotal,
      discountAmount,
      taxAmount,
      freight,
      totalAmount,
    };
  };

  const totals = calculateTotals();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPOId) {
      setError("Please select a Purchase Order.");
      return;
    }

    if (items.length === 0 || items.every((i) => Number(i.invoicedQuantity || 0) <= 0)) {
      setError("Please specify a billable quantity greater than 0 for at least one material.");
      return;
    }

    // Check for over-invoicing
    for (const item of items) {
      if (Number(item.invoicedQuantity) > item.availableToInvoiceQuantity + 0.001) {
        setError(`Invoiced quantity for ${item.materialName} cannot exceed accepted available quantity (${item.availableToInvoiceQuantity}).`);
        return;
      }
    }

    try {
      setSubmitting(true);
      setError("");

      await createInvoice({
        purchaseOrderId: selectedPOId,
        invoiceNumber: invoiceNumber.trim() || undefined,
        invoiceDate,
        dueDate,
        items,
        freightCharges: Number(freightCharges || 0),
        vendorRemarks,
        status: "Submitted",
      });

      navigate("/vendor/invoices");
    } catch (err) {
      console.error("Error submitting invoice:", err);
      setError(err.response?.data?.message || err.message || "Failed to submit invoice.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/vendor/invoices"
            className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="rounded-xl bg-blue-600 p-2 text-white shadow">
                <Receipt size={20} />
              </span>
              Create Vendor Invoice
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an eligible purchase order and invoice verified accepted materials
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center gap-2.5">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Eligible PO */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b pb-4 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              1
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Select Eligible Purchase Order
            </h2>
          </div>

          {loadingPOs ? (
            <div className="py-6 text-center text-xs text-slate-400">
              Loading eligible purchase orders...
            </div>
          ) : eligiblePOs.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-xs text-amber-900">
              <AlertCircle size={24} className="mx-auto mb-2 text-amber-600" />
              <p className="font-semibold">No Eligible Purchase Orders Found</p>
              <p className="mt-1 text-amber-700 max-w-md mx-auto">
                Only Purchase Orders that have had materials delivered, received via GRN, and accepted through Quality Inspection are eligible for invoicing.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Eligible Purchase Orders (with verified accepted materials) *
              </label>
              <select
                value={selectedPOId}
                onChange={(e) => handlePOSelect(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                required
              >
                <option value="">-- Choose a Purchase Order --</option>
                {eligiblePOs.map((po) => (
                  <option key={po._id} value={po._id}>
                    {po.poNumber} — Status: {po.status} | Order Value: ₹{Number(po.grandTotal || 0).toLocaleString()} (Available: {po.totalAvailableToInvoiceQty} units)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Step 2: Invoice Details */}
        {selectedPOId && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b pb-4 mb-5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                2
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Invoice Details & Dates
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  placeholder="Leave empty to auto-generate"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                />
                <span className="text-[11px] text-slate-400">e.g. INV-2026-000123</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Invoice Date *
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Due Date *
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-semibold text-amber-700"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Material Billing Table */}
        {selectedPOId && poDetails && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b pb-4 mb-5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                3
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Materials & Invoiced Quantities
                </h2>
                <p className="text-xs text-slate-500">
                  Quantities are automatically checked against verified Quality Inspection accepted quantities
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Material</th>
                    <th className="px-3 py-3 text-center">Ordered</th>
                    <th className="px-3 py-3 text-center">Received (GRN)</th>
                    <th className="px-3 py-3 text-center text-emerald-700">QA Accepted</th>
                    <th className="px-3 py-3 text-center text-amber-700">Available</th>
                    <th className="px-4 py-3 text-center font-bold text-blue-800">Invoiced Qty *</th>
                    <th className="px-3 py-3 text-right">Agreed Rate</th>
                    <th className="px-3 py-3 text-right">GST %</th>
                    <th className="px-4 py-3 text-right font-bold">Line Total</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {items.map((item, idx) => {
                    const gross = (Number(item.invoicedQuantity) || 0) * Number(item.unitPrice || 0);
                    const disc = (gross * Number(item.discountPercentage || 0)) / 100;
                    const tax = ((gross - disc) * Number(item.taxPercentage || 0)) / 100;
                    const lineTotal = gross - disc + tax;

                    const isExceeding = Number(item.invoicedQuantity) > item.availableToInvoiceQuantity;

                    return (
                      <tr key={item.material} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-900">{item.materialName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{item.materialCode} ({item.unitOfMeasure})</div>
                        </td>

                        <td className="px-3 py-3.5 text-center text-slate-600">{item.orderedQuantity}</td>
                        <td className="px-3 py-3.5 text-center text-slate-600">{item.receivedQuantity}</td>
                        <td className="px-3 py-3.5 text-center font-semibold text-emerald-700 bg-emerald-50/30">
                          {item.acceptedQuantity}
                        </td>
                        <td className="px-3 py-3.5 text-center font-bold text-amber-700 bg-amber-50/30">
                          {item.availableToInvoiceQuantity}
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <input
                            type="number"
                            min="0"
                            max={item.availableToInvoiceQuantity}
                            step="any"
                            value={item.invoicedQuantity}
                            onChange={(e) => handleItemQtyChange(idx, e.target.value)}
                            className={`w-24 rounded-lg border p-2 text-center text-xs font-bold focus:outline-none ${
                              isExceeding
                                ? "border-red-500 bg-red-50 text-red-700"
                                : "border-blue-300 bg-blue-50/50 text-blue-900 focus:border-blue-500"
                            }`}
                            required
                          />
                          {isExceeding && (
                            <p className="text-[10px] text-red-600 mt-0.5">Exceeds available</p>
                          )}
                        </td>

                        <td className="px-3 py-3.5 text-right font-medium text-slate-800">
                          {formatCurrency(item.unitPrice)}
                        </td>

                        <td className="px-3 py-3.5 text-right text-slate-600">
                          {item.taxPercentage}%
                        </td>

                        <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                          {formatCurrency(lineTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Freight & Notes */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 border-t pt-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Freight / Shipping Charges (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={freightCharges}
                    onChange={(e) => setFreightCharges(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vendor Remarks / Submission Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Delivery challan DC-9988 attached with shipment."
                    value={vendorRemarks}
                    onChange={(e) => setVendorRemarks(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(totals.subtotal)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>- {formatCurrency(totals.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>GST / Tax Total:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(totals.taxAmount)}</span>
                </div>
                {totals.freight > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Freight Charges:</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(totals.freight)}</span>
                  </div>
                )}
                <div className="mt-3 flex justify-between border-t border-slate-300 pt-3 text-base font-extrabold text-slate-900">
                  <span>Total Invoiced Amount:</span>
                  <span className="text-blue-700">{formatCurrency(totals.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        {selectedPOId && (
          <div className="flex items-center justify-end gap-3 border-t pt-4">
            <Link
              to="/vendor/invoices"
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Receipt size={16} />
              {submitting ? "Submitting Invoice..." : "Submit Invoice to Finance"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default VendorCreateInvoice;

