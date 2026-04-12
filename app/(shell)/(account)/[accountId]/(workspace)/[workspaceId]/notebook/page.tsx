import { redirect } from "next/navigation";

interface AccountWorkspaceNotebookPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceNotebookPage({ params }: AccountWorkspaceNotebookPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}/notebook/rag-query`);
}
