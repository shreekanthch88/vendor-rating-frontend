import React from "react";
import Table from "../../common/Table";
import Badge from "../../common/Badge";
import Button from "../../common/Button";

import {
  Eye,
  Pencil,
  Trash2,
  KeyRound,
} from "lucide-react";

const UserTable = ({
  users = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onResetPassword,
}) => {

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
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

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  const columns = [
    {
      key: "name",
      title: "User",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
            {getInitials(user.name)}
          </div>

          <div>
            <div className="font-medium text-gray-900">
              {user.name}
            </div>

            <div className="text-xs text-gray-500">
              {user.email}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "role",
      title: "Role",
      render: (user) => (
        <Badge
          variant={getRoleVariant(user.role)}
          size="sm"
        >
          {user.role?.replaceAll("_", " ")}
        </Badge>
      ),
    },

    {
      key: "department",
      title: "Department",
      render: (user) =>
        user.department || "-",
    },

    {
      key: "status",
      title: "Status",
      render: (user) => (
        <Badge
          variant={getStatusVariant(user.status)}
          dot
          size="sm"
        >
          {user.status}
        </Badge>
      ),
    },

    {
      key: "lastLogin",
      title: "Last Login",
      render: (user) =>
        formatDate(user.lastLogin),
    },

    {
      key: "actions",
      title: "Actions",
      render: (user) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(user)}
          >
            <Eye size={16} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(user)}
            title="Edit User"
          >
            <Pencil size={16} />
          </Button>

          {onResetPassword && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onResetPassword(user)}
              title="Reset Password"
            >
              <KeyRound size={16} className="text-blue-600" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(user)}
            title="Delete User"
          >
            <Trash2
              size={16}
              className="text-red-600"
            />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={users}
      loading={loading}
      striped
      emptyMessage="No users found."
    />
  );
};

export default UserTable;