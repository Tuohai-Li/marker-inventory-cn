# Task 3 Report

## Status

COMPLETE

## Delivered

- Added `*.glb` to Vite's explicit asset include list and imported the four stable runtime GLBs through `importedAssetManifest.ts`.
- Added disposal-safe asynchronous GLTF loading, root normalization, material safety clamps, source triangle metadata, and unique resource diagnostics/tracking.
- Kept normalized roots in an invisible scene staging group. No procedural objects, placement transforms, cloning, or swap behavior changed.
- Initialized imported-asset diagnostics and disposed the loader handle before clearing scene-tracked resources.

## Verification

- `npm run build` passed and emitted four hashed assets: `cup-BDDor0z2.glb`, `marker-Yl4uH_7K.glb`, `swatches-BSZ-xOFG.glb`, and `foliage-kit-C6dixJMm.glb`.

## Handoff

- Tasks 4 and 5 must replace the temporary fallback-group placeholders with the actual grouped procedural builders, place staged roots and clones, and set the `loaded` or `fallback` diagnostics states. Until then, the existing browser contract test correctly remains ahead of the implementation boundary.

## Concerns

- `npx tsc --noEmit` remains blocked by pre-existing missing Three.js declarations and unrelated application type errors. Vite's requested production build passes.

## P1 Normalization Fix (2026-07-14)

- Root cause: normalization translated unscaled bounds and then applied the root scale, which scaled the ground offset and left final bounds below `Y=0`.
- `normalizeImportedRoot` now scales first, updates world matrices, recomputes `Box3`, translates the scaled bounds to X/Z center `0` and minimum Y `0`, then updates matrices again. Placement Tasks 4 and 5 were not changed.

### Exact Verification Evidence

- Focused Chromium/Playwright check through the Vite module pipeline, using a `4 x 2 x 6` box at `(11, 7, -13)` with `targetSize=3`: `PASS deterministic normalization {"centerX":0,"centerZ":0,"minY":0,"largest":3}`.
- Runtime GLB check through `GLTFLoader` in Chromium with tolerance `0.000001`:
  - `marker`: `centerX=0.000000000 centerZ=0.000000000 minY=0.000000000 largest=1.200000000 target=1.200000000`
  - `cup`: `centerX=0.000000000 centerZ=0.000000000 minY=0.000000000 largest=0.900000000 target=0.900000000`
  - `swatches`: `centerX=0.000000000 centerZ=0.000000000 minY=0.000000000 largest=1.100000000 target=1.100000000`
  - `foliage`: `centerX=0.000000000 centerZ=0.000000000 minY=0.000000000 largest=2.250000000 target=2.250000000`
  - Result: `PASS all 4 runtime GLB normalization checks within 0.000001`.
- `npm run build`: passed (`vite v6.3.5`, `2375 modules transformed`, `built in 4.08s`) and emitted `cup-BDDor0z2.glb`, `marker-Yl4uH_7K.glb`, `swatches-BSZ-xOFG.glb`, and `foliage-kit-C6dixJMm.glb`.
