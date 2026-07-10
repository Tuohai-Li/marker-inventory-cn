# Oil-Painting 3D Marker Notebook Scene Design

## Goal

Transform the existing marker inventory into an interactive oil-painting-style Three.js scene inspired by the approved window, lake, mountain, flower, and tabletop concept. The existing React interface remains live DOM content on a single-page loose-leaf notebook. Three.js owns the surrounding world and the physical notebook shell; it never rasterizes the product UI into a texture.

## Experience

The default view presents a calm artist's desk in front of an open window. A single-page loose-leaf notebook rests on the desk as the primary foreground object, with marker tools and a restrained tea-and-flower still life supporting the scene. Beyond the window are layered mountains, trees, drifting clouds, and a reflective lake.

Selecting the notebook frame or the dedicated focus control starts a coordinated transition: the notebook lifts slightly, the Three.js camera pushes closer, and the DOM page moves into a near-front-facing reading position. The page remains clickable, scrollable, searchable, and form-safe throughout. Selecting the focus control again, pressing Escape, or navigating back returns to the full scene.

Free orbit, zoom, and unconstrained dragging are intentionally excluded. They would compete with page scrolling, page flips, form controls, and touch input.

## Rendering Architecture

### Scene Layer

`BookDeskScene` owns one WebGL canvas and a scene controller. It builds the window architecture, desk, lake, terrain, foliage, clouds, props, and the physical loose-leaf notebook shell. Scene construction is split into focused modules so geometry, materials, motion, and disposal remain testable and understandable.

The camera exposes two named poses: `overview` and `focus`. A damped transition interpolates camera position, look target, and notebook lift. Pointer movement adds only low-strength ambient parallax in overview mode.

### DOM Book Layer

The existing `Header`, `BookFlipBook`, routes, forms, charts, modals, and page data remain React DOM. The DOM book surface is placed in a responsive stage above the canvas and styled as the top paper of the loose-leaf notebook. CSS perspective and transform variables keep it visually aligned with the Three.js shell in overview and focus poses.

The canvas never receives page interaction. Only the notebook frame/focus control handles scene interaction. DOM controls retain normal pointer, wheel, keyboard, and touch behavior.

### Synchronization Contract

The scene root owns a binary `focused` state and publishes it through classes and CSS custom properties. The same state drives:

- Three.js camera pose and physical notebook lift.
- DOM stage translation, scale, and perspective correction.
- Focus-control icon, label, and accessibility state.
- Reduced scenery prominence while reading.

No per-frame DOM measurements are performed. `ResizeObserver` updates stable viewport and book bounds only when layout dimensions change.

## Visual System

The approved oil-painting concept is a visual reference, not a full-screen runtime texture. The scene uses simplified buildable geometry with painterly materials:

- Low-frequency color variation and canvas-grain noise in material shaders.
- Broad color blocks, restrained roughness variation, and softened silhouettes.
- Directional window light, warm bounce, contact shadows, and limited highlights.
- No glow-heavy effects, photorealistic PBR polish, or dark cinematic grading.

The notebook uses a warm cloth back cover, stacked paper edges, visible punched holes, and a vertical row of metal loose-leaf rings on the left. Only one primary DOM page is visible at a time. Marker pens, swatch cards, a ceramic cup, and selected still-life objects frame the book without covering it.

## Environmental Motion

- Tree crowns and nearby foliage sway with layered low-amplitude sinusoidal motion.
- Clouds drift slowly across the distant sky and wrap without visible jumps.
- The lake uses a lightweight shader with moving normals/color bands and sparse sun glints.
- Curtains have minimal secondary motion so the page remains the calmest visual surface.
- Marker tools and desk props remain static for visual stability.

When `prefers-reduced-motion: reduce` is active, environmental animation, parallax, and camera tweening stop. Focus state changes immediately while preserving every function.

## Responsive Behavior

Desktop keeps the complete notebook, props, and a meaningful band of window scenery visible. Focus mode expands the page to a readable working area without covering essential header actions.

Mobile prioritizes the DOM page. The scene crops decoratively around the notebook, props move outside the interaction area, and the focus state becomes the default visual emphasis. Text, controls, page flips, scrolling, and modals must remain fully usable within safe viewport bounds.

## Lifecycle And Performance

- Clamp renderer pixel ratio by viewport class and device capability.
- Use shared geometries/materials and instancing for repeated foliage, cloud, ring, and marker elements where practical.
- Keep shadow casters limited to the notebook and key foreground props.
- Pause the animation loop when the document is hidden.
- Dispose renderer, textures, geometries, materials, observers, media-query listeners, DOM listeners, and animation frames on unmount.
- Avoid post-processing unless measured screenshots show a clear quality gain within budget.

Target budgets for the scene are under 120 draw calls, under 250,000 visible triangles, and no runtime image texture larger than 2048 pixels on its longest edge. The app should remain responsive at 390x844 and common desktop viewports.

## Failure Handling

If WebGL initialization fails, the DOM notebook remains fully available over the oil-painting CSS fallback background. If optional texture loading fails, materials fall back to deterministic painted colors. Scene errors must not block routing, forms, modals, search, or page navigation.

## Verification

Completion requires all of the following evidence:

- TypeScript/Vite production build succeeds.
- Playwright exercises overview-to-focus and focus-to-overview transitions.
- Search, page navigation, scrolling, and a representative modal remain interactive.
- Desktop and mobile screenshots show the notebook correctly aligned with its 3D shell.
- Canvas pixel inspection proves a nonblank, varied render.
- Reduced-motion mode has no continuous environmental animation.
- Console and page error checks are clean.
- Renderer statistics stay within the technical-art budget.
- Scene lifecycle cleanup and resize behavior are verified.

## Out Of Scope

- Converting DOM pages into canvas textures.
- Free-orbit camera controls.
- Physics-based book handling.
- Multiplayer, persistence changes, API changes, or route changes.
- Replacing the existing marker inventory workflows or page data model.
