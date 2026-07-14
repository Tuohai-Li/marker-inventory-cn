# Subagent-Driven Development Progress

Plan: `docs/superpowers/plans/2026-07-14-tripo-prop-foliage-upgrade.md`

Baseline: page-flip postinstall idempotence fixed; build and 5 Chromium tests pass.

Task 1: blocked before task creation (`TRIPO_API_KEY=SET`; HTTP 403 code 2010, insufficient credit). No assets or task IDs created.

Task 1 resume: blocked before task creation (`TRIPO_API_KEY=SET`; HTTP 401 code 1002, authentication failed). Process key matches Windows user environment; official endpoint is in use and no custom base URL is configured.

Task 1 resume 2: blocked before task creation (`TRIPO_API_KEY=SET`; HTTP 401 code 1002, authentication failed) after refreshing the process key from the Windows user environment. No task IDs, previews, or assets were created.

Task 1 resume 3: partial progress. Marker task `8d1a2667-995a-4836-9b84-5b51d16cc22c` and cup task `03a05f10-8d09-4789-9f67-2bc09a341741` succeeded; provider records, previews, PBR GLBs, and stable runtime copies are present. Swatches failed before task creation with HTTP 403 code 2010 (insufficient credit); foliage was not submitted. Resume with swatches then foliage only after credit top-up.

Task 1 finalized (superseded by the review fix below): accepted swatches task `0a28e52c-3ac2-49b4-9410-d893b3d61490` and foliage-kit task `25814f77-806a-4286-b7f8-538eb0e85b8d` were present with provider records, previews, PBR GLBs, and byte-identical runtime copies.

Task 1 review fix: rejected swatches task `0a28e52c-3ac2-49b4-9410-d893b3d61490` remains as raw vertical-pile evidence. Accepted replacement task `8cca30bc-dfdf-4c8c-bd9b-5911669d5857` is an inspected six-card fan. Raw provider PBR GLBs remain unchanged; runtime derivatives have 1024px PBR textures and total 47,067 triangles after foliage-only simplification. Ledger and task report now record source/runtime hashes, processing commands, bounds, and metrics.

Task 3: complete. Added manifest-based Vite GLB imports, normalized disposal-safe GLTF loading with unique resource diagnostics, an invisible staging boundary, and controller disposal integration. `npm run build` passed with four hashed GLBs in `dist/assets`. Visible placement, procedural fallback grouping, and `loaded`/`fallback` transitions remain Tasks 4-5 work.

Task 3 P1 normalization fix: corrected the scale/translate order in `normalizeImportedRoot`. It now scales to the target largest dimension, updates matrices and recomputes bounds, then translates the scaled bounds to final X/Z center `0` and minY `0`. Chromium/Playwright checks passed for a deterministic offset box and all four runtime GLBs within `0.000001`; measured runtime final bounds are centerX/centerZ/minY `0.000000000` with largest dimensions marker `1.200000000`, cup `0.900000000`, swatches `1.100000000`, foliage `2.250000000`. `npm run build` passed (Vite built in 4.08s). Tasks 4-5 placement/fallback code was not altered.

Task 4: complete. Procedural desk props now have one real fallback group, while marker/cup/swatch imports load and swap atomically after all three desk GLBs resolve. Eight marker clones use wrapper transforms and shared resources; the cup and six-card fan each have one wrapper placement. On an intercepted desk failure, partial detached roots are disposed, diagnostics become `deskProps=fallback`, and the application logs exactly one `Unable to load Tripo desk props` error. Direct Chromium evidence: desk success `loaded`, `meshes=10`, `materials=3`, `textures=9`, `triangles=92237`; intercepted desk failure `fallback`, unique imported counts and triangles `0`. The Task 4 focused Playwright slice is expectedly red only at the unimplemented Task 5 foliage assertions (`loading` instead of `loaded`/`fallback`); desk assertions complete before those lines. `npm run build` passed with Vite's existing bundle-size advisory. The 92,237 visible desk triangles exceed the future Task 6 50,000 imported-triangle budget and must be reduced there.

Task 4 P1 triangle budget fix: rebuilt only `src/assets/models/oil-scene/marker.glb` from the immutable provider PBR source using deterministic `@gltf-transform/cli simplify --ratio 0.35 --error 0.02` followed by 1024px texture resize. Marker triangles changed from 8,786 to 3,398; eight markers plus cup and swatches changed from 92,237 to 49,133, within the 50,000 cap. GLB v2 header, file length, bounds, three 1024px PBR textures, source/runtime SHA-256, normal `deskProps=loaded`, and intercepted `deskProps=fallback` with exactly one desk-load error were verified. The focused Task 4 Playwright slice remains red solely at Task 5 foliage assertions (`loading` versus expected `loaded`/`fallback`); foliage placement/state and test code were not changed.
