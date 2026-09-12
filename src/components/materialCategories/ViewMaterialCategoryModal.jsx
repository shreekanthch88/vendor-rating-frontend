const ViewMaterialCategoryModal = ({
  isOpen,
  onClose,
  category,
}) => {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold">
            Material Category Details
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-500"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

          <div>
            <label className="text-sm text-gray-500">
              Category Code
            </label>

            <p className="mt-1 font-medium">
              {category.categoryCode}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Category Name
            </label>

            <p className="mt-1 font-medium">
              {category.categoryName}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Parent Category
            </label>

            <p className="mt-1 font-medium">
              {category.parentCategory?.categoryName || "-"}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Status
            </label>

            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-sm ${
                category.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {category.status}
            </span>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">
              Description
            </label>

            <p className="mt-1 whitespace-pre-line">
              {category.description || "-"}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Created At
            </label>

            <p className="mt-1">
              {new Date(category.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Updated At
            </label>

            <p className="mt-1">
              {new Date(category.updatedAt).toLocaleString()}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t p-6">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-700 px-5 py-2 text-white hover:bg-gray-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewMaterialCategoryModal;