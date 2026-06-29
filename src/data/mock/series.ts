import type { Marker, Series } from "@/types";
import { mockMarkers } from "./markers";

export function buildSeriesFromMarkers(markers: Marker[]): Series[] {
  const seen = new Set<string>();
  const result: Series[] = [];
  let id = 1;

  for (const marker of markers) {
    if (!marker.series || marker.series === "-") continue;
    const key = `${marker.brandId}:${marker.series}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ id: id++, brandId: marker.brandId, name: marker.series });
  }

  return result;
}

export const mockSeries: Series[] = buildSeriesFromMarkers(mockMarkers);
