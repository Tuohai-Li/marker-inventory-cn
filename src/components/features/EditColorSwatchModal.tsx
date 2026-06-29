import { useEffect, useState } from "react";
import type { ColorSwatch } from "@/types";
import { Input } from "@/components/ui/Input";
import { Modal, ModalActions } from "@/components/ui/Modal";
import { SketchColorBlock } from "@/components/ui/sketch/SketchColorBlock";

interface EditColorSwatchModalProps {
  open: boolean;
  swatches: ColorSwatch[][];
  onClose: () => void;
  onSave: (swatches: ColorSwatch[][]) => void;
}

export function EditColorSwatchModal({ open, swatches, onClose, onSave }: EditColorSwatchModalProps) {
  const [draft, setDraft] = useState<ColorSwatch[][]>(swatches);

  useEffect(() => {
    if (open) setDraft(swatches.map((row) => row.map((s) => ({ ...s }))));
  }, [open, swatches]);

  const updateCell = (ri: number, ci: number, patch: Partial<ColorSwatch>) => {
    setDraft((prev) =>
      prev.map((row, r) =>
        r === ri ? row.map((cell, c) => (c === ci ? { ...cell, ...patch } : cell)) : row,
      ),
    );
  };

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="编辑快捷颜色面板">
      <p className="mb-3 text-xs text-muted">修改编号与颜色，保存后将在面板中显示。</p>
      <div className="mb-4 flex max-h-[320px] flex-col gap-2 overflow-y-auto">
        {draft.map((row, ri) => (
          <div key={ri} className="flex gap-2">
            {row.map((sw, ci) => (
              <div key={`${ri}-${ci}`} className="flex-1 rounded border border-dashed border-[#c8b890] p-1.5">
                <SketchColorBlock color={sw.color} style={{ width: "100%", height: 18, marginBottom: 4 }} />
                <Input
                  value={sw.code}
                  onChange={(e) => updateCell(ri, ci, { code: e.target.value })}
                  className="mb-1 text-[11px]"
                />
                <input
                  type="color"
                  value={sw.color}
                  onChange={(e) => updateCell(ri, ci, { color: e.target.value })}
                  className="h-6 w-full cursor-pointer border border-ink"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <ModalActions confirmLabel="保存" onConfirm={handleSave} onCancel={onClose} />
    </Modal>
  );
}
