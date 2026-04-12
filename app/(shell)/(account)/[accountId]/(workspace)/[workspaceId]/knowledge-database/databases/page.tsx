import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgeDatabasesPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgeDatabasesPage({ params }: AccountWorkspaceKnowledgeDatabasesPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-databases`);
}
