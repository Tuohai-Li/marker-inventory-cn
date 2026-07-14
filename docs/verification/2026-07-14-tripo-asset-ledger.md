# Tripo Oil-Scene Asset Ledger

**Status:** COMPLETE - intake budgets enforced, the rejected swatch task retained as evidence, and Task 4 P1 marker LOD remediation verified.

## Provider Readiness

| Check | Result |
| --- | --- |
| Credential probe | `TRIPO_API_KEY=SET` |
| Model version | `v3.1-20260211` |
| Common generation options | `texture=true`, `pbr=true`, `texture-quality=detailed`, `geometry-quality=detailed`, `texture-alignment=geometry`, `smart-low-poly=true`, `auto-size=true`, `export-uv=true`, `compress=meshopt`, `wait`, `download` |
| Offline intake tool | `@gltf-transform/cli` `4.4.1` |

## Swatch Selection

| Task ID | Decision | Evidence |
| --- | --- | --- |
| `0a28e52c-3ac2-49b4-9410-d893b3d61490` | Rejected | Preview is a vertical folded pile of card-like slabs, not a six-card fan. Its JSON, generated image, rendered preview, and PBR GLB remain unchanged in `assets/tripo/oil-scene/swatches/` as rejected evidence. |
| `8cca30bc-dfdf-4c8c-bd9b-5911669d5857` | Accepted | Preview is an obvious six-card, 120-degree hand fan around one small pivot. All six colored faces are visible, with no vertical pile, book stack, folded-cloth form, or hidden faces. |

Accepted swatch generation command:

```powershell
python "C:\Users\zz\.agents\skills\threejs-3d-generator\scripts\threejs_3d_asset.py" text --prompt "exactly six flat rounded-rectangle artist color swatch cards arranged as a single 120-degree hand fan on one shared plane, each card radiating from one small central brass pivot rivet, all six full colored front faces visibly spread and readable, each card a different muted sage coral blue mustard lavender or blush paint sample, thick matte paper edges, hand-painted oil illustration style translated into clean game-ready 3D, centered at origin, isolated object, no readable text, no logo, no stand" --negative-prompt "vertical pile, book stack, folded cloth, overlapping hidden faces, cards folded over each other, photorealistic, glossy plastic, letters, numbers, logo, watermark, background, floor, display stand, floating cards far apart" --model-version v3.1-20260211 --texture-quality detailed --geometry-quality detailed --face-limit 10000 --smart-low-poly --auto-size --compress meshopt --wait --download --out-dir "assets\tripo\oil-scene\swatches"
```

## Selected Sources And Runtime Derivatives

Raw provider PBR outputs are immutable source evidence. Runtime GLBs are offline derivatives rather than byte-identical copies. Every source and runtime file has one PBR material with `baseColorTexture`, `normalTexture`, and `metallicRoughnessTexture`.

| Asset | Selected task and provider PBR source | Source bytes / SHA-256 | Source triangles / textures | Runtime GLB | Runtime bytes / SHA-256 | Runtime triangles / textures |
| --- | --- | --- | --- | --- | --- | --- |
| marker | `8d1a2667-995a-4836-9b84-5b51d16cc22c`<br>`assets/tripo/oil-scene/marker/8d1a2667-995a-4836-9b84-5b51d16cc22c-pbr_model.glb` | 2,388,656<br>`58C35804BC2D8D45344BD0CF42ADE0277A4F46ECBBC6671DB30B4386A06527C5` | 8,786<br>3 x 4096x4096 JPEG | `src/assets/models/oil-scene/marker.glb` | 503,756<br>`8523CD9F7473EFF653AD1DCB66CEB2A4605D6B11DF946A97CB7E8EB15733890C` | 3,398<br>3 x 1024x1024 JPEG |
| cup | `03a05f10-8d09-4789-9f67-2bc09a341741`<br>`assets/tripo/oil-scene/cup/03a05f10-8d09-4789-9f67-2bc09a341741-pbr_model.glb` | 1,574,948<br>`F1BF55B86DCF80340F3CE5BE6B12920FD4F0B795DFA92F9306010D14E978AC19` | 9,437<br>3 x 4096x4096 JPEG | `src/assets/models/oil-scene/cup.glb` | 386,132<br>`5D566B792F65EB52B080767EC54236AD344AB17984563D4BE73BA1F92997C0DA` | 9,437<br>3 x 1024x1024 JPEG |
| swatches | `8cca30bc-dfdf-4c8c-bd9b-5911669d5857`<br>`assets/tripo/oil-scene/swatches/8cca30bc-dfdf-4c8c-bd9b-5911669d5857-pbr_model.glb` | 2,170,996<br>`3AA26C3204D9D23B73AC42161C6126094B25EA98214FB5CE2E8435878A0A21B7` | 12,512<br>3 x 4096x4096 JPEG | `src/assets/models/oil-scene/swatches.glb` | 735,612<br>`2B1B041EBCD170C71885FD182CA3C6D82695B7419A17167046BFABC41659DBD4` | 12,512<br>3 x 1024x1024 JPEG |
| foliage-kit | `25814f77-806a-4286-b7f8-538eb0e85b8d`<br>`assets/tripo/oil-scene/foliage-kit/25814f77-806a-4286-b7f8-538eb0e85b8d-pbr_model.glb` | 3,680,924<br>`FC383EE8400BD20BB7773D10812C481C4D55D121A42B89662D4A6859B97BD0BD` | 23,334<br>3 x 4096x4096 JPEG | `src/assets/models/oil-scene/foliage-kit.glb` | 1,408,404<br>`A8799A337D96871A15227EF5C5769A2E554EA1E52BE20C9AE6CC5DAD9E684162` | 16,332<br>3 x 1024x1024 JPEG |

The rejected old swatch runtime contributed 12,822 triangles, so the pre-fix runtime total was **54,379** triangles. The accepted selected sources total **54,069** triangles. After foliage simplification and the Task 4 P1 marker LOD, final runtime derivatives total **41,679** triangles. For the visible Task 4 desk import, eight marker clones plus one cup and one swatch fan changed from **92,237** to **49,133** triangles, meeting the 50,000 hard limit with 867 triangles of headroom. All runtime textures are 1024x1024, meeting the 1024 target and the 2048 hard maximum.

## Offline Runtime Processing

These commands were run from the repository root. `resize` uses its Lanczos3 default, preserves texture aspect ratio, and never increases a dimension. Temporary candidate files were removed after creating each runtime asset.

```powershell
$markerCandidate = Join-Path $env:TEMP "marker-task4-candidate.glb"
npx --yes @gltf-transform/cli simplify "assets/tripo/oil-scene/marker/8d1a2667-995a-4836-9b84-5b51d16cc22c-pbr_model.glb" $markerCandidate --ratio 0.35 --error 0.02
npx --yes @gltf-transform/cli resize $markerCandidate "src/assets/models/oil-scene/marker.glb" --width 1024 --height 1024
Remove-Item -LiteralPath $markerCandidate
npx --yes @gltf-transform/cli resize "assets/tripo/oil-scene/cup/03a05f10-8d09-4789-9f67-2bc09a341741-pbr_model.glb" "src/assets/models/oil-scene/cup.glb" --width 1024 --height 1024
npx --yes @gltf-transform/cli resize "assets/tripo/oil-scene/swatches/8cca30bc-dfdf-4c8c-bd9b-5911669d5857-pbr_model.glb" "src/assets/models/oil-scene/swatches.glb" --width 1024 --height 1024
npx --yes @gltf-transform/cli simplify "assets/tripo/oil-scene/foliage-kit/25814f77-806a-4286-b7f8-538eb0e85b8d-pbr_model.glb" "src/assets/models/oil-scene/foliage-kit.candidate.glb" --ratio 0.70 --error 0.01
npx --yes @gltf-transform/cli resize "src/assets/models/oil-scene/foliage-kit.candidate.glb" "src/assets/models/oil-scene/foliage-kit.glb" --width 1024 --height 1024
```

The foliage simplifier produced 16,332 triangles from 23,334 while retaining the source bounding box and its PBR material maps. Task 4 P1 reduced the marker from 8,786 to 3,398 triangles while preserving its PBR material maps, 1024px textures, and a visually legible small-desk silhouette. Cup and swatch geometry remain untouched.

## Structural Verification

`npx --yes @gltf-transform/cli inspect <runtime-glb> --format=md` reports glTF 2.0, a single PBR material, all three expected texture slots, no animation, and these unchanged bounds. Direct binary-header checks report `glTF`, version `2`, and a header byte length equal to each file size.

| Asset | Bounds (min to max) | Runtime GLB header |
| --- | --- | --- |
| marker | `-0.01883,-0.09,-0.01743` to `0.01886,0.08965,0.01744` | `glTF v2 length=503756` |
| cup | `-0.08245,-0.10999,-0.1048` to `0.08244,0.11001,0.10487` | `glTF v2 length=386132` |
| swatches | `-0.08137,-0.50043,-0.49587` to `0.08334,0.49957,0.50217` | `glTF v2 length=735612` |
| foliage-kit | `-0.17355,-0.28741,-0.35071` to `0.17382,0.31259,0.35089` | `glTF v2 length=1408404` |

## Task 4 P1 Focused Verification

- Runtime marker: valid `glTF` v2 header, declared length equals file length (`503756` bytes), one PBR material, `baseColorTexture`, `normalTexture`, and `metallicRoughnessTexture`, all `1024x1024` JPEG.
- Normal desk probe: `deskProps=loaded`, `foliage=loading`, `meshes=10`, `materials=3`, `textures=9`, and `triangles=49133`. The eight markers, cup, and swatches are visible; the marker silhouette remains acceptable at desk scale.
- Intercepted GLB probe: `deskProps=fallback`, `foliage=loading`, and imported resource counts/triangles are zero. The application emits exactly one `Unable to load Tripo desk props` error.
- The focused Task 4 Playwright command remains red only on Task 5's unimplemented foliage expectations (`loading` rather than `loaded`/`fallback`); no foliage state was changed or represented as complete here.
