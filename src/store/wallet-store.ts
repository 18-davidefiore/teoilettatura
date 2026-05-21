"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type WalletPackId = "starter" | "premium" | "max";

export type WalletState = {
  balanceCredits: number;
  addCredits: (credits: number) => void;
  spendCredits: (credits: number) => boolean;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      balanceCredits: 0,
      addCredits: (credits) =>
        set((s) => ({ balanceCredits: Math.max(0, Math.round((s.balanceCredits + credits) * 100) / 100) })),
      spendCredits: (credits) => {
        const next = get().balanceCredits - credits;
        if (next < 0) return false;
        set({ balanceCredits: Math.round(next * 100) / 100 });
        return true;
      }
    }),
    {
      name: "toilettatura_wallet",
      storage: createJSONStorage(() => ({
        getItem: (name) => (typeof window === "undefined" ? null : window.localStorage.getItem(name)),
        setItem: (name, value) => {
          if (typeof window !== "undefined") window.localStorage.setItem(name, value);
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") window.localStorage.removeItem(name);
        }
      }))
    }
  )
);

export function estimateMinutesFromCredits(credits: number) {
  return Math.max(0, Math.floor(credits));
}
