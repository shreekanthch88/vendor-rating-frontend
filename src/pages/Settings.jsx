import { useState, useContext } from "react";
import Layout from "../layout/Layout";
import PageHeader from "../common/PageHeader";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { AuthContext } from "../context/AuthContext";
import { changePassword } from "../services/authService";
import {
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  KeyRound,
} from "lucide-react";

const Settings = () => {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("security");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!currentPassword) {
      setMessage({ type: "error", text: "Please enter your current password." });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (currentPassword === newPassword) {
      setMessage({
        type: "error",
        text: "New password must be different from your current password.",
      });
      return;
    }

    try {
      setLoading(true);
      await changePassword({ currentPassword, newPassword });
      setMessage({
        type: "success",
        text: "Your password has been changed successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change Password Error:", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Failed to change password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
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

  return (
    <Layout>
      <PageHeader
        title="Settings"
        subtitle="Manage your profile and security credentials."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings" },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1">
          <Card className="p-3">
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("security");
                  setMessage({ type: "", text: "" });
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  activeTab === "security"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Lock size={18} />
                Security & Password
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("profile");
                  setMessage({ type: "", text: "" });
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <User size={18} />
                Profile Information
              </button>
            </nav>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === "security" && (
            <Card>
              <div className="border-b border-gray-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">
                    <KeyRound size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Change Password
                    </h2>
                    <p className="text-sm text-gray-500">
                      Update your password to keep your account secure.
                    </p>
                  </div>
                </div>
              </div>

              {message.text && (
                <div
                  className={`mt-6 flex items-center gap-3 rounded-xl border p-4 text-sm ${
                    message.type === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle size={20} className="text-green-600 shrink-0" />
                  ) : (
                    <AlertCircle size={20} className="text-red-600 shrink-0" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5 max-w-lg">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min. 6 characters)"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 6 characters long.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <Button type="submit" loading={loading}>
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === "profile" && (
            <Card>
              <div className="border-b border-gray-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">
                    <User size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Profile Information
                    </h2>
                    <p className="text-sm text-gray-500">
                      Your registered system account details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-md">
                  {getInitials(user?.name || "User")}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {user?.name || "User"}
                  </h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={getRoleVariant(user?.role)} size="sm">
                      {user?.role?.replaceAll("_", " ")}
                    </Badge>
                    <Badge variant="success" dot size="sm">
                      ACTIVE
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {user?.name || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {user?.email || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    System Role
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {user?.role?.replaceAll("_", " ") || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Permissions Level
                  </label>
                  <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-blue-700">
                    <Shield size={16} />
                    <span>
                      {user?.role === "SUPER_ADMIN"
                        ? "Full System Administrator"
                        : "Organization Access"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;

