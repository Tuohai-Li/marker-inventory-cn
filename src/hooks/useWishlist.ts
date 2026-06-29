import { useCallback, useEffect, useState } from "react";
import {
  addWishToInventory,
  createWish,
  getWishlist,
  removeWish,
  type CreateWishInput,
  type WishItemWithBrand,
} from "@/api/wishlist";
import { subscribeDataChanges } from "@/data/store";

export function useWishlist() {
  const [items, setItems] = useState<WishItemWithBrand[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await getWishlist());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => subscribeDataChanges(() => void refresh()), [refresh]);

  const create = useCallback(
    async (data: CreateWishInput) => {
      const item = await createWish(data);
      await refresh();
      return item;
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: number) => {
      await removeWish(id);
      await refresh();
    },
    [refresh],
  );

  const addToInventory = useCallback(
    async (id: number) => {
      await addWishToInventory(id);
      await refresh();
    },
    [refresh],
  );

  return { items, loading, refresh, create, remove, addToInventory };
}
