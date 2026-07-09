import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { createDeformablePageGeometry } from "@/three/geometries/deformablePage";
import { createPageMaterial } from "@/three/materials/paperPage";

interface BookDeskSceneProps {
  children: ReactNode;
}

const SCENE = {
  cameraZ: 6.2,
  cameraY: 2.35,
  cameraFov: 38,
  bookWidth: 4.35,
  bookHeight: 2.85,
  bookDepth: 0.34,
  parallaxX: 0.16,
  parallaxY: 0.1,
  maxPixelRatio: 2,
};

function addDisposable(
  disposables: Array<{ dispose: () => void }>,
  disposable: { dispose: () => void },
) {
  disposables.push(disposable);
  return disposable;
}

function createMesh<T extends THREE.BufferGeometry, U extends THREE.Material>(
  geometry: T,
  material: U,
  disposables: Array<{ dispose: () => void }>,
) {
  addDisposable(disposables, geometry);
  addDisposable(disposables, material);
  return new THREE.Mesh(geometry, material);
}

function createStandardMaterial(
  color: THREE.ColorRepresentation,
  disposables: Array<{ dispose: () => void }>,
  options: Partial<THREE.MeshStandardMaterialParameters> = {},
) {
  return addDisposable(
    disposables,
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.78,
      metalness: 0,
      ...options,
    }),
  );
}

function addWindow(scene: THREE.Scene, disposables: Array<{ dispose: () => void }>) {
  const frameMaterial = createStandardMaterial("#dff2ed", disposables, {
    roughness: 0.64,
  });
  const glassMaterial = createStandardMaterial("#d8f4ff", disposables, {
    transparent: true,
    opacity: 0.45,
    roughness: 0.28,
  });
  const sillMaterial = createStandardMaterial("#f6f0dc", disposables);

  const windowGroup = new THREE.Group();
  windowGroup.position.set(-1.75, 1.85, -2.18);

  const glass = createMesh(new THREE.PlaneGeometry(2.25, 1.42), glassMaterial, disposables);
  glass.position.z = -0.01;
  windowGroup.add(glass);

  const framePieces: Array<[number, number, number, number]> = [
    [2.42, 0.1, 0, 0.75],
    [2.42, 0.1, 0, -0.75],
    [0.1, 1.58, -1.2, 0],
    [0.1, 1.58, 1.2, 0],
    [0.07, 1.42, 0, 0],
    [2.25, 0.07, 0, 0],
  ];

  for (const [width, height, x, y] of framePieces) {
    const frame = createMesh(
      new THREE.BoxGeometry(width, height, 0.06),
      frameMaterial,
      disposables,
    );
    frame.position.set(x, y, 0.04);
    windowGroup.add(frame);
  }

  const sill = createMesh(new THREE.BoxGeometry(2.7, 0.12, 0.24), sillMaterial, disposables);
  sill.position.set(0, -0.88, 0.12);
  windowGroup.add(sill);

  scene.add(windowGroup);
}

function addDeskObjects(scene: THREE.Scene, disposables: Array<{ dispose: () => void }>) {
  const pencilMaterial = createStandardMaterial("#6fa9b8", disposables, {
    roughness: 0.58,
  });
  const pencilTipMaterial = createStandardMaterial("#f6dfb5", disposables);
  const plantMaterial = createStandardMaterial("#6fa879", disposables);
  const potMaterial = createStandardMaterial("#f0b78d", disposables);

  const pencil = createMesh(
    new THREE.CylinderGeometry(0.045, 0.045, 1.3, 16),
    pencilMaterial,
    disposables,
  );
  pencil.position.set(2.38, -1.08, 0.88);
  pencil.rotation.set(Math.PI / 2, 0, -0.55);
  pencil.castShadow = true;
  scene.add(pencil);

  const tip = createMesh(
    new THREE.ConeGeometry(0.055, 0.18, 16),
    pencilTipMaterial,
    disposables,
  );
  tip.position.set(2.9, -1.08, 0.55);
  tip.rotation.set(Math.PI / 2, 0, -0.55);
  tip.castShadow = true;
  scene.add(tip);

  const pot = createMesh(new THREE.CylinderGeometry(0.28, 0.22, 0.42, 24), potMaterial, disposables);
  pot.position.set(2.35, -0.86, -0.95);
  pot.castShadow = true;
  scene.add(pot);

  for (let i = 0; i < 5; i += 1) {
    const leaf = createMesh(
      new THREE.SphereGeometry(0.17, 16, 10),
      plantMaterial,
      disposables,
    );
    leaf.position.set(2.23 + i * 0.07, -0.52 + Math.sin(i) * 0.07, -0.96 + (i - 2) * 0.08);
    leaf.scale.set(0.58, 1.05, 0.42);
    leaf.rotation.z = (i - 2) * 0.5;
    leaf.castShadow = true;
    scene.add(leaf);
  }
}

function addBook(scene: THREE.Scene, disposables: Array<{ dispose: () => void }>) {
  const group = new THREE.Group();
  group.position.set(0.05, -0.83, 0.43);
  group.rotation.x = -0.33;
  group.rotation.z = -0.015;

  const coverMaterial = createStandardMaterial("#b9d9d0", disposables, {
    roughness: 0.7,
  });
  const spineMaterial = createStandardMaterial("#8fc0b4", disposables, {
    roughness: 0.72,
  });
  const pageEdgeMaterial = createStandardMaterial("#f7f2df", disposables, {
    roughness: 0.92,
  });

  const baseCover = createMesh(
    new THREE.BoxGeometry(SCENE.bookWidth + 0.42, SCENE.bookDepth, SCENE.bookHeight + 0.34),
    coverMaterial,
    disposables,
  );
  baseCover.receiveShadow = true;
  baseCover.castShadow = true;
  group.add(baseCover);

  const pageBlock = createMesh(
    new THREE.BoxGeometry(SCENE.bookWidth, 0.18, SCENE.bookHeight),
    pageEdgeMaterial,
    disposables,
  );
  pageBlock.position.set(0.16, 0.14, 0.02);
  pageBlock.receiveShadow = true;
  pageBlock.castShadow = true;
  group.add(pageBlock);

  const spine = createMesh(
    new THREE.BoxGeometry(0.28, 0.42, SCENE.bookHeight + 0.42),
    spineMaterial,
    disposables,
  );
  spine.position.set(-(SCENE.bookWidth + 0.2) / 2, 0.06, 0);
  spine.castShadow = true;
  group.add(spine);

  const paperGeometry = createDeformablePageGeometry(SCENE.bookWidth * 0.96, SCENE.bookHeight * 0.92, 16, 10);
  paperGeometry.rotateX(-Math.PI / 2);
  paperGeometry.translate(-SCENE.bookWidth * 0.46, 0.25, -SCENE.bookHeight * 0.46);
  const paperMaterial = createPageMaterial(null, { side: THREE.DoubleSide });
  addDisposable(disposables, paperGeometry);
  addDisposable(disposables, paperMaterial);
  const topPaper = new THREE.Mesh(paperGeometry, paperMaterial);
  topPaper.position.set(0.24, 0.05, 0.08);
  topPaper.receiveShadow = true;
  group.add(topPaper);

  scene.add(group);
}

function buildScene(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  disposables: Array<{ dispose: () => void }>,
) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  scene.background = new THREE.Color("#eaf7f2");
  scene.fog = new THREE.Fog("#eaf7f2", 7, 13);

  const wallMaterial = createStandardMaterial("#f5fbf4", disposables, {
    roughness: 0.96,
  });
  const deskMaterial = createStandardMaterial("#c9a977", disposables, {
    roughness: 0.7,
  });

  const wall = createMesh(new THREE.PlaneGeometry(11, 6), wallMaterial, disposables);
  wall.position.set(0, 0.6, -2.35);
  wall.receiveShadow = true;
  scene.add(wall);

  const desk = createMesh(new THREE.PlaneGeometry(12, 8), deskMaterial, disposables);
  desk.position.set(0, -1.22, 1.02);
  desk.rotation.x = -Math.PI / 2;
  desk.receiveShadow = true;
  scene.add(desk);

  const hemiLight = new THREE.HemisphereLight("#d9f4ff", "#d5bc8e", 1.5);
  scene.add(hemiLight);

  const sun = new THREE.DirectionalLight("#fff4cf", 2.35);
  sun.position.set(-3.8, 4.8, 2.8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 12;
  sun.shadow.camera.left = -4.8;
  sun.shadow.camera.right = 4.8;
  sun.shadow.camera.top = 4.8;
  sun.shadow.camera.bottom = -4.8;
  sun.shadow.bias = -0.0002;
  sun.shadow.normalBias = 0.035;
  scene.add(sun);

  const fill = new THREE.DirectionalLight("#d8f5ff", 0.55);
  fill.position.set(3, 2.5, 3);
  scene.add(fill);

  addWindow(scene, disposables);
  addBook(scene, disposables);
  addDeskObjects(scene, disposables);
}

export function BookDeskScene({ children }: BookDeskSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(SCENE.cameraFov, 1, 0.1, 30);
    const disposables: Array<{ dispose: () => void }> = [renderer];
    const pointer = new THREE.Vector2(0, 0);
    const easedPointer = new THREE.Vector2(0, 0);
    const baseLookAt = new THREE.Vector3(0, -0.45, 0.05);
    let animationFrame = 0;
    let isReducedMotion = reducedMotion.matches;

    buildScene(scene, renderer, disposables);
    camera.position.set(0, SCENE.cameraY, SCENE.cameraZ);
    camera.lookAt(baseLookAt);

    const render = () => {
      const width = root.clientWidth;
      const height = root.clientHeight;
      if (width < 1 || height < 1) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, SCENE.maxPixelRatio));
      renderer.render(scene, camera);
    };

    const animate = () => {
      if (isReducedMotion) {
        animationFrame = 0;
        render();
        return;
      }

      easedPointer.lerp(pointer, 0.08);
      camera.position.x = easedPointer.x * SCENE.parallaxX;
      camera.position.y = SCENE.cameraY + easedPointer.y * SCENE.parallaxY;
      camera.lookAt(baseLookAt);
      render();
      animationFrame = window.requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(root);

    const onPointerMove = (event: PointerEvent) => {
      if (isReducedMotion) return;
      const rect = root.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = -(((event.clientY - rect.top) / rect.height - 0.5) * 2);
    };

    const onPointerLeave = () => {
      pointer.set(0, 0);
    };

    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      isReducedMotion = event.matches;
      pointer.set(0, 0);
      easedPointer.set(0, 0);
      if (!isReducedMotion && animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(animate);
      } else if (isReducedMotion && animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        camera.position.set(0, SCENE.cameraY, SCENE.cameraZ);
        camera.lookAt(baseLookAt);
        render();
      }
    };

    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave);
    reducedMotion.addEventListener("change", onReducedMotionChange);

    render();
    if (!isReducedMotion) {
      animationFrame = window.requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
      resizeObserver.disconnect();
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      reducedMotion.removeEventListener("change", onReducedMotionChange);
      disposables.forEach((disposable) => disposable.dispose());
    };
  }, []);

  return (
    <div ref={rootRef} data-testid="book-desk-scene" className="book-desk-scene">
      <canvas
        ref={canvasRef}
        data-testid="book-desk-scene-canvas"
        className="book-desk-scene-canvas"
        aria-hidden="true"
      />
      <div data-testid="book-desk-content" className="book-desk-content">
        {children}
      </div>
    </div>
  );
}
