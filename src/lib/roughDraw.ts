import { mountCachedHachureBlock, mountCachedPieSector, mountCachedRoughRect } from "./rough/roughStaticRenderer";
export type { RoughSvg } from "./rough/roughStaticRenderer";
export { colorSeed } from "./rough/roughStaticRenderer";
export { mountCachedHachureBlock, mountCachedPieSector, mountCachedRoughRect } from "./rough/roughStaticRenderer";
export { clearRoughCache, roughCacheKey } from "./rough/roughCache";

const RADIAN = Math.PI / 180;

/** @deprecated 请使用 mountCachedRoughRect */
export function appendRoughRect() {
  /* legacy */
}

/** 在 SVG 内绘制手绘斜线色块（静态缓存） */
export function drawRoughHachureBlock(
  svg: SVGSVGElement,
  width: number,
  height: number,
  color: string,
  options: { withBorder?: boolean; withPaper?: boolean } = {},
) {
  mountCachedHachureBlock(svg, width, height, color, options);
}

/** 生成 recharts 扇区 path（与 Sector 一致） */
export function describePieSectorPath(props: {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
}) {
  const cx = props.cx ?? 0;
  const cy = props.cy ?? 0;
  const innerRadius = props.innerRadius ?? 0;
  const outerRadius = props.outerRadius ?? 0;
  const startAngle = props.startAngle ?? 0;
  const endAngle = props.endAngle ?? 0;

  const outerStartX = cx + outerRadius * Math.cos(-startAngle * RADIAN);
  const outerStartY = cy + outerRadius * Math.sin(-startAngle * RADIAN);
  const outerEndX = cx + outerRadius * Math.cos(-endAngle * RADIAN);
  const outerEndY = cy + outerRadius * Math.sin(-endAngle * RADIAN);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  if (innerRadius > 0) {
    const innerStartX = cx + innerRadius * Math.cos(-endAngle * RADIAN);
    const innerStartY = cy + innerRadius * Math.sin(-endAngle * RADIAN);
    const innerEndX = cx + innerRadius * Math.cos(-startAngle * RADIAN);
    const innerEndY = cy + innerRadius * Math.sin(-startAngle * RADIAN);
    return [
      `M ${outerStartX},${outerStartY}`,
      `A ${outerRadius},${outerRadius},0,${largeArc},0,${outerEndX},${outerEndY}`,
      `L ${innerStartX},${innerStartY}`,
      `A ${innerRadius},${innerRadius},0,${largeArc},1,${innerEndX},${innerEndY}`,
      "Z",
    ].join(" ");
  }

  return [
    `M ${cx},${cy}`,
    `L ${outerStartX},${outerStartY}`,
    `A ${outerRadius},${outerRadius},0,${largeArc},0,${outerEndX},${outerEndY}`,
    "Z",
  ].join(" ");
}

/** 在 <g> 内绘制手绘扇区（静态缓存，无动画） */
export function drawRoughPieSector(
  g: SVGGElement,
  pathD: string,
  color: string,
  options: { variant?: "default" | "tidy" } = {},
) {
  mountCachedPieSector(g, pathD, color, options.variant ?? "default");
}

/** Layer 3：简洁弧线路径，供 SVG stroke-dash 描边 overlay 使用（非 Rough） */
export function describePieStrokeOverlay(props: {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
}) {
  const cx = props.cx ?? 0;
  const cy = props.cy ?? 0;
  const innerRadius = props.innerRadius ?? 0;
  const outerRadius = props.outerRadius ?? 0;
  const startAngle = props.startAngle ?? 0;
  const endAngle = props.endAngle ?? 0;
  const midRadius = innerRadius > 0 ? (innerRadius + outerRadius) / 2 : outerRadius * 0.85;
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  const sx = cx + midRadius * Math.cos(-startAngle * RADIAN);
  const sy = cy + midRadius * Math.sin(-startAngle * RADIAN);
  const ex = cx + midRadius * Math.cos(-endAngle * RADIAN);
  const ey = cy + midRadius * Math.sin(-endAngle * RADIAN);

  return `M ${sx},${sy} A ${midRadius},${midRadius},0,${largeArc},0,${ex},${ey}`;
}
