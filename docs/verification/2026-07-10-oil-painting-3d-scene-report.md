# Oil-Painting 3D Notebook Scene Verification

Date: 2026-07-13  
Branch: `codex/3d`  
Runtime URL: `http://127.0.0.1:5173/`

## Outcome

The marker inventory now runs as live React DOM on a single-page loose-leaf notebook inside a Three.js window-and-desk scene. The canvas stays behind the product UI and does not capture pointer input. Overview/focus camera poses, responsive layout, modal behavior, route-driven page navigation, reduced motion, resize, and renderer lifecycle were exercised successfully.

## Game Design Brief

- Player/user promise: manage a marker collection through a readable notebook interface while retaining a calm, oil-painted desk atmosphere.
- Target feeling: focused, fresh, tactile, and unhurried.
- Primary verb: focus the notebook, then search, navigate, scroll, or edit the live DOM content.
- Objective: complete normal inventory tasks without the 3D layer obstructing interaction.
- Pressure: none; this is a productivity interface, not an action game.
- Reward/progression: immediate route and UI state changes, with a clear return from focus to the wider scene.
- Fail/retry: invalid form state remains in the modal; Escape or the close action returns safely. Scene initialization failure falls back to the DOM interface.
- Skill expression: efficient navigation and marker data management.
- Non-goals: physics handling, free OrbitControls, rasterized DOM textures, combat, score, audio, or failure loops.

## Core Loop

Window/desk overview -> focus control -> live notebook work surface -> search, sticky-tab route, scroll, or modal workflow -> visible product state change -> Escape/close -> overview.

## Level/Encounter Plan

The non-game spatial sequence starts at the wide window-and-desk overview, presents the notebook as the first decision and main landmark, moves into a close readable work surface, then returns to the wider scene. There are no threats or combat encounters. Markers, cup, curtains, trees, lake, and backdrop establish near/mid/far depth without entering the DOM hit area.

## Skill-Loading Ledger

| Skill | Loaded | Purpose |
| --- | --- | --- |
| `threejs-game-director` | yes | End-to-end phase and evidence contract |
| `threejs-gameplay-systems` | yes | Interaction contract; game-only mechanics marked not applicable |
| `threejs-aaa-graphics-builder` | yes | Painterly world, materials, render budget, scorecard |
| `threejs-game-ui-designer` | yes | DOM readability and responsive fit |
| `threejs-debug-profiler` | yes | Canvas, resize, lifecycle, renderer metrics |
| `threejs-qa-release` | yes | Browser, screenshot, pixel, build, and release checks |
| `threejs-image-generator` | yes | Approved concept and background plate provenance |
| `threejs-3d-generator` | yes | External 3D sourcing decision |
| `threejs-audio-generator` | not needed | Static productivity scene; audio was not requested or integrated |

## Reference Ledger

Loaded: director `phase-playbook`; graphics `visual-scorecard`, `implementation-blueprint`, `model-recipes`, `render-recipes`, `technical-art`, `shader-cookbook`, AAA quality and scorecard checklists; UI `ui-patterns`, game UI quality and responsive-fit checklists; debug `debug-profile-checklists`; QA `qa-release-checklists`, visual verification, playtest, release, visual-test-harness reference and checklist.

Not needed: physics, combat/encounter, bot playtest, audio, character rigging, and imported-model integration references because the deliverable is a non-physics productivity interface with no generated runtime GLB.

## External Asset Sourcing Ledger

Credential probe output:

```text
GEMINI_API_KEY=SET
TRIPO_API_KEY=SET
```

The combined Bash probe could not run because Bash is unavailable on this Windows runner; the provider-specific Python probes succeeded without exposing key values.

Chosen sources:

| Surface | Source | Evidence / decision |
| --- | --- | --- |
| Window, lake, mountain, flower composition | `threejs-image-generator` + crop | `assets/concepts/oil-window-single-leaf-marker-notebook-master.png`; runtime plate `src/assets/oil-window-backdrop.webp` (112,300 bytes, longest edge 1536px) |
| Notebook hero shell | Procedural Three.js + CSS/DOM hybrid | Exact dimensions must stay synchronized with the live DOM page; a generated GLB would add alignment and accessibility risk |
| Markers, cup, window, rings, foliage | Procedural/shared geometry | Repeated support props use shared geometry/material roles and remain within the browser budget |
| DOM UI/icons | Existing React + Lucide | Remains accessible, searchable, scrollable, and route-aware; never converted to a texture |
| Audio | Not needed | No active gameplay or audio requirement |

Surface categories: hero/player = notebook; world/sky/background = generated oil concept and runtime backdrop; materials/textures/decals = shared oil grain, paper, cloth, metal, water, and image plate.

## Phase Execution Ledger

| Phase | Status | Evidence |
| --- | --- | --- |
| Discovery/contract | done | Approved spec and implementation plan |
| Gameplay systems | done | Non-game interaction contract: overview/focus, Escape, route navigation, modal, reduced motion |
| External sourcing | done | Gemini concept/backdrop; procedural 3D decision documented |
| AAA graphics | done | Oil material kit, background plate, layered scene, notebook shell, props |
| UI | done | Live DOM stage, mobile tab strip, readable focus pose |
| Debug/profile | done | One canvas after reload/resize; renderer counts below budget |
| QA/release | done | Build, 5 Playwright tests, browser QA, desktop/mobile pixel inspection |

## Verification Evidence

Commands:

```text
npm run build
npx playwright test --project=chromium
node test-results/inspect-threejs-canvas.mjs --url http://127.0.0.1:5173 --out test-results/oil-scene/inspector-desktop --wait 1200
node test-results/inspect-threejs-canvas.mjs --url http://127.0.0.1:5173 --out test-results/oil-scene/inspector-mobile --mobile --wait 1200
```

Results:

- Production build: pass; 2,366 modules transformed.
- Chromium suite: 5/5 pass in 21.9s.
- Browser identity: `Hand-drawn Inventory Management UI` at the expected URL.
- Framework overlay: none.
- Console/page errors: none in browser QA and inspector runs.
- Desktop screenshot: `docs/verification/assets/oil-scene/desktop-overview.png`.
- Desktop focus screenshot: `docs/verification/assets/oil-scene/desktop-focus.png`.
- Mobile focus screenshot: `docs/verification/assets/oil-scene/mobile-focus.png`.
- Mobile viewport: 390x844; page 338.7x646px; horizontal overflow 0px.
- Canvas lifecycle: one canvas before and after resize/reload.
- DOM interaction: sticky navigation reached `/overview`; modal opened/closed; search reached `/library?q=Copic`; focus toggled and Escape returned to overview.
- Reduced motion: `animationActive=false`; `motionTick` remained stable.

Canvas inspector:

| Metric | Desktop 1280x720 | Mobile 390x664 |
| --- | ---: | ---: |
| Result | nonblank | nonblank |
| Color entropy | 5.35 bits | 3.78 bits |
| Edge density | 0.376 | 0.364 |
| Luminance contrast | 159.1 | 218.4 |
| Dominant color share | 0.170 | 0.315 |
| Non-background share | 0.830 | 0.685 |
| Console/page errors | 0 / 0 | 0 / 0 |

## Renderer And Technical Art Budget

| Budget | Target | Measured | Result |
| --- | ---: | ---: | --- |
| Draw calls | <120 | 111 | pass |
| Visible triangles | <250,000 | 14,562 | pass |
| Geometries | monitored | 41 | pass |
| Textures | monitored | 5 | pass |
| Runtime image longest edge | <=2048px | 1536px | pass |
| DPR cap | desktop 1.75 / mobile 1.35 | controller-enforced | pass |

Technical-art choices: shared rough nonmetallic oil materials; one seeded grain texture; shared and instanced repeated geometry; capped DPR; 2D generated backdrop for high-value distant detail; limited shadow casters; no post-processing chain; complete renderer/resource disposal. Headless motion sampling recorded six rendered motion ticks over one second; this is runner evidence, not a device FPS benchmark.

VFX readability: ambient tree, cloud, curtain, water, and camera motion stays below the live DOM layer, never obscures text or controls, and shuts down under reduced motion.

The production JavaScript chunk is 1,402.95kB minified (388.94kB gzip) and triggers Vite's 500kB advisory. It is a remaining optimization opportunity, not a functional failure.

## Visual Scorecard

The game-oriented categories are mapped to this productivity scene: hero/player = notebook, obstacles/enemies = supporting objects and visual occlusion control, rewards/interactables = live DOM controls.

- Art direction: before 1 / after 3 - oil backdrop, paper grain, metal rings, marker props, and hand-drawn UI share one authored language.
- Hero/player: before 1 / after 2 - the loose-leaf notebook has a distinct cloth backing, paper stack, holes, rings, shadow, and focus state.
- Obstacles/enemies: before 1 / after 2 - supporting props have varied silhouettes and remain outside the interaction path.
- Rewards/interactables: before 1 / after 2 - focus, tabs, search, page content, and modal provide clear real state changes.
- World/environment: before 1 / after 3 - foreground desk props, midground notebook/window, and far lake/mountain plate establish depth and scale.
- Materials/textures: before 1 / after 2 - shared oil material roles, grain, paper, cloth, metal, water, and backdrop are cohesive within five textures.
- Lighting/render: before 1 / after 2 - warm key/fill light, window illumination, contact shadows, tone mapping, and clear focus framing remain readable.
- VFX/motion: before 0 / after 2 - tree sway, cloud drift, water glint, curtain motion, camera easing, and reduced-motion shutdown are purposeful and restrained.
- UI/HUD: before 2 / after 3 - the original live DOM stays readable, interactive, route-aware, modal-safe, and responsive at 390x844.
- Performance evidence: before 0 / after 3 - renderer diagnostics, build/test output, desktop/mobile screenshots, pixel metrics, and budgets are recorded.

Measured evidence: desktop/mobile entropy 5.35/3.78, edge density 0.376/0.364, contrast 159.1/218.4, dominant share 0.170/0.315; renderer 111 calls, 14,562 triangles, 41 geometries, 5 textures.

Average after score: 2.4/3. Automatic failures remaining: none for the adapted non-game scene contract.

Fresh-eyes adversarial self-review (no subagent runner was available):

- Art direction could score 1 because the runtime combines a generated plate with visibly procedural foreground forms; the repeated oil/paper treatment and composition justify 3.
- Hero could score 1 because the notebook silhouette is mostly rectangular; rings, holes, layered paper, cloth, and synchronized focus justify 2.
- Supporting objects could score 1 because several markers repeat; varied placement, cup/curtain/tree forms, and interaction clearance justify 2.
- Interactables could score 1 if judged only as standard DOM controls; spatial focus, page routing, and modal-safe behavior justify 2.
- World could score 1 because some tree crowns are low-poly; layered foreground/midground/background and rich plate detail justify 3.
- Materials could score 1 because no dense PBR texture set is used; intentional shared roles and measured grain/backdrop use justify 2.
- Lighting could score 1 because there is no cinematic post chain; readable key/fill/contact treatment and depth separation justify 2.
- Motion could score 1 because animation is ambient rather than event-heavy; four coordinated environmental channels plus camera easing justify 2.
- UI could score 1 if treated as a generic dashboard; the notebook-specific structure, hand-drawn visual language, and mobile reflow justify 3.
- Performance could score 1 without frame-time profiling; the renderer, pixel, build, interaction, lifecycle, and responsive evidence justify 3 while retaining the FPS caveat.

## Visual Test Harness Decision

Extended the existing Playwright smoke harness instead of adding pixel-perfect screenshot baselines. The WebGL backdrop, ambient motion, font rasterization, and platform antialiasing make strict screenshots unnecessarily flaky. High-value states are covered by deterministic structural assertions, renderer budgets, reduced-motion stabilization, desktop/mobile screenshots, and canvas pixel metrics. No masks or broad screenshot thresholds were introduced.

## Release Notes And Residual Risks

- Production preview assumptions use Vite's default root base; `npm run build:pages` remains the GitHub Pages path-specific build.
- Main risk: the 1.4MB minified JS chunk can delay first interaction on slower mobile networks; future work should split route-heavy UI and Three.js initialization.
- The procedural tree crowns are intentionally stylized but remain the least painterly close-up surface.
- Tests ran in Chromium only; Safari/WebKit and Firefox were not part of this pass.
- No audio, physics, bot playtest, or imported GLB validation applies to this non-game interface.
