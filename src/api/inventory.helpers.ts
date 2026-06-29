import type { Marker } from "@/types";

export function getLowStockFromStore(markers: Marker[], threshold = 3): Marker[] {
  return markers.filter((m) => m.stock < threshold);
}
