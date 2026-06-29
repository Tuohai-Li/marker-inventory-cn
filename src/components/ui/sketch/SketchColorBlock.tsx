import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { drawRoughHachureBlock } from "@/lib/roughDraw";
import { SKETCH_PAPER } from "@/lib/sketchColors";
import { InkFillOverlay } from "./InkFillOverlay";

interface SketchColorBlockProps {
  color: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
  inkFill?: boolean;
}

const VIEW_W = 80;
const VIEW_H = 56;

export function SketchColorBlock({
  color,
  className,
  style,
  title,
  inkFill = true,
}: SketchColorBlockProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const paintedRef = useRef("");

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (paintedRef.current === color) return;
    paintedRef.current = color;
    drawRoughHachureBlock(svg, VIEW_W, VIEW_H, color, { withBorder: true, withPaper: true });
  }, [color]);

  return (
    <div className="relative inline-block" style={{ lineHeight: 0 }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        title={title}
        className={className}
        style={{ display: "block", flexShrink: 0, ...style }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={title ? undefined : true}
      >
        <rect width={VIEW_W} height={VIEW_H} fill={SKETCH_PAPER} />
      </svg>
      {inkFill && <InkFillOverlay color={color} />}
    </div>
  );
}
