import { useEffect, useState, type FormEvent } from "react";
import type { MarkerWithBrand } from "@/types";
import { createPurchase } from "@/api/purchases";
import { Input } from "@/components/ui/Input";
import { Modal, ModalActions } from "@/components/ui/Modal";
import { useMarkers } from "@/hooks/useMarkers";

interface RestockModalProps {
  marker: MarkerWithBrand | null;
  open: boolean;
  onClose: () => void;
}

export function RestockModal({ marker, open, onClose }: RestockModalProps) {
  const { update } = useMarkers();
  const [qty, setQty] = useState("1");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("库存补充");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && marker) {
      setQty("1");
      setAmount(String(marker.price));
      setNote("库存补充");
    }
  }, [open, marker]);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!marker) return;
    const addQty = Number(qty) || 0;
    if (addQty <= 0) return;

    setSubmitting(true);
    try {
      await update(marker.id, { stock: marker.stock + addQty });
      await createPurchase({
        date: new Date().toISOString().slice(0, 10),
        brandId: marker.brandId,
        items: `${marker.code} 补充`,
        qty: addQty,
        amount: Number(amount) || marker.price * addQty,
        note: note.trim() || "库存补充",
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!marker) return null;

  return (
    <Modal open={open} onClose={onClose} title={`补充库存 · ${marker.code}`}>
      <form onSubmit={handleSubmit}>
        <p className="mb-3 text-sm text-muted">
          {marker.brandName} · {marker.name}（当前 {marker.stock} 支）
        </p>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">补充数量</label>
          <Input type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} required />
        </div>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">花费金额（¥）</label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">备注</label>
          <Input value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <ModalActions
          confirmLabel={submitting ? "提交中…" : "确认补充"}
          onConfirm={() => void handleSubmit()}
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
}
