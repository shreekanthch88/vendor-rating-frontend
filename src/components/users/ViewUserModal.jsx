import React from "react";
import Modal from "../../common/Modal";
import Badge from "../../common/Badge";
import Button from "../../common/Button";

const ViewUserModal = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!user) return null;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "gray";
      default:
        return "warning";
    }
  };

  const getRoleVariant = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "danger";
      case "ADMIN":
        return "primary";
      case "PURCHASE_MANAGER":
        return "secondary";
      case "QUALITY_MANAGER":
        return "info";
      case "FINANCE_MANAGER":
        return "success";
      default:
        return "gray";
    }
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      size="lg"
      footer={
        <Button onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-8">

        {/* Profile */}
        <div className="flex items-center gap-5 border-b pb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
            {getInitials(user.name)}
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {user.name}
            </h2>

            <p className="text-gray-500">
              {user.email}
            </p>

            <div className="mt-3 flex gap-2">
              <Badge
                variant={getRoleVariant(user.role)}
              >
                {user.role?.replaceAll("_", " ")}
              </Badge>

              <Badge
                variant={getStatusVariant(user.status)}
                dot
              >
                {user.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <InfoItem
            label="Phone"
            value={user.phone}
          />

          <InfoItem
            label="Department"
            value={user.department}
          />

          <InfoItem
            label="Role"
            value={user.role?.replaceAll("_", " ")}
          />

          <InfoItem
            label="Status"
            value={user.status}
          />

          <InfoItem
            label="Last Login"
            value={formatDate(user.lastLogin)}
          />

          <InfoItem
            label="Created At"
            value={formatDate(user.createdAt)}
          />

          <InfoItem
            label="Updated At"
            value={formatDate(user.updatedAt)}
          />

        </div>
      </div>
    </Modal>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <p className="mb-1 text-sm text-gray-500">
      {label}
    </p>

    <p className="font-medium text-gray-800">
      {value || "-"}
    </p>
  </div>
);

export default ViewUserModal;