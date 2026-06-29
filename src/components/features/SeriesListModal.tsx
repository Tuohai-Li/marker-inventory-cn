import { Modal } from "@/components/ui/Modal";

interface SeriesListModalProps {
  open: boolean;
  onClose: () => void;
  brandName: string;
  seriesNames: string[];
}

export function SeriesListModal({ open, onClose, brandName, seriesNames }: SeriesListModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={`${brandName} · 系列列表`}>
      {seriesNames.length === 0 ? (
        <p className="text-sm text-muted">该品牌暂无系列，请先添加系列。</p>
      ) : (
        <ul className="space-y-2">
          {seriesNames.map((name) => (
            <li
              key={name}
              className="rounded-sm border border-dashed border-[#c8b890] px-3 py-2 text-sm font-semibold"
            >
              {name} 系列
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
