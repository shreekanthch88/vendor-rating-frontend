import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  KeyRound,
  Trash2,
  UserX,
  UserCheck,
} from "lucide-react";

import {
  getVendorUsers,
  changeVendorUserStatus,
  deleteVendorUser,
} from "../../services/vendorUserService";
import AddVendorUserModal from "./AddVendorUserModal";
import EditVendorUserModal from "./EditVendorUserModal";
import ResetVendorPasswordModal from "./ResetVendorPasswordModal";
import ViewVendorUserModal from "./ViewVendorUserModal";

const DashboardCard = ({ title, value }) => (
  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="mt-2 text-3xl font-bold text-blue-600">
      {value}
    </h2>
  </div>
);

const VendorUsersTab = ({ vendor }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (vendor?._id) {
      loadUsers();
    }
  }, [vendor]);

  useEffect(() => {
    filterUsers();
  }, [search, statusFilter, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getVendorUsers(vendor._id);
      setUsers(res.users || []);
    } catch (err) {
      console.error("Error loading vendor users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let data = [...users];

    if (search) {
      data = data.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()) ||
          u.phone?.toLowerCase().includes(search.toLowerCase()) ||
          u.designation?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter((u) => u.status === statusFilter);
    }

    setFilteredUsers(data);
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const confirmMsg = `Are you sure you want to change status of "${user.name}" to ${nextStatus}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await changeVendorUserStatus(vendor._id, user._id, nextStatus);
      await loadUsers();
    } catch (err) {
      console.error("Change status error:", err);
      alert(
        err.response?.data?.message ||
        err.message ||
        "Failed to update user status."
      );
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to remove user "${user.name}"?`)) return;

    try {
      await deleteVendorUser(vendor._id, user._id);
      alert("Vendor user deactivated successfully.");
      await loadUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      alert(
        err.response?.data?.message ||
        err.message ||
        "Failed to delete vendor user."
      );
    }
  };

  const activeUsers = users.filter((u) => u.status === "ACTIVE").length;
  const inactiveUsers = users.filter((u) => u.status === "INACTIVE").length;
  const primaryUsers = users.filter((u) => u.isPrimaryContact).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vendor Users</h2>
          <p className="text-sm text-gray-500">
            Manage authorized login accounts for this vendor
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Users" value={users.length} />
        <DashboardCard title="Active Users" value={activeUsers} />
        <DashboardCard title="Inactive Users" value={inactiveUsers} />
        <DashboardCard title="Primary Contacts" value={primaryUsers} />
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name, email, phone..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Designation
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Phone
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Primary
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      <span>Loading vendor users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    No vendor users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/70 transition">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {user.name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {user.designation || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {user.phone || "—"}
                    </td>

                    <td className="px-5 py-4 text-center">
                      {user.isPrimaryContact ? (
                        <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                          Primary
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* View */}
                        <button
                          title="View User"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowViewModal(true);
                          }}
                          className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 transition"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit */}
                        <button
                          title="Edit User"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="rounded-lg p-1.5 text-yellow-600 hover:bg-yellow-50 transition"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* Reset Password */}
                        <button
                          title="Reset Password"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowResetModal(true);
                          }}
                          className="rounded-lg p-1.5 text-purple-600 hover:bg-purple-50 transition"
                        >
                          <KeyRound size={16} />
                        </button>

                        {/* Toggle Active / Inactive */}
                        <button
                          title={user.status === "ACTIVE" ? "Deactivate User" : "Activate User"}
                          onClick={() => handleToggleStatus(user)}
                          className={`rounded-lg p-1.5 transition ${
                            user.status === "ACTIVE"
                              ? "text-orange-600 hover:bg-orange-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {user.status === "ACTIVE" ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>

                        {/* Delete */}
                        <button
                          title="Delete User"
                          onClick={() => handleDeleteUser(user)}
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AddVendorUserModal
        isOpen={showAddModal}
        vendor={vendor}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          loadUsers();
        }}
      />

      {/* View User Modal */}
      <ViewVendorUserModal
        isOpen={showViewModal}
        user={selectedUser}
        onClose={() => {
          setShowViewModal(false);
          setSelectedUser(null);
        }}
      />

      {/* Edit User Modal */}
      <EditVendorUserModal
        isOpen={showEditModal}
        vendor={vendor}
        user={selectedUser}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedUser(null);
          loadUsers();
        }}
      />

      {/* Reset Password Modal */}
      <ResetVendorPasswordModal
        isOpen={showResetModal}
        vendor={vendor}
        user={selectedUser}
        onClose={() => {
          setShowResetModal(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          setShowResetModal(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default VendorUsersTab;