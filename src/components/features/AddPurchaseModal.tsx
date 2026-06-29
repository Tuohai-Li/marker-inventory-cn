import { useState, type FormEvent } from "react";
import type { CreatePurchaseInput } from "@/api/purchases";
import { Input } from "@/components/ui/Input";
import { Modal, ModalActions } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useBrands } from "@/hooks/useBrands";

interface AddPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePurchaseInput) => Promise<void>;
}

export function AddPurchaseModal({ open, onClose, onSubmit }: AddPurchaseModalProps) {
  const { brands } = useBrands();
  const [form, setForm] = useState<CreatePurchaseInput>({
    date: new Date().toISOString().slice(0, 10),
    brandId: 0,
    items: "",
    qty: 1,
    amount: 0,
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!form.brandId || !form.items.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ ...form, items: form.items.trim(), note: form.note.trim() });
      setForm({
        date: new Date().toISOString().slice(0, 10),
        brandId: 0,
        items: "",
        qty: 1,
        amount: 0,
        note: "",
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="添加购买记录 🛒">
      <form onSubmit={handleSubmit}>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">日期</label>
          <Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required />
        </div>
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
          <label className="mb-0.5 block text-[13px] text-muted">购买内容</label>
          <Input value={form.items} onChange={(e) => setForm((p) => ({ ...p, items: e.target.value }))} placeholder="如：B00, R27" required />
        </div>
        <div className="mb-2.5 grid grid-cols-2 gap-2">
          <div>
            <label className="mb-0.5 block text-[13px] text-muted">数量</label>
            <Input type="number" min={1} value={form.qty} onChange={(e) => setForm((p) => ({ ...p, qty: Number(e.target.value) || 1 }))} />
          </div>
          <div>
            <label className="mb-0.5 block text-[13px] text-muted">金额（¥）</label>
            <Input type="number" value={form.amount || ""} onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) || 0 }))} />
          </div>
        </div>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">备注</label>
          <Input value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
        </div>
        <ModalActions confirmLabel={submitting ? "添加中…" : "确认添加"} onConfirm={() => void handleSubmit()} onCancel={onClose} />
      </form>
    </Modal>
  );
}
