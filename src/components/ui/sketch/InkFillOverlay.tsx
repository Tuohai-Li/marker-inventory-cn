import { cn } from "@/lib/cn";

interface InkFillOverlayProps {
  color: string;
  delay?: number;
  className?: string;
}

/** Layer 3：墨水扩散覆盖层，仅 DOM/CSS，不触碰 Rough 画布 */
export function InkFillOverlay({ color, delay = 0, className }: InkFillOverlayProps) {
  return (
    <div
      className={cn("sketch-ink-fill", className)}
      style={{
        backgroundColor: color,
        animationDelay: `${delay}ms`,
      }}
      aria-hidden
    />
  );
}
