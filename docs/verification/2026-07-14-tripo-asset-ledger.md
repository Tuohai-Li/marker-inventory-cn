# Tripo Oil-Scene Asset Ledger

**Status:** COMPLETE - four accepted PBR GLBs copied to stable runtime paths.

## Provider Readiness

| Check | Result |
| --- | --- |
| Credential probe | `TRIPO_API_KEY=SET` |
| Model version | `v3.1-20260211` |
| Common options | `texture=true`, `pbr=true`, `texture-quality=detailed`, `geometry-quality=detailed`, `texture-alignment=geometry`, `smart-low-poly=true`, `auto-size=true`, `export-uv=true`, `compress=meshopt`, `wait`, `download` |

## Accepted Assets

| Asset | Task ID | Face limit | Provider PBR source | Stable runtime file | Bytes | SHA-256 | Acceptance |
| --- | --- | ---: | --- | --- | ---: | --- | --- |
| marker | `8d1a2667-995a-4836-9b84-5b51d16cc22c` | 8,000 | `assets/tripo/oil-scene/marker/8d1a2667-995a-4836-9b84-5b51d16cc22c-pbr_model.glb` | `src/assets/models/oil-scene/marker.glb` | 2,388,656 | `58C35804BC2D8D45344BD0CF42ADE0277A4F46ECBBC6671DB30B4386A06527C5` | Accepted: single, readable marker silhouette with intact body and nib-end form; no text, floor, or background. |
| cup | `03a05f10-8d09-4789-9f67-2bc09a341741` | 8,000 | `assets/tripo/oil-scene/cup/03a05f10-8d09-4789-9f67-2bc09a341741-pbr_model.glb` | `src/assets/models/oil-scene/cup.glb` | 1,574,948 | `F1BF55B86DCF80340F3CE5BE6B12920FD4F0B795DFA92F9306010D14E978AC19` | Accepted: intact tapered cup and curved handle with a stable base; no detached geometry, text, floor, or background. |
| swatches | `0a28e52c-3ac2-49b4-9410-d893b3d61490` | 10,000 | `assets/tripo/oil-scene/swatches/0a28e52c-3ac2-49b4-9410-d893b3d61490-pbr_model.glb` | `src/assets/models/oil-scene/swatches.glb` | 3,145,684 | `9D4E1ADE9A06612CEDD7BBCEE05332F6B5478117267C5A8A1195D304D9422D86` | Accepted: compact layered card stack with clear color separation; no readable text, floor, or background. |
| foliage-kit | `25814f77-806a-4286-b7f8-538eb0e85b8d` | 15,000 | `assets/tripo/oil-scene/foliage-kit/25814f77-806a-4286-b7f8-538eb0e85b8d-pbr_model.glb` | `src/assets/models/oil-scene/foliage-kit.glb` | 3,680,924 | `FC383EE8400BD20BB7773D10812C481C4D55D121A42B89662D4A6859B97BD0BD` | Accepted: separate potted flowering plant and compact tree form, grounded with connected roots; no scene background or billboard foliage. |

The SHA-256 hash for every stable runtime GLB matches its selected provider PBR source. Provider JSON records, generated images, and rendered previews remain in the corresponding `assets/tripo/oil-scene/<asset>/` directory.

## Task Prompts And Asset-Specific Options

### Marker

- Prompt: `single alcohol art marker pen for a cozy artist desk, softly rounded rectangular barrel, fitted cap and small nib-end details, hand-painted oil illustration style translated into clean game-ready 3D, matte ivory body with muted sage and coral accents, readable silhouette, centered at origin, isolated object, no text, no logo, no stand`
- Negative prompt: `photorealistic glossy plastic, text, letters, logo, watermark, background, floor, display stand, floating parts, extra pens`
- Asset-specific option: `face-limit=8000`

### Cup

- Prompt: `single handmade ceramic marker cup for a bright window-side artist desk, tapered cup with an integrated curved handle, subtle uneven pottery silhouette, light warm ivory glaze with muted blue-green brush strokes, oil-painted stylized game-ready 3D, matte rough surface, centered at origin, isolated object, no contents, no text, no logo, no stand`
- Negative prompt: `photorealistic, glossy chrome, transparent glass, text, letters, logo, watermark, background, floor, display stand, floating parts`
- Asset-specific option: `face-limit=8000`

### Swatches

- Prompt: `compact fan-shaped stack of six artist color swatch cards, layered thick paper tabs with rounded corners, muted sage coral blue mustard and lavender paint samples, hand-painted oil illustration style, clean game-ready 3D, matte paper fibers, centered at origin, isolated object, no readable text, no logo, no stand`
- Negative prompt: `photorealistic, glossy plastic, letters, numbers, logo, watermark, background, floor, display stand, floating cards far apart`
- Asset-specific option: `face-limit=10000`

### Foliage Kit

- Prompt: `cohesive window-side foliage kit for a cozy artist studio: one small rounded potted flowering plant beside one compact young tree with a short trunk and layered leaf clusters, asymmetrical natural silhouette, muted sage forest and pale green foliage with sparse coral and cream flowers, visible oil-paint brush color variation, stylized game-ready 3D, matte surfaces, roots aligned to one ground plane, isolated asset group, no background, no stand`
- Negative prompt: `photorealistic leaves, flat billboard foliage, neon green, glossy plastic, text, logo, watermark, landscape terrain, room, window, floating roots`
- Asset-specific option: `face-limit=15000`
