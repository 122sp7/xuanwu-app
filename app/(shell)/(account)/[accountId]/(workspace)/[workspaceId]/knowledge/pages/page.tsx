import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgePagesPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgePagesPage({ params }: AccountWorkspaceKnowledgePagesPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-pages`);
}
