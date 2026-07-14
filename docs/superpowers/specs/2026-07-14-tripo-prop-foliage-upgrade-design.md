# Tripo Desk Props And Foliage Upgrade Design

## Goal

Replace the most visibly procedural foreground assets in the oil-painted Three.js notebook scene with balanced, browser-ready Tripo GLB assets while preserving the existing live DOM notebook, camera behavior, environmental motion, responsive layout, and fallback reliability.

## Confirmed Scope

Two asset groups will be generated and integrated:

1. Desk art supplies: marker pens, a ceramic marker cup, and color swatch cards.
2. Window foliage: potted flowers and stylized small trees/leaf masses near the window.

The notebook shell, live DOM page, desk, window frame, water shader, curtains, distant oil backdrop, and UI remain unchanged. The notebook will not be generated with Tripo because its physical shell must remain dimensionally synchronized with the interactive DOM surface.

## Visual Direction

- Match the existing light oil-painting scene rather than photorealism.
- Use soft, rounded authored forms, visible brush-like color variation, matte surfaces, restrained highlights, and low-saturation greens with small coral/yellow accents.
- Avoid glossy plastic, hyper-detailed realism, text, logos, floating parts, display stands, and studio-background geometry.
- Keep silhouettes readable from the current overview camera and attractive at the focus transition edge.

## Asset Strategy

Use a hybrid layout:

- Individual GLBs for a marker pen, ceramic marker cup, and color swatch stack so they can be placed and repeated independently.
- One foliage-kit GLB containing a potted flower cluster and a small stylized tree/leaf cluster with clearly separated root groups where provider output permits.
- Repeated marker pens will clone one imported model and vary transforms/material tint where practical.
- Existing procedural assets remain available as fallback builders and are not deleted until imported assets pass runtime QA.

## Generation Budget

- Provider/model: Tripo `v3.1-20260211`.
- Output: GLB with PBR textures.
- Quality tier: balanced browser/mobile.
- Target combined visible triangles: 30,000-50,000 across both groups after placement.
- Target per unique asset: approximately 8,000-15,000 triangles, adjusted by silhouette importance.
- Texture target: 1024px per asset, with no runtime texture above 2048px.
- Prefer smart low-poly or a conversion pass when the downloaded output exceeds the budget.
- No rigging is required. Environmental sway remains procedural at the imported root-group level.

## Runtime Architecture

Add an imported-asset loader boundary under `src/three/oilScene`:

- A manifest defines model URL, expected scale, orientation, placement role, and fallback owner.
- `GLTFLoader` loads assets before or during scene setup without exposing provider APIs or keys to the browser.
- A normalization helper computes bounds, recenters the visual root, applies a known world scale, enables shadows selectively, and records mesh/material/texture/triangle diagnostics.
- Imported resources are registered with the existing scene disposal lifecycle.
- The asset layer returns either imported roots or a typed failure result; `buildDeskProps` and `buildWorld` retain procedural fallback paths.

No Tripo API request runs in client code. Generation and download remain offline tooling steps.

## Placement And Motion

### Desk Props

- Replace the current cylinder markers around the lower left and right desk edges with cloned imported marker GLBs.
- Replace the procedural ceramic cup and torus handle with the imported cup.
- Replace the thin box swatches with a compact imported color-swatch stack.
- Keep all props outside the DOM notebook hit area and below the page's visual hierarchy.

### Foliage

- Replace the near-window flower masses and the most visible procedural tree crowns.
- Preserve current trunk or anchoring geometry only when it improves placement and silhouette.
- Apply existing low-amplitude sway to imported foliage root groups; do not deform individual GLB vertices or require skeletal animation.
- Distant foliage can remain procedural or part of the oil backdrop to control cost.

## Error Handling And Fallback

- Failed model loads must log one concise error per asset group and render the existing procedural equivalent.
- A partial failure must not prevent the other asset group or the DOM notebook from rendering.
- Loading must not create a blank canvas or block route/UI interaction.
- Asset URLs use Vite imports or stable public paths compatible with the existing root and GitHub Pages builds.
- All cloned geometries, materials, and textures are disposed once without double-disposal.

## Diagnostics

Extend scene diagnostics with imported-asset evidence where useful:

- Loaded asset names and fallback state.
- Imported mesh, material, geometry, texture, and triangle counts.
- Total renderer draw calls and visible triangles after placement.
- GLB file sizes and largest texture dimensions recorded in verification documentation.

No provider credentials, task response secrets, or temporary download URLs are exposed in runtime diagnostics.

## Verification

- Probe reports `TRIPO_API_KEY=SET` before generation.
- Record every Tripo task ID, generation option, downloaded GLB path, and any conversion task.
- Inspect each GLB for file size, bounds, mesh/material/texture counts, triangles, orientation, and PBR readability.
- Run `npm run build` and the complete Chromium Playwright suite.
- Test both successful import and forced/failing asset fallback behavior.
- Capture desktop overview, desktop focus, and 390x844 mobile screenshots.
- Verify console/page errors, nonblank Canvas pixels, focus/search/modal/navigation interaction, reduced motion, resize, and lifecycle cleanup.
- Target final renderer budgets: fewer than 120 draw calls and fewer than 250,000 visible triangles. If imported assets make the draw-call target impractical, optimize materials/meshes or document the exact measured tradeoff before completion.

## Success Criteria

- Desk supplies and near-window plants visibly read as authored oil-painted objects rather than basic cylinders and spheres.
- The live DOM notebook remains precisely aligned, readable, scrollable, and clickable.
- Desktop and mobile compositions remain free of overlap and horizontal overflow.
- Environmental foliage motion and reduced-motion behavior continue to work.
- Model failures degrade to the existing procedural scene instead of breaking the page.
- Build, automated tests, browser QA, Canvas inspection, and final evidence audit pass.

## Non-Goals

- Generating or replacing the notebook shell.
- Free camera controls, physics pickup/drag behavior, or model customization UI.
- Rigged plant animation, audio, weather simulation, or replacing the distant generated backdrop.
- Converting the DOM page into a texture or mesh.
