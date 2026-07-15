import { expect, test, type Page } from "@playwright/test";

interface SceneDiagnostics {
  pose: "overview" | "focus";
  assets: {
    deskProps: "loading" | "loaded" | "fallback";
    foliage: "loading" | "loaded" | "fallback";
    meshes: number;
    materials: number;
    textures: number;
    triangles: number;
  };
  drawCalls: number;
  triangles: number;
  motionTick: number;
  reducedMotion: boolean;
  animationActive: boolean;
}

async function readDiagnostics(page: Page) {
  return page.evaluate(() =>
    (window as typeof window & {
      __BOOK_SCENE_DIAGNOSTICS__?: SceneDiagnostics;
    }).__BOOK_SCENE_DIAGNOSTICS__,
  );
}

test("renders the 3D desk scene behind the existing interactive book", async ({ page }) => {
  await page.goto("/");

  const scene = page.locator('[data-testid="book-desk-scene"]');
  const canvas = page.locator('[data-testid="book-desk-scene-canvas"]');
  const content = page.locator('[data-testid="book-desk-content"]');

  await expect(scene).toBeVisible();
  await expect(canvas).toBeVisible();
  await expect(content).toBeVisible();
  await expect(page.locator(".book-page")).toBeVisible();
  await expect(scene).toHaveAttribute("data-focus-mode", "overview");
  await expect(page.getByTestId("book-surface-stage")).toBeVisible();
  await expect(page.getByTestId("book-focus-toggle")).toHaveAttribute(
    "aria-pressed",
    "false",
  );

  await expect(canvas).toHaveCSS("pointer-events", "none");
  await expect(canvas).toHaveAttribute("aria-hidden", "true");

  await expect.poll(async () => (await readDiagnostics(page))?.assets.deskProps).toBe("loaded");
  await expect.poll(async () => (await readDiagnostics(page))?.assets.foliage).toBe("loaded");
  const diagnostics = await readDiagnostics(page);
  expect(diagnostics?.assets.meshes).toBeGreaterThan(0);
  expect(diagnostics?.assets.materials).toBeGreaterThan(0);
  expect(diagnostics?.assets.textures).toBeGreaterThan(0);
  expect(diagnostics?.assets.triangles).toBeGreaterThan(0);
  expect(diagnostics?.drawCalls).toBeLessThan(120);
  expect(diagnostics?.triangles).toBeLessThan(250_000);

  const canvasBox = await canvas.boundingBox();
  const sceneBox = await scene.boundingBox();

  expect(canvasBox?.width).toBeGreaterThan(300);
  expect(canvasBox?.height).toBeGreaterThan(300);
  expect(sceneBox?.width).toBeGreaterThan(300);
  expect(sceneBox?.height).toBeGreaterThan(300);

  const sampledPixels = await canvas.evaluate((element) => {
    const canvasElement = element as HTMLCanvasElement;
    const gl =
      canvasElement.getContext("webgl2", { preserveDrawingBuffer: true }) ??
      canvasElement.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) return { unique: 0, nonEmpty: 0 };

    const points = [
      [0.18, 0.2],
      [0.5, 0.28],
      [0.82, 0.3],
      [0.25, 0.68],
      [0.5, 0.72],
      [0.75, 0.72],
    ];
    const colors = new Set<string>();
    let nonEmpty = 0;

    for (const [xRatio, yRatio] of points) {
      const pixel = new Uint8Array(4);
      gl.readPixels(
        Math.floor(canvasElement.width * xRatio),
        Math.floor(canvasElement.height * yRatio),
        1,
        1,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixel,
      );
      colors.add(Array.from(pixel).join(","));
      if (pixel[3] > 0 && (pixel[0] > 0 || pixel[1] > 0 || pixel[2] > 0)) {
        nonEmpty += 1;
      }
    }

    return { unique: colors.size, nonEmpty };
  });

  expect(sampledPixels.nonEmpty).toBeGreaterThan(0);
  expect(sampledPixels.unique).toBeGreaterThan(1);

  await page.locator("header input").first().fill("Copic");
  await page.locator("header input").first().press("Enter");
  await expect(page).toHaveURL(/\/library\?q=Copic$/);
  await expect(page.locator(".book-page")).toBeVisible();
});

test("keeps desk imports and search interactive when foliage loading fails", async ({ page }) => {
  await page.route("**/foliage-kit*.glb", (route) => route.abort());
  await page.goto("/");

  await expect.poll(async () => (await readDiagnostics(page))?.assets.deskProps).toBe("loaded");
  await expect.poll(async () => (await readDiagnostics(page))?.assets.foliage).toBe("fallback");
  await expect(page.getByTestId("book-desk-scene-canvas")).toBeVisible();

  await page.locator("header input").first().fill("Copic");
  await page.locator("header input").first().press("Enter");
  await expect(page).toHaveURL(/\/library\?q=Copic$/);
  await expect(page.locator(".book-page")).toBeVisible();
});

test("falls back to procedural props when imported models fail", async ({ page }) => {
  await page.route("**/*.glb", (route) => route.abort());
  await page.goto("/");

  await expect.poll(async () => (await readDiagnostics(page))?.assets.deskProps).toBe("fallback");
  await expect.poll(async () => (await readDiagnostics(page))?.assets.foliage).toBe("fallback");
  await expect(page.getByTestId("book-desk-scene-canvas")).toBeVisible();
  await expect(page.locator(".book-page")).toBeVisible();
});

test("focuses the loose-leaf notebook without blocking its DOM controls", async ({
  page,
}) => {
  await page.goto("/");

  const scene = page.getByTestId("book-desk-scene");
  const toggle = page.getByTestId("book-focus-toggle");

  await expect(scene).toHaveAttribute("data-focus-mode", "overview");
  await toggle.click();
  await expect(scene).toHaveAttribute("data-focus-mode", "focus");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");

  await page.locator("header input").first().fill("Copic");
  await page.locator("header input").first().press("Enter");
  await expect(page).toHaveURL(/\/library\?q=Copic$/);
  await expect(page.locator(".book-page")).toBeVisible();

  const diagnostics = await readDiagnostics(page);
  expect(diagnostics).toBeDefined();
  expect(diagnostics?.pose).toBe("focus");
  expect(diagnostics?.drawCalls).toBeLessThan(120);
  expect(diagnostics?.triangles).toBeLessThan(250_000);

  await page.keyboard.press("Escape");
  await expect(scene).toHaveAttribute("data-focus-mode", "overview");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
});

test("keeps the 3D scene and book content usable on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const canvas = page.locator('[data-testid="book-desk-scene-canvas"]');
  const bookPage = page.locator(".book-page");

  await expect(canvas).toBeVisible();
  await expect(bookPage).toBeVisible();

  const canvasBox = await canvas.boundingBox();
  const pageBox = await bookPage.boundingBox();

  expect(canvasBox?.width).toBeGreaterThan(300);
  expect(canvasBox?.height).toBeGreaterThan(700);
  expect(pageBox?.width).toBeGreaterThan(180);
  expect(pageBox?.height).toBeGreaterThan(500);

  await page.getByTestId("book-focus-toggle").click();
  await expect(page.getByTestId("book-desk-scene")).toHaveAttribute(
    "data-focus-mode",
    "focus",
  );
  await expect(page.getByTestId("book-surface-stage")).toBeInViewport();
});

test("stops environmental motion when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect
    .poll(async () => (await readDiagnostics(page))?.reducedMotion)
    .toBe(true);

  const before = await readDiagnostics(page);
  await page.waitForTimeout(250);
  const after = await readDiagnostics(page);

  expect(before?.animationActive).toBe(false);
  expect(after?.animationActive).toBe(false);
  expect(after?.motionTick).toBe(before?.motionTick);

  await page.getByTestId("book-focus-toggle").click();
  await expect(page.getByTestId("book-desk-scene")).toHaveAttribute(
    "data-focus-mode",
    "focus",
  );
});

test("redraws async backdrop and imported assets under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect.poll(async () => (await readDiagnostics(page))?.assets.deskProps).toBe("loaded");
  await expect.poll(async () => (await readDiagnostics(page))?.assets.foliage).toBe("loaded");
  await expect
    .poll(async () => (await readDiagnostics(page))?.triangles)
    .toBeGreaterThan(100_000);

  const backdropPixel = await page.getByTestId("book-desk-scene-canvas").evaluate((element) => {
    const canvas = element as HTMLCanvasElement;
    const gl =
      canvas.getContext("webgl2", { preserveDrawingBuffer: true }) ??
      canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) return [0, 0, 0, 0];

    const pixel = new Uint8Array(4);
    gl.readPixels(
      Math.floor(canvas.width * 0.5),
      Math.floor(canvas.height * 0.92),
      1,
      1,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixel,
    );
    return Array.from(pixel);
  });

  expect(Math.max(...backdropPixel.slice(0, 3))).toBeGreaterThan(16);
});

test("keeps navigation, modal, resize, and scene lifecycle healthy", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await expect(page.getByTestId("book-desk-scene-canvas")).toHaveCount(1);

  const navigationTabs = page.locator(".sticky-notes > button");
  await navigationTabs.nth(1).click();
  await expect(page).toHaveURL(/\/overview$/);
  await expect(page.locator(".book-page")).toBeVisible();

  await page.locator("header button").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByTestId("book-desk-scene-canvas")).toHaveCount(1);
  await expect(page.getByTestId("book-surface-stage")).toBeInViewport();

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  await expect(page.getByTestId("book-desk-scene-canvas")).toHaveCount(1);
  await expect(page.getByTestId("book-focus-toggle")).toBeVisible();

  expect(errors).toEqual([]);
});
