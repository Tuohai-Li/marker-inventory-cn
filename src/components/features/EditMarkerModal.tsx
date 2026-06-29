import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { MarkerWithBrand } from "@/types";
import { Input } from "@/components/ui/Input";
import { Modal, ModalActions } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useBrands } from "@/hooks/useBrands";
import { useMarkers } from "@/hooks/useMarkers";
import { useSeries } from "@/hooks/useSeries";


interface EditMarkerModalProps {
  marker: MarkerWithBrand | null;
  open: boolean;
  onClose: () => void;
}

export function EditMarkerModal({ marker, open, onClose }: EditMarkerModalProps) {
  const { brands, refresh: refreshBrands } = useBrands();
  const { series, refresh: refreshSeries } = useSeries();
  const { update } = useMarkers();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    brandId: 0,
    code: "",
    name: "",
    color: "#c8e8f4",
    series: "",
    stock: "0",
    borrowed: "0",
    price: "0",
    notes: "",
  });

  useEffect(() => {
    if (open && marker) {
      void refreshBrands();
      void refreshSeries();
      setForm({
        brandId: marker.brandId,
        code: marker.code,
        name: marker.name,
        color: marker.color,
        series: marker.series,
        stock: String(marker.stock),
        borrowed: String(marker.borrowed),
        price: String(marker.price),
        notes: marker.notes ?? "",
      });
    }
  }, [open, marker, refreshBrands, refreshSeries]);

  const availableSeries = useMemo(
    () => (form.brandId ? series.filter((s) => s.brandId === form.brandId) : []),
    [series, form.brandId],
  );

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!marker || !form.brandId || !form.series) return;

    setSubmitting(true);
    try {
      await update(marker.id, {
        brandId: form.brandId,
        code: form.code.trim(),
        name: form.name.trim(),
        color: form.color,
        series: form.series,
        stock: Number(form.stock) || 0,
        borrowed: Number(form.borrowed) || 0,
        price: Number(form.price) || 0,
        notes: form.notes.trim() || undefined,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!marker) return null;

  return (
    <Modal open={open} onClose={onClose} title="编辑马克笔 ✏️">
      <form onSubmit={handleSubmit}>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">品牌</label>
          <Select
            value={form.brandId}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                brandId: Number(e.target.value),
                series: "",
              }))
            }
            required
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
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
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
              className="h-9 w-12 cursor-pointer border-none bg-transparent p-0"
            />
            <Input value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} className="flex-1" />
          </div>
        </div>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">系列</label>
          <Select
            value={form.series}
            onChange={(e) => setForm((p) => ({ ...p, series: e.target.value }))}
            required
          >
            <option value="">请选择系列</option>
            {availableSeries.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} 系列
              </option>
            ))}
          </Select>
        </div>
        <div className="mb-2.5 grid grid-cols-3 gap-2">
          <div>
            <label className="mb-0.5 block text-[13px] text-muted">库存</label>
            <Input type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} />
          </div>
          <div>
            <label className="mb-0.5 block text-[13px] text-muted">借出</label>
            <Input type="number" value={form.borrowed} onChange={(e) => setForm((p) => ({ ...p, borrowed: e.target.value }))} />
          </div>
          <div>
            <label className="mb-0.5 block text-[13px] text-muted">价格</label>
            <Input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
          </div>
        </div>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">备注</label>
          <Input value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
        </div>
        <ModalActions
          confirmLabel={submitting ? "保存中…" : "保存修改"}
          onConfirm={() => void handleSubmit()}
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
}
