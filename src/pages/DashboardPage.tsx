import {
  Archive,
  BarChart2,
  BookOpen,
  Heart,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { InventoryPieChart } from "@/components/charts/InventoryPieChart";
import { AddMemoModal } from "@/components/features/AddMemoModal";
import { ColorSwatchPanel } from "@/components/features/ColorSwatchPanel";
import { LowStockList } from "@/components/features/LowStockList";
import { RecentMarkersList } from "@/components/features/RecentMarkersList";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatsGrid } from "@/components/ui/StatCard";
import { useAddMarkerModal } from "@/contexts/AddMarkerModalContext";
import { useMemos } from "@/hooks/useMemos";
import { usePurchases } from "@/hooks/usePurchases";
import { useStatistics } from "@/hooks/useStatistics";

export function DashboardPage() {
  const { stats, loading } = useStatistics();
  const { thisMonthSpend } = usePurchases();
  const { memos, add: addMemo } = useMemos();
  const { openModal } = useAddMarkerModal();
  const navigate = useNavigate();
  const [memoOpen, setMemoOpen] = useState(false);

  if (loading || !stats) {
    return <p className="text-sm text-muted">加载中…</p>;
  }

  const pieTotal = stats.inventoryPie.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <PageHeader
        title="欢迎回来！✏️"
        description="今天的收藏、低库存和快捷操作都放在这张工作页。"
        meta={`更新：${new Date().toLocaleString("zh-CN", { hour12: false })}`}
      />

      <StatsGrid
        items={[
          {
            label: "我的马克笔总数",
            value: `${stats.totalStock} 支`,
            sub: `在库 ${stats.totalStock} · 借出 ${stats.totalBorrowed}`,
            icon: "✏️",
          },
          {
            label: "品牌数量",
            value: `${stats.brandCount} 个`,
            sub: `系列数量 ${stats.seriesCount}`,
            icon: "🏷️",
          },
          {
            label: "颜色数量",
            value: `${stats.colorCount} 种`,
            sub: `共 ${stats.colorCount} 个品种`,
            icon: "🎨",
          },
          {
            label: "总价值（估算）",
            value: `¥ ${stats.totalValue.toLocaleString()}`,
            sub: `本月购入 ¥ ${thisMonthSpend}`,
            icon: "💰",
          },
        ]}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentMarkersList markers={stats.recent} />
        </div>
        <div className="lg:col-span-2">
          <ColorSwatchPanel />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <InventoryPieChart
            data={stats.inventoryPie}
            totalLabel={`合计 ${pieTotal} 支`}
            compact
          />
        </div>
        <div className="lg:col-span-3">
          <LowStockList markers={stats.lowStockMarkers.slice(0, 5)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <Card className="p-3 lg:col-span-3" enterDelay={480}>
          <div className="mb-2.5 text-[15px] font-bold">快捷操作</div>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Plus, label: "添加马克笔", action: openModal },
              { icon: Archive, label: "批量导入", action: () => navigate("/export") },
              { icon: BookOpen, label: "扫码记录", action: () => navigate("/library") },
              { icon: Heart, label: "心愿清单", action: () => navigate("/wishlist") },
              { icon: BarChart2, label: "统计分析", action: () => navigate("/stats") },
            ].map(({ icon: Icon, label, action }) => (
              <Button
                key={label}
                className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs"
                onClick={action}
              >
                <Icon size={20} strokeWidth={2} />
                <span>{label}</span>
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-3 lg:col-span-2" enterDelay={560}>
          <div className="mb-2 text-[15px] font-bold">备忘录</div>
          <div className="text-[13px] leading-loose">
            {memos.map((t, i) => (
              <div
                key={i}
                className={i < memos.length - 1 ? "marker-record-row pb-0.5" : ""}
              >
                {t}
              </div>
            ))}
          </div>
          <Button size="sm" className="mt-2" onClick={() => setMemoOpen(true)}>
            + 添加备注
          </Button>
        </Card>
      </div>

      <AddMemoModal open={memoOpen} onClose={() => setMemoOpen(false)} onSubmit={addMemo} />
    </div>
  );
}
