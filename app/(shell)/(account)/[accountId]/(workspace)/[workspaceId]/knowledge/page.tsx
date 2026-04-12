import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgePageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgePage({ params }: AccountWorkspaceKnowledgePageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-pages`);
}
