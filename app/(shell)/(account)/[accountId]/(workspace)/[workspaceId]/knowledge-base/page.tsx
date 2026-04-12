import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgeBasePageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgeBasePage({ params }: AccountWorkspaceKnowledgeBasePageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-base-articles`);
}
