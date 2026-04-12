import { redirect } from "next/navigation";

interface AccountWorkspaceDashboardPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceDashboardPage({ params }: AccountWorkspaceDashboardPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/dashboard`);
}
