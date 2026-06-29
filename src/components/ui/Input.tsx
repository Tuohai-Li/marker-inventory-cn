import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { RoughBox } from "./sketch/RoughBox";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <RoughBox variant="input" className="w-full">
      <input
        className={cn(
          "w-full bg-transparent px-2.5 py-1.5 text-sm font-sketch outline-none placeholder:text-muted",
          className,
        )}
        {...props}
      />
    </RoughBox>
  );
}
