import { useLayoutEffect, useRef } from "react";
import { drawRoughHachureBlock } from "@/lib/roughDraw";

interface RoughBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  payload?: { fill?: string };
}

export function RoughBarShape(props: RoughBarShapeProps) {
  const { x = 0, y = 0, width = 0, height = 0, fill, payload } = props;
  const color = payload?.fill ?? fill ?? "#8090a0";
  const svgRef = useRef<SVGSVGElement>(null);
  const lastKeyRef = useRef("");

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg || width <= 0 || height <= 0) return;

    const key = `${Math.round(width)}|${Math.round(height)}|${color}`;
    if (key === lastKeyRef.current && svg.childNodes.length > 0) return;
    lastKeyRef.current = key;

    drawRoughHachureBlock(svg, width, height, color, { withBorder: true, withPaper: false });
  }, [width, height, color]);

  if (width <= 0 || height <= 0) return null;

  return (
    <g transform={`translate(${x},${y})`} className="sketch-enter-fade">
      <svg ref={svgRef} width={width} height={height} overflow="visible" aria-hidden />
    </g>
  );
}
