"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

type Kind = "success" | "error" | "info";
type Toast = { id: number; text: string; kind: Kind };
const Ctx = createContext<(text: string, kind?: Kind) => void>(() => {});

export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((text: string, kind: Kind = "info") => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, text, kind }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3200);
  }, []);
  const Icon = { success: CheckCircle2, error: AlertTriangle, info: Info };
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {items.map((t) => {
          const I = Icon[t.kind];
          return (
            <div key={t.id} className="toast pointer-events-auto flex max-w-md items-center gap-2.5 rounded-xl border border-line bg-panel/95 px-4 py-3 text-sm text-ink shadow-2xl backdrop-blur">
              <I className={`h-4 w-4 shrink-0 ${t.kind === "error" ? "text-red-400" : "text-hood"}`} />
              {t.text}
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}
