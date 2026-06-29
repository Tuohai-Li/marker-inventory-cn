import {
  BarChart2,
  BookOpen,
  Download,
  Heart,
  Home,
  LayoutGrid,
  Package,
  Settings,
  ShoppingCart,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const navigation: NavItem[] = [
  { path: "/", label: "首页", icon: Home, end: true },
  { path: "/overview", label: "收藏总览", icon: LayoutGrid },
  { path: "/library", label: "马克笔库", icon: BookOpen },
  { path: "/inventory", label: "库存管理", icon: Package },
  { path: "/brands", label: "品牌与系列", icon: Tag },
  { path: "/purchases", label: "购买记录", icon: ShoppingCart },
  { path: "/wishlist", label: "心愿清单", icon: Heart },
  { path: "/stats", label: "统计分析", icon: BarChart2 },
  { path: "/export", label: "导出与备份", icon: Download },
  { path: "/settings", label: "设置", icon: Settings },
];
