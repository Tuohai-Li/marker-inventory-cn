import { useLayoutEffect, useRef } from "react";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import { cn } from "@/lib/cn";
import { describePieSectorPath, describePieStrokeOverlay, drawRoughPieSector } from "@/lib/roughDraw";
import { SKETCH_INK } from "@/lib/sketchColors";

function sectorColor(props: PieSectorDataItem) {
  const payload = props.payload as { fill?: string } | undefined;
  return payload?.fill ?? props.fill ?? "#8090a0";
}

interface RoughPieSectorProps extends PieSectorDataItem {
  variant?: "default" | "tidy";
  /** Layer 2：CSS 入场延迟 */
  enterDelay?: number;
  /** Layer 3：简洁 SVG 描边 overlay（非 Rough） */
  strokeOverlay?: boolean;
}

export function RoughPieSector({
  variant = "default",
  enterDelay = 0,
  strokeOverlay = false,
  ...props
}: RoughPieSectorProps) {
  const color = sectorColor(props);
  const pathD = describePieSectorPath(props);
  const strokePathD = describePieStrokeOverlay(props);
  const roughRef = useRef<SVGGElement>(null);
  const paintedKeyRef = useRef("");

  useLayoutEffect(() => {
    const g = roughRef.current;
    if (!g) return;

    const paintKey = `${variant}|${color}|${pathD}`;
    if (paintKey === paintedKeyRef.current) return;
    paintedKeyRef.current = paintKey;

    drawRoughPieSector(g, pathD, color, { variant });
  }, [pathD, color, variant]);

  return (
    <g
      className={cn("recharts-sector sketch-enter-scale")}
      style={{ animationDelay: `${enterDelay}ms` }}
    >
      <g ref={roughRef} />
      {strokeOverlay && (
        <path
          d={strokePathD}
          fill="none"
          stroke={SKETCH_INK}
          strokeWidth={1.5}
          strokeLinecap="round"
          pathLength={100}
          className="pie-stroke-overlay"
          style={{ animationDelay: `${enterDelay}ms` }}
        />
      )}
    </g>
  );
}
