import React from "react";
import SearchInput from "../../common/SearchInput";
import Select from "../../common/Select";
import Button from "../../common/Button";
import { RotateCcw } from "lucide-react";

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "PURCHASE_MANAGER", label: "Purchase Manager" },
  { value: "QUALITY_MANAGER", label: "Quality Manager" },
  { value: "FINANCE_MANAGER", label: "Finance Manager" },
  { value: "VIEWER", label: "Viewer" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const UserFilters = ({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onReset,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Search */}
      <div className="lg:col-span-5">
        <SearchInput
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
        />
      </div>

      {/* Role */}
      <div className="lg:col-span-3">
        <Select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          options={roleOptions}
          placeholder="All Roles"
        />
      </div>

      {/* Status */}
      <div className="lg:col-span-2">
        <Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          options={statusOptions}
          placeholder="All Status"
        />
      </div>

      {/* Reset */}
      <div className="lg:col-span-2 flex items-end">
        <Button
          variant="outline"
          fullWidth
          leftIcon={<RotateCcw size={16} />}
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default UserFilters;