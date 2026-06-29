import type { Marker, MarkerWithBrand } from "@/types";
import { addMarker, brandsStore, markersStore, removeMarkerFromStore, updateMarkerInStore } from "@/data/store";
import { enrichMarkers } from "@/lib/statistics";

export type CreateMarkerInput = Omit<Marker, "id">;

function withBrandNames(markers: Marker[]): MarkerWithBrand[] {
  return enrichMarkers(markers, brandsStore);
}

export async function getMarkers(): Promise<MarkerWithBrand[]> {
  return withBrandNames(markersStore);
}

export async function getMarkerById(id: number): Promise<MarkerWithBrand | undefined> {
  const marker = markersStore.find((m) => m.id === id);
  if (!marker) return undefined;
  return withBrandNames([marker])[0];
}

export async function createMarker(data: CreateMarkerInput): Promise<MarkerWithBrand> {
  if (!brandsStore.some((b) => b.id === data.brandId)) {
    throw new Error("品牌不存在，请先添加品牌");
  }
  const marker: Marker = { ...data, id: Date.now() };
  addMarker(marker);
  return withBrandNames([marker])[0];
}

export async function updateMarker(
  id: number,
  data: Partial<CreateMarkerInput>,
): Promise<MarkerWithBrand> {
  const index = markersStore.findIndex((m) => m.id === id);
  if (index === -1) throw new Error("Marker not found");

  if (data.brandId !== undefined && !brandsStore.some((b) => b.id === data.brandId)) {
    throw new Error("品牌不存在");
  }

  updateMarkerInStore(id, data);
  const updated = markersStore.find((m) => m.id === id)!;
  return withBrandNames([updated])[0];
}

export async function deleteMarker(id: number): Promise<void> {
  removeMarkerFromStore(id);
}

export async function getMarkersRaw(): Promise<Marker[]> {
  return [...markersStore];
}
