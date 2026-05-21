"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tryCreateSupabaseBrowserClient } from "@/lib/supabase/optional";
import { LogIn, Mail, UserPlus } from "lucide-react";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => tryCreateSupabaseBrowserClient(), []);
  const isConfigured = Boolean(supabase);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Usa setTimeout per evitare conflitti con il rendering React in corso
        setTimeout(() => router.replace("/"), 0);
      }
    };
    void checkSession();
  }, [router, supabase]);

  const signIn = async () => {
    if (!supabase) return;
    setMessage(null);
    if (!email || !password) {
      setMessage("Inserisci email e password.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace("/");
    } catch (e: any) {
      setMessage(e?.message ?? "Accesso non riuscito.");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    if (!supabase) return;
    setMessage(null);
    if (!email || !password) {
      setMessage("Inserisci email e password.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.session) {
        router.replace("/");
      } else {
        setMessage("Account creato. Controlla la email per confermare l’accesso.");
      }
    } catch (e: any) {
      setMessage(e?.message ?? "Registrazione non riuscita.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void signIn();
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card>
        <CardHeader className="space-y-1">
          <p className="text-xs font-medium text-slate-300">Accesso</p>
          <p className="text-lg font-semibold tracking-tight">Accedi o crea un account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConfigured ? (
            <div className="rounded-2xl bg-slate-950/40 p-3 text-sm text-slate-200 ring-1 ring-inset ring-slate-800">
              Per abilitare il login serve configurare Supabase in <span className="font-medium">.env.local</span>.
            </div>
          ) : null}

          {message ? (
            <div className="rounded-2xl bg-slate-950/40 p-3 text-sm text-slate-200 ring-1 ring-inset ring-slate-800">
              {message}
            </div>
          ) : null}

          <form 
            className="space-y-4"
            onSubmit={(e) => { e.preventDefault(); void signIn(); }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@email.it"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isConfigured || loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!isConfigured || loading}
              />
            </div>

            <Button className="w-full" variant="primary" type="submit" disabled={!isConfigured || loading}>
              <LogIn className="h-5 w-5" />
              Accedi
            </Button>
          </form>

          <div className="grid gap-2">
            <Button className="w-full" variant="secondary" type="button" onClick={signUp} disabled={!isConfigured || loading}>
              <UserPlus className="h-5 w-5" />
              Crea account
            </Button>
            <Button className="w-full" variant="secondary" type="button" disabled>
              <Mail className="h-5 w-5" />
              Google / Apple (in arrivo)
            </Button>
          </div>

          <p className="text-xs leading-relaxed text-slate-300">
            Intanto puoi tornare al{" "}
            <Link href="/" className="text-blue-200 underline underline-offset-4">
              dashboard
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
