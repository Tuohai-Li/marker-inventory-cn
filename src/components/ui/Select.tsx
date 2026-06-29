import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { RoughBox } from "./sketch/RoughBox";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <RoughBox variant="input" className="w-full">
      <select
        className={cn(
          "w-full appearance-none bg-transparent px-2.5 py-1.5 text-sm font-sketch outline-none",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </RoughBox>
  );
}
