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
  const stagedRoots = new THREE.Group();
  stagedRoots.name = "ImportedOilAssetsStaging";
  stagedRoots.visible = false;
  options.scene.add(stagedRoots);

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

  function disposeUntrackedResources(summary: ImportedResourceSummary) {
    summary.geometries.forEach((geometry) => {
      if (!loadedGeometries.has(geometry)) geometry.dispose();
    });
    summary.materials.forEach((material) => {
      if (!loadedMaterials.has(material)) material.dispose();
    });
    summary.textures.forEach((texture) => {
      if (!loadedTextures.has(texture)) texture.dispose();
    });
  }

  const ready = Promise.all(
    Object.values(IMPORTED_OIL_ASSETS).map(async ({ url, targetSize }) => {
      try {
        const gltf = await loader.loadAsync(url);
        const root = normalizeImportedRoot(gltf.scene, targetSize);
        const summary = collectImportedResources(root);
        root.userData.importedAssetTriangles = summary.triangles;

        if (disposed) {
          disposeUntrackedResources(summary);
          return;
        }

        registerResources(summary);
        stagedRoots.add(root);
        attachedRoots.add(root);
      } catch {
        // Fallback state and grouped error reporting are owned by Tasks 4 and 5.
      }
    }),
  ).then(() => undefined);

  return {
    ready,
    dispose() {
      if (disposed) return;
      disposed = true;
      attachedRoots.forEach((root) => root.removeFromParent());
      attachedRoots.clear();
      stagedRoots.removeFromParent();
    },
  };
}
