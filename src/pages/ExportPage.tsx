import { useRef, useState } from "react";
import {
  Archive,
  FileDown,
  FileText,
  HardDrive,
  RefreshCw,
} from "lucide-react";
import {
  exportMarkersAsCsv,
  exportMarkersAsExcelCompatibleCsv,
  exportMarkersAsJson,
  getImportTemplateCsv,
} from "@/lib/export";
import { downloadTextFile } from "@/lib/download";
import { backupNow, importFromJsonFile, restoreBackup } from "@/api/settings";
import { getMarkers } from "@/api/markers";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { useAppSettings } from "@/hooks/useAppSettings";

const exportFormats = [
  { key: "xlsx", fmt: "Excel (.xlsx)", desc: "导出完整马克笔库存表格", icon: "📊" },
  { key: "csv", fmt: "CSV (.csv)", desc: "通用表格格式，兼容各类软件", icon: "📋" },
  { key: "json", fmt: "JSON (.json)", desc: "完整数据备份，可重新导入", icon: "📄" },
  { key: "pdf", fmt: "PDF 报告", desc: "生成收藏统计分析报告", icon: "📑" },
] as const;

export function ExportPage() {
  const { lastBackup, backup, restore } = useAppSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleExport = async (key: (typeof exportFormats)[number]["key"]) => {
    const markers = await getMarkers();
    if (key === "json") exportMarkersAsJson(markers);
    else if (key === "csv") exportMarkersAsCsv(markers);
    else if (key === "xlsx") exportMarkersAsExcelCompatibleCsv(markers);
    else window.print();
    showMessage("导出完成");
  };

  const handleBackup = async () => {
    const at = await backup();
    showMessage(`备份成功：${at}`);
  };

  const handleRestore = async () => {
    if (!window.confirm("确定从上次备份恢复吗？当前数据将被覆盖。")) return;
    const ok = await restore();
    showMessage(ok ? "恢复成功" : "没有可用备份");
  };

  const handleImport = async (file: File) => {
    try {
      await importFromJsonFile(file);
      showMessage("导入成功");
    } catch {
      showMessage("导入失败，请检查文件格式");
    }
  };

  return (
    <div className="max-w-[620px]">
      <h1 className="mb-4 text-[22px] font-bold">导出与备份 💾</h1>
      {message && <p className="mb-3 text-sm text-[#5a8c6a]">{message}</p>}

      <Card className="mb-3 p-3.5">
        <CardHeader>
          <HardDrive size={14} className="mr-1.5 inline" />
          数据备份
        </CardHeader>
        <div className="mb-2.5 flex items-center justify-between">
          <div>
            <div className="text-[13px] text-muted">上次备份时间</div>
            <div className="text-base font-bold">{lastBackup || "尚未备份"}</div>
          </div>
          <Tag variant={lastBackup ? "success" : "warning"}>
            {lastBackup ? "备份正常" : "待备份"}
          </Tag>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" onClick={() => void handleBackup()}>
            <HardDrive size={14} /> 立即备份
          </Button>
          <Button onClick={() => void handleRestore()}>
            <RefreshCw size={14} /> 从备份恢复
          </Button>
          <Button onClick={() => void exportBackupFile()}>
            <FileDown size={14} /> 下载备份文件
          </Button>
        </div>
      </Card>

      <Card className="mb-3 p-3.5">
        <CardHeader>
          <FileDown size={14} className="mr-1.5 inline" />
          数据导出
        </CardHeader>
        <div className="grid grid-cols-2 gap-3">
          {exportFormats.map(({ key, fmt, desc, icon }) => (
            <Card key={key} variant="flat" className="flex flex-col gap-1.5 p-3">
              <div className="text-xl">{icon}</div>
              <div className="text-sm font-bold">{fmt}</div>
              <div className="flex-1 text-xs text-muted">{desc}</div>
              <Button size="sm" className="self-start" onClick={() => void handleExport(key)}>
                导出
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-3.5">
        <CardHeader>
          <FileText size={14} className="mr-1.5 inline" />
          数据导入
        </CardHeader>
        <div className="mb-3 text-[13px] leading-relaxed text-muted">
          支持从 JSON 文件批量导入马克笔数据。
          <br />
          请确保列名与模板一致，下载模板文件后填写再上传。
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() =>
              downloadTextFile("marker-import-template.csv", getImportTemplateCsv(), "text/csv;charset=utf-8")
            }
          >
            <Archive size={14} /> 下载导入模板
          </Button>
          <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
            <FileDown size={14} /> 选择文件导入
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImport(file);
              e.target.value = "";
            }}
          />
        </div>
      </Card>
    </div>
  );
}
