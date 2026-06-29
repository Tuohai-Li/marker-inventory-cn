import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { RoughBox } from "./sketch/RoughBox";

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

export function SearchBar({ className, wrapperClassName, ...props }: SearchBarProps) {
  return (
    <RoughBox variant="input" className={cn("flex items-center gap-2 px-2.5 py-1", wrapperClassName)}>
      <Search size={14} strokeWidth={2} className="shrink-0 text-muted" />
      <input
        className={cn(
          "w-full bg-transparent text-sm font-sketch outline-none placeholder:text-muted",
          className,
        )}
        {...props}
      />
    </RoughBox>
  );
}
