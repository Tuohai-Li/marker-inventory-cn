import { createContext, useContext, type ReactNode } from "react";

const BookPageIndexContext = createContext<number | null>(null);

export function BookPageIndexProvider({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  return (
    <BookPageIndexContext.Provider value={index}>
      {children}
    </BookPageIndexContext.Provider>
  );
}

export function useBookPageIndex(): number | null {
  return useContext(BookPageIndexContext);
}
