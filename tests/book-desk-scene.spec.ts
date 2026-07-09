import { expect, test } from "@playwright/test";

test("renders the 3D desk scene behind the existing interactive book", async ({ page }) => {
  await page.goto("/");

  const scene = page.locator('[data-testid="book-desk-scene"]');
  const canvas = page.locator('[data-testid="book-desk-scene-canvas"]');
  const content = page.locator('[data-testid="book-desk-content"]');

  await expect(scene).toBeVisible();
  await expect(canvas).toBeVisible();
  await expect(content).toBeVisible();
  await expect(page.locator(".book-page")).toBeVisible();

  await expect(canvas).toHaveCSS("pointer-events", "none");
  await expect(canvas).toHaveAttribute("aria-hidden", "true");

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
});
