import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router";
import { bookIndexToPath, pathToBookIndex } from "@/components/Book/bookPages";
import { navigateWithBookFlip } from "@/components/Book/BookRouterSync";
import { useBookContext } from "@/contexts/BookContext";

export function BookGestures() {
  const location = useLocation();
  const { pageCount } = useBookContext();
  const currentIndex = Math.max(0, pathToBookIndex(location.pathname));

  const flipByClick = (dir: 1 | -1) => {
    const to = currentIndex + dir;
    if (to < 0 || to >= pageCount) return;
    navigateWithBookFlip(bookIndexToPath(to));
  };

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < pageCount - 1;

  return (
    <>
      {canPrev && (
        <button
          type="button"
          aria-label="翻到上一页"
          className="book-edge-hotzone left-0"
          title="翻到上一页"
          onClick={() => flipByClick(-1)}
        >
          <ChevronLeft className="book-edge-hint" size={22} strokeWidth={2.5} />
        </button>
      )}
      {canNext && (
        <button
          type="button"
          aria-label="翻到下一页"
          className="book-edge-hotzone right-0"
          title="翻到下一页"
          onClick={() => flipByClick(1)}
        >
          <ChevronRight className="book-edge-hint" size={22} strokeWidth={2.5} />
        </button>
      )}
    </>
  );
}
