import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { roughContentInset, useRoughCanvas, type RoughVariant } from "./useRoughCanvas";

interface RoughBoxProps {
  variant?: RoughVariant;
  fill?: string;
  hoverLift?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Layer 1 容器：静态 Rough 边框 + 可交互内容层 */
export function RoughBox({
  variant = "card",
  fill,
  hoverLift = false,
  className,
  style,
  children,
  ...props
}: RoughBoxProps & HTMLAttributes<HTMLDivElement>) {
  const ref = useRoughCanvas({ variant, fill });

  return (
    <div
      ref={ref}
      className={cn("relative", hoverLift && "sketch-hover-lift", className)}
      style={style}
      {...props}
    >
      <div className={cn("relative z-10 h-full w-full", roughContentInset(variant, fill ?? undefined))}>
        {children}
      </div>
    </div>
  );
}
