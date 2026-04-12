import { redirect } from "next/navigation";

interface AccountWorkspaceSourceLibrariesPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceSourceLibrariesPage({ params }: AccountWorkspaceSourceLibrariesPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=source-libraries`);
}
