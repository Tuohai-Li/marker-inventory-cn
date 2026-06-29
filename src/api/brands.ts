import type { Brand, BrandWithStats } from "@/types";
import { addBrand, brandsStore, markersStore, seriesStore } from "@/data/store";
import { computeBrandStats } from "@/lib/statistics";

export type CreateBrandInput = Omit<Brand, "id">;

export async function getBrands(): Promise<Brand[]> {
  return [...brandsStore];
}

export async function getBrandsWithStats(): Promise<BrandWithStats[]> {
  return brandsStore.map((brand) => computeBrandStats(brand, markersStore, seriesStore));
}

export async function getBrandById(id: number): Promise<Brand | undefined> {
  return brandsStore.find((b) => b.id === id);
}

export async function createBrand(data: CreateBrandInput): Promise<BrandWithStats> {
  if (brandsStore.some((b) => b.name === data.name.trim())) {
    throw new Error("品牌名称已存在");
  }
  const brand: Brand = { ...data, id: Date.now(), name: data.name.trim() };
  addBrand(brand);
  return computeBrandStats(brand, markersStore, seriesStore);
}
