import type { WishItem } from "@/types";
import {
  addWishToStore,
  brandsStore,
  removeWishFromStore,
  wishlistStore,
} from "@/data/store";
import { createMarker } from "./markers";

export type WishItemWithBrand = WishItem & { brandName: string };

export type CreateWishInput = Omit<WishItem, "id">;

function withBrandNames(items: WishItem[]): WishItemWithBrand[] {
  const brandMap = new Map(brandsStore.map((b) => [b.id, b.name]));
  return items.map((w) => ({
    ...w,
    brandName: brandMap.get(w.brandId) ?? "未知品牌",
  }));
}

export async function getWishlist(): Promise<WishItemWithBrand[]> {
  return withBrandNames(wishlistStore);
}

export async function createWish(data: CreateWishInput): Promise<WishItemWithBrand> {
  const item: WishItem = { ...data, id: Date.now() };
  addWishToStore(item);
  return withBrandNames([item])[0];
}

export async function removeWish(id: number): Promise<void> {
  removeWishFromStore(id);
}

export async function addWishToInventory(id: number): Promise<void> {
  const item = wishlistStore.find((w) => w.id === id);
  if (!item) throw new Error("心愿项不存在");

  const series = item.code.replace(/[0-9]/g, "") || "-";

  await createMarker({
    brandId: item.brandId,
    code: item.code,
    name: item.name,
    color: item.color,
    stock: 1,
    borrowed: 0,
    price: item.price,
    addDate: new Date().toISOString().slice(0, 10),
    series,
  });

  removeWishFromStore(id);
}
