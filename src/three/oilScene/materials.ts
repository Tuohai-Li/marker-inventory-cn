import * as THREE from "three";
import { OIL_PALETTE } from "./config";
import type { TrackResource } from "./types";

function createSeededRandom(seed = 4729) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function createCanvasGrainTexture(track: TrackResource) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create oil-paint grain texture");

  const random = createSeededRandom();
  context.fillStyle = "#eee9dc";
  context.fillRect(0, 0, size, size);

  for (let index = 0; index < 90; index += 1) {
    const value = Math.round(206 + random() * 42);
    const alpha = 0.08 + random() * 0.12;
    context.strokeStyle = `rgba(${value}, ${value}, ${value - 5}, ${alpha})`;
    context.lineWidth = 2 + random() * 7;
    context.lineCap = "round";
    const x = random() * size;
    const y = random() * size;
    context.beginPath();
    context.moveTo(x, y);
    context.bezierCurveTo(
      x + 8 + random() * 20,
      y - 3 + random() * 6,
      x + 22 + random() * 26,
      y - 4 + random() * 8,
      x + 36 + random() * 30,
      y - 5 + random() * 10,
    );
    context.stroke();
  }

  const texture = track(new THREE.CanvasTexture(canvas));
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.8, 2.8);
  texture.anisotropy = 4;
  return texture;
}

function oilMaterial(
  track: TrackResource,
  grain: THREE.Texture,
  color: THREE.ColorRepresentation,
  options: Partial<THREE.MeshStandardMaterialParameters> = {},
) {
  return track(
    new THREE.MeshStandardMaterial({
      color,
      map: grain,
      bumpMap: grain,
      bumpScale: 0.032,
      roughness: 0.86,
      metalness: 0,
      ...options,
    }),
  );
}

export interface OilMaterialKit {
  grain: THREE.CanvasTexture;
  wall: THREE.MeshStandardMaterial;
  frame: THREE.MeshStandardMaterial;
  curtain: THREE.MeshStandardMaterial;
  wood: THREE.MeshStandardMaterial;
  woodDark: THREE.MeshStandardMaterial;
  foliageDark: THREE.MeshStandardMaterial;
  foliageMid: THREE.MeshStandardMaterial;
  foliageLight: THREE.MeshStandardMaterial;
  flower: THREE.MeshStandardMaterial;
  mountainFar: THREE.MeshStandardMaterial;
  mountainNear: THREE.MeshStandardMaterial;
  cloud: THREE.MeshStandardMaterial;
  paper: THREE.MeshStandardMaterial;
  pageEdge: THREE.MeshStandardMaterial;
  cloth: THREE.MeshStandardMaterial;
  ink: THREE.MeshStandardMaterial;
  ceramic: THREE.MeshStandardMaterial;
  markerBody: THREE.MeshStandardMaterial;
  metal: THREE.MeshStandardMaterial;
}

export function createOilMaterialKit(track: TrackResource): OilMaterialKit {
  const grain = createCanvasGrainTexture(track);
  return {
    grain,
    wall: oilMaterial(track, grain, OIL_PALETTE.wall),
    frame: oilMaterial(track, grain, "#ece7d9", { roughness: 0.8 }),
    curtain: oilMaterial(track, grain, OIL_PALETTE.curtain, {
      side: THREE.DoubleSide,
      roughness: 0.96,
    }),
    wood: oilMaterial(track, grain, OIL_PALETTE.wood, { roughness: 0.73 }),
    woodDark: oilMaterial(track, grain, OIL_PALETTE.woodDark, { roughness: 0.82 }),
    foliageDark: oilMaterial(track, grain, OIL_PALETTE.foliageDark),
    foliageMid: oilMaterial(track, grain, OIL_PALETTE.foliageMid),
    foliageLight: oilMaterial(track, grain, OIL_PALETTE.foliageLight),
    flower: oilMaterial(track, grain, OIL_PALETTE.flower, { roughness: 0.78 }),
    mountainFar: oilMaterial(track, grain, OIL_PALETTE.mountainFar, {
      side: THREE.DoubleSide,
    }),
    mountainNear: oilMaterial(track, grain, OIL_PALETTE.mountainNear, {
      side: THREE.DoubleSide,
    }),
    cloud: oilMaterial(track, grain, "#eee8df", {
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    }),
    paper: oilMaterial(track, grain, OIL_PALETTE.paper, { roughness: 0.94 }),
    pageEdge: oilMaterial(track, grain, "#d9ccb0", { roughness: 0.96 }),
    cloth: oilMaterial(track, grain, OIL_PALETTE.cloth, { roughness: 0.98 }),
    ink: oilMaterial(track, grain, OIL_PALETTE.ink, { roughness: 0.9 }),
    ceramic: oilMaterial(track, grain, OIL_PALETTE.ceramic, { roughness: 0.4 }),
    markerBody: oilMaterial(track, grain, "#dedbd0", { roughness: 0.55 }),
    metal: track(
      new THREE.MeshStandardMaterial({
        color: "#a7a6a1",
        metalness: 0.62,
        roughness: 0.38,
      }),
    ),
  };
}
