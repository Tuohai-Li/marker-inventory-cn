import { cn } from "@/lib/cn";
import { TRACK_STROKE_WIDTH } from "@/lib/sketchColors";
import { RoughBox } from "@/components/ui/sketch/RoughBox";
import { RoughHachureRect } from "./RoughHachureRect";

interface RoughChartBarProps {
  color: string;
  percent: number;
  height?: number;
  className?: string;
}

export function RoughChartBar({ color, percent, height = 16, className }: RoughChartBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const inset = TRACK_STROKE_WIDTH;

  return (
    <RoughBox
      variant="track"
      className={cn("block w-full", className)}
      style={{ height, minHeight: height }}
    >
      <div
        className="absolute z-10 overflow-hidden transition-[width] duration-300"
        style={{
          top: inset,
          bottom: inset,
          left: inset,
          width:
            clamped > 0
              ? `max(2px, calc((100% - ${inset * 2}px) * ${clamped / 100}))`
              : 0,
        }}
      >
        <RoughHachureRect color={color} withBorder={false} withPaper={false} />
      </div>
    </RoughBox>
  );
}
