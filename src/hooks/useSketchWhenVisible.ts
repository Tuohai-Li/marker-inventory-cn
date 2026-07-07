import { useEffect, useState } from "react";

/**
 * StPageFlip 会把非当前页设为 display:none，此时：
 * - CSS 填充淡入动画会卡在 opacity:0
 * - Rough.js 用 getBoundingClientRect 量到 0×0 会跳过绘制
 * 仅在元素真正进入视口后再标记为 visible。
 */
export function useSketchWhenVisible<T extends Element>() {
  const [node, setNode] = useState<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!node || visible) return;

    const reveal = () => setVisible(true);

    const check = () => {
      const { width, height } = node.getBoundingClientRect();
      return width > 0 && height > 0;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && check())) reveal();
      },
      { threshold: 0.01 },
    );
    observer.observe(node);

    const onPageFlipped = () => {
      requestAnimationFrame(() => {
        if (check()) reveal();
      });
    };
    window.addEventListener("book:page-flipped", onPageFlipped);
    window.addEventListener("book:page-ready", onPageFlipped);

    const tryReveal = () => {
      if (check()) reveal();
    };

    tryReveal();
    requestAnimationFrame(tryReveal);
    const retryTimer = window.setTimeout(tryReveal, 120);

    return () => {
      observer.disconnect();
      window.removeEventListener("book:page-flipped", onPageFlipped);
      window.removeEventListener("book:page-ready", onPageFlipped);
      window.clearTimeout(retryTimer);
    };
  }, [node, visible]);

  return { ref: setNode, visible };
}
