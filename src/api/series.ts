import type { Series } from "@/types";
import { addSeriesToStore, brandsStore, seriesStore } from "@/data/store";

export type CreateSeriesInput = Omit<Series, "id">;

export async function getSeries(): Promise<Series[]> {
  return [...seriesStore];
}

export async function getSeriesByBrandId(brandId: number): Promise<Series[]> {
  return seriesStore.filter((s) => s.brandId === brandId);
}

export async function createSeries(data: CreateSeriesInput): Promise<Series> {
  if (!brandsStore.some((b) => b.id === data.brandId)) {
    throw new Error("品牌不存在");
  }
  const name = data.name.trim();
  if (!name) throw new Error("系列名称不能为空");
  if (seriesStore.some((s) => s.brandId === data.brandId && s.name === name)) {
    throw new Error("该品牌下已存在同名系列");
  }

  const series: Series = { id: Date.now(), brandId: data.brandId, name };
  addSeriesToStore(series);
  return series;
}
