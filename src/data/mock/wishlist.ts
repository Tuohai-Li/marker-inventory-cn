import type { WishItem } from "@/types";

/** brandId 对应 mockBrands */
export const mockWishlist: WishItem[] = [
  { id: 1, brandId: 1, code: "E95", name: "Flesh Pink", color: "#f4c4a8", price: 45, priority: "high" },
  { id: 2, brandId: 1, code: "E97", name: "Deep Orange", color: "#f4906a", price: 45, priority: "high" },
  { id: 3, brandId: 3, code: "B95", name: "Light Blue", color: "#a0c8e8", price: 18, priority: "medium" },
  { id: 4, brandId: 4, code: "P03", name: "Pale Pink", color: "#f0c8d8", price: 8, priority: "low" },
  { id: 5, brandId: 2, code: "G28", name: "Ocean Green", color: "#4aaa84", price: 32, priority: "medium" },
];
