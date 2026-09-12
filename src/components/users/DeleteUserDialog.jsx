import { useState } from "react";
import Modal from "../../common/Modal";
import Button from "../../common/Button";
import Badge from "../../common/Badge";
import { AlertTriangle } from "lucide-react";

import { deleteUser } from "../../services/userService";

const DeleteUserDialog = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteUser(user._id);

      onSuccess?.();
      onClose();

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      title="Delete User"
      size="md"
      footer={
        <>
          <Button
            variant="outline"
            disabled={loading}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            loading={loading}
            onClick={handleDelete}
          >
            Delete User
          </Button>
        </>
      }
    >
      <div className="space-y-6">

        {/* Warning */}
        <div className="flex items-start gap-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertTriangle
            size={28}
            className="mt-0.5 text-red-600"
          />

          <div>
            <h3 className="font-semibold text-red-700">
              Delete Confirmation
            </h3>

            <p className="mt-1 text-sm text-red-600">
              This action cannot be undone.
              The selected user and all related
              references may be permanently removed.
            </p>
          </div>
        </div>

        {/* User Summary */}
        <div className="rounded-lg border bg-gray-50 p-4">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            User Information
          </h4>

          <div className="space-y-2">
            <InfoRow
              label="Name"
              value={user.name}
            />

            <InfoRow
              label="Email"
              value={user.email}
            />

            <InfoRow
              label="Department"
              value={user.department || "-"}
            />

            <div className="flex justify-between">
              <span className="text-gray-500">
                Status
              </span>

              <Badge
                variant={
                  user.status === "ACTIVE"
                    ? "success"
                    : "gray"
                }
                dot
              >
                {user.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Confirmation Text */}
        <p className="text-sm text-gray-600">
          Are you sure you want to permanently delete{" "}
          <span className="font-semibold text-gray-900">
            {user.name}
          </span>
          ?
        </p>

      </div>
    </Modal>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">
      {label}
    </span>

    <span className="font-medium text-gray-800">
      {value}
    </span>
  </div>
);

export default DeleteUserDialog;