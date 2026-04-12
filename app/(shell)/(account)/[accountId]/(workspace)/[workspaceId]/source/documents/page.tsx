import { redirect } from "next/navigation";

interface AccountWorkspaceSourceDocumentsPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceSourceDocumentsPage({ params }: AccountWorkspaceSourceDocumentsPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Files`);
}
