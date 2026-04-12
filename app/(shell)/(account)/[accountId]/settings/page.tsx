import { redirect } from "next/navigation";

interface SettingsPageProps {
  params: {
    accountId: string;
  };
}

export default function SettingsPage({ params }: SettingsPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}?tab=Overview&panel=settings`);
}

