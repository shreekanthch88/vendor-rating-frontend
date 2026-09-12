import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import PageHeader from "../common/PageHeader";
import Card from "../common/Card";
import Button from "../common/Button";
import Pagination from "../common/Pagination";

import UserFilters from "../components/users/UserFilters";
import UserTable from "../components/users/UserTable";

import AddUserModal from "../components/users/AddUserModal";
import EditUserModal from "../components/users/EditUserModal";
import ViewUserModal from "../components/users/ViewUserModal";
import DeleteUserDialog from "../components/users/DeleteUserDialog";
import ResetUserPasswordModal from "../components/users/ResetUserPasswordModal";

import { Plus } from "lucide-react";
import { getAllUsers } from "../services/userService";

const Users = () => {
  // Data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Selected User
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToReset, setUserToReset] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getAllUsers({
        search,
        role,
        status,
        page,
        limit: pageSize,
      });

      setUsers(response.users || []);

setTotalPages(
  response.pagination?.totalPages || 1
);

setTotalRecords(
  response.pagination?.totalRecords || 0
);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search, role, status, page, pageSize]);

  const resetFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
  };

  return (
    <Layout>
      <PageHeader
        title="User Management"
        subtitle="Manage system users and permissions."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Administration" },
          { label: "Users" },
        ]}
        action={
          <Button
            leftIcon={<Plus size={18} />}
            onClick={() => setShowAddModal(true)}
          >
            Add User
          </Button>
        }
      />

      <Card
        noPadding
        footer={
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        }
      >
        <div className="p-6">
          <UserFilters
            search={search}
            role={role}
            status={status}
            onSearchChange={setSearch}
            onRoleChange={setRole}
            onStatusChange={setStatus}
            onReset={resetFilters}
          />
        </div>

        <UserTable
          users={users}
          loading={loading}
          onView={(user) => {
            setSelectedUser(user);
            setShowViewModal(true);
          }}
          onEdit={(user) => {
            setSelectedUser(user);
            setShowEditModal(true);
          }}
          onResetPassword={(user) => {
            setUserToReset(user);
            setShowResetPasswordModal(true);
          }}
          onDelete={(user) => {
            setSelectedUser(user);
            setShowDeleteDialog(true);
          }}
        />
      </Card>

      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadUsers}
      />

      <EditUserModal
        isOpen={showEditModal}
        user={selectedUser}
        onClose={() => setShowEditModal(false)}
        onSuccess={loadUsers}
      />

      <ResetUserPasswordModal
        isOpen={showResetPasswordModal}
        user={userToReset}
        onClose={() => {
          setShowResetPasswordModal(false);
          setUserToReset(null);
        }}
        onSuccess={loadUsers}
      />

      <ViewUserModal
        isOpen={showViewModal}
        user={selectedUser}
        onClose={() => setShowViewModal(false)}
      />

      <DeleteUserDialog
        isOpen={showDeleteDialog}
        user={selectedUser}
        onClose={() => setShowDeleteDialog(false)}
        onSuccess={loadUsers}
      />
    </Layout>
  );
};

export default Users;