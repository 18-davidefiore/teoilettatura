"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "lg" | "md";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ className, variant = "primary", size = "lg", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "lg" ? "h-12 px-4 text-base" : "h-10 px-3 text-sm",
        variant === "primary" && "bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-600",
        variant === "secondary" &&
          "bg-slate-900/70 text-slate-50 ring-1 ring-inset ring-slate-800 hover:bg-slate-900 active:bg-slate-950",
        variant === "ghost" && "bg-transparent text-slate-100 hover:bg-slate-900/60 active:bg-slate-900",
        className
      )}
      {...props}
    />
  );
}

