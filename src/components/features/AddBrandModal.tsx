import { useState, type FormEvent } from "react";
import type { CreateBrandInput } from "@/api/brands";
import { Input } from "@/components/ui/Input";
import { Modal, ModalActions } from "@/components/ui/Modal";

const defaultForm: CreateBrandInput = {
  name: "",
  origin: "",
  tier: "",
  color: "#c8e8a0",
};

interface AddBrandModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBrandInput) => Promise<void>;
}

export function AddBrandModal({ open, onClose, onSubmit }: AddBrandModalProps) {
  const [form, setForm] = useState<CreateBrandInput>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => setForm(defaultForm);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!form.name.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        origin: form.origin.trim(),
        tier: form.tier.trim(),
      });
      reset();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: keyof CreateBrandInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal open={open} onClose={handleClose} title="添加品牌 🏷️">
      <form onSubmit={handleSubmit}>
        {(
          [
            ["name", "品牌名称", "如：Copic Sketch"],
            ["origin", "产地", "如：日本"],
            ["tier", "定位", "如：专业级"],
          ] as const
        ).map(([key, label, placeholder]) => (
          <div key={key} className="mb-2.5">
            <label className="mb-0.5 block text-[13px] text-muted">{label}</label>
            <Input
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => update(key, e.target.value)}
              required={key === "name"}
            />
          </div>
        ))}

        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">代表色</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.color}
              onChange={(e) => update("color", e.target.value)}
              className="h-9 w-12 cursor-pointer border-none bg-transparent p-0"
            />
            <Input
              value={form.color}
              onChange={(e) => update("color", e.target.value)}
              placeholder="#c8e8a0"
              className="flex-1"
            />
          </div>
        </div>

        <p className="mb-2 text-xs text-muted">
          收藏数量、系列数、均价将根据关联的马克笔库存自动统计。
        </p>

        <ModalActions
          confirmLabel={submitting ? "添加中…" : "确认添加"}
          onConfirm={() => void handleSubmit()}
          onCancel={handleClose}
        />
      </form>
    </Modal>
  );
}
