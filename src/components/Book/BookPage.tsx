import { forwardRef, type ReactNode } from "react";

/** StPageFlip 要求的页面容器（必须 forwardRef） */
export const BookPage = forwardRef<
  HTMLDivElement,
  { children: ReactNode; pageWidth: number; pageHeight: number }
>(function BookPage({ children, pageWidth, pageHeight }, ref) {
  return (
    <div
      ref={ref}
      className="book-flip-page overflow-hidden bg-canvas"
      style={{ width: pageWidth, height: pageHeight }}
    >
      <div className="book-scroll h-full overflow-y-auto">
        <div className="mx-auto max-w-[880px] p-5">{children}</div>
      </div>
    </div>
  );
});
