import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { GrowthLineChart } from "@/components/charts/GrowthLineChart";
import { RoughPieSector } from "@/components/charts/sketch/RoughPieSector";
import { SeriesBarChart } from "@/components/charts/SeriesBarChart";
import { chartTooltipStyle } from "@/components/charts/ChartTooltip";
import { Card } from "@/components/ui/Card";
import { StatsGrid } from "@/components/ui/StatCard";
import { useBrands } from "@/hooks/useBrands";
import { useStatistics } from "@/hooks/useStatistics";

export function StatsPage() {
  const { stats, loading: statsLoading } = useStatistics();
  const { brands, loading: brandsLoading } = useBrands();

  if (statsLoading || brandsLoading || !stats) {
    return <p className="text-sm text-muted">加载中…</p>;
  }

  const brandPieData = brands
    .filter((b) => b.totalStock > 0)
    .map((b) => ({ name: b.name, value: b.totalStock, fill: b.color }));

  return (
    <div>
      <h1 className="mb-4 text-[22px] font-bold">统计分析 📊</h1>

      <StatsGrid
        columns={4}
        items={[
          { label: "总收藏数", value: `${stats.totalStock} 支`, centered: true },
          { label: "品牌数", value: `${stats.brandCount} 个`, centered: true },
          { label: "系列数", value: `${stats.seriesCount} 个`, centered: true },
          { label: "总价值", value: `¥ ${stats.totalValue.toLocaleString()}`, centered: true },
        ]}
      />

      <div className="mb-4 grid grid-cols-2 gap-4">
        <Card className="p-3.5" enterDelay={200}>
          <div className="mb-2 text-[15px] font-bold">品牌分布（按库存支数）</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={brandPieData}
                cx="50%"
                cy="50%"
                outerRadius={75}
                dataKey="value"
                paddingAngle={2}
                stroke="none"
                isAnimationActive={false}
                activeShape={(props) => (
                  <RoughPieSector
                    {...props}
                    enterDelay={Math.max(0, (props.startAngle ?? 0) * 1.2)}
                    strokeOverlay
                  />
                )}
                activeIndex={brandPieData.map((_, i) => i)}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
              />
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <SeriesBarChart data={stats.seriesBar} />
      </div>

      <GrowthLineChart data={stats.growthLine} />
    </div>
  );
}
