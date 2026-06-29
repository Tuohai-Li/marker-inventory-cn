import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface AddMarkerModalContextValue {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AddMarkerModalContext = createContext<AddMarkerModalContextValue | null>(null);

export function AddMarkerModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({
      open,
      openModal: () => setOpen(true),
      closeModal: () => setOpen(false),
    }),
    [open],
  );

  return (
    <AddMarkerModalContext.Provider value={value}>{children}</AddMarkerModalContext.Provider>
  );
}

export function useAddMarkerModal() {
  const context = useContext(AddMarkerModalContext);
  if (!context) {
    throw new Error("useAddMarkerModal must be used within AddMarkerModalProvider");
  }
  return context;
}
