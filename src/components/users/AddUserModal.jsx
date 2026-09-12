import { useState } from "react";

import Modal from "../../common/Modal";
import Button from "../../common/Button";

import UserForm from "./UserForm";

import { createUser } from "../../services/userService";

const initialState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  department: "",
  role: "",
  status: "ACTIVE",
};

const AddUserModal = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] =
    useState(initialState);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!formData.name.trim())
      validationErrors.name =
        "Name is required";

    if (!formData.email.trim())
      validationErrors.email =
        "Email is required";

    if (!formData.password.trim())
      validationErrors.password =
        "Password is required";

    if (!formData.role)
      validationErrors.role =
        "Role is required";

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors)
        .length === 0
    );
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await createUser(formData);

      setFormData(initialState);
      setErrors({});

      onClose();

      onSuccess?.();
    } catch (error) {
  console.error("Full Error:", error);

  console.log("Response:", error.response?.data);

  alert(
    error.response?.data?.message ||
    JSON.stringify(error.response?.data)
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add User"
      size="lg"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            loading={loading}
            onClick={handleSubmit}
          >
            Save User
          </Button>
        </>
      }
    >
      <UserForm
        formData={formData}
        errors={errors}
        onChange={handleChange}
      />
    </Modal>
  );
};

export default AddUserModal;