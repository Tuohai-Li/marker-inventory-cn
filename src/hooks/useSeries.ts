import { useCallback, useEffect, useState } from "react";
import type { Series } from "@/types";
import { createSeries, getSeries, type CreateSeriesInput } from "@/api/series";
import { subscribeDataChanges } from "@/data/store";

export function useSeries() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setSeries(await getSeries());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => subscribeDataChanges(() => void refresh()), [refresh]);

  const create = useCallback(
    async (data: CreateSeriesInput) => {
      const item = await createSeries(data);
      await refresh();
      return item;
    },
    [refresh],
  );

  return { series, loading, refresh, create };
}
