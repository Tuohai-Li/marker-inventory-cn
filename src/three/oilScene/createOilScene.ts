import * as THREE from "three";
import { OIL_PALETTE, OIL_SCENE_CONFIG } from "./config";
import { loadImportedOilAssets } from "./importedAssets";
import { createOilMaterialKit } from "./materials";
import { buildNotebook } from "./notebook";
import { buildDeskProps } from "./props";
import type {
  Disposable,
  OilSceneController,
  OilSceneDiagnostics,
  SceneMotionHandles,
  ScenePose,
  TrackResource,
} from "./types";
import { buildWorld } from "./world";

const overviewCamera = new THREE.Vector3(...OIL_SCENE_CONFIG.overviewCamera);
const focusCamera = new THREE.Vector3(...OIL_SCENE_CONFIG.focusCamera);
const overviewTarget = new THREE.Vector3(...OIL_SCENE_CONFIG.overviewTarget);
const focusTarget = new THREE.Vector3(...OIL_SCENE_CONFIG.focusTarget);

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

export function createOilScene(
  canvas: HTMLCanvasElement,
  initialReducedMotion: boolean,
): OilSceneController {
  const resources = new Set<Disposable>();
  const track: TrackResource = (resource) => {
    resources.add(resource);
    return resource;
  };
  const renderer = track(
    new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    }),
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#cbdedb");
  scene.fog = new THREE.FogExp2("#cad8d0", 0.018);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  const materials = createOilMaterialKit(track);
  const world = buildWorld(scene, materials, track);
  const notebook = buildNotebook(scene, materials, track);
  const deskProps = buildDeskProps(scene, materials, track);

  const ambient = new THREE.HemisphereLight("#dfeaf1", "#99735c", 2.05);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight("#ffe8c7", 2.85);
  sun.position.set(-4.2, 6.2, 4.8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 24;
  sun.shadow.camera.left = -6.8;
  sun.shadow.camera.right = 6.8;
  sun.shadow.camera.top = 6.8;
  sun.shadow.camera.bottom = -6.8;
  sun.shadow.bias = -0.0002;
  sun.shadow.normalBias = 0.035;
  scene.add(sun);
  const fill = new THREE.DirectionalLight("#cce1e9", 0.82);
  fill.position.set(4.5, 3.2, 2.4);
  scene.add(fill);

  const motion: SceneMotionHandles = { ...world, notebook };
  const pointer = new THREE.Vector2();
  const easedPointer = new THREE.Vector2();
  const lookTarget = new THREE.Vector3();
  let pose: ScenePose = "overview";
  let poseValue = 0;
  let poseTarget = 0;
  let poseStart = 0;
  let poseFrom = 0;
  let lastTimeMs = 0;
  let motionTime = 0;
  let motionTick = 0;
  let reducedMotion = initialReducedMotion;
  let animationActive = !initialReducedMotion;
  let pixelRatio = 1;
  let disposed = false;

  camera.position.copy(overviewCamera);
  camera.lookAt(overviewTarget);

  const diagnostics: OilSceneDiagnostics = {
    pose,
    assets: {
      deskProps: "loading",
      foliage: "loading",
      meshes: 0,
      materials: 0,
      textures: 0,
      triangles: 0,
    },
    drawCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    motionTick,
    reducedMotion,
    animationActive,
    pixelRatio,
  };
  const importedAssets = loadImportedOilAssets({
    scene,
    proceduralDeskProps: deskProps.group,
    proceduralFoliage: world.proceduralFoliage,
    treeCrowns: motion.treeCrowns,
    diagnostics: diagnostics.assets,
    track,
  });
  void importedAssets.ready;

  function updateMotion(deltaSeconds: number) {
    if (reducedMotion || !animationActive) return;
    motionTime += Math.min(deltaSeconds, 0.05);
    motionTick += 1;
    motion.treeCrowns.forEach(({ group, phase, amplitude }) => {
      group.rotation.z = Math.sin(motionTime * 0.72 + phase) * amplitude;
      group.rotation.x = Math.cos(motionTime * 0.48 + phase) * amplitude * 0.4;
    });
    motion.clouds.forEach(({ group, speed, startX, width }, index) => {
      const offset = (motionTime * speed + index * 2.1) % width;
      group.position.x = startX - width / 2 + offset;
    });
    motion.curtains.forEach(({ mesh, phase }) => {
      mesh.rotation.z = Math.sin(motionTime * 0.38 + phase) * 0.009;
    });
    motion.waterMaterial.uniforms.uTime.value = motionTime;
  }

  function updatePose(timeMs: number) {
    if (reducedMotion) {
      poseValue = poseTarget;
    } else if (Math.abs(poseValue - poseTarget) > 0.0001) {
      const elapsed = Math.min((timeMs - poseStart) / OIL_SCENE_CONFIG.focusDurationMs, 1);
      const eased = easeOutCubic(elapsed);
      poseValue = THREE.MathUtils.lerp(poseFrom, poseTarget, eased);
    }
    easedPointer.lerp(pointer, reducedMotion ? 1 : 0.075);
    camera.position.lerpVectors(overviewCamera, focusCamera, poseValue);
    camera.position.x += easedPointer.x * 0.11 * (1 - poseValue);
    camera.position.y += easedPointer.y * 0.06 * (1 - poseValue);
    lookTarget.lerpVectors(overviewTarget, focusTarget, poseValue);
    camera.lookAt(lookTarget);
    motion.notebook.position.y = -1.1 + THREE.MathUtils.lerp(
      OIL_SCENE_CONFIG.overviewBookLift,
      OIL_SCENE_CONFIG.focusBookLift,
      poseValue,
    );
    motion.notebook.rotation.x = THREE.MathUtils.lerp(-0.035, 0.015, poseValue);
  }

  return {
    setPose(nextPose, immediate = false) {
      pose = nextPose;
      poseTarget = nextPose === "focus" ? 1 : 0;
      poseFrom = poseValue;
      poseStart = lastTimeMs || performance.now();
      if (immediate || reducedMotion) poseValue = poseTarget;
      diagnostics.pose = pose;
    },
    setPointer(x, y) {
      pointer.set(THREE.MathUtils.clamp(x, -1, 1), THREE.MathUtils.clamp(y, -1, 1));
    },
    setReducedMotion(value) {
      reducedMotion = value;
      animationActive = !value && animationActive;
      diagnostics.reducedMotion = value;
      diagnostics.animationActive = animationActive;
      if (value) {
        poseValue = poseTarget;
        pointer.set(0, 0);
        easedPointer.set(0, 0);
      }
    },
    setAnimationActive(active) {
      animationActive = active && !reducedMotion;
      diagnostics.animationActive = animationActive;
    },
    resize(width, height, nextPixelRatio) {
      if (width < 1 || height < 1) return;
      pixelRatio = nextPixelRatio;
      renderer.setPixelRatio(nextPixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      diagnostics.pixelRatio = nextPixelRatio;
    },
    render(timeMs) {
      if (disposed) return;
      const deltaSeconds = lastTimeMs > 0 ? Math.max(0, (timeMs - lastTimeMs) / 1000) : 0;
      lastTimeMs = timeMs;
      updateMotion(deltaSeconds);
      updatePose(timeMs);
      renderer.render(scene, camera);
      diagnostics.drawCalls = renderer.info.render.calls;
      diagnostics.triangles = renderer.info.render.triangles;
      diagnostics.geometries = renderer.info.memory.geometries;
      diagnostics.textures = renderer.info.memory.textures;
      diagnostics.motionTick = motionTick;
    },
    getDiagnostics() {
      return { ...diagnostics };
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      importedAssets.dispose();
      resources.forEach((resource) => resource.dispose());
      resources.clear();
      scene.clear();
    },
  };
}
