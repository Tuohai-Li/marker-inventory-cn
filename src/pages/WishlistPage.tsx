import { useState } from "react";
import { CheckSquare, Square } from "lucide-react";
import { AddWishModal } from "@/components/features/AddWishModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { SketchColorBlock } from "@/components/ui/sketch/SketchColorBlock";
import { cn } from "@/lib/cn";
import { useWishlist } from "@/hooks/useWishlist";

const priorityVariant = {
  high: "high",
  medium: "medium",
  low: "low",
} as const;

const priorityLabel = {
  high: "高优先",
  medium: "中优先",
  low: "低优先",
};

export function WishlistPage() {
  const { items, loading, create, addToInventory } = useWishlist();
  const [checked, setChecked] = useState<number[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  const toggle = (id: number) =>
    setChecked((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleAddToInventory = async (id: number) => {
    setAddingId(id);
    try {
      await addToInventory(id);
      setChecked((s) => s.filter((x) => x !== id));
    } finally {
      setAddingId(null);
    }
  };

  const checkedTotal = items
    .filter((w) => checked.includes(w.id))
    .reduce((s, w) => s + w.price, 0);
  const grandTotal = items.reduce((s, w) => s + w.price, 0);

  if (loading) {
    return <p className="text-sm text-muted">加载中…</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-[22px] font-bold">心愿清单 ❤️</h1>
        <Button size="sm" onClick={() => setAddOpen(true)}>+ 添加心愿</Button>
      </div>

      <Card className="mb-3 p-3.5">
        <div className="mb-1 text-[13px] text-muted">
          共 {items.length} 支心愿马克笔 · 已勾选 {checked.length} 支
        </div>
        {checked.length > 0 && (
          <div className="text-xs text-[#5a8c6a]">已选总价：¥ {checkedTotal}</div>
        )}
      </Card>

      <Card className="overflow-hidden">
        {items.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted">暂无心愿，点击右上角添加</p>
        ) : (
          items.map((w, i) => (
            <div
              key={w.id}
              className={cn(
                "flex items-center gap-2.5 px-3.5 py-2.5",
                i < items.length - 1 && "border-b border-dashed border-[#c8b890]",
                checked.includes(w.id) && "bg-secondary/80",
              )}
            >
              <button
                type="button"
                onClick={() => toggle(w.id)}
                className="shrink-0 cursor-pointer border-none bg-transparent"
              >
                {checked.includes(w.id) ? (
                  <CheckSquare size={16} strokeWidth={2} className="text-[#5a8c6a]" />
                ) : (
                  <Square size={16} strokeWidth={2} className="text-[#c8b890]" />
                )}
              </button>
              <SketchColorBlock color={w.color} style={{ width: 36, height: 22 }} />
              <span className="w-[90px] text-[13px] text-muted">{w.brandName}</span>
              <span className="w-11 text-sm font-bold">{w.code}</span>
              <span className="flex-1 text-[13px]">{w.name}</span>
              <Tag variant={priorityVariant[w.priority]}>{priorityLabel[w.priority]}</Tag>
              <span className="w-[52px] text-right text-sm font-bold">¥ {w.price}</span>
              <Button
                size="sm"
                disabled={addingId === w.id}
                onClick={() => void handleAddToInventory(w.id)}
              >
                {addingId === w.id ? "加入中…" : "加入库存"}
              </Button>
            </div>
          ))
        )}
      </Card>

      <div className="mt-3 text-right text-sm">
        <span className="text-muted">合计总价：</span>
        <span className="text-lg font-bold">¥ {grandTotal}</span>
      </div>

      <AddWishModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={create} />
    </div>
  );
}
