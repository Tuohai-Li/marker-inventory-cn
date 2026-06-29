import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  accentColor?: string;
  className?: string;
  centered?: boolean;
  enterDelay?: number;
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  accentColor,
  className,
  centered,
  enterDelay,
}: StatCardProps) {
  const accentStyle: CSSProperties | undefined = accentColor
    ? { boxShadow: `inset 4px 0 0 ${accentColor}` }
    : undefined;

  return (
    <Card
      className={cn("p-3", centered && "text-center", className)}
      style={accentStyle}
      enterDelay={enterDelay}
    >
      <div className="mb-1 text-[11px] text-muted">{label}</div>
      <div className={cn("flex items-end justify-between", centered && "justify-center")}>
        <div
          className="text-[26px] font-bold leading-none"
          style={accentColor ? { color: accentColor } : undefined}
        >
          {value}
        </div>
        {icon && <span className="text-[22px]">{icon}</span>}
      </div>
      {sub && <div className="mt-1 text-[11px] text-muted">{sub}</div>}
    </Card>
  );
}

interface StatsGridProps {
  items: StatCardProps[];
  columns?: 3 | 4;
  className?: string;
}

export function StatsGrid({ items, columns = 4, className }: StatsGridProps) {
  return (
    <div
      className={cn(
        "mb-4 grid gap-3",
        columns === 4 ? "grid-cols-4" : "grid-cols-3",
        className,
      )}
    >
      {items.map((item, index) => (
        <StatCard
          key={item.label}
          {...item}
          centered={item.centered ?? columns !== 4}
          enterDelay={item.enterDelay ?? index * 90}
        />
      ))}
    </div>
  );
}
