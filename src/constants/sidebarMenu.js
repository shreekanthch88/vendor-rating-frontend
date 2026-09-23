import {
  LayoutDashboard,
  Users,
  Building2,
  FolderTree,
  Package,
  FileText,
  ClipboardList,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Receipt,
  CreditCard,
  Star,
  BarChart3,
  Settings,
} from "lucide-react";


export const sidebarMenu = [

   // =====================================================
  // ADMIN VENDOR RATING DASHBOARD
  // =====================================================

  {
    title: "Vendor Rating Dashboard",
    icon: BarChart3,
    path: "/vendor-rating-dashboard",
  },
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "User Management",
    icon: Users,
    path: "/users",
  },
  {
    title: "Vendor Management",
    icon: Building2,
    path: "/vendors",
  },
  {
    title: "Material Categories",
    icon: FolderTree,
    path: "/material-categories",
  },
  {
    title: "Material Master",
    icon: Package,
    path: "/materials",
  },
  {
    title: "Purchase Requisition",
    icon: FileText,
    path: "/purchase-requisitions",
  },
  {
    title: "Purchase Orders",
    icon: ClipboardList,
    path: "/purchase-orders",
  },
  {
    title: "Goods Receipt",
    icon: Truck,
    path: "/grn",
  },
  {
    title: "Quality Inspection",
    icon: ShieldCheck,
    path: "/quality-inspection/inspections",
  },
  {
    title: "Invoices",
    icon: Receipt,
    path: "/invoices",
  },
  {
    title: "Payments",
    icon: CreditCard,
    path: "/payments",
  },
  {
    title: "Vendor Ratings",
    icon: Star,
    path: "/ratings",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];