"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, LogIn, UserRound, Phone } from "lucide-react";

export default function ProfiloPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Profilo</h2>
        <p className="text-sm leading-relaxed text-slate-200">
          Gestisci i dati personali e l’accesso. Qui collegheremo Supabase Auth con onboarding a step.
        </p>
      </header>

      <Card>
        <CardHeader className="space-y-1">
          <p className="text-xs font-medium text-slate-300">Account</p>
          <p className="text-lg font-semibold tracking-tight">Non autenticato</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="rounded-2xl bg-slate-950/40 p-4 ring-1 ring-inset ring-slate-800">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-900/60 p-2 ring-1 ring-inset ring-slate-800">
                  <UserRound className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Dati profilo</p>
                  <p className="mt-1 text-xs text-slate-300">Nome, cognome, email</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950/40 p-4 ring-1 ring-inset ring-slate-800">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-900/60 p-2 ring-1 ring-inset ring-slate-800">
                  <Phone className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Telefono</p>
                  <p className="mt-1 text-xs text-slate-300">Contatti rapidi e recupero</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950/40 p-4 ring-1 ring-inset ring-slate-800">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-900/60 p-2 ring-1 ring-inset ring-slate-800">
                  <Shield className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Sicurezza</p>
                  <p className="mt-1 text-xs text-slate-300">OAuth Google/Apple e sessioni</p>
                </div>
              </div>
            </div>
          </div>

          <Link href="/login">
            <Button className="w-full" variant="primary">
              <LogIn className="h-5 w-5" />
              Accedi / Registrati
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
