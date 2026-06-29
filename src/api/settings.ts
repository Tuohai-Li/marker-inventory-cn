import type { AppSettings } from "@/types";
import {
  addMemo,
  getStoreSnapshot,
  importStoreData,
  lastBackupAt,
  memosStore,
  restoreBackupSnapshot,
  saveBackupSnapshot,
  settingsStore,
  updateSettingsStore,
} from "@/data/store";
import { exportFullBackup } from "@/lib/export";

export async function getMemos(): Promise<string[]> {
  return [...memosStore];
}

export async function createMemo(text: string): Promise<string[]> {
  addMemo(text);
  return [...memosStore];
}

export async function getSettings(): Promise<AppSettings> {
  return { ...settingsStore };
}

export async function updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  updateSettingsStore(patch);
  return { ...settingsStore };
}

export async function getLastBackupAt(): Promise<string> {
  return lastBackupAt;
}

export async function backupNow(): Promise<string> {
  saveBackupSnapshot();
  return lastBackupAt;
}

export async function restoreBackup(): Promise<boolean> {
  return restoreBackupSnapshot();
}

export async function exportBackupFile() {
  exportFullBackup(getStoreSnapshot());
}

export async function importFromJsonFile(file: File): Promise<void> {
  const text = await file.text();
  const data = JSON.parse(text) as ReturnType<typeof getStoreSnapshot>;
  importStoreData(data);
}
