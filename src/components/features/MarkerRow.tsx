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
        "marker-record-row flex cursor-pointer items-center gap-2.5 py-2 font-ui",
        className,
      )}
      onClick={onClick}
    >
      <SketchColorBlock color={marker.color} style={{ width: 38, height: 24 }} />
      <span className="w-20 shrink-0 text-[13px] text-muted">{marker.brandName}</span>
      <span className="record-code w-10 text-sm">{marker.code}</span>
      <span className="flex-1 text-[13px]">{marker.name}</span>
      {showSeries && (
        <span className="record-pill px-2 py-0.5 text-[11px]">
          {marker.series} 系列
        </span>
      )}
      {showStock && (
        <span
          className={cn(
            "record-pill px-2 py-0.5 text-[11px]",
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
