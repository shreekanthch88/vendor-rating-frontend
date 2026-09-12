import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Filter,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Trash2,
} from "lucide-react";
import Layout from "../layout/Layout";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../services/notificationService";
import { resolveNotificationUrl } from "../utils/notificationUtils";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("all"); // all | unread | action | critical
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getNotifications({
        page,
        limit: 15,
        filter,
        category,
      });
      setNotifications(data.notifications || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, filter, category]);

  const handleMarkOne = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const [clearing, setClearing] = useState(false);

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;
    setClearing(true);
    try {
      await clearAllNotifications();
      setNotifications([]);
      setTotal(0);
      setPages(1);
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
      alert("Failed to clear notifications.");
    } finally {
      setClearing(false);
    }
  };

  const handleDeleteOne = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setTotal((t) => Math.max(0, t - 1));
      setUnreadCount((c) => {
        const target = notifications.find((n) => n._id === id);
        return target && !target.isRead ? Math.max(0, c - 1) : c;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "critical":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
            <AlertCircle size={12} /> Critical
          </span>
        );
      case "action":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <AlertTriangle size={12} /> Action Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            <Info size={12} /> Informational
          </span>
        );
    }
  };

  const categories = [
    { label: "All Categories", value: "" },
    { label: "Purchase Orders", value: "purchase_order" },
    { label: "Goods Receipts", value: "goods_receipt" },
    { label: "Quality Inspection", value: "quality_inspection" },
    { label: "Vendor Rating", value: "vendor_rating" },
  ];

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Bell className="text-blue-600" size={26} />
            Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Stay on top of Purchase Orders, Goods Receipts, Quality Inspections, and Ratings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAll}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition"
            >
              <CheckCheck size={16} className="text-blue-600" /> Mark all read ({unreadCount})
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={clearing}
              className="px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition disabled:opacity-50"
              title="Clear all notifications"
            >
              <Trash2 size={16} /> {clearing ? "Clearing..." : "Clear all"}
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Category Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-6">
        {/* Priority Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "action", label: "Action Required" },
            { id: "critical", label: "Critical" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setFilter(tab.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filter === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center">
            <Inbox size={42} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No notifications found</h3>
            <p className="text-xs text-slate-400 mt-1">
              You are all caught up! No notifications match the current filters.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-5 transition hover:bg-slate-50/80 flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                !n.isRead ? "bg-blue-50/20" : ""
              }`}
            >
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {getPriorityBadge(n.priority)}
                  {!n.isRead && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 inline-block" />
                  )}
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {formatTime(n.createdAt)}
                  </span>
                </div>

                <h3
                  className={`text-sm ${
                    !n.isRead ? "font-bold text-slate-900" : "font-medium text-slate-700"
                  }`}
                >
                  {n.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {n.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {!n.isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkOne(n._id)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition font-medium"
                    title="Mark as read"
                  >
                    Mark read
                  </button>
                )}
                {n.actionUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!n.isRead) handleMarkOne(n._id);
                      const targetUrl = resolveNotificationUrl(n.actionUrl, false);
                      if (targetUrl) navigate(targetUrl);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1 shadow-sm"
                  >
                    {n.actionLabel || "View"} <ExternalLink size={12} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteOne(n._id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete notification"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-6 text-xs text-slate-500">
          <span>
            Showing {(page - 1) * 15 + 1} to {Math.min(page * 15, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-semibold text-slate-700">
              Page {page} of {pages}
            </span>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
};

export default Notifications;
