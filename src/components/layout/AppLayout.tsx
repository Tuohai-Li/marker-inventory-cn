import { Outlet, useLocation } from "react-router";
import { AddMarkerModal } from "@/components/features/AddMarkerModal";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-canvas font-sketch text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-5">
          <div key={location.pathname} className="sketch-page-enter">
            <Outlet />
          </div>
        </main>
      </div>
      <AddMarkerModal />
    </div>
  );
}
