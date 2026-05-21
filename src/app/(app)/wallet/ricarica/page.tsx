import { Suspense } from "react";
import { RicaricaClient } from "@/app/(app)/wallet/ricarica/ricarica-client";
import type { WalletPackId } from "@/store/wallet-store";

export default async function RicaricaPage({ searchParams }: { searchParams?: Promise<{ pack?: string }> }) {
  const resolved = await searchParams;
  const pack = (resolved?.pack as WalletPackId | undefined) ?? "starter";

  return (
    <Suspense>
      <RicaricaClient pack={pack} />
    </Suspense>
  );
}
