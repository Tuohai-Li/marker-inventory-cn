import { useEffect, useRef, useState } from "react";
import { useBookContext } from "@/contexts/BookContext";
import { useBookPageIndex } from "@/contexts/BookPageContext";

/**
 * StPageFlip 会把非当前页设为 display:none，此时：
 * - CSS 填充淡入动画会卡在 opacity:0
 * - Rough.js 用 getBoundingClientRect 量到 0×0 会跳过绘制
 * 仅在元素真正进入视口后再标记为 visible。
 */
export function useSketchWhenVisible<T extends Element>() {
  const [node, setNode] = useState<T | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [revealKey, setRevealKey] = useState(0);
  const revealFrameRef = useRef<number | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const lastRevealVersionRef = useRef<number | null>(null);
  const pageIndex = useBookPageIndex();
  const { settledIndex, settledVersion } = useBookContext();
  const isCurrentPage = pageIndex === null || pageIndex === settledIndex;
  const revealVersion = pageIndex === null ? 0 : settledVersion;

  useEffect(() => {
    const cancelRevealFrame = () => {
      if (revealFrameRef.current !== null) {
        window.cancelAnimationFrame(revealFrameRef.current);
        revealFrameRef.current = null;
      }
    };

    const cancelRetryTimer = () => {
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };

    if (!isCurrentPage) {
      cancelRevealFrame();
      cancelRetryTimer();
      setRevealed(false);
      return;
    }

    if (!node) return;

    const check = () => {
      const { width, height } = node.getBoundingClientRect();
      return width > 0 && height > 0;
    };

    const reveal = (version: number) => {
      if (lastRevealVersionRef.current === version) return;

      cancelRevealFrame();
      cancelRetryTimer();
      lastRevealVersionRef.current = version;
      setRevealed(false);
      setRevealKey((key) => key + 1);
      revealFrameRef.current = window.requestAnimationFrame(() => {
        revealFrameRef.current = null;
        if (check()) setRevealed(true);
      });
    };

    const tryReveal = (attempt = 0) => {
      if (lastRevealVersionRef.current === revealVersion) return;
      if (check()) {
        reveal(revealVersion);
        return;
      }
      if (attempt >= 12) return;
      cancelRetryTimer();
      retryTimerRef.current = window.setTimeout(() => tryReveal(attempt + 1), 32);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          tryReveal();
        }
      },
      { threshold: 0.01 },
    );
    observer.observe(node);

    tryReveal();

    return () => {
      cancelRevealFrame();
      cancelRetryTimer();
      observer.disconnect();
    };
  }, [isCurrentPage, node, revealVersion]);

  return { ref: setNode, visible: revealed && isCurrentPage, revealKey };
}
