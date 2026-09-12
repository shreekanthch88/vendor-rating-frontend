const ViewMaterialModal = ({
  isOpen,
  onClose,
  material,
}) => {
  if (!isOpen || !material) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold">
            Material Details
          </h2>
        </div>

        {/* Body */}
        <div className="grid grid-cols-2 gap-6 p-6">

          <div>
            <label className="text-sm text-gray-500">
              Material Code
            </label>

            <p className="font-semibold">
              {material.materialCode}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Material Name
            </label>

            <p className="font-semibold">
              {material.materialName}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Category
            </label>

            <p className="font-semibold">
              {material.category?.categoryName || "-"}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Unit of Measure
            </label>

            <p className="font-semibold">
              {material.unitOfMeasure}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Standard Cost
            </label>

            <p className="font-semibold">
              ₹{Number(material.standardCost).toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Preferred Vendor
            </label>

            <p className="font-semibold">
              {material.preferredVendor?.vendorName || "-"}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Status
            </label>

            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                material.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {material.status}
            </span>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Created At
            </label>

            <p className="font-semibold">
              {material.createdAt
                ? new Date(material.createdAt).toLocaleString()
                : "-"}
            </p>
          </div>

        </div>

        {/* Description */}
        <div className="px-6 pb-6">
          <label className="text-sm text-gray-500">
            Description
          </label>

          <div className="mt-2 rounded-lg border bg-gray-50 p-4">
            {material.description || "-"}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t p-6">

          <button
            onClick={onClose}
            className="rounded-lg bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};

export default ViewMaterialModal;