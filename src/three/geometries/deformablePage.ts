import * as THREE from "three";

export const PAGE_SEGMENTS_X = 48;
export const PAGE_SEGMENTS_Y = 36;

/** Create a subdivided page plane with the spine (left edge) at x = 0. */
export function createDeformablePageGeometry(
  width: number,
  height: number,
  segmentsX = PAGE_SEGMENTS_X,
  segmentsY = PAGE_SEGMENTS_Y,
): THREE.PlaneGeometry {
  const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
  geometry.translate(width / 2, 0, 0);
  return geometry;
}

export function snapshotPositions(geometry: THREE.BufferGeometry): Float32Array {
  const array = geometry.attributes.position.array;
  return new Float32Array(array);
}

export interface CurlOptions {
  /** Total flip progress 0 (flat) → 1 (turned). */
  progress: number;
  pageWidth: number;
  /** How much the outer edge leads the spine (0–1). */
  edgeLead?: number;
  /** Max rotation in radians (default π). */
  maxAngle?: number;
}

/**
 * Apply a natural page curl: spine fixed at x=0, outer edge rotates first.
 * Mutates geometry positions in place — no React re-render needed.
 */
export function applyCurlDeformation(
  geometry: THREE.BufferGeometry,
  originalPositions: Float32Array,
  options: CurlOptions,
): void {
  const { progress, pageWidth, edgeLead = 0.42, maxAngle = Math.PI * 0.98 } = options;
  const positions = geometry.attributes.position;

  for (let i = 0; i < positions.count; i++) {
    const ox = originalPositions[i * 3];
    const oy = originalPositions[i * 3 + 1];

    const u = THREE.MathUtils.clamp(ox / pageWidth, 0, 1);
    const denom = 1 - u * edgeLead + 0.001;
    const raw = (progress * (1 + edgeLead) - u * edgeLead) / denom;
    const localT = THREE.MathUtils.clamp(raw, 0, 1);
    const t = localT * localT * (3 - 2 * localT);

    const angle = t * maxAngle;
    const nx = ox * Math.cos(angle);
    const nz = ox * Math.sin(angle);

    const wave =
      Math.sin(t * Math.PI) * 0.018 * u * Math.sin(oy * 0.04 + u * 2.1);
    const lift = Math.sin(t * Math.PI) * 0.012 * u;

    positions.setXYZ(i, nx, oy + wave + lift, nz);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}

/** Reset geometry to flat resting state. */
export function resetPageGeometry(
  geometry: THREE.BufferGeometry,
  originalPositions: Float32Array,
): void {
  const positions = geometry.attributes.position;
  positions.array.set(originalPositions);
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}
