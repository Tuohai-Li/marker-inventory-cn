import * as THREE from "three";
import type { TrackResource } from "./types";

export function createMountainGeometry(
  track: TrackResource,
  width: number,
  height: number,
  peaks: readonly number[],
) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  peaks.forEach((peak, index) => {
    const x = -width / 2 + (index / (peaks.length - 1)) * width;
    shape.lineTo(x, peak * height);
  });
  shape.lineTo(width / 2, -0.2);
  shape.lineTo(-width / 2, -0.2);
  shape.closePath();
  return track(new THREE.ShapeGeometry(shape));
}

export function createLeafGeometry(track: TrackResource) {
  const geometry = track(new THREE.SphereGeometry(0.36, 12, 8));
  geometry.scale(1, 0.72, 0.48);
  return geometry;
}

export function createCloudGeometry(track: TrackResource) {
  const geometry = track(new THREE.SphereGeometry(0.48, 14, 9));
  geometry.scale(1.25, 0.58, 0.38);
  return geometry;
}

export function createRingGeometry(track: TrackResource) {
  return track(new THREE.TorusGeometry(0.22, 0.035, 6, 20));
}

export function createRoundedPanelGeometry(
  track: TrackResource,
  width: number,
  height: number,
  depth: number,
) {
  return track(new THREE.BoxGeometry(width, depth, height, 2, 1, 2));
}
