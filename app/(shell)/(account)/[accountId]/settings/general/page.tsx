"use client";

/**
 * /settings/general — redirect to workspace (removed from MVP nav, Occam's Razor)
 */
import { AccountSettingsGeneralRedirectScreen } from "@/modules/workspace/api";

interface SettingsGeneralPageProps {
  params: {
    accountId: string;
  };
}

export default function SettingsGeneralPage({ params }: SettingsGeneralPageProps) {
  return <AccountSettingsGeneralRedirectScreen accountId={params.accountId} />;
}
