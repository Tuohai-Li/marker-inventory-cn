import { useState } from "react";
import { useNavigate } from "react-router";
import type { AppSettings } from "@/types";
import { EditSettingModal } from "@/components/features/EditSettingModal";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { useAppSettings } from "@/hooks/useAppSettings";

type SettingKey = keyof AppSettings | "export";

const settingsGroups: { group: string; items: { key: SettingKey; label: string }[] }[] = [
  {
    group: "通用",
    items: [
      { key: "language", label: "应用语言" },
      { key: "currency", label: "货币单位" },
      { key: "dateFormat", label: "日期格式" },
    ],
  },
  {
    group: "数据管理",
    items: [
      { key: "autoBackup", label: "数据备份" },
      { key: "autoSync", label: "自动同步" },
      { key: "export", label: "数据导出" },
    ],
  },
  {
    group: "提醒设置",
    items: [
      { key: "lowStockAlert", label: "库存预警" },
      { key: "borrowAlert", label: "借出提醒" },
      { key: "newItemAlert", label: "新品提醒" },
    ],
  },
];

function formatValue(key: SettingKey, settings: AppSettings): string {
  if (key === "export") return "";
  if (key === "lowStockAlert") return settings.lowStockAlert ? "低于 3 支时提醒" : "已关闭";
  const val = settings[key];
  return typeof val === "boolean" ? (val ? "已开启" : "已关闭") : String(val);
}

export function SettingsPage() {
  const { settings, loading, update } = useAppSettings();
  const navigate = useNavigate();
  const [editKey, setEditKey] = useState<SettingKey | null>(null);

  if (loading || !settings) {
    return <p className="text-sm text-muted">加载中…</p>;
  }

  const handleEdit = (key: SettingKey) => {
    if (key === "export") {
      navigate("/export");
      return;
    }
    setEditKey(key);
  };

  return (
    <div className="max-w-[600px]">
      <h1 className="mb-4 text-[22px] font-bold">设置 ⚙️</h1>
      {settingsGroups.map(({ group, items }) => (
        <Card key={group} className="mb-3 p-3.5">
          <CardHeader>{group}</CardHeader>
          {items.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between border-b border-dashed border-[#c8b890] py-2 last:border-b-0"
            >
              <span className="text-sm">{label}</span>
              <div className="flex items-center gap-2">
                {key !== "export" && (
                  <span className="text-[13px] text-muted">{formatValue(key, settings)}</span>
                )}
                <Button size="sm" onClick={() => handleEdit(key)}>
                  {key === "export" ? "前往" : "修改"}
                </Button>
              </div>
            </div>
          ))}
        </Card>
      ))}

      <EditSettingModal
        open={editKey !== null}
        settingKey={editKey}
        settings={settings}
        onClose={() => setEditKey(null)}
        onSave={update}
      />
    </div>
  );
}
