import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SeriesBarItem } from "@/types";
import { RoughBarShape } from "@/components/charts/sketch/RoughBarShape";
import { Card } from "@/components/ui/Card";
import { chartAxisTick, chartTooltipStyle } from "./ChartTooltip";

interface SeriesBarChartProps {
  data: SeriesBarItem[];
  title?: string;
  height?: number;
}

export function SeriesBarChart({
  data,
  title = "系列颜色分布",
  height = 200,
}: SeriesBarChartProps) {
  const chartData = data.map((d) => ({ ...d, fill: "#8090a0" }));

  return (
    <Card className="p-3.5">
      <div className="mb-2 text-[15px] font-bold">{title}</div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} barSize={18}>
          <CartesianGrid strokeDasharray="4 2" stroke="#c8b890" />
          <XAxis
            dataKey="series"
            tick={chartAxisTick}
            axisLine={{ stroke: "var(--sketch-ink)" }}
            tickLine={false}
          />
          <YAxis
            tick={chartAxisTick}
            axisLine={{ stroke: "var(--sketch-ink)" }}
            tickLine={false}
          />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar
            dataKey="count"
            fill="transparent"
            stroke="none"
            isAnimationActive={false}
            shape={(props) => <RoughBarShape {...props} />}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
