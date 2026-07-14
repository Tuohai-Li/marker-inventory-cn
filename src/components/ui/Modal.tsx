import { createPortal } from "react-dom";
import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { SketchEnter } from "./sketch/SketchEnter";
import { RoughBox } from "./sketch/RoughBox";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return createPortal(
    <div
      className="sketch-backdrop-enter fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,20,7,0.5)]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn("w-full max-w-[420px] px-4", className)}
        onClick={(e) => e.stopPropagation()}
      >
        <SketchEnter variant="scale">
          <RoughBox variant="modal" className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 id={titleId} className="text-xl font-bold">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer border-none bg-transparent"
                aria-label="关闭"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>
            {children}
          </RoughBox>
        </SketchEnter>
      </div>
    </div>,
    document.body,
  );
}

interface ModalActionsProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ModalActions({
  onConfirm,
  onCancel,
  confirmLabel = "确认",
  cancelLabel = "取消",
}: ModalActionsProps) {
  return (
    <div className="mt-4 flex gap-3">
      <Button variant="primary" size="lg" className="flex-1" onClick={onConfirm}>
        {confirmLabel}
      </Button>
      <Button size="lg" onClick={onCancel}>
        {cancelLabel}
      </Button>
    </div>
  );
}
