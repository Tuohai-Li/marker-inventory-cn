# Task 4 Report

## Status

COMPLETE

## Delivered

- Wrapped every procedural marker, cap, cup, cup handle, and swatch in the returned `DeskPropFallback.group`, which is added to the scene once.
- Replaced invisible staging with an atomic desk transaction: marker, cup, and swatch roots normalize and load through `Promise.all`, then the imported desk group is attached and the procedural fallback is hidden.
- Placed eight marker clones at the established positions and rotations, one normalized cup at `[4.15, -1.34, -0.1]`, and one normalized swatch fan near `[-4.0, -1.34, 2.0]`. Each placement uses a wrapper group; marker clones share their geometry and materials.
- On a desk-load failure, fulfilled partial roots are detached and disposed, the procedural desk group remains visible, diagnostics become `fallback`, and the code emits exactly one `Unable to load Tripo desk props` application error.
- Imported triangle diagnostics traverse the visible placed desk group, so the eight marker clones contribute their visible triangles while geometries, materials, and textures are tracked uniquely.

## Verification

- `npm run build` passed. Vite emitted the four hashed GLBs and its existing bundle-size advisory.
- Direct Chromium probe, normal assets: `deskProps=loaded`, `foliage=loading`, `meshes=10`, `materials=3`, `textures=9`, `triangles=92237`.
- Direct Chromium probe with all GLBs intercepted: `deskProps=fallback`, `foliage=loading`, `meshes=0`, `materials=0`, `textures=0`, `triangles=0`; exactly one application error matched `Unable to load Tripo desk props`.
- `npx playwright test tests/book-desk-scene.spec.ts --project=chromium -g "renders|falls back"` ran both desk scenarios. In each case the desk assertion completed first (`loaded` on the normal path and `fallback` on the intercepted path). The suite remains red only because the immediately following Task 5 foliage assertions expect `loaded`/`fallback` but receive `loading` at lines 50 and 113.

## Concerns

- Foliage is intentionally still unplaced and remains `loading` until Task 5.
- The visible desk import is 92,237 triangles, above Task 6's planned 50,000 imported-triangle cap. This is recorded as measured rather than masked; Task 6 needs a reduction strategy before it can enforce that budget.
- The intercepted fallback probe also reports three browser-level `net::ERR_FAILED` resource messages, one per intentionally aborted desk GLB. The application itself logs the required desk error exactly once.
