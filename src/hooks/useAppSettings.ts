import { useCallback, useEffect, useState } from "react";
import type { AppSettings } from "@/types";
import {
  backupNow,
  getLastBackupAt,
  getSettings,
  restoreBackup,
  updateSettings,
} from "@/api/settings";
import { subscribeDataChanges } from "@/data/store";

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [lastBackup, setLastBackup] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [s, backup] = await Promise.all([getSettings(), getLastBackupAt()]);
      setSettings(s);
      setLastBackup(backup);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => subscribeDataChanges(() => void refresh()), [refresh]);

  const update = useCallback(
    async (patch: Partial<AppSettings>) => {
      const next = await updateSettings(patch);
      setSettings(next);
      return next;
    },
    [],
  );

  const backup = useCallback(async () => {
    const at = await backupNow();
    setLastBackup(at);
    return at;
  }, []);

  const restore = useCallback(async () => restoreBackup(), []);

  return { settings, lastBackup, loading, refresh, update, backup, restore };
}
