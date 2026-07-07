import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import type HTMLFlipBook from "react-pageflip-enhanced";

export interface PageSize {
  width: number;
  height: number;
}

export type BookFlipRef = MutableRefObject<ComponentRef<typeof HTMLFlipBook> | null>;

interface BookContextValue {
  pageCount: number;
  currentIndex: number;
  pageSize: PageSize | null;
  bookRef: BookFlipRef;
  setPageSize: (size: PageSize) => void;
  setCurrentIndex: (index: number) => void;
}

const BookContext = createContext<BookContextValue | null>(null);

export function BookProvider({
  children,
  pageCount,
}: {
  children: ReactNode;
  pageCount: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pageSize, setPageSizeState] = useState<PageSize | null>(null);
  const bookRef = useRef<ComponentRef<typeof HTMLFlipBook>>(null);

  const setPageSize = useCallback((size: PageSize) => {
    setPageSizeState((prev) =>
      prev && prev.width === size.width && prev.height === size.height ? prev : size,
    );
  }, []);

  const value = useMemo<BookContextValue>(
    () => ({
      pageCount,
      currentIndex,
      pageSize,
      bookRef,
      setPageSize,
      setCurrentIndex,
    }),
    [pageCount, currentIndex, pageSize, setPageSize],
  );

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

export function useBookContext(): BookContextValue {
  const ctx = useContext(BookContext);
  if (!ctx) {
    throw new Error("useBookContext must be used within BookProvider");
  }
  return ctx;
}
