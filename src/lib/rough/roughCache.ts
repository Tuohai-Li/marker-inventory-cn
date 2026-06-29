/** Rough.js 静态形状缓存：参数不变则复用已生成的 SVG 节点 */

const shapeCache = new Map<string, Element>();

export function roughCacheKey(
  parts: Record<string, string | number | boolean | undefined | null>,
): string {
  return Object.keys(parts)
    .sort()
    .map((key) => `${key}:${parts[key]}`)
    .join("|");
}

/** 获取缓存节点克隆；未命中时调用 factory 生成并写入缓存 */
export function getOrCloneCachedRoughElement(
  key: string,
  factory: () => Element,
): Element {
  let cached = shapeCache.get(key);
  if (!cached) {
    cached = factory();
    shapeCache.set(key, cached);
  }
  return cached.cloneNode(true) as Element;
}

export function clearRoughCache(key?: string) {
  if (key) shapeCache.delete(key);
  else shapeCache.clear();
}

export function roughCacheSize() {
  return shapeCache.size;
}
