import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { AppSettings } from "@/types";
import { Modal, ModalActions } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type SettingKey = keyof AppSettings | "export";

interface EditSettingModalProps {
  open: boolean;
  settingKey: SettingKey | null;
  settings: AppSettings;
  onClose: () => void;
  onSave: (patch: Partial<AppSettings>) => Promise<void>;
}

const languageOptions = ["中文（简体）", "English"];
const currencyOptions = ["人民币（¥）", "美元（$）", "日元（¥）"];
const dateFormatOptions = ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"];

const settingLabels: Record<SettingKey, string> = {
  language: "应用语言",
  currency: "货币单位",
  dateFormat: "日期格式",
  autoBackup: "数据备份",
  autoSync: "自动同步",
  export: "数据导出",
  lowStockAlert: "库存预警",
  borrowAlert: "借出提醒",
  newItemAlert: "新品提醒",
};

export function EditSettingModal({
  open,
  settingKey,
  settings,
  onClose,
  onSave,
}: EditSettingModalProps) {
  const navigate = useNavigate();
  const [value, setValue] = useState<string | boolean>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!settingKey || settingKey === "export") return;
    setValue(settings[settingKey]);
  }, [settingKey, settings, open]);

  const handleSave = async () => {
    if (!settingKey) return;
    if (settingKey === "export") {
      onClose();
      navigate("/export");
      return;
    }
    setSubmitting(true);
    try {
      await onSave({ [settingKey]: value });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!settingKey) return null;

  const label = settingLabels[settingKey];

  return (
    <Modal open={open} onClose={onClose} title={`修改 · ${label}`}>
      {settingKey === "export" ? (
        <p className="mb-4 text-sm text-muted">将跳转到「导出与备份」页面进行数据导出。</p>
      ) : settingKey === "language" ? (
        <Select
          value={String(value)}
          onChange={(e) => setValue(e.target.value)}
        >
          {languageOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </Select>
      ) : settingKey === "currency" ? (
        <Select
          value={String(value)}
          onChange={(e) => setValue(e.target.value)}
        >
          {currencyOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </Select>
      ) : settingKey === "dateFormat" ? (
        <Select
          value={String(value)}
          onChange={(e) => setValue(e.target.value)}
        >
          {dateFormatOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </Select>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm">{value ? "已开启" : "已关闭"}</span>
          <Button type="button" size="sm" onClick={() => setValue(!value)}>
            {value ? "关闭" : "开启"}
          </Button>
        </div>
      )}
      <ModalActions
        confirmLabel={settingKey === "export" ? "前往导出" : submitting ? "保存中…" : "保存"}
        onConfirm={() => void handleSave()}
        onCancel={onClose}
      />
    </Modal>
  );
}
