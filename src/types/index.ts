export interface Marker {
  id: number;
  brandId: number;
  code: string;
  name: string;
  color: string;
  stock: number;
  borrowed: number;
  price: number;
  addDate: string;
  series: string;
  notes?: string;
}

/** 由 Marker + Brand 关联解析出的展示字段 */
export type MarkerWithBrand = Marker & { brandName: string };

export interface Brand {
  id: number;
  name: string;
  origin: string;
  tier: string;
  color: string;
}

export interface Series {
  id: number;
  brandId: number;
  name: string;
}

/** 由 Marker + Series 聚合计算，不持久化 */
export interface BrandWithStats extends Brand {
  markerCount: number;
  totalStock: number;
  seriesCount: number;
  seriesNames: string[];
  avgPrice: number;
}

export interface WishItem {
  id: number;
  brandId: number;
  code: string;
  name: string;
  color: string;
  price: number;
  priority: "high" | "medium" | "low";
}

export interface Purchase {
  id: number;
  date: string;
  brandId: number;
  items: string;
  qty: number;
  amount: number;
  note: string;
}

export type PurchaseWithBrand = Purchase & { brandName: string };

export interface ColorSwatch {
  code: string;
  color: string;
}

export interface ChartSlice {
  name: string;
  value: number;
  fill: string;
}

export interface SeriesBarItem {
  series: string;
  count: number;
}

export interface LinePoint {
  month: string;
  value: number;
}

export interface BrandBarItem {
  brand: string;
  count: number;
}

export interface AppSettings {
  language: string;
  currency: string;
  dateFormat: string;
  autoBackup: boolean;
  autoSync: boolean;
  lowStockAlert: boolean;
  borrowAlert: boolean;
  newItemAlert: boolean;
}

export const defaultAppSettings: AppSettings = {
  language: "中文（简体）",
  currency: "人民币（¥）",
  dateFormat: "YYYY-MM-DD",
  autoBackup: false,
  autoSync: false,
  lowStockAlert: true,
  borrowAlert: true,
  newItemAlert: false,
};
