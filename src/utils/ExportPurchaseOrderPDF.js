import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportPurchaseOrderPDF = (purchaseOrder) => {

  const doc = new jsPDF("p", "mm", "a4");

  /* ==========================================
      Company Header
  ========================================== */

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Vendor Rating Mechanism",
    14,
    18
  );

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    "Purchase Order Report",
    14,
    25
  );

  doc.line(14, 30, 196, 30);

  /* ==========================================
      Purchase Order Information
  ========================================== */

  let y = 38;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Purchase Order Information",
    14,
    y
  );

  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    `PO Number : ${purchaseOrder.poNumber || "-"}`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Purchase Requisition : ${
      purchaseOrder.purchaseRequisition?.prNumber ||
      purchaseOrder.purchaseRequisition ||
      "-"
    }`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Order Date : ${
      purchaseOrder.orderDate
        ? new Date(
            purchaseOrder.orderDate
          ).toLocaleDateString()
        : "-"
    }`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Expected Delivery : ${
      purchaseOrder.expectedDeliveryDate
        ? new Date(
            purchaseOrder.expectedDeliveryDate
          ).toLocaleDateString()
        : "-"
    }`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Priority : ${purchaseOrder.priority || "-"}`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Status : ${purchaseOrder.status || "-"}`,
    14,
    y
  );

  y += 10;

    /* ==========================================
      Vendor Information
  ========================================== */

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Vendor Information",
    14,
    y
  );

  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Vendor Code : ${
      purchaseOrder.vendor?.vendorCode || "-"
    }`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Vendor Name : ${
      purchaseOrder.vendor?.vendorName || "-"
    }`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Vendor Category : ${
      purchaseOrder.vendor?.vendorCategory || "-"
    }`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Business Type : ${
      purchaseOrder.vendor?.businessType || "-"
    }`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Contact Person : ${
      purchaseOrder.vendor?.contactPerson || "-"
    }`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Mobile : ${
      purchaseOrder.vendor?.mobile || "-"
    }`,
    14,
    y
  );

  y += 10;

  /* ==========================================
      Material Items Table
  ========================================== */

  autoTable(doc, {

    startY: y,

    head: [[
      "Code",
      "Material",
      "Qty",
      "Unit",
      "Unit Price",
      "GST %",
      "Total",
    ]],

    body: (purchaseOrder.items || []).map(
      (item) => {

        const quantity =
          Number(item.quantity || 0);

        const unitPrice =
          Number(item.unitPrice || 0);

        const discount =
          Number(item.discountPercentage || 0);

        const gst =
          Number(item.taxPercentage || 0);

        const gross =
          quantity * unitPrice;

        const discountAmount =
          gross * discount / 100;

        const taxable =
          gross - discountAmount;

        const gstAmount =
          taxable * gst / 100;

        const total =
          taxable + gstAmount;

        return [

          item.materialCode || "-",

          item.materialName || "-",

          quantity,

          item.unitOfMeasure || "-",

          `₹ ${unitPrice.toFixed(2)}`,

          `${gst}%`,

          `₹ ${total.toFixed(2)}`,

        ];

      }
    ),

    headStyles: {

      fillColor: [37, 99, 235],

      textColor: 255,

      fontStyle: "bold",

    },

    styles: {

      fontSize: 9,

      cellPadding: 3,

      valign: "middle",

    },

    theme: "grid",

  });

  y = doc.lastAutoTable.finalY + 12;

    /* ==========================================
      Financial Summary
  ========================================== */

  const subtotal = (purchaseOrder.items || []).reduce(
    (sum, item) =>
      sum +
      (Number(item.quantity || 0) *
        Number(item.unitPrice || 0)),
    0
  );

  const totalDiscount = (purchaseOrder.items || []).reduce(
    (sum, item) => {
      const gross =
        Number(item.quantity || 0) *
        Number(item.unitPrice || 0);

      return (
        sum +
        (gross *
          Number(item.discountPercentage || 0)) /
          100
      );
    },
    0
  );

  const taxableAmount =
    subtotal - totalDiscount;

  const totalGST = (purchaseOrder.items || []).reduce(
    (sum, item) => {

      const gross =
        Number(item.quantity || 0) *
        Number(item.unitPrice || 0);

      const discount =
        (gross *
          Number(item.discountPercentage || 0)) /
        100;

      const taxable =
        gross - discount;

      return (
        sum +
        (taxable *
          Number(item.taxPercentage || 0)) /
          100
      );

    },
    0
  );

  const freight =
    Number(purchaseOrder.freightCharges || 0);

  const grandTotal =
    taxableAmount + totalGST + freight;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Financial Summary",
    14,
    y
  );

  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Subtotal : ₹ ${subtotal.toFixed(2)}`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Discount : ₹ ${totalDiscount.toFixed(2)}`,
    14,
    y
  );

  y += 6;

  doc.text(
    `GST : ₹ ${totalGST.toFixed(2)}`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Freight Charges : ₹ ${freight.toFixed(2)}`,
    14,
    y
  );

  y += 6;

  doc.setFont("helvetica", "bold");

  doc.text(
    `Grand Total : ₹ ${grandTotal.toFixed(2)}`,
    14,
    y
  );

  y += 12;

  /* ==========================================
      Delivery Information
  ========================================== */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  doc.text(
    "Delivery Information",
    14,
    y
  );

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(
    `Delivery Address : ${
      purchaseOrder.deliveryAddress || "-"
    }`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Delivery Location : ${
      purchaseOrder.deliveryLocation || "-"
    }`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Shipping Method : ${
      purchaseOrder.shippingMethod || "-"
    }`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Contact Person : ${
      purchaseOrder.contactPerson || "-"
    }`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Contact Number : ${
      purchaseOrder.contactNumber || "-"
    }`,
    14,
    y
  );

  y += 10;

  /* ==========================================
      Buyer Remarks
  ========================================== */

  doc.setFont("helvetica", "bold");

  doc.text(
    "Buyer Remarks",
    14,
    y
  );

  y += 8;

  doc.setFont("helvetica", "normal");

  doc.text(
    purchaseOrder.buyerRemarks ||
      "No buyer remarks available.",
    14,
    y,
    {
      maxWidth: 180,
    }
  );

  y += 20;
    /* ==========================================
      Signature Section
  ========================================== */

  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setDrawColor(180);

  doc.line(20, y + 18, 70, y + 18);
  doc.line(80, y + 18, 130, y + 18);
  doc.line(140, y + 18, 190, y + 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text(
    "Prepared By",
    28,
    y + 25
  );

  doc.text(
    "Verified By",
    88,
    y + 25
  );

  doc.text(
    "Authorized By",
    146,
    y + 25
  );

  /* ==========================================
      Footer
  ========================================== */

  const pageCount = doc.getNumberOfPages();

  for (let page = 1; page <= pageCount; page++) {

    doc.setPage(page);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Generated on : ${new Date().toLocaleString()}`,
      14,
      288
    );

    doc.text(
      `Page ${page} of ${pageCount}`,
      180,
      288,
      {
        align: "right",
      }
    );

  }

  /* ==========================================
      Save PDF
  ========================================== */

  const fileName = `Purchase_Order_${
    purchaseOrder.poNumber || "PO"
  }.pdf`;

  doc.save(fileName);

};

export default exportPurchaseOrderPDF;