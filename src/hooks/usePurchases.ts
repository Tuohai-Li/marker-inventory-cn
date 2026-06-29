import { useCallback, useEffect, useState } from "react";
import type { CreatePurchaseInput } from "@/api/purchases";
import type { PurchaseWithBrand } from "@/types";
import { createPurchase, getPurchases } from "@/api/purchases";
import { computeMonthlySpend } from "@/lib/statistics";
import { subscribeDataChanges } from "@/data/store";

export function usePurchases() {
  const [purchases, setPurchases] = useState<PurchaseWithBrand[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setPurchases(await getPurchases());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => subscribeDataChanges(() => void refresh()), [refresh]);

  const create = useCallback(
    async (data: CreatePurchaseInput) => {
      const purchase = await createPurchase(data);
      await refresh();
      return purchase;
    },
    [refresh],
  );

  const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
  const thisMonthSpend = computeMonthlySpend(purchases);

  return { purchases, loading, refresh, create, totalSpent, thisMonthSpend };
}
