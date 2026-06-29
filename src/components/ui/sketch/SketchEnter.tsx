import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

type SketchEnterVariant = "up" | "fade" | "scale";

interface SketchEnterProps {
  children: ReactNode;
  /** 入场延迟 (ms) */
  delay?: number;
  variant?: SketchEnterVariant;
  className?: string;
  style?: CSSProperties;
}

const variantClass: Record<SketchEnterVariant, string> = {
  up: "sketch-enter",
  fade: "sketch-enter-fade",
  scale: "sketch-enter-scale",
};

/** Layer 2：纯 CSS 入场动画，不触发 Rough.js 重绘 */
export function SketchEnter({
  children,
  delay = 0,
  variant = "up",
  className,
  style,
}: SketchEnterProps) {
  return (
    <div
      className={cn(variantClass[variant], className)}
      style={{ animationDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}
