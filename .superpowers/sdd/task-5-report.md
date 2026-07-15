# Task 5 Report

## Completed Work

- Grouped the existing procedural trees and flower masses under `proceduralFoliage`.
- Loaded the normalized foliage kit separately from desk props and placed two positive-scale wrappers at `[-4.0, -0.55, -4.9]` and `[3.8, -0.55, -5.2]`.
- Registered root sway at phases `0.35` and `2.6`, with amplitudes `0.021` and `0.019`. Reduced motion already suppresses `updateMotion`, so imported roots remain still in that mode.
- Made foliage loading atomic: both wrappers attach and hide the procedural group on success; any load failure leaves the procedural group visible, sets `foliage` to `fallback`, and emits one `Unable to load Tripo foliage` error.
- Retained the interrupted `marker.glb` and `foliage-kit.glb` outputs after validating their glTF v2 headers, PBR material slots, and 1024x1024 texture maps.

## Actual Runtime Metrics

- `marker.glb`: 493,932 bytes, 3,168 triangles, SHA-256 `981D09360A7F99BF9D2630D6FB6B458BB4FD8DBE4F3110061BF346D8A1ECAE05`.
- `foliage-kit.glb`: 1,321,304 bytes, 14,210 triangles, SHA-256 `3D09E0ED5F2C12354BCCF9F2D82A54420ADC7920D393D41DC69A6344BCE429D8`.
- Both assets: glTF 2.0, one PBR material with base-color, normal, and metallic-roughness maps; all maps are 1024x1024 JPEG.
- Imported visible desk triangles: 47,293. Runtime-asset total: 39,327. These values are informational only.

## Verification

- `npx playwright test tests/book-desk-scene.spec.ts --project=chromium -g "renders|narrow|reduced|falls back"`: 4 passed.
- `npm run build`: passed.
- `npx tsc --noEmit`: still reports pre-existing project-wide type errors outside this task, including missing `three` declarations and unrelated component/page errors.
