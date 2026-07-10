import * as THREE from "three";
import { createRingGeometry, createRoundedPanelGeometry } from "./geometry";
import type { OilMaterialKit } from "./materials";
import type { TrackResource } from "./types";

export function buildNotebook(
  scene: THREE.Scene,
  materials: OilMaterialKit,
  track: TrackResource,
) {
  const notebook = new THREE.Group();
  notebook.name = "looseLeafNotebook";
  notebook.position.set(0, -1.1, 0.78);
  notebook.rotation.x = -0.035;

  const backing = new THREE.Mesh(
    createRoundedPanelGeometry(track, 6.65, 4.35, 0.18),
    materials.cloth,
  );
  backing.position.y = -0.11;
  backing.castShadow = true;
  backing.receiveShadow = true;
  notebook.add(backing);

  const pageBlock = new THREE.Mesh(
    createRoundedPanelGeometry(track, 6.28, 4.04, 0.2),
    materials.pageEdge,
  );
  pageBlock.position.set(0.08, 0.03, -0.01);
  pageBlock.castShadow = true;
  notebook.add(pageBlock);

  const topPage = new THREE.Mesh(
    createRoundedPanelGeometry(track, 6.18, 3.94, 0.055),
    materials.paper,
  );
  topPage.position.set(0.12, 0.16, -0.02);
  topPage.receiveShadow = true;
  notebook.add(topPage);

  const ringGeometry = createRingGeometry(track);
  const ringX = -3.14;
  for (let index = 0; index < 9; index += 1) {
    const z = -1.55 + index * 0.39;
    const ring = new THREE.Mesh(ringGeometry, materials.metal);
    ring.position.set(ringX, 0.3, z);
    ring.rotation.y = Math.PI / 2;
    ring.scale.set(1, 1.14, 1);
    ring.castShadow = true;
    notebook.add(ring);

    const hole = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.072, 0.072, 0.035, 12)),
      materials.ink,
    );
    hole.position.set(-2.94, 0.2, z);
    notebook.add(hole);
  }

  scene.add(notebook);
  return notebook;
}
