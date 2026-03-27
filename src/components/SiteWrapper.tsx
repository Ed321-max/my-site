'use client';

import { LenisProvider } from '../contexts/LenisContext';

export default function SiteWrapper({ children }: { children: React.ReactNode }) {
  return <LenisProvider>{children}</LenisProvider>;
}
