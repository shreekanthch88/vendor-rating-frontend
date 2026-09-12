import { X, User, Mail, Phone, Briefcase, ShieldCheck, Calendar } from "lucide-react";

const ViewVendorUserModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <User size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border bg-gray-50 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Briefcase size={14} />
                <span>Designation</span>
              </div>
              <p className="font-semibold text-gray-800 text-sm">
                {user.designation || "-"}
              </p>
            </div>

            <div className="rounded-xl border bg-gray-50 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Phone size={14} />
                <span>Phone</span>
              </div>
              <p className="font-semibold text-gray-800 text-sm">
                {user.phone || "-"}
              </p>
            </div>

            <div className="rounded-xl border bg-gray-50 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <ShieldCheck size={14} />
                <span>Status</span>
              </div>
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  user.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.status}
              </span>
            </div>

            <div className="rounded-xl border bg-gray-50 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <User size={14} />
                <span>Primary Contact</span>
              </div>
              <p className="font-semibold text-gray-800 text-sm">
                {user.isPrimaryContact ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Created At:</span>
              <span className="font-medium text-gray-700">
                {formatDate(user.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Last Login:</span>
              <span className="font-medium text-gray-700">
                {formatDate(user.lastLogin)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewVendorUserModal;

