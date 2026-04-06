'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface LenisInstance {
  raf: (time: number) => void;
  on: (event: string, callback: Function) => void;
  off: (event: string, callback: Function) => void;
  scrollTo: (target: string | number, options?: object) => void;
  destroy: () => void;
}

interface LenisContextValue {
  lenis: LenisInstance | null;
  scrollTo: (target: string | number, options?: object) => void;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollTo: () => {},
});

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<LenisInstance | null>(null);

  useEffect(() => {
    setLenis((window as any).__lenis || null);
  }, []);

  const scrollTo = (target: string | number, options?: object) => {
    if ((window as any).__lenisScrollTo) {
      (window as any).__lenisScrollTo(target, options);
    }
  };

  return (
    <LenisContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenis() {
  return useContext(LenisContext);
}
