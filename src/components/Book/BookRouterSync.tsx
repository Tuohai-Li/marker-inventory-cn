import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { bookIndexToPath, pathToBookIndex } from "@/components/Book/bookPages";
import {
  BOOK_FLIP_DURATION_MS,
  getPageFlip,
  syncFlipToIndex,
} from "@/components/Book/bookFlipSync";
import { useBookContext } from "@/contexts/BookContext";

/** 仅精确书页路由使用翻页书（子路由如 /library/:id 走普通 Outlet） */
export function isExactBookRoute(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return pathToBookIndex(normalized) >= 0 && normalized === bookIndexToPath(pathToBookIndex(normalized));
}

export function BookRouterSync() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookRef, setCurrentIndex } = useBookContext();
  const locationRef = useRef(location);
  const skipUrlSyncRef = useRef(false);
  const flipCooldownUntilRef = useRef(0);
  const currentIndexRef = useRef(Math.max(0, pathToBookIndex(location.pathname)));

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const startAnimatedFlip = (targetIndex: number) => {
    const pf = getPageFlip(bookRef);
    if (!pf) return;

    const current = pf.getCurrentPageIndex();
    if (current === targetIndex) return;

    flipCooldownUntilRef.current = Date.now() + BOOK_FLIP_DURATION_MS;
    syncFlipToIndex(bookRef, targetIndex);
  };

  useEffect(() => {
    const onReady = () => {
      flipCooldownUntilRef.current = Date.now() + 600;
      const index = pathToBookIndex(locationRef.current.pathname);
      if (index < 0) return;

      currentIndexRef.current = index;
      setCurrentIndex(index);
      skipUrlSyncRef.current = true;
      syncFlipToIndex(bookRef, index, { instant: true });
    };

    window.addEventListener("book:page-ready", onReady);
    return () => window.removeEventListener("book:page-ready", onReady);
  }, [bookRef, setCurrentIndex]);

  // 翻页完成：同步用户拖拽产生的 URL
  useEffect(() => {
    const handler = (e: Event) => {
      const index = (e as CustomEvent<{ index: number }>).detail.index;
      currentIndexRef.current = index;
      setCurrentIndex(index);

      if (Date.now() < flipCooldownUntilRef.current) {
        return;
      }

      const currentIdx = pathToBookIndex(locationRef.current.pathname);
      if (currentIdx < 0) return;

      if (Math.abs(index - currentIdx) !== 1) {
        return;
      }

      const path = bookIndexToPath(index);
      const currentPath = locationRef.current.pathname.replace(/\/$/, "") || "/";
      const targetPath = path.replace(/\/$/, "") || "/";

      skipUrlSyncRef.current = true;

      if (currentPath !== targetPath) {
        navigate(path);
      }
    };

    window.addEventListener("book:page-flipped", handler);
    return () => window.removeEventListener("book:page-flipped", handler);
  }, [bookRef, navigate, setCurrentIndex]);

  // 浏览器前进/后退 → 动画翻页
  useEffect(() => {
    if (!isExactBookRoute(location.pathname)) return;
    if (skipUrlSyncRef.current) {
      skipUrlSyncRef.current = false;
      return;
    }

    const target = pathToBookIndex(location.pathname);
    if (target < 0) return;

    const current = getPageFlip(bookRef)?.getCurrentPageIndex() ?? currentIndexRef.current;
    if (current === target) return;

    startAnimatedFlip(target);
  }, [bookRef, location.pathname]);

  // 便签 / 边缘按钮 → 先改 URL，再动画翻页
  useEffect(() => {
    const handler = (e: Event) => {
      const path = (e as CustomEvent<{ path: string }>).detail.path;
      const targetIndex = pathToBookIndex(path);

      if (targetIndex < 0 || !isExactBookRoute(path)) {
        navigate(path);
        return;
      }

      const currentPath = locationRef.current.pathname.replace(/\/$/, "") || "/";
      const targetPath = path.replace(/\/$/, "") || "/";

      skipUrlSyncRef.current = true;

      if (currentPath !== targetPath) {
        navigate(path);
      }

      startAnimatedFlip(targetIndex);
    };

    window.addEventListener("book:navigate", handler);
    return () => window.removeEventListener("book:navigate", handler);
  }, [bookRef, navigate]);

  return null;
}

export function navigateWithBookFlip(path: string): void {
  window.dispatchEvent(new CustomEvent("book:navigate", { detail: { path } }));
}
