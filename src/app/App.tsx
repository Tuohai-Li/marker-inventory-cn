import { RouterProvider } from "react-router";
import { AddMarkerModalProvider } from "@/contexts/AddMarkerModalContext";
import { router } from "./router";

export default function App() {
  return (
    <AddMarkerModalProvider>
      <RouterProvider router={router} />
    </AddMarkerModalProvider>
  );
}
