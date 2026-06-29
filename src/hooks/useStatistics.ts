import { useCallback, useEffect, useState } from "react";
import type { InventoryStats } from "@/lib/statistics";
import type { MarkerWithBrand } from "@/types";
import { getInventoryStats } from "@/api/statistics";
import { subscribeDataChanges } from "@/data/store";

export type EnrichedInventoryStats = Omit<InventoryStats, "recent" | "lowStockMarkers"> & {
  recent: MarkerWithBrand[];
  lowStockMarkers: MarkerWithBrand[];
};

export function useStatistics() {
  const [stats, setStats] = useState<EnrichedInventoryStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setStats(await getInventoryStats());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => subscribeDataChanges(() => void refresh()), [refresh]);

  return { stats, loading, refresh };
}
