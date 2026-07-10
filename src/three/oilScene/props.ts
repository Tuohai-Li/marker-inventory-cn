import * as THREE from "three";
import type { OilMaterialKit } from "./materials";
import type { TrackResource } from "./types";

function composeMarkerMatrix(
  object: THREE.Object3D,
  position: readonly [number, number, number],
  rotationZ: number,
) {
  object.position.set(...position);
  object.rotation.set(Math.PI / 2, 0, rotationZ);
  object.updateMatrix();
  return object.matrix;
}

export function buildDeskProps(
  scene: THREE.Scene,
  materials: OilMaterialKit,
  track: TrackResource,
) {
  const markerGeometry = track(new THREE.CylinderGeometry(0.075, 0.075, 1.2, 12));
  const capGeometry = track(new THREE.CylinderGeometry(0.086, 0.086, 0.2, 12));
  const markerBodies = new THREE.InstancedMesh(markerGeometry, materials.markerBody, 8);
  const capMaterial = track(
    new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.62,
      metalness: 0,
      vertexColors: true,
    }),
  );
  const markerCaps = new THREE.InstancedMesh(capGeometry, capMaterial, 8);
  const helper = new THREE.Object3D();
  const colors = ["#748f7b", "#d18875", "#7d8ba5", "#c8a45e", "#9c7f98", "#5e7f77", "#b36f62", "#7f8f65"];
  const positions = [
    [-4.15, -1.12, 0.55],
    [-3.72, -1.12, 0.78],
    [-3.48, -1.13, 1.12],
    [3.55, -1.12, 0.52],
    [3.9, -1.12, 0.84],
    [4.2, -1.12, 1.18],
    [3.72, -1.12, 1.5],
    [-3.98, -1.12, 1.45],
  ] as const;

  positions.forEach((position, index) => {
    const rotationZ = index < 3 || index === 7 ? -0.72 + index * 0.08 : 0.65 + index * 0.035;
    markerBodies.setMatrixAt(index, composeMarkerMatrix(helper, position, rotationZ));
    helper.position.y += 0.02;
    helper.translateY(0.5);
    helper.updateMatrix();
    markerCaps.setMatrixAt(index, helper.matrix);
    markerCaps.setColorAt(index, new THREE.Color(colors[index]));
  });
  markerBodies.castShadow = true;
  markerCaps.castShadow = true;
  scene.add(markerBodies, markerCaps);

  const cup = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.38, 0.32, 0.88, 18, 1, true)),
    materials.ceramic,
  );
  cup.position.set(4.15, -0.9, -0.1);
  cup.castShadow = true;
  scene.add(cup);

  const cupHandle = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.24, 0.055, 8, 18, Math.PI * 1.5)),
    materials.ceramic,
  );
  cupHandle.position.set(4.5, -0.88, -0.1);
  cupHandle.rotation.y = Math.PI / 2;
  scene.add(cupHandle);

  const swatchGeometry = track(new THREE.BoxGeometry(0.86, 0.025, 0.24));
  const swatchMaterials = colors.slice(0, 6).map((color) =>
    track(new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0 })),
  );
  for (let index = 0; index < 6; index += 1) {
    const swatch = new THREE.Mesh(swatchGeometry, swatchMaterials[index]);
    swatch.position.set(-4.05 + index * 0.08, -1.3 + index * 0.006, 2.02 + index * 0.14);
    swatch.rotation.y = -0.42 + index * 0.055;
    scene.add(swatch);
  }
}
