import type { Marker } from "@/types";

/** brandId 对应 mockBrands：1=Copic Sketch, 3=Touch 3代, 4=Ohuhu 系列 */
export const mockMarkers: Marker[] = [
  { id: 1, brandId: 1, code: "B00", name: "Frost Blue", color: "#c8e8f4", stock: 2, borrowed: 0, price: 45, addDate: "2024-05-19", series: "B", notes: "最常用的天蓝色，手绘天空必备" },
  { id: 2, brandId: 3, code: "CG5", name: "Cool Grey 5", color: "#9ca3af", stock: 1, borrowed: 0, price: 18, addDate: "2024-05-18", series: "CG" },
  { id: 3, brandId: 4, code: "YG23", name: "New Leaf", color: "#86c67c", stock: 3, borrowed: 0, price: 8, addDate: "2024-05-18", series: "YG" },
  { id: 4, brandId: 1, code: "R27", name: "Cadmium Red", color: "#e87070", stock: 1, borrowed: 1, price: 45, addDate: "2024-05-17", series: "R" },
  { id: 5, brandId: 3, code: "YR24", name: "Pale Sepia", color: "#f9c98c", stock: 2, borrowed: 0, price: 18, addDate: "2024-05-17", series: "YR" },
  { id: 6, brandId: 1, code: "E47", name: "Dark Brown", color: "#b08040", stock: 2, borrowed: 0, price: 45, addDate: "2024-05-16", series: "E" },
  { id: 7, brandId: 4, code: "YG21", name: "Anise", color: "#a8d896", stock: 3, borrowed: 0, price: 8, addDate: "2024-05-16", series: "YG" },
  { id: 8, brandId: 3, code: "BG65", name: "Blue Grey", color: "#7ba7bc", stock: 1, borrowed: 0, price: 18, addDate: "2024-05-15", series: "BG" },
  { id: 9, brandId: 1, code: "R59", name: "Cardinal", color: "#c8404a", stock: 1, borrowed: 0, price: 45, addDate: "2024-05-14", series: "R" },
  { id: 10, brandId: 3, code: "WG1", name: "Warm Grey 1", color: "#d4c8b8", stock: 2, borrowed: 0, price: 18, addDate: "2024-05-14", series: "WG" },
  { id: 11, brandId: 1, code: "Y06", name: "Yellow", color: "#fce060", stock: 2, borrowed: 0, price: 45, addDate: "2024-05-13", series: "Y" },
  { id: 12, brandId: 4, code: "B24", name: "Cornflower", color: "#7aa8d0", stock: 4, borrowed: 0, price: 8, addDate: "2024-05-13", series: "B" },
  { id: 13, brandId: 3, code: "V05", name: "Violet", color: "#9880c8", stock: 1, borrowed: 0, price: 18, addDate: "2024-05-12", series: "V" },
  { id: 14, brandId: 1, code: "G05", name: "Emerald Green", color: "#5aaa70", stock: 3, borrowed: 0, price: 45, addDate: "2024-05-12", series: "G" },
  { id: 15, brandId: 4, code: "E31", name: "Brick Beige", color: "#e8c898", stock: 2, borrowed: 0, price: 8, addDate: "2024-05-11", series: "E" },
];
