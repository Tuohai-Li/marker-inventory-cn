import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";
import type { MarkerWithBrand } from "@/types";
import { RestockModal } from "@/components/features/RestockModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SketchColorBlock } from "@/components/ui/sketch/SketchColorBlock";
import { cn } from "@/lib/cn";

interface LowStockListProps {
  markers: MarkerWithBrand[];
  title?: string;
  showActions?: boolean;
  compact?: boolean;
}

export function LowStockList({
  markers,
  title = "库存预警（低于 3 支）",
  showActions,
  compact,
}: LowStockListProps) {
  const navigate = useNavigate();
  const [restockMarker, setRestockMarker] = useState<MarkerWithBrand | null>(null);

  return (
    <>
      <Card className="p-3" enterDelay={400}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} strokeWidth={2.5} />
            <span className="text-[15px] font-bold">{title}</span>
          </div>
          {!showActions && (
            <Button size="sm" onClick={() => navigate("/inventory")}>
              查看全部 →
            </Button>
          )}
        </div>
        {markers.length === 0 ? (
          <p className="text-sm text-muted">暂无低库存预警</p>
        ) : (
          markers.map((m, i) => (
            <div
              key={m.id}
              className={cn(
                "flex items-center gap-2 border-b border-dashed border-[#c8b890] py-1.5 last:border-b-0",
                compact ? "py-2" : "",
              )}
            >
              {!compact && (
                <span className="w-4 text-xs font-bold text-destructive">①</span>
              )}
              <SketchColorBlock
                color={m.color}
                style={{ width: compact ? 36 : 28, height: compact ? 22 : 16 }}
              />
              <span className="w-20 shrink-0 text-[13px] text-muted">{m.brandName}</span>
              <span className="w-11 text-sm font-bold">{m.code}</span>
              <span className="flex-1 text-[13px]">{m.name}</span>
              <span
                className={cn(
                  "text-[13px] font-bold",
                  m.stock <= 1 ? "text-destructive" : "text-[#c87050]",
                )}
              >
                {compact ? `剩余 ${m.stock} 支` : `剩 ${m.stock} 支`}
              </span>
              {showActions && (
                <Button size="sm" onClick={() => setRestockMarker(m)}>
                  + 补充
                </Button>
              )}
            </div>
          ))
        )}
      </Card>

      <RestockModal
        marker={restockMarker}
        open={restockMarker !== null}
        onClose={() => setRestockMarker(null)}
      />
    </>
  );
}
