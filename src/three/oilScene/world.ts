import * as THREE from "three";
import oilWindowBackdropUrl from "@/assets/oil-window-backdrop.webp";
import { OIL_PALETTE } from "./config";
import { createCloudGeometry, createLeafGeometry } from "./geometry";
import type { OilMaterialKit } from "./materials";
import type { TrackResource, WorldBuildResult } from "./types";

function addBox(
  parent: THREE.Object3D,
  track: TrackResource,
  material: THREE.Material,
  size: readonly [number, number, number],
  position: readonly [number, number, number],
) {
  const mesh = new THREE.Mesh(track(new THREE.BoxGeometry(...size)), material);
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function createSkyMaterial(track: TrackResource) {
  return track(
    new THREE.ShaderMaterial({
      depthWrite: false,
      uniforms: {
        uTop: { value: new THREE.Color(OIL_PALETTE.sky) },
        uHorizon: { value: new THREE.Color(OIL_PALETTE.horizon) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uTop;
        uniform vec3 uHorizon;
        void main() {
          float stroke = sin(vUv.y * 42.0 + sin(vUv.x * 8.0) * 1.6) * 0.018;
          vec3 color = mix(uHorizon, uTop, smoothstep(0.08, 0.96, vUv.y + stroke));
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    }),
  );
}

function createWaterMaterial(track: TrackResource) {
  return track(
    new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uDeepColor: { value: new THREE.Color(OIL_PALETTE.lakeDeep) },
        uLightColor: { value: new THREE.Color(OIL_PALETTE.lakeLight) },
        uSunColor: { value: new THREE.Color("#f6dfba") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uDeepColor;
        uniform vec3 uLightColor;
        uniform vec3 uSunColor;
        void main() {
          float band = sin((vUv.x * 19.0 + vUv.y * 7.0) + uTime * 0.22);
          float fine = sin(vUv.x * 43.0 - uTime * 0.36) * 0.5 + 0.5;
          float glint = smoothstep(0.91, 1.0, fine) * smoothstep(0.3, 0.95, vUv.y);
          vec3 color = mix(uDeepColor, uLightColor, clamp(vUv.y + band * 0.045, 0.0, 1.0));
          color += uSunColor * glint * 0.14;
          gl_FragColor = vec4(color, 0.62);
        }
      `,
    }),
  );
}

function addTree(
  parent: THREE.Object3D,
  materials: OilMaterialKit,
  track: TrackResource,
  x: number,
  z: number,
  scale: number,
  phase: number,
) {
  const trunk = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.11 * scale, 0.18 * scale, 1.5 * scale, 7)),
    materials.woodDark,
  );
  trunk.position.set(x, -0.05 + 0.65 * scale, z);
  parent.add(trunk);

  const crown = new THREE.Group();
  crown.position.set(x, 1.15 * scale, z);
  const leafGeometry = createLeafGeometry(track);
  const leafMaterials = [materials.foliageDark, materials.foliageMid, materials.foliageLight];
  const offsets = [
    [-0.42, 0.08, 0],
    [0, 0.33, -0.05],
    [0.46, 0.06, 0.04],
    [-0.1, -0.18, 0.1],
    [0.22, -0.12, -0.12],
  ] as const;
  offsets.forEach((offset, index) => {
    const leaf = new THREE.Mesh(leafGeometry, leafMaterials[index % leafMaterials.length]);
    leaf.position.set(offset[0] * scale, offset[1] * scale, offset[2] * scale);
    leaf.scale.setScalar(scale * (0.92 + (index % 2) * 0.16));
    crown.add(leaf);
  });
  parent.add(crown);
  return { group: crown, phase, amplitude: 0.014 + scale * 0.008 };
}

function addFlowerMass(
  parent: THREE.Object3D,
  materials: OilMaterialKit,
  track: TrackResource,
  x: number,
  y: number,
  z: number,
) {
  const leafGeometry = createLeafGeometry(track);
  const flowerGeometry = track(new THREE.SphereGeometry(0.1, 7, 5));
  const group = new THREE.Group();
  group.position.set(x, y, z);
  for (let index = 0; index < 10; index += 1) {
    const angle = index * 1.7;
    const radius = 0.22 + (index % 3) * 0.12;
    const leaf = new THREE.Mesh(
      leafGeometry,
      index % 2 === 0 ? materials.foliageDark : materials.foliageMid,
    );
    leaf.scale.setScalar(0.48 + (index % 3) * 0.08);
    leaf.position.set(Math.cos(angle) * radius, (index % 4) * 0.12, Math.sin(angle) * radius);
    group.add(leaf);
    if (index % 2 === 0) {
      const flower = new THREE.Mesh(flowerGeometry, materials.flower);
      flower.position.copy(leaf.position).add(new THREE.Vector3(0.03, 0.14, 0.08));
      group.add(flower);
    }
  }
  parent.add(group);
}

export function buildWorld(
  scene: THREE.Scene,
  materials: OilMaterialKit,
  track: TrackResource,
): WorldBuildResult {
  const sky = new THREE.Mesh(track(new THREE.PlaneGeometry(20, 9)), createSkyMaterial(track));
  sky.position.set(0, 2.45, -13.2);
  scene.add(sky);

  const backdropTexture = track(new THREE.TextureLoader().load(oilWindowBackdropUrl));
  backdropTexture.colorSpace = THREE.SRGBColorSpace;
  backdropTexture.anisotropy = 4;
  const backdropMaterial = track(
    new THREE.MeshBasicMaterial({
      map: backdropTexture,
      color: "#f2eee5",
      toneMapped: false,
    }),
  );
  const backdrop = new THREE.Mesh(track(new THREE.PlaneGeometry(16.5, 8.25)), backdropMaterial);
  backdrop.position.set(0, 2.22, -13.05);
  scene.add(backdrop);

  const waterMaterial = createWaterMaterial(track);
  const water = new THREE.Mesh(track(new THREE.PlaneGeometry(8.6, 13, 1, 1)), waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0.25, -0.76, -6.3);
  scene.add(water);

  const desk = addBox(scene, track, materials.wood, [12, 0.42, 6.5], [0, -1.58, 1.45]);
  desk.receiveShadow = true;
  addBox(scene, track, materials.woodDark, [12.2, 0.12, 0.16], [0, -1.34, -1.82]);

  addBox(scene, track, materials.frame, [10.3, 0.18, 0.22], [0, -0.42, -2.15]);
  addBox(scene, track, materials.frame, [10.3, 0.18, 0.22], [0, 4.2, -2.15]);
  addBox(scene, track, materials.frame, [0.2, 4.8, 0.24], [-5.05, 1.86, -2.15]);
  addBox(scene, track, materials.frame, [0.2, 4.8, 0.24], [5.05, 1.86, -2.15]);
  addBox(scene, track, materials.frame, [10.8, 0.24, 0.7], [0, -0.55, -1.92]);

  const curtainGeometry = track(new THREE.PlaneGeometry(1.45, 5.1, 5, 10));
  const leftCurtain = new THREE.Mesh(curtainGeometry, materials.curtain);
  leftCurtain.position.set(-4.48, 1.74, -1.9);
  leftCurtain.rotation.y = 0.08;
  scene.add(leftCurtain);
  const rightCurtain = new THREE.Mesh(curtainGeometry, materials.curtain);
  rightCurtain.position.set(4.48, 1.74, -1.9);
  rightCurtain.rotation.y = -0.08;
  scene.add(rightCurtain);

  const proceduralFoliage = new THREE.Group();
  proceduralFoliage.name = "ProceduralFoliage";
  scene.add(proceduralFoliage);

  const treeCrowns = [
    addTree(proceduralFoliage, materials, track, -4.0, -5.3, 1.25, 0.1),
    addTree(proceduralFoliage, materials, track, -3.0, -7.1, 1.0, 1.7),
    addTree(proceduralFoliage, materials, track, 3.75, -5.7, 1.18, 2.8),
    addTree(proceduralFoliage, materials, track, 2.9, -7.8, 0.9, 4.1),
  ];

  addFlowerMass(proceduralFoliage, materials, track, -4.2, -0.42, -2.65);
  addFlowerMass(proceduralFoliage, materials, track, 4.2, -0.5, -2.8);

  const cloudGeometry = createCloudGeometry(track);
  const clouds: WorldBuildResult["clouds"] = [];
  [-3.2, 0.2, 3.1].forEach((x, cloudIndex) => {
    const group = new THREE.Group();
    group.position.set(x, 3.1 + cloudIndex * 0.22, -11.7 - cloudIndex * 0.18);
    for (let puff = 0; puff < 4; puff += 1) {
      const mesh = new THREE.Mesh(cloudGeometry, materials.cloud);
      mesh.position.set((puff - 1.5) * 0.48, Math.sin(puff * 1.8) * 0.12, puff * 0.04);
      mesh.scale.setScalar(0.72 + (puff % 2) * 0.24);
      group.add(mesh);
    }
    scene.add(group);
    clouds.push({ group, speed: 0.035 + cloudIndex * 0.008, startX: x, width: 8.8 });
  });

  return {
    treeCrowns,
    clouds,
    curtains: [
      { mesh: leftCurtain, phase: 0 },
      { mesh: rightCurtain, phase: Math.PI },
    ],
    waterMaterial,
    proceduralFoliage,
  };
}
