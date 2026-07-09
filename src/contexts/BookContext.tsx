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
  settledIndex: number;
  settledVersion: number;
  pageSize: PageSize | null;
  bookRef: BookFlipRef;
  setPageSize: (size: PageSize) => void;
  setCurrentIndex: (index: number) => void;
  setSettledPage: (index: number) => void;
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
  const [settledIndex, setSettledIndex] = useState(0);
  const [settledVersion, setSettledVersion] = useState(0);
  const [pageSize, setPageSizeState] = useState<PageSize | null>(null);
  const bookRef = useRef<ComponentRef<typeof HTMLFlipBook>>(null);

  const setPageSize = useCallback((size: PageSize) => {
    setPageSizeState((prev) =>
      prev && prev.width === size.width && prev.height === size.height ? prev : size,
    );
  }, []);

  const setSettledPage = useCallback((index: number) => {
    setSettledIndex(index);
    setSettledVersion((version) => version + 1);
  }, []);

  const value = useMemo<BookContextValue>(
    () => ({
      pageCount,
      currentIndex,
      settledIndex,
      settledVersion,
      pageSize,
      bookRef,
      setPageSize,
      setCurrentIndex,
      setSettledPage,
    }),
    [
      pageCount,
      currentIndex,
      settledIndex,
      settledVersion,
      pageSize,
      setPageSize,
      setSettledPage,
    ],
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
