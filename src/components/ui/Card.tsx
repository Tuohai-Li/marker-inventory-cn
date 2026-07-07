import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { RoughBox } from "./sketch/RoughBox";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "flat" | "dashed";
  /** @deprecated 卡片入场淡入已取消（翻页动画本身就是过渡），此参数保留但不再生效 */
  enterDelay?: number;
  hoverLift?: boolean;
  children: ReactNode;
}

export function Card({
  variant = "elevated",
  className,
  children,
  enterDelay: _enterDelay,
  hoverLift = true,
  ...props
}: CardProps) {
  if (variant === "dashed") {
    return (
      <div
        className={cn(
          "rounded-sm border-2 border-dashed border-ink bg-paper",
          hoverLift && "sketch-hover-lift",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <RoughBox
      variant={variant === "flat" ? "flat" : "card"}
      className={className}
      hoverLift={hoverLift}
      {...props}
    >
      {children}
    </RoughBox>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-b-2 border-ink pb-1.5 mb-2.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
