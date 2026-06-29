import type {
  Brand,
  BrandBarItem,
  BrandWithStats,
  ChartSlice,
  LinePoint,
  Marker,
  Purchase,
  PurchaseWithBrand,
  SeriesBarItem,
} from "@/types";
import type { Series } from "@/types";

const SERIES_COLORS: Record<string, string> = {
  B: "#7aa8d0",
  R: "#e87070",
  E: "#b08040",
  CG: "#9ca3af",
  YG: "#86c67c",
  Y: "#fce060",
  G: "#5aaa70",
  BG: "#7ba7bc",
  WG: "#d4c8b8",
  YR: "#f9c98c",
  V: "#9880c8",
};

export interface InventoryStats {
  totalStock: number;
  totalBorrowed: number;
  lowStockMarkers: Marker[];
  lowStockCount: number;
  brandCount: number;
  seriesCount: number;
  colorCount: number;
  totalValue: number;
  recent: Marker[];
  inventoryPie: ChartSlice[];
  brandBar: BrandBarItem[];
  seriesBar: SeriesBarItem[];
  seriesBreakdown: { name: string; count: number; color: string }[];
  growthLine: LinePoint[];
}

export function enrichMarkers(markers: Marker[], brands: Brand[]): (Marker & { brandName: string })[] {
  const brandMap = new Map(brands.map((b) => [b.id, b.name]));
  return markers.map((m) => ({
    ...m,
    brandName: brandMap.get(m.brandId) ?? "未知品牌",
  }));
}

export function computeBrandStats(
  brand: Brand,
  markers: Marker[],
  seriesCatalog: Series[],
): BrandWithStats {
  const brandMarkers = markers.filter((m) => m.brandId === brand.id);
  const totalStock = brandMarkers.reduce((sum, m) => sum + m.stock, 0);
  const seriesNames = seriesCatalog
    .filter((s) => s.brandId === brand.id)
    .map((s) => s.name)
    .sort();
  const avgPrice =
    brandMarkers.length > 0
      ? Math.round(brandMarkers.reduce((sum, m) => sum + m.price, 0) / brandMarkers.length)
      : 0;

  return {
    ...brand,
    markerCount: brandMarkers.length,
    totalStock,
    seriesCount: seriesNames.length,
    seriesNames,
    avgPrice,
  };
}

export function computeInventoryStats(
  markers: Marker[],
  brands: Brand[],
  _purchases: Purchase[] = [],
): InventoryStats {
  const totalStock = markers.reduce((sum, m) => sum + m.stock, 0);
  const totalBorrowed = markers.reduce((sum, m) => sum + m.borrowed, 0);
  const lowStockMarkers = markers.filter((m) => m.stock < 3);
  const brandIdsWithStock = new Set(markers.map((m) => m.brandId));
  const recent = [...markers]
    .sort((a, b) => b.addDate.localeCompare(a.addDate))
    .slice(0, 5);

  const inventoryPie: ChartSlice[] = [
    { name: "在库", value: totalStock, fill: "#5a8c6a" },
    { name: "借出", value: totalBorrowed, fill: "#c87050" },
  ];

  const brandBar = brands
    .map((brand) => {
      const stock = markers
        .filter((m) => m.brandId === brand.id)
        .reduce((sum, m) => sum + m.stock, 0);
      return { brand: brand.name, count: stock };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const seriesMap = new Map<string, number>();
  for (const marker of markers) {
    seriesMap.set(marker.series, (seriesMap.get(marker.series) ?? 0) + marker.stock);
  }

  const seriesBar: SeriesBarItem[] = [...seriesMap.entries()]
    .map(([series, count]) => ({ series: `${series}系`, count }))
    .sort((a, b) => b.count - a.count);

  const seriesBreakdown = [...seriesMap.entries()]
    .map(([series, count]) => ({
      name: `${series} 系列`,
      count,
      color: SERIES_COLORS[series] ?? "#8090a0",
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalStock,
    totalBorrowed,
    lowStockMarkers,
    lowStockCount: lowStockMarkers.length,
    brandCount: brandIdsWithStock.size,
    seriesCount: seriesMap.size,
    colorCount: markers.length,
    totalValue: markers.reduce((sum, m) => sum + m.price * m.stock, 0),
    recent,
    inventoryPie,
    brandBar,
    seriesBar,
    seriesBreakdown,
    growthLine: computeGrowthLine(markers),
  };
}

export function computeGrowthLine(markers: Marker[]): LinePoint[] {
  const monthLabels = ["1月", "2月", "3月", "4月", "5月"];
  const monthKeys = ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05"];

  let cumulative = 0;
  return monthKeys.map((key, index) => {
    const addedInMonth = markers
      .filter((m) => m.addDate.startsWith(key))
      .reduce((sum, m) => sum + m.stock, 0);
    cumulative += addedInMonth;
    return { month: monthLabels[index], value: cumulative };
  });
}

export function computeMonthlyRestock(purchases: Purchase[], monthPrefix = "2024-05"): number {
  return purchases
    .filter((p) => p.date.startsWith(monthPrefix))
    .reduce((sum, p) => sum + p.qty, 0);
}

export function computeMonthlySpend(
  purchases: Pick<PurchaseWithBrand, "date" | "amount">[],
  monthPrefix = "2024-05",
): number {
  return purchases
    .filter((p) => p.date.startsWith(monthPrefix))
    .reduce((sum, p) => sum + p.amount, 0);
}

export function resolveBrandId(brands: Brand[], brandName: string): number | undefined {
  return brands.find((b) => b.name === brandName)?.id;
}
