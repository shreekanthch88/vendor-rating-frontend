import React from "react";
import Input from "../../common/Input";
import Select from "../../common/Select";

const roleOptions = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "PURCHASE_MANAGER", label: "Purchase Manager" },
  { value: "QUALITY_MANAGER", label: "Quality Manager" },
  { value: "FINANCE_MANAGER", label: "Finance Manager" },
  { value: "VIEWER", label: "Viewer" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const UserForm = ({
  formData,
  errors = {},
  onChange,
  isEdit = false,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Input
        label="Full Name"
        name="name"
        required
        value={formData.name}
        error={errors.name}
        onChange={onChange}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        required
        value={formData.email}
        error={errors.email}
        onChange={onChange}
      />

      {!isEdit && (
        <Input
          label="Password"
          name="password"
          type="password"
          required
          value={formData.password}
          error={errors.password}
          onChange={onChange}
        />
      )}

      <Input
        label="Phone"
        name="phone"
        value={formData.phone}
        error={errors.phone}
        onChange={onChange}
      />

      <Select
        label="Role"
        name="role"
        required
        value={formData.role}
        options={roleOptions}
        error={errors.role}
        onChange={onChange}
      />

      <Input
        label="Department"
        name="department"
        value={formData.department}
        error={errors.department}
        onChange={onChange}
      />

      <Select
        label="Status"
        name="status"
        value={formData.status}
        options={statusOptions}
        onChange={onChange}
      />
    </div>
  );
};

export default UserForm;