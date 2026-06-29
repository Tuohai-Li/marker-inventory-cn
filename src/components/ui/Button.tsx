import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { SKETCH_INK } from "@/lib/sketchColors";
import { cn } from "@/lib/cn";
import { RoughBox } from "./sketch/RoughBox";

const buttonVariants = cva(
  "inline-flex w-full items-center justify-center gap-1.5 border-0 bg-transparent font-sketch transition-opacity disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "text-primary-foreground hover:opacity-90",
        ghost: "text-foreground hover:opacity-80",
        destructive: "text-destructive hover:opacity-80",
      },
      size: {
        default: "px-3.5 py-1.5 text-sm",
        sm: "px-2.5 py-1 text-xs",
        lg: "px-4 py-2 text-base",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "default",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export function Button({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonProps) {
  const roughVariant = size === "sm" ? "buttonSm" : "button";
  const roughFill = variant === "primary" ? SKETCH_INK : "none";

  return (
    <RoughBox variant={roughVariant} fill={roughFill} className="inline-block">
      <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
        {children}
      </button>
    </RoughBox>
  );
}
