import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgeBaseArticlesPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgeBaseArticlesPage({ params }: AccountWorkspaceKnowledgeBaseArticlesPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-base-articles`);
}
