# Task 1 Report

## Status

COMPLETE - review findings fixed.

## Delivered

- Regenerated only swatches as accepted Tripo task `8cca30bc-dfdf-4c8c-bd9b-5911669d5857`; its preview is an obvious six-card, 120-degree hand fan on one plane around one pivot rivet.
- Rejected task `0a28e52c-3ac2-49b4-9410-d893b3d61490` remains intact in `assets/tripo/oil-scene/swatches/` with its raw PBR GLB and preview as evidence of the vertical-pile failure.
- Retained every selected raw provider PBR source unchanged and produced independent runtime GLB derivatives in `src/assets/models/oil-scene/`.
- Used `@gltf-transform/cli` `4.4.1` to resize every embedded runtime texture to 1024x1024 while preserving base-color, normal, and metallic-roughness PBR maps.
- Simplified foliage only, from 23,334 to 16,332 triangles at `--ratio 0.70 --error 0.01`; marker, cup, and accepted swatches retain source geometry.
- Final runtime total is 47,067 triangles, down from the rejected-swatch intake total of 54,379 and under the 50,000 hard budget.
- Verified glTF 2.0 headers, matching header/file byte lengths, unchanged source/runtime bounds, PBR texture slots, source and runtime hashes, and the 1024px texture limit. Exact commands and metrics are in `docs/verification/2026-07-14-tripo-asset-ledger.md`.

## Visual Intake

The accepted swatch preview visibly shows six colored rounded cards fanned around a small center rivet. It has no vertical pile, book-stack form, folded cloth, or faces hidden by overlap.
