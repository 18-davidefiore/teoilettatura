import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Receipt } from "lucide-react";

export default function MovimentiPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Movimenti</h2>
        <p className="text-sm leading-relaxed text-slate-200">
          Qui compariranno ricariche e consumi con riferimento Stripe e timestamp.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-300">Storico</p>
            <p className="text-lg font-semibold tracking-tight">Nessun movimento</p>
          </div>
          <div className="rounded-2xl bg-slate-950/40 p-3 ring-1 ring-inset ring-slate-800">
            <Receipt className="h-5 w-5 text-blue-300" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-300">Diventa reale quando abilitiamo Stripe e token_transactions.</p>
        </CardContent>
      </Card>
    </div>
  );
}

