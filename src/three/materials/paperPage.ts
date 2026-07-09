import * as THREE from "three";

/** Subtle paper grain overlay blended on page textures. */
let cachedGrain: THREE.CanvasTexture | null = null;

function createPaperGrainTexture(): THREE.CanvasTexture {
  if (cachedGrain) return cachedGrain;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const v = 240 + (Math.random() - 0.5) * 18;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  cachedGrain = texture;
  return texture;
}

export interface PageMaterialOptions {
  isBack?: boolean;
  side?: THREE.Side;
  /** 翻页纹理用无光照材质，与 DOM 截图像素一致 */
  unlit?: boolean;
}

export function createPageMaterial(
  frontMap: THREE.Texture | null,
  options: PageMaterialOptions = {},
): THREE.MeshStandardMaterial | THREE.MeshBasicMaterial {
  const { isBack = false, side = THREE.FrontSide, unlit = false } = options;

  if (unlit && frontMap) {
    return new THREE.MeshBasicMaterial({ map: frontMap, side });
  }

  const material = new THREE.MeshStandardMaterial({
    color: frontMap ? "#ffffff" : isBack ? "#efe8d6" : "#f5eedc",
    roughness: 0.88,
    metalness: 0,
    side,
    bumpMap: createPaperGrainTexture(),
    bumpScale: isBack ? 0.001 : 0.002,
  });
  if (frontMap) material.map = frontMap;
  return material;
}
