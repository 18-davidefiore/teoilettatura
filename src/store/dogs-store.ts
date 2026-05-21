"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type DogSize = "SMALL" | "MEDIUM" | "LARGE" | "GIANT";

export type Dog = {
  id: string;
  name: string;
  breed: string;
  size: DogSize;
  weightKg: number | null;
  notes: string;
};

type DogsState = {
  dogs: Dog[];
  addDog: (dog: Omit<Dog, "id">) => void;
  removeDog: (id: string) => void;
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useDogsStore = create<DogsState>()(
  persist(
    (set) => ({
      dogs: [],
      addDog: (dog) =>
        set((s) => ({
          dogs: [{ ...dog, id: createId() }, ...s.dogs]
        })),
      removeDog: (id) => set((s) => ({ dogs: s.dogs.filter((d) => d.id !== id) }))
    }),
    {
      name: "toilettatura_dogs",
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
