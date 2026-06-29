import { BrandBarChart } from "@/components/charts/BrandBarChart";
import { RoughChartBar } from "@/components/charts/sketch/RoughChartBar";
import { RecentMarkersList } from "@/components/features/RecentMarkersList";
import { Card } from "@/components/ui/Card";
import { StatsGrid } from "@/components/ui/StatCard";
import { useStatistics } from "@/hooks/useStatistics";

export function OverviewPage() {
  const { stats, loading } = useStatistics();

  if (loading || !stats) {
    return <p className="text-sm text-muted">加载中…</p>;
  }

  const maxSeriesCount = stats.seriesBreakdown[0]?.count ?? 1;

  return (
    <div>
      <h1 className="mb-4 text-[22px] font-bold">收藏总览 🗂️</h1>

      <StatsGrid
        columns={4}
        items={[
          { label: "马克笔总数", value: `${stats.totalStock} 支`, centered: true },
          { label: "品牌数", value: `${stats.brandCount} 个`, centered: true },
          { label: "颜色种数", value: `${stats.colorCount} 种`, centered: true },
          { label: "系列数", value: `${stats.seriesCount} 个`, centered: true },
        ]}
      />

      <div className="mb-4 grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <BrandBarChart data={stats.brandBar} />
        </div>
        <Card className="col-span-2 p-3.5">
          <div className="mb-2.5 text-[15px] font-bold">系列构成</div>
          {stats.seriesBreakdown.map((item) => (
            <div key={item.name} className="mb-2">
              <div className="mb-0.5 flex justify-between text-xs">
                <span>{item.name}</span>
                <span className="text-muted">{item.count} 支</span>
              </div>
              <RoughChartBar
                color={item.color}
                percent={Math.round((item.count / maxSeriesCount) * 100)}
                height={8}
              />
            </div>
          ))}
        </Card>
      </div>

      <RecentMarkersList markers={stats.recent} title="最近添加记录" showSeries />
    </div>
  );
}
