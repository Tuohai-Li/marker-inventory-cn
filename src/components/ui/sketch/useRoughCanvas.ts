import { useEffect, useRef } from "react";
import { mountCachedRoughRect } from "@/lib/rough/roughStaticRenderer";
import { SKETCH_INK } from "@/lib/sketchColors";
import {
  ROUGH_CONTENT_INSET,
  SINGLE_STROKE,
  variantOptions,
  type RoughVariant,
} from "@/lib/rough/roughConfig";

export type { RoughVariant } from "@/lib/rough/roughConfig";
export { ROUGH_CONTENT_INSET } from "@/lib/rough/roughConfig";

interface UseRoughCanvasOptions {
  variant?: RoughVariant;
  fill?: string;
}

/**
 * Layer 1：静态 Rough.js 渲染
 * - 仅尺寸/参数变化时重绘
 * - 使用形状缓存，禁止在 rAF 循环中调用 Rough.js
 */
export function useRoughCanvas({ variant = "card", fill }: UseRoughCanvasOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lastKeyRef = useRef("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let svg = svgRef.current;
    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "pointer-events-none absolute inset-0 h-full w-full overflow-visible");
      svg.setAttribute("aria-hidden", "true");
      svg.style.zIndex = "0";
      container.prepend(svg);
      svgRef.current = svg;
    }

    let retryTimer = 0;
    let retries = 0;

    const paint = () => {
      if (!svg || !container) return;

      const { width, height } = container.getBoundingClientRect();
      if ((width === 0 || height === 0) && retries < 12) {
        retries += 1;
        retryTimer = window.setTimeout(paint, 32);
        return;
      }
      if (width === 0 || height === 0) return;

      const opts = variantOptions[variant];
      const pad = opts.strokeWidth / 2;
      const resolvedFill = fill ?? opts.fill;
      const rectW = width - opts.strokeWidth;
      const rectH = height - opts.strokeWidth;
      const cacheKey = `${variant}|${resolvedFill}|${Math.round(rectW)}|${Math.round(rectH)}`;

      if (cacheKey === lastKeyRef.current && svg.childNodes.length > 0) return;
      lastKeyRef.current = cacheKey;

      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

      mountCachedRoughRect(svg, pad, pad, rectW, rectH, {
        ...opts,
        ...SINGLE_STROKE,
        fill: resolvedFill,
        stroke: SKETCH_INK,
      });
    };

    paint();

    const observer = new ResizeObserver(() => {
      retries = 0;
      paint();
    });
    observer.observe(container);

    return () => {
      window.clearTimeout(retryTimer);
      observer.disconnect();
      lastKeyRef.current = "";
    };
  }, [variant, fill]);

  return containerRef;
}

export function roughContentInset(variant: RoughVariant, fill?: string) {
  if (fill && fill !== "none") return undefined;
  return ROUGH_CONTENT_INSET[variant];
}
