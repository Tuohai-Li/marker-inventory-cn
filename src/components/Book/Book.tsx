import { type ReactNode } from "react";
import { BookProvider } from "@/contexts/BookContext";

/** 翻页引擎：StPageFlip（react-pageflip-enhanced），直接折真实 HTML */
export interface BookProps {
  children: ReactNode;
  pageCount: number;
}

export function Book({ children, pageCount }: BookProps) {
  return <BookProvider pageCount={pageCount}>{children}</BookProvider>;
}
