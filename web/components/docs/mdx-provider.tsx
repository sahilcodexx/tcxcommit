"use client";

import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

interface TocContextType {
  items: { id: string; title: string; level: number }[];
  setItems: (items: { id: string; title: string; level: number }[] | ((prev: { id: string; title: string; level: number }[]) => { id: string; title: string; level: number }[])) => void;
  clearItems: () => void;
}

const TocContext = createContext<TocContextType>({
  items: [],
  setItems: () => {},
  clearItems: () => {},
});

export function useToc() {
  return useContext(TocContext);
}

export function TocProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: string; title: string; level: number }[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    setItems([]);
  }, [pathname]);

  const clearItems = () => setItems([]);

  return (
    <TocContext.Provider value={{ items, setItems, clearItems }}>
      {children}
    </TocContext.Provider>
  );
}
