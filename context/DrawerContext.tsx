import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLayoutMode } from "../lib/layout";

type DrawerContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** True when drawer is always visible (desktop sidebar) */
  persistent: boolean;
};

const DrawerContext = createContext<DrawerContextType | null>(null);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const { drawerPersistent } = useLayoutMode();
  const [isOpen, setIsOpen] = useState(drawerPersistent);

  useEffect(() => {
    setIsOpen(drawerPersistent);
  }, [drawerPersistent]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    if (!drawerPersistent) setIsOpen(false);
  }, [drawerPersistent]);
  const toggle = useCallback(() => {
    if (drawerPersistent) return;
    setIsOpen((v) => !v);
  }, [drawerPersistent]);

  const value = useMemo(
    () => ({
      isOpen: drawerPersistent || isOpen,
      open,
      close,
      toggle,
      persistent: drawerPersistent,
    }),
    [isOpen, open, close, toggle, drawerPersistent]
  );

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used within DrawerProvider");
  return ctx;
}
