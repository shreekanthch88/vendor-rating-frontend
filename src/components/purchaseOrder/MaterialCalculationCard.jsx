import { useMemo } from "react";
import {
  Calculator,
  Package,
  IndianRupee,
} from "lucide-react";

const MaterialCalculationCard = ({
  items = [],
  discount = 0,
  taxPercentage = 18,
  freightCharges = 0,
}) => {

  const calculations = useMemo(() => {

    const totalQuantity = items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

    const subTotal = items.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0) *
          Number(item.unitPrice || 0),
      0
    );

    const discountAmount =
      (subTotal * Number(discount || 0)) / 100;

    const taxableAmount =
      subTotal - discountAmount;

    const taxAmount =
      (taxableAmount *
        Number(taxPercentage || 0)) /
      100;

    const grandTotal =
      taxableAmount +
      taxAmount +
      Number(freightCharges || 0);

    return {
      totalQuantity,
      subTotal,
      discountAmount,
      taxAmount,
      grandTotal,
    };

  }, [
    items,
    discount,
    taxPercentage,
    freightCharges,
  ]);

  const formatCurrency = (value) =>
    `₹ ${Number(value).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
      }
    )}`;

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <div className="rounded-xl bg-blue-100 p-3">

          <Calculator
            size={24}
            className="text-blue-600"
          />

        </div>

        <div>

          <h2 className="text-lg font-bold text-slate-800">

            Material Calculation

          </h2>

          <p className="text-sm text-slate-500">

            Purchase Order Cost Summary

          </p>

        </div>

      </div>

      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Package
              size={18}
              className="text-slate-500"
            />

            <span>Total Quantity</span>

          </div>

          <span className="font-semibold">

            {calculations.totalQuantity}

          </span>

        </div>

        <div className="flex justify-between">

          <span>Sub Total</span>

          <span className="font-semibold">

            {formatCurrency(
              calculations.subTotal
            )}

          </span>

        </div>

        <div className="flex justify-between">

          <span>

            Discount ({discount}%)

          </span>

          <span className="font-semibold text-red-600">

            - {formatCurrency(
              calculations.discountAmount
            )}

          </span>

        </div>

        <div className="flex justify-between">

          <span>

            GST ({taxPercentage}%)

          </span>

          <span className="font-semibold">

            {formatCurrency(
              calculations.taxAmount
            )}

          </span>

        </div>

        <div className="flex justify-between">

          <span>Freight Charges</span>

          <span className="font-semibold">

            {formatCurrency(
              freightCharges
            )}

          </span>

        </div>

        <hr />

        <div className="flex items-center justify-between text-xl font-bold">

          <div className="flex items-center gap-2">

            <IndianRupee
              size={22}
              className="text-green-600"
            />

            <span>Grand Total</span>

          </div>

          <span className="text-green-700">

            {formatCurrency(
              calculations.grandTotal
            )}

          </span>

        </div>

      </div>

    </div>

  );

};

export default MaterialCalculationCard;