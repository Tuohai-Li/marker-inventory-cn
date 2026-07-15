import { useEffect, useRef, useState, type ReactNode } from "react";
import { Focus, Minimize2 } from "lucide-react";
import { createOilScene, OIL_SCENE_CONFIG, type OilSceneController } from "@/three/oilScene";

interface BookDeskSceneProps {
  children: ReactNode;
}

export function BookDeskScene({ children }: BookDeskSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<OilSceneController | null>(null);
  const focusedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = reducedMotion.matches;
    let controller: OilSceneController;

    try {
      controller = createOilScene(canvas, reducedMotion.matches);
      controllerRef.current = controller;
      root.dataset.sceneStatus = "ready";
    } catch (error) {
      root.dataset.sceneStatus = "fallback";
      console.error("Unable to initialize the oil-painting scene", error);
      return;
    }

    let animationFrame = 0;
    let loopActive = false;

    const publishDiagnostics = () => {
      window.__BOOK_SCENE_DIAGNOSTICS__ = controller.getDiagnostics();
    };

    const renderOnce = (time = performance.now()) => {
      controller.render(time);
      publishDiagnostics();
    };

    void controller.ready.then(() => {
      if (controllerRef.current === controller) renderOnce();
    });

    const frame = (time: number) => {
      if (!loopActive) return;
      controller.render(time);
      publishDiagnostics();
      animationFrame = window.requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (loopActive || reducedMotionRef.current || document.hidden) return;
      loopActive = true;
      controller.setAnimationActive(true);
      animationFrame = window.requestAnimationFrame(frame);
    };

    const stopLoop = () => {
      loopActive = false;
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      controller.setAnimationActive(false);
      publishDiagnostics();
    };

    const resize = () => {
      const width = root.clientWidth;
      const height = root.clientHeight;
      if (width < 1 || height < 1) return;
      const cap =
        width <= OIL_SCENE_CONFIG.mobileBreakpoint
          ? OIL_SCENE_CONFIG.maxPixelRatioMobile
          : OIL_SCENE_CONFIG.maxPixelRatioDesktop;
      controller.resize(width, height, Math.min(window.devicePixelRatio || 1, cap));
      renderOnce();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);

    const onPointerMove = (event: PointerEvent) => {
      if (focusedRef.current || reducedMotionRef.current) return;
      const rect = root.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = -(((event.clientY - rect.top) / rect.height - 0.5) * 2);
      controller.setPointer(x, y);
    };

    const onPointerLeave = () => controller.setPointer(0, 0);

    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      controller.setReducedMotion(event.matches);
      controller.setPose(focusedRef.current ? "focus" : "overview", event.matches);
      if (event.matches) {
        stopLoop();
        renderOnce();
      } else {
        startLoop();
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopLoop();
      else if (reducedMotionRef.current) renderOnce();
      else startLoop();
    };

    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave);
    reducedMotion.addEventListener("change", onReducedMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    resize();
    controller.setPose("overview", true);
    if (reducedMotion.matches) {
      controller.setAnimationActive(false);
      renderOnce();
    } else {
      startLoop();
    }

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      reducedMotion.removeEventListener("change", onReducedMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      controller.dispose();
      controllerRef.current = null;
      delete window.__BOOK_SCENE_DIAGNOSTICS__;
    };
  }, []);

  useEffect(() => {
    focusedRef.current = focused;
    const controller = controllerRef.current;
    if (!controller) return;
    controller.setPointer(0, 0);
    controller.setPose(focused ? "focus" : "overview", reducedMotionRef.current);
    if (reducedMotionRef.current) {
      controller.render(performance.now());
      window.__BOOK_SCENE_DIAGNOSTICS__ = controller.getDiagnostics();
    }
  }, [focused]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !focused) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      setFocused(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focused]);

  const label = focused ? "返回窗前场景" : "聚焦活页本";

  return (
    <div
      ref={rootRef}
      data-testid="book-desk-scene"
      data-focus-mode={focused ? "focus" : "overview"}
      data-scene-status="loading"
      className="book-desk-scene"
    >
      <canvas
        ref={canvasRef}
        data-testid="book-desk-scene-canvas"
        className="book-desk-scene-canvas"
        aria-hidden="true"
      />
      <div
        data-testid="book-desk-content"
        data-testid-book-surface="true"
        className="book-desk-content book-surface-stage"
      >
        <div data-testid="book-surface-stage" className="book-surface-stage-inner">
          {children}
        </div>
      </div>
      <button
        type="button"
        data-testid="book-focus-toggle"
        className="book-focus-toggle"
        aria-label={label}
        aria-pressed={focused}
        title={label}
        onClick={() => setFocused((value) => !value)}
      >
        {focused ? <Minimize2 aria-hidden="true" /> : <Focus aria-hidden="true" />}
      </button>
    </div>
  );
}
