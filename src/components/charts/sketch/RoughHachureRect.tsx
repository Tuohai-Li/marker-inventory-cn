import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { drawRoughHachureBlock } from "@/lib/roughDraw";
import { SKETCH_PAPER } from "@/lib/sketchColors";

interface RoughHachureRectProps {
  color: string;
  className?: string;
  withBorder?: boolean;
  withPaper?: boolean;
}

export function RoughHachureRect({
  color,
  className,
  withBorder = false,
  withPaper = false,
}: RoughHachureRectProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastKeyRef = useRef("");

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    const paint = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;

      const key = `${Math.round(width)}|${Math.round(height)}|${color}|${withBorder}|${withPaper}`;
      if (key === lastKeyRef.current && svg.childNodes.length > 0) return;
      lastKeyRef.current = key;

      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      drawRoughHachureBlock(svg, width, height, color, { withBorder, withPaper });
    };

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(container);

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          lastKeyRef.current = "";
          paint();
        }
      },
      { threshold: 0.01 },
    );
    visibilityObserver.observe(container);

    const onPageFlipped = () => {
      requestAnimationFrame(() => {
        lastKeyRef.current = "";
        paint();
      });
    };
    window.addEventListener("book:page-flipped", onPageFlipped);
    window.addEventListener("book:page-ready", onPageFlipped);

    return () => {
      observer.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("book:page-flipped", onPageFlipped);
      window.removeEventListener("book:page-ready", onPageFlipped);
    };
  }, [color, withBorder, withPaper]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)}>
      <svg
        ref={svgRef}
        className="block h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="100%" height="100%" fill={withPaper ? SKETCH_PAPER : "transparent"} />
      </svg>
    </div>
  );
}
