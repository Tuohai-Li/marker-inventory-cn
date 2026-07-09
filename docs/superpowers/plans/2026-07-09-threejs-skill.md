# Three.js Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and install a Codex-discoverable `threejs` skill from the provided Three.js skill archive.

**Architecture:** Create one `threejs` skill folder under the Codex skills directory. Keep `SKILL.md` lightweight and route task-specific Three.js work to topic reference files adapted from the provided archive.

**Tech Stack:** Codex skills, Markdown, YAML frontmatter, `scripts/init_skill.py`, `scripts/quick_validate.py`, PowerShell, zip extraction with `tar`.

## Global Constraints

- Skill name must be `threejs`.
- Trigger only when the user is explicitly doing Three.js-related development.
- Install under the Codex skills directory so Codex can discover it automatically.
- Use the provided `threejs-skills-main.zip` archive as source material.
- Preserve the reference-manual and code-example-library shape.
- Keep `SKILL.md` lightweight and route detailed content to `references/`.

---

### Task 1: Initialize Installable Skill Folder

**Files:**
- Create: `C:/Users/zz/.codex/skills/threejs/SKILL.md`
- Create: `C:/Users/zz/.codex/skills/threejs/agents/openai.yaml`
- Create: `C:/Users/zz/.codex/skills/threejs/references/`

**Interfaces:**
- Consumes: Codex skill creator scripts from `C:/Users/zz/.codex/skills/.system/skill-creator/`.
- Produces: A valid `threejs` skill directory that later tasks populate.

- [ ] **Step 1: Initialize the skill directory**

Run:

```powershell
python "C:\Users\zz\.codex\skills\.system\skill-creator\scripts\init_skill.py" threejs --path "C:\Users\zz\.codex\skills" --resources references --interface display_name="Three.js" --interface short_description="Reference patterns for Three.js development" --interface default_prompt="Use Three.js references to help me build, debug, or optimize a 3D scene."
```

Expected: `C:\Users\zz\.codex\skills\threejs` exists with `SKILL.md`, `agents/openai.yaml`, and `references/`.

- [ ] **Step 2: Inspect generated files**

Run:

```powershell
Get-ChildItem -Recurse "C:\Users\zz\.codex\skills\threejs"
```

Expected: The generated skill contains only the skill scaffold and no unrelated files.

### Task 2: Adapt Archive Topics Into References

**Files:**
- Create: `C:/Users/zz/.codex/skills/threejs/references/fundamentals.md`
- Create: `C:/Users/zz/.codex/skills/threejs/references/geometry.md`
- Create: `C:/Users/zz/.codex/skills/threejs/references/materials.md`
- Create: `C:/Users/zz/.codex/skills/threejs/references/textures.md`
- Create: `C:/Users/zz/.codex/skills/threejs/references/lighting.md`
- Create: `C:/Users/zz/.codex/skills/threejs/references/animation.md`
- Create: `C:/Users/zz/.codex/skills/threejs/references/interaction.md`
- Create: `C:/Users/zz/.codex/skills/threejs/references/loaders.md`
- Create: `C:/Users/zz/.codex/skills/threejs/references/postprocessing.md`
- Create: `C:/Users/zz/.codex/skills/threejs/references/shaders.md`

**Interfaces:**
- Consumes: `threejs-skills-main/skills/threejs-*/SKILL.md` entries from the zip archive.
- Produces: Topic reference files with original skill frontmatter removed.

- [ ] **Step 1: Extract archive to a temporary folder**

Run:

```powershell
New-Item -ItemType Directory -Force -Path "$env:TEMP\threejs-skills-source" | Out-Null
$sourceZip = Get-ChildItem -Path "D:\" -Filter "threejs-skills-main.zip" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
tar -xf $sourceZip -C "$env:TEMP\threejs-skills-source"
```

Expected: `$env:TEMP\threejs-skills-source\threejs-skills-main\skills` contains the ten source skill folders.

- [ ] **Step 2: Convert each source `SKILL.md` to a reference file**

For each source file, remove the leading YAML frontmatter block and write the remaining Markdown body to the matching reference filename:

```text
threejs-fundamentals -> fundamentals.md
threejs-geometry -> geometry.md
threejs-materials -> materials.md
threejs-textures -> textures.md
threejs-lighting -> lighting.md
threejs-animation -> animation.md
threejs-interaction -> interaction.md
threejs-loaders -> loaders.md
threejs-postprocessing -> postprocessing.md
threejs-shaders -> shaders.md
```

Expected: All ten files exist in `C:\Users\zz\.codex\skills\threejs\references`.

### Task 3: Write Skill Routing Instructions And Validate

**Files:**
- Modify: `C:/Users/zz/.codex/skills/threejs/SKILL.md`
- Modify: `C:/Users/zz/.codex/skills/threejs/agents/openai.yaml`

**Interfaces:**
- Consumes: Reference files from Task 2.
- Produces: Valid skill metadata and routing instructions for Codex.

- [ ] **Step 1: Replace `SKILL.md` with final skill content**

Use this frontmatter:

```yaml
---
name: threejs
description: Reference manual and code example library for Three.js development. Use this skill only when the user is explicitly building, modifying, debugging, integrating, or optimizing Three.js code, including scenes, cameras, renderers, geometry, materials, textures, lighting, GLTF/GLB loaders, animation mixers, raycasting, controls, shaders, postprocessing, WebGL canvas behavior, or Three.js performance work.
---
```

Expected body: concise instructions that classify the task, read only relevant references, prefer `three/addons/...` imports, include resize and cleanup handling, and verify visible 3D scenes.

- [ ] **Step 2: Regenerate `agents/openai.yaml`**

Run:

```powershell
python "C:\Users\zz\.codex\skills\.system\skill-creator\scripts\generate_openai_yaml.py" "C:\Users\zz\.codex\skills\threejs" --interface display_name="Three.js" --interface short_description="Reference patterns for Three.js development" --interface default_prompt="Use Three.js references to help me build, debug, or optimize a 3D scene."
```

Expected: `agents/openai.yaml` matches the final `SKILL.md`.

- [ ] **Step 3: Validate the skill**

Run:

```powershell
python "C:\Users\zz\.codex\skills\.system\skill-creator\scripts\quick_validate.py" "C:\Users\zz\.codex\skills\threejs"
```

Expected: validation passes.

- [ ] **Step 4: Confirm installation shape**

Run:

```powershell
Get-ChildItem -Recurse "C:\Users\zz\.codex\skills\threejs" | Select-Object FullName
```

Expected: `SKILL.md`, `agents/openai.yaml`, and all ten `references/*.md` files are present.
