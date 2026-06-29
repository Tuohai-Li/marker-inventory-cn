import { useCallback, useEffect, useState } from "react";
import { createMemo, getMemos } from "@/api/settings";
import { subscribeDataChanges } from "@/data/store";

export function useMemos() {
  const [memos, setMemos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setMemos(await getMemos());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => subscribeDataChanges(() => void refresh()), [refresh]);

  const add = useCallback(
    async (text: string) => {
      await createMemo(text);
      await refresh();
    },
    [refresh],
  );

  return { memos, loading, refresh, add };
}
