import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgeBlockEditorPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgeBlockEditorPage({ params }: AccountWorkspaceKnowledgeBlockEditorPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-pages`);
}
