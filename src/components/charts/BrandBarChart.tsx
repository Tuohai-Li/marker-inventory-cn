import type { BrandBarItem } from "@/types";
import { RoughChartBar } from "@/components/charts/sketch/RoughChartBar";
import { Card } from "@/components/ui/Card";

interface BrandBarChartProps {
  data: BrandBarItem[];
  title?: string;
}

const BAR_COLORS = ["#8090a0", "#5a8c6a", "#c87050", "#9880c8", "#7aa8d0", "#d0a050"];

export function BrandBarChart({ data, title = "各品牌收藏量" }: BrandBarChartProps) {
  const maxCount = Math.max(...data.map((b) => b.count));

  return (
    <Card className="p-3.5">
      <div className="mb-3 text-[15px] font-bold">{title}</div>
      {data.map((d, i) => {
        const pct = Math.round((d.count / maxCount) * 100);
        return (
          <div key={d.brand} className="mb-2.5 flex items-center gap-2">
            <span className="w-[90px] shrink-0 text-right text-xs text-muted">{d.brand}</span>
            <div className="flex-1">
              <RoughChartBar color={BAR_COLORS[i % BAR_COLORS.length]} percent={pct} />
            </div>
            <span className="w-8 shrink-0 text-[13px] font-bold">{d.count}</span>
          </div>
        );
      })}
    </Card>
  );
}
