"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AccountSettingsGeneralRedirectScreenProps {
  readonly accountId: string;
}

export function AccountSettingsGeneralRedirectScreen({
  accountId,
}: AccountSettingsGeneralRedirectScreenProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${encodeURIComponent(accountId)}?tab=Overview&panel=settings`);
  }, [accountId, router]);

  return (
    <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
      正在導向帳號設定…
    </div>
  );
}