import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Modal, ModalActions } from "@/components/ui/Modal";

interface AddMemoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string) => Promise<void>;
}

export function AddMemoModal({ open, onClose, onSubmit }: AddMemoModalProps) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(text.trim());
      setText("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="添加备注 📝">
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="输入备忘内容…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <ModalActions
          confirmLabel={submitting ? "添加中…" : "确认添加"}
          onConfirm={() => void handleSubmit()}
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
}
