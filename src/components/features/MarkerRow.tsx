import type { MarkerWithBrand } from "@/types";
import { SketchColorBlock } from "@/components/ui/sketch/SketchColorBlock";
import { cn } from "@/lib/cn";

interface MarkerRowProps {
  marker: MarkerWithBrand;
  onClick?: () => void;
  showSeries?: boolean;
  showStock?: boolean;
  className?: string;
}

export function MarkerRow({
  marker,
  onClick,
  showSeries,
  showStock,
  className,
}: MarkerRowProps) {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2.5 border-b border-dashed border-[#c8b890] py-1.5 last:border-b-0",
        className,
      )}
      onClick={onClick}
    >
      <SketchColorBlock color={marker.color} style={{ width: 32, height: 20 }} />
      <span className="w-20 shrink-0 text-[13px] text-muted">{marker.brandName}</span>
      <span className="w-9 text-sm font-bold">{marker.code}</span>
      <span className="flex-1 text-[13px]">{marker.name}</span>
      {showSeries && (
        <span className="rounded-full border border-ink px-2 py-0.5 text-[11px] text-muted">
          {marker.series} 系列
        </span>
      )}
      {showStock && (
        <span
          className={cn(
            "text-[13px] font-bold",
            marker.stock <= 1 ? "text-destructive" : "text-[#c87050]",
          )}
        >
          剩 {marker.stock} 支
        </span>
      )}
      <span className="text-[11px] text-muted">{marker.addDate}</span>
    </div>
  );
}
