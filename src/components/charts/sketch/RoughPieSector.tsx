import { useCallback, useLayoutEffect, useRef } from "react";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import { cn } from "@/lib/cn";
import { useSketchWhenVisible } from "@/hooks/useSketchWhenVisible";
import { describePieSectorPath, describePieStrokeOverlay, drawRoughPieSector } from "@/lib/roughDraw";
import { SKETCH_INK } from "@/lib/sketchColors";

function sectorColor(props: PieSectorDataItem) {
  const payload = props.payload as { fill?: string } | undefined;
  return payload?.fill ?? props.fill ?? "#8090a0";
}

interface RoughPieSectorProps extends PieSectorDataItem {
  variant?: "default" | "tidy";
  /** @deprecated 入场动画已取消，参数保留但不再生效 */
  enterDelay?: number;
  /** Layer 3：简洁 SVG 描边 overlay（非 Rough） */
  strokeOverlay?: boolean;
}

export function RoughPieSector({
  variant = "default",
  enterDelay: _enterDelay,
  strokeOverlay = false,
  ...props
}: RoughPieSectorProps) {
  const color = sectorColor(props);
  const pathD = describePieSectorPath(props);
  const strokePathD = describePieStrokeOverlay(props);
  const roughRef = useRef<SVGGElement>(null);
  const paintedKeyRef = useRef("");
  const { ref: sectorRef, visible } = useSketchWhenVisible<SVGGElement>();

  const setSectorRef = useCallback(
    (node: SVGGElement | null) => {
      sectorRef(node);
    },
    [sectorRef],
  );

  useLayoutEffect(() => {
    const g = roughRef.current;
    if (!g) return;

    const paintKey = `${variant}|${color}|${pathD}`;
    if (paintKey === paintedKeyRef.current) return;
    paintedKeyRef.current = paintKey;

    drawRoughPieSector(g, pathD, color, { variant });
  }, [pathD, color, variant]);

  return (
    <g ref={setSectorRef} className={cn("recharts-sector")}>
      <g
        ref={roughRef}
        className={cn(
          strokeOverlay && "sketch-fill-after-stroke pie-fill-after-stroke",
          strokeOverlay && visible && "sketch-fill-revealed",
        )}
      />
      {strokeOverlay && (
        <path
          d={strokePathD}
          pathLength={1}
          fill="none"
          stroke={SKETCH_INK}
          strokeWidth={1.5}
          strokeLinecap="round"
          className="sketch-stroke-draw pie-stroke-overlay"
        />
      )}
    </g>
  );
}
