# Tripo Desk Props And Foliage Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate balanced Tripo GLB assets for desk art supplies and window foliage, integrate them into the oil-painted Three.js scene, and preserve the existing procedural scene as a reliable fallback.

**Architecture:** Tripo runs only as an offline asset tool and writes stable GLB files under `src/assets/models/oil-scene`. A focused `importedAssets.ts` module owns GLTF loading, normalization, cloning, resource tracking, diagnostics, and cancellation safety. Existing procedural builders return fallback groups that stay visible until each imported asset group loads successfully.

**Tech Stack:** React 18, TypeScript 5.7, Three.js 0.185 `GLTFLoader`, Vite 6 asset imports, Tripo `v3.1-20260211`, Playwright 1.61.

## Global Constraints

- Generate both confirmed groups: desk art supplies and window foliage.
- Keep the live DOM notebook, notebook shell, desk, window frame, water shader, curtains, and distant oil backdrop unchanged.
- Use balanced browser/mobile assets: 30,000-50,000 combined visible imported triangles and 1024px target textures; no runtime texture may exceed 2048px.
- Do not call Tripo or expose credentials/task response secrets in browser code.
- Failed or partial GLB loads must leave the existing procedural equivalent visible.
- Imported foliage motion stays root-level and stops under `prefers-reduced-motion`.
- Final renderer targets remain fewer than 120 draw calls and fewer than 250,000 visible triangles.
- Preserve existing routes, forms, search, modal behavior, `BookContext`, DOM hit testing, and focus transitions.

---

### Task 1: Generate And Intake Balanced Tripo Assets

**Files:**
- Create: `src/assets/models/oil-scene/marker.glb`
- Create: `src/assets/models/oil-scene/cup.glb`
- Create: `src/assets/models/oil-scene/swatches.glb`
- Create: `src/assets/models/oil-scene/foliage-kit.glb`
- Create: `assets/tripo/oil-scene/*` provider task records and previews
- Modify: `docs/verification/2026-07-14-tripo-asset-ledger.md`

**Interfaces:**
- Consumes: `TRIPO_API_KEY`, Tripo helper script, confirmed visual direction.
- Produces: four stable GLB paths and a task ledger with task IDs, prompts, source outputs, file sizes, and any conversion IDs.

- [ ] **Step 1: Verify the configured provider and create output directories**

Run:

```powershell
python "C:\Users\zz\.agents\skills\threejs-3d-generator\scripts\threejs_3d_asset.py" probe
New-Item -ItemType Directory -Force "assets\tripo\oil-scene\marker","assets\tripo\oil-scene\cup","assets\tripo\oil-scene\swatches","assets\tripo\oil-scene\foliage-kit","src\assets\models\oil-scene" | Out-Null
```

Expected: literal `TRIPO_API_KEY=SET`; no key value is printed or written.

- [ ] **Step 2: Generate the marker, cup, swatches, and foliage kit**

Run these four commands separately so one provider failure does not lose the other outputs:

```powershell
python "C:\Users\zz\.agents\skills\threejs-3d-generator\scripts\threejs_3d_asset.py" text --prompt "single alcohol art marker pen for a cozy artist desk, softly rounded rectangular barrel, fitted cap and small nib-end details, hand-painted oil illustration style translated into clean game-ready 3D, matte ivory body with muted sage and coral accents, readable silhouette, centered at origin, isolated object, no text, no logo, no stand" --negative-prompt "photorealistic glossy plastic, text, letters, logo, watermark, background, floor, display stand, floating parts, extra pens" --model-version v3.1-20260211 --texture-quality detailed --geometry-quality detailed --face-limit 8000 --smart-low-poly --auto-size --compress meshopt --wait --download --out-dir "assets\tripo\oil-scene\marker"

python "C:\Users\zz\.agents\skills\threejs-3d-generator\scripts\threejs_3d_asset.py" text --prompt "single handmade ceramic marker cup for a bright window-side artist desk, tapered cup with an integrated curved handle, subtle uneven pottery silhouette, light warm ivory glaze with muted blue-green brush strokes, oil-painted stylized game-ready 3D, matte rough surface, centered at origin, isolated object, no contents, no text, no logo, no stand" --negative-prompt "photorealistic, glossy chrome, transparent glass, text, letters, logo, watermark, background, floor, display stand, floating parts" --model-version v3.1-20260211 --texture-quality detailed --geometry-quality detailed --face-limit 8000 --smart-low-poly --auto-size --compress meshopt --wait --download --out-dir "assets\tripo\oil-scene\cup"

python "C:\Users\zz\.agents\skills\threejs-3d-generator\scripts\threejs_3d_asset.py" text --prompt "compact fan-shaped stack of six artist color swatch cards, layered thick paper tabs with rounded corners, muted sage coral blue mustard and lavender paint samples, hand-painted oil illustration style, clean game-ready 3D, matte paper fibers, centered at origin, isolated object, no readable text, no logo, no stand" --negative-prompt "photorealistic, glossy plastic, letters, numbers, logo, watermark, background, floor, display stand, floating cards far apart" --model-version v3.1-20260211 --texture-quality detailed --geometry-quality detailed --face-limit 10000 --smart-low-poly --auto-size --compress meshopt --wait --download --out-dir "assets\tripo\oil-scene\swatches"

python "C:\Users\zz\.agents\skills\threejs-3d-generator\scripts\threejs_3d_asset.py" text --prompt "cohesive window-side foliage kit for a cozy artist studio: one small rounded potted flowering plant beside one compact young tree with a short trunk and layered leaf clusters, asymmetrical natural silhouette, muted sage forest and pale green foliage with sparse coral and cream flowers, visible oil-paint brush color variation, stylized game-ready 3D, matte surfaces, roots aligned to one ground plane, isolated asset group, no background, no stand" --negative-prompt "photorealistic leaves, flat billboard foliage, neon green, glossy plastic, text, logo, watermark, landscape terrain, room, window, floating roots" --model-version v3.1-20260211 --texture-quality detailed --geometry-quality detailed --face-limit 15000 --smart-low-poly --auto-size --compress meshopt --wait --download --out-dir "assets\tripo\oil-scene\foliage-kit"
```

Expected: four successful task IDs, four task JSON records, rendered previews, and downloaded GLB/PBR outputs.

- [ ] **Step 3: Select PBR outputs and copy them to stable runtime names**

Run:

```powershell
$assets = @{
  marker = "marker.glb"
  cup = "cup.glb"
  swatches = "swatches.glb"
  "foliage-kit" = "foliage-kit.glb"
}
foreach ($entry in $assets.GetEnumerator()) {
  $dir = Join-Path "assets\tripo\oil-scene" $entry.Key
  $source = Get-ChildItem -LiteralPath $dir -File | Where-Object { $_.Name -match "-(pbr_model|model)\.glb$" } | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if (-not $source) { throw "No GLB output found for $($entry.Key)" }
  Copy-Item -LiteralPath $source.FullName -Destination (Join-Path "src\assets\models\oil-scene" $entry.Value) -Force
}
```

Expected: the four stable runtime GLBs exist and each has nonzero size.

- [ ] **Step 4: Inspect previews and record the asset ledger**

View each `rendered_image` from the provider directories. Reject/regenerate assets with merged marker clusters, unreadable silhouettes, detached geometry, unexpected floors/backgrounds, or a foliage root plane that cannot be placed cleanly. Create `docs/verification/2026-07-14-tripo-asset-ledger.md` with each task ID, exact prompt, model version, face limit, selected source file, stable runtime file, byte size, and visual acceptance note.

- [ ] **Step 5: Commit accepted generated assets and ledger**

```powershell
git add assets/tripo/oil-scene src/assets/models/oil-scene docs/verification/2026-07-14-tripo-asset-ledger.md
git commit -m "assets: add balanced Tripo desk and foliage models"
```

### Task 2: Lock The Imported-Asset Contract With Failing Tests

**Files:**
- Modify: `tests/book-desk-scene.spec.ts`
- Modify: `src/three/oilScene/types.ts`

**Interfaces:**
- Consumes: existing `window.__BOOK_SCENE_DIAGNOSTICS__`.
- Produces: `ImportedAssetState`, `ImportedAssetDiagnostics`, and browser assertions for loaded/fallback states.

- [ ] **Step 1: Define the diagnostics contract**

Add to `src/three/oilScene/types.ts`:

```ts
export type ImportedAssetState = "loading" | "loaded" | "fallback";

export interface ImportedAssetDiagnostics {
  deskProps: ImportedAssetState;
  foliage: ImportedAssetState;
  meshes: number;
  materials: number;
  textures: number;
  triangles: number;
}
```

Add `assets: ImportedAssetDiagnostics` to `OilSceneDiagnostics`.

- [ ] **Step 2: Extend the test-side diagnostics type and add a failing success-path assertion**

```ts
interface SceneDiagnostics {
  // existing fields
  assets: {
    deskProps: "loading" | "loaded" | "fallback";
    foliage: "loading" | "loaded" | "fallback";
    meshes: number;
    materials: number;
    textures: number;
    triangles: number;
  };
}

await expect.poll(async () => (await readDiagnostics(page))?.assets.deskProps).toBe("loaded");
await expect.poll(async () => (await readDiagnostics(page))?.assets.foliage).toBe("loaded");
expect((await readDiagnostics(page))?.assets.triangles).toBeGreaterThan(0);
```

- [ ] **Step 3: Add a failing fallback-path test using network interception**

```ts
test("falls back to procedural props when imported models fail", async ({ page }) => {
  await page.route("**/*.glb", (route) => route.abort());
  await page.goto("/");

  await expect.poll(async () => (await readDiagnostics(page))?.assets.deskProps).toBe("fallback");
  await expect.poll(async () => (await readDiagnostics(page))?.assets.foliage).toBe("fallback");
  await expect(page.getByTestId("book-desk-scene-canvas")).toBeVisible();
  await expect(page.locator(".book-page")).toBeVisible();
});
```

- [ ] **Step 4: Run the focused suite and confirm failure**

Run: `npx playwright test tests/book-desk-scene.spec.ts --project=chromium`

Expected: FAIL because `assets` diagnostics and GLB loading do not exist.

- [ ] **Step 5: Commit the red tests and type contract**

```powershell
git add src/three/oilScene/types.ts tests/book-desk-scene.spec.ts
git commit -m "test: define imported oil-scene asset contract"
```

### Task 3: Implement The GLB Loader, Normalization, And Disposal Boundary

**Files:**
- Create: `src/three/oilScene/importedAssets.ts`
- Create: `src/three/oilScene/importedAssetManifest.ts`
- Modify: `vite.config.ts`
- Modify: `src/three/oilScene/createOilScene.ts`

**Interfaces:**
- Consumes: four stable GLB imports and existing `TrackResource`.
- Produces: `loadImportedOilAssets(options): ImportedOilAssetHandle`, normalized asset roots, diagnostics updates, and disposal-safe asynchronous loading.

- [ ] **Step 1: Add GLB to Vite's explicit asset list and create the manifest**

Update `vite.config.ts`:

```ts
assetsInclude: ["**/*.svg", "**/*.csv", "**/*.glb"],
```

Create `importedAssetManifest.ts` importing the four GLBs and exporting:

```ts
export const IMPORTED_OIL_ASSETS = {
  marker: { url: markerUrl, targetSize: 1.2 },
  cup: { url: cupUrl, targetSize: 0.9 },
  swatches: { url: swatchesUrl, targetSize: 1.1 },
  foliage: { url: foliageUrl, targetSize: 2.25 },
} as const;
```

- [ ] **Step 2: Implement normalized loading and diagnostics collection**

Create `importedAssets.ts` with:

```ts
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

export function normalizeImportedRoot(root: THREE.Group, targetSize: number): THREE.Group;
export function loadImportedOilAssets(options: ImportedOilAssetOptions): ImportedOilAssetHandle;
```

`normalizeImportedRoot` must compute a `Box3`, center X/Z, move the minimum Y to zero, and scale the largest dimension to `targetSize`. Traverse each unique imported mesh once to enable `castShadow`, clamp standard/physical material roughness to at least `0.62` and metalness to at most `0.2`, count source triangles/materials/textures, and register unique geometry/material/texture resources through `track`. After placement, `diagnostics.assets.triangles` records visible imported triangles including repeated marker and foliage clones, while mesh/material/texture fields record unique loaded resources.

- [ ] **Step 3: Make asynchronous completion disposal-safe**

The handle owns `let disposed = false`. Each load completion checks `disposed` before attaching roots. If disposed, immediately dispose the just-loaded unique resources and return. `dispose()` sets the flag and removes attached imported groups; shared resources remain disposed exactly once by the scene resource set.

- [ ] **Step 4: Initialize imported diagnostics and start loading from `createOilScene`**

Initialize:

```ts
assets: {
  deskProps: "loading",
  foliage: "loading",
  meshes: 0,
  materials: 0,
  textures: 0,
  triangles: 0,
},
```

Store the returned `ImportedOilAssetHandle`, call `void handle.ready`, and call `handle.dispose()` before clearing tracked resources in controller disposal.

- [ ] **Step 5: Run build**

Run: `npm run build`

Expected: PASS and four hashed `.glb` assets appear in `dist/assets`.

- [ ] **Step 6: Commit the loader boundary**

```powershell
git add vite.config.ts src/three/oilScene/importedAssetManifest.ts src/three/oilScene/importedAssets.ts src/three/oilScene/createOilScene.ts
git commit -m "feat: add disposal-safe Tripo asset loading"
```

### Task 4: Replace Procedural Desk Props After Successful Import

**Files:**
- Modify: `src/three/oilScene/props.ts`
- Modify: `src/three/oilScene/importedAssets.ts`
- Modify: `src/three/oilScene/createOilScene.ts`

**Interfaces:**
- Consumes: normalized marker, cup, and swatch roots.
- Produces: `DeskPropFallback { group: THREE.Group }` and imported placement with shared cloned resources.

- [ ] **Step 1: Wrap existing procedural desk objects in one fallback group**

Change `buildDeskProps` to return:

```ts
export interface DeskPropFallback {
  group: THREE.Group;
}

export function buildDeskProps(...): DeskPropFallback;
```

Add every current marker, cap, cup, handle, and swatch to `group`, then add that group to the scene once.

- [ ] **Step 2: Add imported placement transforms**

In `importedAssets.ts`, clone the normalized marker root eight times using the existing marker positions and rotations, place one cup at `[4.15, -1.34, -0.1]`, and place one swatch stack near `[-4.0, -1.34, 2.0]`. Use wrapper groups for transforms; clones share geometry and materials.

- [ ] **Step 3: Swap only after all desk models load successfully**

Load marker, cup, and swatches with `Promise.all`. On success, add the imported desk group, set `proceduralDeskProps.visible = false`, and set `diagnostics.deskProps = "loaded"`. On any failure, remove any partial imported roots, keep the fallback visible, set state to `"fallback"`, and log one `Unable to load Tripo desk props` error.

- [ ] **Step 4: Run focused tests**

Run: `npx playwright test tests/book-desk-scene.spec.ts --project=chromium -g "renders|falls back"`

Expected: success path reports `loaded`; intercepted GLBs report `fallback`; Canvas and DOM remain visible.

- [ ] **Step 5: Commit desk replacement**

```powershell
git add src/three/oilScene/props.ts src/three/oilScene/importedAssets.ts src/three/oilScene/createOilScene.ts
git commit -m "feat: replace desk props with Tripo assets"
```

### Task 5: Replace Near Foliage And Preserve Environmental Motion

**Files:**
- Modify: `src/three/oilScene/world.ts`
- Modify: `src/three/oilScene/importedAssets.ts`
- Modify: `src/three/oilScene/types.ts`

**Interfaces:**
- Consumes: normalized foliage kit root and mutable `treeCrowns` motion array.
- Produces: `proceduralFoliage: THREE.Group` fallback and two imported foliage placements registered for existing root sway.

- [ ] **Step 1: Group procedural trees and flower masses**

Create `const proceduralFoliage = new THREE.Group()` in `buildWorld`. Update `addTree` and `addFlowerMass` to accept an `Object3D` parent and attach trunks/crowns/flowers to that parent. Return `proceduralFoliage` with the existing `WorldMotion` object.

- [ ] **Step 2: Place imported foliage on both sides of the window**

Clone the normalized foliage root twice. Place wrappers near `[-4.0, -0.55, -4.9]` and `[3.8, -0.55, -5.2]`; mirror only the wrapper rotation/scale, never use negative mesh scale. Keep the imported leaves outside the notebook silhouette in overview.

- [ ] **Step 3: Register imported root sway**

Push the two imported wrappers into `treeCrowns` with phases `0.35` and `2.6`, and amplitudes below `0.025`. Existing `updateMotion` then drives them and automatically stops under reduced motion.

- [ ] **Step 4: Swap or fall back atomically**

On foliage load success, attach the imported wrappers, hide `proceduralFoliage`, and set state to `"loaded"`. On failure, keep procedural foliage visible, set state to `"fallback"`, and log one `Unable to load Tripo foliage` error.

- [ ] **Step 5: Run focused tests and build**

Run:

```powershell
npx playwright test tests/book-desk-scene.spec.ts --project=chromium -g "renders|narrow|reduced|falls back"
npm run build
```

Expected: both commands pass; reduced-motion tick remains stable with imported foliage.

- [ ] **Step 6: Commit foliage replacement**

```powershell
git add src/three/oilScene/world.ts src/three/oilScene/importedAssets.ts src/three/oilScene/types.ts
git commit -m "feat: replace window foliage with Tripo assets"
```

### Task 6: Enforce Asset Budgets And Complete Browser Regression Coverage

**Files:**
- Modify: `tests/book-desk-scene.spec.ts`
- Modify: `docs/verification/2026-07-14-tripo-asset-ledger.md`

**Interfaces:**
- Consumes: complete imported diagnostics and runtime scene diagnostics.
- Produces: enforced imported/total budgets, partial-failure evidence, and recorded intake metrics.

- [ ] **Step 1: Add imported budget assertions**

In the success-path test, assert:

```ts
expect(diagnostics?.assets.meshes).toBeGreaterThan(0);
expect(diagnostics?.assets.textures).toBeGreaterThan(0);
expect(diagnostics?.assets.triangles).toBeGreaterThan(0);
expect(diagnostics?.assets.triangles).toBeLessThanOrEqual(50_000);
expect(diagnostics?.drawCalls).toBeLessThan(120);
expect(diagnostics?.triangles).toBeLessThan(250_000);
```

The 30,000-50,000 range is a planning target, not a reason to add invisible geometry. Keep the hard 50,000 upper bound and document any lower measured result when the assets still pass visual review.

- [ ] **Step 2: Add a partial-failure test**

Abort only `**/foliage-kit*.glb`, then assert desk props become `loaded`, foliage becomes `fallback`, and search remains interactive. This proves one asset group cannot block the other.

- [ ] **Step 3: Run the complete suite**

Run: `npx playwright test --project=chromium`

Expected: all tests pass with no unexpected console/page errors.

- [ ] **Step 4: Record final intake metrics**

Append stable GLB file sizes, renderer draw calls/triangles/geometries/textures, imported diagnostics, and largest observed texture dimensions to the asset ledger.

- [ ] **Step 5: Commit regression coverage**

```powershell
git add tests/book-desk-scene.spec.ts docs/verification/2026-07-14-tripo-asset-ledger.md
git commit -m "test: verify Tripo asset loading and fallback"
```

### Task 7: Visual QA, Canvas Inspection, Final Report, And Push

**Files:**
- Create: `docs/verification/2026-07-14-tripo-scene-upgrade-report.md`
- Create: `docs/verification/assets/tripo-oil-scene/desktop-overview.png`
- Create: `docs/verification/assets/tripo-oil-scene/desktop-focus.png`
- Create: `docs/verification/assets/tripo-oil-scene/mobile-focus.png`
- Modify: `PRODUCT.md` only if the implemented asset behavior changes the documented scene contract.

**Interfaces:**
- Consumes: final scene, asset ledger, automated tests, renderer diagnostics.
- Produces: browser evidence, pixel metrics, visual scorecard, final audited report, and pushed branch.

- [ ] **Step 1: Start or reuse the dev server**

Run: `npm run dev -- --host 127.0.0.1 --port 5173`

Expected: the app is available at `http://127.0.0.1:5173/`; use another free port only if 5173 serves a different process.

- [ ] **Step 2: Run Browser QA**

Use the in-app Browser first. Verify page identity, meaningful DOM, no framework overlay, console/page health, focus toggle, search, sticky navigation, modal open/close, desktop overview, desktop focus, 390x844 mobile focus, no horizontal overflow, and one Canvas after resize/reload.

- [ ] **Step 3: Capture final screenshots**

Save the three accepted screenshots under `docs/verification/assets/tripo-oil-scene`. Confirm imported markers/cup/swatches and imported foliage are visibly present and better authored than the procedural baseline.

- [ ] **Step 4: Run Canvas pixel inspection and collect diagnostics**

Run the packaged `threejs-qa-release` inspector against desktop and mobile. Record nonblank status, entropy, edge density, luminance contrast, dominant color share, console/page errors, imported asset diagnostics, total draw calls, and total triangles.

- [ ] **Step 5: Run final verification**

```powershell
npm run build
npx playwright test --project=chromium
```

Expected: both exit 0. The only acceptable non-failing warning is a documented Vite bundle-size advisory.

- [ ] **Step 6: Write and audit the final report**

The report must include skill/reference/phase ledgers, exact Tripo probe output, task IDs, stable GLB paths, chosen sources, asset intake metrics, renderer budget, before/after visual scorecard, adversarial fresh-eyes review, fallback evidence, screenshots, commands, and residual risks.

Run:

```powershell
python "C:\Users\zz\.agents\skills\threejs-game-director\scripts\audit_reference_report.py" --premium "docs\verification\2026-07-14-tripo-scene-upgrade-report.md"
```

Expected: `Director report audit passed.`

- [ ] **Step 7: Commit and push the completed upgrade**

```powershell
git add PRODUCT.md docs/verification src tests vite.config.ts
git commit -m "feat: upgrade oil scene with Tripo assets"
git push origin codex/3d
```

Expected: `git status -sb` shows `codex/3d...origin/codex/3d` with no working-tree changes.
