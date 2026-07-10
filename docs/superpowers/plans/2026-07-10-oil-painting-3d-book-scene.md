# Oil-Painting 3D Book Scene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive oil-painting-style Three.js window-and-lake desk scene with a single-page loose-leaf notebook whose page remains the existing interactive React DOM, plus a synchronized overview/focus camera transition.

**Architecture:** Three.js renders the world and physical notebook shell in a canvas below the React application. `BookDeskScene` owns focus state and synchronizes named Three.js camera poses with CSS transform variables on the DOM notebook stage; the canvas never captures product interaction. Focused scene builders isolate painterly materials, world geometry, environmental animation, and lifecycle cleanup.

**Tech Stack:** React 18, TypeScript 5.7, Three.js 0.185, Vite 6, CSS transforms/custom properties, react-pageflip-enhanced, Playwright.

## Global Constraints

- Existing routes, hooks, API shapes, forms, charts, modals, and `BookContext` semantics remain unchanged.
- Existing UI remains live DOM and must never be rasterized into a WebGL texture.
- The notebook is a single-page loose-leaf structure with visible left-side metal rings.
- No OrbitControls, free zoom, physics-based handling, or unconstrained drag.
- `prefers-reduced-motion: reduce` stops continuous animation and makes focus changes immediate.
- Renderer target: fewer than 120 draw calls and fewer than 250,000 visible triangles.
- Runtime image textures must not exceed 2048 pixels on their longest edge.
- Preserve unrelated dirty worktree changes.

---

### Task 1: Lock The Interaction Contract With Failing Browser Tests

**Files:**
- Modify: `tests/book-desk-scene.spec.ts`

**Interfaces:**
- Consumes: existing `data-testid="book-desk-scene"`, `book-desk-scene-canvas`, and `book-desk-content`.
- Produces: required `data-testid="book-focus-toggle"`, root `data-focus-mode`, and `window.__BOOK_SCENE_DIAGNOSTICS__` contract.

- [ ] **Step 1: Add a failing overview/focus test**

```ts
await expect(scene).toHaveAttribute("data-focus-mode", "overview");
await page.getByTestId("book-focus-toggle").click();
await expect(scene).toHaveAttribute("data-focus-mode", "focus");
await expect(page.getByTestId("book-focus-toggle")).toHaveAttribute("aria-pressed", "true");
await page.keyboard.press("Escape");
await expect(scene).toHaveAttribute("data-focus-mode", "overview");
```

- [ ] **Step 2: Add failing DOM-interaction and renderer-budget assertions**

```ts
await page.getByTestId("book-focus-toggle").click();
await page.locator("header input").first().fill("Copic");
await page.locator("header input").first().press("Enter");
await expect(page).toHaveURL(/\/library\?q=Copic$/);
const diagnostics = await page.evaluate(() => window.__BOOK_SCENE_DIAGNOSTICS__);
expect(diagnostics.drawCalls).toBeLessThan(120);
expect(diagnostics.triangles).toBeLessThan(250_000);
```

- [ ] **Step 3: Add a failing reduced-motion assertion**

```ts
test.use({ reducedMotion: "reduce" });
await page.goto("/");
const before = await page.evaluate(() => window.__BOOK_SCENE_DIAGNOSTICS__.motionTick);
await page.waitForTimeout(250);
const after = await page.evaluate(() => window.__BOOK_SCENE_DIAGNOSTICS__.motionTick);
expect(after).toBe(before);
```

- [ ] **Step 4: Run the test and confirm the new contract fails**

Run: `npx playwright test tests/book-desk-scene.spec.ts --project=chromium`

Expected: FAIL because the focus toggle, focus state, and diagnostics do not exist.

### Task 2: Add Painterly Scene Types, Materials, And Shared Geometry

**Files:**
- Create: `src/three/oilScene/types.ts`
- Create: `src/three/oilScene/config.ts`
- Create: `src/three/oilScene/materials.ts`
- Create: `src/three/oilScene/geometry.ts`

**Interfaces:**
- Consumes: `three`.
- Produces: `ScenePose`, `OilSceneDiagnostics`, `OilSceneController`, `OIL_SCENE_CONFIG`, `createOilMaterial()`, `createCanvasGrainTexture()`, and reusable geometry helpers.

- [ ] **Step 1: Define the scene contracts**

```ts
export type ScenePose = "overview" | "focus";

export interface OilSceneDiagnostics {
  pose: ScenePose;
  drawCalls: number;
  triangles: number;
  motionTick: number;
  reducedMotion: boolean;
  animationActive: boolean;
}

export interface OilSceneController {
  setPose(pose: ScenePose, immediate?: boolean): void;
  resize(width: number, height: number, pixelRatio: number): void;
  render(time: number): void;
  setPointer(x: number, y: number): void;
  getDiagnostics(): OilSceneDiagnostics;
  dispose(): void;
}
```

- [ ] **Step 2: Add exact camera, animation, and budget constants**

```ts
export const OIL_SCENE_CONFIG = {
  maxPixelRatioDesktop: 1.75,
  maxPixelRatioMobile: 1.35,
  focusDurationMs: 820,
  overviewCamera: [0, 3.55, 7.8] as const,
  focusCamera: [0.12, 2.35, 5.05] as const,
  overviewTarget: [0, -0.35, -0.35] as const,
  focusTarget: [0.05, -0.72, 0.15] as const,
  drawCallBudget: 120,
  triangleBudget: 250_000,
};
```

- [ ] **Step 3: Implement a deterministic 128x128 canvas-grain texture and painterly standard material**

The grain texture uses seeded noise, broad translucent strokes, `SRGBColorSpace`, repeat wrapping, and one shared texture per scene. `createOilMaterial()` returns rough nonmetallic materials with restrained color variation; metal rings use a separate high-roughness metal material.

- [ ] **Step 4: Implement shared rounded-box, cloud-puff, leaf, and loose-leaf-ring geometry helpers**

Use low segment counts and shared geometry instances. Repeated foliage and clouds must be instanced or share geometry/material pairs.

- [ ] **Step 5: Run TypeScript build**

Run: `npm run build`

Expected: PASS with no type errors.

### Task 3: Build The Oil-Painting Window, Lake, Desk, And Notebook World

**Files:**
- Create: `src/three/oilScene/createOilScene.ts`
- Create: `src/three/oilScene/world.ts`
- Create: `src/three/oilScene/notebook.ts`
- Create: `src/three/oilScene/props.ts`
- Create: `src/three/oilScene/index.ts`

**Interfaces:**
- Consumes: Task 2 contracts and helpers.
- Produces: `createOilScene(canvas: HTMLCanvasElement, reducedMotion: boolean): OilSceneController`.

- [ ] **Step 1: Build the static composition**

Create wall/window framing, tabletop, layered mountain silhouettes, shoreline, flower masses, curtains, and an artist-prop arrangement matching the approved oil concept. The original concept image guides composition only and is not used as a full-screen texture.

- [ ] **Step 2: Build a lightweight animated lake shader**

```glsl
float band = sin((vUv.x * 19.0 + vUv.y * 7.0) + uTime * 0.22);
float glint = smoothstep(0.84, 1.0, sin(vUv.x * 43.0 - uTime * 0.36) * 0.5 + 0.5);
vec3 color = mix(uDeepColor, uLightColor, vUv.y + band * 0.035);
color += uSunColor * glint * 0.12;
```

Keep the shader transparent-free and low cost; update `uTime` only when motion is enabled.

- [ ] **Step 3: Build animated trees, clouds, and curtains**

Tree crown groups sway at distinct phases and amplitudes below 0.035 radians. Cloud groups drift slowly and wrap outside the window. Curtain motion stays below 0.012 radians. Motion stops entirely in reduced-motion mode.

- [ ] **Step 4: Build the physical single-page loose-leaf notebook shell**

Create cloth backing, stacked paper block, punched-hole shadows, 8-10 metal rings on the left, and a shallow top-page surface under the DOM stage. The Three.js page itself remains blank and never receives UI content.

- [ ] **Step 5: Add marker tools and supporting still-life props**

Use shared cylinder geometry and instancing for markers. Keep props outside the DOM page hit area and below the notebook's visual hierarchy.

- [ ] **Step 6: Implement controller pose transitions and diagnostics**

Interpolate camera, target, notebook lift, and scenery emphasis with an ease-out cubic curve. Update `renderer.info.render.calls` and `renderer.info.render.triangles` after each render.

- [ ] **Step 7: Implement complete disposal**

Dispose shared geometry/material/texture resources once, close the renderer, and clear references. Do not dispose the same shared resource per mesh.

- [ ] **Step 8: Run build and inspect renderer budget manually in a temporary page session**

Run: `npm run build`

Expected: PASS.

### Task 4: Synchronize The React DOM Notebook With The Three.js Poses

**Files:**
- Modify: `src/components/Book/BookDeskScene.tsx`
- Modify: `src/components/layout/AppLayout.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/vite-env.d.ts`

**Interfaces:**
- Consumes: `createOilScene()` and `ScenePose`.
- Produces: focus toggle, `data-focus-mode`, `data-testid="book-surface-stage"`, Escape handling, visibility pause, and global diagnostics declaration.

- [ ] **Step 1: Replace inline scene construction with the controller**

`BookDeskScene` creates one controller, uses `ResizeObserver`, reloads DPR caps per viewport, pauses requestAnimationFrame while `document.hidden`, and updates diagnostics after render.

- [ ] **Step 2: Add focus state and accessible control**

```tsx
<button
  type="button"
  data-testid="book-focus-toggle"
  className="book-focus-toggle"
  aria-label={focused ? "返回窗前场景" : "聚焦活页本"}
  aria-pressed={focused}
  onClick={() => setFocused((value) => !value)}
>
  {focused ? <Minimize2 aria-hidden /> : <Focus aria-hidden />}
</button>
```

Use `Focus` and `Minimize2` from `lucide-react`. Escape returns to overview unless focus is inside a modal dialog.

- [ ] **Step 3: Add a dedicated DOM surface stage**

Wrap the existing header/book/sticky-note content in `data-testid="book-surface-stage"`. Keep modals outside transformed clipping contexts so overlays cover the viewport correctly.

- [ ] **Step 4: Expose non-sensitive diagnostics for QA**

Declare `window.__BOOK_SCENE_DIAGNOSTICS__: OilSceneDiagnostics` in `src/vite-env.d.ts`. Never expose API keys, user data, or internal inventory records.

- [ ] **Step 5: Run the focused Playwright tests**

Run: `npx playwright test tests/book-desk-scene.spec.ts --project=chromium`

Expected: focus contract progresses; CSS alignment assertions may still fail until Task 5.

### Task 5: Create The Responsive Oil-Painted DOM Book Surface

**Files:**
- Modify: `src/styles/book.css`
- Modify: `src/styles/theme.css`
- Modify: `src/components/layout/StickyNotes.tsx`

**Interfaces:**
- Consumes: root `data-focus-mode` and `book-surface-stage` from Task 4.
- Produces: stable overview/focus transforms, painterly fallback, loose-leaf rings, page holes, responsive mobile focus layout, and safe modal/page interaction.

- [ ] **Step 1: Define stable scene and DOM transform variables**

```css
.book-desk-scene {
  --book-stage-x: 0px;
  --book-stage-y: 12vh;
  --book-stage-scale: 0.82;
  --book-stage-tilt: 5deg;
}

.book-desk-scene[data-focus-mode="focus"] {
  --book-stage-y: 2px;
  --book-stage-scale: 1;
  --book-stage-tilt: 0deg;
}
```

Use fixed transition durations matching `focusDurationMs`; reduced motion sets duration to `0ms`.

- [ ] **Step 2: Restyle `.book-cover` as a single-page loose-leaf surface**

Add a cloth backing, layered paper edges, vertical metal rings, and punched-hole shadows along the left. Keep border radii at 8px or less on functional containers.

- [ ] **Step 3: Keep product content readable over the painterly shell**

Use warm paper white with high text contrast. Painterly texture remains subtle under tables, charts, inputs, and buttons. Header and page content must not inherit 3D blur or canvas filters.

- [ ] **Step 4: Integrate sticky navigation into the notebook edge**

Position sticky notes as page-edge tabs in overview and focus states. On narrow viewports, collapse them into a horizontal scrollable tab strip without covering page controls.

- [ ] **Step 5: Implement mobile layout at 390x844**

Default to focus-like scale, keep header actions wrapping cleanly, preserve page height above 500px, and prevent horizontal overflow.

- [ ] **Step 6: Run tests and build**

Run: `npx playwright test tests/book-desk-scene.spec.ts --project=chromium`

Run: `npm run build`

Expected: PASS.

### Task 6: Complete Interaction, Modal, Reduced-Motion, And Lifecycle QA

**Files:**
- Modify: `tests/book-desk-scene.spec.ts`
- Modify: `playwright.config.ts` only if an additional mobile project is needed.

**Interfaces:**
- Consumes: completed scene and DOM behavior.
- Produces: automated regression coverage for interaction, mobile, reduced motion, canvas variation, console errors, and performance budgets.

- [ ] **Step 1: Exercise representative workflows**

Test search/navigation in focus mode, one page flip route synchronization, book-page scrolling, and opening/closing the add-marker modal. Assert canvas remains `pointer-events: none`.

- [ ] **Step 2: Add console/page error collection**

```ts
const errors: string[] = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));
// exercise workflows
expect(errors).toEqual([]);
```

- [ ] **Step 3: Verify reduced motion**

Confirm `animationActive === false`, `motionTick` remains stable, and focus toggling changes state without an animated delay.

- [ ] **Step 4: Verify lifecycle and resize**

Navigate away/reload repeatedly, resize desktop to mobile and back, and confirm one canvas exists with current dimensions and no duplicated controls/listeners.

- [ ] **Step 5: Run the complete automated suite**

Run: `npx playwright test --project=chromium`

Expected: PASS with zero console/page errors.

### Task 7: Visual QA, Canvas Inspection, Build, And Evidence Audit

**Files:**
- Create: `docs/verification/2026-07-10-oil-painting-3d-scene-report.md`
- Create: `test-results/oil-scene/desktop-overview.png` during verification only.
- Create: `test-results/oil-scene/desktop-focus.png` during verification only.
- Create: `test-results/oil-scene/mobile-focus.png` during verification only.

**Interfaces:**
- Consumes: completed implementation and director QA scripts.
- Produces: verification report, screenshots, canvas metrics, visual scorecard, ledgers, and remaining-risk statement.

- [ ] **Step 1: Start the dev server on an available local port**

Run: `npm run dev -- --host 127.0.0.1 --port 5173`

Expected: Vite reports a ready local URL; use another port if 5173 is occupied.

- [ ] **Step 2: Capture desktop overview, desktop focus, and 390x844 mobile screenshots**

Verify the notebook aligns with its shell, the lake/window remain visible in overview, focus mode is readable, and no controls overlap.

- [ ] **Step 3: Run packaged canvas pixel inspection**

Run the `threejs-qa-release` canvas inspector against the active URL. Expected: nonblank canvas, varied pixels, stable dimensions, and no all-black/all-transparent result.

- [ ] **Step 4: Record renderer evidence and visual scorecard**

Record draw calls, triangles, DPR, desktop/mobile screenshots, motion behavior, material treatment, and any automatic failures using the required director scorecard.

- [ ] **Step 5: Run final production verification**

Run: `npm run build`

Run: `npx playwright test --project=chromium`

Expected: both commands exit 0.

- [ ] **Step 6: Audit the report**

Run: `python C:\Users\zz\.agents\skills\threejs-game-director\scripts\audit_reference_report.py --premium docs/verification/2026-07-10-oil-painting-3d-scene-report.md`

Expected: audit exits 0. If it fails, fill missing evidence or report the exact blocker without claiming completion.

