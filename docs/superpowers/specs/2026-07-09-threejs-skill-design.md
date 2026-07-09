# Three.js Codex Skill Design

## Goal

Create an installable Codex skill named `threejs` that improves Codex's ability to write, debug, integrate, and optimize Three.js code by providing focused API references, constructor signatures, working examples, performance notes, and cross-system integration patterns.

## Trigger Behavior

The skill should trigger only when the user is explicitly doing Three.js-related development. It should not trigger for generic 3D discussion, generic WebGL theory, or unrelated frontend work unless the user clearly asks to implement, modify, debug, or optimize Three.js code.

The frontmatter description should mention concrete trigger contexts such as Three.js scenes, cameras, renderers, geometry, materials, textures, lights, GLTF/GLB loading, animation mixers, raycasting, controls, shaders, postprocessing, and performance optimization.

## Structure

Use a single installable skill folder:

```text
threejs/
|-- SKILL.md
|-- agents/
|   `-- openai.yaml
`-- references/
    |-- fundamentals.md
    |-- geometry.md
    |-- materials.md
    |-- textures.md
    |-- lighting.md
    |-- animation.md
    |-- interaction.md
    |-- loaders.md
    |-- postprocessing.md
    `-- shaders.md
```

`SKILL.md` should stay lightweight. It should tell Codex to classify the Three.js task, read only the relevant reference files, favor current import paths, include cleanup and resize handling, and verify rendering when building UI-visible 3D scenes.

The `references/` files should be adapted from the provided `threejs-skills-main.zip` source material. Each original topical `SKILL.md` becomes a reference file with frontmatter removed and content preserved or lightly normalized.

## Resource Routing

Codex should use these routing rules:

- `fundamentals.md`: scene setup, cameras, renderer, Object3D hierarchy, coordinate systems, resize loops, cleanup basics.
- `geometry.md`: built-in geometry, BufferGeometry, attributes, custom geometry, instancing, merging, draw-call reduction.
- `materials.md`: built-in materials, PBR settings, transparency, depth behavior, material updates, ShaderMaterial relationships.
- `textures.md`: TextureLoader, UVs, color space, wrapping, filtering, mipmaps, environment maps, render targets.
- `lighting.md`: light types, shadows, helpers, environment lighting, physically plausible lighting setup.
- `animation.md`: animation loops, clocks, mixers, clips, skeletal animation, morph targets.
- `interaction.md`: raycasting, pointer/touch input, controls, object selection, drag/hover behavior.
- `loaders.md`: GLTF/GLB, Draco/KTX2 patterns, async loading, LoadingManager, caching, disposal after unload.
- `postprocessing.md`: EffectComposer, passes, bloom, depth of field, custom passes, resize and pixel ratio handling.
- `shaders.md`: GLSL, ShaderMaterial, uniforms, varyings, shader chunks, onBeforeCompile, debugging shader errors.

## Output Expectations

When using this skill, Codex should produce practical Three.js code that is directly usable in the user's project context. For React/Vite projects, examples should prefer module imports from `three` and `three/addons/...`, lifecycle-safe setup, resize handling, requestAnimationFrame cleanup, resource disposal, and canvas sizing that fits the surrounding UI.

When changing an existing app, Codex should follow the local framework and design system. For visible 3D work, it should verify that the canvas is nonblank, framed correctly, responsive, and not leaking animation loops or WebGL resources.

## Validation

Validate the skill with Codex's skill validation script after creation. Basic success criteria:

- The skill folder has valid frontmatter and naming.
- `agents/openai.yaml` exists and matches the skill.
- All ten reference files exist.
- The main `SKILL.md` routes tasks to references instead of duplicating all source material.
- The skill is placed under the Codex skills directory so it can be discovered automatically.
