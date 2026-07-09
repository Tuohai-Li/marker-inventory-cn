import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  meta,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("page-header", className)}>
      <div className="min-w-0">
        <h1 className="page-title">{title}</h1>
        {description && <div className="page-kicker">{description}</div>}
      </div>
      {(meta || actions) && (
        <div className="flex shrink-0 items-center gap-2 pt-0.5 font-hand">
          {meta && <div className="record-pill px-2.5 py-1 text-[12px]">{meta}</div>}
          {actions}
        </div>
      )}
    </div>
  );
}
