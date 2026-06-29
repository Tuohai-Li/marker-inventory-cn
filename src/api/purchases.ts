import type { Purchase, PurchaseWithBrand } from "@/types";
import { addPurchaseToStore, brandsStore, purchasesStore } from "@/data/store";

export type CreatePurchaseInput = Omit<Purchase, "id">;

function withBrandNames(purchases: Purchase[]): PurchaseWithBrand[] {
  const brandMap = new Map(brandsStore.map((b) => [b.id, b.name]));
  return purchases.map((p) => ({
    ...p,
    brandName: brandMap.get(p.brandId) ?? "未知品牌",
  }));
}

export async function getPurchases(): Promise<PurchaseWithBrand[]> {
  return withBrandNames(purchasesStore);
}

export async function getPurchasesRaw(): Promise<Purchase[]> {
  return [...purchasesStore];
}

export async function createPurchase(data: CreatePurchaseInput): Promise<PurchaseWithBrand> {
  const purchase: Purchase = { ...data, id: Date.now() };
  addPurchaseToStore(purchase);
  return withBrandNames([purchase])[0];
}
