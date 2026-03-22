"use client";

import { useRouter } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { NamespacePrototypeView } from "@/modules/namespace";
import { Button } from "@ui-shadcn/ui/button";

export default function WikiBetaNamespacesPage() {
  const router = useRouter();
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const organizationId = appState.activeAccount?.id ?? "demo-organization";
  const ownerAccountId = authState.user?.id ?? "demo-owner";

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Wiki Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Namespace Prototype</h1>
        <p className="text-sm text-muted-foreground">
          先建立 namespace 雛型，後續頁面樹與路由都以這層 scope/slug 作為基礎。
        </p>
      </header>

      <Button variant="outline" onClick={() => router.push("/wiki-beta")}>返回 Wiki Beta</Button>

      <NamespacePrototypeView organizationId={organizationId} ownerAccountId={ownerAccountId} />
    </div>
  );
}
