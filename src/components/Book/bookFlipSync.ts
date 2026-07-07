import type { BookFlipRef } from "@/contexts/BookContext";
import type { PageFlipInstance } from "react-pageflip-enhanced";

/** StPageFlip flippingTime in BookFlipBook (ms) */
export const BOOK_FLIP_DURATION_MS = 780;

export function getPageFlip(bookRef: BookFlipRef): PageFlipInstance | null {
  return bookRef.current?.pageFlip?.() ?? null;
}

/**
 * 同步书页索引（带动画）：
 * - 相邻向前：flipNext（底页自然为下一页）
 * - 跨页向前：flip(target) — 预设 spread 后 flipNext，底页即目标页
 * - 相邻向后：flipPrev
 * - 跨页向后：flip(target) — 预设 spread 后 flipPrev，底页即目标页
 * - instant：初始化 / 无动画跳转
 */
export function syncFlipToIndex(
  bookRef: BookFlipRef,
  targetIndex: number,
  options: { instant?: boolean } = {},
): "noop" | "instant" | "forward" | "backward" {
  const pf = getPageFlip(bookRef);
  if (!pf) return "noop";

  const current = pf.getCurrentPageIndex();
  if (current === targetIndex) return "noop";

  if (options.instant) {
    pf.turnToPage(targetIndex);
    return "instant";
  }

  if (targetIndex > current) {
    if (targetIndex === current + 1) {
      pf.flipNext();
    } else {
      // StPageFlip flipToPage：先定位到 target-1 spread，再 flipNext，底页 = target
      pf.flip(targetIndex);
    }
    return "forward";
  }

  if (targetIndex === current - 1) {
    pf.flipPrev();
  } else {
    // StPageFlip flipToPage：先定位到 target+1 spread，再 flipPrev，底页 = target
    pf.flip(targetIndex);
  }
  return "backward";
}
