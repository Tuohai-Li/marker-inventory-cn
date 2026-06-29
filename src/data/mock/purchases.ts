import type { Purchase } from "@/types";

/** brandId 对应 mockBrands */
export const mockPurchases: Purchase[] = [
  { id: 1, date: "2024-05-19", brandId: 1, items: "B00, R27, E47", qty: 3, amount: 135, note: "线下艺术用品店" },
  { id: 2, date: "2024-05-15", brandId: 3, items: "CG5, BG65, WG1", qty: 3, amount: 54, note: "淘宝旗舰店" },
  { id: 3, date: "2024-05-10", brandId: 4, items: "YG23, YG21, B24", qty: 3, amount: 24, note: "拼多多" },
  { id: 4, date: "2024-04-28", brandId: 1, items: "G05, Y06", qty: 2, amount: 90, note: "日本直邮" },
  { id: 5, date: "2024-04-20", brandId: 3, items: "V05, YR24", qty: 2, amount: 36, note: "京东自营" },
  { id: 6, date: "2024-04-12", brandId: 4, items: "E31, R59 替换套装", qty: 1, amount: 45, note: "官方旗舰店" },
  { id: 7, date: "2024-03-30", brandId: 1, items: "B00 补充墨水", qty: 2, amount: 60, note: "补充墨水 ×2" },
  { id: 8, date: "2024-03-15", brandId: 5, items: "Mixed Set 12色", qty: 1, amount: 120, note: "好奇入手" },
];
