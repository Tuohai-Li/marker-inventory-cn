import { useState, type FormEvent } from "react";
import type { CreateWishInput } from "@/api/wishlist";
import { Input } from "@/components/ui/Input";
import { Modal, ModalActions } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useBrands } from "@/hooks/useBrands";

interface AddWishModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWishInput) => Promise<void>;
}

export function AddWishModal({ open, onClose, onSubmit }: AddWishModalProps) {
  const { brands } = useBrands();
  const [form, setForm] = useState<CreateWishInput>({
    brandId: 0,
    code: "",
    name: "",
    color: "#c8e8f4",
    price: 0,
    priority: "medium",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!form.brandId || !form.code.trim() || !form.name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        code: form.code.trim(),
        name: form.name.trim(),
      });
      setForm({ brandId: 0, code: "", name: "", color: "#c8e8f4", price: 0, priority: "medium" });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="添加心愿 ❤️">
      <form onSubmit={handleSubmit}>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">品牌</label>
          <Select
            value={form.brandId || ""}
            onChange={(e) => setForm((p) => ({ ...p, brandId: Number(e.target.value) }))}
            required
          >
            <option value="">请选择品牌</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </Select>
        </div>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">编号</label>
          <Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} required />
        </div>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">颜色名</label>
          <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        </div>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">颜色</label>
          <div className="flex items-center gap-2">
            <input type="color" value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} className="h-9 w-12 cursor-pointer border-none bg-transparent p-0" />
            <Input value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} className="flex-1" />
          </div>
        </div>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">参考价格</label>
          <Input type="number" value={form.price || ""} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) || 0 }))} />
        </div>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">优先级</label>
          <Select
            value={form.priority}
            onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value as CreateWishInput["priority"] }))}
          >
            <option value="high">高优先</option>
            <option value="medium">中优先</option>
            <option value="low">低优先</option>
          </Select>
        </div>
        <ModalActions confirmLabel={submitting ? "添加中…" : "确认添加"} onConfirm={() => void handleSubmit()} onCancel={onClose} />
      </form>
    </Modal>
  );
}
