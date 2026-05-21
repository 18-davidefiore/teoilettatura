"use client";

import Link from "next/link";
import { CreditCard, CalendarDays, PawPrint, UserRound, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { estimateMinutesFromCredits, useWalletStore } from "@/store/wallet-store";

export default function HomeClient() {
  const balanceCredits = useWalletStore((s) => s.balanceCredits);
  const minutes = estimateMinutesFromCredits(balanceCredits);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Benvenuto</h2>
        <p className="text-sm leading-relaxed text-slate-200">
          Prenota una postazione, gestisci i crediti e attiva la sessione in sede con QR/PIN. Tutto ottimizzato per
          smartphone.
        </p>
      </section>

      <Card className="overflow-hidden">
        <CardHeader className="space-y-1">
          <p className="text-xs font-medium text-slate-300">Wallet</p>
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold tracking-tight">Saldo crediti</p>
            <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-200 ring-1 ring-inset ring-blue-500/30">
              Demo UI
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-950/40 p-3 ring-1 ring-inset ring-slate-800">
              <p className="text-xs text-slate-300">Crediti</p>
              <p className="mt-1 text-2xl font-semibold">{balanceCredits}</p>
            </div>
            <div className="rounded-xl bg-slate-950/40 p-3 ring-1 ring-inset ring-slate-800">
              <p className="text-xs text-slate-300">Minuti stimati</p>
              <p className="mt-1 text-2xl font-semibold">{minutes}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link className="flex-1" href="/wallet">
              <Button className="w-full" variant="primary">
                <CreditCard className="h-5 w-5" />
                Ricarica crediti
              </Button>
            </Link>
            <Link className="flex-1" href="/prenota">
              <Button className="w-full" variant="secondary">
                <CalendarDays className="h-5 w-5" />
                Prenota
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-2 gap-3">
        <Link href="/prenota" className="block">
          <Card className="h-full">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Prenota</p>
                  <p className="mt-1 text-xs text-slate-300">Seleziona giorno e postazione</p>
                </div>
                <CalendarDays className="h-5 w-5 text-blue-300" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/wallet" className="block">
          <Card className="h-full">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Wallet</p>
                  <p className="mt-1 text-xs text-slate-300">Acquisti e movimenti</p>
                </div>
                <CreditCard className="h-5 w-5 text-blue-300" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/cani" className="block">
          <Card className="h-full">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">I miei cani</p>
                  <p className="mt-1 text-xs text-slate-300">Schede e foto</p>
                </div>
                <PawPrint className="h-5 w-5 text-blue-300" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/profilo" className="block">
          <Card className="h-full">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Profilo</p>
                  <p className="mt-1 text-xs text-slate-300">Dati e accesso</p>
                </div>
                <UserRound className="h-5 w-5 text-blue-300" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-blue-500/15 p-2 ring-1 ring-inset ring-blue-500/30">
              <Sparkles className="h-5 w-5 text-blue-200" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">Esperienza mobile-first</p>
              <p className="text-xs leading-relaxed text-slate-300">
                Pulsanti grandi, contrasto alto, navigazione in basso e flussi guidati. Il resto lo costruiamo a fasi
                (auth, booking real-time, wallet Stripe, kiosk).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

