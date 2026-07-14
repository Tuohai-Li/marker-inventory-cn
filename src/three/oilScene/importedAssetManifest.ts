import cupUrl from "@/assets/models/oil-scene/cup.glb?url";
import foliageUrl from "@/assets/models/oil-scene/foliage-kit.glb?url";
import markerUrl from "@/assets/models/oil-scene/marker.glb?url";
import swatchesUrl from "@/assets/models/oil-scene/swatches.glb?url";

export const IMPORTED_OIL_ASSETS = {
  marker: { url: markerUrl, targetSize: 1.2 },
  cup: { url: cupUrl, targetSize: 0.9 },
  swatches: { url: swatchesUrl, targetSize: 1.1 },
  foliage: { url: foliageUrl, targetSize: 2.25 },
} as const;
