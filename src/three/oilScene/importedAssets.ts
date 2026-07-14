import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { IMPORTED_OIL_ASSETS } from "./importedAssetManifest";
import type { ImportedAssetDiagnostics, SceneMotionHandles, TrackResource } from "./types";

export interface ImportedOilAssetHandle {
  ready: Promise<void>;
  dispose(): void;
}

export interface ImportedOilAssetOptions {
  scene: THREE.Scene;
  proceduralDeskProps: THREE.Group;
  proceduralFoliage: THREE.Group;
  treeCrowns: SceneMotionHandles["treeCrowns"];
  diagnostics: ImportedAssetDiagnostics;
  track: TrackResource;
}

interface ImportedResourceSummary {
  meshes: Set<THREE.Mesh>;
  geometries: Set<THREE.BufferGeometry>;
  materials: Set<THREE.Material>;
  textures: Set<THREE.Texture>;
  triangles: number;
}

interface ImportedDeskRoots {
  marker: THREE.Group;
  cup: THREE.Group;
  swatches: THREE.Group;
}

const markerPositions = [
  [-4.15, -1.12, 0.55],
  [-3.72, -1.12, 0.78],
  [-3.48, -1.13, 1.12],
  [3.55, -1.12, 0.52],
  [3.9, -1.12, 0.84],
  [4.2, -1.12, 1.18],
  [3.72, -1.12, 1.5],
  [-3.98, -1.12, 1.45],
] as const;

function countMeshTriangles(mesh: THREE.Mesh) {
  const index = mesh.geometry.getIndex();
  if (index) return index.count / 3;
  return (mesh.geometry.getAttribute("position")?.count ?? 0) / 3;
}

function collectMaterialTextures(material: THREE.Material, textures: Set<THREE.Texture>) {
  Object.values(material).forEach((value) => {
    if (value instanceof THREE.Texture) textures.add(value);
  });
}

function collectImportedResources(root: THREE.Group): ImportedResourceSummary {
  const summary: ImportedResourceSummary = {
    meshes: new Set(),
    geometries: new Set(),
    materials: new Set(),
    textures: new Set(),
    triangles: 0,
  };

  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || summary.meshes.has(object)) return;

    summary.meshes.add(object);
    summary.triangles += countMeshTriangles(object);
    summary.geometries.add(object.geometry);
    object.castShadow = true;

    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if (summary.materials.has(material)) return;

      summary.materials.add(material);
      if (material instanceof THREE.MeshStandardMaterial) {
        material.roughness = Math.max(material.roughness, 0.62);
        material.metalness = Math.min(material.metalness, 0.2);
      }
      collectMaterialTextures(material, summary.textures);
    });
  });

  return summary;
}

function disposeImportedResources(root: THREE.Group) {
  const summary = collectImportedResources(root);
  summary.geometries.forEach((geometry) => geometry.dispose());
  summary.materials.forEach((material) => material.dispose());
  summary.textures.forEach((texture) => texture.dispose());
}

function addPlacedRoot(
  parent: THREE.Group,
  root: THREE.Group,
  position: readonly [number, number, number],
  rotation: readonly [number, number, number] = [0, 0, 0],
) {
  const wrapper = new THREE.Group();
  wrapper.position.set(...position);
  wrapper.rotation.set(...rotation);
  wrapper.add(root);
  parent.add(wrapper);
}

function createImportedDeskProps({ marker, cup, swatches }: ImportedDeskRoots) {
  const group = new THREE.Group();
  group.name = "ImportedDeskProps";

  markerPositions.forEach((position, index) => {
    const rotationZ = index < 3 || index === 7 ? -0.72 + index * 0.08 : 0.65 + index * 0.035;
    addPlacedRoot(group, marker.clone(true), position, [Math.PI / 2, 0, rotationZ]);
  });
  addPlacedRoot(group, cup, [4.15, -1.34, -0.1]);
  addPlacedRoot(group, swatches, [-4.0, -1.34, 2.0], [0, -0.42, 0]);

  return group;
}

export function normalizeImportedRoot(root: THREE.Group, targetSize: number): THREE.Group {
  root.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(root);
  const size = bounds.getSize(new THREE.Vector3());
  const largestDimension = Math.max(size.x, size.y, size.z);

  if (largestDimension === 0) return root;

  root.scale.multiplyScalar(targetSize / largestDimension);
  root.updateMatrixWorld(true);

  const scaledBounds = new THREE.Box3().setFromObject(root);
  root.position.x -= (scaledBounds.min.x + scaledBounds.max.x) / 2;
  root.position.z -= (scaledBounds.min.z + scaledBounds.max.z) / 2;
  root.position.y -= scaledBounds.min.y;
  root.updateMatrixWorld(true);
  return root;
}

export function loadImportedOilAssets(options: ImportedOilAssetOptions): ImportedOilAssetHandle {
  const loader = new GLTFLoader();
  const attachedRoots = new Set<THREE.Group>();
  const loadedMeshes = new Set<THREE.Mesh>();
  const loadedGeometries = new Set<THREE.BufferGeometry>();
  const loadedMaterials = new Set<THREE.Material>();
  const loadedTextures = new Set<THREE.Texture>();
  let disposed = false;

  function registerResources(summary: ImportedResourceSummary) {
    summary.meshes.forEach((mesh) => loadedMeshes.add(mesh));
    summary.geometries.forEach((geometry) => {
      if (loadedGeometries.has(geometry)) return;
      loadedGeometries.add(geometry);
      options.track(geometry);
    });
    summary.materials.forEach((material) => {
      if (loadedMaterials.has(material)) return;
      loadedMaterials.add(material);
      options.track(material);
    });
    summary.textures.forEach((texture) => {
      if (loadedTextures.has(texture)) return;
      loadedTextures.add(texture);
      options.track(texture);
    });
    options.diagnostics.meshes = loadedMeshes.size;
    options.diagnostics.materials = loadedMaterials.size;
    options.diagnostics.textures = loadedTextures.size;
  }

  async function loadNormalizedRoot(name: keyof typeof IMPORTED_OIL_ASSETS) {
    const { url, targetSize } = IMPORTED_OIL_ASSETS[name];
    const gltf = await loader.loadAsync(url);
    return normalizeImportedRoot(gltf.scene, targetSize);
  }

  const deskLoads = [
    loadNormalizedRoot("marker"),
    loadNormalizedRoot("cup"),
    loadNormalizedRoot("swatches"),
  ] as const;

  const ready = Promise.all(deskLoads)
    .then(([marker, cup, swatches]) => {
      const importedDeskProps = createImportedDeskProps({ marker, cup, swatches });
      if (disposed) {
        disposeImportedResources(importedDeskProps);
        return;
      }

      const summary = collectImportedResources(importedDeskProps);
      registerResources(summary);
      options.diagnostics.triangles += summary.triangles;
      options.scene.add(importedDeskProps);
      attachedRoots.add(importedDeskProps);
      options.proceduralDeskProps.visible = false;
      options.diagnostics.deskProps = "loaded";
    })
    .catch(async () => {
      const results = await Promise.allSettled(deskLoads);
      results.forEach((result) => {
        if (result.status !== "fulfilled") return;
        result.value.removeFromParent();
        disposeImportedResources(result.value);
      });
      if (disposed) return;

      options.proceduralDeskProps.visible = true;
      options.diagnostics.deskProps = "fallback";
      console.error("Unable to load Tripo desk props");
    });

  return {
    ready,
    dispose() {
      if (disposed) return;
      disposed = true;
      attachedRoots.forEach((root) => root.removeFromParent());
      attachedRoots.clear();
    },
  };
}
