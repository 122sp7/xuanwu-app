import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgeDatabasePageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgeDatabasePage({ params }: AccountWorkspaceKnowledgeDatabasePageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-databases`);
}
