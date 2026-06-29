import { useState, type FormEvent } from "react";
import type { CreateSeriesInput } from "@/api/series";
import { Input } from "@/components/ui/Input";
import { Modal, ModalActions } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useBrands } from "@/hooks/useBrands";

const defaultForm: CreateSeriesInput = {
  brandId: 0,
  name: "",
};

interface AddSeriesModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSeriesInput) => Promise<void>;
}

export function AddSeriesModal({ open, onClose, onSubmit }: AddSeriesModalProps) {
  const { brands } = useBrands();
  const [form, setForm] = useState<CreateSeriesInput>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setForm(defaultForm);
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!form.brandId || !form.name.trim()) return;

    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ brandId: form.brandId, name: form.name.trim() });
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "添加失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="添加系列 📂">
      <form onSubmit={handleSubmit}>
        <div className="mb-2.5">
          <label className="mb-0.5 block text-[13px] text-muted">所属品牌</label>
          <Select
            value={form.brandId || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, brandId: e.target.value ? Number(e.target.value) : 0 }))
            }
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
          <label className="mb-0.5 block text-[13px] text-muted">系列名称</label>
          <Input
            placeholder="如：B、R、CG"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        {error && <p className="mb-2 text-xs text-destructive">{error}</p>}

        <ModalActions
          confirmLabel={submitting ? "添加中…" : "确认添加"}
          onConfirm={() => void handleSubmit()}
          onCancel={handleClose}
        />
      </form>
    </Modal>
  );
}
