import { useCallback, useEffect, useState } from "react";
import type { BrandWithStats } from "@/types";
import { createBrand, getBrandsWithStats, type CreateBrandInput } from "@/api/brands";
import { subscribeDataChanges } from "@/data/store";

export function useBrands() {
  const [brands, setBrands] = useState<BrandWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setBrands(await getBrandsWithStats());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => subscribeDataChanges(() => void refresh()), [refresh]);

  const create = useCallback(
    async (data: CreateBrandInput) => {
      const brand = await createBrand(data);
      await refresh();
      return brand;
    },
    [refresh],
  );

  return { brands, loading, refresh, create };
}
