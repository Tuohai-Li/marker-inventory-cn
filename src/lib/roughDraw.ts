import { mountCachedHachureBlock, mountCachedPieSector, mountCachedRoughRect } from "./rough/roughStaticRenderer";
export type { RoughSvg } from "./rough/roughStaticRenderer";
export { colorSeed } from "./rough/roughStaticRenderer";
export { mountCachedHachureBlock, mountCachedPieSector, mountCachedRoughRect } from "./rough/roughStaticRenderer";
export { clearRoughCache, roughCacheKey } from "./rough/roughCache";
export { describeRectBorderPath } from "./describeRectBorderPath";

const RADIAN = Math.PI / 180;

/** @deprecated Use mountCachedRoughRect instead. */
export function appendRoughRect() {
  /* legacy */
}

export function drawRoughHachureBlock(
  target: SVGSVGElement | SVGGElement,
  width: number,
  height: number,
  color: string,
  options: { withBorder?: boolean; withPaper?: boolean } = {},
) {
  mountCachedHachureBlock(target, width, height, color, options);
}

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

export function drawRoughPieSector(
  g: SVGGElement,
  pathD: string,
  color: string,
  options: { variant?: "default" | "tidy" } = {},
) {
  mountCachedPieSector(g, pathD, color, options.variant ?? "default");
}
