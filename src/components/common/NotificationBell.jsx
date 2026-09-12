import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, AlertCircle, AlertTriangle, Info, Clock, ExternalLink, Trash2 } from "lucide-react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../../services/notificationService";
import { resolveNotificationUrl } from "../../utils/notificationUtils";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Poll unread count every 30 seconds
  const fetchCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      // silent
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch recent notifications when dropdown opens
  const fetchRecent = async () => {
    setLoading(true);
    try {
      const data = await getNotifications({ page: 1, limit: 5 });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchRecent();
    }
    setIsOpen((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await markAsRead(notif._id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
      } catch (err) {
        console.error(err);
      }
    }
    setIsOpen(false);
    if (notif.actionUrl) {
      const targetUrl = resolveNotificationUrl(notif.actionUrl, false);
      if (targetUrl) {
        navigate(targetUrl);
      }
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;
    try {
      await clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOne = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
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
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "critical":
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-full"><AlertCircle size={12} /> Critical</span>;
      case "action":
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full"><AlertTriangle size={12} /> Action</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full"><Info size={12} /> Info</span>;
    }
  };

  const getCategoryBadge = (category) => {
    const config = {
      po: { label: "PO", color: "bg-blue-50 text-blue-700 border-blue-200" },
      purchase_order: { label: "PO", color: "bg-blue-50 text-blue-700 border-blue-200" },
      dispatch: { label: "Dispatch", color: "bg-purple-50 text-purple-700 border-purple-200" },
      grn: { label: "GRN", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      goods_receipt: { label: "GRN", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      inspection: { label: "Quality", color: "bg-amber-50 text-amber-700 border-amber-200" },
      quality_inspection: { label: "Quality", color: "bg-amber-50 text-amber-700 border-amber-200" },
      rating: { label: "Rating", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
      vendor_rating: { label: "Rating", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
      system: { label: "System", color: "bg-slate-50 text-slate-700 border-slate-200" },
    };
    const c = config[category] || { label: category || "General", color: "bg-slate-50 text-slate-700 border-slate-200" };
    return (
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border uppercase tracking-wider ${c.color}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none"
        title="Notifications"
      >
        <Bell size={21} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 max-w-[90vw] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAll}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <CheckCheck size={14} /> Mark all
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                  title="Clear all notifications"
                >
                  <Trash2 size={13} /> Clear all
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-600">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-0.5">We'll alert you as workflow events happen</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex flex-col gap-1.5 ${
                    !n.isRead ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {getPriorityBadge(n.priority)}
                      {getCategoryBadge(n.category)}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock size={11} /> {formatTime(n.createdAt)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteOne(e, n._id)}
                        className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition"
                        title="Delete notification"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <h4 className={`text-xs ${!n.isRead ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                    {n.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>

                  {n.actionUrl && (
                    <div className="flex items-center justify-end mt-1">
                      <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 hover:underline">
                        {n.actionLabel || "View"} <ExternalLink size={10} />
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50/80 p-2.5 text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate("/notifications");
              }}
              className="w-full py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-white rounded-lg transition"
            >
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
