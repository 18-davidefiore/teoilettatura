"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { Home, CalendarDays, Wallet, PawPrint, User } from "lucide-react";
import { cn } from "@/lib/cn";

const items: { href: Route; label: string; Icon: typeof Home }[] = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/prenota", label: "Prenota", Icon: CalendarDays },
  { href: "/wallet", label: "Wallet", Icon: Wallet },
  { href: "/cani", label: "I miei cani", Icon: PawPrint },
  { href: "/profilo", label: "Profilo", Icon: User }
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-5 px-2 pb-[calc(env(safe-area-inset-bottom))] pt-2">
        {items.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] leading-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                isActive ? "text-blue-300" : "text-slate-300 hover:text-slate-50"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-blue-300" : "text-slate-300")} aria-hidden="true" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
