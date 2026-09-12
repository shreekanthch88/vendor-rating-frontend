import { CalendarDays, Building2, FileText } from "lucide-react";

const departments = [
  "Production",
  "Purchase",
  "Maintenance",
  "Quality",
  "Stores",
  "Administration",
  "Finance",
];

const priorities = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const BasicInformationStep = ({
  formData,
  setFormData,
  errors = {},
}) => {
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">

      {/* Basic Information */}
      <div className="rounded-xl border bg-white shadow-sm">

        <div className="border-b px-6 py-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Building2 size={20} />
            Purchase Requisition Information
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

          {/* PR Number */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              PR Number
            </label>

            <input
              type="text"
              value={formData.prNumber}
              readOnly
              className="w-full rounded-lg border bg-gray-100 px-4 py-3"
            />
          </div>

          {/* Department */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Department <span className="text-red-500">*</span>
            </label>

            <select
              value={formData.department}
              onChange={(e) =>
                handleChange("department", e.target.value)
              }
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none"
            >
              <option value="">
                Select Department
              </option>

              {departments.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>

            {errors.department && (
              <p className="mt-1 text-sm text-red-600">
                {errors.department}
              </p>
            )}
          </div>

          {/* Required Date */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <CalendarDays size={16} />
              Required Date
              <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              min={today}
              value={formData.requiredDate}
              onChange={(e) =>
                handleChange("requiredDate", e.target.value)
              }
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none"
            />

            {errors.requiredDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.requiredDate}
              </p>
            )}
          </div>

          {/* Priority */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Priority
            </label>

            <select
              value={formData.priority}
              onChange={(e) =>
                handleChange("priority", e.target.value)
              }
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none"
            >
              {priorities.map((priority) => (
                <option
                  key={priority}
                  value={priority}
                >
                  {priority}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Request Details */}

      <div className="rounded-xl border bg-white shadow-sm">

        <div className="border-b px-6 py-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <FileText size={20} />
            Request Details
          </h2>
        </div>

        <div className="space-y-6 p-6">

          {/* Purpose */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Purpose <span className="text-red-500">*</span>
            </label>

            <textarea
              rows={4}
              value={formData.purpose}
              onChange={(e) =>
                handleChange("purpose", e.target.value)
              }
              placeholder="Enter the purpose of this purchase requisition..."
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none"
            />

            {errors.purpose && (
              <p className="mt-1 text-sm text-red-600">
                {errors.purpose}
              </p>
            )}
          </div>

          {/* Remarks */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Remarks
            </label>

            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) =>
                handleChange("remarks", e.target.value)
              }
              placeholder="Additional remarks (optional)"
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

        </div>

      </div>

      {/* Information */}

      <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-5">

        <h3 className="font-semibold text-blue-700">
          Instructions
        </h3>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-600">

          <li>
            Select the department requesting the purchase.
          </li>

          <li>
            Required Date cannot be earlier than today.
          </li>

          <li>
            Choose the correct priority based on business urgency.
          </li>

          <li>
            Clearly describe the purpose of the requisition.
          </li>

        </ul>

      </div>

    </div>
  );
};

export default BasicInformationStep;