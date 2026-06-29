import { useCallback, useEffect, useState } from "react";
import type { MarkerWithBrand } from "@/types";
import {
  createMarker,
  deleteMarker,
  getMarkers,
  updateMarker,
  type CreateMarkerInput,
} from "@/api/markers";
import { subscribeDataChanges } from "@/data/store";

export function useMarkers() {
  const [markers, setMarkers] = useState<MarkerWithBrand[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setMarkers(await getMarkers());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => subscribeDataChanges(() => void refresh()), [refresh]);

  const create = useCallback(
    async (data: CreateMarkerInput) => {
      const marker = await createMarker(data);
      await refresh();
      return marker;
    },
    [refresh],
  );

  const update = useCallback(
    async (id: number, data: Partial<CreateMarkerInput>) => {
      const marker = await updateMarker(id, data);
      await refresh();
      return marker;
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteMarker(id);
      await refresh();
    },
    [refresh],
  );

  return { markers, loading, refresh, create, update, remove };
}
