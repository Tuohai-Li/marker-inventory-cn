import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SketchEnter } from "./sketch/SketchEnter";
import { RoughBox } from "./sketch/RoughBox";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "flat" | "dashed";
  /** Layer 2：内容入场延迟 (ms)，Rough 边框保持静态 */
  enterDelay?: number;
  hoverLift?: boolean;
  children: ReactNode;
}

export function Card({
  variant = "elevated",
  className,
  children,
  enterDelay,
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
        {enterDelay !== undefined ? (
          <SketchEnter delay={enterDelay}>{children}</SketchEnter>
        ) : (
          children
        )}
      </div>
    );
  }

  const content =
    enterDelay !== undefined ? (
      <SketchEnter delay={enterDelay}>{children}</SketchEnter>
    ) : (
      children
    );

  return (
    <RoughBox
      variant={variant === "flat" ? "flat" : "card"}
      className={className}
      hoverLift={hoverLift}
      {...props}
    >
      {content}
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
