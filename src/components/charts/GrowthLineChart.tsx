import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LinePoint } from "@/types";
import { Card } from "@/components/ui/Card";
import { chartAxisTick, chartTooltipStyle } from "./ChartTooltip";

interface GrowthLineChartProps {
  data: LinePoint[];
  title?: string;
  height?: number;
  domain?: [number, number];
}

export function GrowthLineChart({
  data,
  title = "收藏增长趋势（2024年）",
  height = 160,
  domain = [260, 340],
}: GrowthLineChartProps) {
  return (
    <Card className="p-3.5">
      <div className="mb-2 text-[15px] font-bold">{title}</div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 2" stroke="#c8b890" />
          <XAxis
            dataKey="month"
            tick={{ ...chartAxisTick, fontSize: 12 }}
            axisLine={{ stroke: "var(--sketch-ink)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ ...chartAxisTick, fontSize: 12 }}
            axisLine={{ stroke: "var(--sketch-ink)" }}
            tickLine={false}
            domain={domain}
          />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--sketch-ink)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--sketch-paper)", stroke: "var(--sketch-ink)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
