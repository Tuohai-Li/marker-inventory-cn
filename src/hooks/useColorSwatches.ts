import { useCallback, useEffect, useState } from "react";
import type { ColorSwatch } from "@/types";
import { mockColorSwatches } from "@/data/mock/colorSwatches";

const STORAGE_KEY = "marker_inventory_swatches_v1";

function loadSwatches(): ColorSwatch[][] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ColorSwatch[][];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return mockColorSwatches.map((row) => row.map((s) => ({ ...s })));
}

export function useColorSwatches() {
  const [swatches, setSwatches] = useState<ColorSwatch[][]>(loadSwatches);

  const save = useCallback((next: ColorSwatch[][]) => {
    setSwatches(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  useEffect(() => {
    setSwatches(loadSwatches());
  }, []);

  return { swatches, save };
}
