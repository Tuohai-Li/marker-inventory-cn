import type { MarkerWithBrand } from "@/types";
import { downloadJson, downloadTextFile } from "./download";

export function exportMarkersAsJson(markers: MarkerWithBrand[]) {
  downloadJson(`markers-${dateStamp()}.json`, markers);
}

export function exportMarkersAsCsv(markers: MarkerWithBrand[]) {
  const headers = ["品牌", "编号", "颜色名", "系列", "颜色", "库存", "借出", "价格", "添加日期", "备注"];
  const rows = markers.map((m) =>
    [
      m.brandName,
      m.code,
      m.name,
      m.series,
      m.color,
      m.stock,
      m.borrowed,
      m.price,
      m.addDate,
      m.notes ?? "",
    ]
      .map(escapeCsv)
      .join(","),
  );
  downloadTextFile(
    `markers-${dateStamp()}.csv`,
    [headers.join(","), ...rows].join("\n"),
    "text/csv;charset=utf-8",
  );
}

export function exportMarkersAsExcelCompatibleCsv(markers: MarkerWithBrand[]) {
  exportMarkersAsCsv(markers);
}

export function exportFullBackup(data: unknown) {
  downloadJson(`marker-inventory-backup-${dateStamp()}.json`, data);
}

export function getImportTemplateCsv() {
  return [
    "brandId,code,name,color,stock,borrowed,price,addDate,series,notes",
    "1,B00,Frost Blue,#c8e8f4,2,0,45,2024-05-19,B,示例备注",
  ].join("\n");
}

function escapeCsv(value: string | number) {
  const text = String(value);
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}
