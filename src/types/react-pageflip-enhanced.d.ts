declare module "react-pageflip-enhanced" {
  import type { ComponentRef, ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";

  export interface PageFlipInstance {
    getCurrentPageIndex(): number;
    flip(pageNum: number, corner?: "top" | "bottom"): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    turnToPage(pageNum: number): void;
  }

  export interface HTMLFlipBookProps extends HTMLAttributes<HTMLDivElement> {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    singlePage?: boolean;
    usePortrait?: boolean;
    drawShadow?: boolean;
    maxShadowOpacity?: number;
    flippingTime?: number;
    swipeDistance?: number;
    disableFlipByClick?: boolean;
    cornerHitSize?: number;
    showCover?: boolean;
    autoSize?: boolean;
    renderOnlyPageLengthChange?: boolean;
    startPage?: number;
    className?: string;
    style?: React.CSSProperties;
    onFlip?: (e: { data: number }) => void;
    onChangeState?: (e: { data: "user_fold" | "fold_corner" | "flipping" | "read" }) => void;
    onInit?: (e: { data: { page: number; mode: string } }) => void;
    children?: ReactNode;
  }

  export interface HTMLFlipBookRef {
    pageFlip(): PageFlipInstance | undefined;
  }

  const HTMLFlipBook: ForwardRefExoticComponent<
    HTMLFlipBookProps & RefAttributes<HTMLFlipBookRef>
  >;

  export type HTMLFlipBook = ComponentRef<typeof HTMLFlipBook>;
  export default HTMLFlipBook;
}
