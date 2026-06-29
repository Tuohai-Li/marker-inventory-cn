import type { Marker } from "@/types";
import { markersStore } from "@/data/store";
import { getLowStockFromStore } from "./inventory.helpers";

export async function getLowStockMarkers(threshold = 3): Promise<Marker[]> {
  return getLowStockFromStore(markersStore, threshold);
}
