import { useEffect, useState } from "react";

import Modal from "../../common/Modal";
import Button from "../../common/Button";

import UserForm from "./UserForm";

import { updateUser } from "../../services/userService";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  role: "",
  status: "ACTIVE",
};

const EditUserModal = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        department: user.department || "",
        role: user.role || "",
        status: user.status || "ACTIVE",
      });

      setErrors({});
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    }

    if (!formData.role) {
      validationErrors.role = "Role is required";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await updateUser(user._id, formData);

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
      onClose={onClose}
      title="Edit User"
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
            Update User
          </Button>
        </>
      }
    >
      <UserForm
        formData={formData}
        errors={errors}
        onChange={handleChange}
        isEdit
      />
    </Modal>
  );
};

export default EditUserModal;