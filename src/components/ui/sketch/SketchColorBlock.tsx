import { useCallback, useLayoutEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { useSketchWhenVisible } from "@/hooks/useSketchWhenVisible";
import { describeRectBorderPath, drawRoughHachureBlock } from "@/lib/roughDraw";
import { SKETCH_INK } from "@/lib/sketchColors";

interface SketchColorBlockProps {
  color: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
  /** Layer 3：SVG path 描边动画 + 描边完成后斜线填充淡入 */
  inkFill?: boolean;
}

const VIEW_W = 80;
const VIEW_H = 56;
const BORDER_PAD = 1.5;

export function SketchColorBlock({
  color,
  className,
  style,
  title,
  inkFill = true,
}: SketchColorBlockProps) {
  const fillRef = useRef<SVGGElement>(null);
  const paintedRef = useRef("");
  const {
    ref: visibleRef,
    visible,
    revealKey,
  } = useSketchWhenVisible<HTMLDivElement>();

  const setWrapperRef = useCallback(
    (node: HTMLDivElement | null) => {
      visibleRef(node);
    },
    [visibleRef],
  );

  useLayoutEffect(() => {
    const g = fillRef.current;
    if (!g) return;
    if (paintedRef.current === color) return;
    paintedRef.current = color;
    drawRoughHachureBlock(g, VIEW_W, VIEW_H, color, {
      withBorder: !inkFill,
      withPaper: true,
    });
  }, [color, inkFill]);

  const borderPath = describeRectBorderPath(VIEW_W, VIEW_H, BORDER_PAD);

  return (
    <div ref={setWrapperRef} className="relative inline-block" style={{ lineHeight: 0 }}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        title={title}
        className={className}
        style={{ display: "block", flexShrink: 0, ...style }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={title ? undefined : true}
      >
        <g
          ref={fillRef}
          className={cn(
            inkFill && "sketch-fill-after-stroke",
            inkFill && visible && "sketch-fill-revealed",
          )}
        />
        {inkFill && visible && (
          <path
            key={revealKey}
            d={borderPath}
            pathLength={1}
            fill="none"
            stroke={SKETCH_INK}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="sketch-stroke-draw"
          />
        )}
      </svg>
    </div>
  );
}
