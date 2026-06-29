import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAddMarkerModal } from "@/contexts/AddMarkerModalContext";
import { Input } from "@/components/ui/Input";
import { Modal, ModalActions } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useBrands } from "@/hooks/useBrands";
import { useMarkers } from "@/hooks/useMarkers";
import { useSeries } from "@/hooks/useSeries";

interface MarkerFormState {
  brandId: number | "";
  code: string;
  name: string;
  color: string;
  series: string;
  stock: string;
  price: string;
}

const initialForm: MarkerFormState = {
  brandId: "",
  code: "",
  name: "",
  color: "#c8e8f4",
  series: "",
  stock: "",
  price: "",
};


export function AddMarkerModal() {
  const { open, closeModal } = useAddMarkerModal();
  const { brands, refresh: refreshBrands } = useBrands();
  const { series, refresh: refreshSeries } = useSeries();
  const { create } = useMarkers();
  const [form, setForm] = useState<MarkerFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const availableSeries = useMemo(
    () => (form.brandId ? series.filter((s) => s.brandId === form.brandId) : []),
    [series, form.brandId],
  );

  useEffect(() => {
    if (open) {
      void refreshBrands();
      void refreshSeries();
    }
  }, [open, refreshBrands, refreshSeries]);

  const reset = () => setForm(initialForm);

  const handleClose = () => {
    reset();
    closeModal();
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!form.brandId || !form.code.trim() || !form.name.trim() || !form.series) return;

    const stock = Number(form.stock) || 0;
    const price = Number(form.price) || 0;

    setSubmitting(true);
    try {
      await create({
        brandId: Number(form.brandId),
        code: form.code.trim(),
        name: form.name.trim(),
        color: form.color,
        stock,
        borrowed: 0,
        price,
        addDate: new Date().toISOString().slice(0, 10),
        series: form.series,
      });
      reset();
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="添加马克笔 ✏️">
      <form onSubmit={handleSubmit}>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">品牌</label>
          <Select
            value={form.brandId}
            onChange={(e) => {
              const brandId = e.target.value ? Number(e.target.value) : "";
              setForm((prev) => ({ ...prev, brandId, series: "" }));
            }}
            required
          >
            <option value="">请选择品牌</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">编号</label>
          <Input
            placeholder="如：B00"
            value={form.code}
            onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
            required
          />
        </div>

        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">颜色名</label>
          <Input
            placeholder="如：Frost Blue"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">颜色</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
              className="h-9 w-12 cursor-pointer border-none bg-transparent p-0"
            />
            <Input
              value={form.color}
              onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
              placeholder="#c8e8f4"
              className="flex-1"
            />
          </div>
        </div>

        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">系列</label>
          <Select
            value={form.series}
            onChange={(e) => setForm((prev) => ({ ...prev, series: e.target.value }))}
            required
            disabled={!form.brandId}
          >
            <option value="">
              {form.brandId ? "请选择系列" : "请先选择品牌"}
            </option>
            {availableSeries.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} 系列
              </option>
            ))}
          </Select>
          {form.brandId && availableSeries.length === 0 && (
            <p className="mt-1 text-xs text-muted">该品牌暂无系列，请先在品牌与系列页添加。</p>
          )}
        </div>

        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">库存数量</label>
          <Input
            type="number"
            placeholder="如：2"
            value={form.stock}
            onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
          />
        </div>

        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">购入价格</label>
          <Input
            type="number"
            placeholder="如：45"
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
          />
        </div>

        <ModalActions
          confirmLabel={submitting ? "添加中…" : "确认添加"}
          onConfirm={() => void handleSubmit()}
          onCancel={handleClose}
        />
      </form>
    </Modal>
  );
}
