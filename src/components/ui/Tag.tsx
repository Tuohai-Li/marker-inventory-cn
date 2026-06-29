import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { SKETCH_SECONDARY } from "@/lib/sketchColors";
import { cn } from "@/lib/cn";
import { RoughBox } from "./sketch/RoughBox";

type TagVariant = "default" | "success" | "warning" | "high" | "medium" | "low";

const TAG_FILLS: Record<TagVariant, string> = {
  default: SKETCH_SECONDARY,
  success: "#d0f0d0",
  warning: "#f9d4cf",
  high: "none",
  medium: "none",
  low: "none",
};

const tagVariants = cva("inline-block bg-transparent px-2.5 py-0.5 text-xs font-sketch", {
  variants: {
    variant: {
      default: "text-foreground",
      success: "text-[#3a6a3a]",
      warning: "text-destructive",
      high: "text-destructive",
      medium: "text-[#c87050]",
      low: "text-[#8090a0]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface TagProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {}

export function Tag({ className, variant = "default", children, ...props }: TagProps) {
  const resolved = variant ?? "default";

  return (
    <RoughBox variant="tag" fill={TAG_FILLS[resolved]} className="inline-block">
      <span className={cn(tagVariants({ variant: resolved }), className)} {...props}>
        {children}
      </span>
    </RoughBox>
  );
}
