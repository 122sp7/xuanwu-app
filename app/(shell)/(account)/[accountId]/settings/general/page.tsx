/**
 * /settings/general — redirect to workspace (removed from MVP nav, Occam's Razor)
 */
import { redirect } from "next/navigation";

interface SettingsGeneralPageProps {
  params: {
    accountId: string;
  };
}

export default function SettingsGeneralPage({ params }: SettingsGeneralPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}?tab=Overview&panel=settings`);
}
