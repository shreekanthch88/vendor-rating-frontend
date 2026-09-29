import {
  LayoutDashboard,
  ClipboardCheck,
  PlusCircle,
  RefreshCcw,
  RotateCcw,
  TrendingUp,
} from "lucide-react";

/**
 * =========================================================
 * QUALITY INSPECTION SIDEBAR
 * =========================================================
 *
 * This sidebar is shown to:
 *
 * QUALITY_MANAGER
 *
 * SUPER_ADMIN and ADMIN can also access these pages,
 * but they will normally reach them through the main
 * Admin sidebar.
 */

export const qualityInspectionSidebarMenu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/quality-inspection/dashboard",
  },

  {
    title: "Inspections",
    icon: ClipboardCheck,
    path: "/quality-inspection/inspections",
  },

  {
    title: "Create Inspection",
    icon: PlusCircle,
    path: "/quality-inspection/create",
  },

  {
    title: "Re-inspection",
    icon: RefreshCcw,
    path: "/quality-inspection/re-inspections",
  },

  {
    title: "Replacement",
    icon: RotateCcw,
    path: "/quality-inspection/replacements",
  },

  {
    title: "Analytics",
    icon: TrendingUp,
    path: "/quality-inspection/analytics",
  },
];

export default qualityInspectionSidebarMenu;