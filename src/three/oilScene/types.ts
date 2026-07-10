import type * as THREE from "three";

export type ScenePose = "overview" | "focus";

export interface OilSceneDiagnostics {
  pose: ScenePose;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  motionTick: number;
  reducedMotion: boolean;
  animationActive: boolean;
  pixelRatio: number;
}

export interface OilSceneController {
  setPose(pose: ScenePose, immediate?: boolean): void;
  setPointer(x: number, y: number): void;
  setReducedMotion(reducedMotion: boolean): void;
  setAnimationActive(active: boolean): void;
  resize(width: number, height: number, pixelRatio: number): void;
  render(timeMs: number): void;
  getDiagnostics(): OilSceneDiagnostics;
  dispose(): void;
}

export interface SceneMotionHandles {
  treeCrowns: Array<{ group: THREE.Group; phase: number; amplitude: number }>;
  clouds: Array<{ group: THREE.Group; speed: number; startX: number; width: number }>;
  curtains: Array<{ mesh: THREE.Mesh; phase: number }>;
  waterMaterial: THREE.ShaderMaterial;
  notebook: THREE.Group;
}

export interface Disposable {
  dispose: () => void;
}

export type TrackResource = <T extends Disposable>(resource: T) => T;
