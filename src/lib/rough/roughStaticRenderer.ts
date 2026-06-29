import rough from "roughjs/bin/rough";
import { SKETCH_INK, SKETCH_PAPER } from "@/lib/sketchColors";
import { getOrCloneCachedRoughElement, roughCacheKey } from "./roughCache";
import { SINGLE_STROKE } from "./roughConfig";

export type RoughSvg = ReturnType<typeof rough.svg>;

export function colorSeed(value: string) {
  return value.split("").reduce((a, c) => a * 31 + c.charCodeAt(0), 0) % 2147483647;
}

function createTempSvg() {
  return document.createElementNS("http://www.w3.org/2000/svg", "svg");
}

function mountToSvg(target: SVGSVGElement, element: Element) {
  target.replaceChildren(element);
}

/** 缓存并挂载矩形 Rough 形状（静态层，仅尺寸/参数变化时重新生成） */
export function mountCachedRoughRect(
  target: SVGSVGElement,
  x: number,
  y: number,
  w: number,
  h: number,
  options: Parameters<RoughSvg["rectangle"]>[4],
) {
  const rw = Math.round(w);
  const rh = Math.round(h);
  const key = roughCacheKey({
    type: "rect",
    x: Math.round(x),
    y: Math.round(y),
    w: rw,
    h: rh,
    opt: JSON.stringify(options),
  });

  const node = getOrCloneCachedRoughElement(key, () => {
    const temp = createTempSvg();
    const rc = rough.svg(temp);
    return rc.rectangle(x, y, w, h, options);
  });

  mountToSvg(target, node);
}

interface HachureBlockOptions {
  withBorder?: boolean;
  withPaper?: boolean;
}

/** 缓存并挂载手绘斜线色块 */
export function mountCachedHachureBlock(
  target: SVGSVGElement,
  width: number,
  height: number,
  color: string,
  options: HachureBlockOptions = {},
) {
  const rw = Math.round(width);
  const rh = Math.round(height);
  if (rw <= 0 || rh <= 0) return;

  const { withBorder = false, withPaper = true } = options;
  const key = roughCacheKey({
    type: "hachure",
    w: rw,
    h: rh,
    color,
    withBorder,
    withPaper,
  });

  const node = getOrCloneCachedRoughElement(key, () => {
    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const temp = createTempSvg();
    const rc = rough.svg(temp);
    const seed = colorSeed(color);
    const pad = withBorder ? 1.5 : 0;
    const w = rw - pad * 2;
    const h = rh - pad * 2;
    if (w <= 0 || h <= 0) return wrapper;

    const compact = rh < 14;
    const gap = compact ? 3 : 4.5;
    const weight = compact ? 1.6 : 2.2;

    if (withPaper) {
      wrapper.appendChild(
        rc.rectangle(pad, pad, w, h, {
          seed,
          roughness: 0.9,
          bowing: 0.7,
          strokeWidth: 0,
          fill: SKETCH_PAPER,
          fillStyle: "solid",
          ...SINGLE_STROKE,
        }),
      );
    }

    const inset = withPaper ? 1 : 0;
    wrapper.appendChild(
      rc.rectangle(pad + inset, pad + inset, Math.max(w - inset * 2, 1), Math.max(h - inset * 2, 1), {
        seed: seed + 1,
        roughness: 1.4,
        bowing: 1.1,
        strokeWidth: 0,
        fill: color,
        fillStyle: "zigzag",
        hachureGap: gap,
        fillWeight: weight,
        ...SINGLE_STROKE,
      }),
    );

    if (withBorder) {
      wrapper.appendChild(
        rc.rectangle(pad, pad, w, h, {
          seed: seed + 2,
          roughness: 1.2,
          bowing: 1,
          strokeWidth: compact ? 1.2 : 1.5,
          stroke: SKETCH_INK,
          fill: "none",
          ...SINGLE_STROKE,
        }),
      );
    }

    return wrapper;
  });

  mountToSvg(target, node);
}

const PIE_FILL_PRESETS = {
  default: {
    fillStyle: "zigzag" as const,
    roughness: 1.2,
    bowing: 1,
    hachureGap: 5,
    fillWeight: 2,
    hachureAngle: -41,
  },
  tidy: {
    fillStyle: "hachure" as const,
    roughness: 0.45,
    bowing: 0.35,
    hachureGap: 4,
    fillWeight: 1.5,
    hachureAngle: 45,
  },
};

/** 缓存并挂载饼图扇区（静态 Rough 层） */
export function mountCachedPieSector(
  target: SVGGElement,
  pathD: string,
  color: string,
  variant: "default" | "tidy" = "default",
) {
  const preset = PIE_FILL_PRESETS[variant];
  const key = roughCacheKey({ type: "pie", pathD, color, variant });

  const node = getOrCloneCachedRoughElement(key, () => {
    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const temp = createTempSvg();
    const rc = rough.svg(temp);
    const seed = colorSeed(color);

    wrapper.appendChild(
      rc.path(pathD, {
        seed: seed + 1,
        roughness: preset.roughness,
        bowing: preset.bowing,
        stroke: "none",
        strokeWidth: 0,
        fill: color,
        fillStyle: preset.fillStyle,
        hachureAngle: preset.hachureAngle,
        hachureGap: preset.hachureGap,
        fillWeight: preset.fillWeight,
        ...SINGLE_STROKE,
      }),
    );

    wrapper.appendChild(
      rc.path(pathD, {
        seed: seed + 2,
        roughness: variant === "tidy" ? 0.65 : 0.8,
        bowing: variant === "tidy" ? 0.6 : 0.9,
        strokeWidth: 1.5,
        stroke: SKETCH_INK,
        fill: "none",
        ...SINGLE_STROKE,
      }),
    );

    return wrapper;
  });

  target.replaceChildren(...Array.from(node.childNodes).map((n) => n.cloneNode(true)));
}
