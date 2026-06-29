import { createBrowserRouter } from "react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { BrandsPage } from "@/pages/BrandsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { DetailPage } from "@/pages/DetailPage";
import { ExportPage } from "@/pages/ExportPage";
import { InventoryPage } from "@/pages/InventoryPage";
import { LibraryPage } from "@/pages/LibraryPage";
import { OverviewPage } from "@/pages/OverviewPage";
import { PurchasesPage } from "@/pages/PurchasesPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { StatsPage } from "@/pages/StatsPage";
import { WishlistPage } from "@/pages/WishlistPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "overview", element: <OverviewPage /> },
      { path: "library", element: <LibraryPage /> },
      { path: "library/:id", element: <DetailPage /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "brands", element: <BrandsPage /> },
      { path: "purchases", element: <PurchasesPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "stats", element: <StatsPage /> },
      { path: "export", element: <ExportPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
