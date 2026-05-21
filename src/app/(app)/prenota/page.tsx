import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, LayoutGrid } from "lucide-react";

export default function PrenotaPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Prenota</h2>
        <p className="text-sm leading-relaxed text-slate-200">
          Calendario multi-postazione in tempo reale. Qui arriverà la vista a colonne con selezione giorno.
        </p>
      </header>

      <Card>
        <CardHeader className="space-y-1">
          <p className="text-xs font-medium text-slate-300">Anteprima UI</p>
          <p className="text-lg font-semibold tracking-tight">Selettore giorno</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["Oggi", "Domani", "Sab", "Dom", "Lun", "Mar"].map((label) => (
              <button
                key={label}
                className="h-11 shrink-0 rounded-xl bg-slate-950/40 px-4 text-sm font-medium text-slate-100 ring-1 ring-inset ring-slate-800 hover:bg-slate-950/70"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl bg-slate-950/40 p-4 ring-1 ring-inset ring-slate-800">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-blue-300" />
                  <p className="text-sm font-semibold">Postazioni</p>
                </div>
                <span className="text-xs text-slate-300">Live</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                La griglia a colonne e la validazione anti-overlap vengono abilitate nella fase Booking Engine.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950/40 p-4 ring-1 ring-inset ring-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-300" />
                <p className="text-sm font-semibold">Countdown</p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Qui mostriamo “inizia tra X minuti” con aggiornamenti realtime.
              </p>
            </div>
          </div>

          <Link href="/prenota/nuova">
            <Button className="w-full" variant="primary">
              <CalendarDays className="h-5 w-5" />
              Scegli data e orario
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
