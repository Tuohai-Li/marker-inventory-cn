import { LowStockList } from "@/components/features/LowStockList";
import { StatsGrid } from "@/components/ui/StatCard";
import { useStatistics } from "@/hooks/useStatistics";

export function InventoryPage() {
  const { stats, loading } = useStatistics();

  if (loading || !stats) {
    return <p className="text-sm text-muted">加载中…</p>;
  }

  return (
    <div>
      <h1 className="mb-4 text-[22px] font-bold">库存管理 📦</h1>

      <StatsGrid
        columns={4}
        items={[
          { label: "在库总量", value: `${stats.totalStock} 支`, accentColor: "#5a8c6a" },
          { label: "借出数量", value: `${stats.totalBorrowed} 支`, accentColor: "#c87050" },
          { label: "低库存预警", value: `${stats.lowStockCount} 支`, accentColor: "#c84040" },
          {
            label: "低库存品种",
            value: `${stats.lowStockMarkers.length} 种`,
            accentColor: "#8090a0",
          },
        ]}
      />

      <LowStockList
        markers={stats.lowStockMarkers}
        title="需要补充的笔（库存 < 3 支）"
        showActions
        compact
      />
    </div>
  );
}
