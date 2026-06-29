import {
  SKETCH_INK,
  SKETCH_INPUT_BG,
  SKETCH_PAPER,
  SKETCH_SECONDARY,
} from "@/lib/sketchColors";

export type RoughVariant =
  | "card"
  | "flat"
  | "button"
  | "buttonSm"
  | "tag"
  | "input"
  | "modal"
  | "track";

export const SINGLE_STROKE = {
  disableMultiStroke: true,
  disableMultiStrokeFill: true,
} as const;

export const variantOptions: Record<
  RoughVariant,
  {
    roughness: number;
    bowing: number;
    strokeWidth: number;
    fill?: string;
    fillStyle?: "solid" | "hachure";
    hachureGap?: number;
  }
> = {
  card: { roughness: 0.5, bowing: 1.2, strokeWidth: 2, fill: SKETCH_PAPER, fillStyle: "solid" },
  flat: { roughness: 1.2, bowing: 1, strokeWidth: 2, fill: SKETCH_PAPER, fillStyle: "solid" },
  button: { roughness: 0.9, bowing: 1, strokeWidth: 2, fill: "none", fillStyle: "solid" },
  buttonSm: { roughness: 0.8, bowing: 0.9, strokeWidth: 1.5, fill: "none", fillStyle: "solid" },
  tag: { roughness: 1.3, bowing: 1.1, strokeWidth: 1.5, fill: "none", fillStyle: "solid" },
  input: { roughness: 1.2, bowing: 1, strokeWidth: 2, fill: SKETCH_INPUT_BG, fillStyle: "solid" },
  modal: { roughness: 1.5, bowing: 1.35, strokeWidth: 2.5, fill: SKETCH_PAPER, fillStyle: "solid" },
  track: { roughness: 0.5, bowing: 1, strokeWidth: 1.5, fill: SKETCH_SECONDARY, fillStyle: "solid" },
};

export const ROUGH_CONTENT_INSET: Partial<Record<RoughVariant, string>> = {
  button: "p-0.5",
  buttonSm: "p-[1.5px]",
  tag: "p-[1.5px]",
};
