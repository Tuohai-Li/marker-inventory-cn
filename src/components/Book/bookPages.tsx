import { navigation } from "@/config/navigation";

/** 书页顺序与右侧便签导航完全一致 */
export const BOOK_PAGE_ROUTES = navigation.map(({ path, label }) => ({ path, label }));

/** Returns -1 for routes that are not part of the book. */
export function pathToBookIndex(pathname: string): number {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const exact = BOOK_PAGE_ROUTES.findIndex((r) => r.path === normalized);
  if (exact >= 0) return exact;

  // 子路由（如 /library/:id）归入对应书页
  for (let i = 0; i < BOOK_PAGE_ROUTES.length; i++) {
    const base = BOOK_PAGE_ROUTES[i].path;
    if (base !== "/" && normalized.startsWith(`${base}/`)) {
      return i;
    }
  }

  return -1;
}

export function bookIndexToPath(index: number): string {
  return BOOK_PAGE_ROUTES[index]?.path ?? "/";
}

export const BOOK_PAGE_COUNT = BOOK_PAGE_ROUTES.length;
