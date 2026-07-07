import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import HTMLFlipBook from "react-pageflip-enhanced";
import { BookPage } from "@/components/Book/BookPage";
import { BookPageContent } from "@/components/Book/BookPageContent";
import { BOOK_PAGE_COUNT } from "@/components/Book/bookPages";
import { pathToBookIndex } from "@/components/Book/bookPages";
import { useBookContext } from "@/contexts/BookContext";

/** 仅首屏使用；后续翻页由 BookRouterSync 控制，避免 startPage 变化触发 turnToPage */
function useInitialBookPage(): number {
  const location = useLocation();
  const initialRef = useRef<number | null>(null);
  if (initialRef.current === null) {
    initialRef.current = Math.max(0, pathToBookIndex(location.pathname));
  }
  return initialRef.current;
}

/**
 * 基于 https://github.com/marvellousPtc/react-pageflip （StPageFlip）
 * - 直接翻真实 HTML，无 html2canvas / Three.js
 * - singlePage + size=fixed：stretch 会把单页宽度压成容器一半
 */
export function BookFlipBook() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { bookRef, setPageSize, setCurrentIndex } = useBookContext();
  const startPage = useInitialBookPage();
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const sync = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      if (width < 1 || height < 1) return;

      setDimensions((prev) =>
        prev?.width === width && prev?.height === height ? prev : { width, height },
      );
      setPageSize({ width, height });
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [setPageSize]);

  const bookPages = useMemo(
    () =>
      dimensions
        ? Array.from({ length: BOOK_PAGE_COUNT }, (_, index) => (
            <BookPage
              key={index}
              pageWidth={dimensions.width}
              pageHeight={dimensions.height}
            >
              <BookPageContent index={index} />
            </BookPage>
          ))
        : [],
    [dimensions],
  );

  return (
    <div ref={containerRef} className="book-st-pageflip-host">
      {dimensions ? (
        <HTMLFlipBook
          key={`${dimensions.width}x${dimensions.height}`}
          ref={bookRef}
          className="book-st-pageflip"
          style={{ width: "100%", height: "100%" }}
          width={dimensions.width}
          height={dimensions.height}
          size="fixed"
          autoSize={false}
          singlePage
          usePortrait={false}
          drawShadow
          maxShadowOpacity={0.35}
          flippingTime={780}
          swipeDistance={30}
          showCover={false}
          renderOnlyPageLengthChange
          startPage={startPage}
          onFlip={(e) => {
            const index = typeof e.data === "number" ? e.data : Number(e.data);
            setCurrentIndex(index);
            window.dispatchEvent(
              new CustomEvent("book:page-flipped", { detail: { index } }),
            );
          }}
          onInit={() => {
            window.dispatchEvent(new CustomEvent("book:page-ready"));
          }}
        >
          {bookPages}
        </HTMLFlipBook>
      ) : null}
    </div>
  );
}
