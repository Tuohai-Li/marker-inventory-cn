/** 矩形周长路径，供 Layer 3 SVG stroke-dash 描边动画使用 */
export function describeRectBorderPath(
  width: number,
  height: number,
  pad = 1.5,
): string {
  const x = pad;
  const y = pad;
  const w = width - pad * 2;
  const h = height - pad * 2;
  return `M ${x},${y} H ${x + w} V ${y + h} H ${x} Z`;
}
