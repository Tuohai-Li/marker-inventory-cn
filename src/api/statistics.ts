import { computeInventoryStats, computeMonthlyRestock, enrichMarkers } from "@/lib/statistics";
import { brandsStore, markersStore, purchasesStore } from "@/data/store";

export async function getInventoryStats() {
  const base = computeInventoryStats(markersStore, brandsStore, purchasesStore);
  return {
    ...base,
    recent: enrichMarkers(base.recent, brandsStore),
    lowStockMarkers: enrichMarkers(base.lowStockMarkers, brandsStore),
  };
}

export async function getInventorySummary() {
  const stats = await getInventoryStats();

  return {
    inStock: stats.totalStock,
    borrowed: stats.totalBorrowed,
    lowStockCount: stats.lowStockCount,
    monthlyRestock: computeMonthlyRestock(purchasesStore),
  };
}
