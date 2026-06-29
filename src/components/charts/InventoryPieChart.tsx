import { Pie, PieChart, Tooltip } from "recharts";
import type { ChartSlice } from "@/types";
import { RoughChartSwatch } from "@/components/charts/sketch/RoughChartSwatch";
import { RoughPieSector } from "@/components/charts/sketch/RoughPieSector";
import { Card } from "@/components/ui/Card";
import { chartTooltipStyle } from "./ChartTooltip";

interface InventoryPieChartProps {
  data: ChartSlice[];
  title?: string;
  totalLabel?: string;
  compact?: boolean;
}

export function InventoryPieChart({
  data,
  title = "库存状态",
  totalLabel,
  compact,
}: InventoryPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="p-3" enterDelay={320}>
      <div className="mb-1 text-[15px] font-bold">{title}</div>
      <div className="flex items-center gap-2">
        <PieChart width={compact ? 130 : 150} height={compact ? 130 : 150}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={compact ? 35 : 40}
            outerRadius={compact ? 58 : 70}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
            isAnimationActive={false}
            activeShape={(props) => (
              <RoughPieSector
                {...props}
                variant="tidy"
                enterDelay={Math.max(0, (props.startAngle ?? 0) * 1.2)}
                strokeOverlay
              />
            )}
            activeIndex={data.map((_, i) => i)}
          />
          {!compact && <Tooltip contentStyle={chartTooltipStyle} />}
        </PieChart>
        <div className="flex flex-col gap-1 text-[11px]">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <RoughChartSwatch color={d.fill} size={10} title={d.name} />
              <span>{d.name}</span>
              <span className="text-muted">{d.value}支</span>
            </div>
          ))}
        </div>
      </div>
      {totalLabel && (
        <div className="mt-1 border-t border-dashed border-ink pt-1.5 text-center text-[11px] text-muted">
          {totalLabel ?? `合计 ${total} 支`}
        </div>
      )}
    </Card>
  );
}
